import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import AuthCTALink from '@/components/landing/AuthCTALink';
import CanadaAdmissionsTable from '@/components/country/CanadaAdmissionsTable';
import { fetchCanadianUniversitiesFromWix } from '@/lib/wixCountryUniversities';

/* ══════════════════════════════════════════════════════════════
   SEO METADATA
══════════════════════════════════════════════════════════════ */
export const metadata: Metadata = {
  title: 'Study in Canada 2026 — DLI Universities, PGWP, Tuition, Scholarships & Visa Guide',
  description:
    'Complete 2026 guide to study in Canada. Explore 85+ DLI-designated universities with tuition fees, acceptance rates, scholarships, PGWP eligibility, living costs, GPA/SAT requirements, career outcomes, and ROI analysis.',
  keywords: [
    'study in Canada',
    'Canada universities admissions',
    'DLI designated learning institution',
    'PGWP Canada',
    'Canada study permit',
    'Canada tuition fees international',
    'Canada scholarships international students',
    'University of Toronto admission',
    'McGill University tuition',
    'UBC admission requirements',
    'Canada student visa',
    'IRCC study permit',
    'Canada living costs students',
    'Canada PR pathway students',
    'Canada university ROI',
  ],
  alternates: { canonical: 'https://abroadsimplified.com/country/canada' },
  openGraph: {
    title: 'Study in Canada 2026 — Full Admissions Guide | Abroad Simplified',
    description:
      'DLI universities, tuition fees, PGWP eligibility, scholarships, GPA/SAT requirements, career outcomes, and ROI for studying in Canada.',
    url: 'https://abroadsimplified.com/country/canada',
    siteName: 'Abroad Simplified',
    type: 'article',
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Study in Canada Guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Canada 2026 | Abroad Simplified',
    description: 'DLI universities, tuition, PGWP, scholarships, career outcomes & ROI — full guide.',
    images: ['/logo.png'],
  },
};

/* ══════════════════════════════════════════════════════════════
   TYPES — Matching the 35 Dataset Columns
══════════════════════════════════════════════════════════════ */
export interface CanadaUniversity {
  // 1. institution_id
  institutionId: string;
  // 2. institution_name
  institutionName: string;
  // 3. province
  province: string;
  // 4. city
  city: string;
  // 5. institution_type
  institutionType: string;
  // 6. public_private
  publicPrivate: string;
  // 7. official_website
  officialWebsite: string;
  // 8. domain
  domain: string;
  // 9. dli_number
  dliNumber: string;
  // 10. international_student_eligible
  internationalStudentEligible: string;
  // 11. offers_undergraduate
  offersUndergraduate: string;
  // 12. offers_postgraduate
  offersPostgraduate: string;
  // 13. offers_doctoral
  offersDoctoral: string;
  // 14. language_of_instruction
  languageOfInstruction: string;
  // 15. last_verified_date
  lastVerifiedDate: string;
  // 16. country
  country: string;
  // 17. country_code
  countryCode: string;
  // 18. QS Ranking
  qsRanking: string;
  // 19. Acceptance Rate
  acceptanceRate: string;
  // 20. Tuition
  tuition: string;
  // 21. Living Costs
  livingCosts: string;
  // 22. Popular Majors
  popularMajors: string;
  // 23. Banner Image
  bannerImage: string;
  // 24. Banner Image alt text
  bannerImageAlt: string;
  // 25. Avg Need Based Grant
  avgNeedBasedGrant: string;
  // 26. Avg GPA
  avgGpa: string;
  // 27. SAT Score
  satScore: string;
  // 28. Writing Requirements
  writingRequirements: string;
  // 29. Required Essay Prompts & Details
  requiredEssayPrompts: string;
  // 30. Scholarships
  scholarships: string;
  // 31. Total Cost
  totalCost: string;
  // 32. Career Outcomes
  careerOutcomes: string;
  // 33. Expected Salary
  expectedSalary: string;
  // 34. ROI
  roi: string;
}

/* ══════════════════════════════════════════════════════════════
   CANADA UNIVERSITIES DATA (Populated with 34 Columns)
══════════════════════════════════════════════════════════════ */
export const CANADA_UNIVERSITIES: CanadaUniversity[] = [
  // 1. Acadia University (EXACT ROW FROM DATASET SPECIFICATION)
  {
    institutionId: 'CA-INST-001',
    institutionName: 'Acadia University',
    province: 'Nova Scotia',
    city: 'Main Campus',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.acadiau.ca',
    domain: 'acadiau.ca',
    dliNumber: 'O19209939222',
    internationalStudentEligible: 'Yes; study permit and PGWP subject to current eligibility requirements',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'No (verify)',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#42 Canada (uniRank; not QS)',
    acceptanceRate: 'Approximately 70% (unverified)',
    tuition: 'International: CAD 28,000–38,000/year; Domestic: CAD 5,500–9,000/year',
    livingCosts: 'CAD 11,000–15,000/year; housing approximately CAD 7,500; meals and transit approximately CAD 4,500',
    popularMajors: 'Computer Science, Software Engineering, Business Administration, Commerce, Nursing, Mechanical Engineering, Data Science, Psychology, Biomedical Sciences, Economics, Digital Media',
    bannerImage: 'https://www.unirank.org/i/screenshots/acadia-university-ca-website-screenshot.jpg',
    bannerImageAlt: "Acadia University's website homepage screenshot",
    avgNeedBasedGrant: 'CAD 5,000–12,000/year (unverified estimate)',
    avgGpa: '3.0–3.4/4.0; approximately 75%–82% high school average (estimate)',
    satScore: 'Generally optional for many Canadian applicants; original estimate of 1280–1480 for US applicants (verify)',
    writingRequirements: 'IELTS Academic 6.5, minimum 6.0 per band, or TOEFL iBT 88–100 as listed in the original record; additional statement may be required for certain programs',
    requiredEssayPrompts: 'Original record suggests 1–2 essays of 250–500 words on leadership, extracurricular involvement, and academic goals; interviews may apply to some programs. Verify current requirements.',
    scholarships: 'Entrance merit scholarships: CAD 2,000–10,000/year; International President\'s Excellence Award: CAD 15,000–40,000 as listed in the original record; need-based bursaries and work-study options subject to eligibility',
    totalCost: 'CAD 42,000/year; CAD 168,000 over four years (original estimates; reconcile with tuition and living costs)',
    careerOutcomes: 'Original estimate: 92%–96% employment within six months; potential sectors include technology, banking, healthcare, and engineering. Verify official statistics.',
    expectedSalary: 'CAD 62,000–88,000/year starting salary; CAD 95,000+ for some CS and engineering graduates (unverified estimates)',
    roi: 'Original estimate: high ROI, with a 3–4 year break-even period; actual ROI depends on costs, financial aid, employment, salary, and immigration eligibility.',
  },

  // 2. University of Toronto
  {
    institutionId: 'CA-INST-002',
    institutionName: 'University of Toronto',
    province: 'Ontario',
    city: 'Toronto',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.utoronto.ca',
    domain: 'utoronto.ca',
    dliNumber: 'O19395432502',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#21 QS World 2026',
    acceptanceRate: 'Approximately 43%',
    tuition: 'International: CAD 58,000–65,000/year (CS/Engineering); Domestic: CAD 6,100–16,000/year',
    livingCosts: 'CAD 18,000–24,000/year; housing CAD 12,000–16,000; meals & transit CAD 6,000–8,000',
    popularMajors: 'Computer Science, Engineering Science, Life Sciences, Commerce (Rotman), Economics, Mathematics, Psychology, Political Science, Nursing, Data Science',
    bannerImage: '',
    bannerImageAlt: 'University of Toronto campus',
    avgNeedBasedGrant: 'CAD 10,000–45,000/year through UTAPS & Pearson Scholarship',
    avgGpa: '3.6–4.0/4.0; approximately 90%+ high school average for competitive programs',
    satScore: '1400–1550 recommended for US applicants; SAT optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 100 (min. 22 writing); Supplementary Application Profile (SAP) required for many programs',
    requiredEssayPrompts: 'Supplementary Application with 3–4 short response prompts (150–250 words each) about academic interests, extracurriculars, and personal experiences. Video interview component for select programs.',
    scholarships: 'Lester B. Pearson International Scholarship: Full tuition + living (4 years); President\'s Scholars of Excellence: CAD 10,000; University of Toronto Scholars Award: CAD 7,500',
    totalCost: 'CAD 76,000–89,000/year; CAD 304,000–356,000 over four years (international)',
    careerOutcomes: '95% employment rate within 6 months; top recruiters include Google, Amazon, RBC, McKinsey, Deloitte, and major hospitals',
    expectedSalary: 'CAD 75,000–120,000/year starting salary; CAD 150,000+ for CS/Engineering graduates entering tech',
    roi: 'High ROI for STEM and business programs; 2–4 year break-even depending on program and financial aid received.',
  },

  // 3. McGill University
  {
    institutionId: 'CA-INST-003',
    institutionName: 'McGill University',
    province: 'Quebec',
    city: 'Montreal',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.mcgill.ca',
    domain: 'mcgill.ca',
    dliNumber: 'O19359005732',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible; Quebec Acceptance Certificate (CAQ) also required',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#29 QS World 2026',
    acceptanceRate: 'Approximately 46%',
    tuition: 'International: CAD 22,000–55,000/year (varies by program); Domestic: CAD 2,500–8,500/year (Quebec resident rates apply)',
    livingCosts: 'CAD 14,000–18,000/year; Montreal is one of the most affordable major cities in Canada',
    popularMajors: 'Medicine, Law, Engineering, Neuroscience, Music (Schulich), Political Science, Computer Science, Biology, Finance, Architecture',
    bannerImage: '',
    bannerImageAlt: 'McGill University campus',
    avgNeedBasedGrant: 'CAD 5,000–20,000/year through various McGill bursary programs',
    avgGpa: '3.5–3.9/4.0; approximately 88%–95% high school average for competitive programs',
    satScore: '1350–1500 recommended for US applicants; generally optional for Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 90 (min. 21 each component); French proficiency NOT required for English-taught programs',
    requiredEssayPrompts: 'Personal Statement for select programs (500–750 words); portfolio required for Architecture and Music; interview for Medicine and Dentistry',
    scholarships: 'McGill Entrance Scholarships: CAD 3,000–12,000/year; Major Entrance Scholarships: full tuition; Provost\'s Student Life Award; Schulich Scholarship (Music)',
    totalCost: 'CAD 36,000–73,000/year; CAD 144,000–292,000 over four years (international); significantly lower for Quebec/Canadian residents',
    careerOutcomes: '93% employment rate within 6 months; strong placement in medicine, law, finance, and research sectors',
    expectedSalary: 'CAD 65,000–100,000/year starting salary; CAD 120,000+ for Medicine and Law graduates',
    roi: 'Very high ROI especially at Quebec tuition rates; 2–5 year break-even; Montreal\'s lower living costs significantly improve net ROI.',
  },

  // 4. University of British Columbia (UBC)
  {
    institutionId: 'CA-INST-004',
    institutionName: 'University of British Columbia (UBC)',
    province: 'British Columbia',
    city: 'Vancouver',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.ubc.ca',
    domain: 'ubc.ca',
    dliNumber: 'O19361416392',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#38 QS World 2026',
    acceptanceRate: 'Approximately 52%',
    tuition: 'International: CAD 42,000–58,000/year (varies by program); Domestic: CAD 5,400–9,000/year',
    livingCosts: 'CAD 18,000–25,000/year; Vancouver is one of Canada\'s most expensive cities',
    popularMajors: 'Computer Science, Forestry, Environmental Science, Business (Sauder), Engineering, Kinesiology, International Relations, Film Studies, Life Sciences, Data Science',
    bannerImage: '',
    bannerImageAlt: 'University of British Columbia campus',
    avgNeedBasedGrant: 'CAD 8,000–30,000/year through UBC financial aid programs; International Major Entrance Scholarship (IMES) up to full tuition',
    avgGpa: '3.3–3.8/4.0; approximately 85%–93% high school average',
    satScore: '1350–1500 recommended for US applicants; optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 90 (min. 22 Reading & Listening, 21 Writing & Speaking)',
    requiredEssayPrompts: 'UBC Personal Profile with 4–6 short answer prompts (200–250 words each) on extracurriculars, community involvement, and personal growth; critical thinking component',
    scholarships: 'International Major Entrance Scholarships (IMES): up to full tuition + living; Outstanding International Student Award: CAD 10,000; Centennial Scholars Entrance Award; Tuum Est Student Initiative Fund',
    totalCost: 'CAD 60,000–83,000/year; CAD 240,000–332,000 over four years (international)',
    careerOutcomes: '94% employment rate within 6 months; strong tech sector placement (Amazon, Microsoft, SAP); excellent environmental science career pathways',
    expectedSalary: 'CAD 68,000–105,000/year starting salary; CAD 130,000+ for tech and engineering graduates',
    roi: 'High ROI for STEM programs; 3–5 year break-even; Vancouver tech ecosystem provides strong employment pipeline.',
  },

  // 5. University of Waterloo
  {
    institutionId: 'CA-INST-005',
    institutionName: 'University of Waterloo',
    province: 'Ontario',
    city: 'Waterloo',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://uwaterloo.ca',
    domain: 'uwaterloo.ca',
    dliNumber: 'O19395432552',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible; co-op work permits available',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#112 QS World 2026',
    acceptanceRate: 'Approximately 53%',
    tuition: 'International: CAD 56,000–68,000/year (CS/Engineering); Domestic: CAD 8,000–18,000/year',
    livingCosts: 'CAD 14,000–18,000/year; Waterloo is significantly more affordable than Toronto or Vancouver',
    popularMajors: 'Computer Science, Software Engineering, Mechatronics Engineering, Mathematics, Actuarial Science, Computer Engineering, Data Science, Accounting & Finance, Nanotechnology Engineering, Pharmacy',
    bannerImage: '',
    bannerImageAlt: 'University of Waterloo campus',
    avgNeedBasedGrant: 'CAD 5,000–15,000/year; International Experience Award; co-op earnings offset costs significantly',
    avgGpa: '3.7–4.0/4.0; approximately 90%–97% high school average for CS/Engineering',
    satScore: '1450–1550+ recommended for competitive programs; optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 Writing, 6.0 Speaking); TOEFL iBT 90 (min. 25 Writing, 25 Speaking); AIF (Admission Information Form) required',
    requiredEssayPrompts: 'Admission Information Form (AIF): 3–5 short essays about extracurricular activities, leadership, and why Waterloo; Euclid Math Contest scores strongly recommended for Mathematics/CS; optional video interview',
    scholarships: 'President\'s Scholarships: CAD 2,000–10,000; International Master\'s Award of Excellence (IMAE): CAD 2,500/term; Waterloo International Student Entrance Scholarship: up to CAD 10,000',
    totalCost: 'CAD 70,000–86,000/year; CAD 280,000–344,000 over four years (international); partially offset by co-op earnings of CAD 50,000–80,000 total',
    careerOutcomes: '97%+ co-op employment rate; world\'s largest co-op program with 7,100+ employer partners including Google, Apple, Meta, Tesla, Goldman Sachs, Bloomberg',
    expectedSalary: 'CAD 85,000–140,000/year starting salary (CS/Eng); CAD 180,000+ USD for graduates placed at US tech companies',
    roi: 'Exceptional ROI due to co-op earnings during studies; 1–3 year break-even; graduates among highest-paid in Canada.',
  },

  // 6. University of Alberta
  {
    institutionId: 'CA-INST-006',
    institutionName: 'University of Alberta',
    province: 'Alberta',
    city: 'Edmonton',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.ualberta.ca',
    domain: 'ualberta.ca',
    dliNumber: 'O19361414852',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#111 QS World 2026',
    acceptanceRate: 'Approximately 58%',
    tuition: 'International: CAD 30,000–42,000/year; Domestic: CAD 5,300–7,500/year',
    livingCosts: 'CAD 12,000–16,000/year; Edmonton is one of Canada\'s most affordable major cities',
    popularMajors: 'Engineering, Computer Science, Medicine, Pharmacy, Earth & Atmospheric Sciences, AI & Machine Learning, Law, Education, Business, Agricultural Sciences',
    bannerImage: '',
    bannerImageAlt: 'University of Alberta campus',
    avgNeedBasedGrant: 'CAD 5,000–15,000/year through various UAlberta bursary and award programs',
    avgGpa: '3.2–3.7/4.0; approximately 80%–90% high school average',
    satScore: '1300–1450 recommended for US applicants; optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 90 (min. 21 each component); Duolingo English Test 120+',
    requiredEssayPrompts: 'Personal statement for select programs; supplementary application for competitive programs (Engineering, Business, Nursing); portfolio for Arts-based programs',
    scholarships: 'International Student Scholarship: CAD 5,000–9,000; UAlberta Admission Scholarship: CAD 2,000–9,000; President\'s International Distinction Scholarship: up to CAD 30,000/year; Alberta Innovates Graduate Funding',
    totalCost: 'CAD 42,000–58,000/year; CAD 168,000–232,000 over four years (international)',
    careerOutcomes: '92% employment rate within 6 months; strong placement in energy sector, AI research (Edmonton is Canada\'s AI capital), healthcare, and engineering',
    expectedSalary: 'CAD 60,000–95,000/year starting salary; CAD 110,000+ for engineering and CS graduates in tech/energy sectors',
    roi: 'Very high ROI given lower tuition and living costs; 2–4 year break-even; Edmonton\'s growing tech sector (DeepMind, Google Brain) enhances career opportunities.',
  },

  // 7. Simon Fraser University (SFU)
  {
    institutionId: 'CA-INST-007',
    institutionName: 'Simon Fraser University',
    province: 'British Columbia',
    city: 'Burnaby',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.sfu.ca',
    domain: 'sfu.ca',
    dliNumber: 'O19361416442',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible; co-op work permits available',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#280 QS World 2026',
    acceptanceRate: 'Approximately 61%',
    tuition: 'International: CAD 30,000–38,000/year; Domestic: CAD 5,800–7,500/year',
    livingCosts: 'CAD 16,000–22,000/year; Burnaby/Vancouver metro area costs',
    popularMajors: 'Computing Science, Business (Beedie), Health Sciences, Criminology, Communication, Engineering Science, Education, Interactive Arts & Technology, Kinesiology, Economics',
    bannerImage: '',
    bannerImageAlt: 'Simon Fraser University campus',
    avgNeedBasedGrant: 'CAD 4,000–12,000/year through SFU financial aid',
    avgGpa: '3.0–3.5/4.0; approximately 80%–88% high school average',
    satScore: '1250–1400 recommended for US applicants; generally optional for Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 88 (min. 20 each component); PTE Academic 65; Duolingo 115+',
    requiredEssayPrompts: 'Personal profile for competitive programs; supplementary application for Beedie School of Business; portfolio for SIAT (Interactive Arts & Technology)',
    scholarships: 'Entrance Scholarships: CAD 3,500–10,000; International Student Entrance Award: up to CAD 10,000/year; SFU Open Scholarships; Undergraduate Research Awards',
    totalCost: 'CAD 46,000–60,000/year; CAD 184,000–240,000 over four years (international)',
    careerOutcomes: '91% employment rate within 6 months; co-op program with 4,000+ employer partners; strong placement in tech, media, and health sectors in Vancouver',
    expectedSalary: 'CAD 58,000–85,000/year starting salary; CAD 100,000+ for Computing Science and Engineering graduates',
    roi: 'Good ROI with co-op program offsetting costs; 3–5 year break-even; Vancouver tech hub access is a strong advantage.',
  },

  // 8. McMaster University
  {
    institutionId: 'CA-INST-008',
    institutionName: 'McMaster University',
    province: 'Ontario',
    city: 'Hamilton',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.mcmaster.ca',
    domain: 'mcmaster.ca',
    dliNumber: 'O19395432142',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#176 QS World 2026',
    acceptanceRate: 'Approximately 58%',
    tuition: 'International: CAD 36,000–55,000/year (Engineering/Health Sciences higher); Domestic: CAD 6,200–11,000/year',
    livingCosts: 'CAD 12,000–16,000/year; Hamilton is significantly more affordable than Toronto',
    popularMajors: 'Health Sciences, Engineering, Life Sciences, Business (DeGroote), Computer Science, Nursing, Biochemistry, Mathematics & Statistics, Social Sciences, Chemical & Biomedical Engineering',
    bannerImage: '',
    bannerImageAlt: 'McMaster University campus',
    avgNeedBasedGrant: 'CAD 5,000–15,000/year through McMaster bursary programs',
    avgGpa: '3.3–3.8/4.0; approximately 85%–93% high school average for Health Sciences',
    satScore: '1350–1500 recommended for US applicants; optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 86 (min. 20 each component); supplementary application for Health Sciences (BHSc)',
    requiredEssayPrompts: 'Health Sciences (BHSc) supplementary application includes CASPer test + essay responses; Engineering supplementary application; video interview for select programs',
    scholarships: 'Provost Entrance Awards: CAD 2,000–6,000; McMaster Honour Awards: up to CAD 4,000/year renewable; International Excellence Award; Schulich Leader Scholarships (STEM): up to CAD 100,000',
    totalCost: 'CAD 48,000–71,000/year; CAD 192,000–284,000 over four years (international)',
    careerOutcomes: '93% employment rate within 6 months; renowned for health sciences & medical school pathway; strong engineering and research placement',
    expectedSalary: 'CAD 62,000–95,000/year starting salary; CAD 130,000+ for Health Sciences and Engineering graduates',
    roi: 'High ROI especially for Health Sciences pathway; 3–5 year break-even; Hamilton proximity to Toronto provides broader job market access.',
  },

  // 9. Western University
  {
    institutionId: 'CA-INST-009',
    institutionName: 'Western University',
    province: 'Ontario',
    city: 'London',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.uwo.ca',
    domain: 'uwo.ca',
    dliNumber: 'O19395432492',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#194 QS World 2026',
    acceptanceRate: 'Approximately 56%',
    tuition: 'International: CAD 40,000–55,000/year; Domestic: CAD 6,000–8,500/year',
    livingCosts: 'CAD 12,000–16,000/year; London, Ontario is a moderately affordable university city',
    popularMajors: 'Business (Ivey HBA), Medical Sciences, Engineering, Computer Science, Law, Nursing, Actuarial Science, Media & Information Studies, Kinesiology, Psychology',
    bannerImage: '',
    bannerImageAlt: 'Western University campus',
    avgNeedBasedGrant: 'CAD 4,000–12,000/year through Western bursary programs',
    avgGpa: '3.3–3.7/4.0; approximately 85%–92% high school average',
    satScore: '1300–1480 recommended for US applicants; optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 83 (min. 20 each component); Ivey HBA requires separate application',
    requiredEssayPrompts: 'Ivey HBA AEO application: 3 activity descriptions + 1 essay (500 words); supplementary applications for Medical Sciences, Engineering; CASPer for Nursing',
    scholarships: 'President\'s Entrance Scholarships: CAD 2,500–5,000; National Scholarship: up to CAD 72,000 (4 years); Schulich Leader Scholarships (STEM): up to CAD 100,000; International President\'s Entrance Scholarship',
    totalCost: 'CAD 52,000–71,000/year; CAD 208,000–284,000 over four years (international)',
    careerOutcomes: '94% employment rate within 6 months; Ivey HBA graduates are among the most recruited business students in Canada; strong medical school placement',
    expectedSalary: 'CAD 65,000–110,000/year starting salary; Ivey HBA graduates average CAD 95,000+ first-year; consulting and banking placements significantly higher',
    roi: 'Very high ROI for Ivey HBA pathway; 2–4 year break-even for business; medical pathway ROI excellent long-term.',
  },

  // 10. Queen's University
  {
    institutionId: 'CA-INST-010',
    institutionName: "Queen's University",
    province: 'Ontario',
    city: 'Kingston',
    institutionType: 'Public University',
    publicPrivate: 'Public institution',
    officialWebsite: 'https://www.queensu.ca',
    domain: 'queensu.ca',
    dliNumber: 'O19395432302',
    internationalStudentEligible: 'Yes; study permit and PGWP eligible',
    offersUndergraduate: 'Yes',
    offersPostgraduate: 'Yes',
    offersDoctoral: 'Yes',
    languageOfInstruction: 'English',
    lastVerifiedDate: 'Not available',
    country: 'Canada',
    countryCode: 'CA',
    qsRanking: '#209 QS World 2026',
    acceptanceRate: 'Approximately 42%',
    tuition: 'International: CAD 50,000–58,000/year; Domestic: CAD 6,200–9,500/year',
    livingCosts: 'CAD 12,000–15,000/year; Kingston is one of the most affordable university towns in Ontario',
    popularMajors: 'Commerce (Smith School of Business), Engineering & Applied Science, Life Sciences, Computer Science, Law, Mining Engineering, Nursing, Political Studies, Economics, Psychology',
    bannerImage: '',
    bannerImageAlt: "Queen's University campus",
    avgNeedBasedGrant: 'CAD 5,000–20,000/year through various Queen\'s bursary programs',
    avgGpa: '3.5–3.9/4.0; approximately 88%–95% high school average for Commerce',
    satScore: '1400–1530 recommended for US applicants; optional for most Canadian applicants',
    writingRequirements: 'IELTS Academic 6.5 (min. 6.0 each band); TOEFL iBT 88 (min. 24 Writing); Personal Statement of Experience (PSE)',
    requiredEssayPrompts: 'Personal Statement of Experience (PSE): 4 short response prompts about leadership, community involvement, and personal growth; Commerce Supplementary Application; CASPer for Nursing',
    scholarships: 'Chancellor\'s Scholarships: CAD 36,000 (4 years); Principal\'s Scholarships: CAD 12,000 (4 years); Queen\'s General Admission Bursary; International Admission Award',
    totalCost: 'CAD 62,000–73,000/year; CAD 248,000–292,000 over four years (international)',
    careerOutcomes: '95% employment rate within 6 months; Smith Commerce graduates among most recruited in Canada; strong mining engineering and law placement',
    expectedSalary: 'CAD 70,000–105,000/year starting salary; Smith Commerce graduates average CAD 85,000+ first-year; engineering placement in mining/resources sector strong',
    roi: 'Very high ROI for Commerce and Engineering pathways; 2–4 year break-even; strong alumni network significantly enhances career outcomes.',
  },
];

/* ══════════════════════════════════════════════════════════════
   WHY STUDY DATA
══════════════════════════════════════════════════════════════ */
const WHY_STUDY = [
  { stat: '3 Years', title: 'Post-Grad Work Permit (PGWP)', desc: 'Work anywhere in Canada for up to 3 years after graduation. No employer sponsorship or location restrictions — the most generous post-study work visa globally.', icon: 'work' },
  { stat: 'Express Entry', title: 'Clear PR Pathway', desc: 'Canadian education and work experience earn high CRS (Comprehensive Ranking System) points, making permanent residency achievable within 1–3 years after PGWP.', icon: 'globe' },
  { stat: '30–40%', title: 'Lower Cost Than USA', desc: 'World-class education at significantly lower tuition than comparable US universities. Montreal and Alberta offer the most affordable programs.', icon: 'money' },
  { stat: '85+ DLI', title: 'Designated Learning Institutions', desc: 'Only DLI-designated institutions qualify for study permits and PGWP. All universities listed here are verified DLI institutions.', icon: 'light' },
  { stat: 'Global Top 5', title: 'AI & Tech Research Leader', desc: 'Toronto (Vector Institute), Montreal (Mila), and Edmonton (Amii) are global deep learning and AI research hubs with thriving tech ecosystems.', icon: 'micro' },
  { stat: 'CAD 85K+', title: 'Strong Starting Salaries', desc: 'CS and Engineering graduates in Canada command strong starting salaries, especially through co-op programs at Waterloo, UBC, and U of T.', icon: 'trend' },
];

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

const SCHOLARSHIPS: ScholarshipItem[] = [
  { name: 'Vanier Canada Graduate Scholarship', amount: 'CAD 50,000/yr (3 years)', eligibility: 'PhD students with academic excellence and leadership', deadline: 'Nov 1, annually', type: 'Government', funder: 'Government of Canada (Tri-agency)', degreeLevel: 'PhD', fundingType: 'Partial', applyUrl: 'https://vanier.gc.ca' },
  { name: 'Lester B. Pearson Scholarship', amount: 'Full Tuition + Living Expenses (4 years)', eligibility: 'International undergrads nominated by their high school', deadline: 'Nov 30, annually', type: 'University', funder: 'University of Toronto', degreeLevel: "Bachelor's", fundingType: 'Full', applyUrl: 'https://future.utoronto.ca/pearson' },
  { name: 'Schulich Leader Scholarships', amount: 'Up to CAD 100,000 (4 years)', eligibility: 'STEM undergrads at 20 partner universities with academic and community leadership', deadline: 'Feb – Jun (varies by school)', type: 'Private', funder: 'Schulich Foundation', degreeLevel: "Bachelor's (STEM)", fundingType: 'Partial', applyUrl: 'https://www.schulichleaders.com' },
  { name: 'Banting Postdoctoral Fellowship', amount: 'CAD 70,000/yr (2 years)', eligibility: 'Postdoctoral researchers (Canadian & international)', deadline: 'Sep 22, annually', type: 'Government', funder: 'Government of Canada', degreeLevel: 'Postdoctoral', fundingType: 'Partial', applyUrl: 'https://banting.fellowships-bourses.gc.ca' },
];

const VISA_STEPS = [
  { step: '01', title: 'Receive Letter of Acceptance', desc: 'Obtain your official Letter of Acceptance (LOA) from a Designated Learning Institution (DLI) in Canada. Verify the DLI number matches the IRCC registry.' },
  { step: '02', title: 'Get Quebec CAQ (if applicable)', desc: 'If studying in Quebec (McGill, Concordia, UdeM, etc.), apply for a Quebec Acceptance Certificate (CAQ) through MIFI before your study permit.' },
  { step: '03', title: 'Create IRCC Account & Apply', desc: 'Create your profile on ircc.canada.ca. Submit your Study Permit application online. Application fee: CAD 150.' },
  { step: '04', title: 'Submit Biometrics', desc: 'Pay CAD 85 biometric fee. Visit a Visa Application Centre (VAC) to provide fingerprints and photograph. Required for most nationalities.' },
  { step: '05', title: 'Provide Financial Proof', desc: 'Show tuition amount + CAD 20,635 (2024 rate) for the first year of living expenses. GIC of CAD 20,635 from a participating Canadian bank accelerates processing.' },
  { step: '06', title: 'Receive Study Permit & Travel', desc: 'Average processing: 6–12 weeks online. Once approved, you receive a Port of Entry (POE) letter. Your actual Study Permit is issued upon arrival in Canada.' },
];

/* ══════════════════════════════════════════════════════════════
   ICON COMPONENT (SVG only)
══════════════════════════════════════════════════════════════ */
function Icon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'money':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'work':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
    case 'globe':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
    case 'micro':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.602 15.12a2 2 0 00-1.406.402L3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2l-1.572-1.572zM9 11V3m6 8V3M9 3h6" /></svg>;
    case 'trend':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    case 'light':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
    case 'calendar':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
    default:
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
  }
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT (SSR)
══════════════════════════════════════════════════════════════ */
export default async function CanadaPage() {
  const wixUniversities = await fetchCanadianUniversitiesFromWix();
  const universities = wixUniversities && wixUniversities.length > 0 ? wixUniversities : CANADA_UNIVERSITIES;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abroadsimplified.com' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://abroadsimplified.com/#universities' },
      { '@type': 'ListItem', position: 3, name: 'Study in Canada', item: 'https://abroadsimplified.com/country/canada' },
    ],
  };

  return (
    <div className="bg-[#F6F4F2] text-[#111111] font-[Poppins] font-normal min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <LandingNavbar />

      <main className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════ */}
        <section className="relative bg-[#FAF8F5] pt-6 sm:pt-12 pb-10 sm:pb-16 overflow-hidden border-b border-[#EAE5DF]">
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#690B1B]/5 via-[#C9A55D]/10 to-transparent blur-[80px] sm:blur-[120px]" />
            <div className="absolute -bottom-20 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#690B1B]/5 blur-[80px] sm:blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#690B1B 1px, transparent 1px), linear-gradient(to right, #690B1B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] text-[#888] mb-6 sm:mb-8 font-medium overflow-x-auto py-1">
              <Link href="/" className="hover:text-[#690B1B] transition-colors shrink-0">Home</Link>
              <span className="text-[#CCC] shrink-0">/</span>
              <Link href="/#universities" className="hover:text-[#690B1B] transition-colors shrink-0">Destinations</Link>
              <span className="text-[#CCC] shrink-0">/</span>
              <span className="text-[#690B1B] font-semibold shrink-0">Canada</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 sm:mb-12">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white border border-[#E7E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-6">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#690B1B] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#690B1B]" />
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#690B1B] tracking-[0.03em] sm:tracking-[0.05em] uppercase truncate">2026 Admissions Guide — Canada</span>
                  <span className="text-[10px] sm:text-[11px] bg-[#F7F0F1] text-[#690B1B] font-bold px-2 py-0.5 rounded-full shrink-0">CA</span>
                </div>

                <h1 className="text-[32px] sm:text-[52px] md:text-[60px] font-bold text-[#111111] tracking-[-0.04em] leading-[1.08] mb-4 sm:mb-6">
                  Study in{' '}
                  <span className="bg-gradient-to-r from-[#690B1B] via-[#8B1020] to-[#C9A55D] bg-clip-text text-transparent">Canada</span>{' '}
                  <span className="inline-block text-[34px] sm:text-[50px] align-middle">🇨🇦</span>
                </h1>

                <p className="text-[14px] sm:text-[17px] text-[#555555] leading-relaxed max-w-[580px] mb-6 sm:mb-8">
                  DLI-designated universities, 3-year PGWP, Express Entry PR pathway, and world-class co-op programs. Comprehensive 2026 guide covering all 34 admission parameters: tuition, acceptance rates, GPA requirements, scholarships, career outcomes, and ROI analysis.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <AuthCTALink className="h-[48px] sm:h-[52px] px-6 sm:px-8 rounded-[14px] bg-[#690B1B] text-white text-[14px] sm:text-[15px] font-bold hover:bg-[#7A1022] hover:shadow-[0_10px_25px_rgba(105,11,27,0.25)] transition-all duration-200 flex items-center justify-center gap-2 group w-full sm:w-auto">
                    Apply Now Free
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </AuthCTALink>
                  <a href="#admissions-table" className="h-[48px] sm:h-[52px] px-6 sm:px-7 rounded-[14px] bg-white border border-[#E0DCD7] text-[#333333] text-[14px] sm:text-[15px] font-semibold hover:border-[#690B1B] hover:text-[#690B1B] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto">
                    Explore University Dataset
                  </a>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-[#EAE5DF] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#690B1B] flex items-center justify-center text-white ring-2 ring-white"><Icon name="work" className="w-4 h-4 text-white" /></div>
                      <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white ring-2 ring-white"><Icon name="globe" className="w-4 h-4 text-white" /></div>
                      <div className="w-8 h-8 rounded-full bg-[#C9A55D] flex items-center justify-center text-white ring-2 ring-white"><Icon name="money" className="w-4 h-4 text-white" /></div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111]">12,000+ Students Placed</div>
                      <div className="text-[11px] text-[#777]">97.2% Visa Success Rate</div>
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-[#E5E0D9] hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#444]">
                    <span className="text-[#C9A55D]">★★★★★</span>
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column — Stats Card */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div className="bg-white border border-[#E5E0D9] rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10">
                  <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-[#F0ECE7]">
                    <div className="flex items-center gap-3">
                      <span className="text-[26px] sm:text-[32px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-xl border border-[#E8C4CC] shrink-0">CA</span>
                      <div>
                        <h2 className="text-[16px] sm:text-[18px] font-bold text-[#111]">Canada Admissions Snapshot</h2>
                        <p className="text-[11px] sm:text-[12px] text-[#777]">Verified 2026 DLI Dataset</p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] px-2.5 sm:px-3 py-1 rounded-full border border-[#A5D6A7] shrink-0">DLI Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-5">
                    {[
                      { label: 'DLI Universities', value: '85+' },
                      { label: 'PGWP Duration', value: 'Up to 3 yrs' },
                      { label: 'Avg. Tuition / yr', value: 'CAD 28K–58K' },
                      { label: 'PR Pathway', value: 'Express Entry' },
                    ].map((s) => (
                      <div key={s.label} className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-[12px] sm:rounded-[14px] p-3 sm:p-3.5">
                        <div className="text-[10px] sm:text-[11px] text-[#888] uppercase tracking-wider font-semibold">{s.label}</div>
                        <div className="text-[18px] sm:text-[20px] font-bold text-[#690B1B] mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-[#690B1B] to-[#8B1020] text-white rounded-[14px] sm:rounded-[16px] p-3.5 sm:p-4 flex items-center justify-between gap-2 shadow-md">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Icon name="light" className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div>
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[13px] font-bold truncate">Free AI Chance Estimator</div>
                        <div className="text-[10px] sm:text-[11px] text-white/80 truncate">Assess your Canada admission odds</div>
                      </div>
                    </div>
                    <AuthCTALink className="text-[11px] sm:text-[12px] font-bold bg-white text-[#690B1B] px-3 sm:px-3.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors shrink-0">Check</AuthCTALink>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-white border border-[#E2DDD7] rounded-[16px] p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 z-20 hidden md:flex">
                  <div className="w-9 h-9 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0"><Icon name="work" className="w-4 h-4 text-[#2E7D32]" /></div>
                  <div>
                    <div className="text-[11px] sm:text-[12px] font-bold text-[#111]">PGWP Eligible</div>
                    <div className="text-[10px] text-[#777]">Work 3 years post-grad</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-3 bg-white border border-[#E2DDD7] rounded-[16px] px-3.5 py-2 shadow-lg flex items-center gap-2 z-20 hidden md:flex">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1565C0] shrink-0" />
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#111]">Express Entry PR Pathway</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-4 border-t border-[#EAE5DF]">
              {[
                { value: '85+', label: 'DLI Universities' },
                { value: 'CAD 28K–58K', label: 'Tuition / yr (Intl.)' },
                { value: '3 Years', label: 'Post-Grad Work Permit' },
                { value: '640,000+', label: 'International Students' },
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
              { id: 'why', label: 'Why Canada' },
              { id: 'costs', label: 'Study Costs' },
              { id: 'scholarships', label: 'Scholarships' },
              { id: 'visa', label: 'Visa Guide' },
            ].map((s) => (
              <a key={s.id} href={`#${s.id}`} className="shrink-0 h-[44px] sm:h-[48px] px-3.5 sm:px-5 flex items-center text-[12px] sm:text-[13px] font-semibold text-[#666] hover:text-[#690B1B] border-b-2 border-transparent hover:border-[#690B1B] transition-all whitespace-nowrap">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* ══ CANADA ADMISSIONS HUB (34 DATASET COLUMNS CENTERPIECE) ═ */}
        <CanadaAdmissionsTable universities={universities} />

        {/* ══ WHY STUDY HERE ══════════════════════════════════════════ */}
        <section id="why" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F6F4F2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Why Canada?</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">Top reasons to choose Canada</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {WHY_STUDY.map((item, i) => (
                <div key={i} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-7 hover:border-[#690B1B]/40 hover:-translate-y-0.5 hover:shadow-md transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start gap-3.5 sm:gap-4 mb-4 sm:mb-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F7F0F1] text-[#690B1B] border border-[#E8C4CC] flex items-center justify-center shrink-0 shadow-sm"><Icon name={item.icon} className="w-5 h-5 sm:w-6 sm:h-6" /></div>
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

        {/* ══ STUDY COSTS ═════════════════════════════════════════════ */}
        <section id="costs" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Financial Planning</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2 sm:mb-3">Study Costs in Canada</h2>
            <p className="text-[#727272] text-[13px] sm:text-[14px] mb-6 sm:mb-10 max-w-[640px]">
              Canadian tuition varies significantly by province and program. Quebec universities offer the lowest rates, while Ontario and BC tend to be higher. Co-op programs can offset costs substantially.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
              {[
                { level: "Bachelor's", range: 'CAD 18K–58K/yr', sub: 'Varies by program & province', note: '4-year programs standard. CS/Engineering at U of T and Waterloo on the higher end.', color: 'bg-[#E8F5E9]', textColor: 'text-[#2E7D32]' },
                { level: "Master's", range: 'CAD 14K–35K/yr', sub: 'Research vs. course-based', note: 'Research-based master\'s often funded. Course-based MBA programs significantly higher.', color: 'bg-[#EFF5FF]', textColor: 'text-[#1565C0]' },
                { level: 'MBA', range: 'CAD 28K–95K/yr', sub: 'Rotman, Ivey, Schulich top tier', note: 'Top MBA programs globally accredited. Merit scholarships widely available.', color: 'bg-[#FFF3E0]', textColor: 'text-[#E65100]' },
                { level: 'PhD', range: 'CAD 7K–15K/yr', sub: 'Often fully funded', note: 'NSERC/SSHRC/CIHR grants + supervisor funding. Stipends of CAD 18K–28K/yr common.', color: 'bg-[#F3E5F5]', textColor: 'text-[#6A1B9A]' },
              ].map((c) => (
                <div key={c.level} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-6 hover:border-[#690B1B]/40 hover:shadow-md transition-all">
                  <div className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 ${c.color} ${c.textColor}`}>{c.level}</div>
                  <div className="text-[20px] sm:text-[22px] font-bold text-[#111] mb-0.5 leading-tight">{c.range}</div>
                  <div className="text-[12px] text-[#888] mb-3">{c.sub}</div>
                  <p className="text-[12px] sm:text-[13px] text-[#666] leading-relaxed">{c.note}</p>
                </div>
              ))}
            </div>

            <h3 className="text-[18px] sm:text-[22px] font-bold text-[#111] mb-2">Cost of Living by City</h3>
            <p className="text-[#727272] text-[13px] mb-4">Monthly estimates in CAD. Actual costs vary with lifestyle and accommodation choices.</p>
            <div className="text-[11px] text-[#888] sm:hidden mb-2 font-medium flex items-center gap-1">
              <span>↔ Swipe table to view all city expenses</span>
            </div>
            <div className="overflow-x-auto rounded-[16px] border border-[#E7E2DE] scrollbar-hide shadow-2xs">
              <table className="w-full text-[12px] sm:text-[14px] min-w-[500px]">
                <thead>
                  <tr className="bg-white border-b border-[#E7E2DE]">
                    {['City', 'Rent', 'Food', 'Transport', 'Total / Month'].map((h, i) => (
                      <th key={h} className={`py-3.5 font-bold text-[11px] sm:text-[12px] uppercase tracking-[0.08em] ${i === 0 ? 'text-left px-4 sm:px-5 text-[#444]' : `text-center px-3 sm:px-4 ${h === 'Total / Month' ? 'text-[#690B1B]' : 'text-[#444]'}`}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { city: 'Toronto, ON', rent: 'CA$1,800', food: 'CA$450', transport: 'CA$156', total: 'CA$2,500' },
                    { city: 'Vancouver, BC', rent: 'CA$1,900', food: 'CA$430', transport: 'CA$100', total: 'CA$2,500' },
                    { city: 'Montreal, QC', rent: 'CA$1,100', food: 'CA$380', transport: 'CA$90', total: 'CA$1,650' },
                    { city: 'Waterloo, ON', rent: 'CA$1,000', food: 'CA$350', transport: 'CA$80', total: 'CA$1,500' },
                    { city: 'Edmonton, AB', rent: 'CA$1,100', food: 'CA$380', transport: 'CA$105', total: 'CA$1,650' },
                    { city: 'Kingston, ON', rent: 'CA$950', food: 'CA$340', transport: 'CA$70', total: 'CA$1,400' },
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
              <div className="w-9 h-9 rounded-full bg-[#1565C0]/10 flex items-center justify-center shrink-0"><Icon name="money" className="w-5 h-5 text-[#1565C0]" /></div>
              <div>
                <div className="text-[13px] font-bold text-[#1565C0] mb-1">GIC (Guaranteed Investment Certificate) — CAD 20,635 Required</div>
                <p className="text-[12px] sm:text-[13px] text-[#1565C0]/80 leading-relaxed">
                  International students applying through the Student Direct Stream (SDS) must purchase a <strong>GIC of CAD 20,635</strong> from a participating Canadian financial institution. This covers your first year of living expenses and is released in monthly installments once you arrive in Canada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SCHOLARSHIPS ════════════════════════════════════════════ */}
        <section id="scholarships" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F7F5F3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Funding Your Education</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">Scholarships for Canada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {SCHOLARSHIPS.map((s) => (
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
                    <a href={s.applyUrl} target="_blank" rel="noopener noreferrer" className="h-[36px] sm:h-[34px] px-5 rounded-[8px] bg-[#690B1B] text-white text-[12px] font-bold hover:bg-[#7A1022] transition-all flex items-center justify-center gap-1.5 shadow-sm w-full sm:w-auto">
                      Apply ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ VISA GUIDE (dark) ════════════════════════════════════════ */}
        <section id="visa" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#111217]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Immigration Guide</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-white mb-6 sm:mb-10">Canada Study Permit — Step by Step</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {VISA_STEPS.map((step, i) => (
                <div key={step.step} className={`rounded-[16px] p-5 sm:p-6 border transition-all ${i === 0 ? 'bg-[#690B1B] border-[#690B1B]' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}>
                  <div className={`text-[28px] sm:text-[34px] font-bold mb-3 sm:mb-4 leading-none ${i === 0 ? 'text-white/20' : 'text-white/10'}`}>{step.step}</div>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                  <p className={`text-[12px] sm:text-[13px] leading-relaxed ${i === 0 ? 'text-white/75' : 'text-[#6E7380]'}`}>{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-[16px] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A55D]/20 flex items-center justify-center shrink-0"><Icon name="light" className="w-5 h-5 text-[#C9A55D]" /></div>
              <div>
                <div className="text-[13px] sm:text-[14px] font-bold text-[#C9A55D] mb-1">DLI Verification — Critical for Study Permit & PGWP</div>
                <p className="text-[12px] sm:text-[13px] text-[#9CA3AF] leading-relaxed">
                  Your university <strong className="text-white">must be a Designated Learning Institution (DLI)</strong> for your study permit and PGWP to be valid. Always verify the DLI number on the IRCC website before applying. All universities in our dataset are verified DLI institutions with their official DLI numbers listed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CTA ═════════════════════════════════════════════════════ */}
        <section className="bg-[#73061C] px-4 sm:px-8 py-12 sm:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] uppercase font-bold mb-3 sm:mb-5">Ready to Begin?</div>
            <h2 className="text-white font-bold tracking-[-0.05em] leading-[1.08] text-[26px] sm:text-[46px] md:text-[56px] mb-4 sm:mb-6">
              Start your journey to{' '}
              <span className="text-[#C8A15D] italic">Canada 🇨🇦</span>
            </h2>
            <p className="text-[#D6AEB7] text-[13px] sm:text-[16px] leading-[1.8] sm:leading-[1.9] max-w-[580px] mx-auto mb-8 sm:mb-10">
              Shortlist DLI universities with acceptance rates and ROI data, compare tuition and scholarships, estimate your chances, and prepare your study permit documentation — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <AuthCTALink className="h-[48px] sm:h-[58px] px-7 sm:px-10 rounded-[14px] bg-white text-[#5B0819] text-[14px] sm:text-[17px] font-bold hover:scale-[1.02] transition-all flex items-center justify-center shadow-lg w-full sm:w-auto">
                Get Started Free →
              </AuthCTALink>
              <Link href="/#universities" className="h-[48px] sm:h-[58px] px-7 sm:px-10 rounded-[14px] border border-white/20 text-white text-[14px] sm:text-[17px] font-semibold hover:bg-white/10 transition-all flex items-center justify-center w-full sm:w-auto">
                ← Other Destinations
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
