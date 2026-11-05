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

const FALLBACK_UNIVERSITIES = [
  // UNITED STATES
  {
    id: 'mit-us',
    universityId: 'mit',
    name: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    countryCode: 'US',
    state: 'Massachusetts',
    qsRanking: '#1 QS',
    tuition: '$57,986/yr',
    livingCosts: '$2,500/mo',
    acceptanceRate: '4%',
    website: 'https://web.mit.edu',
    bannerAlt: 'MIT Campus',
    popularMajors: ['Computer Science', 'Artificial Intelligence', 'Robotics', 'Physics', 'Electrical Engineering'],
    slug: 'massachusetts-institute-of-technology',
    avgGpa: 3.96,
    satScore: '1540-1580',
    type: 'Private',
  },
  {
    id: 'stanford-us',
    universityId: 'stanford',
    name: 'Stanford University',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    qsRanking: '#2 QS',
    tuition: '$56,169/yr',
    livingCosts: '$2,800/mo',
    acceptanceRate: '4%',
    website: 'https://stanford.edu',
    bannerAlt: 'Stanford Quad',
    popularMajors: ['Computer Science & AI', 'Business Administration', 'Data Science', 'Biomedical Engineering'],
    slug: 'stanford-university',
    avgGpa: 3.95,
    satScore: '1500-1570',
    type: 'Private',
  },
  {
    id: 'harvard-us',
    universityId: 'harvard',
    name: 'Harvard University',
    country: 'United States',
    countryCode: 'US',
    state: 'Massachusetts',
    qsRanking: '#4 QS',
    tuition: '$54,768/yr',
    livingCosts: '$2,600/mo',
    acceptanceRate: '4%',
    website: 'https://harvard.edu',
    bannerAlt: 'Harvard Yard',
    popularMajors: ['Business (MBA)', 'Economics', 'Law (JD)', 'Government & Policy', 'Computer Science'],
    slug: 'harvard-university',
    avgGpa: 4.0,
    satScore: '1510-1580',
    type: 'Private',
  },
  {
    id: 'caltech-us',
    universityId: 'caltech',
    name: 'California Institute of Technology (Caltech)',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    qsRanking: '#6 QS',
    tuition: '$58,680/yr',
    livingCosts: '$2,400/mo',
    acceptanceRate: '3.9%',
    website: 'https://caltech.edu',
    bannerAlt: 'Caltech Campus',
    popularMajors: ['Physics', 'Applied Math', 'Computer Science', 'Mechanical Engineering'],
    slug: 'california-institute-of-technology',
    avgGpa: 3.97,
    satScore: '1530-1580',
    type: 'Private',
  },
  {
    id: 'berkeley-us',
    universityId: 'uc-berkeley',
    name: 'University of California, Berkeley (UC Berkeley)',
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    qsRanking: '#12 QS',
    tuition: '$44,066/yr',
    livingCosts: '$2,300/mo',
    acceptanceRate: '14%',
    website: 'https://berkeley.edu',
    bannerAlt: 'UC Berkeley Sather Tower',
    popularMajors: ['Electrical Engineering', 'Computer Science (EECS)', 'Business (Haas)', 'Economics', 'Data Science'],
    slug: 'university-of-california-berkeley',
    avgGpa: 3.89,
    satScore: '1410-1540',
    type: 'Public',
  },
  {
    id: 'cmu-us',
    universityId: 'carnegie-mellon',
    name: 'Carnegie Mellon University (CMU)',
    country: 'United States',
    countryCode: 'US',
    state: 'Pennsylvania',
    qsRanking: '#52 QS',
    tuition: '$58,924/yr',
    livingCosts: '$1,600/mo',
    acceptanceRate: '15%',
    website: 'https://cmu.edu',
    bannerAlt: 'Carnegie Mellon Campus',
    popularMajors: ['Computer Science', 'AI & Robotics', 'Human-Computer Interaction', 'Information Systems'],
    slug: 'carnegie-mellon-university',
    avgGpa: 3.88,
    satScore: '1480-1560',
    type: 'Private',
  },
  {
    id: 'princeton-us',
    universityId: 'princeton',
    name: 'Princeton University',
    country: 'United States',
    countryCode: 'US',
    state: 'New Jersey',
    qsRanking: '#17 QS',
    tuition: '$56,010/yr',
    livingCosts: '$2,100/mo',
    acceptanceRate: '4%',
    website: 'https://princeton.edu',
    bannerAlt: 'Princeton Nassau Hall',
    popularMajors: ['Public & International Affairs', 'Computer Science', 'Financial Engineering', 'Mathematics'],
    slug: 'princeton-university',
    avgGpa: 3.95,
    satScore: '1500-1570',
    type: 'Private',
  },
  {
    id: 'columbia-us',
    universityId: 'columbia',
    name: 'Columbia University',
    country: 'United States',
    countryCode: 'US',
    state: 'New York',
    qsRanking: '#23 QS',
    tuition: '$63,530/yr',
    livingCosts: '$2,900/mo',
    acceptanceRate: '3.9%',
    website: 'https://columbia.edu',
    bannerAlt: 'Columbia Low Library',
    popularMajors: ['Financial Economics', 'Data Science', 'Journalism', 'Biomedical Engineering'],
    slug: 'columbia-university',
    avgGpa: 3.91,
    satScore: '1490-1570',
    type: 'Private',
  },
  {
    id: 'uiuc-us',
    universityId: 'uiuc',
    name: 'University of Illinois Urbana-Champaign (UIUC)',
    country: 'United States',
    countryCode: 'US',
    state: 'Illinois',
    qsRanking: '#64 QS',
    tuition: '$32,000/yr',
    livingCosts: '$1,400/mo',
    acceptanceRate: '45%',
    website: 'https://illinois.edu',
    bannerAlt: 'UIUC Quad',
    popularMajors: ['Computer Science', 'Civil Engineering', 'Accountancy', 'Electrical Engineering'],
    slug: 'university-of-illinois-urbana-champaign',
    avgGpa: 3.75,
    satScore: '1350-1510',
    type: 'Public',
  },

  // UNITED KINGDOM
  {
    id: 'oxford-uk',
    universityId: 'oxford',
    name: 'University of Oxford',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '#3 QS',
    tuition: '£26,770/yr',
    livingCosts: '£1,400/mo',
    acceptanceRate: '18%',
    website: 'https://ox.ac.uk',
    bannerAlt: 'Radcliffe Camera Oxford',
    popularMajors: ['Philosophy, Politics & Economics (PPE)', 'Medicine', 'Law', 'Computer Science'],
    slug: 'university-of-oxford',
    avgGpa: 3.9,
    satScore: '1470+',
    type: 'Public',
  },
  {
    id: 'cambridge-uk',
    universityId: 'cambridge',
    name: 'University of Cambridge',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '#5 QS',
    tuition: '£25,860/yr',
    livingCosts: '£1,350/mo',
    acceptanceRate: '21%',
    website: 'https://cam.ac.uk',
    bannerAlt: 'Kings College Chapel Cambridge',
    popularMajors: ['Natural Sciences', 'Engineering', 'Mathematics', 'Computer Science', 'Law'],
    slug: 'university-of-cambridge',
    avgGpa: 3.92,
    satScore: '1480+',
    type: 'Public',
  },
  {
    id: 'imperial-uk',
    universityId: 'imperial',
    name: 'Imperial College London',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '#2 QS',
    tuition: '£32,000/yr',
    livingCosts: '£2,200/mo',
    acceptanceRate: '14%',
    website: 'https://imperial.ac.uk',
    bannerAlt: 'Imperial College London Campus',
    popularMajors: ['Computing & Software Engineering', 'Aeronautical Engineering', 'Biomedical Science', 'Finance'],
    slug: 'imperial-college-london',
    avgGpa: 3.85,
    satScore: '1450+',
    type: 'Public',
  },
  {
    id: 'ucl-uk',
    universityId: 'ucl',
    name: 'UCL (University College London)',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '#9 QS',
    tuition: '£21,000/yr',
    livingCosts: '£2,100/mo',
    acceptanceRate: '63%',
    website: 'https://ucl.ac.uk',
    bannerAlt: 'UCL Main Building',
    popularMajors: ['Architecture', 'Law', 'Computer Science', 'Economics', 'Management'],
    slug: 'university-college-london',
    avgGpa: 3.75,
    satScore: '1380+',
    type: 'Public',
  },
  {
    id: 'edinburgh-uk',
    universityId: 'edinburgh',
    name: 'University of Edinburgh',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'Scotland',
    qsRanking: '#22 QS',
    tuition: '£18,900/yr',
    livingCosts: '£1,350/mo',
    acceptanceRate: '52%',
    website: 'https://ed.ac.uk',
    bannerAlt: 'Edinburgh University Quad',
    popularMajors: ['Informatics & AI', 'Medicine', 'Biological Sciences', 'Business & Finance'],
    slug: 'university-of-edinburgh',
    avgGpa: 3.7,
    satScore: '1360+',
    type: 'Public',
  },
  {
    id: 'manchester-uk',
    universityId: 'manchester',
    name: 'University of Manchester',
    country: 'United Kingdom',
    countryCode: 'UK',
    state: 'England',
    qsRanking: '#32 QS',
    tuition: '£17,000/yr',
    livingCosts: '£1,200/mo',
    acceptanceRate: '56%',
    website: 'https://manchester.ac.uk',
    bannerAlt: 'Manchester University',
    popularMajors: ['Chemical Engineering', 'Computer Science', 'Business Analytics', 'Physics'],
    slug: 'university-of-manchester',
    avgGpa: 3.6,
    satScore: '1320+',
    type: 'Public',
  },

  // CANADA
  {
    id: 'acadia-ca',
    universityId: 'CA-INST-001',
    name: 'Acadia University',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Nova Scotia',
    province: 'Nova Scotia',
    city: 'Main Campus',
    qsRanking: '#42 Canada (uniRank)',
    tuition: 'CA$28,000–38,000/yr (Intl.)',
    livingCosts: 'CA$11,000–15,000/yr',
    acceptanceRate: '~70%',
    website: 'https://www.acadiau.ca',
    bannerImage: 'https://www.unirank.org/i/screenshots/acadia-university-ca-website-screenshot.jpg',
    bannerAlt: "Acadia University's website homepage screenshot",
    popularMajors: ['Computer Science', 'Software Engineering', 'Business Administration', 'Nursing', 'Data Science', 'Psychology', 'Biomedical Sciences', 'Economics'],
    slug: 'acadia-university',
    avgGpa: 3.2,
    satScore: '1280–1480 (US applicants)',
    type: 'Public',
    dliNumber: 'O19209939222',
    internationalEligible: 'Yes; study permit and PGWP eligible',
    expectedSalary: 'CAD 62,000–88,000/yr (CS: 95K+)',
    roi: 'High ROI (3–4 yr break-even)',
    careerOutcomes: '92%–96% employment within 6 months',
    scholarships: 'Entrance merit: CAD 2K–10K; Excellence Award up to CAD 40K',
  },
  {
    id: 'toronto-ca',
    universityId: 'utoronto',
    name: 'University of Toronto',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Ontario',
    province: 'Ontario',
    city: 'Toronto',
    qsRanking: '#21 QS',
    tuition: 'CA$38,000–60,000/yr',
    livingCosts: 'CA$2,500/mo',
    acceptanceRate: '43%',
    website: 'https://utoronto.ca',
    bannerAlt: 'University of Toronto St George',
    popularMajors: ['Computer Science', 'Rotman Commerce', 'Applied Science & Engineering', 'Biomedical Science'],
    slug: 'university-of-toronto',
    avgGpa: 3.8,
    satScore: '1380+',
    type: 'Public',
    dliNumber: 'O19332792618',
    internationalEligible: 'Yes (PGWP Eligible up to 3 Years)',
    expectedSalary: 'CAD 75,000–120,000/yr',
    roi: 'Very High (Top Tier Global #21)',
    careerOutcomes: '95% employment within 6 months',
    scholarships: 'Lester B. Pearson International Scholarship (Full Ride)',
  },
  {
    id: 'mcgill-ca',
    universityId: 'mcgill',
    name: 'McGill University',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Quebec',
    province: 'Quebec',
    city: 'Montreal',
    qsRanking: '#29 QS',
    tuition: 'CA$22,000–45,000/yr',
    livingCosts: 'CA$1,650/mo',
    acceptanceRate: '46%',
    website: 'https://mcgill.ca',
    bannerAlt: 'McGill Arts Building',
    popularMajors: ['Medicine', 'Law', 'Software Engineering', 'Desautels Management'],
    slug: 'mcgill-university',
    avgGpa: 3.82,
    satScore: '1390+',
    type: 'Public',
    dliNumber: 'O19359011033',
    internationalEligible: 'Yes (PGWP Eligible + Quebec PEQ Pathway)',
    expectedSalary: 'CAD 70,000–115,000/yr',
    roi: 'Exceptional (Low Quebec Tuition)',
    careerOutcomes: '94% employment within 6 months',
    scholarships: 'McGill Major Entrance Scholarships: CAD 3,000–12,000/yr renewable',
  },
  {
    id: 'ubc-ca',
    universityId: 'ubc',
    name: 'University of British Columbia (UBC)',
    country: 'Canada',
    countryCode: 'CA',
    state: 'British Columbia',
    province: 'British Columbia',
    city: 'Vancouver',
    qsRanking: '#34 QS',
    tuition: 'CA$35,000–52,000/yr',
    livingCosts: 'CA$2,500/mo',
    acceptanceRate: '52%',
    website: 'https://ubc.ca',
    bannerAlt: 'UBC Vancouver Campus',
    popularMajors: ['Sauder Business', 'Data Science', 'Forestry & Ecology', 'Mechanical Engineering'],
    slug: 'university-of-british-columbia',
    avgGpa: 3.75,
    satScore: '1350+',
    type: 'Public',
    dliNumber: 'O19328566333',
    internationalEligible: 'Yes (PGWP Eligible + BC PNP Tech Draw)',
    expectedSalary: 'CAD 72,000–118,000/yr',
    roi: 'High (Cascadia & Vancouver Tech Hub)',
    careerOutcomes: '93% employment within 6 months',
    scholarships: 'International Major Entrance Scholarship (IMES) up to CAD 40,000',
  },
  {
    id: 'waterloo-ca',
    universityId: 'uwaterloo',
    name: 'University of Waterloo',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Ontario',
    province: 'Ontario',
    city: 'Waterloo',
    qsRanking: '#112 QS',
    tuition: 'CA$27,000–61,000/yr',
    livingCosts: 'CA$1,800/mo',
    acceptanceRate: '53%',
    website: 'https://uwaterloo.ca',
    bannerAlt: 'Waterloo Engineering Building',
    popularMajors: ['Computer Science (Co-op)', 'Software Engineering', 'Mechatronics', 'Quantum Computing'],
    slug: 'university-of-waterloo',
    avgGpa: 3.85,
    satScore: '1420+',
    type: 'Public',
    dliNumber: 'O19305471522',
    internationalEligible: 'Yes (PGWP Eligible + Paid Co-Op Earnings)',
    expectedSalary: 'CAD 90,000–140,000/yr',
    roi: 'Market Leading (#1 Tech Feed to US & Canada)',
    careerOutcomes: '98% employment within 6 months',
    scholarships: 'President’s Scholarship of Distinction: CAD 2,000–10,000',
  },
  {
    id: 'alberta-ca',
    universityId: 'ualberta',
    name: 'University of Alberta',
    country: 'Canada',
    countryCode: 'CA',
    state: 'Alberta',
    province: 'Alberta',
    city: 'Edmonton',
    qsRanking: '#111 QS',
    tuition: 'CA$24,000–39,000/yr',
    livingCosts: 'CA$1,900/mo',
    acceptanceRate: '58%',
    website: 'https://ualberta.ca',
    bannerAlt: 'University of Alberta Quad',
    popularMajors: ['Petroleum Engineering', 'Computing Science', 'Business', 'Nursing'],
    slug: 'university-of-alberta',
    avgGpa: 3.5,
    satScore: '1300+',
    type: 'Public',
    dliNumber: 'O19257171832',
    internationalEligible: 'Yes (PGWP Eligible + Alberta Accelerated Tech Stream)',
    expectedSalary: 'CAD 68,000–105,000/yr',
    roi: 'High (Low Cost of Living in Alberta)',
    careerOutcomes: '91% employment within 6 months',
    scholarships: 'International Admission Scholarship: CAD 5,000–15,000',
  },

  // GERMANY
  {
    id: 'tum-de',
    universityId: 'tum',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    countryCode: 'DE',
    state: 'Bavaria',
    qsRanking: '#28 QS',
    tuition: '€0 (Tuition Free)',
    livingCosts: '€1,200/mo',
    acceptanceRate: '24%',
    website: 'https://tum.de',
    bannerAlt: 'TUM Munich Gate',
    popularMajors: ['Informatics & AI', 'Automotive Engineering', 'Robotics & Systems', 'Management & Technology'],
    slug: 'technical-university-of-munich',
    avgGpa: 3.7,
    satScore: 'N/A',
    type: 'Public',
  },
  {
    id: 'lmu-de',
    universityId: 'lmu',
    name: 'LMU Munich (Ludwig-Maximilians-Universität)',
    country: 'Germany',
    countryCode: 'DE',
    state: 'Bavaria',
    qsRanking: '#54 QS',
    tuition: '€0 (Tuition Free)',
    livingCosts: '€1,200/mo',
    acceptanceRate: '55%',
    website: 'https://lmu.de',
    bannerAlt: 'LMU Munich Main Building',
    popularMajors: ['Data Science', 'Physics', 'Medicine', 'Law', 'Economics'],
    slug: 'lmu-munich',
    avgGpa: 3.6,
    satScore: 'N/A',
    type: 'Public',
  },
  {
    id: 'heidelberg-de',
    universityId: 'heidelberg',
    name: 'Heidelberg University',
    country: 'Germany',
    countryCode: 'DE',
    state: 'Baden-Württemberg',
    qsRanking: '#84 QS',
    tuition: '€1,500/yr',
    livingCosts: '€950/mo',
    acceptanceRate: '48%',
    website: 'https://uni-heidelberg.de',
    bannerAlt: 'Heidelberg University Alte Aula',
    popularMajors: ['Medicine', 'Molecular Biosciences', 'Physics', 'Computer Science'],
    slug: 'heidelberg-university',
    avgGpa: 3.65,
    satScore: 'N/A',
    type: 'Public',
  },
  {
    id: 'rwth-de',
    universityId: 'rwth',
    name: 'RWTH Aachen University',
    country: 'Germany',
    countryCode: 'DE',
    state: 'North Rhine-Westphalia',
    qsRanking: '#99 QS',
    tuition: '€0 (Tuition Free)',
    livingCosts: '€900/mo',
    acceptanceRate: '52%',
    website: 'https://rwth-aachen.de',
    bannerAlt: 'RWTH Aachen Main Building',
    popularMajors: ['Mechanical Engineering', 'Automotive Tech', 'Electrical Engineering', 'Computer Science'],
    slug: 'rwth-aachen-university',
    avgGpa: 3.55,
    satScore: 'N/A',
    type: 'Public',
  },
  {
    id: 'humboldt-de',
    universityId: 'humboldt',
    name: 'Humboldt University of Berlin',
    country: 'Germany',
    countryCode: 'DE',
    state: 'Berlin',
    qsRanking: '#120 QS',
    tuition: '€0 (Tuition Free)',
    livingCosts: '€1,100/mo',
    acceptanceRate: '40%',
    website: 'https://hu-berlin.de',
    bannerAlt: 'Humboldt University Berlin',
    popularMajors: ['Economics', 'Neuroscience', 'Philosophy', 'Computer Science'],
    slug: 'humboldt-university-of-berlin',
    avgGpa: 3.5,
    satScore: 'N/A',
    type: 'Public',
  },

  // AUSTRALIA
  {
    id: 'melbourne-au',
    universityId: 'unimelb',
    name: 'University of Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    state: 'Victoria',
    qsRanking: '#13 QS',
    tuition: 'AUD$38,000/yr',
    livingCosts: 'AUD$2,200/mo',
    acceptanceRate: '70%',
    website: 'https://unimelb.edu.au',
    bannerAlt: 'University of Melbourne Quad',
    popularMajors: ['Melbourne Business School', 'Medicine', 'Law', 'Computer Science', 'Biomedicine'],
    slug: 'university-of-melbourne',
    avgGpa: 3.7,
    satScore: '1350+',
    type: 'Public',
  },
  {
    id: 'sydney-au',
    universityId: 'usyd',
    name: 'University of Sydney',
    country: 'Australia',
    countryCode: 'AU',
    state: 'New South Wales',
    qsRanking: '#18 QS',
    tuition: 'AUD$41,000/yr',
    livingCosts: 'AUD$2,400/mo',
    acceptanceRate: '30%',
    website: 'https://sydney.edu.au',
    bannerAlt: 'University of Sydney Quadrangle',
    popularMajors: ['Architecture', 'Medicine', 'Law', 'Business & Commerce', 'Computer Science'],
    slug: 'university-of-sydney',
    avgGpa: 3.75,
    satScore: '1370+',
    type: 'Public',
  },
  {
    id: 'unsw-au',
    universityId: 'unsw',
    name: 'UNSW Sydney (University of New South Wales)',
    country: 'Australia',
    countryCode: 'AU',
    state: 'New South Wales',
    qsRanking: '#19 QS',
    tuition: 'AUD$40,000/yr',
    livingCosts: 'AUD$2,300/mo',
    acceptanceRate: '35%',
    website: 'https://unsw.edu.au',
    bannerAlt: 'UNSW Sydney Walkway',
    popularMajors: ['Engineering', 'AGSM Business School', 'Quantum Technology', 'Computer Science'],
    slug: 'unsw-sydney',
    avgGpa: 3.65,
    satScore: '1340+',
    type: 'Public',
  },
  {
    id: 'anu-au',
    universityId: 'anu',
    name: 'Australian National University (ANU)',
    country: 'Australia',
    countryCode: 'AU',
    state: 'ACT',
    qsRanking: '#30 QS',
    tuition: 'AUD$42,000/yr',
    livingCosts: 'AUD$1,800/mo',
    acceptanceRate: '35%',
    website: 'https://anu.edu.au',
    bannerAlt: 'ANU Canberra Campus',
    popularMajors: ['International Relations', 'Cybernetics & AI', 'Law', 'Natural Sciences'],
    slug: 'australian-national-university',
    avgGpa: 3.65,
    satScore: '1350+',
    type: 'Public',
  },
  {
    id: 'uq-au',
    universityId: 'uq',
    name: 'University of Queensland (UQ)',
    country: 'Australia',
    countryCode: 'AU',
    state: 'Queensland',
    qsRanking: '#40 QS',
    tuition: 'AUD$34,000/yr',
    livingCosts: 'AUD$1,900/mo',
    acceptanceRate: '50%',
    website: 'https://uq.edu.au',
    bannerAlt: 'University of Queensland Great Court',
    popularMajors: ['Biological Sciences', 'Mining Engineering', 'Environmental Management', 'Business'],
    slug: 'university-of-queensland',
    avgGpa: 3.55,
    satScore: '1300+',
    type: 'Public',
  },
  {
    id: 'monash-au',
    universityId: 'monash',
    name: 'Monash University',
    country: 'Australia',
    countryCode: 'AU',
    state: 'Victoria',
    qsRanking: '#42 QS',
    tuition: 'AUD$32,000/yr',
    livingCosts: 'AUD$2,000/mo',
    acceptanceRate: '55%',
    website: 'https://monash.edu',
    bannerAlt: 'Monash Clayton Campus',
    popularMajors: ['Pharmacy & Pharmacology', 'Engineering', 'Banking & Finance', 'Information Technology'],
    slug: 'monash-university',
    avgGpa: 3.5,
    satScore: '1280+',
    type: 'Public',
  },
];

import {
  fetchCanadianUniversitiesFromWix,
  fetchGermanyUniversitiesFromWix,
} from '@/lib/wixCountryUniversities';
import { CANADA_UNIVERSITIES } from '@/app/country/canada/page';
import { GERMANY_UNIVERSITIES } from '@/app/country/germany/page';

// In-memory cache for instant search responses
let cachedUniversities: any[] | null = null;
let lastUniversityFetch = 0;
const UNIVERSITY_CACHE_TTL = 15 * 60 * 1000; // 15 minutes
let isFetchingUniversities = false;

async function fetchUSUniversitiesFromWix(wixApiKey: string, wixSiteId: string): Promise<any[]> {
  try {
    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    let allItems: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const queryPayload: any = {
        dataCollectionId: 'Import2',
        query: {
          paging: { limit: 1000 },
          sort: [{ fieldName: 'university_name', order: 'ASC' }],
        },
      };

      if (cursor) {
        queryPayload.query.cursorPaging = { cursor, limit: 1000 };
        delete queryPayload.query.paging;
        delete queryPayload.query.sort;
      }

      const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers,
        body: JSON.stringify(queryPayload),
      });

      if (!res.ok) break;

      const data = await res.json();
      const items = data.dataItems || [];
      allItems = allItems.concat(items);

      if (data.pagingMetadata?.hasNext && data.pagingMetadata?.cursors?.next) {
        cursor = data.pagingMetadata.cursors.next;
      } else {
        hasMore = false;
      }

      if (allItems.length >= 3000) break;
    }

    if (allItems.length > 0) {
      return allItems.map((item) => {
        const d = item.data || item;
        const majorsRaw = d.popularMajors || '';
        const majorsArray = majorsRaw
          .split(',')
          .map((m: string) => m.trim())
          .filter(Boolean);

        const slug = (d.university_name || 'university')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const { bannerImage, bannerAlt } = extractBannerAndAlt(d);

        return {
          id: d._id || item.id,
          universityId: d.university_id || '',
          name: d.university_name || 'Unknown University',
          country: d.country || 'United States',
          countryCode: d.country_code || 'US',
          state: d.state_province || '',
          province: d.state_province || '',
          city: d.city || '',
          qsRanking: d.qsRanking || 'Unranked',
          tuition: d.tution || '$35,000/yr',
          livingCosts: d.livingCosts || '$1,800/mo',
          acceptanceRate: d.acceptanceRate || 'N/A',
          website: d.official_website || '',
          bannerImage,
          bannerAlt,
          popularMajors: majorsArray.slice(0, 8),
          allMajors: majorsArray,
          slug,
          type: 'Public',
          careerOutcomes: d.careerOutcomes || d.career_outcomes || '',
          expectedSalary: d.expectedSalary || d.expected_salary || '',
          roi: d.roi || '',
          scholarships: d.scholarships || '',
        };
      });
    }
  } catch (err) {
    console.warn('Wix US university fetch notice:', err);
  }
  return [];
}

async function fetchAllConnectedUniversities(): Promise<any[]> {
  try {
    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    const [canadaUnis, germanyUnis, usUnis] = await Promise.all([
      fetchCanadianUniversitiesFromWix(),
      fetchGermanyUniversitiesFromWix(),
      wixApiKey && wixSiteId ? fetchUSUniversitiesFromWix(wixApiKey, wixSiteId) : Promise.resolve([]),
    ]);

    const mappedCanada = canadaUnis.map((u) => {
      const majorsArray = (u.popularMajors || '')
        .split(',')
        .map((m: string) => m.trim())
        .filter(Boolean);

      const slug = (u.institutionName || 'university')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: u.institutionId ? `ca-${u.institutionId.toLowerCase()}` : slug,
        universityId: u.institutionId || '',
        name: u.institutionName,
        country: 'Canada',
        countryCode: 'CA',
        state: u.province || '',
        province: u.province || '',
        city: u.city || '',
        qsRanking: u.qsRanking || 'Unranked',
        tuition: u.tuition || 'CAD 28,000–38,000/yr',
        livingCosts: u.livingCosts || 'CAD 15,000/yr',
        acceptanceRate: u.acceptanceRate || 'N/A',
        website: u.officialWebsite || '',
        bannerImage: u.bannerImage || '',
        bannerAlt: u.bannerImageAlt || `${u.institutionName} campus`,
        popularMajors: majorsArray.length > 0 ? majorsArray.slice(0, 8) : ['Computer Science', 'Business', 'Engineering'],
        allMajors: majorsArray,
        slug,
        type: u.publicPrivate || u.institutionType || 'Public',
        dliNumber: u.dliNumber || '',
        internationalEligible: u.internationalStudentEligible || 'Yes',
        offersUndergraduate: u.offersUndergraduate || 'Yes',
        offersPostgraduate: u.offersPostgraduate || 'Yes',
        offersDoctoral: u.offersDoctoral || 'No',
        languageOfInstruction: u.languageOfInstruction || 'English',
        avgNeedBasedGrant: u.avgNeedBasedGrant || 'N/A',
        avgGpa: u.avgGpa || 'N/A',
        satScore: u.satScore || 'Optional',
        scholarships: u.scholarships || '',
        careerOutcomes: u.careerOutcomes || '',
        expectedSalary: u.expectedSalary || '',
        roi: u.roi || '',
      };
    });

    const mappedGermany = germanyUnis.map((u, idx) => {
      const slug = (u.universityName || 'university')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: `de-${slug}`,
        universityId: `DE-${String(idx + 1).padStart(3, '0')}`,
        name: u.universityName,
        country: 'Germany',
        countryCode: 'DE',
        state: u.federalState || '',
        province: u.federalState || '',
        city: u.city || '',
        qsRanking: u.ranking || '#Top German University',
        tuition: u.bwTuitionFee?.toLowerCase().startsWith('yes') ? '€1,500/sem (BW)' : '€0 (Tuition Free)',
        livingCosts: u.blockedAccountProofOfFunds ? `${u.blockedAccountProofOfFunds} (Blocked Account)` : '€992/mo',
        acceptanceRate: (u.ncNumerusClausus?.toLowerCase().startsWith('yes') || u.ncGradeCutoff) ? 'NC Restricted' : 'Open Admission',
        website: u.website || '',
        bannerImage: '',
        bannerAlt: `${u.universityName} Campus`,
        popularMajors: ['Engineering & Tech', 'Informatics & AI', 'Natural Sciences', 'Medicine'],
        allMajors: ['Engineering & Tech', 'Informatics & AI', 'Natural Sciences', 'Medicine', 'Economics & Management'],
        slug,
        type: u.universityType || 'Public',
        // German specific parameters
        ncNumerusClausus: u.ncNumerusClausus,
        ncGradeCutoff: u.ncGradeCutoff,
        hzb: u.hzb,
        studienkollegRequired: u.studienkollegRequired,
        apsCertificateRequired: u.apsCertificateRequired,
        uniAssistApplication: u.uniAssistApplication,
        hochschulstartApplication: u.hochschulstartApplication,
        semesterContribution: u.semesterContribution,
        semesterTicket: u.semesterTicket,
        bwTuitionFee: u.bwTuitionFee,
        ectsRequirements: u.ectsRequirements,
        germanLanguageRequirement: u.germanLanguageRequirement,
        testDaF: u.testDaF,
        dsh: u.dsh,
        blockedAccountProofOfFunds: u.blockedAccountProofOfFunds,
        winterSemester: u.winterSemester,
        summerSemester: u.summerSemester,
        indianQualificationEquivalency: u.indianQualificationEquivalency,
        anabinRecognition: u.anabinRecognition,
        countrySpecificRequirements: u.countrySpecificRequirements,
      };
    });

    const fallbackMapped = FALLBACK_UNIVERSITIES.map(u => ({ ...u, allMajors: u.popularMajors }));

    // Merge: Wix Canada + Wix Germany + Wix US + Fallback for all other countries (UK, AU, etc.)
    const combinedWix = [...mappedCanada, ...mappedGermany, ...usUnis];
    const wixSlugs = new Set(combinedWix.map((u: any) => u.slug));
    const missingFallback = fallbackMapped.filter((u) => !wixSlugs.has(u.slug));

    return [...combinedWix, ...missingFallback];
  } catch (err) {
    console.error('Error fetching connected Wix universities:', err);
    return FALLBACK_UNIVERSITIES.map(u => ({ ...u, allMajors: u.popularMajors }));
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const country = searchParams.get('country') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const now = Date.now();
    const isStale = now - lastUniversityFetch > UNIVERSITY_CACHE_TTL;

    // Check or populate in-memory cache
    if (!cachedUniversities) {
      const fresh = await fetchAllConnectedUniversities();
      if (fresh.length > 0) {
        cachedUniversities = fresh;
        lastUniversityFetch = now;
      }
    } else if (isStale && !isFetchingUniversities) {
      // Stale-while-revalidate in background
      isFetchingUniversities = true;
      fetchAllConnectedUniversities()
        .then((fresh) => {
          if (fresh.length > 0) {
            cachedUniversities = fresh;
            lastUniversityFetch = Date.now();
          }
        })
        .finally(() => {
          isFetchingUniversities = false;
        });
    }

    let parsedUniversities = cachedUniversities || [];

    // Fallback safety if remote Wix CMS is unreachable
    if (parsedUniversities.length === 0) {
      parsedUniversities = FALLBACK_UNIVERSITIES.map(u => ({ ...u, allMajors: u.popularMajors }));
    }

    // Apply country filtering
    let filtered = parsedUniversities;

    if (country && country !== 'ALL') {
      const c = country.toUpperCase();
      if (c === 'CA') {
        filtered = filtered.filter((u) => u.countryCode === 'CA' || u.country.toLowerCase().includes('canada'));
      } else if (c === 'DE') {
        filtered = filtered.filter((u) => u.countryCode === 'DE' || u.country.toLowerCase().includes('germany'));
      } else if (c === 'US') {
        filtered = filtered.filter((u) => u.countryCode === 'US' || u.country.toLowerCase().includes('united states'));
      } else if (c === 'UK' || c === 'GB') {
        filtered = filtered.filter((u) => u.countryCode === 'UK' || u.countryCode === 'GB' || u.country.toLowerCase().includes('united kingdom'));
      } else if (c === 'AU') {
        filtered = filtered.filter((u) => u.countryCode === 'AU' || u.country.toLowerCase().includes('australia'));
      } else {
        filtered = filtered.filter((u) =>
          u.countryCode === country || u.country.toLowerCase().includes(country.toLowerCase())
        );
      }
    }

    if (search) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(search) ||
        (u.state && u.state.toLowerCase().includes(search)) ||
        (u.city && u.city.toLowerCase().includes(search)) ||
        u.country.toLowerCase().includes(search) ||
        (u.allMajors && u.allMajors.some((m: string) => m.toLowerCase().includes(search))) ||
        (u.dliNumber && u.dliNumber.toLowerCase().includes(search))
      );
    }

    // Paginate
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      universities: paginatedResults,
      totalCount,
      page,
      totalPages,
      limit,
      source: 'GlobalUniversityCatalog',
    });
  } catch (error: any) {
    console.error('Error fetching universities:', error);
    return NextResponse.json({
      success: false,
      universities: [],
      error: error.message || 'Failed to query universities',
    });
  }
}


