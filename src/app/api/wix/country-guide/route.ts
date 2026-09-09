import { NextResponse } from 'next/server';
import { COUNTRY_GUIDES, CountryGuideData } from '@/data/countryGuides';

// In-memory cache for ultra-fast performance
let cachedGuides: Record<string, CountryGuideData> = { ...COUNTRY_GUIDES };
let lastFetchTime = 0;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchFromWixCMS(): Promise<Record<string, Partial<CountryGuideData>> | null> {
  const wixApiKey = process.env.WIX_API_KEY;
  const wixSiteId = process.env.WIX_SITE_ID;

  if (!wixApiKey || !wixSiteId) {
    return null;
  }

  const targetCollections = ['country-guides', 'CountryGuides', 'visa-guides', 'CountryGuide'];
  const headers = {
    Authorization: wixApiKey,
    'wix-site-id': wixSiteId,
    'Content-Type': 'application/json',
  };

  for (const colId of targetCollections) {
    try {
      const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dataCollectionId: colId,
          query: { paging: { limit: 100 } },
        }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const items = data.dataItems || data.items || [];
      if (items.length > 0) {
        const result: Record<string, Partial<CountryGuideData>> = {};
        for (const item of items) {
          const d = item.data || item;
          const slug = (d.slug || d.countryCode || d.title || '').toLowerCase().trim();
          if (slug) {
            // Parse JSON fields or delimited string lists from CMS / Google Sheets
            let admissionRequirements = d.admissionRequirements;
            if (typeof admissionRequirements === 'string') {
              try {
                admissionRequirements = JSON.parse(admissionRequirements);
              } catch {
                // If stored as pipe-separated or separate flat columns
              }
            }
            if (!admissionRequirements && d.acad_qual) {
              admissionRequirements = {
                academicQualification: { title: 'ACADEMIC QUALIFICATION', value: d.acad_qual, badge: d.acad_qual_badge || 'Typical' },
                academicBenchmark: { title: 'ACADEMIC BENCHMARK', value: d.acad_bench, badge: d.acad_bench_badge || 'Competitive' },
                englishRequirement: { title: 'ENGLISH REQUIREMENT', value: d.eng_req, badge: d.eng_req_badge || 'Program Specific' },
                applicationRequirement: { title: 'APPLICATION REQUIREMENT', value: d.app_req, badge: d.app_req_badge || 'Varies' },
                majorIntakes: { title: 'MAJOR INTAKES', value: d.major_intakes_adm, badge: d.major_intakes_badge || 'Typical' },
              };
            }

            let testsAndExams = d.testsAndExams;
            if (typeof testsAndExams === 'string') {
              try {
                testsAndExams = JSON.parse(testsAndExams);
              } catch {
                // Parse pipe delimited: "Test Name; Score; Validity; Requirement | Test 2..."
                testsAndExams = testsAndExams.split('|').map((part: string) => {
                  const [test, score, validity, requirement] = part.split(';').map((s: string) => s.trim());
                  let badgeVariant: any = 'required';
                  const reqLower = (requirement || '').toLowerCase();
                  if (reqLower.includes('specific')) badgeVariant = 'specific';
                  else if (reqLower.includes('optional') || reqLower.includes('not')) badgeVariant = 'optional';
                  return { test, score, validity, requirement, badgeVariant };
                });
              }
            }

            let visaProcess = d.visaProcess;
            if (typeof visaProcess === 'string') {
              try {
                visaProcess = JSON.parse(visaProcess);
              } catch {
                // Parse pipe delimited: "01: Title: Description | 02: Title: Description"
                visaProcess = visaProcess.split('|').map((part: string) => {
                  const [step, title, desc] = part.split(':').map((s: string) => s.trim());
                  return { step: step || '01', title: title || '', desc: desc || '' };
                });
              }
            }

            let costOfStudy = d.costOfStudy;
            if (typeof costOfStudy === 'string') {
              try {
                costOfStudy = JSON.parse(costOfStudy);
              } catch {}
            }
            if (!costOfStudy && (d.cost_tuition || d.tuition)) {
              costOfStudy = {
                tuition: d.cost_tuition || d.tuition || '',
                livingExpenses: d.cost_living || d.livingCost || '',
                healthInsurance: d.cost_health || '',
                visaApplication: d.cost_visa || '',
                proofOfFunds: d.cost_funds || '',
              };
            }

            let workAndPostStudy = d.workAndPostStudy;
            if (typeof workAndPostStudy === 'string') {
              try {
                workAndPostStudy = JSON.parse(workAndPostStudy);
              } catch {}
            }
            if (!workAndPostStudy && (d.work_part_time || d.work_post_study)) {
              workAndPostStudy = {
                partTimeWork: typeof d.work_part_time === 'string' ? d.work_part_time.split('|').map((s: string) => s.trim()) : d.work_part_time || [],
                postStudyWork: typeof d.work_post_study === 'string' ? d.work_post_study.split('|').map((s: string) => s.trim()) : d.work_post_study || [],
              };
            }

            let documents = d.documents;
            if (typeof documents === 'string') {
              try {
                documents = JSON.parse(documents);
              } catch {}
            }
            if (!documents && (d.docs_university || d.docs_financial_visa)) {
              const parseDocList = (str: string) => {
                if (!str) return [];
                return str.split('|').map((item: string) => {
                  const match = item.match(/^(.*?)\s*\((.*?)\)$/);
                  const name = match ? match[1].trim() : item.trim();
                  const status = match ? match[2].trim() : 'Required';
                  let badgeVariant: any = 'required';
                  const stLower = status.toLowerCase();
                  if (stLower.includes('usually')) badgeVariant = 'usually';
                  else if (stLower.includes('specific')) badgeVariant = 'specific';
                  else if (stLower.includes('country')) badgeVariant = 'country';
                  else if (stLower.includes('optional')) badgeVariant = 'optional';
                  return { name, status, badgeVariant };
                });
              };
              documents = {
                universityApplication: typeof d.docs_university === 'string' ? parseDocList(d.docs_university) : d.docs_university || [],
                financialAndVisa: typeof d.docs_financial_visa === 'string' ? parseDocList(d.docs_financial_visa) : d.docs_financial_visa || [],
              };
            }

            let timeline = d.timeline;
            if (typeof timeline === 'string') {
              try {
                timeline = JSON.parse(timeline);
              } catch {
                timeline = timeline.split('|').map((part: string) => {
                  const [step, title, desc, time] = part.split(':').map((s: string) => s.trim());
                  return { step: step || '01', title: title || '', desc: desc || '', time: time || '' };
                });
              }
            }

            let whyStudyHere = d.whyStudyHere;
            if (typeof whyStudyHere === 'string') {
              try {
                whyStudyHere = JSON.parse(whyStudyHere);
              } catch {
                whyStudyHere = whyStudyHere.split('|').map((part: string) => {
                  const [num, text] = part.split(':').map((s: string) => s.trim());
                  return { num: num || '01', text: text || part.trim() };
                });
              }
            }

            let goodToKnow = d.goodToKnow;
            if (typeof goodToKnow === 'string') {
              try {
                goodToKnow = JSON.parse(goodToKnow);
              } catch {
                goodToKnow = goodToKnow.split('|').map((s: string) => s.trim());
              }
            }

            result[slug] = {
              slug,
              countryName: d.countryName || d.title,
              heroDescription: d.heroDescription || d.description,
              heroImage: d.heroImage || d.image,
              heroBadgeText: d.heroBadgeText,
              heroFacts: d.heroFacts || {
                tuition: d.tuition,
                livingCost: d.livingCost,
                englishBenchmark: d.englishBenchmark,
                studentVisa: d.studentVisa,
              },
              whyStudyHere: whyStudyHere || undefined,
              quickFacts: d.quickFacts || undefined,
              admissionRequirements: admissionRequirements || undefined,
              testsAndExams: testsAndExams || undefined,
              visaProcess: visaProcess || undefined,
              costOfStudy: costOfStudy || undefined,
              workAndPostStudy: workAndPostStudy || undefined,
              documents: documents || undefined,
              timeline: timeline || undefined,
              goodToKnow: goodToKnow || undefined,
              lastVerified: d.lastVerified,
              source: d.source,
            };
          }
        }
        return result;
      }
    } catch {
      // Continue to next collection
    }
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug')?.toLowerCase().trim();

  const now = Date.now();
  if (now - lastFetchTime > CACHE_TTL) {
    try {
      const cmsData = await fetchFromWixCMS();
      if (cmsData) {
        const merged: Record<string, CountryGuideData> = { ...COUNTRY_GUIDES };
        for (const [key, value] of Object.entries(cmsData)) {
          if (merged[key]) {
            merged[key] = { ...merged[key], ...value } as CountryGuideData;
          } else {
            merged[key] = value as CountryGuideData;
          }
        }
        cachedGuides = merged;
      }
    } catch {
      // Fallback to local data
    }
    lastFetchTime = now;
  }

  if (slug) {
    const guide = cachedGuides[slug] || COUNTRY_GUIDES[slug];
    if (!guide) {
      return NextResponse.json({ error: 'Country guide not found' }, { status: 404 });
    }
    return NextResponse.json({ data: guide });
  }

  return NextResponse.json({
    data: Object.values(cachedGuides),
    count: Object.keys(cachedGuides).length,
  });
}
