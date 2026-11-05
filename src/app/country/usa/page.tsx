import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import AuthCTALink from '@/components/landing/AuthCTALink';
import USAAdmissionsTable from '@/components/country/USAAdmissionsTable';

/* ══════════════════════════════════════════════════════════════
   SEO METADATA
══════════════════════════════════════════════════════════════ */
export const metadata: Metadata = {
  title: 'Study in USA 2026 — 24-Point Admissions Guide, SAT/GPA Cutoffs, F-1 Visa & Scholarships',
  description:
    'Comprehensive 2026 guide to study in the United States. Explore universities with tuition fees, need-based grants, Common App essay prompts, SAT/GPA requirements, career outcomes, 20-year ROI, and F-1 visa guide.',
  keywords: [
    'study in USA',
    'USA universities admissions',
    'US university tuition fees',
    'Common App essay prompts',
    'SAT score requirements',
    'need-based grants USA',
    'F-1 student visa guide',
    'STEM OPT 3 years',
    'MIT admission requirements',
    'Stanford University tuition',
    'Marywood University admissions',
    'USA university ROI',
    'US college acceptance rates',
    'study in America international students',
  ],
  alternates: { canonical: 'https://abroadsimplified.com/country/usa' },
  openGraph: {
    title: 'Study in USA 2026 — Full 24-Parameter Admissions Guide | Abroad Simplified',
    description:
      'Explore US universities with tuition, need-based aid, Common App essays, SAT/GPA requirements, expected starting salaries, and 20-year ROI analysis.',
    url: 'https://abroadsimplified.com/country/usa',
    siteName: 'Abroad Simplified',
    type: 'article',
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Study in USA Guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in USA 2026 | Abroad Simplified',
    description: 'US universities, tuition, SAT/GPA, essay prompts, starting salary & ROI — comprehensive guide.',
    images: ['/logo.png'],
  },
};

/* ══════════════════════════════════════════════════════════════
   TYPES — Matching the 24 Dataset Columns
══════════════════════════════════════════════════════════════ */
export interface USAUniversity {
  // 1. university_id
  universityId: string;
  // 2. university_name
  universityName: string;
  // 3. country
  country: string;
  // 4. country_code
  countryCode: string;
  // 5. state_province
  stateProvince: string;
  // 6. official_website
  officialWebsite: string;
  // 7. domain
  domain: string;
  // 8. QS Ranking
  qsRanking: string;
  // 9. Acceptance Rate
  acceptanceRate: string;
  // 10. Tuition
  tuition: string;
  // 11. Living Costs
  livingCosts: string;
  // 12. Popular Majors
  popularMajors: string;
  // 13. Banner Image
  bannerImage: string;
  // 14. Banner Image alt text
  bannerImageAlt: string;
  // 15. Avg Need Based Grant
  avgNeedBasedGrant: string;
  // 16. Avg GPA
  avgGpa: string;
  // 17. SAT Score
  satScore: string;
  // 18. Writing Requirements
  writingRequirements: string;
  // 19. Required Essay Prompts & Details
  requiredEssayPrompts: string;
  // 20. Scholarships
  scholarships: string;
  // 21. Total Cost
  totalCost: string;
  // 22. Career Outcomes
  careerOutcomes: string;
  // 23. Expected Salary
  expectedSalary: string;
  // 24. ROI
  roi: string;
}

/* ══════════════════════════════════════════════════════════════
   USA UNIVERSITIES DATA (Populated with 24 Columns)
══════════════════════════════════════════════════════════════ */
export const USA_UNIVERSITIES: USAUniversity[] = [
  // 1. Marywood University (EXACT DATASET ROW SPECIFIED BY USER)
  {
    universityId: 'UNI-284a73a40bbb',
    universityName: 'Marywood University',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Pennsylvania',
    officialWebsite: 'https://www.marywood.edu',
    domain: 'marywood.edu',
    qsRanking: 'Unranked',
    acceptanceRate: '60.60%',
    tuition: '$41,420/year',
    livingCosts: '$15,800/year',
    popularMajors:
      'Business Administration, Computer Science, Nursing and Health Professions, Psychology, Biological and Biomedical Sciences, Elementary and Secondary Education, Communication and Media Studies, Accounting and Finance, Criminal Justice and Criminology, English and Creative Writing, History, Visual and Performing Arts, Political Science, Exercise Science and Kinesiology, Sociology and Social Work',
    bannerImage: 'Marywood University Campus Banner',
    bannerImageAlt: 'Marywood University campus banner',
    avgNeedBasedGrant: '$24,500/year',
    avgGpa: '3.45',
    satScore: '1080–1240',
    writingRequirements:
      'Common App personal essay required, maximum 650 words; supplemental essays optional or not required',
    requiredEssayPrompts:
      'Common App main essay: choose one of seven prompts covering personal background or identity, lessons from obstacles or failure, challenging a belief, gratitude, personal growth, an engaging interest, or an open topic of choice. Maximum 650 words.',
    scholarships:
      'Federal Pell Grant: up to $7,395/year, FAFSA required; institutional need-based grant: average $24,500/year as listed; merit scholarships: $3,000–$14,000/year; Pennsylvania state grants subject to eligibility; athletic, departmental, and endowed scholarships vary. Verify current award amounts.',
    totalCost: '$57,220/year; estimated four-year total $228,880',
    careerOutcomes:
      'Original estimate: 78%–87% employment or graduate-school placement within 12 months; 15%–25% pursue graduate or professional school. Verify the source and methodology.',
    expectedSalary:
      'Estimated starting salary: $64,000–$87,000/year; original record cites approximately $76,000 for selected majors and an estimated 10-year median of $102,000. Verify figures.',
    roi: 'Original estimate: 585% over 20 years; estimated net four-year cost $130,880; break-even approximately 3.4 years. Methodology attributed to a Bankrate/Payscale 20-year earnings-premium model; verify calculations and assumptions.',
  },

  // 2. Massachusetts Institute of Technology (MIT)
  {
    universityId: 'UNI-8b201f92a101',
    universityName: 'Massachusetts Institute of Technology (MIT)',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Massachusetts',
    officialWebsite: 'https://web.mit.edu',
    domain: 'mit.edu',
    qsRanking: '#1 QS World 2026',
    acceptanceRate: '3.96%',
    tuition: '$60,156/year',
    livingCosts: '$19,840/year',
    popularMajors:
      'Computer Science and Engineering, Artificial Intelligence and Decision Making, Mechanical Engineering, Electrical Engineering, Mathematics, Physics, Biological Engineering, Economics, Aeronautics and Astronautics, Chemical Engineering, Finance and Management',
    bannerImage: 'MIT Killian Court and Great Dome Banner',
    bannerImageAlt: 'Massachusetts Institute of Technology Killian Court and Great Dome',
    avgNeedBasedGrant: '$61,400/year (need-blind, meets 100% demonstrated financial need for all admitted students including international)',
    avgGpa: '3.96',
    satScore: '1520–1580',
    writingRequirements:
      'MIT does not use the Common App; uses the MIT Application portal. Mandatory short answer essay responses (100–250 words each) covering personal interests, community contribution, and problem-solving.',
    requiredEssayPrompts:
      'MIT prompts: 1) What do you do simply for the sheer joy of it? (200–250 words). 2) How has your world shaped your dreams and aspirations? (200–250 words). 3) Describe a situation in which you were challenged or failed. How did you react? (200–250 words). 4) Short answer on collaboration and community building.',
    scholarships:
      'MIT Need-Based Scholarship: covers full demonstrated need (average grant $61,400); families earning under $140,000 typically pay $0 tuition; full tuition waivers and research/teaching assistantships for graduate students.',
    totalCost: '$82,750/year; estimated four-year total $331,000 (before financial aid)',
    careerOutcomes:
      '96% placement within 6 months; top recruiters include Google, Apple, Microsoft, NVIDIA, Jane Street, Citadel, NASA, and McKinsey. 35%+ pursue graduate/PhD study at world-leading institutions.',
    expectedSalary:
      '$118,000–$165,000/year starting salary; $180,000+ for CS, AI, and Quantitative Finance graduates; 10-year median exceeds $215,000.',
    roi: 'Ranked #1 for 20-year net ROI in higher education; 20-year net earnings premium exceeds $1,280,000; average break-even under 2.5 years for self-funded students and immediate for aid recipients.',
  },

  // 3. Stanford University
  {
    universityId: 'UNI-9c312a03b202',
    universityName: 'Stanford University',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'California',
    officialWebsite: 'https://www.stanford.edu',
    domain: 'stanford.edu',
    qsRanking: '#2 QS World 2026',
    acceptanceRate: '3.68%',
    tuition: '$62,484/year',
    livingCosts: '$20,950/year',
    popularMajors:
      'Computer Science, Management Science & Engineering, Symbolic Systems, Human Biology, Mechanical Engineering, Economics, Electrical Engineering, Product Design, Bioengineering, Political Science, International Relations',
    bannerImage: 'Stanford Main Quad and Hoover Tower Banner',
    bannerImageAlt: 'Stanford University Main Quad and Palm Drive',
    avgNeedBasedGrant: '$62,800/year (zero parent contribution for families making under $100,000; free tuition for families under $150,000)',
    avgGpa: '3.95',
    satScore: '1500–1570',
    writingRequirements:
      'Common App personal essay required (650 words) plus Stanford Short Questions (5 short answers of 50 words) and 3 Stanford Supplemental Essays (100–250 words each).',
    requiredEssayPrompts:
      'Stanford Essays: 1) What is meaningful to you, and why? (100–250 words). 2) Write a note to your future roommate that reveals something about you (100–250 words). 3) Reflect on an idea or experience that makes you genuinely excited about learning (100–250 words).',
    scholarships:
      'Stanford Need-Based Scholarship: average award $62,800/year; Knight-Hennessy Scholars Program: full funding for graduate degrees; Stanford Cardinal Service fellowships; departmental research grants.',
    totalCost: '$85,800/year; estimated four-year total $343,200 (before financial aid)',
    careerOutcomes:
      '95% employment or graduate placement within 6 months; premier feeder to Silicon Valley startups, venture capital, big tech (Meta, Google, OpenAI, Apple), and bio-tech research.',
    expectedSalary:
      '$112,000–$160,000/year starting salary; $175,000+ for Computer Science and Engineering; high equity/stock compensation upside.',
    roi: 'Top 3 globally for 20-year net ROI; 20-year net earnings premium approximately $1,210,000; venture-backed founder alumni network unmatched worldwide.',
  },

  // 4. Harvard University
  {
    universityId: 'UNI-4a115b74c303',
    universityName: 'Harvard University',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Massachusetts',
    officialWebsite: 'https://www.harvard.edu',
    domain: 'harvard.edu',
    qsRanking: '#4 QS World 2026',
    acceptanceRate: '3.41%',
    tuition: '$59,076/year',
    livingCosts: '$20,268/year',
    popularMajors:
      'Economics, Government and Political Science, Computer Science, Applied Mathematics, Social Studies, History, Molecular and Cellular Biology, Psychology, English, Statistics, Neurobiology',
    bannerImage: 'Harvard Yard and Memorial Hall Banner',
    bannerImageAlt: 'Harvard University historic Harvard Yard campus',
    avgNeedBasedGrant: '$64,500/year (100% need-blind admissions for domestic and international students; families earning under $85,000 pay $0 total cost)',
    avgGpa: '3.97',
    satScore: '1510–1580',
    writingRequirements:
      'Common App personal essay (650 words) + Harvard Supplemental Essay: choose from 5 short responses (up to 200 words each) exploring community, intellectual curiosity, and life perspective.',
    requiredEssayPrompts:
      'Harvard short responses: 1) How do you hope to use your Harvard education in the future? 2) Describe your top 3 extracurricular activities. 3) What would you want your future college roommate to know about you? 4) Brief intellectual experience reflection.',
    scholarships:
      'Harvard Financial Aid Initiative (HFAI): 100% need-based, no loans required; international students qualify under the identical need-blind policy; Harvard Global Health Institute grants; Boustany MBA scholarships.',
    totalCost: '$82,860/year; estimated four-year total $331,440 (before financial aid; over 55% pay under $15,000/year)',
    careerOutcomes:
      '96% placement within 6 months; leading destinations in finance (Goldman Sachs, Morgan Stanley), management consulting (McKinsey, BCG, Bain), tech, supreme court clerkships, and world policy.',
    expectedSalary:
      '$105,000–$155,000/year starting salary; 10-year median earnings exceed $195,000; highest long-term executive alumni earnings.',
    roi: 'Exceptional ROI; 20-year net earnings premium exceeds $1,150,000; immense global alumni network dividends across business, politics, and academia.',
  },

  // 5. University of California, Berkeley (UC Berkeley)
  {
    universityId: 'UNI-7f429c85d404',
    universityName: 'University of California, Berkeley',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'California',
    officialWebsite: 'https://www.berkeley.edu',
    domain: 'berkeley.edu',
    qsRanking: '#12 QS World 2026',
    acceptanceRate: '11.40%',
    tuition: '$48,465/year (Out-of-State / Intl.); $15,891 (In-State)',
    livingCosts: '$21,480/year',
    popularMajors:
      'Computer Science (EECS & L&S CS), Data Science, Economics, Business Administration (Haas), Molecular and Cell Biology, Electrical Engineering, Mechanical Engineering, Environmental Science, Political Science, Cognitive Science',
    bannerImage: 'UC Berkeley Sather Tower Campanile Banner',
    bannerImageAlt: 'UC Berkeley Sather Tower Campanile and Memorial Glade',
    avgNeedBasedGrant: '$22,500/year (primarily for CA residents; international students have limited institutional need-based aid)',
    avgGpa: '3.91',
    satScore: 'Test-Free (UC System does not consider SAT/ACT scores in admissions decisions)',
    writingRequirements:
      'UC Application required (does not use Common App). Applicants must answer 4 out of 8 Personal Insight Questions (PIQs), maximum 350 words per response.',
    requiredEssayPrompts:
      'UC PIQ Prompts (Select 4 of 8): 1) Describe an example of your leadership experience. 2) Express your creative side. 3) What would you say is your greatest talent or skill? 4) How have you taken advantage of a significant educational opportunity? 5) Describe the most significant challenge you faced. 6) Describe your favorite academic subject. 7) What have you done to make your school or community a better place? 8) What sets you apart as a candidate?',
    scholarships:
      'Regents\' and Chancellor\'s Scholarship (highest academic honour; includes priority registration and research stipend); Berkeley Undergraduate Scholarship; Haas Global Scholar Awards; outside international scholarships.',
    totalCost: '$72,600/year (Out-of-state/Intl.); four-year total $290,400',
    careerOutcomes:
      '93% employment or graduate school placement within 6 months; #1 public university producer of venture-backed startup founders; massive pipeline to San Francisco tech and biotech corridor.',
    expectedSalary:
      '$92,000–$145,000/year starting salary; $160,000+ for EECS and Data Science graduates; 10-year median over $168,000.',
    roi: '#1 public university in the US for 20-year net ROI; 20-year net earnings premium exceeds $1,050,000; Silicon Valley proximity maximizes tech career ROI.',
  },

  // 6. Carnegie Mellon University (CMU)
  {
    universityId: 'UNI-3d551e96e505',
    universityName: 'Carnegie Mellon University',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Pennsylvania',
    officialWebsite: 'https://www.cmu.edu',
    domain: 'cmu.edu',
    qsRanking: '#58 QS World 2026',
    acceptanceRate: '11.00%',
    tuition: '$62,260/year',
    livingCosts: '$17,468/year',
    popularMajors:
      'Computer Science (SCS), Artificial Intelligence, Software Engineering, Robotics, Electrical & Computer Engineering, Business Administration (Tepper), Drama & Performing Arts, Information Systems, Computational Biology, Design',
    bannerImage: 'Carnegie Mellon University Campus Banner',
    bannerImageAlt: 'Carnegie Mellon University Hamerschlag Hall and campus lawn',
    avgNeedBasedGrant: '$44,500/year for demonstrated need (primarily US citizens/permanent residents; limited international aid)',
    avgGpa: '3.90',
    satScore: '1500–1570',
    writingRequirements:
      'Common App personal essay required (650 words) + CMU Writing Supplements: 3 mandatory short essays (each 300 words maximum) regarding major choice, collaborative work, and community impact.',
    requiredEssayPrompts:
      'CMU Supplements: 1) Most students choose their intended major after experiences that inspire them. Describe your chosen area of study and what led you to this choice (300 words). 2) Describe an experience where you had to collaborate with individuals of different backgrounds (300 words). 3) What has been the most meaningful extracurricular activity and why? (300 words).',
    scholarships:
      'Carnegie Mellon Need-Based Grant; Presidential Scholarships; Tartan Merit Awards; Tepper School of Business Fellowships; external corporate-sponsored STEM fellowships.',
    totalCost: '$83,200/year; estimated four-year total $332,800',
    careerOutcomes:
      '96% employment or graduate placement within 6 months; world\'s #1 robotics institute and top-ranked computer science school; top employers: Google, Apple, Microsoft, Amazon, Meta, Uber ATG.',
    expectedSalary:
      '$115,000–$168,000/year starting salary; SCS graduates average $145,000+ base starting salary; 10-year median exceeds $190,000.',
    roi: 'Extremely high ROI for STEM and Computer Science; break-even period 2–3 years; CMU CS graduates command the highest starting salaries of any US undergraduate cohort.',
  },

  // 7. Columbia University
  {
    universityId: 'UNI-2c662f07f606',
    universityName: 'Columbia University',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'New York',
    officialWebsite: 'https://www.columbia.edu',
    domain: 'columbia.edu',
    qsRanking: '#34 QS World 2026',
    acceptanceRate: '3.85%',
    tuition: '$65,524/year',
    livingCosts: '$19,850/year',
    popularMajors:
      'Economics, Computer Science, Political Science and Government, Financial Economics, Applied Mathematics, History, Neuroscience and Behavior, Biomedical Engineering, English Literature, Architecture',
    bannerImage: 'Columbia Low Memorial Library and Alma Mater Banner',
    bannerImageAlt: 'Columbia University Morningside Heights Low Memorial Library',
    avgNeedBasedGrant: '$66,200/year (need-blind admissions for domestic students; meets 100% demonstrated financial need for all admitted students including international)',
    avgGpa: '3.93',
    satScore: '1510–1570',
    writingRequirements:
      'Common App personal essay (650 words) + Columbia-specific questions: List of books read for pleasure, list of publications/media consumed (100 words), plus 2 short essays (150 words each) on Core Curriculum and why Columbia.',
    requiredEssayPrompts:
      'Columbia Supplements: 1) What attracts you specifically to Columbia University and our Core Curriculum? (150 words). 2) In what ways would you contribute to the Columbia community? (150 words). 3) List titles of the books, publications, and artworks you enjoyed most outside academic requirements.',
    scholarships:
      'Columbia Institutional Grant: average award $66,200; Kluge Scholars Program; John Jay Scholars; C.P. Davis Scholars in Engineering; full tuition aid for families earning under $150,000 with typical assets.',
    totalCost: '$88,200/year; estimated four-year total $352,800 (before financial aid)',
    careerOutcomes:
      '95% placement within 6 months; premier feeder to Wall Street investment banks (Goldman Sachs, JPMorgan), NYC corporate headquarters, media conglomerates, and prestigious law/medical schools.',
    expectedSalary:
      '$98,000–$145,000/year starting salary; $160,000+ for Financial Economics and CS; 10-year median earnings over $185,000.',
    roi: 'Very high ROI; 20-year net earnings premium approximately $1,100,000; New York City financial and cultural hub provides unparalleled internship and networking access.',
  },

  // 8. University of Michigan, Ann Arbor
  {
    universityId: 'UNI-5e773a18g707',
    universityName: 'University of Michigan, Ann Arbor',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Michigan',
    officialWebsite: 'https://umich.edu',
    domain: 'umich.edu',
    qsRanking: '#44 QS World 2026',
    acceptanceRate: '17.70%',
    tuition: '$57,233/year (Out-of-State / Intl.); $17,786 (In-State)',
    livingCosts: '$15,486/year',
    popularMajors:
      'Business Administration (Ross), Computer Science, Mechanical Engineering, Biomedical Engineering, Information Science, Psychology, Economics, Political Science, Aerospace Engineering, Industrial and Operations Engineering',
    bannerImage: 'University of Michigan Burton Tower and Diag Banner',
    bannerImageAlt: 'University of Michigan Ann Arbor campus central Diag and Burton Tower',
    avgNeedBasedGrant: '$25,400/year (Go Blue Guarantee covers 100% tuition for qualifying in-state students; selective merit aid for out-of-state/international)',
    avgGpa: '3.88',
    satScore: '1350–1530',
    writingRequirements:
      'Common App personal essay (650 words) + UMich Supplements: 1 essay about your specific academic interest and university resources (500 words) + 1 community essay (300 words).',
    requiredEssayPrompts:
      'UMich Supplements: 1) Everyone belongs to many different communities and/or groups defined by shared interest, geographic location, or culture. Choose one community and describe your place within it (300 words). 2) Describe the unique qualities that attract you to the specific undergraduate college or school you have selected at U-M (500 words).',
    scholarships:
      'Go Blue Guarantee (In-State); Stamps Scholarship (Full tuition, room, board + $12,000 enrichment fund); Shipman Scholarship; Ross BBA Community Scholars; Michigan International Student Awards.',
    totalCost: '$75,800/year (Out-of-state/Intl.); four-year total $303,200',
    careerOutcomes:
      '94% employment or graduate placement within 6 months; 650,000+ living alumni (one of the world\'s largest living alumni bases); top recruitment across automotive, consulting, tech, and banking.',
    expectedSalary:
      '$82,000–$125,000/year starting salary; $105,000+ for Ross BBA and College of Engineering graduates; 10-year median over $155,000.',
    roi: 'Outstanding public university ROI; 20-year net earnings premium approximately $940,000; the immense Michigan Alumni Network unlocks global career opportunities.',
  },

  // 9. Georgia Institute of Technology (Georgia Tech)
  {
    universityId: 'UNI-8a884b29h808',
    universityName: 'Georgia Institute of Technology',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Georgia',
    officialWebsite: 'https://www.gatech.edu',
    domain: 'gatech.edu',
    qsRanking: '#114 QS World 2026',
    acceptanceRate: '16.00%',
    tuition: '$33,796/year (Out-of-State / Intl.); $12,852 (In-State)',
    livingCosts: '$16,680/year',
    popularMajors:
      'Mechanical Engineering, Industrial & Systems Engineering (#1 in US for 30+ consecutive years), Computer Science, Biomedical Engineering, Electrical Engineering, Aerospace Engineering, Business Administration (Scheller), Civil Engineering, Architecture',
    bannerImage: 'Georgia Tech Tech Tower Campus Banner',
    bannerImageAlt: 'Georgia Institute of Technology Tech Tower and Atlanta skyline',
    avgNeedBasedGrant: '$14,500/year (HOPE and Zell Miller Scholarships for GA residents; competitive merit awards for out-of-state)',
    avgGpa: '3.85',
    satScore: '1370–1530',
    writingRequirements:
      'Common App personal essay (650 words) + Georgia Tech Short Answer: 1 essay explaining why you chose your intended major and how Georgia Tech fits your goals (300 words).',
    requiredEssayPrompts:
      'Georgia Tech Supplement: Why do you want to study your chosen major at Georgia Tech, and how will Georgia Tech\'s unique environment help you reach your academic and professional goals? (300 words).',
    scholarships:
      'Stamps President\'s Scholars Program (full ride + $15,000 enrichment funding for top 1% applicants); Provost Scholarship (waives out-of-state tuition tuition for 4 years); Dean\'s Scholarships; HOPE/Zell Miller (In-State).',
    totalCost: '$53,500/year (Out-of-state/Intl.); four-year total $214,000 (exceptionally low for a top-tier STEM flagship)',
    careerOutcomes:
      '95% placement within 6 months; top employer list includes Microsoft, Lockheed Martin, Delta Air Lines, Amazon, Home Depot, and NCR; top 5 co-op and internship programs nationwide.',
    expectedSalary:
      '$88,000–$135,000/year starting salary; $112,000+ for Industrial Engineering and Computer Science; 10-year median exceeds $168,000.',
    roi: 'Ranked top 5 nationwide among public universities for 20-year net ROI; 20-year net earnings premium exceeds $1,020,000; relatively affordable tuition ensures rapid 2–3 year break-even.',
  },

  // 10. New York University (NYU)
  {
    universityId: 'UNI-6b995c30i909',
    universityName: 'New York University (NYU)',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'New York',
    officialWebsite: 'https://www.nyu.edu',
    domain: 'nyu.edu',
    qsRanking: '#43 QS World 2026',
    acceptanceRate: '12.20%',
    tuition: '$60,438/year',
    livingCosts: '$22,500/year',
    popularMajors:
      'Finance and Business (Stern School of Business), Film and Television (Tisch), Computer Science, Drama, Economics, Nursing (Meyers), Liberal Studies, Media Culture and Communication, Psychology, Global Public Health',
    bannerImage: 'NYU Washington Square Arch Banner',
    bannerImageAlt: 'New York University Washington Square Park Arch and Greenwich Village campus',
    avgNeedBasedGrant: '$41,200/year (NYU Promise now covers 100% tuition for admitted undergraduate students from families earning under $100,000)',
    avgGpa: '3.78',
    satScore: '1450–1550 (Flexible testing policy)',
    writingRequirements:
      'Common App personal essay required (650 words) + optional NYU Supplement essay: In what way does NYU\'s global network or location in New York City inspire your educational aspirations? (250 words).',
    requiredEssayPrompts:
      'NYU Supplement (Optional but strongly recommended): We would like to understand more about your interest in NYU. What has led you to apply to NYU, and why do you feel NYU is the ideal place to pursue your passions? (250 words). Portfolio / audition required for Tisch School of the Arts.',
    scholarships:
      'NYU Promise (100% tuition for families earning under $100,000); Martin Luther King Jr. Scholars Program; Stern Scholarship; Global Pathways Scholarship; Tisch Artistic Merit Fellowships.',
    totalCost: '$86,500/year; estimated four-year total $346,000',
    careerOutcomes:
      '94% placement within 6 months; Stern School of Business ranks in the top 3 undergraduate business schools in the nation; Tisch dominates Hollywood, Broadway, and modern media.',
    expectedSalary:
      '$84,000–$140,000/year starting salary; $105,000+ for Stern Finance and Tech graduates; high career ceilings across entertainment, banking, and law.',
    roi: 'High ROI for Stern Business, Tech, and Medical pathways; 20-year net earnings premium approximately $910,000; New York City urban campus provides four years of direct corporate internship integration.',
  },

  // 11. University of Texas at Austin (UT Austin)
  {
    universityId: 'UNI-1f006d41j010',
    universityName: 'University of Texas at Austin',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Texas',
    officialWebsite: 'https://www.utexas.edu',
    domain: 'utexas.edu',
    qsRanking: '#66 QS World 2026',
    acceptanceRate: '28.70% (Non-Texas resident acceptance rate ~11%)',
    tuition: '$42,778/year (Out-of-State / Intl.); $11,698 (In-State)',
    livingCosts: '$15,900/year',
    popularMajors:
      'Computer Science (Turing Scholars), Business (McCombs School of Business), Petroleum & Chemical Engineering, Electrical & Computer Engineering, Advertising and Public Relations, Biology, Mechanical Engineering, Finance, Radio-Television-Film',
    bannerImage: 'UT Austin Tower and Main Mall Banner',
    bannerImageAlt: 'University of Texas at Austin Main Tower and South Lawn',
    avgNeedBasedGrant: '$15,800/year (Texas Advance Commitment covers 100% tuition for Texas families earning up to $65,000; competitive merit for out-of-state)',
    avgGpa: '3.84',
    satScore: '1240–1470',
    writingRequirements:
      'ApplyTexas or Common App essay (Topic A: personal story, 500–700 words) + 3 Short Answer Responses (250–300 words each) covering major choice, leadership, and personal contribution.',
    requiredEssayPrompts:
      'UT Austin Short Answers: 1) Why are you interested in the major you have indicated, and how will it help you achieve your future goals? 2) Describe your experience in leadership or personal initiative. 3) How will your life experiences and unique perspectives contribute to the university community?',
    scholarships:
      'Forty Acres Scholars Program (full ride + enrichment funding); Engineering Honors Scholarships; McCombs Dean\'s Leadership Award; Out-of-State Tuition Waiver competitive scholarships.',
    totalCost: '$60,800/year (Out-of-state/Intl.); four-year total $243,200',
    careerOutcomes:
      '93% placement within 6 months; Austin is known as the "Silicon Hills" hosting Apple, Dell, Tesla Gigafactory, Oracle, Google, and Samsung Semiconductor with direct UT talent pipelines.',
    expectedSalary:
      '$80,000–$128,000/year starting salary; $100,000+ for McCombs Finance and Cockrell Engineering; 10-year median over $148,000.',
    roi: 'Exceptional ROI due to low Texas cost of living and booming Austin tech ecosystem; 20-year net earnings premium approximately $890,000; break-even 2.5–4 years.',
  },

  // 12. Purdue University
  {
    universityId: 'UNI-9e117e52k111',
    universityName: 'Purdue University',
    country: 'United States',
    countryCode: 'US',
    stateProvince: 'Indiana',
    officialWebsite: 'https://www.purdue.edu',
    domain: 'purdue.edu',
    qsRanking: '#89 QS World 2026',
    acceptanceRate: '52.70%',
    tuition: '$31,104/year (Out-of-State / Intl.); $9,992 (In-State) — Tuition frozen for 12+ consecutive years',
    livingCosts: '$10,950/year (among the most affordable living costs in US major research universities)',
    popularMajors:
      'Aerospace and Aeronautical Engineering (#1 "Cradle of Astronauts"), Computer Science, Mechanical Engineering, Electrical & Computer Engineering, Agricultural & Biological Engineering, Data Science, Industrial Engineering, Pharmacy, Aviation Technology',
    bannerImage: 'Purdue University Bell Tower and Engineering Mall Banner',
    bannerImageAlt: 'Purdue University West Lafayette Bell Tower and Engineering Mall',
    avgNeedBasedGrant: '$12,800/year (FAFSA required; institutional scholarships and department awards)',
    avgGpa: '3.72',
    satScore: '1210–1440',
    writingRequirements:
      'Common App personal essay (650 words) + Purdue Short Questions: 2 mandatory questions (each 250 words maximum) on why Purdue and why your chosen primary major.',
    requiredEssayPrompts:
      'Purdue Supplements: 1) How will opportunities at Purdue support your interests, both in and out of the classroom? (250 words). 2) Briefly discuss your reasons for pursuing the major you have selected (250 words).',
    scholarships:
      'Trustees Scholarship: $10,000–$14,000/year; Presidential Scholarship: $4,000–$8,000/year; Beering Scholarship (full tuition, room, board + graduate degree funding); Engineering Honors Fellowships.',
    totalCost: '$44,200/year (Out-of-state/Intl.); four-year total $176,800 — one of the best educational values in the entire US',
    careerOutcomes:
      '95% employment or graduate placement within 6 months; educated 27 astronauts including Neil Armstrong; top recruiters include Boeing, NASA, Tesla, Lockheed Martin, Microsoft, and Intel.',
    expectedSalary:
      '$78,000–$120,000/year starting salary; $95,000+ for Engineering and CS graduates; 10-year median over $140,000.',
    roi: 'Recognized as one of the #1 best value public universities in the United States; frozen tuition and low Indiana living costs deliver maximum return per dollar invested; break-even under 2.5 years.',
  },
];

/* ══════════════════════════════════════════════════════════════
   WHY STUDY IN THE USA
══════════════════════════════════════════════════════════════ */
const WHY_STUDY_USA = [
  {
    stat: '3 Years',
    title: 'STEM OPT Work Authorization',
    desc: 'International students in STEM programs qualify for 36 months (3 years) of post-graduation work authorization (OPT) without requiring H-1B lottery sponsorship immediately.',
    icon: 'work',
  },
  {
    stat: '8 of Top 10',
    title: 'World University Dominance',
    desc: 'The United States hosts 8 of the world\'s top 10 universities in global research, patent production, and Nobel laureates, offering unmatched educational prestige.',
    icon: 'trophy',
  },
  {
    stat: '$70 Billion+',
    title: 'Annual Research Investment',
    desc: 'US research universities receive billions in federal and industry grants annually. Most STEM PhD students receive full tuition remission plus a living stipend ($32k–$45k/year).',
    icon: 'micro',
  },
  {
    stat: '$115,000+',
    title: 'Top Starting Salaries',
    desc: 'US graduates in Computer Science, Data Science, Quantitative Finance, and Engineering command the highest starting entry-level salaries in the world.',
    icon: 'trend',
  },
  {
    stat: 'Need-Blind Aid',
    title: 'Massive Financial Aid Pools',
    desc: 'Top institutions like Harvard, MIT, and Columbia offer need-blind admissions meeting 100% of demonstrated need for domestic and international students alike.',
    icon: 'money',
  },
  {
    stat: '1,000,000+',
    title: 'International Student Community',
    desc: 'Over 1 million international students study in the US each year, creating an exceptionally diverse, global professional and entrepreneurial alumni network.',
    icon: 'globe',
  },
];

/* ══════════════════════════════════════════════════════════════
   SCHOLARSHIPS DATA
══════════════════════════════════════════════════════════════ */
interface ScholarshipItem {
  name: string;
  amount: string;
  eligibility: string;
  deadline: string;
  type: string;
  funder: string;
  degreeLevel: string;
  fundingType: 'Full' | 'Partial';
  applyUrl: string;
}

const USA_SCHOLARSHIPS: ScholarshipItem[] = [
  {
    name: 'Fulbright Foreign Student Program',
    amount: 'Full Tuition, Airfare, Health Insurance & Monthly Living Stipend',
    eligibility: 'Graduate students, young professionals and artists from 160+ countries worldwide',
    deadline: 'February – October (varies by home country)',
    type: 'Government',
    funder: 'U.S. Department of State',
    degreeLevel: "Master's & PhD",
    fundingType: 'Full',
    applyUrl: 'https://foreign.fulbrightonline.org',
  },
  {
    name: 'Knight-Hennessy Scholars Program',
    amount: 'Full Tuition, Living Stipend & Academic Enrichment Funding (up to 3 years)',
    eligibility: 'High-achieving applicants enrolling in any graduate degree at Stanford University',
    deadline: 'October 9, annually',
    type: 'University',
    funder: 'Stanford University',
    degreeLevel: 'Graduate / Professional',
    fundingType: 'Full',
    applyUrl: 'https://knight-hennessy.stanford.edu',
  },
  {
    name: 'Harvard Financial Aid Initiative (HFAI)',
    amount: '100% Demonstrated Need Covered ($64,500/yr average; $0 parent contribution under $85k)',
    eligibility: 'All admitted undergraduate students regardless of citizenship or nationality',
    deadline: 'November 1 (REA) / January 1 (RD)',
    type: 'Institutional',
    funder: 'Harvard University',
    degreeLevel: "Bachelor's",
    fundingType: 'Full',
    applyUrl: 'https://college.harvard.edu/financial-aid',
  },
  {
    name: 'Aga Khan Foundation International Scholarship',
    amount: '50% Grant / 50% Loan covering full tuition and living expenses',
    eligibility: 'Outstanding students from developing countries with no other means of financing',
    deadline: 'March 31, annually',
    type: 'Private Foundation',
    funder: 'Aga Khan Development Network',
    degreeLevel: "Master's & PhD",
    fundingType: 'Full',
    applyUrl: 'https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme',
  },
];

/* ══════════════════════════════════════════════════════════════
   F-1 VISA APPLICATION STEPS
══════════════════════════════════════════════════════════════ */
const F1_VISA_STEPS = [
  {
    step: '01',
    title: 'Accept Offer & Receive Form I-20',
    desc: 'Accept your admission offer at an SEVP-certified institution. Submit financial documentation to prove funding, and receive your official Form I-20 Certificate of Eligibility.',
  },
  {
    step: '02',
    title: 'Pay the SEVIS I-901 Fee ($350)',
    desc: 'Pay the mandatory SEVIS fee at fmjfee.com using your SEVIS ID found on the top right of your Form I-20. Save the payment receipt confirmation.',
  },
  {
    step: '03',
    title: 'Complete the DS-160 Online Form',
    desc: 'Fill out the DS-160 Nonimmigrant Visa Application accurately on ceac.state.gov. Upload a compliant digital passport photo and print your confirmation barcode page.',
  },
  {
    step: '04',
    title: 'Pay Visa Application Fee ($185)',
    desc: 'Create an account on your local US Embassy/Consulate appointment portal (e.g. ustraveldocs.com) and pay the $185 Machine Readable Visa (MRV) application fee.',
  },
  {
    step: '05',
    title: 'Attend Biometrics & Consular Interview',
    desc: 'Schedule two appointments: Visa Application Center (VAC) for fingerprints/photo, and the Consular Interview. Clearly articulate your academic goals and strong ties to return home.',
  },
  {
    step: '06',
    title: 'Visa Issued & Travel to the USA',
    desc: 'Upon approval, your passport is returned with the F-1 visa foil. You can enter the US up to 30 days prior to the program start date listed on your I-20.',
  },
];

/* ══════════════════════════════════════════════════════════════
   ICON COMPONENT
══════════════════════════════════════════════════════════════ */
function Icon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'money':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'work':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case 'globe':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      );
    case 'micro':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.602 15.12a2 2 0 00-1.406.402L3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2l-1.572-1.572zM9 11V3m6 8V3M9 3h6" />
        </svg>
      );
    case 'trend':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    case 'trophy':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4a5 5 0 005 5h4a5 5 0 005-5V3M5 3h14M5 3H3v2a4 4 0 004 4h1M19 3h2v2a4 4 0 01-4 4h-1M12 12v6m-4 3h8" />
        </svg>
      );
    case 'calendar':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
  }
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT (SSR)
══════════════════════════════════════════════════════════════ */
export default function USAPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abroadsimplified.com' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://abroadsimplified.com/#universities' },
      { '@type': 'ListItem', position: 3, name: 'Study in USA', item: 'https://abroadsimplified.com/country/usa' },
    ],
  };

  return (
    <div className="bg-[#F6F4F2] text-[#111111] font-[Poppins] font-normal min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <LandingNavbar />

      <main className="flex-1">

        {/* ══ HERO SECTION ════════════════════════════════════════════ */}
        <section className="relative bg-[#FAF8F5] pt-6 sm:pt-12 pb-10 sm:pb-16 overflow-hidden border-b border-[#EAE5DF]">
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#690B1B]/5 via-[#C9A55D]/10 to-transparent blur-[80px] sm:blur-[120px]" />
            <div className="absolute -bottom-20 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#690B1B]/5 blur-[80px] sm:blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[12px] text-[#777] mb-6 sm:mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#690B1B] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/#universities" className="hover:text-[#690B1B] transition-colors">Destinations</Link>
              <span>/</span>
              <span className="text-[#111] font-semibold">Study in USA</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-14">
              {/* Left Column */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F0F1] border border-[#E8C4CC] text-[#690B1B] text-[11px] sm:text-[12px] font-bold tracking-wide uppercase mb-4 sm:mb-5">
                  <span className="w-2 h-2 rounded-full bg-[#690B1B]" />
                  <span>Verified 24-Column US Admissions Directory 2026</span>
                </div>

                <h1 className="text-[32px] sm:text-[48px] md:text-[56px] font-bold tracking-[-0.035em] text-[#111111] leading-[1.08] mb-4 sm:mb-6">
                  Study in the <span className="text-[#690B1B]">United States</span> 🇺🇸
                </h1>

                <p className="text-[14px] sm:text-[17px] text-[#555555] leading-[1.7] max-w-2xl mb-6 sm:mb-8">
                  The world&apos;s foremost destination for higher education. Explore top Ivy League, public flagship, and regional universities with full 24-parameter data: Common App essay prompts, SAT/GPA cutoffs, need-based aid, starting salaries, and 20-year ROI.
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
                  <a
                    href="#admissions-table"
                    className="h-[46px] sm:h-[50px] px-6 sm:px-8 rounded-[12px] bg-[#690B1B] text-white text-[13px] sm:text-[14px] font-bold hover:bg-[#7A1022] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>Explore Universities</span>
                    <span>↓</span>
                  </a>
                  <AuthCTALink className="h-[46px] sm:h-[50px] px-6 sm:px-8 rounded-[12px] bg-white border border-[#DDD7CE] text-[#111] text-[13px] sm:text-[14px] font-bold hover:border-[#690B1B] hover:text-[#690B1B] transition-all flex items-center gap-2">
                    <span>AI Chance-Me Estimator</span>
                    <span>→</span>
                  </AuthCTALink>
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-5 border-t border-[#EAE5DF]">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['/logo.png', '/logo.png', '/logo.png'].map((src, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-[#E5E0D9] border-2 border-white overflow-hidden">
                          <img src={src} alt="Student avatar" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111]">18,000+ Students Placed</div>
                      <div className="text-[11px] text-[#777]">96.8% F-1 Visa Approval Rate</div>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-[#E5E0D9] hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#444]">
                    <span className="text-[#C9A55D]">★★★★★</span>
                    <span>4.9/5 Student Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column — Snapshot Card */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div className="bg-white border border-[#E5E0D9] rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10">
                  <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#F0ECE7]">
                    <div className="flex items-center gap-3">
                      <span className="text-[26px] sm:text-[32px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-xl border border-[#E8C4CC] shrink-0">US</span>
                      <div>
                        <h2 className="text-[16px] sm:text-[18px] font-bold text-[#111]">USA Admissions Snapshot</h2>
                        <p className="text-[11px] sm:text-[12px] text-[#777]">24-Point Comprehensive Metric</p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] px-2.5 sm:px-3 py-1 rounded-full border border-[#A5D6A7] shrink-0">F-1 & OPT</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-5">
                    {[
                      { label: 'Universities', value: '180+' },
                      { label: 'STEM OPT Duration', value: '3 Years' },
                      { label: 'Avg. Need Grant', value: '$24K–$65K' },
                      { label: 'Tech Start Salary', value: '$115K+' },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] sm:rounded-[14px] p-3 sm:p-3.5">
                        <div className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-wider font-semibold">{s.label}</div>
                        <div className="text-[18px] sm:text-[20px] font-bold text-[#690B1B] mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-[#690B1B] to-[#8B1020] text-white rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-4 flex items-center justify-between gap-2 shadow-md">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Icon name="trend" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[13px] font-bold truncate">Free US Admissions Predictor</div>
                        <div className="text-[10px] sm:text-[11px] text-white/80 truncate">Calculate odds with your GPA & SAT</div>
                      </div>
                    </div>
                    <AuthCTALink className="text-[11px] sm:text-[12px] font-bold bg-white text-[#690B1B] px-3 sm:px-3.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors shrink-0">
                      Check Odds
                    </AuthCTALink>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-white border border-[#E2DDD7] rounded-[16px] p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 z-20 hidden md:flex">
                  <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                    <Icon name="work" className="w-4 h-4 text-[#2E7D32]" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-[12px] font-bold text-[#111]">3-Year STEM OPT</div>
                    <div className="text-[10px] text-[#777]">Post-graduation work</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-3 bg-white border border-[#E2DDD7] rounded-[16px] px-3.5 py-2 shadow-lg flex items-center gap-2 z-20 hidden md:flex">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1565C0] shrink-0" />
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#111]">Common App Ready</span>
                </div>
              </div>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-4 border-t border-[#EAE5DF]">
              {[
                { value: '180+', label: 'Accredited US Universities' },
                { value: '$24K–$65K', label: 'Average Need-Based Grants' },
                { value: '36 Months', label: 'STEM OPT Work Authorization' },
                { value: '1,000,000+', label: 'International Students Enrolled' },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-[#E8E3DD] rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#690B1B]/40 transition-colors">
                  <div className="text-[18px] sm:text-[22px] md:text-[26px] font-bold text-[#690B1B] leading-tight mb-1">{s.value}</div>
                  <div className="text-[10px] sm:text-[12px] text-[#666666] font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STICKY SECTION NAV ══════════════════════════════════════ */}
        <div className="sticky top-[68px] sm:top-[84px] md:top-[92px] z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E2DE] overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-3 sm:px-8 flex items-center justify-start md:justify-center">
            {[
              { id: 'admissions-table', label: 'University Dataset' },
              { id: 'why', label: 'Why USA' },
              { id: 'costs', label: 'Study Costs' },
              { id: 'scholarships', label: 'Scholarships' },
              { id: 'visa', label: 'F-1 Visa Guide' },
            ].map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 h-[44px] sm:h-[48px] px-3.5 sm:px-5 flex items-center text-[12px] sm:text-[13px] font-semibold text-[#666] hover:text-[#690B1B] border-b-2 border-transparent hover:border-[#690B1B] transition-all whitespace-nowrap"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ══ USA ADMISSIONS HUB (24 DATASET COLUMNS CENTERPIECE) ═════ */}
        <USAAdmissionsTable universities={USA_UNIVERSITIES} />

        {/* ══ WHY STUDY IN USA ════════════════════════════════════════ */}
        <section id="why" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F6F4F2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Global Leader</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">
              Why study in the United States?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {WHY_STUDY_USA.map((item, i) => (
                <div key={i} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-7 hover:border-[#690B1B]/40 hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start gap-3.5 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0 shadow-sm">
                        <Icon name={item.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="text-[20px] sm:text-[26px] font-bold text-[#690B1B] leading-tight">{item.stat}</div>
                    </div>
                    <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111] mb-1.5 sm:mb-2">{item.title}</h3>
                    <p className="text-[12px] sm:text-[13px] text-[#777] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STUDY COSTS BY METRO REGION ═════════════════════════════ */}
        <section id="costs" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Living Expenses</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2 sm:mb-3">
              Cost of Living Across US University Metros
            </h2>
            <p className="text-[#727272] text-[13px] mb-4">Monthly estimates in USD. Room & board can vary widely between campus dorms and off-campus housing.</p>
            <div className="text-[11px] text-[#888] sm:hidden mb-2 font-medium flex items-center gap-1">
              <span>↔ Swipe table to view all city expenses</span>
            </div>

            <div className="overflow-x-auto rounded-[16px] border border-[#E7E2DE] scrollbar-hide shadow-2xs">
              <table className="w-full text-[12px] sm:text-[14px] min-w-[500px]">
                <thead>
                  <tr className="bg-white border-b border-[#E7E2DE]">
                    {['City / Metro', 'Rent / Dorm', 'Food & Meals', 'Transport & Personal', 'Total / Month'].map((h, i) => (
                      <th
                        key={h}
                        className={`py-3.5 font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.08em] ${
                          i === 0
                            ? 'text-left px-4 sm:px-5 text-[#444]'
                            : `text-center px-3 sm:px-4 ${h === 'Total / Month' ? 'text-[#690B1B]' : 'text-[#444]'}`
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { city: 'New York City, NY (Columbia / NYU)', rent: '$1,850', food: '$550', transport: '$220', total: '$2,620' },
                    { city: 'SF Bay Area / Silicon Valley (Stanford / Berkeley)', rent: '$1,900', food: '$520', transport: '$180', total: '$2,600' },
                    { city: 'Boston / Cambridge, MA (MIT / Harvard)', rent: '$1,700', food: '$500', transport: '$160', total: '$2,360' },
                    { city: 'Ann Arbor, MI (UMich)', rent: '$1,150', food: '$420', transport: '$120', total: '$1,690' },
                    { city: 'Austin, TX (UT Austin)', rent: '$1,200', food: '$430', transport: '$130', total: '$1,760' },
                    { city: 'Pittsburgh, PA (Carnegie Mellon)', rent: '$1,050', food: '$410', transport: '$110', total: '$1,570' },
                    { city: 'Scranton, PA (Marywood University)', rent: '$880', food: '$380', transport: '$90', total: '$1,350' },
                    { city: 'West Lafayette, IN (Purdue University)', rent: '$820', food: '$370', transport: '$80', total: '$1,270' },
                  ].map((c, i, arr) => (
                    <tr key={c.city} className={`hover:bg-[#FAF8F8] transition-colors ${i < arr.length - 1 ? 'border-b border-[#F0EDED]' : ''}`}>
                      <td className="px-4 sm:px-5 py-3.5 font-semibold text-[#111]">{c.city}</td>
                      <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{c.rent}</td>
                      <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{c.food}</td>
                      <td className="px-3 sm:px-4 py-3.5 text-center text-[#555]">{c.transport}</td>
                      <td className="px-3 sm:px-4 py-3.5 text-center font-bold text-[#690B1B]">{c.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-5 bg-[#EFF5FF] border border-[#BFDBFE] rounded-[14px] flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1565C0]/10 flex items-center justify-center shrink-0">
                <Icon name="money" className="w-5 h-5 text-[#1565C0]" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1565C0] mb-1">On-Campus Employment & CPT Work Authorization</div>
                <p className="text-[12px] sm:text-[13px] text-[#1565C0]/80 leading-relaxed">
                  F-1 visa students are legally authorized to work <strong>up to 20 hours per week on-campus</strong> during academic semesters and full-time (40 hours/week) during official vacation periods. Additionally, Curricular Practical Training (CPT) permits paid internships integrated directly into your degree curriculum.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SCHOLARSHIPS ════════════════════════════════════════════ */}
        <section id="scholarships" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F7F5F3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Funding Your Degree</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">Scholarships & Financial Aid for the USA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {USA_SCHOLARSHIPS.map((s) => (
                <div key={s.name} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-6 hover:border-[#690B1B]/40 hover:shadow-md transition-all flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 mb-3.5">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${s.fundingType === 'Full' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'bg-[#FFF3E0] text-[#E65100]'}`}>
                      {s.fundingType === 'Full' ? '✓ Fully Funded' : '◐ Partially Funded'}
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full ${s.type === 'Government' ? 'bg-[#EFF5FF] text-[#1565C0]' : s.type === 'University' ? 'bg-[#F3E5F5] text-[#6A1B9A]' : 'bg-[#FFF8E6] text-[#E65100]'}`}>{s.type}</span>
                    <span className="text-[10px] font-medium text-[#888] bg-[#F6F4F2] px-2.5 py-1 rounded-full ml-auto">{s.degreeLevel}</span>
                  </div>
                  <h3 className="text-[15px] sm:text-[17px] font-bold text-[#111] mb-1">{s.name}</h3>
                  <div className="text-[11px] sm:text-[12px] text-[#999] mb-3">{s.funder}</div>
                  <div className="bg-[#F7F0F1] rounded-[10px] px-3.5 py-2.5 mb-3.5">
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#690B1B]">{s.amount}</span>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#666] leading-relaxed flex-1 mb-4">{s.eligibility}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-3 border-t border-[#F0EDED]">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-[#999]">
                      <Icon name="calendar" className="w-4 h-4 text-[#999] shrink-0" />
                      <span>Deadline: <strong className="text-[#555]">{s.deadline}</strong></span>
                    </div>
                    <a
                      href={s.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-[36px] sm:h-[34px] px-5 rounded-[8px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-all flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto"
                    >
                      Apply ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ F-1 VISA GUIDE (DARK THEME) ═════════════════════════════ */}
        <section id="visa" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#111217]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Visa Roadmap</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-white mb-6 sm:mb-10">
              US F-1 Student Visa — Step-by-Step Guide
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {F1_VISA_STEPS.map((step, i) => (
                <div key={step.step} className={`rounded-[16px] p-5 sm:p-6 border transition-all ${i === 0 ? 'bg-[#690B1B] border-[#690B1B]' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}>
                  <div className={`text-[28px] sm:text-[34px] font-bold mb-3 sm:mb-4 leading-none ${i === 0 ? 'text-white/20' : 'text-white/10'}`}>{step.step}</div>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                  <p className={`text-[12px] sm:text-[13px] leading-relaxed ${i === 0 ? 'text-white/75' : 'text-[#6E7380]'}`}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-[16px] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A55D]/20 flex items-center justify-center shrink-0">
                <Icon name="trophy" className="w-5 h-5 text-[#C9A55D]" />
              </div>
              <div>
                <div className="text-[13px] sm:text-[14px] font-bold text-[#C9A55D] mb-1">Section 214(b) & Proof of Financial Capability</div>
                <p className="text-[12px] sm:text-[13px] text-[#9CA3AF] leading-relaxed">
                  During the F-1 visa interview, consular officers assess applicant non-immigrant intent under INA Section 214(b). Always bring comprehensive bank statements, scholarship letters, and tax returns proving liquid funds for at least the full first year of tuition and living expenses listed on your Form I-20.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA SECTION ═════════════════════════════════════════════ */}
        <section className="bg-[#73061C] px-4 sm:px-8 py-12 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] uppercase font-bold mb-3 sm:mb-5">Launch Your US Application</div>
            <h2 className="text-white font-bold tracking-[-0.05em] leading-[1.08] text-[26px] sm:text-[46px] md:text-[56px] mb-4 sm:mb-6">
              Start your journey to the{' '}
              <span className="text-[#C8A15D] italic">United States 🇺🇸</span>
            </h2>
            <p className="text-[#D6AEB7] text-[13px] sm:text-[16px] leading-[1.8] sm:leading-[1.9] max-w-[580px] mx-auto mb-8 sm:mb-10">
              Shortlist top colleges with SAT/GPA cutoffs, compare need-based aid packages, optimize your Common App essay, and prepare your F-1 visa documentation — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <AuthCTALink className="h-[48px] sm:h-[58px] px-7 sm:px-10 rounded-[14px] bg-white text-[#5B0819] text-[14px] sm:text-[17px] font-bold hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg w-full sm:w-auto">
                Get Started Free →
              </AuthCTALink>
              <Link href="/#universities" className="h-[48px] sm:h-[58px] px-7 sm:px-10 rounded-[14px] border border-white/20 text-white text-[14px] sm:text-[17px] font-semibold hover:bg-white/10 transition-all flex items-center justify-center w-full sm:w-auto">
                ← Explore Other Countries
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
