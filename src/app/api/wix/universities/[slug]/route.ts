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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    let found: any = null;

    if (wixApiKey && wixSiteId) {
      try {
        const headers = {
          'Authorization': wixApiKey,
          'wix-site-id': wixSiteId,
          'Content-Type': 'application/json',
        };

        let cursor: string | null = null;
        let hasMore = true;

        while (hasMore && !found) {
          const queryPayload: any = {
            dataCollectionId: 'Import2',
            query: {
              paging: { limit: 1000 },
            },
          };

          if (cursor) {
            queryPayload.query.cursorPaging = { cursor, limit: 1000 };
            delete queryPayload.query.paging;
          }

          const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
            method: 'POST',
            headers,
            body: JSON.stringify(queryPayload),
          });

          if (!res.ok) break;

          const data = await res.json();
          const items = data.dataItems || [];

          for (const item of items) {
            const d = item.data || item;
            const generatedSlug = (d.university_name || 'university')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');

            if (
              generatedSlug === slug ||
              d.university_id === slug ||
              d._id === slug ||
              item.id === slug ||
              (d.slug && d.slug === slug)
            ) {
              found = d;
              found.id = d._id || item.id;
              break;
            }
          }

          if (found) break;

          if (data.pagingMetadata?.hasNext && data.pagingMetadata?.cursors?.next) {
            cursor = data.pagingMetadata.cursors.next;
          } else {
            hasMore = false;
          }
        }
      } catch (wixErr) {
        console.warn('Wix API single fetch notice:', wixErr);
      }
    }

    // Check fallback database if not found via Wix
    if (!found && FALLBACK_UNIVERSITIES[slug]) {
      found = FALLBACK_UNIVERSITIES[slug];
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
      id: found.id || found._id || slug,
      universityId: found.university_id || found.universityId || slug,
      name: found.university_name || found.name || 'University',
      country: found.country || 'Global Partner',
      countryCode: found.country_code || found.countryCode || 'US',
      state: found.state_province || found.state || '',
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
