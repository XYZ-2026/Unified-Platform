import { NextResponse } from 'next/server';

function formatWixImageUrl(url: any): string {
  if (!url) return '';
  if (typeof url !== 'string') {
    if (url.url) return formatWixImageUrl(url.url);
    if (url.src) return formatWixImageUrl(url.src);
    return '';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('wix:image://v1/')) {
    const match = trimmed.match(/^wix:image:\/\/v1\/([^\/#]+)/);
    if (match && match[1]) {
      return `https://static.wixstatic.com/media/${match[1]}`;
    }
  }
  return trimmed;
}

function extractBannerAndAlt(d: any): { bannerImage: string; bannerAlt: string } {
  if (!d) return { bannerImage: '', bannerAlt: '' };

  const rawImage =
    d.bannerImage ??
    d.universityBanner ??
    d['university banner'] ??
    d['university-banner'] ??
    d.university_banner ??
    d.universityBanner_1 ??
    d.banner ??
    d.university_image ??
    '';

  let rawUrl = '';
  let embeddedAlt = '';

  if (typeof rawImage === 'string') {
    rawUrl = rawImage;
  } else if (rawImage && typeof rawImage === 'object') {
    rawUrl = rawImage.url || rawImage.src || '';
    embeddedAlt = rawImage.altText || rawImage.alt || rawImage.description || '';
  }

  const rawAlt =
    d.bannerImageAltText ||
    d.bannerAlt ||
    d.universityBannerAltText ||
    d['university banner alt'] ||
    d.university_banner_alt_text ||
    d.altText ||
    embeddedAlt ||
    (d.university_name || d.name ? `${d.university_name || d.name} Campus Banner` : 'University Campus Banner');

  return {
    bannerImage: formatWixImageUrl(rawUrl),
    bannerAlt: typeof rawAlt === 'string' ? rawAlt.trim() : 'University Campus Banner',
  };
}

const FALLBACK_UNIVERSITIES: Record<string, any> = {
  'massachusetts-institute-of-technology': {
    id: 'mit-us',
    universityId: 'mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    countryCode: 'US',
    state: 'Massachusetts',
    qsRanking: '1',
    tuition: '$57,986/yr',
    livingCosts: '$2,500/mo',
    acceptanceRate: '4%',
    website: 'https://web.mit.edu',
    bannerAlt: 'MIT Campus',
    popularMajors: ['Computer Science', 'Artificial Intelligence', 'Robotics', 'Physics', 'Electrical Engineering'],
    slug: 'massachusetts-institute-of-technology',
    avgGpa: 3.96,
    satScore: '1540-1580',
    avgNeedBasedGrant: '$53,400',
    requiredEssayPromptsDetails: 'MIT Short Answers (225 words each):\n1. Describe the world you come from; for example, your family, clubs, school, or community.\n2. How has your experience shaped your dreams and aspirations?\n3. Tell us about a time when you had to deal with a challenge or setback.\n4. Describe a topic, idea, or concept that you find so engaging that it makes you lose all track of time.',
    writingRequirements: 'MIT requires 5 short answer essays (200-250 words each) in place of the Common App personal statement.',
    careerOutcomes: 'Employment/Grad Placement: 95% within 6 months of graduation',
    expectedSalary: '$115,000–$165,000/yr (median ~$130,000)',
    roi: '840% (Exceptional)',
  },
  'stanford-university': {
    id: 'stanford-us',
    universityId: 'stanford',
    name: 'Stanford University',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    qsRanking: '2',
    tuition: '$56,169/yr',
    livingCosts: '$2,800/mo',
    acceptanceRate: '4%',
    website: 'https://stanford.edu',
    bannerAlt: 'Stanford Quad',
    popularMajors: ['Computer Science & AI', 'Business Administration', 'Data Science', 'Biomedical Engineering'],
    slug: 'stanford-university',
    avgGpa: 3.95,
    satScore: '1500-1570',
    avgNeedBasedGrant: '$58,000',
    requiredEssayPromptsDetails: 'Stanford Short Essays (250 words max):\n1. The Stanford community is deeply curious and driven to learn. What idea or topic excites you?\n2. Virtually all of Stanford undergraduates live on campus. Write a note to your future roommate.\n3. Tell us about something that is meaningful to you and why.',
    writingRequirements: '3 short essays (100-250 words) + 5 short answer questions (50 words max).',
    careerOutcomes: 'Employment/Grad Placement: 94% within 6 months of graduation',
    expectedSalary: '$112,000–$160,000/yr (median ~$128,000)',
    roi: '820% (Exceptional)',
  },
  'harvard-university': {
    id: 'harvard-us',
    universityId: 'harvard',
    name: 'Harvard University',
    country: 'United States',
    countryCode: 'US',
    state: 'Massachusetts',
    qsRanking: '4',
    tuition: '$54,768/yr',
    livingCosts: '$2,600/mo',
    acceptanceRate: '4%',
    website: 'https://harvard.edu',
    bannerAlt: 'Harvard Yard',
    popularMajors: ['Business (MBA)', 'Economics', 'Law (JD)', 'Government & Policy', 'Computer Science'],
    slug: 'harvard-university',
    avgGpa: 4.0,
    satScore: '1510-1580',
    avgNeedBasedGrant: '$62,000',
    requiredEssayPromptsDetails: 'Harvard Supplemental Prompts (200 words each):\n1. How will your experiences at Harvard contribute to your future goals?\n2. Describe a personal experience that has shaped your perspective.\n3. Briefly describe any intellectual experience that has meant the most to you.',
    writingRequirements: 'Harvard Supplemental Essays: 5 short prompts (200 words max each).',
    careerOutcomes: 'Employment/Grad Placement: 93% within 6 months of graduation',
    expectedSalary: '$105,000–$155,000/yr (median ~$122,000)',
    roi: '790% (Exceptional)',
  },
  'imperial-college-london': {
    id: 'imperial-uk',
    universityId: 'imperial',
    name: 'Imperial College London',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '2',
    tuition: '£32,000/yr',
    livingCosts: '£2,200/mo',
    acceptanceRate: '14%',
    website: 'https://imperial.ac.uk',
    bannerAlt: 'Imperial College London',
    popularMajors: ['Computing & Software Engineering', 'Aeronautical Engineering', 'Biomedical Science', 'Finance'],
    slug: 'imperial-college-london',
    avgGpa: 3.85,
    satScore: '1450+',
    avgNeedBasedGrant: '£5,000',
    requiredEssayPromptsDetails: 'UCAS Personal Statement (4,000 characters max):\n1. Why are you applying for this course at Imperial?\n2. What academic skills or research projects have prepared you?\n3. What relevant super-curricular activities have you undertaken?',
    writingRequirements: 'UCAS Personal Statement required for all UK applications.',
    careerOutcomes: 'Employment/Grad Placement: 92% within 6 months of graduation',
    expectedSalary: '£45,000–£70,000/yr (median ~£55,000)',
    roi: '520% (Very Good)',
  },
  'university-of-oxford': {
    id: 'oxford-uk',
    universityId: 'oxford',
    name: 'University of Oxford',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '3',
    tuition: '£26,770/yr',
    livingCosts: '£1,400/mo',
    acceptanceRate: '18%',
    website: 'https://ox.ac.uk',
    bannerAlt: 'Radcliffe Camera Oxford',
    popularMajors: ['Philosophy, Politics & Economics (PPE)', 'Medicine', 'Law', 'Computer Science'],
    slug: 'university-of-oxford',
    avgGpa: 3.9,
    satScore: '1470+',
    avgNeedBasedGrant: '£6,500',
    requiredEssayPromptsDetails: 'UCAS Personal Statement + Written Work:\n1. 80% focus on academic interest and reading in your chosen subject.\n2. 20% focus on relevant extracurricular achievements.',
    writingRequirements: 'UCAS Personal Statement + Subject-specific written tests (MAT, TSA, LNAT).',
    careerOutcomes: 'Employment/Grad Placement: 91% within 6 months of graduation',
    expectedSalary: '£42,000–£68,000/yr (median ~£52,000)',
    roi: '510% (Very Good)',
  },
  'acadia-university': {
    id: 'acadia-ca',
    universityId: 'CA-INST-001',
    name: 'Acadia University',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Nova Scotia',
    qsRanking: '#42 Canada (uniRank; not QS)',
    tuition: 'International: CA$28,000–38,000/yr; Domestic: CA$5,500–9,000/yr',
    livingCosts: 'CA$11,000–15,000/yr (housing ~CA$7,500; meals & transit ~CA$4,500)',
    acceptanceRate: 'Approximately 70% (unverified)',
    website: 'https://www.acadiau.ca',
    domain: 'acadiau.ca',
    bannerImage: 'https://www.unirank.org/i/screenshots/acadia-university-ca-website-screenshot.jpg',
    bannerAlt: "Acadia University's website homepage screenshot",
    popularMajors: ['Computer Science', 'Software Engineering', 'Business Administration', 'Commerce', 'Nursing', 'Mechanical Engineering', 'Data Science', 'Psychology', 'Biomedical Sciences', 'Economics', 'Digital Media'],
    slug: 'acadia-university',
    avgGpa: 3.2,
    satScore: 'Generally optional; 1280–1480 estimated for US applicants (verify)',
    avgNeedBasedGrant: 'CA$5,000–12,000/yr (unverified estimate)',
    dliNumber: 'O19209939222',
    internationalEligible: 'Yes; study permit and PGWP subject to current eligibility requirements',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'No (verify)',
    languageOfInstruction: 'English',
    requiredEssayPromptsDetails: 'Acadia University Essay Prompts:\n1. 1–2 essays of 250–500 words on leadership, extracurricular involvement, and academic goals.\n2. Interviews may apply to some programs.\nVerify current requirements at acadiau.ca.',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 per band) or TOEFL iBT 88–100; additional statement may be required for certain programs.',
    careerOutcomes: '92%–96% employment within six months (original estimate); sectors: technology, banking, healthcare, and engineering. Verify official statistics.',
    expectedSalary: 'CA$62,000–88,000/yr starting salary; CA$95,000+ for CS and engineering graduates (unverified estimates)',
    roi: 'High ROI; estimated 3–4 year break-even period. Actual ROI depends on costs, financial aid, employment, salary, and immigration eligibility.',
    scholarships: 'Entrance merit scholarships: CA$2,000–10,000/yr; International President\'s Excellence Award: CA$15,000–40,000; need-based bursaries and work-study options subject to eligibility.',
    totalCost: 'CA$42,000/yr; CA$168,000 over four years (estimates; reconcile with tuition and living costs)',
  },
  'university-of-toronto': {
    id: 'toronto-ca',
    universityId: 'utoronto',
    name: 'University of Toronto',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Ontario',
    qsRanking: '21',
    tuition: 'CA$38,000/yr',
    livingCosts: 'CA$2,500/mo',
    acceptanceRate: '43%',
    website: 'https://utoronto.ca',
    bannerAlt: 'University of Toronto St George',
    popularMajors: ['Computer Science', 'Rotman Commerce', 'Applied Science & Engineering', 'Biomedical Science'],
    slug: 'university-of-toronto',
    avgGpa: 3.8,
    satScore: '1380+',
    avgNeedBasedGrant: 'CA$12,000',
    requiredEssayPromptsDetails: 'U of T Supplemental Applications (Rotman & Engineering):\n1. Describe a project or activity where you demonstrated leadership.\n2. Video response: 2 timed video questions on problem-solving.',
    writingRequirements: 'Online supplemental portal for Engineering and Rotman Commerce.',
    careerOutcomes: 'Employment/Grad Placement: 89% within 6 months of graduation',
    expectedSalary: 'CA$68,000–CA$95,000/yr (median ~CA$82,000)',
    roi: '480% (Very Good)',
  },
  'technical-university-of-munich': {
    id: 'tum-de',
    universityId: 'tum',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    countryCode: 'DE',
    state: 'Bavaria',
    qsRanking: '28',
    tuition: '€0 (Tuition Free)',
    livingCosts: '€1,200/mo',
    acceptanceRate: '24%',
    website: 'https://tum.de',
    bannerAlt: 'TUM Munich Gate',
    popularMajors: ['Informatics & AI', 'Automotive Engineering', 'Robotics & Systems', 'Management & Technology'],
    slug: 'technical-university-of-munich',
    avgGpa: 3.7,
    satScore: 'N/A',
    avgNeedBasedGrant: '€0',
    requiredEssayPromptsDetails: 'Motivation Letter (1-2 pages):\n1. Why do you wish to study this specific program at TUM?\n2. What academic background qualifies you for advanced study in Munich?',
    writingRequirements: 'Statement of Motivation in English/German + Aptitude assessment.',
    careerOutcomes: 'Employment/Grad Placement: 93% within 6 months of graduation',
    expectedSalary: '€55,000–€80,000/yr (median ~€65,000)',
    roi: '920% (Exceptional)',
  },
  'university-of-melbourne': {
    id: 'melbourne-au',
    universityId: 'unimelb',
    name: 'University of Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    state: 'Victoria',
    qsRanking: '13',
    tuition: 'AUD$38,000/yr',
    livingCosts: 'AUD$2,200/mo',
    acceptanceRate: '70%',
    website: 'https://unimelb.edu.au',
    bannerAlt: 'University of Melbourne Quad',
    popularMajors: ['Melbourne Business School', 'Medicine', 'Law', 'Computer Science', 'Biomedicine'],
    slug: 'university-of-melbourne',
    avgGpa: 3.7,
    satScore: '1350+',
    avgNeedBasedGrant: 'AUD$10,000',
    requiredEssayPromptsDetails: 'Personal Statement (500 words):\n1. Outline your academic background and professional aspirations in Australia.',
    writingRequirements: 'Statement of Purpose for international applicants.',
    careerOutcomes: 'Employment/Grad Placement: 88% within 6 months of graduation',
    expectedSalary: 'AUD$75,000–AUD$105,000/yr (median ~AUD$88,000)',
    roi: '460% (Very Good)',
  },
};

import {
  fetchCanadianUniversitiesFromWix,
  fetchGermanyUniversitiesFromWix,
  toCleanSlug,
} from '@/lib/wixCountryUniversities';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = toCleanSlug(slug);

    let found: any = null;

    // 1. Check connected Canadian Universities from Wix Studio CMS
    try {
      const canadaUnis = await fetchCanadianUniversitiesFromWix();
      const matchedCa = canadaUnis.find((u) => {
        const uSlug = toCleanSlug(u.institutionName);
        const idSlug = toCleanSlug(u.institutionId);
        return uSlug === cleanSlug || idSlug === cleanSlug || cleanSlug.includes(idSlug) || uSlug.includes(cleanSlug);
      });

      if (matchedCa) {
        const majorsArray = (matchedCa.popularMajors || '')
          .split(',')
          .map((m: string) => m.trim())
          .filter(Boolean);

        found = {
          id: `ca-${matchedCa.institutionId.toLowerCase()}`,
          universityId: matchedCa.institutionId,
          name: matchedCa.institutionName,
          country: 'Canada',
          countryCode: 'CA',
          state: matchedCa.province,
          province: matchedCa.province,
          city: matchedCa.city,
          qsRanking: matchedCa.qsRanking || '#Top Canadian University',
          tuition: matchedCa.tuition,
          livingCosts: matchedCa.livingCosts,
          acceptanceRate: matchedCa.acceptanceRate,
          website: matchedCa.officialWebsite,
          bannerImage: matchedCa.bannerImage,
          bannerAlt: matchedCa.bannerImageAlt,
          popularMajors: majorsArray,
          slug: cleanSlug,
          avgGpa: matchedCa.avgGpa || '3.2 / 4.0',
          satScore: matchedCa.satScore || 'Optional / Not Required for Canadian Applicants',
          avgNeedBasedGrant: matchedCa.avgNeedBasedGrant,
          requiredEssayPromptsDetails: matchedCa.requiredEssayPrompts,
          writingRequirements: matchedCa.writingRequirements,
          careerOutcomes: matchedCa.careerOutcomes,
          expectedSalary: matchedCa.expectedSalary,
          roi: matchedCa.roi,
          scholarships: matchedCa.scholarships,
          type: matchedCa.publicPrivate || matchedCa.institutionType || 'Public',
          dliNumber: matchedCa.dliNumber,
          internationalEligible: matchedCa.internationalStudentEligible,
        };
      }
    } catch (err) {
      console.warn('Wix Canada slug lookup notice:', err);
    }

    // 2. Check connected Germany Universities from Wix Studio CMS
    if (!found) {
      try {
        const germanyUnis = await fetchGermanyUniversitiesFromWix();
        const matchedDe = germanyUnis.find((u) => {
          const uSlug = toCleanSlug(u.universityName);
          const uCity = toCleanSlug(u.city);
          return uSlug === cleanSlug || uSlug.includes(cleanSlug) || cleanSlug.includes(uCity) || cleanSlug.includes(uSlug);
        });

        if (matchedDe) {
          found = {
            id: `de-${cleanSlug}`,
            universityId: `DE-${cleanSlug}`,
            name: matchedDe.universityName,
            country: 'Germany',
            countryCode: 'DE',
            state: matchedDe.federalState,
            province: matchedDe.federalState,
            city: matchedDe.city,
            qsRanking: matchedDe.ranking || '#Top German University',
            tuition: matchedDe.bwTuitionFee?.toLowerCase().startsWith('yes') ? '€1,500/semester (Non-EU BW)' : '€0 (Tuition Free Public University)',
            livingCosts: matchedDe.blockedAccountProofOfFunds ? `${matchedDe.blockedAccountProofOfFunds} (Blocked Account)` : '€992/month',
            acceptanceRate: (matchedDe.ncNumerusClausus?.toLowerCase().startsWith('yes') || matchedDe.ncGradeCutoff) ? 'NC Restricted' : 'Open Admission',
            website: matchedDe.website,
            bannerImage: '',
            bannerAlt: `${matchedDe.universityName} Campus`,
            popularMajors: ['Informatics & Computer Science', 'Mechanical Engineering', 'Natural Sciences', 'Medicine & Life Sciences'],
            slug: cleanSlug,
            avgGpa: 'Class 12 > 70% + Studienkolleg (FSP)',
            satScore: 'Not Required / APS Certificate Mandatory',
            avgNeedBasedGrant: 'DAAD Scholarships (€934/month)',
            requiredEssayPromptsDetails: `Admissions Protocol for ${matchedDe.universityName}:\n1. APS Certificate: ${matchedDe.apsCertificateRequired || 'Mandatory for Indian Applicants'}\n2. HZB Requirement: ${matchedDe.hzb}\n3. Studienkolleg: ${matchedDe.studienkollegRequired}\n4. Application Channel: ${matchedDe.uniAssistApplication}`,
            writingRequirements: matchedDe.germanLanguageRequirement,
            careerOutcomes: '18-Month Post-Study Job Seeker Visa with EU Blue Card accelerated pathway',
            expectedSalary: '€55,000–€82,000/yr starting salary (€90,000+ for STEM & Tech)',
            roi: 'Exceptional ROI (€0 tuition, low cost of living, world-renowned German engineering hub)',
            scholarships: 'DAAD Scholarships, Deutschlandstipendium (€300/mo), Erasmus+ grants',
            type: matchedDe.universityType || 'Public',
            ncNumerusClausus: matchedDe.ncNumerusClausus,
            ncGradeCutoff: matchedDe.ncGradeCutoff,
            hzb: matchedDe.hzb,
            studienkollegRequired: matchedDe.studienkollegRequired,
            apsCertificateRequired: matchedDe.apsCertificateRequired,
            uniAssistApplication: matchedDe.uniAssistApplication,
            hochschulstartApplication: matchedDe.hochschulstartApplication,
            semesterContribution: matchedDe.semesterContribution,
            semesterTicket: matchedDe.semesterTicket,
            bwTuitionFee: matchedDe.bwTuitionFee,
            ectsRequirements: matchedDe.ectsRequirements,
            germanLanguageRequirement: matchedDe.germanLanguageRequirement,
            testDaF: matchedDe.testDaF,
            dsh: matchedDe.dsh,
            blockedAccountProofOfFunds: matchedDe.blockedAccountProofOfFunds,
            winterSemester: matchedDe.winterSemester,
            summerSemester: matchedDe.summerSemester,
            indianQualificationEquivalency: matchedDe.indianQualificationEquivalency,
            anabinRecognition: matchedDe.anabinRecognition,
            countrySpecificRequirements: matchedDe.countrySpecificRequirements,
          };
        }
      } catch (err) {
        console.warn('Wix Germany slug lookup notice:', err);
      }
    }


    // 3. Check Wix US Universities (Import2)
    if (!found) {
      try {
        const wixApiKey = process.env.WIX_API_KEY;
        const wixSiteId = process.env.WIX_SITE_ID;
        if (wixApiKey && wixSiteId) {
          const words = cleanSlug.split('-').filter((w) => w.length > 2);
          const searchTerm = words.slice(0, 2).join(' ');

          const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
            method: 'POST',
            headers: {
              'Authorization': wixApiKey,
              'wix-site-id': wixSiteId,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dataCollectionId: 'Import2',
              query: {
                filter: {
                  university_name: { '$contains': searchTerm },
                },
                paging: { limit: 10 },
              },
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const items = data.dataItems || [];
            const matched = items.find((item: any) => {
              const d = item.data || item;
              const s = toCleanSlug(d.university_name || '');
              return s === cleanSlug || s.includes(cleanSlug) || cleanSlug.includes(s);
            });

            if (matched) {
              const d = matched.data || matched;
              const majorsRaw = d.popularMajors || '';
              const majorsArray = majorsRaw
                .split(',')
                .map((m: string) => m.trim())
                .filter(Boolean);
              const { bannerImage, bannerAlt } = extractBannerAndAlt(d);

              found = {
                id: d._id || matched.id,
                universityId: d.university_id || cleanSlug,
                name: d.university_name,
                country: d.country || 'United States',
                countryCode: d.country_code || 'US',
                state: d.state_province || '',
                province: d.state_province || '',
                city: d.city || '',
                qsRanking: d.qsRanking || 'Top 100',
                tuition: d.tution || '$35,000/yr',
                livingCosts: d.livingCosts || '$1,800/mo',
                acceptanceRate: d.acceptanceRate || 'N/A',
                website: d.official_website || '',
                bannerImage,
                bannerAlt,
                popularMajors: majorsArray.length > 0 ? majorsArray.slice(0, 8) : ['Computer Science', 'Business', 'Engineering'],
                allMajors: majorsArray,
                slug: cleanSlug,
                type: 'Public',
                careerOutcomes: d.careerOutcomes || d.career_outcomes || '92% employment within 6 months',
                expectedSalary: d.expectedSalary || d.expected_salary || '$75,000–$110,000/yr',
                roi: d.roi || 'High ROI',
                scholarships: d.scholarships || 'Merit and Need-Based Scholarships Available',
                avgNeedBasedGrant: d.avgNeedBasedGrant || '$24,500/yr Avg',
                avgGpa: d.avgGpa || '3.6+',
                satScore: d.satScore || 'Optional / 1350+',
              };
            }
          }
        }
      } catch (err) {
        console.warn('Wix US slug lookup notice:', err);
      }
    }

    // 4. Fallback database
    if (!found && FALLBACK_UNIVERSITIES[cleanSlug]) {
      found = FALLBACK_UNIVERSITIES[cleanSlug];
    }


    // If still not found, return generic matching template instead of error
    if (!found) {
      const formattedName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      found = {
        id: slug,
        universityId: slug,
        name: formattedName,
        country: 'Global Partner',
        countryCode: 'US',
        state: '',
        qsRanking: 'Top 100',
        tuition: '$35,000/yr',
        livingCosts: '$1,800/mo',
        acceptanceRate: '25%',
        website: `https://${slug}.edu`,
        bannerAlt: formattedName,
        popularMajors: ['Computer Science', 'Business & Management', 'Engineering', 'Data Science'],
        slug,
        avgGpa: 3.8,
        satScore: '1350+',
        avgNeedBasedGrant: '$20,000',
        requiredEssayPromptsDetails: 'Personal Statement (500 words):\n1. Why are you applying to this program and how will it fulfill your academic goals?',
        writingRequirements: 'Standard Statement of Purpose (SOP) required.',
        careerOutcomes: '',
        expectedSalary: '',
        roi: '',
        scholarships: '',
      };
    }

    // Parse majors
    const majorsRaw = found.popularMajors || [];
    const majorsArray = Array.isArray(majorsRaw)
      ? majorsRaw
      : majorsRaw.split(',').map((m: string) => m.trim()).filter(Boolean);

    const { bannerImage, bannerAlt } = extractBannerAndAlt(found);

    const university = {
      ...found,
      id: found.id || found._id || slug,
      universityId: found.university_id || found.universityId || slug,
      name: found.university_name || found.name || 'University',
      country: found.country || 'Global Partner',
      countryCode: found.country_code || found.countryCode || 'US',
      state: found.state_province || found.state || found.province || '',
      city: found.city || '',
      qsRanking: found.qsRanking || 'Top 100',
      tuition: found.tution || found.tuition || '$35,000/yr',
      livingCosts: found.livingCosts || '$1,800/mo',
      acceptanceRate: found.acceptanceRate || '25%',
      website: found.official_website || found.website || '',
      bannerImage,
      bannerAlt,
      popularMajors: majorsArray,
      slug,
      avgGpa: found.avgGpa ?? 3.7,
      satScore: found.satScore || '1350+',
      avgNeedBasedGrant: found.avgNeedBasedGrant || '$15,000',
      requiredEssayPromptsDetails: found.requiredEssayPromptsDetails || '',
      writingRequirements: found.writingRequirements || '',
      careerOutcomes: found.careerOutcomes || found.career_outcomes || '',
      expectedSalary: found.expectedSalary || found.expected_salary || '',
      roi: found.roi || '',
      scholarships: found.scholarships || '',
    };

    return NextResponse.json({
      success: true,
      university,
    });
  } catch (error: any) {
    console.error('Error fetching university by slug:', error);
    return NextResponse.json({
      success: false,
      university: null,
      error: error.message || 'Failed to fetch university',
    }, { status: 500 });
  }
}
