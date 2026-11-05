import type { Metadata } from 'next';
import Link from 'next/link';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';
import AuthCTALink from '@/components/landing/AuthCTALink';
import GermanyAdmissionsTable from '@/components/country/GermanyAdmissionsTable';
import { fetchGermanyUniversitiesFromWix } from '@/lib/wixCountryUniversities';

/* ══════════════════════════════════════════════════════════════
   SEO METADATA
══════════════════════════════════════════════════════════════ */
export const metadata: Metadata = {
  title: 'Study in Germany 2026 — Universities, NC, APS, Visa & Admissions Guide',
  description:
    'Complete 2026 guide to study in Germany. Explore 55+ universities with NC/Numerus Clausus cutoffs, APS certificate requirements, TestDaF/DSH scores, HZB equivalency, Studienkolleg info, blocked account details (€11,904/yr), semester fees, and DAAD scholarships.',
  keywords: [
    'study in Germany',
    'Germany universities admissions',
    'NC Numerus Clausus Germany',
    'APS certificate India Germany',
    'HZB Germany',
    'Studienkolleg Germany',
    'TestDaF DSH requirements',
    'blocked account Germany sperrkonto',
    'DAAD scholarship',
    'TU Munich admission',
    'Heidelberg University admission',
    'Germany student visa',
    'uni-assist application Germany',
    'semester fee Germany',
    'Baden-Württemberg tuition fee',
  ],
  alternates: { canonical: 'https://abroadsimplified.com/country/germany' },
  openGraph: {
    title: 'Study in Germany 2026 — Full Admissions Guide | Abroad Simplified',
    description:
      'NC cutoffs, APS requirements, TestDaF/DSH scores, blocked account info (€11,904/yr), and visa steps for studying in Germany.',
    url: 'https://abroadsimplified.com/country/germany',
    siteName: 'Abroad Simplified',
    type: 'article',
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Study in Germany Guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study in Germany 2026 | Abroad Simplified',
    description: 'NC, APS, TestDaF, Blocked Account (€11,904/yr), Scholarship, and Visa — full guide.',
    images: ['/logo.png'],
  },
};

/* ══════════════════════════════════════════════════════════════
   TYPES — Matching the 25 Dataset Columns
══════════════════════════════════════════════════════════════ */
export interface GermanyUniversity {
  // 1. University Name
  universityName: string;
  // 2. City
  city: string;
  // 3. Institution Type
  institutionType: string;
  // 4. University Type - Public / Private
  universityType: 'Public' | 'Private';
  // 5. Federal State
  federalState: string;
  // 6. NC / Numerus Clausus
  ncNumerusClausus: string;
  // 7. NC Grade / Cut-off
  ncGradeCutoff: string;
  // 8. HZB / Hochschulzugangsberechtigung
  hzb: string;
  // 9. Studienkolleg Required
  studienkollegRequired: string;
  // 10. APS Certificate Required
  apsCertificateRequired: string;
  // 11. uni-assist Application
  uniAssistApplication: string;
  // 12. Hochschulstart Application
  hochschulstartApplication: string;
  // 13. Semester Contribution
  semesterContribution: string;
  // 14. Semester Ticket
  semesterTicket: string;
  // 15. Baden-Wuerttemberg Tuition Fee
  bwTuitionFee: string;
  // 16. ECTS Requirements
  ectsRequirements: string;
  // 17. German Language Requirement
  germanLanguageRequirement: string;
  // 18. TestDaF
  testDaF: string;
  // 19. DSH
  dsh: string;
  // 20. Blocked Account / Proof of Funds
  blockedAccountProofOfFunds: string;
  // 21. Winter Semester
  winterSemester: string;
  // 22. Summer Semester
  summerSemester: string;
  // 23. Indian qualification equivalency
  indianQualificationEquivalency: string;
  // 24. Anabin / qualification recognition
  anabinRecognition: string;
  // 25. Country-specific admission requirements
  countrySpecificRequirements: string;

  // Display / UX Helpers
  ranking: string;
  website: string;

  // Backwards-compatibility aliases
  name?: string;
  state?: string;
  ncRequired?: boolean;
  ncGrade?: string;
  apsRequired?: string;
  uniAssist?: string;
  hochschulstart?: string;
  semesterFee?: string;
  germanRequired?: string;
  blockedAccount?: string;
  indianEquivalency?: string;
  anabinStatus?: string;
  countrySpecificNote?: string;
}

/* ══════════════════════════════════════════════════════════════
   GERMANY UNIVERSITIES DATA (Populated with 25 Columns)
══════════════════════════════════════════════════════════════ */
export const GERMANY_UNIVERSITIES: GermanyUniversity[] = [
  // 1. Universität Heidelberg (EXACT ROW FROM DATASET SPECIFICATION)
  {
    universityName: 'Universität Heidelberg',
    city: 'Heidelberg',
    institutionType: 'University',
    universityType: 'Public',
    federalState: 'Baden-Württemberg',
    ncNumerusClausus: 'Yes – many programs (Medicine, Law, Psychology etc.)',
    ncGradeCutoff: 'Medicine: 1.0; Law: ~1.7; Psychology: ~1.2 (varies by semester)',
    hzb: 'Allgemeine Hochschulreife (Abitur or recognized equivalent)',
    studienkollegRequired: 'Yes – ISZ Heidelberg (Internationales Studienzentrum); T, M, W, G, S courses',
    apsCertificateRequired: 'Yes – mandatory for Indian applicants',
    uniAssistApplication: 'Yes – via uni-assist for most programs',
    hochschulstartApplication: 'Yes – Medicine, Dentistry, Pharmacy via hochschulstart.de',
    semesterContribution: '€189.80',
    semesterTicket: 'No full semester ticket; includes nextbike (€2.30/sem) and theater flat rate (€2.50/sem)',
    bwTuitionFee: 'Yes – €1,500/semester for non-EU/EEA students',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'DSH-2 or TestDaF TDN 4 for German-taught; IELTS 6.5 / TOEFL 90 for English-taught',
    testDaF: 'TDN 4 (min. 4 in each section) accepted',
    dsh: 'DSH-2 minimum; DSH-3 for some programs',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – main intake; application deadline: Jul 15',
    summerSemester: 'Limited programs; deadline: Jan 15',
    indianQualificationEquivalency: "Class 12 not equivalent – Studienkolleg (ISZ Heidelberg) required; JEE Advanced top rank may exempt; Bachelor's for Master's",
    anabinRecognition: 'Check anabin.kmk.org → Institutionen (H+/H±/H−); Indian degrees case-by-case',
    countrySpecificRequirements: "APS mandatory; Studienkolleg + FSP for bachelor's; min 70% Class 12; blocked account €11,904; student visa required",
    ranking: '#65 QS',
    website: 'https://uni-heidelberg.de',
    name: 'Universität Heidelberg',
    state: 'Baden-Württemberg',
    ncRequired: true,
    ncGrade: 'Medicine: 1.0; Law: ~1.7; Psychology: ~1.2',
    apsRequired: 'Yes – mandatory for Indian applicants',
    uniAssist: 'Yes – via uni-assist for most programs',
    hochschulstart: 'Yes – Medicine, Dentistry, Pharmacy via hochschulstart.de',
    semesterFee: '€189.80 / semester',
    germanRequired: 'DSH-2 or TestDaF TDN 4 (German); IELTS 6.5 (English)',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: "Class 12 requires Studienkolleg; JEE Advanced may exempt; Bachelor's for Master's",
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'APS mandatory for Indian applicants. Non-EU students pay Baden-Württemberg tuition fee of €1,500/semester. Studienkolleg required for Bachelor unless JEE Advanced rank holder.',
  },

  // 2. Technical University of Munich (TUM)
  {
    universityName: 'Technical University of Munich (TUM)',
    city: 'Munich',
    institutionType: 'Technical University',
    universityType: 'Public',
    federalState: 'Bavaria',
    ncNumerusClausus: 'Yes – aptitude assessment (Eignungsverfahren) & NC on select programs',
    ncGradeCutoff: 'CS/Informatics: 1.0–1.6; Mechanical: ~1.8; Management: 1.3–1.7',
    hzb: 'Required — Recognized higher secondary equivalent (Anabin H+)',
    studienkollegRequired: 'Yes – Studienkolleg München (T-Kurs for Engineering, W-Kurs for Management)',
    apsCertificateRequired: 'Yes – mandatory for Indian, Chinese & Vietnamese applicants',
    uniAssistApplication: 'Yes – Preliminary Review Documentation (VPD) via uni-assist required',
    hochschulstartApplication: 'Yes – for Medicine at TUM Klinikum rechts der Isar',
    semesterContribution: '€152.30',
    semesterTicket: 'Discounted Deutschlandticket (€29/month) for matriculated students',
    bwTuitionFee: 'No – Bavaria (€0 general tuition; select English master programs have institutional fee)',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'German C1 (DSH-2 / TestDaF 4x4); English C1 (TOEFL 88 / IELTS 6.5) for English masters',
    testDaF: 'TDN 4 in all 4 examination sections (min. 16 points)',
    dsh: 'DSH-2 minimum score required',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – main intake; deadline Jul 15 (May 31 for select masters)',
    summerSemester: 'Limited programs; deadline Jan 15 (Nov 30 for select masters)',
    indianQualificationEquivalency: '12th PCM 80%+ with JEE Advanced or 1-yr university = HZB; 4-yr B.Tech directly equivalent',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; VPD required from uni-assist',
    countrySpecificRequirements: 'APS certificate mandatory; apply for uni-assist VPD 8 weeks before TUM portal deadline; GRE/GATE for select engineering tracks',
    ranking: '#37 QS',
    website: 'https://tum.de',
    name: 'Technical University of Munich (TUM)',
    state: 'Bavaria',
    ncRequired: true,
    ncGrade: 'CS/Eng: 1.0–1.6; Management: 1.3–1.7',
    apsRequired: 'Yes – mandatory for Indian applicants',
    uniAssist: 'Yes – VPD via uni-assist required',
    hochschulstart: 'Yes – Medicine via hochschulstart.de',
    semesterFee: '€152.30 / semester',
    germanRequired: 'DSH-2 / TestDaF 4x4 (German); IELTS 6.5 / TOEFL 88 (English)',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th PCM + JEE Advanced / Studienkolleg; 4-yr B.Tech recognized directly',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'Indian applicants must submit APS Certificate from German Embassy New Delhi. VPD from uni-assist must be applied for early.',
  },

  // 3. LMU Munich (Ludwig-Maximilians-Universität München)
  {
    universityName: 'LMU Munich (Ludwig-Maximilians-Universität)',
    city: 'Munich',
    institutionType: 'University',
    universityType: 'Public',
    federalState: 'Bavaria',
    ncNumerusClausus: 'Yes – nationwide NC on Medicine/Law & local NC on Psychology/Biology',
    ncGradeCutoff: 'Medicine: 1.0; Psychology: 1.2; Economics: 1.8; Humanities: ~2.5',
    hzb: 'Allgemeine Hochschulreife (recognized Abitur equivalent via Anabin)',
    studienkollegRequired: 'Yes – Studienkolleg München (T, M, W, G courses depending on faculty)',
    apsCertificateRequired: 'Yes – mandatory for Indian nationals',
    uniAssistApplication: 'No – direct application via LMU International Office portal',
    hochschulstartApplication: 'Yes – Medicine, Pharmacy, Dentistry via hochschulstart.de',
    semesterContribution: '€152.30',
    semesterTicket: 'Subsidized MVV / Bayern Ermäßigungsticket (€29/month) available',
    bwTuitionFee: 'No – Bavaria (Tuition-free public university)',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'German C1 (DSH-2, TestDaF 4x4, Goethe C2); IELTS 7.0 for English masters',
    testDaF: 'TDN 4 in all four components required',
    dsh: 'DSH-2 minimum required',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – main intake; deadline Jul 15 for international students',
    summerSemester: 'Limited programs; deadline Jan 15',
    indianQualificationEquivalency: '12th standard requires 1-year college or Studienkolleg; 3-year B.Sc./B.A. evaluated case-by-case',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; Indian degrees assessed individually',
    countrySpecificRequirements: 'APS certificate mandatory; German language proof required at application stage; high GPA required for NC programs',
    ranking: '#54 QS',
    website: 'https://lmu.de',
    name: 'LMU Munich (Ludwig Maximilian University)',
    state: 'Bavaria',
    ncRequired: true,
    ncGrade: 'Medicine: 1.0; Psychology: 1.2; Economics: 1.8',
    apsRequired: 'Yes – mandatory for Indian applicants',
    uniAssist: 'No – direct LMU portal',
    hochschulstart: 'Yes – Medicine via hochschulstart.de',
    semesterFee: '€152.30 / semester',
    germanRequired: 'DSH-2 or TestDaF TDN 4 for German-taught; IELTS 7.0 for English',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th standard + 1-yr college or Studienkolleg; 3-yr degree case-by-case',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'Indian students with 3-year bachelor may need to complete 1 bridge semester. APS verification required.',
  },

  // 4. RWTH Aachen University
  {
    universityName: 'RWTH Aachen University',
    city: 'Aachen',
    institutionType: 'Technical University',
    universityType: 'Public',
    federalState: 'North Rhine-Westphalia',
    ncNumerusClausus: 'Yes – NC on Mechanical, Electrical, Computer Science, and Architecture',
    ncGradeCutoff: 'CS: ~1.7; Mechanical Eng: 2.1; Electrical Eng: 2.4; Medicine: 1.0',
    hzb: 'Allgemeine or Fachgebundene Hochschulreife (Anabin H+)',
    studienkollegRequired: 'Yes – T-Kurs (M-Kurs for Medicine) if secondary school is not directly equivalent',
    apsCertificateRequired: 'Yes – mandatory for Indian/Chinese applicants',
    uniAssistApplication: 'No – direct application via RWTHonline portal',
    hochschulstartApplication: 'Yes – Medicine and Dentistry via hochschulstart.de',
    semesterContribution: '€315.00',
    semesterTicket: 'Yes – NRW-wide regional transit ticket + AVV local transport pass included',
    bwTuitionFee: 'No – North Rhine-Westphalia (€0 tuition fee for all international students)',
    ectsRequirements: 'Bachelor: 180 ECTS (6–7 sem); Master: 120 ECTS (3–4 sem)',
    germanLanguageRequirement: 'DSH-2 or TestDaF 4x4 for German degrees; IELTS 6.5 / TOEFL 90 for English Master programs',
    testDaF: 'TDN 4 in all four modules (German programs)',
    dsh: 'DSH-2 minimum required',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – main intake; deadline Jul 15 (Mar 1 for non-EU masters)',
    summerSemester: 'Secondary intake; deadline Jan 15 (Sep 1 for non-EU masters)',
    indianQualificationEquivalency: '12th PCM 80%+ with JEE Advanced or 1-yr university = direct HZB; 4-yr B.Tech recognized for engineering masters',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; Indian engineering degrees closely audited for module match',
    countrySpecificRequirements: 'APS mandatory; GRE required for select CS & Data Science Master programs; strict module credit matching',
    ranking: '#106 QS',
    website: 'https://rwth-aachen.de',
    name: 'RWTH Aachen University',
    state: 'North Rhine-Westphalia',
    ncRequired: true,
    ncGrade: 'CS: ~1.7; Mechanical: 2.1; Electrical: 2.4',
    apsRequired: 'Yes – APS mandatory for Indian applicants',
    uniAssist: 'No – direct RWTHonline portal',
    hochschulstart: 'Yes – Medicine via hochschulstart.de',
    semesterFee: '€315.00 / semester',
    germanRequired: 'DSH-2 / TestDaF 4x4 for German; IELTS 6.5 for English masters',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th PCM + JEE Advanced / Studienkolleg; 4-yr B.Tech directly equivalent',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'Mechanical and Electrical Engineering are highly competitive. NRW ticket included in fee. Vibrant Indian student community.',
  },

  // 5. KIT – Karlsruhe Institute of Technology
  {
    universityName: 'KIT – Karlsruhe Institute of Technology',
    city: 'Karlsruhe',
    institutionType: 'Technical University',
    universityType: 'Public',
    federalState: 'Baden-Württemberg',
    ncNumerusClausus: 'Yes – restricted intake on CS, Mechanical, Industrial Engineering',
    ncGradeCutoff: 'CS: 1.5; Mechanical: 2.0; Chemical Eng: 2.3; Physics: open',
    hzb: 'Recognized Higher Education Entrance Certificate (Anabin H+)',
    studienkollegRequired: 'Yes – Studienkolleg at KIT (T-Kurs engineering focus)',
    apsCertificateRequired: 'Yes – mandatory for Indian applicants',
    uniAssistApplication: 'Yes – via uni-assist for international qualification review',
    hochschulstartApplication: 'No – technical university programs direct',
    semesterContribution: '€195.20',
    semesterTicket: 'KVV local network ticket included during off-peak; full pass upgrade available',
    bwTuitionFee: 'Yes – €1,500/semester for non-EU/EEA international students',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'DSH-2 or TestDaF 4x4 for German-taught; TOEFL 92 / IELTS 6.5 for English masters',
    testDaF: 'TDN 4 in each subtest',
    dsh: 'DSH-2 accepted',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Oct 1 start; application deadline: Jul 15',
    summerSemester: 'Secondary intake; deadline Jan 15',
    indianQualificationEquivalency: "Class 12 PCM needs Studienkolleg unless JEE Advanced cleared; 4-year B.E./B.Tech accepted for Master's",
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; strict evaluation of mathematics credits',
    countrySpecificRequirements: 'APS certificate mandatory; Baden-Württemberg tuition fee (€1,500/sem) payable in addition to semester fee',
    ranking: '#119 QS',
    website: 'https://kit.edu',
    name: 'KIT – Karlsruhe Institute of Technology',
    state: 'Baden-Württemberg',
    ncRequired: true,
    ncGrade: 'CS: 1.5; Mechanical: 2.0; Chemical: 2.3',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'Yes – uni-assist application mandatory',
    hochschulstart: 'No – direct KIT portal',
    semesterFee: '€195.20 / semester',
    germanRequired: 'DSH-2 or TestDaF 4x4 for German; IELTS 6.5 for English',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th PCM requires Studienkolleg or JEE Advanced; 4-yr B.Tech recognized',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'KIT is a Baden-Württemberg university — non-EU students pay €1,500/semester tuition fee. DAAD scholarships can offset this cost.',
  },

  // 6. Humboldt-Universität zu Berlin
  {
    universityName: 'Humboldt-Universität zu Berlin',
    city: 'Berlin',
    institutionType: 'University',
    universityType: 'Public',
    federalState: 'Berlin',
    ncNumerusClausus: 'Yes – high NC restrictions across Law, Social Sciences, Economics, Biology',
    ncGradeCutoff: 'Law: 1.3; Economics: 1.7; Social Sciences: 1.6; Biology: 1.8',
    hzb: 'Allgemeine Hochschulreife or international equivalent (Anabin H+)',
    studienkollegRequired: 'Yes – Studienkolleg an der Freien Universität / HU Berlin (M/G/W Kurs)',
    apsCertificateRequired: 'Yes – mandatory for Indian nationals',
    uniAssistApplication: 'Yes – via uni-assist for all bachelor and most master applicants',
    hochschulstartApplication: 'Yes – Medicine via Charité – Universitätsmedizin Berlin',
    semesterContribution: '€315.64',
    semesterTicket: 'Berlin ABC public transit ticket integrated in semester fee',
    bwTuitionFee: 'No – Berlin state (€0 tuition fee for all degrees)',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'DSH-2, TestDaF TDN 4, or telc C1 Hochschule',
    testDaF: 'TDN 4 minimum in each section',
    dsh: 'DSH-2 or DSH-3 depending on faculty',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – main intake; deadline Jul 15 (international via uni-assist)',
    summerSemester: 'Limited programs; deadline Jan 15 (selected subjects)',
    indianQualificationEquivalency: 'Indian 12th + 1-yr college or Studienkolleg; 3-year B.A./B.Sc. evaluated case-by-case',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; degrees verified via anabin database',
    countrySpecificRequirements: 'APS mandatory for India; apply early via uni-assist (6–8 weeks turnaround); Berlin housing proof needed',
    ranking: '#120 QS',
    website: 'https://hu-berlin.de',
    name: 'Humboldt University Berlin',
    state: 'Berlin',
    ncRequired: true,
    ncGrade: 'Law: 1.3; Economics: 1.7; Social Sciences: 1.6',
    apsRequired: 'Yes – APS mandatory for Indian students',
    uniAssist: 'Yes – via uni-assist.de',
    hochschulstart: 'Yes – Medicine via Charité',
    semesterFee: '€315.64 / semester',
    germanRequired: 'DSH-2, TestDaF TDN 4, or telc C1 Hochschule',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th + 1-yr college or Studienkolleg; 3-yr degree case-by-case',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'Berlin has zero tuition fees for international students. Excellent social science and humanities faculties.',
  },

  // 7. Freie Universität Berlin (FU Berlin)
  {
    universityName: 'Free University Berlin (FU Berlin)',
    city: 'Berlin',
    institutionType: 'University',
    universityType: 'Public',
    federalState: 'Berlin',
    ncNumerusClausus: 'Yes – NC on Political Science, Psychology, Media, Veterinary Medicine',
    ncGradeCutoff: 'Psychology: 1.1; Veterinary Medicine: 1.2; Political Science: 1.6; History: 2.3',
    hzb: 'Allgemeine Hochschulreife (recognized equivalent via Anabin H+)',
    studienkollegRequired: 'Yes – Studienkolleg FU Berlin (W, G, M, T courses)',
    apsCertificateRequired: 'Yes – mandatory for Indian applicants',
    uniAssistApplication: 'Yes – mandatory application through uni-assist',
    hochschulstartApplication: 'Yes – Veterinary Medicine, Pharmacy via hochschulstart.de',
    semesterContribution: '€312.89',
    semesterTicket: 'Complete Berlin ABC transit network pass included',
    bwTuitionFee: 'No – Berlin (€0 tuition fee)',
    ectsRequirements: 'Bachelor: 180 ECTS; Master: 120 ECTS',
    germanLanguageRequirement: 'DSH-2, TestDaF 4x4; English C1 for international masters',
    testDaF: 'TDN 4 across all 4 modules',
    dsh: 'DSH-2 accepted',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Oct start; application deadline Jul 15',
    summerSemester: 'Limited programs; application deadline Jan 15',
    indianQualificationEquivalency: '12th requires Studienkolleg; 3-year degrees may need bridge credits; 4-year degree direct entry',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; APS certificate must be submitted',
    countrySpecificRequirements: 'APS certificate required; uni-assist VPD or electronic submission; strict language deadlines',
    ranking: '#148 QS',
    website: 'https://fu-berlin.de',
    name: 'Free University Berlin (FU Berlin)',
    state: 'Berlin',
    ncRequired: true,
    ncGrade: 'Psychology: 1.1; Vet Med: 1.2; Pol Sci: 1.6',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'Yes – via uni-assist.de',
    hochschulstart: 'Yes – Veterinary Medicine via hochschulstart.de',
    semesterFee: '€312.89 / semester',
    germanRequired: 'DSH-2 or TestDaF 4x4; English C1 for English masters',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th requires Studienkolleg; 4-yr Bachelor direct for Master',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'FU Berlin excels in Social Sciences, Humanities, and Life Sciences. Berlin city transport included.',
  },

  // 8. Technische Universität Berlin (TU Berlin)
  {
    universityName: 'TU Berlin (Technical University of Berlin)',
    city: 'Berlin',
    institutionType: 'Technical University',
    universityType: 'Public',
    federalState: 'Berlin',
    ncNumerusClausus: 'Yes – NC on CS, Data Engineering, Architecture, Electrical Eng',
    ncGradeCutoff: 'Computer Science: 1.6; Architecture: 1.8; Industrial Eng: 2.1',
    hzb: 'Technical university entrance qualification (Anabin H+)',
    studienkollegRequired: 'Yes – T-Kurs Studienkolleg for engineering aspirants',
    apsCertificateRequired: 'Yes – mandatory for applicants from India',
    uniAssistApplication: 'Yes – all non-EU qualifications processed via uni-assist',
    hochschulstartApplication: 'No – technical university programs direct',
    semesterContribution: '€307.54',
    semesterTicket: 'Berlin ABC public transit ticket included',
    bwTuitionFee: 'No – Berlin (€0 tuition fee)',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'DSH-2 / TestDaF 4x4; IELTS 6.5 / TOEFL 90 for English Master programs',
    testDaF: 'TDN 4 in all sections',
    dsh: 'DSH-2 required',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Oct start; deadline Jul 15 (May 15 for some English masters)',
    summerSemester: 'Secondary intake; deadline Jan 15',
    indianQualificationEquivalency: 'Indian 12th PCM + Studienkolleg/JEE; B.Tech 4-year directly eligible for M.Sc. programs',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+; strict syllabus credit match for CS/Eng Master prerequisites',
    countrySpecificRequirements: 'APS certificate mandatory; apply 8 weeks ahead of deadline via uni-assist; English proof for STEM masters',
    ranking: '#154 QS',
    website: 'https://tu.berlin',
    name: 'TU Berlin (Technical University of Berlin)',
    state: 'Berlin',
    ncRequired: true,
    ncGrade: 'CS: 1.6; Architecture: 1.8; Industrial: 2.1',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'Yes – uni-assist application mandatory',
    hochschulstart: 'No – direct TU Berlin portal',
    semesterFee: '€307.54 / semester',
    germanRequired: 'DSH-2 / TestDaF 4x4 for German; IELTS 6.5 for English',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th PCM + Studienkolleg/JEE; 4-yr B.Tech directly equivalent',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'TU Berlin offers many English-taught Master programs, highly popular with Indian tech graduates. Vibrant startup hub.',
  },

  // 9. Universität Stuttgart
  {
    universityName: 'University of Stuttgart',
    city: 'Stuttgart',
    institutionType: 'Technical University',
    universityType: 'Public',
    federalState: 'Baden-Württemberg',
    ncNumerusClausus: 'Yes – NC on Automotive Engineering, Aerospace, Architecture, CS',
    ncGradeCutoff: 'Aerospace: 1.5; Automotive Eng: 1.8; Architecture: 1.9; CS: 2.0',
    hzb: 'Recognized secondary school leaving diploma (Anabin H+)',
    studienkollegRequired: 'Yes – T-Kurs Studienkolleg',
    apsCertificateRequired: 'Yes – mandatory for Indian applicants',
    uniAssistApplication: 'No – direct application via C@MPUS university portal',
    hochschulstartApplication: 'No – engineering focus',
    semesterContribution: '€205.00',
    semesterTicket: 'VVS network semester ticket available at subsidized student rate',
    bwTuitionFee: 'Yes – €1,500/semester for non-EU/EEA students',
    ectsRequirements: 'Bachelor: 180 ECTS; Master: 120 ECTS',
    germanLanguageRequirement: 'TestDaF 4x4 or DSH-2 for German programs; TOEFL 95 / IELTS 7.0 for English Master programs',
    testDaF: 'TDN 4 in all sections',
    dsh: 'DSH-2 accepted',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Oct 1 start; deadline Jul 15 (Feb 15 for international English masters)',
    summerSemester: 'Secondary intake; deadline Jan 15',
    indianQualificationEquivalency: "Class 12 PCM needs Studienkolleg/JEE; 4-year B.Tech eligible for Master of Science",
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+; Automotive capital hub with direct Daimler/Porsche ties',
    countrySpecificRequirements: 'APS mandatory; Baden-Württemberg €1,500/semester fee applies; high GATE/GRE recommended for INFOTECH',
    ranking: '#296 QS',
    website: 'https://uni-stuttgart.de',
    name: 'University of Stuttgart',
    state: 'Baden-Württemberg',
    ncRequired: true,
    ncGrade: 'Aerospace: 1.5; Automotive: 1.8; CS: 2.0',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'No – direct C@MPUS portal',
    hochschulstart: 'No – direct university portal',
    semesterFee: '€205.00 / semester',
    germanRequired: 'TestDaF 4x4 or DSH-2 for German; IELTS 7.0 for English',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th PCM + Studienkolleg/JEE; 4-yr B.Tech recognized for M.Sc.',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'Stuttgart is the automotive capital of Germany — BMW, Daimler, Bosch, and Porsche all have campuses nearby. Non-EU students pay BW tuition fee of €1,500/semester.',
  },

  // 10. Universität Mannheim
  {
    universityName: 'University of Mannheim',
    city: 'Mannheim',
    institutionType: 'University',
    universityType: 'Public',
    federalState: 'Baden-Württemberg',
    ncNumerusClausus: 'Yes – highly competitive NC for Business Administration (BWL), Economics, Data Science',
    ncGradeCutoff: 'Business (BWL): 1.1–1.4; Economics (VWL): 1.6; Business Informatics: 1.9',
    hzb: 'Allgemeine Hochschulreife (recognized Abitur equivalent)',
    studienkollegRequired: 'Yes – W-Kurs (Economics) at Heidelberg/Mannheim ISZ',
    apsCertificateRequired: 'Yes – mandatory for Indian applicants',
    uniAssistApplication: 'No – direct application via Mannheim online portal',
    hochschulstartApplication: 'No – business & social sciences focus',
    semesterContribution: '€194.35',
    semesterTicket: 'VRN transit network semester ticket option available',
    bwTuitionFee: 'Yes – €1,500/semester for non-EU/EEA students',
    ectsRequirements: 'Bachelor: 180 ECTS (6 sem); Master: 120 ECTS (4 sem)',
    germanLanguageRequirement: 'DSH-2 for German BWL; Mannheim Master in Management (MMM) offers 100% English track (IELTS 7.0)',
    testDaF: 'TDN 4 in each component',
    dsh: 'DSH-2 accepted',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Sep start; deadline May 31 (for international business masters)',
    summerSemester: 'Secondary intake; deadline Nov 15',
    indianQualificationEquivalency: 'Indian 12th + Studienkolleg W-Kurs; B.Com / BBA / B.Tech eligible with strong quant background',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+ recognized; GMAT/GRE score strongly recommended for Business Master',
    countrySpecificRequirements: 'APS certificate required; Baden-Württemberg non-EU fee of €1,500/sem; GMAT/GRE gives high bonus points in admission ranking',
    ranking: '#461 QS',
    website: 'https://uni-mannheim.de',
    name: 'University of Mannheim',
    state: 'Baden-Württemberg',
    ncRequired: true,
    ncGrade: 'Business: 1.1–1.4; Economics: 1.6',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'No – direct Mannheim portal',
    hochschulstart: 'No – direct university portal',
    semesterFee: '€194.35 / semester',
    germanRequired: 'DSH-2 for German track; IELTS 7.0 for 100% English MMM track',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: 'B.Com / BBA / B.Tech eligible; GMAT recommended for business masters',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: '#1 Business School in Germany by rankings. Strong connections to SAP, Deutsche Bank, and top consulting firms. BW fee of €1,500/semester applies.',
  },

  // 11. Albert-Ludwigs-Universität Freiburg
  {
    universityName: 'University of Freiburg (Albert-Ludwigs-Universität)',
    city: 'Freiburg',
    institutionType: 'University',
    universityType: 'Public',
    federalState: 'Baden-Württemberg',
    ncNumerusClausus: 'Yes – NC for Medicine, Pharmacy, Law, Psychology, Environmental Sciences',
    ncGradeCutoff: 'Medicine: 1.0; Psychology: 1.2; Environmental Sciences: 1.8; Computer Science: 2.2',
    hzb: 'Allgemeine Hochschulreife (Anabin H+)',
    studienkollegRequired: 'Yes – Studienkolleg at Heidelberg or Karlsruhe for Baden-Württemberg',
    apsCertificateRequired: 'Yes – mandatory for Indian nationals',
    uniAssistApplication: 'Yes – via uni-assist for non-EU bachelor and master degrees',
    hochschulstartApplication: 'Yes – Medicine, Pharmacy, Dentistry via hochschulstart.de',
    semesterContribution: '€180.00',
    semesterTicket: 'RVF network student semester pass included in transit contribution',
    bwTuitionFee: 'Yes – €1,500/semester for non-EU/EEA international students',
    ectsRequirements: 'Bachelor: 180 ECTS; Master: 120 ECTS',
    germanLanguageRequirement: 'DSH-2, TestDaF TDN 4 for German programs; IELTS 7.0 for English masters (Renewable Energy, Microsystems)',
    testDaF: 'TDN 4 in all sections',
    dsh: 'DSH-2 minimum',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Oct start; deadline Jul 15 (May 31 for some masters)',
    summerSemester: 'Secondary intake; deadline Jan 15',
    indianQualificationEquivalency: 'Class 12 needs Studienkolleg unless JEE Advanced cleared; B.Tech/B.Sc. 4-year accepted for Master',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+; Greenest university city in Germany with top environmental research',
    countrySpecificRequirements: 'APS certificate mandatory; Baden-Württemberg tuition fee (€1,500/sem); English proof for STEM masters',
    ranking: '#189 QS',
    website: 'https://uni-freiburg.de',
    name: 'University of Freiburg',
    state: 'Baden-Württemberg',
    ncRequired: true,
    ncGrade: 'Medicine: 1.0; Psychology: 1.2; Environmental: 1.8',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'Yes – via uni-assist.de',
    hochschulstart: 'Yes – Medicine via hochschulstart.de',
    semesterFee: '€180.00 / semester',
    germanRequired: 'DSH-2 or TestDaF TDN 4; IELTS 7.0 for English masters',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: 'Class 12 needs Studienkolleg; 4-yr degree accepted for Master',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'Freiburg is Germany’s premier hub for sustainability, environmental sciences, and microsystems engineering. BW €1,500/sem fee applies.',
  },

  // 12. Technische Universität Dresden (TU Dresden)
  {
    universityName: 'TU Dresden (Technische Universität Dresden)',
    city: 'Dresden',
    institutionType: 'Technical University',
    universityType: 'Public',
    federalState: 'Saxony',
    ncNumerusClausus: 'Yes – NC for CS, Microelectronics, Medicine; NC-free for select engineering',
    ncGradeCutoff: 'Medicine: 1.0; CS: 1.9; Electrical Eng: NC-free (open admission); Mechanical: ~2.4',
    hzb: 'Higher education entrance certificate (Anabin H+)',
    studienkollegRequired: 'Yes – TUDIAS Studienkolleg Dresden (T, M, W courses)',
    apsCertificateRequired: 'Yes – mandatory for applicants from India',
    uniAssistApplication: 'Yes – non-EU certificates evaluated via uni-assist',
    hochschulstartApplication: 'Yes – Medicine and Dentistry via hochschulstart.de',
    semesterContribution: '€298.80',
    semesterTicket: 'Yes – full Saxony-wide regional train ticket + Dresden DVB transit included',
    bwTuitionFee: 'No – Saxony state (€0 tuition fee for all international students)',
    ectsRequirements: 'Bachelor / Diplom: 180–300 ECTS; Master: 120 ECTS',
    germanLanguageRequirement: 'DSH-2 or TestDaF 4x4; IELTS 6.5 for English Master programs',
    testDaF: 'TDN 4 in all examination sections',
    dsh: 'DSH-2 accepted',
    blockedAccountProofOfFunds: '€11,904/year (€992/month)',
    winterSemester: 'Yes – Oct start; deadline Jul 15 (May 31 for English masters)',
    summerSemester: 'Secondary intake; deadline Jan 15',
    indianQualificationEquivalency: 'Indian 12th + Studienkolleg/JEE; 4-year B.Tech recognized directly for Silicon Saxony semiconductor masters',
    anabinRecognition: 'Check anabin.kmk.org → Institutionen H+; Silicon Saxony hub with semiconductor internship pipelines (Infineon, Bosch)',
    countrySpecificRequirements: 'APS certificate mandatory; uni-assist VPD or application; low living cost in Dresden (€750–€950/mo)',
    ranking: '#246 QS',
    website: 'https://tu-dresden.de',
    name: 'TU Dresden (Technische Universität Dresden)',
    state: 'Saxony',
    ncRequired: true,
    ncGrade: 'CS: 1.9; Electrical: NC-free; Mechanical: ~2.4',
    apsRequired: 'Yes – APS mandatory',
    uniAssist: 'Yes – via uni-assist.de',
    hochschulstart: 'Yes – Medicine via hochschulstart.de',
    semesterFee: '€298.80 / semester',
    germanRequired: 'DSH-2 / TestDaF 4x4; IELTS 6.5 for English masters',
    blockedAccount: '€11,904/year (€992/month)',
    indianEquivalency: '12th + Studienkolleg/JEE; 4-yr B.Tech recognized for M.Sc.',
    anabinStatus: 'H+ (Recognized)',
    countrySpecificNote: 'TU Dresden sits at the core of Silicon Saxony — Europe’s largest semiconductor cluster. Zero tuition fees and very affordable living costs.',
  },
];

/* ══════════════════════════════════════════════════════════════
   WHY STUDY DATA
══════════════════════════════════════════════════════════════ */
const WHY_STUDY = [
  { stat: '€0 Tuition', title: 'Free at Public Universities', desc: '15 of 16 German federal states charge zero tuition fees for international students. Pay only a semester fee of ~€150–€350 which covers public transport.', icon: 'money' },
  { stat: '2,000+', title: 'Industry Partnerships', desc: 'Direct hiring pipelines with BMW, Siemens, SAP, Bosch, and Volkswagen from campus career fairs. Germany leads Europe in engineering employment.', icon: 'factory' },
  { stat: '18 Months', title: 'Job Seeker Visa', desc: 'Stay 18 months after graduation to find work. Once employed, fast-track to permanent residency through the EU Blue Card scheme.', icon: 'work' },
  { stat: 'Schengen', title: 'Travel 29 Countries', desc: 'German residence permit allows free travel across all Schengen member states for study trips, research collaborations, and internships.', icon: 'globe' },
  { stat: '#1 EU', title: 'Engineering Research Leader', desc: 'Germany leads Europe in mechanical engineering, automotive, and manufacturing R&D output and patents. World\'s #3 R&D investor.', icon: 'micro' },
  { stat: '€58K+', title: 'Avg. Engineer Starting Salary', desc: 'Strong industrial economy with excellent starting salaries — Munich, Stuttgart, Frankfurt, and Berlin offer unmatched tech career pathways.', icon: 'trend' },
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
  { name: 'DAAD Scholarship', amount: '€934/month + travel + health insurance', eligibility: 'International graduates and researchers worldwide applying to German institutions', deadline: 'Oct 15 – Nov 15, annually', type: 'Government', funder: 'DAAD (German Academic Exchange Service)', degreeLevel: "Master's / PhD / Postdoc", fundingType: 'Partial', applyUrl: 'https://www.daad.de/en' },
  { name: 'Deutschlandstipendium', amount: '€300/month (12 months)', eligibility: 'High-achieving students enrolled at German universities — merit-based, applied through university', deadline: 'May–June (varies by university)', type: 'Government', funder: 'Federal Government + Private Sponsors', degreeLevel: "Bachelor's / Master's", fundingType: 'Partial', applyUrl: 'https://www.deutschlandstipendium.de' },
  { name: 'Heinrich Böll Foundation Scholarship', amount: '€861/month + €100 research allowance', eligibility: 'Students committed to ecology, democracy, and sustainability — open to non-German nationals', deadline: 'Mar 1 / Sep 1, annually', type: 'Foundation', funder: 'Heinrich Böll Foundation', degreeLevel: "Bachelor's / Master's / PhD", fundingType: 'Partial', applyUrl: 'https://www.boell.de/en' },
  { name: 'Konrad-Adenauer-Stiftung (KAS)', amount: '€752/month + health + benefits', eligibility: 'Students with strong academic record and proven civic engagement; Christian-democratic values', deadline: 'Jan 15 / Jul 15, annually', type: 'Foundation', funder: 'Konrad-Adenauer-Stiftung', degreeLevel: "Bachelor's / Master's / PhD", fundingType: 'Partial', applyUrl: 'https://www.kas.de/en' },
];

const VISA_STEPS = [
  { step: '01', title: 'Obtain APS Certificate', desc: 'Mandatory for Indian, Chinese, and Vietnamese applicants. Submit your school and university marks to APS India (APS New Delhi) before or during university applications.' },
  { step: '02', title: 'Apply to German Universities', desc: 'Apply via uni-assist.de, hochschulstart.de (Medicine/Pharmacy), or directly through university portals. Meet NC cut-offs and language requirements.' },
  { step: '03', title: 'Open Blocked Account (€11,904)', desc: 'Deposit €11,904 into a Sperrkonto (Expatrio, Fintiba, or Coracle). This covers €992/month for 12 months, mandatory for visa approval.' },
  { step: '04', title: 'Apply for National Visa (Type D)', desc: 'Book your German student visa appointment via VFS Global / German Embassy. Fee: €75. Apply 3–4 months before your intended start date.' },
  { step: '05', title: 'Attend Visa Interview', desc: 'Bring: admission letter, blocked account confirmation (€11,904), APS certificate, academic transcripts, language scores, and health insurance.' },
  { step: '06', title: 'Anmeldung & Residence Permit', desc: 'Register at the local Einwohnermeldeamt (Bürgeramt) within 14 days of arrival in Germany, then complete university matriculation and Ausländerbehörde registration.' },
];

/* ══════════════════════════════════════════════════════════════
   ICON COMPONENT (SVG only — no raw emojis in icons)
══════════════════════════════════════════════════════════════ */
function Icon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'money':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'factory':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h2m0 0h2" /></svg>;
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
export default async function GermanyPage() {
  const wixUniversities = await fetchGermanyUniversitiesFromWix();
  const universities = wixUniversities && wixUniversities.length > 0 ? wixUniversities : GERMANY_UNIVERSITIES;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://abroadsimplified.com' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://abroadsimplified.com/#universities' },
      { '@type': 'ListItem', position: 3, name: 'Study in Germany', item: 'https://abroadsimplified.com/country/germany' },
    ],
  };

  return (
    <div className="bg-[#F6F4F2] text-[#111111] font-[Poppins] font-normal min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <LandingNavbar />

      <main className="flex-1">

        {/* ══ HERO ════════════════════════════════════════════════════ */}
        <section className="relative bg-[#FAF8F5] pt-6 sm:pt-12 pb-10 sm:pb-16 overflow-hidden border-b border-[#EAE5DF]">
          {/* Ambient background */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#690B1B]/5 via-[#C9A55D]/10 to-transparent blur-[80px] sm:blur-[120px]" />
            <div className="absolute -bottom-20 left-10 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-[#690B1B]/5 blur-[80px] sm:blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#690B1B 1px, transparent 1px), linear-gradient(to right, #690B1B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] text-[#888] mb-6 sm:mb-8 font-medium overflow-x-auto py-1">
              <Link href="/" className="hover:text-[#690B1B] transition-colors shrink-0">Home</Link>
              <span className="text-[#CCC] shrink-0">/</span>
              <Link href="/#universities" className="hover:text-[#690B1B] transition-colors shrink-0">Destinations</Link>
              <span className="text-[#CCC] shrink-0">/</span>
              <span className="text-[#690B1B] font-semibold shrink-0">Germany</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 sm:mb-12">
              {/* Left Column */}
              <div className="lg:col-span-7">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white border border-[#E7E2DE] shadow-[0_2px_10px_rgba(0,0,0,0.04)] rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 mb-5 sm:mb-6">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#690B1B] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#690B1B]" />
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#690B1B] tracking-[0.03em] sm:tracking-[0.05em] uppercase truncate">2026 Admissions Guide — Germany</span>
                  <span className="text-[10px] sm:text-[11px] bg-[#F7F0F1] text-[#690B1B] font-bold px-2 py-0.5 rounded-full shrink-0">DE</span>
                </div>

                <h1 className="text-[32px] sm:text-[52px] md:text-[60px] font-bold text-[#111111] tracking-[-0.04em] leading-[1.08] mb-4 sm:mb-6">
                  Study in{' '}
                  <span className="bg-gradient-to-r from-[#690B1B] via-[#8B1020] to-[#C9A55D] bg-clip-text text-transparent">Germany</span>{' '}
                  <span className="inline-block text-[34px] sm:text-[50px] align-middle">🇩🇪</span>
                </h1>

                <p className="text-[14px] sm:text-[17px] text-[#555555] leading-relaxed max-w-[580px] mb-6 sm:mb-8">
                  Tuition-free public universities, STEM excellence, and an 18-month job-seeker visa. Comprehensive 2026 guide covering all 25 admission parameters: NC cutoffs, APS certificate requirements, TestDaF/DSH scores, blocked account (€11,904/yr), and HZB equivalency.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <AuthCTALink className="h-[48px] sm:h-[52px] px-6 sm:px-8 rounded-[14px] bg-[#690B1B] text-white text-[14px] sm:text-[15px] font-bold hover:bg-[#7A1022] hover:shadow-[0_10px_25px_rgba(105,11,27,0.25)] transition-all duration-200 flex items-center justify-center gap-2 group w-full sm:w-auto">
                    Apply Now Free
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </AuthCTALink>
                  <a href="#admissions-table" className="h-[48px] sm:h-[52px] px-6 sm:px-7 rounded-[14px] bg-white border border-[#E0DCD7] text-[#333333] text-[14px] sm:text-[15px] font-semibold hover:border-[#690B1B] hover:text-[#690B1B] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto">
                    Explore Admissions Dataset
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="pt-5 sm:pt-6 border-t border-[#EAE5DF] flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#690B1B] flex items-center justify-center text-white ring-2 ring-white">
                        <Icon name="work" className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-white ring-2 ring-white">
                        <Icon name="globe" className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#C9A55D] flex items-center justify-center text-white ring-2 ring-white">
                        <Icon name="money" className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#111]">10,000+ Students Placed</div>
                      <div className="text-[11px] text-[#777]">98.4% Visa Success Rate</div>
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
                      <span className="text-[26px] sm:text-[32px] font-bold text-[#690B1B] bg-[#F7F0F1] px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-xl border border-[#E8C4CC] shrink-0">DE</span>
                      <div>
                        <h2 className="text-[16px] sm:text-[18px] font-bold text-[#111]">Germany Admissions Snapshot</h2>
                        <p className="text-[11px] sm:text-[12px] text-[#777]">Verified 2026 Dataset Criteria</p>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#E8F5E9] text-[#2E7D32] px-2.5 sm:px-3 py-1 rounded-full border border-[#A5D6A7] shrink-0">Verified</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-5">
                    {[
                      { label: 'Public Universities', value: '€0 Tuition*' },
                      { label: 'Blocked Account', value: '€11,904 / yr' },
                      { label: 'Job Seeker Visa', value: '18 Months' },
                      { label: 'Semester Fee', value: '€150 – €350' },
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
                        <Icon name="light" className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] sm:text-[13px] font-bold truncate">Free AI Chance Estimator</div>
                        <div className="text-[10px] sm:text-[11px] text-white/80 truncate">Assess your NC & HZB admission odds</div>
                      </div>
                    </div>
                    <AuthCTALink className="text-[11px] sm:text-[12px] font-bold bg-white text-[#690B1B] px-3 sm:px-3.5 py-1.5 rounded-lg hover:bg-[#FAF8F5] transition-colors shrink-0">
                      Check
                    </AuthCTALink>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-3 -right-3 bg-white border border-[#E2DDD7] rounded-[16px] p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 z-20 hidden md:flex">
                  <div className="w-9 h-9 rounded-full bg-[#FFF8E6] flex items-center justify-center shrink-0">
                    <Icon name="money" className="w-4 h-4 text-[#E65100]" />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-[12px] font-bold text-[#111]">15 States €0 Tuition</div>
                    <div className="text-[10px] text-[#777]">BW state €1,500/sem</div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-3 bg-white border border-[#E2DDD7] rounded-[16px] px-3.5 py-2 shadow-lg flex items-center gap-2 z-20 hidden md:flex">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] shrink-0" />
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#111]">APS Certificate Mandatory for India</span>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-4 border-t border-[#EAE5DF]">
              {[
                { value: '55+', label: 'Featured Universities' },
                { value: '€0–€3,000', label: 'Tuition / yr (Public)' },
                { value: '€11,904', label: 'Proof of Funds (Sperrkonto)' },
                { value: '18 Months', label: 'Post-Grad Job Seeker Visa' },
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
              { id: 'admissions-table', label: 'Admissions Dataset' },
              { id: 'why', label: 'Why Germany' },
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

        {/* ══ GERMANY ADMISSIONS HUB (25 DATASET COLUMNS CENTERPIECE) ═ */}
        <GermanyAdmissionsTable universities={universities} />

        {/* ══ WHY STUDY HERE ══════════════════════════════════════════ */}
        <section id="why" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F6F4F2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Why Germany?</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">
              Top reasons to choose Germany
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {WHY_STUDY.map((item, i) => (
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

        {/* ══ STUDY COSTS ═════════════════════════════════════════════ */}
        <section id="costs" className="px-4 sm:px-8 py-10 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Financial Planning</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-2 sm:mb-3">
              Study Costs in Germany
            </h2>
            <p className="text-[#727272] text-[13px] sm:text-[14px] mb-6 sm:mb-10 max-w-[640px]">
              Germany offers one of the most affordable quality education systems in the world. Public universities charge only semester contribution fees of €150–€350, which typically include a local public transit pass.
            </p>

            {/* Cost Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
              {[
                { level: "Bachelor's", range: '€0 (public)', sub: '€5,000–€20,000 (private)', note: 'Only semester contribution at public universities — includes local transit pass in most states.', color: 'bg-[#E8F5E9]', textColor: 'text-[#2E7D32]' },
                { level: "Master's", range: '€0 (public)', sub: '€8,000–€30,000 (private)', note: 'Tuition-free at all public universities (except Baden-Württemberg €1,500/semester).', color: 'bg-[#EFF5FF]', textColor: 'text-[#1565C0]' },
                { level: 'MBA', range: '€8,000 – €40,000/yr', sub: 'ESMT Berlin, Mannheim, Frankfurt School', note: 'Globally accredited business education at significantly lower cost than US/UK equivalents.', color: 'bg-[#FFF3E0]', textColor: 'text-[#E65100]' },
                { level: 'PhD', range: '€0 (employment-based)', sub: '€2,000–€3,000/month stipend', note: 'PhD positions in Germany are employment contracts (Wissenschaftlicher Mitarbeiter) with full health coverage.', color: 'bg-[#F3E5F5]', textColor: 'text-[#6A1B9A]' },
              ].map((c) => (
                <div key={c.level} className="bg-white border border-[#E7E2DE] rounded-[16px] p-5 sm:p-6 hover:border-[#690B1B]/40 hover:shadow-md transition-all">
                  <div className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 ${c.color} ${c.textColor}`}>{c.level}</div>
                  <div className="text-[20px] sm:text-[22px] font-bold text-[#111] mb-0.5 leading-tight">{c.range}</div>
                  <div className="text-[12px] text-[#888] mb-3">{c.sub}</div>
                  <p className="text-[12px] sm:text-[13px] text-[#666] leading-relaxed">{c.note}</p>
                </div>
              ))}
            </div>

            {/* Living Costs Table */}
            <h3 className="text-[18px] sm:text-[22px] font-bold text-[#111] mb-2">Cost of Living by City</h3>
            <p className="text-[#727272] text-[13px] mb-4">Monthly estimates in Euros. Actual costs vary with lifestyle and accommodation choices.</p>
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
                    { city: 'Heidelberg', rent: '€850', food: '€290', transport: '€35 (ticket/nextbike)', total: '€1,175' },
                    { city: 'Munich', rent: '€1,200', food: '€320', transport: '€29 (Deutschlandticket)', total: '€1,549' },
                    { city: 'Berlin', rent: '€950', food: '€300', transport: 'Semester pass included', total: '€1,250' },
                    { city: 'Aachen / Karlsruhe', rent: '€650', food: '€280', transport: 'Semester pass included', total: '€930' },
                    { city: 'Stuttgart', rent: '€900', food: '€295', transport: '€70', total: '€1,265' },
                    { city: 'Dresden', rent: '€550', food: '€260', transport: 'Saxony pass included', total: '€810' },
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

            {/* Blocked Account Info Box */}
            <div className="mt-6 p-5 bg-[#EFF5FF] border border-[#BFDBFE] rounded-[14px] flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1565C0]/10 flex items-center justify-center shrink-0">
                <Icon name="money" className="w-5 h-5 text-[#1565C0]" />
              </div>
              <div>
                <div className="text-[13px] font-bold text-[#1565C0] mb-1">Blocked Account (Sperrkonto) — €11,904 Required for German Student Visa</div>
                <p className="text-[12px] sm:text-[13px] text-[#1565C0]/80 leading-relaxed">
                  International students must deposit <strong>€11,904</strong> (verified rate: €992/month × 12) into a certified Sperrkonto before booking their German visa appointment. Approved providers include <strong>Expatrio</strong>, <strong>Fintiba</strong>, and <strong>Coracle</strong>. Once enrolled and registered in Germany, the account unlocks <strong>€992 every month</strong> to cover living expenses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SCHOLARSHIPS ════════════════════════════════════════════ */}
        <section id="scholarships" className="px-4 sm:px-8 py-10 sm:py-20 bg-[#F7F5F3]">
          <div className="max-w-7xl mx-auto">
            <div className="text-[#C9A55D] text-[11px] tracking-[0.22em] font-bold uppercase mb-2 sm:mb-3">Funding Your Education</div>
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-[#111] mb-6 sm:mb-10">
              Scholarships for Germany
            </h2>
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
            <h2 className="text-[24px] sm:text-[40px] font-bold tracking-[-0.04em] text-white mb-6 sm:mb-10">
              Germany Student Visa — Step by Step
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {VISA_STEPS.map((step, i) => (
                <div key={step.step} className={`rounded-[16px] p-5 sm:p-6 border transition-all ${i === 0 ? 'bg-[#690B1B] border-[#690B1B]' : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'}`}>
                  <div className={`text-[28px] sm:text-[34px] font-bold mb-3 sm:mb-4 leading-none ${i === 0 ? 'text-white/20' : 'text-white/10'}`}>{step.step}</div>
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-white mb-1.5 sm:mb-2">{step.title}</h3>
                  <p className={`text-[12px] sm:text-[13px] leading-relaxed ${i === 0 ? 'text-white/75' : 'text-[#6E7380]'}`}>{step.desc}</p>
                </div>
              ))}
            </div>

            {/* APS Alert */}
            <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-[16px] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A55D]/20 flex items-center justify-center shrink-0">
                <Icon name="light" className="w-5 h-5 text-[#C9A55D]" />
              </div>
              <div>
                <div className="text-[13px] sm:text-[14px] font-bold text-[#C9A55D] mb-1">APS Certificate — Mandatory Requirement for Indian Applicants</div>
                <p className="text-[12px] sm:text-[13px] text-[#9CA3AF] leading-relaxed">
                  The <strong className="text-white">Academic Evaluation Centre (Akademische Prüfstelle - APS India)</strong> in New Delhi verifies that your Indian educational qualifications are genuine. German universities and the German Embassy reject applications that lack an APS certificate. Processing takes 4–8 weeks. <strong className="text-white">Begin your APS application immediately before university deadlines!</strong>
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
              <span className="text-[#C8A15D] italic">Germany 🇩🇪</span>
            </h2>
            <p className="text-[#D6AEB7] text-[13px] sm:text-[16px] leading-[1.8] sm:leading-[1.9] max-w-[580px] mx-auto mb-8 sm:mb-10">
              Shortlist your universities with NC grades and APS requirements, apply with uni-assist, find DAAD scholarships, and prepare your visa documentation — all in one place.
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
