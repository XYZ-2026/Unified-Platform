export interface CountryGuideData {
  slug: string;
  countryName: string;
  heroDescription: string;
  heroImage: string;
  heroBadgeText: string;
  heroFacts: {
    tuition: string;
    livingCost: string;
    englishBenchmark: string;
    studentVisa: string;
  };
  whyStudyHere: {
    num: string;
    text: string;
  }[];
  quickFacts: {
    currency: string;
    visa: string;
    majorIntakes: string;
    popularLevels: string;
    popularFields: string;
  };
  admissionRequirements: {
    academicQualification: { title: string; value: string; badge: string };
    academicBenchmark: { title: string; value: string; badge: string };
    englishRequirement: { title: string; value: string; badge: string };
    applicationRequirement: { title: string; value: string; badge: string };
    majorIntakes: { title: string; value: string; badge: string };
  };
  testsAndExams: {
    test: string;
    score: string;
    validity: string;
    requirement: string;
    badgeVariant: 'required' | 'usually' | 'specific' | 'optional' | 'varies';
  }[];
  visaProcess: {
    step: string;
    title: string;
    desc: string;
  }[];
  costOfStudy: {
    tuition: string;
    livingExpenses: string;
    healthInsurance: string;
    visaApplication: string;
    proofOfFunds: string;
  };
  workAndPostStudy: {
    partTimeWork: string[];
    postStudyWork: string[];
  };
  documents: {
    universityApplication: {
      name: string;
      status: string;
      badgeVariant: 'required' | 'usually' | 'specific' | 'optional' | 'country';
    }[];
    financialAndVisa: {
      name: string;
      status: string;
      badgeVariant: 'required' | 'usually' | 'specific' | 'optional' | 'country';
    }[];
  };
  timeline: {
    step: string;
    title: string;
    desc: string;
    time: string;
  }[];
  goodToKnow: string[];
  lastVerified: string;
  source: string;
}

export const COUNTRY_GUIDES: Record<string, CountryGuideData> = {
  "usa": {
    "slug": "usa",
    "countryName": "USA",
    "heroDescription": "Explore top-ranked research universities, flexible curriculum majors, and extensive STEM career opportunities.",
    "heroImage": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · USA edition",
    "heroFacts": {
      "tuition": "$20,000–$55,000 / yr",
      "livingCost": "$1,000–$2,500 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 80+",
      "studentVisa": "F-1 Student Visa"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Home to the largest concentration of world top-ranked research institutions."
      },
      {
        "num": "02",
        "text": "Flexible academic degrees allow easy major switching and interdisciplinary study."
      },
      {
        "num": "03",
        "text": "Lucrative post-study STEM OPT work authorization for up to three years."
      },
      {
        "num": "04",
        "text": "Unrivaled global networking across technology, finance, and healthcare hubs."
      }
    ],
    "quickFacts": {
      "currency": "US Dollar (USD)",
      "visa": "F-1 Nonimmigrant Student Visa",
      "majorIntakes": "Fall (August/September) · Spring (January) · Summer (May)",
      "popularLevels": "Undergraduate · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · Data Science · Mechanical Engineering · Business Analytics · Finance"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "GPA 3.0+ / 4.0 or 60%+ academic score in prior studies",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ or TOEFL iBT 80–100 or Duolingo 115+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "University application portal or Common Application with essays",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (August/September - Application: Nov to Feb)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE Exam",
        "score": "Quantitative 160+ / Verbal 150+",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "GMAT Exam",
        "score": "620+ for competitive business schools",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "SAT / ACT",
        "score": "1200+ SAT or 26+ ACT for undergraduate",
        "validity": "5 years",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Secure Admission",
        "desc": "Receive unconditional admission offer from SEVP certified institution."
      },
      {
        "step": "02",
        "title": "Form I-20 Receipt",
        "desc": "College issues official I-20 certificate of eligibility document."
      },
      {
        "step": "03",
        "title": "Pay SEVIS Fee",
        "desc": "Complete $350 SEVIS I-901 registration fee payment online."
      },
      {
        "step": "04",
        "title": "Submit DS-160",
        "desc": "Fill online nonimmigrant DS-160 visa form and pay fee."
      },
      {
        "step": "05",
        "title": "Attend Interview",
        "desc": "Book appointment and attend biometrics and consulate interview."
      },
      {
        "step": "06",
        "title": "Receive Visa",
        "desc": "Collect stamped F-1 student visa and book travel flight."
      }
    ],
    "costOfStudy": {
      "tuition": "$20,000–$55,000 / year (Public: $20k–$35k · Private: $38k–$55k+)",
      "livingExpenses": "$1,000–$2,500 / month (Regional: $1k–$1.5k · Metro: $1.8k–$2.5k)",
      "healthInsurance": "$1,000–$3,000 / year (Mandatory university student health insurance)",
      "visaApplication": "$535 total ($350 SEVIS I-901 fee + $185 DS-160 fee)",
      "proofOfFunds": "Full 1st year total on Form I-20 (tuition + living)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week on-campus during academic semesters.",
        "Full-time on-campus work permitted during official scheduled breaks.",
        "Off-campus work permitted after one year via CPT authorization."
      ],
      "postStudyWork": [
        "12-month post-completion Optional Practical Training (OPT) for all degrees.",
        "24-month STEM extension available for eligible science and tech graduates.",
        "Direct transition path to employer-sponsored H-1B specialty work visa."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Letters of Recommendation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Standardized Test Score Card",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Form I-20 Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "SEVIS I-901 Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Solvency Financial Statements",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "DS-160 Confirmation Barcode Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Embassy Appointment Confirmation Letter",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlisting",
        "desc": "Research accredited universities and degree prerequisites",
        "time": "12–15 months before"
      },
      {
        "step": "02",
        "title": "Standardized Exams",
        "desc": "Complete IELTS/TOEFL and GRE/GMAT testing schedules",
        "time": "10–12 months before"
      },
      {
        "step": "03",
        "title": "Application Filing",
        "desc": "Submit online applications with essays and references",
        "time": "8–10 months before"
      },
      {
        "step": "04",
        "title": "Admission & I-20",
        "desc": "Accept admission offer and request Form I-20 document",
        "time": "5–7 months before"
      },
      {
        "step": "05",
        "title": "SEVIS & Visa Form",
        "desc": "Pay SEVIS I-901 fee and complete DS-160 form",
        "time": "3–5 months before"
      },
      {
        "step": "06",
        "title": "Consulate Interview",
        "desc": "Attend consular interview at nearest US embassy center",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & Housing",
        "desc": "Finalize flight booking and arrive for campus orientation",
        "time": "2–3 weeks before"
      }
    ],
    "goodToKnow": [
      "Application deadlines for Fall intake generally close between November and February.",
      "You can legally enter the United States up to thirty days before program start.",
      "Financial bank statements must demonstrate full coverage of first-year total I-20 costs.",
      "On-campus jobs are in high demand, so early application on arrival is essential."
    ],
    "lastVerified": "September 2026",
    "source": "U.S. Department of State & EducationUSA"
  },
  "uk": {
    "slug": "uk",
    "countryName": "UK",
    "heroDescription": "Gain internationally acclaimed qualifications through intensive one-year Master’s degrees and dynamic Graduate Route post-study work.",
    "heroImage": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · UK edition",
    "heroFacts": {
      "tuition": "£12,000–£35,000 / yr",
      "livingCost": "£1,000–£1,600 / mo",
      "englishBenchmark": "IELTS 6.5+ / PTE 60+",
      "studentVisa": "Student Visa (Tier 4)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Fast-track one-year Master’s degrees significantly lower overall study costs."
      },
      {
        "num": "02",
        "text": "Historic Russell Group universities recognized worldwide for academic rigor."
      },
      {
        "num": "03",
        "text": "Two-year unsponsored Graduate Route work visa available for all graduates."
      },
      {
        "num": "04",
        "text": "Strategic global gateway to European, African, and international markets."
      }
    ],
    "quickFacts": {
      "currency": "British Pound (GBP)",
      "visa": "UK Student Visa (Points-Based)",
      "majorIntakes": "Autumn (September/October) · Winter (January/February)",
      "popularLevels": "Undergraduate · 1-Year Master’s · Doctoral (PhD)",
      "popularFields": "International Business · Data Science · FinTech · Law · Artificial Intelligence"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "3-year or 4-year Bachelor degree / 12 years of schooling",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–65%+ (UK 2:1 or 2:2 undergraduate degree equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or PTE 59–69 (waiver based on 12th English)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal or UCAS (Undergraduate)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September/October Intake (Application: Jan to July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic / UKVI",
        "score": "6.5 overall (min 6.0 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "60–68 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "85–95 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Required only for elite MBA programs",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Unconditional Offer",
        "desc": "Satisfy all academic conditions and accept your university offer."
      },
      {
        "step": "02",
        "title": "Receive CAS Letter",
        "desc": "University issues Confirmation of Acceptance for Studies reference."
      },
      {
        "step": "03",
        "title": "Fulfill 28-Day Rule",
        "desc": "Maintain living and tuition funds for 28 consecutive days."
      },
      {
        "step": "04",
        "title": "Online Application",
        "desc": "Submit online visa application and pay fee plus IHS surcharge."
      },
      {
        "step": "05",
        "title": "VFS Biometrics",
        "desc": "Attend appointment at visa center for photo and fingerprinting."
      },
      {
        "step": "06",
        "title": "Collect Visa",
        "desc": "Receive passport visa vignette or digital eVisa status notification."
      }
    ],
    "costOfStudy": {
      "tuition": "£12,000–£35,000 / year (Classroom: £12k–£22k · STEM/MBA: £20k–£35k)",
      "livingExpenses": "£1,023–£1,334 / month (£1,334/mo London · £1,023/mo Outside London)",
      "healthInsurance": "£776 / year (Immigration Health Surcharge - IHS)",
      "visaApplication": "£490 Student Visa fee (+ mandatory IHS healthcare charge)",
      "proofOfFunds": "Tuition balance + 9 months living held for 28 days (£9.2k–£12k)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during active academic university term.",
        "Full-time work permitted during official scheduled university vacation periods.",
        "Freelance work, business ownership, and self-employment are strictly prohibited."
      ],
      "postStudyWork": [
        "Two-year Graduate Route visa for Bachelor’s and Master’s degree holders.",
        "Three-year Graduate Route visa for doctoral PhD graduates.",
        "Direct conversion to Skilled Worker Visa with approved licensed employer."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Transcripts and Degree Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Personal Statement of Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Reference Letters",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Updated Professional Resume",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official CAS Statement Number",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "28-Day Consecutive Bank Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Tuberculosis Clearance Certificate",
          "status": "Country Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "ATAS Clearance Certificate",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "IHS and Visa Application Receipts",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Exploration",
        "desc": "Research 1-year Master’s courses and entry prerequisites",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/PTE or verify English medium waiver criteria",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Filing",
        "desc": "Submit university applications and personal motivation statements",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Deposit & CAS",
        "desc": "Pay tuition deposit and request CAS reference number",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Financial Maintenance",
        "desc": "Complete 28-day funds holding period in bank account",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Visa Submission",
        "desc": "Apply online, pay IHS healthcare fee, and attend VFS",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & Welcome",
        "desc": "Fly to UK, collect Biometric Residence Permit, and enroll",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Financial maintenance funds must stay in bank account unbroken for 28 full days.",
      "Tuition deposit paid to university is automatically deducted from CAS financial requirement.",
      "The Immigration Health Surcharge gives full access to the UK National Health Service.",
      "Graduates on the Graduate Route can work in any sector without salary minimums."
    ],
    "lastVerified": "September 2026",
    "source": "UK Visas and Immigration (UKVI) & British Council"
  },
  "canada": {
    "slug": "canada",
    "countryName": "Canada",
    "heroDescription": "Experience globally ranked higher education, affordable living standards, and clear post-graduation work permit pathways.",
    "heroImage": "https://images.unsplash.com/photo-1517935703635-2717090c2210?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Canada edition",
    "heroFacts": {
      "tuition": "CAD $18,000–$40,000 / yr",
      "livingCost": "CAD $1,200–$2,200 / mo",
      "englishBenchmark": "IELTS 6.5+ / PTE 60+",
      "studentVisa": "Study Permit + TRV"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Generous Post-Graduation Work Permit (PGWP) offers up to three years of stay."
      },
      {
        "num": "02",
        "text": "High educational standards across globally recognized universities and colleges."
      },
      {
        "num": "03",
        "text": "Welcoming multicultural society with clear economic permanent residency streams."
      },
      {
        "num": "04",
        "text": "Affordable tuition rates compared to American and Australian alternatives."
      }
    ],
    "quickFacts": {
      "currency": "Canadian Dollar (CAD)",
      "visa": "Canadian Study Permit + eTA/TRV",
      "majorIntakes": "Fall (September) · Winter (January) · Summer (May)",
      "popularLevels": "Diploma · Bachelor’s · Post-Graduate Diploma · Master’s",
      "popularFields": "Computer Science · Cloud Computing · Engineering · Business Analytics · Healthcare"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%–70%+ (GPA 3.0+ / 4.0 for university Master’s degrees)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS Academic 6.5+ (no band < 6.0) or PTE 60+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct DLI university portal or OUAC (Ontario undergraduate)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Intake (September - Application: Dec to March)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 per band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "60–66 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "88–95 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Duolingo Test",
        "score": "115–125+ (select designated colleges)",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Letter of Acceptance",
        "desc": "Secure formal LOA from Designated Learning Institution (DLI)."
      },
      {
        "step": "02",
        "title": "Pay Year Tuition",
        "desc": "Transfer full first-year tuition fee directly to DLI account."
      },
      {
        "step": "03",
        "title": "Purchase GIC",
        "desc": "Deposit CAD $20,635 into Guaranteed Investment Certificate account."
      },
      {
        "step": "04",
        "title": "Upfront Medicals",
        "desc": "Complete medical exam with an authorized IRCC panel physician."
      },
      {
        "step": "05",
        "title": "Submit Permit",
        "desc": "Apply online on IRCC portal and complete biometrics appointment."
      },
      {
        "step": "06",
        "title": "Port of Entry",
        "desc": "Receive Port of Entry introduction letter and travel to Canada."
      }
    ],
    "costOfStudy": {
      "tuition": "CAD $18,000–$40,000 / year (Colleges: $18k–$25k · Universities: $25k–$40k)",
      "livingExpenses": "CAD $1,200–$2,200 / month (Montreal lower · Toronto/Vancouver higher)",
      "healthInsurance": "CAD $600–$1,200 / year (Provincial health coverage or UHIP)",
      "visaApplication": "CAD $235 total ($150 Study Permit + $85 Biometrics fee)",
      "proofOfFunds": "CAD $20,635 GIC living deposit + paid 1st year tuition receipt"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week off-campus during regular academic study semesters.",
        "Full-time off-campus work allowed during scheduled winter and summer vacations.",
        "Requires active full-time enrollment status at a PGWP-eligible DLI institution."
      ],
      "postStudyWork": [
        "Post-Graduation Work Permit (PGWP) valid for eight months to three years.",
        "Master’s degree graduates eligible for full three-year work authorization.",
        "Open work permit allows employment with any eligible Canadian employer."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Transcripts and Degree Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Statement of Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Recommendation Letters",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "English Language Test Score Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official DLI Letter of Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Provincial Attestation Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "GIC Bank Certificate of CAD $20,635",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Upfront Medical Examination Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Institution Selection",
        "desc": "Research PGWP-eligible Designated Learning Institutions",
        "time": "12–15 months before"
      },
      {
        "step": "02",
        "title": "Language Testing",
        "desc": "Complete IELTS or PTE exam to meet score prerequisites",
        "time": "10–12 months before"
      },
      {
        "step": "03",
        "title": "Application Filing",
        "desc": "Submit college/university applications and study intent letters",
        "time": "8–10 months before"
      },
      {
        "step": "04",
        "title": "Offer & PAL Letter",
        "desc": "Accept admission offer and obtain Provincial Attestation Letter",
        "time": "5–7 months before"
      },
      {
        "step": "05",
        "title": "GIC & Medical Exam",
        "desc": "Deposit GIC living funds and complete panel medical check",
        "time": "3–5 months before"
      },
      {
        "step": "06",
        "title": "Permit Submission",
        "desc": "Submit online IRCC application and give VAC biometrics",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & POE Letter",
        "desc": "Receive Port of Entry letter and travel to Canada",
        "time": "2–3 weeks before"
      }
    ],
    "goodToKnow": [
      "Provincial Attestation Letters (PAL) are mandatory for most college and undergraduate applicants.",
      "The minimum GIC requirement is set at CAD $20,635 to reflect living benchmarks.",
      "Ensure your chosen degree program is officially eligible for the PGWP before enrolling.",
      "Keep your original Letter of Acceptance and POE letter in hand luggage."
    ],
    "lastVerified": "September 2026",
    "source": "Immigration, Refugees and Citizenship Canada (IRCC)"
  },
  "germany": {
    "slug": "germany",
    "countryName": "Germany",
    "heroDescription": "Study at tuition-free world-class public universities with cutting-edge research facilities and an 18-month stay-back job search visa.",
    "heroImage": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Germany edition",
    "heroFacts": {
      "tuition": "€0 (Public) / yr",
      "livingCost": "€850–€1,350 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "National Visa (Type D)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Zero tuition fees charged at almost all renowned public universities."
      },
      {
        "num": "02",
        "text": "Global engineering and innovation leader in automotive and renewable energy."
      },
      {
        "num": "03",
        "text": "18-month post-study Job Seeker Visa with fast permanent residency routes."
      },
      {
        "num": "04",
        "text": "Full Schengen visa privileges enable travel across 27 European nations."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa Type D (Study)",
      "majorIntakes": "Winter (September/October) · Summer (March/April)",
      "popularLevels": "Bachelor of Science · Master of Science · Doctoral (PhD)",
      "popularFields": "Mechanical Engineering · Computer Science · Automotive Systems · Renewable Energy · Data Science"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "13 years schooling or recognized 4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "German GPA 2.5 or better (approx. 70%+ Indian equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ or TOEFL 90+ for English-medium programs",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Uni-Assist portal or direct university application system",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Winter Semester (September/October - Application: May to July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 90+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TestDaF / Goethe",
        "score": "B2 / C1 level (only for German tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "APS Certificate",
        "score": "Mandatory verification for India/China/Vietnam",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GATE",
        "score": "Required for select TU9 engineering degrees",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "APS Certificate",
        "desc": "Complete academic credential verification via official APS portal."
      },
      {
        "step": "02",
        "title": "Secure Admission",
        "desc": "Receive official Zulassungsbescheid university admission offer."
      },
      {
        "step": "03",
        "title": "Blocked Account",
        "desc": "Deposit €11,208 into a certified German blocked account provider."
      },
      {
        "step": "04",
        "title": "Health Insurance",
        "desc": "Enroll in statutory public student health insurance coverage."
      },
      {
        "step": "05",
        "title": "Visa Appointment",
        "desc": "Submit visa application dossier at German embassy or VFS."
      },
      {
        "step": "06",
        "title": "Travel & Register",
        "desc": "Receive National Visa D sticker and register city residence."
      }
    ],
    "costOfStudy": {
      "tuition": "€0 tuition (Public) (Semester admin fee: €150–€350 / semester)",
      "livingExpenses": "€850–€1,350 / month (Smaller cities: €850–€1k · Munich/Berlin: €1.1k–€1.35k)",
      "healthInsurance": "€110–€130 / month (Statutory public insurance: TK, AOK, Barmer)",
      "visaApplication": "€75 National Student Visa (D) application fee",
      "proofOfFunds": "€11,208 / year (€934/month) in a Blocked Account (Sperrkonto)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 140 full days or 280 half days per calendar year.",
        "On-campus academic assistant (HiWi) jobs do not count toward limits.",
        "Self-employment, freelancing, and gig work are restricted without special permit."
      ],
      "postStudyWork": [
        "18-month Job Seeker Residence Permit (Aufenthaltserlaubnis) following graduation.",
        "Unrestricted full-time work rights permitted during the entire job search.",
        "Eligible for EU Blue Card and permanent settlement after two years."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "APS Verification Certificate",
          "status": "Country Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Official Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Curriculum Vitae in Europass Format",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Zulassungsbescheid Admission Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Sperrkonto Confirmation Letter of €11,208",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statutory Health Insurance Membership Proof",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Videx National Visa Form",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Biometric Passport Photographs",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "APS Verification",
        "desc": "Submit transcripts to APS center for mandatory credential verification",
        "time": "12–15 months before"
      },
      {
        "step": "02",
        "title": "Exams & Scores",
        "desc": "Complete IELTS/TOEFL and prepare German language certifications",
        "time": "10–12 months before"
      },
      {
        "step": "03",
        "title": "Portal Submissions",
        "desc": "Submit applications via Uni-Assist or direct university portals",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Letters",
        "desc": "Receive formal Zulassungsbescheid admission offer documents",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Blocked Account",
        "desc": "Open Sperrkonto, transfer €11,208, and enroll in health insurance",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Visa Appointment",
        "desc": "Book and attend visa appointment at German embassy/consulate",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & Anmeldung",
        "desc": "Fly to Germany, complete city address registration, and matriculate",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "APS certificate is strictly mandatory for Indian students before visa filing.",
      "Public universities charge zero tuition, but a semester ticket fee applies.",
      "Learning conversational German (A2/B1) significantly improves local student part-time hiring.",
      "Student accommodation must be reserved early due to long municipal waitlists."
    ],
    "lastVerified": "September 2026",
    "source": "DAAD (German Academic Exchange Service) & Federal Foreign Office"
  },
  "australia": {
    "slug": "australia",
    "countryName": "Australia",
    "heroDescription": "Gain world-class Group of Eight education with high minimum wages, stunning coastal lifestyle, and generous graduate work visas.",
    "heroImage": "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Australia edition",
    "heroFacts": {
      "tuition": "AUD $25,000–$45,000 / yr",
      "livingCost": "AUD $1,400–$2,500 / mo",
      "englishBenchmark": "IELTS 6.5+ / PTE 58+",
      "studentVisa": "Subclass 500 Visa"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Prestigious Group of Eight universities consistently rank in global top fifty."
      },
      {
        "num": "02",
        "text": "High statutory minimum wages and flexible working conditions for students."
      },
      {
        "num": "03",
        "text": "Subclass 485 Temporary Graduate Visa provides two to four years stay."
      },
      {
        "num": "04",
        "text": "Globally renowned student cities including Melbourne, Sydney, and Brisbane."
      }
    ],
    "quickFacts": {
      "currency": "Australian Dollar (AUD)",
      "visa": "Student Visa (Subclass 500)",
      "majorIntakes": "Semester 1 (February/March) · Semester 2 (July/August)",
      "popularLevels": "Undergraduate · Master’s by Coursework · Doctoral (PhD)",
      "popularFields": "Information Technology · Mining Engineering · Business Analytics · Nursing · Biotechnology"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%–65%+ (Section 1 or 2 recognized university benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (min 6.0 in each band) or PTE 58–64",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online portal or authorized registered education agent",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "February/March (Semester 1 - Application: Aug to Nov)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "58–65 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "79–90 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Rarely required",
        "validity": "evaluated purely on GPA",
        "requirement": "5 years",
        "badgeVariant": "varies"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Receive Offer",
        "desc": "Submit application and pass university Genuine Student assessment."
      },
      {
        "step": "02",
        "title": "Deposit & OSHC",
        "desc": "Pay first semester deposit and purchase Overseas Student Health Cover."
      },
      {
        "step": "03",
        "title": "Obtain CoE",
        "desc": "University issues electronic Confirmation of Enrolment (CoE) certificate."
      },
      {
        "step": "04",
        "title": "ImmiAccount Filing",
        "desc": "Submit online Subclass 500 student visa form and fee."
      },
      {
        "step": "05",
        "title": "Medical & Biometrics",
        "desc": "Complete panel health checkup and submit biometric fingerprints."
      },
      {
        "step": "06",
        "title": "Visa Grant Notice",
        "desc": "Receive electronic visa grant letter and arrange flight booking."
      }
    ],
    "costOfStudy": {
      "tuition": "AUD $25,000–$45,000 / year (UG: $25k–$38k · PG & STEM: $32k–$45k)",
      "livingExpenses": "AUD $1,400–$2,500 / month (Adelaide/Perth lower · Sydney/Melbourne higher)",
      "healthInsurance": "AUD $600–$750 / year (Overseas Student Health Cover - OSHC)",
      "visaApplication": "AUD $710 Student Visa (Subclass 500) application fee",
      "proofOfFunds": "AUD $29,710 / year official living cost + 1st year tuition balance"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 48 hours per fortnight during active university study periods.",
        "Unlimited work hours permitted during scheduled university vacations and breaks.",
        "High statutory national minimum wage of approximately AUD $23.23+ per hour."
      ],
      "postStudyWork": [
        "Subclass 485 Temporary Graduate Visa for eligible higher education graduates.",
        "Two to three years post-study work authorization for Master’s graduates.",
        "Additional one to two years available for studying in regional locations."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Genuine Student",
          "status": "GS) Written Statement (Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Proficiency Test Score Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Work Experience Reference Documents",
          "status": "Program Specific",
          "badgeVariant": "specific"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Electronic Confirmation of Enrolment",
          "status": "CoE) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "OSHC Health Insurance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Financial Solvency",
          "status": "AUD $29,710+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Education Loan Sanction Letter",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "e-Medical Panel Examination Clearance",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Research",
        "desc": "Compare Group of Eight and Australian research institutions",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Exams",
        "desc": "Complete IELTS or PTE Academic and meet required bands",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application & GS",
        "desc": "Submit university application with Genuine Student written responses",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Accept & CoE",
        "desc": "Pay tuition deposit, buy OSHC insurance, and get CoE",
        "time": "3–5 months before"
      },
      {
        "step": "05",
        "title": "Health & Biometrics",
        "desc": "Complete e-Medical exam and attend biometric collection",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Decision",
        "desc": "Receive electronic Subclass 500 visa grant approval",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Orientation",
        "desc": "Fly to Australia, secure accommodation, and attend orientation",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "The Genuine Student (GS) assessment evaluates academic progression and future career plans.",
      "Proof of funds must cover AUD $29,710 living costs plus travel and tuition.",
      "Studying in designated regional areas grants extra years of stay-back rights.",
      "Overseas Student Health Cover (OSHC) is mandatory for your full visa duration."
    ],
    "lastVerified": "September 2026",
    "source": "Australian Department of Home Affairs & Study Australia"
  },
  "ireland": {
    "slug": "ireland",
    "countryName": "Ireland",
    "heroDescription": "Study in the tech capital of Europe with globally ranked universities, 1-year Master’s degrees, and a 2-year post-study work visa.",
    "heroImage": "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Ireland edition",
    "heroFacts": {
      "tuition": "€10,000–€25,000 / yr",
      "livingCost": "€800–€1,500 / mo",
      "englishBenchmark": "IELTS 6.5+ / Duolingo 110+",
      "studentVisa": "Study Visa (Stamp 2)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "European headquarters for global technology and pharmaceutical multinational giants."
      },
      {
        "num": "02",
        "text": "Only native English-speaking economy in the European Eurozone single market."
      },
      {
        "num": "03",
        "text": "Two-year Third Level Graduate Scheme (Stamp 1G) post-study work visa."
      },
      {
        "num": "04",
        "text": "High return on investment through accelerated one-year Master’s programs."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Stamp 2 Student Visa (AVATS)",
      "majorIntakes": "Autumn (September/October) · Spring (January/February)",
      "popularLevels": "Undergraduate · 1-Year Master’s · Doctoral (PhD)",
      "popularFields": "Data Analytics · Cloud Computing · Biotechnology · Pharmaceutical Science · Finance"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "3-year or 4-year Bachelor degree / 12 years schooling",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. 2.1 / 2.2 Irish honours degree equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (no band < 6.0) or Duolingo 110–120+ / PTE 63+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal or PAC system",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September/October Intake (Application: Nov to May)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Duolingo English Test",
        "score": "110–120+ overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic / TOEFL",
        "score": "PTE 63+ / TOEFL iBT 88+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Not required for standard master’s programs",
        "validity": "5 years",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Unconditional Offer",
        "desc": "Receive formal offer from approved Irish higher education institution."
      },
      {
        "step": "02",
        "title": "Pay Tuition Fee",
        "desc": "Transfer at least €6,000 or full first-year tuition."
      },
      {
        "step": "03",
        "title": "Financial Proof",
        "desc": "Prepare bank statement showing €10,000 living funds for 6 months."
      },
      {
        "step": "04",
        "title": "AVATS Application",
        "desc": "Complete online AVATS visa application form and pay visa fee."
      },
      {
        "step": "05",
        "title": "VFS Submission",
        "desc": "Submit physical application dossier and biometric data at VFS."
      },
      {
        "step": "06",
        "title": "IRP Registration",
        "desc": "Collect stamped entry visa, fly to Ireland, and register IRP."
      }
    ],
    "costOfStudy": {
      "tuition": "€10,000–€25,000 / year (Humanities: €10k–€15k · STEM/Business: €15k–€25k)",
      "livingExpenses": "€800–€1,500 / month (Cork/Galway: €800–€1.1k · Dublin: €1.2k–€1.5k)",
      "healthInsurance": "€150–€300 / year (Private student comprehensive medical insurance)",
      "visaApplication": "€60 single-entry / €100 multi-entry visa fee",
      "proofOfFunds": "€10,000 / year living funds + full tuition receipt (6-mo statement)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during active university study semesters.",
        "Up to 40 hours per week during June, July, August, September, and holidays.",
        "High statutory national minimum wage rate of €12.70+ per hour."
      ],
      "postStudyWork": [
        "Two-year Third Level Graduate Scheme (Stamp 1G) for Master’s graduates.",
        "One-year Stamp 1G post-study work visa for Bachelor’s degree holders.",
        "Direct pathway to Critical Skills Employment Permit (CSEP) with top employers."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Degree and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Personal Statement of Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Letters of Recommendation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Test Score Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Offer Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Electronic Tuition Fee Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "6-Month Continuous Bank Statements",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Private Student Medical Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Summary AVATS Visa Application Sheet",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Search",
        "desc": "Explore Irish universities and one-year Master’s programs",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Test",
        "desc": "Complete IELTS, Duolingo, or PTE Academic examination",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Portal Applications",
        "desc": "Submit applications directly to Trinity, UCD, Galway, or UCC",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Accept & Deposit",
        "desc": "Accept offer and transfer initial tuition deposit fee",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "AVATS & Insurance",
        "desc": "Complete AVATS form, purchase medical insurance, and file at VFS",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Visa Issuance",
        "desc": "Receive stamped passport with Stamp D entry visa sticker",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Arrival & IRP",
        "desc": "Arrive in Ireland, attend orientation, and register IRP card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Duolingo English Test (DET) is widely accepted across top Irish universities.",
      "Bank statements must demonstrate a clean six-month continuous transaction history.",
      "Tuition fee payment receipt is strictly required before booking visa appointment.",
      "Dublin has high housing demand, so secure accommodation immediately after admission."
    ],
    "lastVerified": "September 2026",
    "source": "Immigration Service Delivery (ISD Ireland) & Education in Ireland"
  },
  "france": {
    "slug": "france",
    "countryName": "France",
    "heroDescription": "Benefit from subsidized public university tuition, top-ranked Grandes Écoles, CAF housing aid, and a two-year post-study work authorization.",
    "heroImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · France edition",
    "heroFacts": {
      "tuition": "€2,770–€15,000 / yr",
      "livingCost": "€700–€1,400 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 85+",
      "studentVisa": "Long-Stay Visa (VLS-TS)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Highly subsidized public university tuition and nationwide CAF housing subsidies."
      },
      {
        "num": "02",
        "text": "Elite Grandes Écoles and top European business schools (HEC, ESSEC, INSEAD)."
      },
      {
        "num": "03",
        "text": "Two-year post-study work authorization (RECE/APS) for Master’s degree graduates."
      },
      {
        "num": "04",
        "text": "Vibrant innovation clusters across Paris, Lyon, Toulouse, and Sophia Antipolis."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Long-Stay Visa (VLS-TS Étudiant)",
      "majorIntakes": "Fall (September/October) · Spring (January/February)",
      "popularLevels": "Bachelor · Grande École · Master’s Degree · Doctorate (PhD)",
      "popularFields": "Luxury Brand Management · Data Science · Aerospace Engineering · Fashion · International Business"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (GPA 2.8+ / 4.0; top business schools vary)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ / TOEFL 85+ (no French required for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Campus France (Études en France) portal or direct school portal",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September/October Intake (Application: Nov to April)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL iBT 85+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "DELF / DALF",
        "score": "B2 / C1 level (only for French-taught programs)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "GMAT / GRE",
        "score": "Required for top business schools (HEC, ESSEC)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Campus France Interview",
        "score": "Mandatory academic motivation interview",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "EEF Application",
        "desc": "Submit application dossier on official Études en France portal."
      },
      {
        "step": "02",
        "title": "Attend Interview",
        "desc": "Complete academic motivation interview with Campus France advisor."
      },
      {
        "step": "03",
        "title": "Receive Certificate",
        "desc": "Obtain official Campus France visa authorization certificate."
      },
      {
        "step": "04",
        "title": "France-Visas Form",
        "desc": "Fill online Long-Stay Student Visa (VLS-TS) application form."
      },
      {
        "step": "05",
        "title": "VFS Biometrics",
        "desc": "Submit physical application dossier and biometric fingerprints at VFS."
      },
      {
        "step": "06",
        "title": "Validate OFII",
        "desc": "Receive visa vignette and complete online OFII validation on arrival."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,770–€3,770 / year (Public: UG €2.77k, PG €3.77k · Grandes Écoles: €8k–€18k)",
      "livingExpenses": "€700–€1,400 / month (Regional: €700–€900 · Paris: €1.1k–€1.4k · CAF rent rebate up to 30%)",
      "healthInsurance": "€0 / year (Free French National Social Security - Sécurité Sociale)",
      "visaApplication": "€50 VFS long-stay visa fee (+ €50–€100 Campus France fee)",
      "proofOfFunds": "€615 / month (€7,380 / year) minimum demonstrated funds"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 964 hours per year (~60% of annual working hours).",
        "Equivalent to approximately 20 hours per week during academic semesters.",
        "High statutory national minimum wage (SMIC approximately €11.65+ per hour)."
      ],
      "postStudyWork": [
        "Two-year RECE post-study residence permit for all Master’s graduates.",
        "Full-time employment permitted during the entire two-year stay-back period.",
        "Direct pathway to multi-year Passeport Talent (Talent Passport) residence permit."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts and Degree",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Personal Statement of Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Recommendation Letters",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Campus France EEF Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official University Admission Attestation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Financial Solvency",
          "status": "€7,380+ / year) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Accommodation for First 3 Months",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed France-Visas Application Summary",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Search",
        "desc": "Shortlist degrees on the official Campus France catalogue",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL and assemble academic portfolio",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "EEF Submission",
        "desc": "Submit dossiers through the Études en France portal",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Deposit",
        "desc": "Accept admission offer and pay initial school deposit",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Campus France NOC",
        "desc": "Attend motivation interview and get visa authorization",
        "time": "2–4 months before"
      },
      {
        "step": "06",
        "title": "Visa Appointment",
        "desc": "Complete France-Visas application and attend VFS biometrics",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & CAF",
        "desc": "Fly to France, validate VLS-TS online, and apply for CAF",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "International students in France are eligible for CAF monthly housing subsidies.",
      "French national healthcare (Sécurité Sociale) is completely free for all students.",
      "Campus France interview clearance is strictly mandatory before booking visa at VFS.",
      "Basic French language knowledge (A2) significantly enriches daily life and internships."
    ],
    "lastVerified": "September 2026",
    "source": "Campus France & Ministère des Affaires Étrangères"
  },
  "new-zealand": {
    "slug": "new-zealand",
    "countryName": "New Zealand",
    "heroDescription": "Study in a safe, pristine environment with all 8 universities in the global top 3%, generous post-study work rights, and Green List pathways.",
    "heroImage": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · New Zealand edition",
    "heroFacts": {
      "tuition": "NZD $22,000–$38,000 / yr",
      "livingCost": "NZD $1,250–$2,000 / mo",
      "englishBenchmark": "IELTS 6.5+ / PTE 58+",
      "studentVisa": "Fee Paying Student Visa"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "100% of New Zealand universities rank in the global top three percent."
      },
      {
        "num": "02",
        "text": "Post-Study Work Visa offers up to three years of open work rights."
      },
      {
        "num": "03",
        "text": "Fast-track Green List permanent residence pathways in tech and healthcare."
      },
      {
        "num": "04",
        "text": "Peaceful nation consistently ranked among the world’s safest countries."
      }
    ],
    "quickFacts": {
      "currency": "New Zealand Dollar (NZD)",
      "visa": "Fee Paying Student Visa (INZ)",
      "majorIntakes": "Semester 1 (February/March) · Semester 2 (July/August)",
      "popularLevels": "Undergraduate · Master’s by Coursework · Doctoral (PhD)",
      "popularFields": "Computer Science · Civil Engineering · Agriculture · Data Science · Environmental Management"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (GPA 2.7+ / 4.0 benchmark equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (no band < 6.0) or PTE Academic 58+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal or authorized education agent",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "February/March (Semester 1 - Application: Aug to Nov)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 in all bands)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "58–64 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "80–90 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Not required for standard master’s degrees",
        "validity": "5 years",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Offer of Place",
        "desc": "Secure formal Offer of Place from an approved NZ university."
      },
      {
        "step": "02",
        "title": "Medical & Police",
        "desc": "Complete panel e-Medical check and obtain police clearance."
      },
      {
        "step": "03",
        "title": "Online Application",
        "desc": "Submit student visa application online via Immigration NZ."
      },
      {
        "step": "04",
        "title": "Receive AIP",
        "desc": "Receive formal Approval in Principle (AIP) notification from INZ."
      },
      {
        "step": "05",
        "title": "Pay Tuition Fee",
        "desc": "Transfer first-year tuition fee directly to the university account."
      },
      {
        "step": "06",
        "title": "Receive eVisa",
        "desc": "Receive electronic student visa document linked to passport."
      }
    ],
    "costOfStudy": {
      "tuition": "NZD $22,000–$38,000 / year (Arts/Business: $22k–$30k · STEM/Sci: $30k–$38k)",
      "livingExpenses": "NZD $1,250–$2,000 / month (Christchurch lower · Auckland higher)",
      "healthInsurance": "NZD $600–$800 / year (Approved Studentsafe medical & travel cover)",
      "visaApplication": "NZD $375 Fee Paying Student Visa fee",
      "proofOfFunds": "NZD $20,000 / year living expenses + paid 1st year tuition"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during active university study semesters.",
        "Full-time work permitted during all scheduled university vacation periods.",
        "High statutory national minimum wage of approximately NZD $23.15+ per hour."
      ],
      "postStudyWork": [
        "Post-Study Work Visa (PSWV) granted for up to three full years.",
        "Master’s degree graduates qualify for maximum three-year open work visa.",
        "Direct pathway to Straight to Residence Green List occupational occupations."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Score Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Academic Recommendation Letters",
          "status": "Program Specific",
          "badgeVariant": "specific"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Offer of Place Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Living Funds",
          "status": "NZD $20,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Panel e-Medical Examination Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "National Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Approved Comprehensive Travel Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Selection",
        "desc": "Research the eight NZ universities and degree levels",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Exams",
        "desc": "Complete IELTS or PTE Academic and meet band prerequisites",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Filing",
        "desc": "Submit application documents through online university portals",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Offer of Place",
        "desc": "Receive conditional or unconditional university offer of place",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Visa Submission",
        "desc": "Submit online visa application to Immigration New Zealand",
        "time": "2–4 months before"
      },
      {
        "step": "06",
        "title": "AIP & Tuition",
        "desc": "Receive Approval in Principle (AIP) and pay tuition fees",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "eVisa & Travel",
        "desc": "Receive eVisa document, book flights, and arrange housing",
        "time": "2–3 weeks before"
      }
    ],
    "goodToKnow": [
      "Immigration NZ uses AIP: you only pay tuition fees after visa is approved.",
      "Spouses of Master’s degree students are eligible for open work visas.",
      "International PhD students pay low domestic tuition rates (NZD $7k–$9k/year).",
      "The Funds Transfer Scheme (FTS) is available to easily demonstrate living funds."
    ],
    "lastVerified": "September 2026",
    "source": "Immigration New Zealand (INZ) & Education New Zealand"
  },
  "netherlands": {
    "slug": "netherlands",
    "countryName": "Netherlands",
    "heroDescription": "Study in mainland Europe’s top English-medium education powerhouse with world-ranked research institutions and a one-year Zoekjaar visa.",
    "heroImage": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Netherlands edition",
    "heroFacts": {
      "tuition": "€8,000–€20,000 / yr",
      "livingCost": "€900–€1,600 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "MVV + VVR Permit"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Over 2,100 programs taught entirely in English across top research universities."
      },
      {
        "num": "02",
        "text": "One-year Orientation Year (Zoekjaar) visa allows unrestricted post-study job search."
      },
      {
        "num": "03",
        "text": "Home to major European technology and business giants (ASML, Philips, Booking)."
      },
      {
        "num": "04",
        "text": "Top global institutions including TU Delft, UvA, Erasmus, and Leiden."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "VVR Residence Permit (Study)",
      "majorIntakes": "Fall (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor of Science · Master of Science · Doctoral (PhD)",
      "popularFields": "Computer Science · Logistics & Supply Chain · Civil Engineering · Quantitative Finance · Agri-Tech"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (GPA 3.0+ / 4.0; Numerus Fixus competitive)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (min 6.0 per section) or TOEFL 90+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Studielink portal + direct university application system",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September Intake (Application: Oct to Jan 15 / May 1)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "90–100 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Required at top economics/business schools",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Numerus Fixus Exam",
        "score": "Program-specific ranking test for high-demand degrees",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Studielink Account",
        "desc": "Register account on Studielink.nl and apply to university."
      },
      {
        "step": "02",
        "title": "Confirm Offer",
        "desc": "Accept official admission offer and confirm enrollment status."
      },
      {
        "step": "03",
        "title": "Transfer Funds",
        "desc": "Deposit living funds (€12,000) and tuition to university trust."
      },
      {
        "step": "04",
        "title": "IND Application",
        "desc": "University submits MVV/VVR permit application directly to IND."
      },
      {
        "step": "05",
        "title": "Collect MVV",
        "desc": "Visit Dutch embassy or consulate to collect entry visa sticker."
      },
      {
        "step": "06",
        "title": "Receive VVR",
        "desc": "Travel to the Netherlands and collect physical VVR permit card."
      }
    ],
    "costOfStudy": {
      "tuition": "€8,000–€20,000 / year (Non-EU: UG €8k–€14k · PG €12k–€20k)",
      "livingExpenses": "€900–€1,600 / month (Groningen lower · Amsterdam/Utrecht higher)",
      "healthInsurance": "€40–€110 / month (Private student health insurance - Aon, IPS, Allianz)",
      "visaApplication": "€228 IND residence permit fee (paid via university)",
      "proofOfFunds": "€12,000 / year IND living benchmark + remaining tuition fee"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 16 hours per week during the regular academic study year.",
        "Full-time seasonal work allowed during June, July, and August.",
        "Requires employer to obtain a free TWV work permit authorization."
      ],
      "postStudyWork": [
        "Orientation Year (Zoekjaar) visa valid for one full year after graduation.",
        "Unrestricted employment rights with any employer without sponsorship needed.",
        "Direct switch to the Highly Skilled Migrant (Kennismigrant) work permit."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Studielink Registration Number",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts and Degree",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Proficiency Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Admission Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "IND Antecedents Declaration Form",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Financial Living Solvency",
          "status": "€12,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Tuberculosis Test Referral Sheet",
          "status": "Country Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Private Health Insurance Coverage Document",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Studielink Setup",
        "desc": "Create Studielink profile and check Numerus Fixus deadlines",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Exams & Essays",
        "desc": "Complete IELTS/TOEFL and write academic motivation essays",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Filing",
        "desc": "Submit dossiers to university portals before deadlines",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Accept & Deposit",
        "desc": "Accept offer and transfer IND financial living deposit",
        "time": "3–5 months before"
      },
      {
        "step": "05",
        "title": "IND Processing",
        "desc": "University submits permit to IND; approval in two to four weeks",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "MVV Collection",
        "desc": "Collect MVV entry visa sticker at Dutch embassy/consulate",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & BSN",
        "desc": "Fly to Netherlands, register at city hall (BSN), and get VVR",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Universities apply for the IND residence permit on your behalf.",
      "Housing in Dutch university cities is scarce, so secure accommodation early.",
      "Numerus Fixus selective degrees have an early deadline of January 15.",
      "Graduates can use the Zoekjaar orientation visa within three years of graduation."
    ],
    "lastVerified": "September 2026",
    "source": "Immigration and Naturalisation Service (IND) & Study in NL"
  },
  "singapore": {
    "slug": "singapore",
    "countryName": "Singapore",
    "heroDescription": "Access world-leading higher education at NUS & NTU, MOE tuition grant subsidies, and a thriving business capital in the heart of Asia.",
    "heroImage": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Singapore edition",
    "heroFacts": {
      "tuition": "SGD $18,000–$42,000 / yr",
      "livingCost": "SGD $1,200–$2,500 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "Student's Pass (STP)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "NUS and NTU consistently rank among the top fifteen universities globally."
      },
      {
        "num": "02",
        "text": "Financial and technology capital of Asia with leading regional headquarters."
      },
      {
        "num": "03",
        "text": "MOE Tuition Grant covers substantial tuition in exchange for three-year service."
      },
      {
        "num": "04",
        "text": "Safe, immaculate cosmopolitan city-state with zero English language barrier."
      }
    ],
    "quickFacts": {
      "currency": "Singapore Dollar (SGD)",
      "visa": "Student's Pass (STP - ICA)",
      "majorIntakes": "August (Primary Fall) · January (Secondary Spring)",
      "popularLevels": "Undergraduate · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · FinTech · Supply Chain Management · Biotechnology · Artificial Intelligence"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "75%–85%+ (GPA 3.5+ / 4.0; top programs highly selective)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ / TOEFL 90+ (waived for English-medium degrees)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal (NUS, NTU, SMU, SUTD)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "August Intake (Application: Oct to Jan/Feb)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5–7.0 / TOEFL iBT 90–100",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Required for competitive Master’s (GRE 320+, GMAT 650+)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Entrance Exam",
        "score": "Conducted for select undergraduate boards",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "SOLAR Registration",
        "desc": "University registers your application on the SOLAR immigration portal."
      },
      {
        "step": "02",
        "title": "Submit eForm 16",
        "desc": "Log in to SOLAR and complete electronic Form 16 application."
      },
      {
        "step": "03",
        "title": "Receive IPA Letter",
        "desc": "Download electronic In-Principle Approval (IPA) entry visa."
      },
      {
        "step": "04",
        "title": "Medical in Singapore",
        "desc": "Complete mandatory HIV and chest X-ray exam upon arrival."
      },
      {
        "step": "05",
        "title": "ICA Appointment",
        "desc": "Attend appointment at ICA building for biometric registration."
      },
      {
        "step": "06",
        "title": "Collect STP Card",
        "desc": "Collect physical Student’s Pass biometric identification card."
      }
    ],
    "costOfStudy": {
      "tuition": "SGD $18,000–$42,000 / year (Subsidized MOE: $12k–$25k · Non-subsidized: $28k–$42k)",
      "livingExpenses": "SGD $1,200–$2,500 / month (Campus/HDB: $600–$900 · Condo: $1.2k–$2k)",
      "healthInsurance": "SGD $200–$400 / year (Mandatory university group medical plan)",
      "visaApplication": "SGD $105 total ($45 Student Pass app + $60 issuance)",
      "proofOfFunds": "SGD $30,000 bank balance or official MOE Tuition Grant"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 16 hours per week during active university study semesters.",
        "Unlimited work hours permitted during official university vacation breaks.",
        "Applicable only for full-time students at MOM-approved autonomous institutions."
      ],
      "postStudyWork": [
        "One-year Long-Term Visit Pass (LTVP) available to seek full-time employment.",
        "MOE Tuition Grant recipients enjoy guaranteed three-year employment bond.",
        "Direct transition to Employment Pass (EP) or S-Pass with sponsoring employers."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Degree Certificate and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Personal Statement of Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic and Professional Referee Reports",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "IELTS or TOEFL Score Report",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Detailed Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "SOLAR Application Reference Number",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "ICA In-Principle Approval",
          "status": "IPA) Letter (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Solvency Statement",
          "status": "SGD $30,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "MOE Tuition Grant Agreement",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Medical Examination Report",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlisting",
        "desc": "Explore graduate degree offerings at NUS, NTU, and SMU",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Standardized Exams",
        "desc": "Complete GRE/GMAT and IELTS/TOEFL examination schedules",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Submission",
        "desc": "Submit online applications before January/February deadlines",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Offer & MOE Grant",
        "desc": "Accept admission offer and opt for MOE tuition subsidy",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "SOLAR & IPA",
        "desc": "Complete eForm 16 on SOLAR and receive IPA approval",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Travel & Medical",
        "desc": "Enter Singapore using IPA letter and complete medical exam",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "STP Collection",
        "desc": "Complete biometrics at ICA building and collect Student’s Pass",
        "time": "Week 1 on arrival"
      }
    ],
    "goodToKnow": [
      "MOE Tuition Grant significantly reduces tuition in exchange for three-year service bond.",
      "The In-Principle Approval (IPA) letter serves as your single-entry visa to fly.",
      "On-campus housing is competitive, so submit dormitory application immediately.",
      "Singapore offers among the lowest personal income tax rates for graduates globally."
    ],
    "lastVerified": "September 2026",
    "source": "Immigration & Checkpoints Authority (ICA) & Ministry of Education (MOE)"
  },
  "italy": {
    "slug": "italy",
    "countryName": "Italy",
    "heroDescription": "Study at historic public universities with low tuition fees, regional DSU scholarship grants, and Schengen access.",
    "heroImage": "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Italy edition",
    "heroFacts": {
      "tuition": "€1,000–€4,000 / yr",
      "livingCost": "€600–€1,200 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 78+",
      "studentVisa": "National Visa Type D"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Low tuition fees at public universities with full regional DSU scholarship opportunities."
      },
      {
        "num": "02",
        "text": "World-leading excellence in architecture, industrial design, automotive engineering, and fashion."
      },
      {
        "num": "03",
        "text": "Over 500 programs taught entirely in English across top research institutions."
      },
      {
        "num": "04",
        "text": "Full access to 27 Schengen countries with one-year post-study job search."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa Type D (Study)",
      "majorIntakes": "September/October (Primary Fall) · February (Spring)",
      "popularLevels": "Laurea (UG) · Laurea Magistrale (PG) · Doctoral (PhD)",
      "popularFields": "Architecture & Design · Automotive Engineering · Economics & Finance · Fashion & Luxury · Medicine"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or equivalent CIMEA comparability)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 78–85+ for English medium",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Universitaly pre-enrollment portal combined with direct university application",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September/October Intake (Application: December to April/May)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 78+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOLC / TIL Exam",
        "score": "Standardized engineering/design admission test (Polimi/PoliTo)",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "IMAT Medicine",
        "score": "International Medical Admissions Test for English MD degrees",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "CIMEA / DoV",
        "score": "Statement of Comparability for international academic credentials",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter from your chosen Italian university."
      },
      {
        "step": "02",
        "title": "Universitaly Portal",
        "desc": "Submit official pre-enrollment application on the Universitaly portal."
      },
      {
        "step": "03",
        "title": "CIMEA Verification",
        "desc": "Obtain CIMEA Statement of Comparability for degree certificates."
      },
      {
        "step": "04",
        "title": "Financial Solvency",
        "desc": "Demonstrate €6,000 annual living funds in personal bank account."
      },
      {
        "step": "05",
        "title": "Embassy Visa Filing",
        "desc": "Submit National Type D visa dossier at Italian Embassy/VFS."
      },
      {
        "step": "06",
        "title": "Permesso di Soggiorno",
        "desc": "Apply for residence permit kit at post office within eight days."
      }
    ],
    "costOfStudy": {
      "tuition": "€1,000–€4,000 / year (Public: €1k–€4k · Private: €6k–€20k)",
      "livingExpenses": "€600–€1,200 / month (Turin/Padova: €600–€850 · Milan/Rome: €950–€1.2k)",
      "healthInsurance": "€150–€700 / year (Italian National Health Service - SSN enrollment)",
      "visaApplication": "€50 National Visa (D) fee (+ VFS service charge)",
      "proofOfFunds": "€6,000 / year (€460/month) minimum + accommodation proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week (maximum 1,040 hours per calendar year).",
        "Standard employment contracts permitted throughout the active academic year.",
        "Freelance work requires converting to an autonomous working residence permit."
      ],
      "postStudyWork": [
        "12-month Permesso per Ricerca Lavoro for Bachelor’s and Master’s graduates.",
        "Allows unrestricted full-time job seeking across all employment sectors.",
        "Converts directly to standard Work Permit (Lavoro Subordinato) upon hiring."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "CIMEA Statement of Comparability",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Official Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and CV",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Universitaly Pre-Enrollment Summary",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Universitaly Summary Approval Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Solvency Proof",
          "status": "€6,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Accommodation in Italy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "International Medical Insurance Cover",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Flight Ticket Reservation",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Search",
        "desc": "Shortlist universities and start CIMEA degree comparability",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language & TOLC",
        "desc": "Complete IELTS and register for TOLC/TIL/IMAT entrance exams",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Portals",
        "desc": "Submit online applications directly to target Italian universities",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Universitaly Portal",
        "desc": "Complete Universitaly pre-enrollment for consular approval",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "DSU Scholarship",
        "desc": "Apply for regional DSU scholarship for tuition waiver",
        "time": "3–5 months before"
      },
      {
        "step": "06",
        "title": "Embassy Visa",
        "desc": "Submit National Visa Type D application at VFS/Embassy",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & Permesso",
        "desc": "Arrive in Italy and submit Permesso di Soggiorno kit",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Regional DSU scholarships can provide 100% tuition waiver plus living stipends.",
      "CIMEA Statement of Comparability is widely accepted instead of consular DoV.",
      "You must apply for your Permesso di Soggiorno within eight working days.",
      "Learning conversational Italian (A2) significantly improves student internship opportunities."
    ],
    "lastVerified": "September 2026",
    "source": "Universitaly & Ministero degli Affari Esteri (MAECI)"
  },
  "sweden": {
    "slug": "sweden",
    "countryName": "Sweden",
    "heroDescription": "Study in the global capital of sustainability and innovation with English-taught Master’s degrees and a 1-year job seeker visa.",
    "heroImage": "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Sweden edition",
    "heroFacts": {
      "tuition": "SEK 80k–150k / yr",
      "livingCost": "SEK 9k–14k / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "Residence Permit (Studies)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Global pioneer in technology, sustainability, and design (Spotify, Klarna, Volvo, IKEA)."
      },
      {
        "num": "02",
        "text": "Unified national application portal (UniversityAdmissions.se) for all public institutions."
      },
      {
        "num": "03",
        "text": "12-month post-study residence permit to seek employment or launch startups."
      },
      {
        "num": "04",
        "text": "World-renowned institutions including KTH Royal Institute, Lund, Uppsala, and Chalmers."
      }
    ],
    "quickFacts": {
      "currency": "Swedish Krona (SEK)",
      "visa": "Residence Permit for Higher Education",
      "majorIntakes": "Autumn (August/September - Primary) · Spring (January)",
      "popularLevels": "Bachelor of Science · 2-Year Master of Science · Doctoral (PhD)",
      "popularFields": "Sustainable Energy · Computer Science · Automotive Engineering · Bio-Innovation · Industrial Design"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "Recognized 3 or 4-year Bachelor degree (min 180 ECTS)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (European Grade B/C equivalent academic performance benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "English 6 level: IELTS 6.5+ (min 5.5) or TOEFL 90+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Unified national portal (UniversityAdmissions.se) for all public universities",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (August/September - Round 1 Deadline: Jan 15)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 5.5 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "90 overall (min 20 in writing)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "62 overall (min 61 in writing)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Required only for Stockholm School of Economics (SSE)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Central Portal",
        "desc": "Apply for degree programs through unified UniversityAdmissions.se portal."
      },
      {
        "step": "02",
        "title": "Selection Results",
        "desc": "Receive official Notification of Selection Results from central portal."
      },
      {
        "step": "03",
        "title": "Tuition Payment",
        "desc": "Pay first semester tuition instalment directly to university account."
      },
      {
        "step": "04",
        "title": "Migrationsverket",
        "desc": "Submit online Residence Permit application on Migrationsverket portal."
      },
      {
        "step": "05",
        "title": "Financial Proof",
        "desc": "Demonstrate SEK 103,140 living funds in personal bank account."
      },
      {
        "step": "06",
        "title": "Biometrics & Card",
        "desc": "Provide digital biometrics at embassy and receive UT card."
      }
    ],
    "costOfStudy": {
      "tuition": "SEK 80,000–150,000 / year (approx. €7,000–€13,500 · Tech: up to SEK 200k)",
      "livingExpenses": "SEK 9,000–14,000 / month (Lund/Uppsala: SEK 9k–11k · Stockholm: SEK 12k–14k)",
      "healthInsurance": "€0 / year (Covered by Swedish State FAS Comprehensive Insurance)",
      "visaApplication": "SEK 1,500 Migrationsverket residence permit application fee",
      "proofOfFunds": "SEK 10,314 / month (SEK 103,140 / year) in personal bank"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "No official statutory limit on working hours for international students.",
        "Students must maintain satisfactory full-time academic progress (30 ECTS/term).",
        "High wages across tech, software development, and campus research roles."
      ],
      "postStudyWork": [
        "12-month post-study residence permit to seek employment or start business.",
        "Unrestricted working hours allowed during the entire job search period.",
        "Converts directly to standard two-year Swedish Work Permit when employed."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bachelor’s Degree Certificate and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "UniversityAdmissions Official Cover Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Score Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Program Specific Motivation Letter",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Notification of Central Selection Results",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First Semester Tuition Fee Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Statement in Student’s Own Name",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Medical Insurance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Migrationsverket Online Application",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Selection",
        "desc": "Select up to four Master’s programs on UniversityAdmissions",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Document Upload",
        "desc": "Upload certified transcripts and language scores before Feb 1",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Central Results",
        "desc": "Receive central admissions results in late March/early April",
        "time": "5–6 months before"
      },
      {
        "step": "04",
        "title": "Tuition Payment",
        "desc": "Pay first semester tuition fee instalment to university",
        "time": "4–5 months before"
      },
      {
        "step": "05",
        "title": "Migrationsverket",
        "desc": "Submit online residence permit application with bank statement",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Embassy Biometrics",
        "desc": "Visit Swedish Embassy to capture biometric photo and fingerprints",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Arrival & Personnummer",
        "desc": "Travel to Sweden, get UT card, and register for Personnummer",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Sweden uses a central portal deadline of January 15 for autumn.",
      "Swedish Institute (SI) Scholarships cover full tuition plus living stipends.",
      "Bank statements must be held strictly in the student’s personal name.",
      "PhD positions are considered salaried employment with monthly compensation."
    ],
    "lastVerified": "September 2026",
    "source": "Migrationsverket (Swedish Migration Agency) & Study in Sweden"
  },
  "switzerland": {
    "slug": "switzerland",
    "countryName": "Switzerland",
    "heroDescription": "Study at world-ranked scientific institutes like ETH Zurich and EPFL with highly subsidized tuition and cutting-edge research labs.",
    "heroImage": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Switzerland edition",
    "heroFacts": {
      "tuition": "CHF 1,200–4,000 / yr",
      "livingCost": "CHF 1,600–2,600 / mo",
      "englishBenchmark": "IELTS 7.0 / TOEFL 100+",
      "studentVisa": "National Visa D (Permit B)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top-ranked global universities including ETH Zurich (#7) and EPFL (#36)."
      },
      {
        "num": "02",
        "text": "Highly subsidized public tuition fees for all international research students."
      },
      {
        "num": "03",
        "text": "Global headquarters for world-leading pharmaceutical, technology, and finance enterprises."
      },
      {
        "num": "04",
        "text": "Exceptional standard of living, pristine safety, and central European location."
      }
    ],
    "quickFacts": {
      "currency": "Swiss Franc (CHF)",
      "visa": "National Visa D (Residence Permit B)",
      "majorIntakes": "Autumn (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor of Science · 1.5–2 Year Master of Science · Doctoral (PhD)",
      "popularFields": "Computer Science · Robotics & AI · Banking & Finance · Bioengineering · Hospitality Management"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "Recognized Bachelor degree (180 ECTS) in relevant subject discipline",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "70%+ or GPA 3.2+ / 4.0 (Highly competitive academic selectivity)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 7.0+ (min 6.5) or TOEFL iBT 100+ for English",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online portal + GRE/GATE for engineering disciplines",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (Sept - Application: Dec 15 to Feb 28)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "7.0 overall (min 6.5 in each section)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "100 overall (min 22 each section)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE General",
        "score": "Quantitative 164+ required for ETH Zurich and EPFL non-EU",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "GMAT Exam",
        "score": "650+ for University of St. Gallen (HSG) business degrees",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Acceptance",
        "desc": "Secure official unconditional admission letter from accredited Swiss university."
      },
      {
        "step": "02",
        "title": "Bank Guarantee",
        "desc": "Deposit CHF 21,000 living funds in FINMA-approved Swiss bank."
      },
      {
        "step": "03",
        "title": "Cantonal Dossier",
        "desc": "Submit National Visa Type D application to Swiss diplomatic mission."
      },
      {
        "step": "04",
        "title": "Cantonal Review",
        "desc": "Cantonal migration authority processes and evaluates financial student dossier."
      },
      {
        "step": "05",
        "title": "Visa D Stamping",
        "desc": "Receive official Entry Visa D authorization from Swiss embassy."
      },
      {
        "step": "06",
        "title": "Permit B Card",
        "desc": "Register at municipal Kreisbüro to collect Permit B card."
      }
    ],
    "costOfStudy": {
      "tuition": "CHF 1,200–4,000 / year (Public ETH/EPFL: CHF 1.5k · Private: CHF 20k–40k)",
      "livingExpenses": "CHF 1,600–2,600 / month (Basel/Bern: CHF 1.6k–2k · Zurich/Geneva: CHF 2.2k–2.6k)",
      "healthInsurance": "CHF 80–150 / month (Discount student health insurance - Swisscare, Scorestudies)",
      "visaApplication": "CHF 88 Embassy fee (+ CHF 150–250 Cantonal permit fee)",
      "proofOfFunds": "CHF 21,000 / year in a FINMA-accredited Swiss bank account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 15 hours per week during semesters (after six months).",
        "Full-time work permitted during official university semester breaks and vacations.",
        "Academic research and teaching assistantships offer competitive hourly student rates."
      ],
      "postStudyWork": [
        "Six-month post-study residence permit extension to seek qualified graduate employment.",
        "Employment must carry high economic or scientific value for work permit.",
        "Direct pathway to Swiss Permit L/B work authorization upon hiring."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bachelor’s Degree Certificate and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Detailed Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "GRE General Test Score Report",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Academic Recommendation Letters",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Swiss University Acceptance Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "FINMA Bank Solvency Certificate",
          "status": "CHF 21,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Written Undertaking to Depart Switzerland Post-Study",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Student Accommodation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Swisscare Student Medical Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Shortlist",
        "desc": "Research programs at ETH Zurich, EPFL, HSG, and Geneva",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Exams & GRE",
        "desc": "Complete IELTS/TOEFL and GRE General test for engineering",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Portals",
        "desc": "Submit online university applications before December/January deadlines",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal acceptance and confirm university enrollment place",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Swiss Bank Guarantee",
        "desc": "Open FINMA-approved Swiss bank account and deposit living funds",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Cantonal Visa",
        "desc": "Submit Type D visa application at Swiss embassy/consulate",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Arrival & Permit B",
        "desc": "Arrive in Switzerland and register at Kreisbüro for Permit",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Public tuition at ETH Zurich and EPFL is extremely affordable.",
      "Swiss migration requires proof of funds from FINMA-regulated banks.",
      "Non-EU students can work 15 hours/week after six months residence.",
      "French, German, or Italian language skills boost post-study career prospects."
    ],
    "lastVerified": "September 2026",
    "source": "State Secretariat for Migration (SEM) & Study in Switzerland"
  },
  "spain": {
    "slug": "spain",
    "countryName": "Spain",
    "heroDescription": "Study in one of Europe’s most vibrant cultural hubs with world-ranked business schools, affordable living, and post-study stay-back.",
    "heroImage": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Spain edition",
    "heroFacts": {
      "tuition": "€1,500–€10,000 / yr",
      "livingCost": "€600–€1,200 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "Student Visa (Estancia por Estudios)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top European business schools (IE, ESADE, IESE) consistently rank globally."
      },
      {
        "num": "02",
        "text": "Affordable tuition fees at public research universities across major cities."
      },
      {
        "num": "03",
        "text": "Rich multicultural environment with world-class student lifestyle and warm climate."
      },
      {
        "num": "04",
        "text": "One-year post-study job seeker residence permit for eligible university graduates."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Student Visa (Visado de Estancia por Estudios)",
      "majorIntakes": "Fall (September/October - Primary) · Spring (January/February)",
      "popularLevels": "Grado (UG) · Máster Universitario (PG) · Doctorado (PhD)",
      "popularFields": "International Business · Data Analytics · Architecture & Urban Planning · Renewable Energy · Hospitality Management"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (Homologación)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or 6.5/10 Spanish scale)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80–90+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university application portal + UNEDasiss credential accreditation",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Intake (September/October - Application: Jan to June)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "DELE / SIELE",
        "score": "B2 / C1 level (only for Spanish-taught programs)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "GMAT / GRE",
        "score": "Required for top business schools (IE, ESADE, IESE)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "UNEDasiss Credential",
        "score": "Credential evaluation for international undergraduate applicants",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Secure Admission",
        "desc": "Receive formal admission letter from accredited Spanish higher education institution."
      },
      {
        "step": "02",
        "title": "Medical & Police",
        "desc": "Obtain apostilled medical certificate and national police clearance certificate."
      },
      {
        "step": "03",
        "title": "Health Insurance",
        "desc": "Purchase full-coverage Spanish private health insurance with zero copayment."
      },
      {
        "step": "04",
        "title": "Financial Proof",
        "desc": "Demonstrate 100% IPREM living funds (€600/month) in bank account."
      },
      {
        "step": "05",
        "title": "Consular Filing",
        "desc": "Submit National Student Visa dossier at Spanish Embassy or BLS."
      },
      {
        "step": "06",
        "title": "TIE Card",
        "desc": "Enter Spain and apply for TIE card at foreign office."
      }
    ],
    "costOfStudy": {
      "tuition": "€1,500–€10,000 / year (Public: €1.5k–€4.5k · Private/Business: €10k–€28k)",
      "livingExpenses": "€600–€1,200 / month (Valencia/Seville: €600–€850 · Madrid/Barcelona: €900–€1.2k)",
      "healthInsurance": "€400–€700 / year (Sanitas, Adeslas, or Asisa zero-copay policy)",
      "visaApplication": "€80 National Student Visa fee (+ BLS service charge)",
      "proofOfFunds": "€7,200 / year (100% of IPREM living benchmark index)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 30 hours per week under updated Spanish immigration regulations.",
        "Employment must not interfere with mandatory scheduled academic class hours.",
        "Work authorization is automatically integrated into the student residence card."
      ],
      "postStudyWork": [
        "12-month post-study residence permit for job search or business launch.",
        "Eligible for Bachelor’s, Master’s, and PhD graduates from accredited universities.",
        "Direct modification to residence and work permit upon securing job contract."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Degree and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Letters of Academic Recommendation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Admission Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statements",
          "status": "IPREM €7,200+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Full Private Health Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Medical Fitness Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Search",
        "desc": "Explore programs at Complutense, Carlos III, UB, UPC, or IE",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Exams & Legalization",
        "desc": "Complete IELTS/TOEFL and start document translation/apostille",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Submit online applications and portfolio to target institutions",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal acceptance and pay initial seat reservation deposit",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Insurance & Certs",
        "desc": "Purchase Spanish insurance and get apostilled police and medicals",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Consular Visa",
        "desc": "Submit student visa dossier at Spanish Embassy / BLS",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & TIE Card",
        "desc": "Fly to Spain, register address (Empadronamiento), and collect TIE",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Spain increased international student part-time work rights to 30 hours/week.",
      "Health insurance must be from an approved Spanish insurer with zero copayment.",
      "Police and medical certificates must have Hague Apostille and official translation.",
      "The TIE (Tarjeta de Identidad de Extranjero) card must be requested within 30 days."
    ],
    "lastVerified": "September 2026",
    "source": "Ministerio de Asuntos Exteriores & SEPIE (Study in Spain)"
  },
  "japan": {
    "slug": "japan",
    "countryName": "Japan",
    "heroDescription": "Study in Asia’s high-tech leader with world-renowned research universities, MEXT government scholarships, and strong career pathways.",
    "heroImage": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Japan edition",
    "heroFacts": {
      "tuition": "¥535,800–¥1,200,000 / yr",
      "livingCost": "¥80,000–¥160,000 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "Student Visa (Ryugaku)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "World-class Imperial Universities (Tokyo, Kyoto, Osaka, Tohoku) leading scientific innovation."
      },
      {
        "num": "02",
        "text": "Highly affordable standardized tuition fees at all national public universities."
      },
      {
        "num": "03",
        "text": "Generous MEXT government scholarships providing full tuition waiver and monthly stipends."
      },
      {
        "num": "04",
        "text": "High graduate employment demand driven by progressive Japanese industrial expansion."
      }
    ],
    "quickFacts": {
      "currency": "Japanese Yen (JPY)",
      "visa": "Student Visa (College Student Status)",
      "majorIntakes": "Spring (April - Primary) · Autumn (September/October)",
      "popularLevels": "Undergraduate (G30) · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Robotics & Automation · Computer Engineering · Material Science · International Management · Biotechnology"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized 4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (GPA 3.0+ / 4.0 for competitive national universities)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80–90+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal + COE processing by university administration",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Spring (April) / Autumn (October - Application: Nov to Feb)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "EJU Exam",
        "score": "Examination for Japanese University Admission (Japanese tracks)",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "GRE / GMAT",
        "score": "Recommended for top engineering and MBA programs",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "JLPT N2/N1",
        "score": "Japanese Language Proficiency Test (only for Japanese tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission offer from an accredited Japanese university."
      },
      {
        "step": "02",
        "title": "COE Application",
        "desc": "University applies for Certificate of Eligibility (COE) with immigration."
      },
      {
        "step": "03",
        "title": "COE Issuance",
        "desc": "Regional Immigration Bureau issues your official Certificate of Eligibility."
      },
      {
        "step": "04",
        "title": "Embassy Application",
        "desc": "Submit visa application with original COE at Japanese Embassy/VFS."
      },
      {
        "step": "05",
        "title": "Visa Stamping",
        "desc": "Collect stamped Student Visa passport within five to seven days."
      },
      {
        "step": "06",
        "title": "Landing & Card",
        "desc": "Arrive in Japan and receive Residence Card (Zairyu Card)."
      }
    ],
    "costOfStudy": {
      "tuition": "¥535,800 / year (~$3,600 USD National · Private: ¥800k–¥1.4m)",
      "livingExpenses": "¥80,000–¥160,000 / month (Fukuoka/Sendai: ¥80k–¥110k · Tokyo: ¥120k–¥160k)",
      "healthInsurance": "¥1,500–¥2,500 / month (National Health Insurance - NHI covers 70%)",
      "visaApplication": "¥3,000 (~$20 USD) single-entry visa fee (+ VFS charge)",
      "proofOfFunds": "¥2,000,000 (~$13,500 USD) annual financial living solvency"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 28 hours per week with Shikakugai Katsudo permission stamp.",
        "Up to 40 hours per week (8 hrs/day) during official university vacation periods.",
        "Work permission is stamped directly in passport at airport immigration upon arrival."
      ],
      "postStudyWork": [
        "Designated Activities Visa for job hunting valid for six to 12 months.",
        "Renewable for up to one full year post-graduation with university endorsement.",
        "Converts directly to Engineering/Specialist in Humanities/International Services work visa."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Transcripts and Graduation Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Letters of Recommendation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Proficiency Score Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Financial Sponsor Commitment Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Original Certificate of Eligibility",
          "status": "COE) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Sponsor Bank Account Statements",
          "status": "¥2M+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Sponsor Income and Employment",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Japanese Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Research",
        "desc": "Shortlist English-taught programs at Imperial and Waseda/Keio",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Professor Contact",
        "desc": "Contact prospective research supervisor (for Master’s/PhD)",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Portal Submissions",
        "desc": "Submit application documents directly to university admission office",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & COE",
        "desc": "Accept admission; university submits COE application to immigration",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "COE Issuance",
        "desc": "Immigration issues COE; university couriers original document",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Embassy Visa",
        "desc": "Submit COE and passport to Japanese Embassy / VFS",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Registration",
        "desc": "Fly to Japan, get Zairyu Card at airport, and register city ward",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "National universities charge a uniform statutory tuition rate of ¥535,800/year.",
      "The Certificate of Eligibility (COE) guarantees fast 5-day visa issuance.",
      "Request the 28-hour part-time work permit stamp at airport immigration on arrival.",
      "Japanese National Health Insurance (NHI) covers 70% of all medical costs."
    ],
    "lastVerified": "September 2026",
    "source": "Japan Student Services Organization (JASSO) & Ministry of Justice"
  },
  "south-korea": {
    "slug": "south-korea",
    "countryName": "South Korea",
    "heroDescription": "Study in Asia’s high-tech powerhouse with world-class SKY universities, GKS government scholarships, and thriving cultural dynamism.",
    "heroImage": "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · South Korea edition",
    "heroFacts": {
      "tuition": "KRW 4,000,000–10,000,000 / yr",
      "livingCost": "KRW 700,000–1,400,000 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "D-2 Student Visa"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Prestigious SKY universities (Seoul National, Korea, Yonsei) and KAIST tech leadership."
      },
      {
        "num": "02",
        "text": "Affordable tuition rates with generous Global Korea Scholarship (GKS) funding."
      },
      {
        "num": "03",
        "text": "Global pioneer in semiconductors, consumer electronics, digital entertainment, and automotive."
      },
      {
        "num": "04",
        "text": "Up to two-year D-10 Job Seeker Visa for accredited university graduates."
      }
    ],
    "quickFacts": {
      "currency": "South Korean Won (KRW)",
      "visa": "D-2 Student Visa (Higher Education)",
      "majorIntakes": "Spring (March - Primary) · Fall (September)",
      "popularLevels": "Undergraduate · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · Semiconductor Engineering · International Business · Media & Digital Arts · Mechanical Engineering"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years formal schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "70%+ (GPA 3.0+ / 4.0 or top 25% class ranking benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 80+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal + apostilled academic credentials",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Spring (March - App: Sept to Nov) / Fall (Sept - App: Mar to May)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOPIK Exam",
        "score": "Level 3–4 (required for Korean tracks",
        "validity": "provides scholarship boosts)",
        "requirement": "2 years",
        "badgeVariant": "varies"
      },
      {
        "test": "GRE / GMAT",
        "score": "Optional/Recommended for KAIST and SKY business programs",
        "validity": "5 years",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "University Interview",
        "score": "Video interview conducted by university admission committee",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive Certificate of Admission (CoA) from accredited Korean university."
      },
      {
        "step": "02",
        "title": "Document Apostille",
        "desc": "Get academic degrees and bank statements apostilled or consular verified."
      },
      {
        "step": "03",
        "title": "Visa Application",
        "desc": "Submit D-2 visa application with CoA at Korean Embassy/KVAC."
      },
      {
        "step": "04",
        "title": "Visa Issuance",
        "desc": "Receive official Visa Grant Notice document online from immigration."
      },
      {
        "step": "05",
        "title": "Travel to Korea",
        "desc": "Enter South Korea within visa validity period with grant notice."
      },
      {
        "step": "06",
        "title": "Alien Registration",
        "desc": "Apply for Alien Registration Card (ARC) at immigration within 90 days."
      }
    ],
    "costOfStudy": {
      "tuition": "KRW 4,000,000–10,000,000 / year (~$3,000–$7,500 USD · STEM/Private: KRW 8m–12m)",
      "livingExpenses": "KRW 700,000–1,400,000 / month (Regional: KRW 700k–900k · Seoul: KRW 1m–1.4m)",
      "healthInsurance": "KRW 70,000 / month (Mandatory National Health Insurance - NHIS)",
      "visaApplication": "$60 USD single-entry visa fee (+ KVAC processing fee)",
      "proofOfFunds": "$20,000 USD (Seoul) / $18,000 USD (Regional) bank solvency"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20–25 hours per week during semesters with university immigration approval.",
        "Unlimited working hours permitted during scheduled university summer and winter breaks.",
        "Higher TOPIK language scores grant authorization for increased weekly working hours."
      ],
      "postStudyWork": [
        "D-10 Job Seeker Visa granted for six months to up to two years.",
        "Points-based system evaluates degree level, GPA, and Korean language proficiency.",
        "Converts directly to E-7 Professional Employment Visa upon securing qualified job."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Graduation Certificate and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Personal Statement and Study Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Letters of Recommendation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Family Relation Certificate",
          "status": "Country Specific",
          "badgeVariant": "specific"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Certificate of Admission",
          "status": "CoA) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "University Business Registration Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Bank Solvency Statement",
          "status": "$20,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Tuberculosis Screening Medical Certificate",
          "status": "Country Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Completed Korean Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Shortlist",
        "desc": "Research programs at SNU, Korea, Yonsei, KAIST, and POSTECH",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language & Apostille",
        "desc": "Take IELTS/TOEFL and begin apostille of academic documents",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Submissions",
        "desc": "Submit online applications and courier hard copies",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Tuition",
        "desc": "Receive Certificate of Admission and pay tuition deposit",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Tuberculosis & Visa",
        "desc": "Complete TB screening test and submit D-2 visa at KVAC",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Grant Notice",
        "desc": "Download electronic Visa Grant Notice from Korea Visa Portal",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & ARC",
        "desc": "Fly to Korea, attend orientation, and register for ARC card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Top Korean universities offer 30% to 100% merit-based tuition scholarships.",
      "The Global Korea Scholarship (GKS) provides full tuition, flight, and monthly stipend.",
      "Tuberculosis screening test from a designated hospital is mandatory for visa.",
      "Foreign students must enroll in South Korea’s National Health Insurance (NHIS)."
    ],
    "lastVerified": "September 2026",
    "source": "Korea Immigration Service & Study in Korea (NIIED)"
  },
  "uae": {
    "slug": "uae",
    "countryName": "UAE - Dubai",
    "heroDescription": "Study at globally accredited international branch campuses in a dynamic tax-free business hub with simple student visa procedures.",
    "heroImage": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · UAE edition",
    "heroFacts": {
      "tuition": "AED 40,000–90,000 / yr",
      "livingCost": "AED 3,000–6,000 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "UAE Student Residence Visa"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top international branch campuses (Birmingham, Wollongong, Heriot-Watt, RIT, Middlesex)."
      },
      {
        "num": "02",
        "text": "Tax-free cosmopolitan economy with outstanding career and internship opportunities."
      },
      {
        "num": "03",
        "text": "Straightforward university-sponsored visa process with minimal processing wait times."
      },
      {
        "num": "04",
        "text": "10-year UAE Golden Visa eligibility for outstanding university graduates."
      }
    ],
    "quickFacts": {
      "currency": "United Arab Emirates Dirham (AED)",
      "visa": "Student Residence Visa (University Sponsored)",
      "majorIntakes": "September (Primary Fall) · January (Spring)",
      "popularLevels": "Foundation · Bachelor’s Degree · Master’s Degree · Executive MBA",
      "popularFields": "Artificial Intelligence · International Business · Civil Engineering · FinTech · Tourism & Hospitality"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or British 2:2 equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80+ / PTE 58+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal with fast-track processing",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September Intake (Application: March to August)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL / PTE",
        "score": "IELTS 6.0+ / TOEFL 80+ / PTE 58+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "EmSAT Exam",
        "score": "UAE national standardized test (for select local universities)",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "GRE / GMAT",
        "score": "Not required for most branch campus Master’s",
        "validity": "5 years",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Offer",
        "desc": "Receive unconditional admission offer and pay initial tuition deposit."
      },
      {
        "step": "02",
        "title": "Entry Permit",
        "desc": "University applies for electronic Student Entry Permit with GDRFA/ICP."
      },
      {
        "step": "03",
        "title": "Fly to UAE",
        "desc": "Enter the UAE using official electronic student entry permit."
      },
      {
        "step": "04",
        "title": "Medical Screening",
        "desc": "Complete mandatory blood test and chest X-ray screening in Dubai."
      },
      {
        "step": "05",
        "title": "Emirates ID",
        "desc": "Complete biometric fingerprint scanning at ICP identity center."
      },
      {
        "step": "06",
        "title": "Visa Stamping",
        "desc": "University completes residence visa stamping and issues Emirates ID."
      }
    ],
    "costOfStudy": {
      "tuition": "AED 40,000–90,000 / year (~$11,000–$24,500 USD · Top STEM/MBA: up to AED 110k)",
      "livingExpenses": "AED 3,000–6,000 / month (Shared: AED 3k–4k · Studio/Marina: AED 4.5k–6k)",
      "healthInsurance": "AED 1,500–3,000 / year (Mandatory UAE comprehensive health insurance)",
      "visaApplication": "AED 2,500–3,500 / year (University student visa sponsorship package)",
      "proofOfFunds": "Covered via tuition deposit and university sponsorship security"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time work permitted with university NOC in creative and free zone clusters.",
        "On-campus student employment permitted across university administrative departments.",
        "Internship authorization readily granted by academic institutions throughout degrees."
      ],
      "postStudyWork": [
        "One-year Green Residence visa available for university graduates to seek employment.",
        "Outstanding graduates (GPA 3.8+) eligible for 10-year UAE Golden Visa.",
        "Converts directly to standard two-year employer-sponsored employment residence visa."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested High School / Degree Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose / Motivation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Passport-Size Photographs",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "University Electronic Entry Permit",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Tuition Fee Deposit Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "UAE Medical Screening Fitness Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Emirates ID Application Registration Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "University Visa Sponsorship Undertaking",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Campus Shortlist",
        "desc": "Research international branch campuses in Dubai Knowledge Park",
        "time": "6–9 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS, TOEFL, or PTE Academic test",
        "time": "5–7 months before"
      },
      {
        "step": "03",
        "title": "Application Submission",
        "desc": "Submit online university applications directly to chosen institutions",
        "time": "3–5 months before"
      },
      {
        "step": "04",
        "title": "Offer & Deposit",
        "desc": "Accept offer and transfer initial tuition deposit payment",
        "time": "2–3 months before"
      },
      {
        "step": "05",
        "title": "Entry Permit",
        "desc": "University processes and issues electronic student entry permit",
        "time": "1–2 months before"
      },
      {
        "step": "06",
        "title": "Travel & Medical",
        "desc": "Fly to UAE, complete medical fitness check, and do biometrics",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "Emirates ID",
        "desc": "Receive physical Emirates ID card and begin university semester",
        "time": "Week 1 on arrival"
      }
    ],
    "goodToKnow": [
      "Branch campuses award the same degree credentials as their home UK/US/Australian campuses.",
      "Student visas in the UAE are sponsored directly by the universities.",
      "The UAE has zero personal income tax on graduate and professional salaries.",
      "High-performing graduates with GPA 3.8+ qualify for the prestigious 10-year Golden Visa."
    ],
    "lastVerified": "September 2026",
    "source": "General Directorate of Residency and Foreigners Affairs (GDRFA) & KHDA"
  },
  "finland": {
    "slug": "finland",
    "countryName": "Finland",
    "heroDescription": "Study in the world’s happiest country with world-ranked universities, generous scholarship discounts, and a two-year post-study job seeker visa.",
    "heroImage": "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Finland edition",
    "heroFacts": {
      "tuition": "€8,000–€18,000 / yr",
      "livingCost": "€700–€1,200 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 92+",
      "studentVisa": "Residence Permit for Studies"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Ranked as the world’s happiest country with exceptional educational standards."
      },
      {
        "num": "02",
        "text": "World-leading technology, software, and green transition ecosystem (Nokia, Supercell)."
      },
      {
        "num": "03",
        "text": "Generous two-year post-study job seeker residence permit for all graduates."
      },
      {
        "num": "04",
        "text": "International students are granted up to 30 hours per week of part-time work."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Residence Permit for Higher Education Studies",
      "majorIntakes": "Autumn (August/September - Primary) · Spring (January)",
      "popularLevels": "Bachelor’s Degree · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · Clean Energy · Software Engineering · Wireless Communications · Education Science"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (GPA 3.0+ / 4.0 or European Grade B equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (min 6.0 in writing) or TOEFL 92+ / PTE 62+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Studyinfo.fi unified national application portal or direct university portal",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (August/September - Joint Application: Jan 3–17)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 in writing)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "92 overall (min 22 in writing)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "62 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Required for select business/economics Master’s (Aalto)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Studyinfo Admission",
        "desc": "Receive official admission offer via national Studyinfo.fi portal."
      },
      {
        "step": "02",
        "title": "Accept & Pay",
        "desc": "Accept offer place and pay first-year tuition fee instalment."
      },
      {
        "step": "03",
        "title": "Health Insurance",
        "desc": "Purchase comprehensive student health insurance (Swisscare or SIP)."
      },
      {
        "step": "04",
        "title": "Enter Finland",
        "desc": "Submit online residence permit application on Enter Finland portal."
      },
      {
        "step": "05",
        "title": "Embassy Biometrics",
        "desc": "Visit Finnish Embassy or VFS to verify passport and biometrics."
      },
      {
        "step": "06",
        "title": "Receive Permit",
        "desc": "Receive physical residence permit card before departing for Finland."
      }
    ],
    "costOfStudy": {
      "tuition": "€8,000–€18,000 / year (Universities: €10k–€18k · UAS: €8k–€12k · 20%–50% scholarships)",
      "livingExpenses": "€700–€1,200 / month (Oulu/Tampere: €700–€900 · Helsinki: €900–€1.2k)",
      "healthInsurance": "€250–€400 / year (Private student health insurance - Swisscare or SIP)",
      "visaApplication": "€350 electronic residence permit fee on Enter Finland",
      "proofOfFunds": "€6,720 / year (€560/month) living funds in personal bank account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 30 hours per week during academic semesters under updated Finnish law.",
        "Unlimited working hours allowed during summer and Christmas holidays.",
        "High statutory working conditions and strong student union support networks."
      ],
      "postStudyWork": [
        "Two-year post-study residence permit for job seeking or entrepreneurship.",
        "Can be taken in parts or immediately following degree completion.",
        "Counts directly towards permanent residence (four years continuous residence)."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Transcripts and Degree Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Studyinfo Official Application Summary",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Motivation / Portfolio",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Admission Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statement in Student’s Name",
          "status": "€6,720+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Health Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Enter Finland Online Application Summary",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at Aalto, Helsinki, Tampere, and Oulu",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Testing",
        "desc": "Complete IELTS/TOEFL and prepare academic motivation",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Joint Application",
        "desc": "Submit applications on Studyinfo.fi during January window",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Scholarship",
        "desc": "Receive admission offer and tuition scholarship decision",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Enter Finland",
        "desc": "Submit online residence permit application with bank statement",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Embassy Biometrics",
        "desc": "Attend Finnish Embassy/VFS for identity and biometric verification",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & FSHS",
        "desc": "Receive permit card, fly to Finland, and register for FSHS",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Joint Application on Studyinfo.fi runs for two weeks every January.",
      "Most Finnish universities offer 20% to 50% tuition scholarship waivers.",
      "The residence permit is granted for the entire duration of your studies upfront.",
      "Finland offers a generous two-year stay-back visa after graduation."
    ],
    "lastVerified": "September 2026",
    "source": "Finnish Immigration Service (Migri) & Study in Finland"
  },
  "poland": {
    "slug": "poland",
    "countryName": "Poland",
    "heroDescription": "Study in one of Europe’s fastest growing tech and business hubs with low tuition fees, affordable living, and Schengen mobility.",
    "heroImage": "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Poland edition",
    "heroFacts": {
      "tuition": "€2,000–€5,000 / yr",
      "livingCost": "€400–€800 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "National Visa Type D"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Among the most affordable tuition fees and living costs in the European Union."
      },
      {
        "num": "02",
        "text": "Booming central European tech and shared services hub (Warsaw, Krakow, Wroclaw)."
      },
      {
        "num": "03",
        "text": "Full Schengen zone travel rights across 27 European countries throughout study."
      },
      {
        "num": "04",
        "text": "Nine-month post-study temporary residence permit for career job search."
      }
    ],
    "quickFacts": {
      "currency": "Polish Zloty (PLN)",
      "visa": "National Visa Type D (Study)",
      "majorIntakes": "Fall (October - Primary) · Spring (February/March)",
      "popularLevels": "Licencjat / Inzynier (UG) · Magister (PG) · Doctoral (PhD)",
      "popularFields": "Computer Science · Medicine & Dentistry · Mechanical Engineering · International Management · Logistics"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75+ / English Medium of Instruction (MOI)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal + eligibility letter (NAWA)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (October - Application: March to July/August)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "English MOI Letter",
        "score": "Medium of Instruction letter from prior university",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Entrance Exam",
        "score": "Online exam/interview conducted for Engineering or Medicine",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "NAWA / Kuratorium",
        "score": "Recognition certificate of prior educational certificates",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter and tuition payment invoice."
      },
      {
        "step": "02",
        "title": "Tuition Payment",
        "desc": "Transfer first-year tuition fee directly to the university account."
      },
      {
        "step": "03",
        "title": "Final Acceptance",
        "desc": "University issues official Certificate of Acceptance for visa."
      },
      {
        "step": "04",
        "title": "Health Insurance",
        "desc": "Purchase recognized international student health insurance policy."
      },
      {
        "step": "05",
        "title": "e-Konsulat Filing",
        "desc": "Fill online visa form on e-Konsulat and submit dossier at VFS."
      },
      {
        "step": "06",
        "title": "Travel & Karta Pobytu",
        "desc": "Receive National Visa D and apply for Karta Pobytu in Poland."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,000–€5,000 / year (Humanities: €2k–€3k · STEM/Medicine: €3.5k–€11k)",
      "livingExpenses": "€400–€800 / month (Lodz/Poznan: €400–€600 · Warsaw/Krakow: €600–€800)",
      "healthInsurance": "PLN 55 (~€12) / month (Polish National Health Fund - NFZ voluntary cover)",
      "visaApplication": "€80 National Visa (Type D) application fee",
      "proofOfFunds": "PLN 800 (~€180) / month living funds + return travel ticket"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Full-time work rights permitted during studies for full-time degree students.",
        "No work permit is required for full-time international university students.",
        "Strong student employment demand across multinational shared service centers."
      ],
      "postStudyWork": [
        "Nine-month temporary residence permit for university graduates seeking employment.",
        "Full-time degree graduates from Polish universities are exempt from work permits.",
        "Straightforward conversion to Single Residence and Work Permit (Karta Pobytu)."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized Transcripts and Degree Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate or MOI",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Eligibility Letter for Higher Education",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Statement of Purpose / Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Certificate of University Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Payment Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Recognized Medical Insurance Policy",
          "status": "€30,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Accommodation in Poland",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Search",
        "desc": "Research universities such as Warsaw Univ, Jagiellonian, and WUT",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Document Legalization",
        "desc": "Obtain apostille or consular legalization for academic transcripts",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Portals",
        "desc": "Submit online applications directly to chosen universities",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Tuition & Acceptance",
        "desc": "Transfer tuition fees and receive official Acceptance Certificate",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Visa Dossier",
        "desc": "Book appointment on e-Konsulat and submit visa file at VFS",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Decision",
        "desc": "Receive stamped National Visa D in passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & NFZ",
        "desc": "Arrive in Poland, enroll at university, and sign up for NFZ",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Full-time university students in Poland do not require a separate work permit.",
      "English Medium of Instruction (MOI) letters are accepted by many universities.",
      "Medical and dental degrees in Poland are among the most affordable in Europe.",
      "You can voluntarily enroll in public NFZ health insurance for approx. €12/month."
    ],
    "lastVerified": "September 2026",
    "source": "Polish National Agency for Academic Exchange (NAWA) & Ministry of Foreign Affairs"
  },
  "austria": {
    "slug": "austria",
    "countryName": "Austria",
    "heroDescription": "Study in one of Europe’s safest and most culturally rich nations with low public tuition fees and top research universities.",
    "heroImage": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Austria edition",
    "heroFacts": {
      "tuition": "€1,500–€3,000 / yr",
      "livingCost": "€850–€1,400 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "Student Residence Permit (Aufenthaltsbewilligung)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Low public university tuition fees of approximately €726.72 per semester."
      },
      {
        "num": "02",
        "text": "Vienna is repeatedly ranked as the world’s most livable city."
      },
      {
        "num": "03",
        "text": "Exceptional quality of life, public infrastructure, and central European location."
      },
      {
        "num": "04",
        "text": "12-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Student Residence Permit (Aufenthaltsbewilligung - Student)",
      "majorIntakes": "Winter (October - Primary) · Summer (March)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · Mechanical Engineering · International Economics · Biotechnology · Music & Arts"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (GPA 3.0+ / 4.0; Special University Entrance Qualification)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ or TOEFL iBT 90+ for English-medium tracks",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university admissions portal + legalized document verification",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Winter Semester (October - Application: May to July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 90+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "German Test",
        "score": "B2 / C1 (ÖSD or Goethe) for German-taught degrees",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Special Qualification",
        "score": "Proof of eligibility for target master’s in home country",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Entrance Examination",
        "score": "Required for high-demand programs (WU Vienna, MedUni)",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal Zulassungsbescheid admission letter from Austrian university."
      },
      {
        "step": "02",
        "title": "Legalization",
        "desc": "Complete full diplomatic legalization or apostille on all certificates."
      },
      {
        "step": "03",
        "title": "Residence Application",
        "desc": "Submit Student Residence Permit application at Austrian Embassy."
      },
      {
        "step": "04",
        "title": "Financial Proof",
        "desc": "Demonstrate €13,000 annual living funds in personal bank account."
      },
      {
        "step": "05",
        "title": "Visa D Collection",
        "desc": "Receive entry Visa D from embassy to travel to Austria."
      },
      {
        "step": "06",
        "title": "Collect Permit",
        "desc": "Register address in Austria and collect Aufenthaltsbewilligung card."
      }
    ],
    "costOfStudy": {
      "tuition": "€1,500 / year (Public: €726.72 / semester · Private: €8k–€20k)",
      "livingExpenses": "€850–€1,400 / month (Graz/Innsbruck: €850–€1.1k · Vienna: €1k–€1.4k)",
      "healthInsurance": "€69.13 / month (ÖGK statutory student self-insurance)",
      "visaApplication": "€160 total (€120 permit fee + €40 entry Visa D)",
      "proofOfFunds": "€1,110 / month (€13,320 / year) living funds in bank"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week for Bachelor’s and Master’s degree students.",
        "Employer applies for a simplified student employment permit (Beschäftigungsbewilligung).",
        "Strong working rights and fair student wages across services and tech sectors."
      ],
      "postStudyWork": [
        "12-month post-study residence permit for graduates to seek qualified employment.",
        "Direct transition to the Red-White-Red Card (Rot-Weiß-Rot-Karte) work permit.",
        "Exemption from labor market testing for graduates of Austrian universities."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Fully Legalized Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Special University Entrance Qualification",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose / Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Zulassungsbescheid Admission Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "€13,320+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Accommodation",
          "status": "Wohnrechtsvereinbarung) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Travel Health Insurance",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at University of Vienna, TU Wien, and WU Vienna",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Document Legalization",
        "desc": "Complete diplomatic legalization and certified German translations",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Applications",
        "desc": "Submit application dossiers to university admission offices",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal Zulassungsbescheid admission letter",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Residence Permit",
        "desc": "Submit residence permit application at Austrian Embassy",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Entry Visa D",
        "desc": "Collect Visa D sticker once residence permit approval is granted",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Meldezettel",
        "desc": "Arrive in Austria, register address (Meldezettel), and collect permit",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Public university tuition in Austria is set at €726.72 per semester for non-EU students.",
      "Austrian authorities require all foreign documents to be fully legalized and translated.",
      "Statutory student health insurance through ÖGK costs approx. €69.13 per month.",
      "Graduates can seamlessly convert to the Austrian Red-White-Red Card upon employment."
    ],
    "lastVerified": "September 2026",
    "source": "OeAD (Austrian Agency for Education and Internationalisation) & BMI"
  },
  "malaysia": {
    "slug": "malaysia",
    "countryName": "Malaysia",
    "heroDescription": "Study at prestigious international branch campuses with affordable living costs and direct Australian/UK dual degree pathways.",
    "heroImage": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Malaysia edition",
    "heroFacts": {
      "tuition": "MYR 15,000–45,000 / yr",
      "livingCost": "MYR 1,500–3,000 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 70+",
      "studentVisa": "Student Pass (eVAL - EMGS)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Branch campuses of top UK and Australian universities (Monash, Nottingham, Southampton)."
      },
      {
        "num": "02",
        "text": "Among the most affordable tuition rates and living expenses in Asia."
      },
      {
        "num": "03",
        "text": "Multilingual, multicultural, and exceptionally safe student-friendly study destination."
      },
      {
        "num": "04",
        "text": "Central location in Southeast Asia with booming tech and financial hubs."
      }
    ],
    "quickFacts": {
      "currency": "Malaysian Ringgit (MYR)",
      "visa": "Student Pass (eVAL via EMGS)",
      "majorIntakes": "March/April (Spring) · September/October (Fall)",
      "popularLevels": "Diploma · Bachelor’s Degree · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · Islamic Finance · Petroleum Engineering · Business Management · Biotechnology"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL 70–80+ / PTE 50+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal + EMGS student visa approval",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "September/October Intake (Application: May to August)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5–6.0 / TOEFL 70–80",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "50–58 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "English MOI Letter",
        "score": "Accepted by select private and branch campuses",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Conducted for selective healthcare and MBA degrees",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission offer and accept seat reservation place."
      },
      {
        "step": "02",
        "title": "EMGS Application",
        "desc": "University submits student visa dossier via EMGS portal."
      },
      {
        "step": "03",
        "title": "eVAL Issuance",
        "desc": "Education Malaysia Global Services issues electronic Visa Approval Letter."
      },
      {
        "step": "04",
        "title": "Single Entry Visa",
        "desc": "Apply for SEV entry visa at Malaysian Embassy or eVisa."
      },
      {
        "step": "05",
        "title": "Post-Arrival Medical",
        "desc": "Enter Malaysia and complete mandatory medical screening within seven days."
      },
      {
        "step": "06",
        "title": "Student Pass Sticker",
        "desc": "Immigration endorses annual Student Pass sticker in passport."
      }
    ],
    "costOfStudy": {
      "tuition": "MYR 15,000–45,000 / year (~$3,200–$9,500 USD · Branch: MYR 35k–60k)",
      "livingExpenses": "MYR 1,500–3,000 / month (Penang/Johor: MYR 1.5k–2k · KL: MYR 2.2k–3k)",
      "healthInsurance": "MYR 500–800 / year (Mandatory EMGS student group hospitalization cover)",
      "visaApplication": "MYR 1,060 EMGS visa processing and medical screening fee",
      "proofOfFunds": "MYR 20,000 (~$4,500 USD) bank statement solvency proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week permitted during official semester breaks.",
        "Permitted in restaurants, petrol kiosks, mini markets, and hotels.",
        "Cashier and customer service positions require immigration department approval."
      ],
      "postStudyWork": [
        "Employment Pass (Category I, II, III) available via employer sponsorship.",
        "Malaysia Digital (MD) status companies offer fast-track foreign hiring.",
        "Direct pathway to Talent Pass (Residence Pass-Talent) for skilled professionals."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested Academic Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Passport-Sized Photographs with Blue Background",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Medical Declaration Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Electronic Visa Approval Letter",
          "status": "eVAL) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "University Formal Offer Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Yellow Fever Vaccination Card",
          "status": "Country Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Post-Arrival Medical Health Check Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Campus Research",
        "desc": "Compare public universities (UM, UTM) and international branch campuses",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL or obtain university MOI waiver",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "Application Submission",
        "desc": "Submit online university applications directly with academic transcripts",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "EMGS Processing",
        "desc": "University applies for eVAL approval through EMGS portal",
        "time": "2–3 months before"
      },
      {
        "step": "05",
        "title": "SEV Application",
        "desc": "Obtain Single Entry Visa (SEV) online or at embassy",
        "time": "1–2 months before"
      },
      {
        "step": "06",
        "title": "Travel & Medical",
        "desc": "Enter Malaysia and complete post-arrival medical check within 7 days",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "Pass Endorsement",
        "desc": "Collect passport with stamped Student Pass sticker from immigration",
        "time": "Week 1 on arrival"
      }
    ],
    "goodToKnow": [
      "Dual degree programs award identical certificates from UK/Australian parent institutions.",
      "The electronic Visa Approval Letter (eVAL) is processed seamlessly via EMGS.",
      "Passport photo requirements strictly mandate a blue background for immigration.",
      "Living costs in Malaysia are approximately 60% lower than in Singapore."
    ],
    "lastVerified": "September 2026",
    "source": "Education Malaysia Global Services (EMGS) & Immigration Department of Malaysia"
  },
  "norway": {
    "slug": "norway",
    "countryName": "Norway",
    "heroDescription": "Experience world-leading research, stunning natural fjords, and high standards of living across Norway’s premier universities.",
    "heroImage": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Norway edition",
    "heroFacts": {
      "tuition": "NOK 130k–280k / yr",
      "livingCost": "NOK 11k–16k / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "Residence Permit for Studies (UDI)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top research universities including University of Oslo, NTNU, and Bergen."
      },
      {
        "num": "02",
        "text": "World leader in renewable energy, maritime technology, and green transition."
      },
      {
        "num": "03",
        "text": "Outstanding standard of living with progressive work-life balance and safety."
      },
      {
        "num": "04",
        "text": "One-year post-study residence permit for job seeking or business launch."
      }
    ],
    "quickFacts": {
      "currency": "Norwegian Krone (NOK)",
      "visa": "Residence Permit for Studies (UDI)",
      "majorIntakes": "Autumn (August - Primary Intake)",
      "popularLevels": "Bachelor · 2-Year Master of Science · Doctoral (PhD)",
      "popularFields": "Marine Technology · Renewable Energy · Computer Science · Petroleum Geoscience · Environmental Economics"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "Recognized 3 or 4-year Bachelor degree in relevant discipline",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (ECTS Grade B/C equivalent academic performance benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (no band < 6.0) or TOEFL 90+ / PTE 62+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal (Søknadsweb) with early international deadlines",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (August - Application: Oct 15 to Dec 1)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "90 overall (min 20 each section)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "62 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Recommended for select economics Master’s (NHH Bergen)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal Letter of Acceptance from Norwegian higher institution."
      },
      {
        "step": "02",
        "title": "Deposit Funds",
        "desc": "Transfer required living funds (NOK 151,690) to university deposit account."
      },
      {
        "step": "03",
        "title": "UDI Application",
        "desc": "Submit online residence permit application on UDI Application Portal."
      },
      {
        "step": "04",
        "title": "VFS Appointment",
        "desc": "Attend VFS appointment to submit physical dossier and passport."
      },
      {
        "step": "05",
        "title": "Permit Decision",
        "desc": "UDI processes application and issues electronic residence approval letter."
      },
      {
        "step": "06",
        "title": "Police Registration",
        "desc": "Arrive in Norway and visit police station to receive residence card."
      }
    ],
    "costOfStudy": {
      "tuition": "NOK 130,000–280,000 / year (~$12,000–$26,000 USD Non-EU tuition)",
      "livingExpenses": "NOK 11,000–16,000 / month (Trondheim/Bergen: NOK 11k–13k · Oslo: NOK 13k–16k)",
      "healthInsurance": "€0 / year (Free coverage under Norwegian National Insurance Scheme - Folketrygden)",
      "visaApplication": "NOK 5,900 UDI study residence permit application fee",
      "proofOfFunds": "NOK 151,690 / year in university student escrow account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular academic study semesters.",
        "Full-time work permitted during all scheduled university vacation periods.",
        "High statutory working standards and fair minimum wage conventions."
      ],
      "postStudyWork": [
        "One-year residence permit for graduates to seek skilled graduate employment.",
        "Unrestricted working hours allowed during the 12-month job search.",
        "Converts directly to Skilled Worker Residence Permit once job is secured."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bachelor’s Degree Certificate and Complete Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Course Descriptions / Syllabus Overview",
          "status": "Program Specific",
          "badgeVariant": "specific"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Letter of Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Confirmation of Funds from University Deposit Account",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Student Housing",
          "status": "Sammen / SiO) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "UDI Application Document Checklist and Cover Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Valid Passport Photocopy of All Stamped Pages",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Research",
        "desc": "Shortlist programs on Søknadsweb for UiO, NTNU, and Bergen",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Exams",
        "desc": "Complete IELTS/TOEFL and meet score prerequisites",
        "time": "9–11 months before"
      },
      {
        "step": "03",
        "title": "Søknadsweb Submission",
        "desc": "Submit online applications before December 1 deadline",
        "time": "8–9 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive admission results in late March or early April",
        "time": "4–5 months before"
      },
      {
        "step": "05",
        "title": "Escrow Living Deposit",
        "desc": "Transfer NOK 151,690 to university deposit trust account",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "UDI Visa Filing",
        "desc": "Submit application on UDI portal and attend VFS biometrics",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & Police",
        "desc": "Fly to Norway, register with police, and collect residence card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "International application deadlines on Søknadsweb close early on December 1.",
      "Students must transfer living funds to the university’s Norwegian trust account.",
      "Health coverage is automatically provided under the National Insurance Scheme.",
      "PhD candidates in Norway are employed as researchers with competitive monthly salaries."
    ],
    "lastVerified": "September 2026",
    "source": "Norwegian Directorate of Immigration (UDI) & Study in Norway"
  },
  "denmark": {
    "slug": "denmark",
    "countryName": "Denmark",
    "heroDescription": "Study in Scandinavia’s innovation leader with top research universities, problem-based learning, and a three-year post-study job seeker permit.",
    "heroImage": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Denmark edition",
    "heroFacts": {
      "tuition": "€6,000–€16,000 / yr",
      "livingCost": "DKK 6,500–11,000 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 88+",
      "studentVisa": "Residence Permit (ST1 - SIRI)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Leading universities (University of Copenhagen, DTU, Aarhus) rank in global top 100."
      },
      {
        "num": "02",
        "text": "High-trust collaborative education emphasizing innovation and real-world projects."
      },
      {
        "num": "03",
        "text": "Generous three-year post-study job search residence permit for all graduates."
      },
      {
        "num": "04",
        "text": "Excellent cycling infrastructure, safe society, and strong green tech economy."
      }
    ],
    "quickFacts": {
      "currency": "Danish Krone (DKK)",
      "visa": "Residence Permit for Higher Education (ST1)",
      "majorIntakes": "Autumn (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor of Science · 2-Year Master of Science · Doctoral (PhD)",
      "popularFields": "Biotechnology · Wind Energy Systems · Computer Science · Design & Architecture · Shipping & Logistics"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "Recognized Bachelor degree (180 ECTS) in relevant subject area",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (European Grade B/C equivalent academic performance benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "English B level: IELTS 6.5+ (min 6.0) or TOEFL 88+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "DANS national digital application portal (Master) / Optagelse.dk (Bachelor)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Nov 15 to Jan 15)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall (min 6.0 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "88 overall (min 20 each section)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "58 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Recommended for select business Master’s (Copenhagen Business School)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Offer",
        "desc": "Receive unconditional admission offer and pay first semester tuition fee."
      },
      {
        "step": "02",
        "title": "SIRI ST1 Part 1",
        "desc": "University completes Part 1 of the online ST1 application form."
      },
      {
        "step": "03",
        "title": "SIRI ST1 Part 2",
        "desc": "Student completes Part 2 online and pays SIRI processing fee."
      },
      {
        "step": "04",
        "title": "Biometrics at VFS",
        "desc": "Attend VFS appointment to record biometric facial scan and fingerprints."
      },
      {
        "step": "05",
        "title": "Permit Decision",
        "desc": "Danish Agency for International Recruitment (SIRI) approves residence permit."
      },
      {
        "step": "06",
        "title": "CPR & Health Card",
        "desc": "Arrive in Denmark, register at Citizen Service, and get CPR card."
      }
    ],
    "costOfStudy": {
      "tuition": "€6,000–€16,000 / year (approx. DKK 45k–120k · STEM/Biz: €10k–€16k)",
      "livingExpenses": "DKK 6,500–11,000 / month (Aalborg/Odense: DKK 6.5k–8k · Copenhagen: DKK 8.5k–11k)",
      "healthInsurance": "€0 / year (Free universal healthcare via Danish Yellow Health Card - Sundhedskort)",
      "visaApplication": "DKK 2,490 SIRI residence permit application fee",
      "proofOfFunds": "DKK 6,820 / month (DKK 81,840 / year) living funds in bank"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular academic study semesters.",
        "Full-time work permitted during June, July, and August summer months.",
        "High average student hourly wages (approx. DKK 120–140+ per hour)."
      ],
      "postStudyWork": [
        "Three-year post-study job search residence permit for Master’s and PhD graduates.",
        "Automatic extension included for students completing full higher education degrees.",
        "Converts directly to Danish Pay Limit Scheme or Fast-Track work permit."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bachelor’s Degree Certificate and Official Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Course Descriptions / Module Syllabus",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "University ST1 Application Reference",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First Semester Tuition Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Personal Bank Account Statement",
          "status": "DKK 81,840+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "SIRI Case Order ID Fee Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Biometric Recording Confirmation Sheet",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Search",
        "desc": "Explore programs on DANS portal for KU, DTU, CBS, and Aarhus",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL and assemble syllabus descriptions",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "DANS Portal Filing",
        "desc": "Submit online applications before January 15 deadline",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Tuition",
        "desc": "Receive admission offer and pay first semester tuition fees",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "ST1 Filing",
        "desc": "Complete SIRI ST1 online application and pay Case Order fee",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "VFS Biometrics",
        "desc": "Attend VFS appointment for biometric facial and fingerprint collection",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & CPR",
        "desc": "Fly to Denmark, register at Citizen Service, and get CPR card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Denmark provides a generous three-year post-study job search visa for graduates.",
      "Danish public healthcare is completely free with your yellow Sundhedskort card.",
      "Master’s application deadlines close early on January 15 across most universities.",
      "Course descriptions and syllabi are mandatory for academic credit evaluations."
    ],
    "lastVerified": "September 2026",
    "source": "Danish Agency for International Recruitment and Integration (SIRI) & Study in Denmark"
  },
  "belgium": {
    "slug": "belgium",
    "countryName": "Belgium",
    "heroDescription": "Study at the diplomatic heart of the European Union with world-ranked research institutions, affordable tuition, and rich multiculturalism.",
    "heroImage": "https://images.unsplash.com/photo-1572979203492-c14491745480?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Belgium edition",
    "heroFacts": {
      "tuition": "€1,000–€7,000 / yr",
      "livingCost": "€800–€1,300 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 85+",
      "studentVisa": "Student Visa (Type D - ASP)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top research universities including KU Leuven (#61 globally) and Ghent University."
      },
      {
        "num": "02",
        "text": "Capital of the European Union with unparalleled diplomatic and corporate networking."
      },
      {
        "num": "03",
        "text": "Highly affordable tuition rates at public universities across Flanders and Wallonia."
      },
      {
        "num": "04",
        "text": "12-month post-study search year residence permit for all university graduates."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Student Visa Type D (Long-Stay National Visa)",
      "majorIntakes": "Autumn (September - Primary Intake)",
      "popularLevels": "Bachelor · Master of Science · Advanced Master · Doctoral (PhD)",
      "popularFields": "Biomedical Sciences · International Relations · Microelectronics & Nano · Economics & Business · Chemical Engineering"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or Belgian Grade Distinction equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ or TOEFL iBT 85–90+ / PTE 60+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with credential verification",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Dec to March 1)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 85+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Recommended for competitive economics and management Master’s",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "APS Certificate",
        "score": "Mandatory credential verification for applicants from China",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Assessment",
        "score": "Online math/quantitative placement test for engineering",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Formal Admission",
        "desc": "Receive official unconditional acceptance letter from Belgian university."
      },
      {
        "step": "02",
        "title": "Administrative Fee",
        "desc": "Pay mandatory Belgian immigration administrative fee online."
      },
      {
        "step": "03",
        "title": "Blocked Account",
        "desc": "Transfer living expenses (€9,600) to university blocked account."
      },
      {
        "step": "04",
        "title": "Medical & Police",
        "desc": "Obtain recognized medical fitness certificate and police clearance certificate."
      },
      {
        "step": "05",
        "title": "Embassy Filing",
        "desc": "Submit National Visa Type D dossier at Belgian Embassy/TLScontact."
      },
      {
        "step": "06",
        "title": "Annexe 20 / Residence",
        "desc": "Receive visa sticker, fly to Belgium, and register at Commune."
      }
    ],
    "costOfStudy": {
      "tuition": "€1,000–€7,000 / year (Public EU standard: €1k–€4.5k · Tech/Biz: €4.5k–€7k)",
      "livingExpenses": "€800–€1,300 / month (Ghent/Leuven: €800–€1k · Brussels: €1k–€1.3k)",
      "healthInsurance": "€100–€150 / year (Belgian Mutualité public health insurance fund)",
      "visaApplication": "€215 Belgian federal administrative fee (+ €180 consular/VFS fee)",
      "proofOfFunds": "€803 / month (€9,636 / year) via university blocked account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular academic semesters with Single Permit.",
        "Unlimited working hours allowed during scheduled summer and semester holiday breaks.",
        "Standard employment contracts subject to fair Belgian labor union standards."
      ],
      "postStudyWork": [
        "12-month search year residence permit (Orientation Year) for degree graduates.",
        "Open full-time employment allowed with any employer during the search year.",
        "Converts directly to Belgian Single Permit (Work/Residence) once hired."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized Degree Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Letters of Recommendation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "University Blocked Account Living Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official University Admission Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Belgian Federal Administrative Fee Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Embassy-Approved Medical Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized National Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Selection",
        "desc": "Shortlist programs at KU Leuven, Ghent, ULB, and VUB",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Exams",
        "desc": "Complete IELTS/TOEFL and prepare academic writing samples",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Submit online applications before March 1 deadline",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal acceptance and initiate blocked account transfer",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Medical & Legalization",
        "desc": "Complete medical check and get police clearance certificate",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Embassy Visa",
        "desc": "Submit Type D visa dossier at Belgian Embassy / TLScontact",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & Commune",
        "desc": "Arrive in Belgium, register at local Commune, and receive Residence Card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Most Belgian universities offer a secure blocked account system for living funds.",
      "Non-EU application deadlines close early on March 1 across Flemish universities.",
      "The Orientation Year grants 12 months of open work rights after graduation.",
      "Enrolling in a Belgian Mutualité provides 75% reimbursement on medical care."
    ],
    "lastVerified": "September 2026",
    "source": "Belgian Immigration Office (Office des Étrangers) & Study in Belgium"
  },
  "portugal": {
    "slug": "portugal",
    "countryName": "Portugal",
    "heroDescription": "Study in sunny, welcoming southern Europe with historic universities, low living costs, and clear long-term residence pathways.",
    "heroImage": "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Portugal edition",
    "heroFacts": {
      "tuition": "€1,500–€7,000 / yr",
      "livingCost": "€550–€1,100 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "National Visa (Type D4 / D5)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Historic universities (University of Lisbon, Porto, Coimbra) with top academic heritage."
      },
      {
        "num": "02",
        "text": "Among the lowest cost of living and safest societies in Western Europe."
      },
      {
        "num": "03",
        "text": "Thriving tech and startup ecosystem in Lisbon, host city of Web Summit."
      },
      {
        "num": "04",
        "text": "12-month post-study residence permit for job search or innovative business creation."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa Type D4 / D5 (Higher Education)",
      "majorIntakes": "Autumn (September/October - Primary) · Spring (February)",
      "popularLevels": "Licenciatura (UG) · Mestrado (PG) · Doutoramento (PhD)",
      "popularFields": "Software Engineering · Marine Biology · Renewable Energy · Tourism & Hospitality · International Management"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or Portuguese 12/20 scale)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with diploma verification",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - 1st Call: Jan to March, 2nd: Apr to June)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Recommended for NOVA School of Business & Economics (Nova SBE)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Portuguese Language Test",
        "score": "CAPLE exam (only for Portuguese-medium degrees)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Online academic interview for selective Master’s programs",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter and pay tuition fee deposit."
      },
      {
        "step": "02",
        "title": "Police Clearance",
        "desc": "Obtain criminal record certificate with Hague Apostille legalization."
      },
      {
        "step": "03",
        "title": "Travel Insurance",
        "desc": "Purchase international medical insurance covering €30,000 emergency care."
      },
      {
        "step": "04",
        "title": "Financial Proof",
        "desc": "Demonstrate Portuguese minimum wage living funds (€820/mo) in bank."
      },
      {
        "step": "05",
        "title": "VFS Consular Filing",
        "desc": "Submit National Visa Type D4 application at VFS Global/Embassy."
      },
      {
        "step": "06",
        "title": "AIMA Appointment",
        "desc": "Arrive in Portugal and attend pre-scheduled AIMA residence appointment."
      }
    ],
    "costOfStudy": {
      "tuition": "€1,500–€7,000 / year (Public: €1.5k–€4.5k · Private/Biz: €5k–€10k)",
      "livingExpenses": "€550–€1,100 / month (Coimbra/Braga: €550–€750 · Lisbon/Porto: €800–€1.1k)",
      "healthInsurance": "€0–€150 / year (National Health Service - SNS coverage on registration)",
      "visaApplication": "€90 National Visa (D4) application fee (+ VFS service fee)",
      "proofOfFunds": "€9,840 / year (12 months of Portuguese minimum wage index)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week permitted during regular university study semesters.",
        "Full-time work permitted during scheduled summer and semester vacation breaks.",
        "Employer notifies AIMA (Agency for Integration, Migration and Asylum)."
      ],
      "postStudyWork": [
        "12-month post-study residence permit for university graduates seeking employment.",
        "Can launch entrepreneurial ventures or seek corporate employment across sectors.",
        "Converts directly to standard Residence Permit for Employed Workers (Art. 88)."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Letters of Academic Recommendation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Admission Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statements Demonstrating Solvency",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Accommodation in Portugal",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Criminal Record Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Travel Health Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Search",
        "desc": "Research programs at Univ of Lisbon, Porto, Coimbra, and Nova SBE",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL and prepare apostilled transcripts",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Portal Submissions",
        "desc": "Apply during 1st or 2nd international application calls",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Deposit",
        "desc": "Accept offer and transfer initial seat reservation deposit",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Consular Dossier",
        "desc": "Assemble criminal record check and bank solvency statements",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Visa Filing",
        "desc": "Submit National Visa Type D4 application at VFS / Embassy",
        "time": "2–3 months before"
      },
      {
        "step": "07",
        "title": "Travel & AIMA",
        "desc": "Arrive in Portugal and attend pre-scheduled AIMA residence interview",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Type D4 visa includes a pre-scheduled date for your AIMA residence appointment.",
      "Criminal background records must bear the Hague Apostille or consular legalization.",
      "Portugal offers a clear 5-year path to European citizenship with basic language proficiency.",
      "Lisbon and Porto are vibrant tech hubs with expanding startup job markets."
    ],
    "lastVerified": "September 2026",
    "source": "Agency for Integration, Migration and Asylum (AIMA) & Study in Portugal"
  },
  "czech-republic": {
    "slug": "czech-republic",
    "countryName": "Czech Republic",
    "heroDescription": "Study in the historic heart of Europe with world-renowned universities like Charles University, affordable tuition, and low living expenses.",
    "heroImage": "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Czechia edition",
    "heroFacts": {
      "tuition": "€2,500–€8,000 / yr",
      "livingCost": "CZK 10,000–18,000 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "Long-Term Visa / Residence Permit"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Historic universities (Charles University founded 1348, Czech Technical University)."
      },
      {
        "num": "02",
        "text": "Highly affordable living costs and tuition fees compared to Western Europe."
      },
      {
        "num": "03",
        "text": "Prime central European location with seamless rail connections across Schengen."
      },
      {
        "num": "04",
        "text": "Nine-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Czech Koruna (CZK)",
      "visa": "Long-Term Visa / Residence Permit for Studies",
      "majorIntakes": "Autumn (September/October - Primary Intake)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Medicine & Dentistry · Computer Science & AI · Mechanical Engineering · International Economics · Cybersecurity"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (Nostrification)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.6+ / 4.0 or equivalent academic benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80–90+ / PTE 58+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal + Nostrification credential validation",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Dec to March/April)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Nostrification Exam",
        "score": "Secondary school recognition exam for Bachelor applicants",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Entrance Exam",
        "score": "Written math or subject exam for selective faculties",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Czech Language (CCE)",
        "score": "B2 / C1 level (grants 100% free tuition in Czech tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Pass entrance exams and receive official Decision on Admission."
      },
      {
        "step": "02",
        "title": "Nostrification",
        "desc": "Complete academic degree recognition (Nostrification) in Czechia."
      },
      {
        "step": "03",
        "title": "Financial Proof",
        "desc": "Show CZK 130,000 living funds in an international bank account."
      },
      {
        "step": "04",
        "title": "Accommodation Proof",
        "desc": "Obtain certified accommodation contract (Doklad o ubytování)."
      },
      {
        "step": "05",
        "title": "Consular Application",
        "desc": "Submit Long-Term Visa dossier at Czech Embassy with superlegalization."
      },
      {
        "step": "06",
        "title": "Travel & Registration",
        "desc": "Collect visa sticker and register with Foreign Police within three days."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,500–€8,000 / year (English tracks: €2.5k–€6k · Medicine: €12k–€16k · Czech: €0)",
      "livingExpenses": "CZK 10,000–18,000 / month (Brno/Olomouc: CZK 10k–13k · Prague: CZK 14k–18k)",
      "healthInsurance": "CZK 20,000–28,000 / year (PVZP comprehensive mandatory health insurance)",
      "visaApplication": "CZK 2,500 Long-Term Visa application fee",
      "proofOfFunds": "CZK 130,000 / year (~€5,200) annual living solvency benchmark"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Free access to the Czech labor market for accredited full-time students.",
        "No separate work permit is required for international degree students.",
        "Flexible student part-time jobs widely available across Prague and Brno."
      ],
      "postStudyWork": [
        "Nine-month post-study residence permit for university graduates seeking jobs.",
        "Full-time degree graduates retain permanent free access to Czech labor market.",
        "Converts directly to Employee Card (Zaměstnanecká karta) once employed."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized Degree Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certificate of Academic Nostrification",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Decision on Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certified Accommodation Confirmation Document",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Statement with International Payment Card",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Superlegalized Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "PVZP Comprehensive Health Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Shortlist",
        "desc": "Research programs at Charles University, CTU, and Masaryk",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Nostrification Prep",
        "desc": "Prepare apostilled/legalized academic transcripts and syllabi",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Portals",
        "desc": "Submit university applications before February/March deadlines",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Entrance Exams",
        "desc": "Complete faculty entrance examinations (online or on-campus)",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Embassy Appointment",
        "desc": "Book visa appointment on Embassy portal and submit translated dossier",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Visa Decision",
        "desc": "Receive approval and collect Long-Term Visa sticker at embassy",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Foreign Police",
        "desc": "Fly to Czechia, register at Foreign Police, and start classes",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Studying degree programs taught in the Czech language is 100% tuition-free.",
      "Degree graduates have free access to the labor market without work permit sponsorship.",
      "All foreign documents must be officially translated into the Czech language.",
      "Comprehensive health insurance must be purchased from designated provider PVZP."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of the Interior of the Czech Republic & Study in Czechia"
  },
  "hungary": {
    "slug": "hungary",
    "countryName": "Hungary",
    "heroDescription": "Study in central Europe with prestigious historic universities, low tuition, and the renowned Stipendium Hungaricum scholarship.",
    "heroImage": "https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Hungary edition",
    "heroFacts": {
      "tuition": "€2,000–€6,000 / yr",
      "livingCost": "€450–€850 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Residence Permit for Studies (OIF)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Generous fully funded Stipendium Hungaricum government scholarship program."
      },
      {
        "num": "02",
        "text": "Long academic traditions at ELTE, BME, University of Debrecen, and Szeged."
      },
      {
        "num": "03",
        "text": "Extremely affordable tuition fees and student living expenses in central Europe."
      },
      {
        "num": "04",
        "text": "Nine-month post-study job search residence permit (Study-to-Work) for graduates."
      }
    ],
    "quickFacts": {
      "currency": "Hungarian Forint (HUF)",
      "visa": "Residence Permit for Study Purposes (Type D Entry)",
      "majorIntakes": "Autumn (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Medicine & Pharmacy · Computer Science · Mechanical Engineering · International Economics · Agriculture"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years of formal schooling or recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.6+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75+ / English MOI letter",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal or Tempus Public Foundation (Stipendium Hungaricum)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Nov to May / SH: Jan 15)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "English MOI Letter",
        "score": "Accepted by select universities for prior English medium",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Entrance Exam",
        "score": "Online oral/written exam conducted by faculty professors",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Medical Entrance Exam",
        "score": "Mandatory biology/chemistry test for medical degrees",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Pass entrance interview and receive official Letter of Acceptance."
      },
      {
        "step": "02",
        "title": "Tuition Payment",
        "desc": "Transfer first-year tuition fee (or receive Stipendium scholarship)."
      },
      {
        "step": "03",
        "title": "Residence Application",
        "desc": "Submit Type D residence permit application at Hungarian Embassy/VFS."
      },
      {
        "step": "04",
        "title": "Consular Interview",
        "desc": "Attend brief consular visa interview on study plans and motivation."
      },
      {
        "step": "05",
        "title": "Visa D Stamping",
        "desc": "Receive single-entry Visa D sticker valid for 30 days."
      },
      {
        "step": "06",
        "title": "OIF Residence Card",
        "desc": "Collect physical residence permit card at National Directorate-General (OIF)."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,000–€6,000 / year (General: €2k–€4.5k · STEM: €3.5k–€6k · Medicine: €9k–€16k)",
      "livingExpenses": "€450–€850 / month (Debrecen/Szeged/Pecs: €450–€650 · Budapest: €650–€850)",
      "healthInsurance": "€150–€300 / year (Private student health insurance or TAJ state card)",
      "visaApplication": "€110 Residence Permit for Study application fee",
      "proofOfFunds": "€6,000 / year (~HUF 2.4M) living funds in personal/sponsor bank"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 30 hours per week during term-time under updated Hungarian regulations.",
        "Up to 66 working days outside of academic term periods.",
        "Strong demand across multinational shared services and customer support hubs."
      ],
      "postStudyWork": [
        "Nine-month Study-to-Work residence permit for job seeking or business launch.",
        "Must be applied for at least 15 days before the student permit expires.",
        "Converts directly to standard Residence Permit for Employment upon hiring."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Degree Certificate and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate or MOI",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Academic Letters of Recommendation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Medical Health Fitness Certificate",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Letter of Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Payment Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Statement Demonstrating Solvency",
          "status": "€6,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certified Accommodation Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Travel Health Insurance",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Selection",
        "desc": "Research degrees on Study in Hungary and Stipendium portals",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Stipendium Application",
        "desc": "Submit Stipendium Hungaricum application before January 15",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Entrance Examinations",
        "desc": "Complete online oral and written faculty entrance exams",
        "time": "5–7 months before"
      },
      {
        "step": "04",
        "title": "Acceptance & Letters",
        "desc": "Receive official Letter of Acceptance and scholarship nomination",
        "time": "4–5 months before"
      },
      {
        "step": "05",
        "title": "Embassy Filing",
        "desc": "Submit residence permit dossier and attend consular interview",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa D Collection",
        "desc": "Receive Visa D entry sticker in passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & OIF",
        "desc": "Fly to Hungary and collect residence permit card at OIF",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "The Stipendium Hungaricum covers 100% tuition, monthly stipend, housing, and health insurance.",
      "University entrance exams are typically conducted via Skype/Zoom interviews.",
      "You must visit the local OIF immigration office within 30 days of arrival.",
      "Budapest is one of the most affordable and vibrant student capitals in Europe."
    ],
    "lastVerified": "September 2026",
    "source": "National Directorate-General for Aliens Policing (OIF) & Tempus Public Foundation"
  },
  "hong-kong": {
    "slug": "hong-kong",
    "countryName": "Hong Kong",
    "heroDescription": "Study at Asia’s premier financial hub with world top 50 universities, English-medium education, and generous 2-year IANG work visas.",
    "heroImage": "https://images.unsplash.com/photo-1506970845246-18f21d533b20?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Hong Kong edition",
    "heroFacts": {
      "tuition": "HKD 145,000–190,000 / yr",
      "livingCost": "HKD 5,000–10,000 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 80+",
      "studentVisa": "Student Visa (Immd)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Five universities ranked in the global top 100 (HKU, CUHK, HKUST, CityU, PolyU)."
      },
      {
        "num": "02",
        "text": "100% English-medium teaching across all major higher education institutions."
      },
      {
        "num": "03",
        "text": "Two-year Immigration Arrangements for Non-local Graduates (IANG) work visa."
      },
      {
        "num": "04",
        "text": "Global financial powerhouse offering unrivaled career and banking opportunities."
      }
    ],
    "quickFacts": {
      "currency": "Hong Kong Dollar (HKD)",
      "visa": "Student Visa (Immigration Department - ImmD)",
      "majorIntakes": "Autumn (September - Primary Intake)",
      "popularLevels": "Bachelor · 1-Year Taught Master · MPhil · Doctoral (PhD)",
      "popularFields": "Quantitative Finance · Computer Science & AI · Civil Engineering · International Business · Data Analytics"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "70%–75%+ (GPA 3.0–3.3+ / 4.0; top programs highly selective)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (min 6.0) or TOEFL iBT 80–90+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online application portal with academic referee reports",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Nov to Feb/March)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Highly recommended for HKU, CUHK, and HKUST business Master’s",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Video interview with academic admissions committee",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission offer and accept seat reservation place."
      },
      {
        "step": "02",
        "title": "Visa Sponsorship",
        "desc": "University acts as official sponsor and collects student visa dossier."
      },
      {
        "step": "03",
        "title": "ImmD Submission",
        "desc": "University submits visa application to Hong Kong Immigration Department."
      },
      {
        "step": "04",
        "title": "eVisa Label",
        "desc": "Download electronic Student Visa label (e-Visa) from ImmD portal."
      },
      {
        "step": "05",
        "title": "Travel & Landing",
        "desc": "Enter Hong Kong and present electronic student visa at border control."
      },
      {
        "step": "06",
        "title": "HKID Card",
        "desc": "Apply for Hong Kong Identity Card (HKID) within 30 days of landing."
      }
    ],
    "costOfStudy": {
      "tuition": "HKD 145,000–190,000 / year (~$18,500–$24,500 USD · MBA/Finance: HKD 250k–400k)",
      "livingExpenses": "HKD 5,000–10,000 / month (Hall: HKD 3k–5k · Private flat: HKD 7k–10k)",
      "healthInsurance": "HKD 100–300 / year (Subsidized public hospital care with Hong Kong ID card)",
      "visaApplication": "HKD 230 Immigration Department student visa issuance fee",
      "proofOfFunds": "HKD 150,000–200,000 annual living and tuition solvency proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week on-campus employment during academic semesters.",
        "Full-time work permitted during June, July, and August summer periods.",
        "Study-related internships permitted with prior university endorsement."
      ],
      "postStudyWork": [
        "Two-year IANG (Immigration Arrangements for Non-local Graduates) work visa.",
        "Unconditional stay granted for 24 months without requiring initial job offer.",
        "Counts toward 7-year permanent residency qualification (Hong Kong PR)."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Transcripts and Graduation Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Confidential Academic Referee Reports",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "ID995A Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Financial Sponsor Undertaking Letter",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "University Visa Sponsorship Acceptance Sheet",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Research",
        "desc": "Shortlist programs at HKU, CUHK, HKUST, CityU, and PolyU",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Exams & GMAT",
        "desc": "Complete IELTS/TOEFL and GMAT/GRE for business degrees",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Direct Submissions",
        "desc": "Submit online applications before Round 1/2 deadlines",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal offer and submit university visa sponsorship pack",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "ImmD Processing",
        "desc": "Immigration Department processes student visa in six to eight weeks",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "eVisa Download",
        "desc": "Download electronic student visa label and arrange travel",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & HKID",
        "desc": "Fly to Hong Kong, register at university, and apply for HKID card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "The IANG scheme offers two full years of unrestricted post-study work rights.",
      "Hong Kong universities teach 100% in English with internationally recognized faculty.",
      "International students holding an HKID card access highly subsidized public healthcare.",
      "On-campus university halls are very affordable compared to the private rental market."
    ],
    "lastVerified": "September 2026",
    "source": "Immigration Department of Hong Kong (ImmD) & Study in Hong Kong"
  },
  "china": {
    "slug": "china",
    "countryName": "China",
    "heroDescription": "Study in the world’s second largest economy with prestigious C9 League universities, Chinese Government Scholarships, and tech leadership.",
    "heroImage": "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · China edition",
    "heroFacts": {
      "tuition": "RMB 20,000–50,000 / yr",
      "livingCost": "RMB 2,500–5,500 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "Student Visa (X1 / X2)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top C9 League institutions including Tsinghua (#14) and Peking University (#17)."
      },
      {
        "num": "02",
        "text": "Fully funded Chinese Government Scholarship (CSC) covering tuition and living."
      },
      {
        "num": "03",
        "text": "Global leader in electric vehicles, artificial intelligence, and manufacturing."
      },
      {
        "num": "04",
        "text": "Expanding post-study entrepreneurship and work visa policies for top graduates."
      }
    ],
    "quickFacts": {
      "currency": "Chinese Yuan (RMB)",
      "visa": "Student Visa (X1 Long-Stay / X2 Short-Stay)",
      "majorIntakes": "Autumn (September - Primary Intake) · Spring (March)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Artificial Intelligence · International Economics & Trade · Civil Engineering · Material Science · Traditional Chinese Medicine"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (GPA 3.0+ / 4.0; top C9 universities highly competitive)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80–90+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online portal + CSC scholarship application system",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Dec to April)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "HSK Exam",
        "score": "HSK 4–5 (only for Chinese-taught programs)",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Video interview conducted by department admission board",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Physical Examination",
        "score": "Foreigner Physical Examination Form from certified hospital",
        "validity": "6 months",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive Admission Notice and official JW201/JW202 visa form."
      },
      {
        "step": "02",
        "title": "Medical Examination",
        "desc": "Complete Foreigner Physical Examination Form with laboratory reports."
      },
      {
        "step": "03",
        "title": "Visa Application",
        "desc": "Submit X1 visa application with JW202 form at Chinese Visa Center."
      },
      {
        "step": "04",
        "title": "Collect X1 Visa",
        "desc": "Receive stamped single-entry X1 visa valid for 30 days."
      },
      {
        "step": "05",
        "title": "Travel to China",
        "desc": "Enter China and complete registration at university campus."
      },
      {
        "step": "06",
        "title": "Residence Permit",
        "desc": "Apply for Foreigner Residence Permit at local PSB within 30 days."
      }
    ],
    "costOfStudy": {
      "tuition": "RMB 20,000–50,000 / year (~$2,800–$7,000 USD · Top STEM/MBA: RMB 40k–80k)",
      "livingExpenses": "RMB 2,500–5,500 / month (Tier 2/3 cities: RMB 2.5k–3.5k · Shanghai/Beijing: RMB 4k–5.5k)",
      "healthInsurance": "RMB 800 / year (Mandatory Comprehensive Medical Insurance for Foreigners)",
      "visaApplication": "$140 USD Chinese X1 visa fee (+ Visa Center service charge)",
      "proofOfFunds": "$5,000–$10,000 USD bank solvency statement (or CSC scholarship)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time work and off-campus internships permitted with university and PSB approval.",
        "Work authorization endorsement is added to the foreign residence permit.",
        "On-campus teaching and administrative assistantships widely available for students."
      ],
      "postStudyWork": [
        "Direct work permit eligibility (Category A/B) for Master’s and PhD graduates.",
        "Two-year entrepreneurship visa available in innovation hubs like Shanghai and Shenzhen.",
        "Fast-track Z Work Visa processing for graduates with merit academic performance."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Notarized Degree Certificate and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Study Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Two Academic Recommendation Letters",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Non-Criminal Record Certificate",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Admission Notice from University",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Original Visa Application JW201 / JW202 Form",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Foreigner Physical Examination Record",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Statement Demonstrating Financial Solvency",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Chinese Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Search",
        "desc": "Research C9 universities (Tsinghua, Peking, Fudan, SJTU, ZJU)",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "CSC Scholarship",
        "desc": "Apply for Chinese Government Scholarship on CSC portal",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Direct Portals",
        "desc": "Submit online university applications and notarized documents",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & JW202",
        "desc": "Receive formal Admission Notice and official JW202 visa form",
        "time": "4–5 months before"
      },
      {
        "step": "05",
        "title": "Medical & Police",
        "desc": "Complete physical examination form and get police clearance",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Center Filing",
        "desc": "Submit X1 visa dossier at Chinese Visa Application Service Center",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & PSB",
        "desc": "Fly to China, matriculate, and convert to Residence Permit at PSB",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "The Chinese Government Scholarship (CSC) provides full tuition, free room, and living stipend.",
      "The official JW201/JW202 form issued by the government is mandatory for visa filing.",
      "You must convert your 30-day X1 visa into a Residence Permit at the PSB within 30 days.",
      "Learning conversational Chinese greatly improves daily life and internship prospects."
    ],
    "lastVerified": "September 2026",
    "source": "China Scholarship Council (CSC) & National Immigration Administration (NIA)"
  },
  "taiwan": {
    "slug": "taiwan",
    "countryName": "Taiwan",
    "heroDescription": "Study in Asia’s high-tech semiconductor capital with world-ranked universities, affordable tuition, and generous government scholarships.",
    "heroImage": "https://images.unsplash.com/photo-1508248017083-1628d0225d36?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Taiwan edition",
    "heroFacts": {
      "tuition": "NTD 50,000–120,000 / yr",
      "livingCost": "NTD 10,000–20,000 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 75+",
      "studentVisa": "Resident Visa (BOCA - MOFA)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Global epicenter of semiconductor and electronics manufacturing (TSMC ecosystem)."
      },
      {
        "num": "02",
        "text": "Highly ranked universities including National Taiwan University (NTU) and NTHU."
      },
      {
        "num": "03",
        "text": "Highly affordable tuition rates and generous Taiwan MOE/MOFA Scholarships."
      },
      {
        "num": "04",
        "text": "Safe, democratic society with exceptional healthcare and high living standards."
      }
    ],
    "quickFacts": {
      "currency": "New Taiwan Dollar (NTD)",
      "visa": "Resident Visa for Studies (MOFA / BOCA)",
      "majorIntakes": "Fall (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Semiconductor Engineering · Computer Science & AI · Electrical Engineering · International Business · Mandarin Chinese"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or equivalent academic benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL iBT 75–80+ / TOEIC 750+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university international admissions portal with authenticated diplomas",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (September - Application: Jan to March/April)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL / TOEIC",
        "score": "IELTS 5.5+ / TOEFL 75+ / TOEIC 750+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOCFL Exam",
        "score": "Test of Chinese as a Foreign Language (for Chinese tracks)",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Online academic interview conducted for select departments",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "Health Certificate",
        "score": "Standardized Health Certificate for Residence Application",
        "validity": "3 months",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal Letter of Acceptance from accredited Taiwanese university."
      },
      {
        "step": "02",
        "title": "Diploma Authentication",
        "desc": "Authenticate diplomas and transcripts at Taipei Economic and Cultural Office (TECO)."
      },
      {
        "step": "03",
        "title": "Health Check",
        "desc": "Complete standard Medical Examination Form at an approved hospital."
      },
      {
        "step": "04",
        "title": "Visa Application",
        "desc": "Submit Resident Visa application with financial proof at TECO/BOCA."
      },
      {
        "step": "05",
        "title": "Resident Visa Grant",
        "desc": "Receive stamped Resident Visa sticker in international passport."
      },
      {
        "step": "06",
        "title": "ARC Card Collection",
        "desc": "Enter Taiwan and apply for Alien Resident Certificate (ARC) within 15 days."
      }
    ],
    "costOfStudy": {
      "tuition": "NTD 50,000–120,000 / year (~$1,600–$3,800 USD · STEM/Private: NTD 80k–140k)",
      "livingExpenses": "NTD 10,000–20,000 / month (Tainan/Taichung: NTD 10k–14k · Taipei: NTD 15k–20k)",
      "healthInsurance": "NTD 826 / month (Mandatory National Health Insurance - NHI after 6 months)",
      "visaApplication": "$66 USD Resident Visa application fee",
      "proofOfFunds": "$4,000–$6,000 USD bank solvency statement"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during semesters with official Work Permit from WDA.",
        "Unlimited working hours permitted during scheduled summer and winter vacations.",
        "Applied online through the Workforce Development Agency EZ Work Taiwan portal."
      ],
      "postStudyWork": [
        "Points-based ranking system for foreign graduates to secure white-collar work permits.",
        "Evaluates academic degree, salary, language ability, and specialized skill expertise.",
        "Direct pathway to Employment Gold Card for high-performing technical graduates."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Authenticated Graduation Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Study Plan and Statement of Academic Purpose",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Two Academic Recommendation Letters",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Financial Solvency Bank Statement",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Standardized Health Certificate for Residence",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Authenticated Bank Account Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "TECO Authenticated Academic Credentials",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed BOCA Resident Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at NTU, Tsing Hua (NTHU), NYCU, and NCKU",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "MOE Scholarship",
        "desc": "Apply for Taiwan Scholarship (MOE/MOFA) at local TECO office",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Direct Portals",
        "desc": "Submit online university applications and verified transcripts",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Letters",
        "desc": "Receive formal admission offer and scholarship award notifications",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Health Check & TECO",
        "desc": "Complete medical exam and get diplomas authenticated at TECO",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Resident Visa",
        "desc": "Submit Resident Visa dossier at TECO consular office",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & ARC",
        "desc": "Fly to Taiwan, matriculate, and apply for ARC card within 15 days",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Taiwan Scholarship provides full tuition subsidies plus a monthly living stipend.",
      "National Health Insurance (NHI) in Taiwan is world-renowned for comprehensive care and low cost.",
      "Foreign degree graduates can easily qualify for employment via the Points System.",
      "Document authentication by your regional TECO office is mandatory for admission and visa."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of Foreign Affairs (BOCA) & Study in Taiwan (FICHET)"
  },
  "turkey": {
    "slug": "turkey",
    "countryName": "Turkey",
    "heroDescription": "Study at the crossroads of Europe and Asia with affordable university tuition, Türkiye Bursları scholarships, and rich cultural heritage.",
    "heroImage": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Turkey edition",
    "heroFacts": {
      "tuition": "$1,000–$6,000 / yr",
      "livingCost": "$350–$750 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 78+",
      "studentVisa": "Student Residence Permit (İkamet)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top research universities (METU, Boğaziçi, Koç, Bilkent, Sabancı) leading Eurasia."
      },
      {
        "num": "02",
        "text": "Generous fully funded Türkiye Bursları government scholarships covering all expenses."
      },
      {
        "num": "03",
        "text": "Highly affordable tuition rates and remarkably low daily student living costs."
      },
      {
        "num": "04",
        "text": "Strategic transcontinental hub connecting European and Middle Eastern career networks."
      }
    ],
    "quickFacts": {
      "currency": "Turkish Lira (TRY)",
      "visa": "Student Visa / Student Residence Permit (İkamet)",
      "majorIntakes": "Fall (September/October - Primary) · Spring (February)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Civil Engineering · International Relations · Medicine & Surgery · Architecture · Computer Engineering"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (Denklik)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.5+ / 4.0 or equivalent academic benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 78–85+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal or Türkiye Bursları centralized scholarship portal",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (September - Application: May to August)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 78+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "YÖS / TR-YÖS",
        "score": "Turkish Foreign Student Exam (for select public bachelor’s)",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "SAT / ACT",
        "score": "Accepted by top English universities (Koç, Bilkent, METU)",
        "validity": "2 years",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "ALES / GRE",
        "score": "Required for select Turkish graduate degree tracks",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Acceptance",
        "desc": "Receive formal Acceptance Letter and pay seat deposit fee."
      },
      {
        "step": "02",
        "title": "Visa Application",
        "desc": "Submit Student Visa application at Turkish Embassy or VFS."
      },
      {
        "step": "03",
        "title": "Enter Turkey",
        "desc": "Travel to Turkey using your single-entry educational student visa."
      },
      {
        "step": "04",
        "title": "University Registration",
        "desc": "Complete on-campus registration and collect official student certificate (Öğrenci Belgesi)."
      },
      {
        "step": "05",
        "title": "e-İkamet Filing",
        "desc": "Submit online residence permit application on the e-İkamet system."
      },
      {
        "step": "06",
        "title": "Directorate Appointment",
        "desc": "Attend provincial Göç İdaresi appointment and collect İkamet card."
      }
    ],
    "costOfStudy": {
      "tuition": "$1,000–$6,000 / year (Public: $1k–$3k · Private: $5k–$15k · Medicine: $12k–$25k)",
      "livingExpenses": "$350–$750 / month (Ankara/Izmir: $350–$500 · Istanbul: $500–$750)",
      "healthInsurance": "$100–$250 / year (General Health Insurance - GSS or private policy)",
      "visaApplication": "$80–$120 Student Visa fee (+ İkamet card card fee ~TRY 565)",
      "proofOfFunds": "$4,000–$6,000 / year bank solvency proof (or Türkiye Bursları award)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 24 hours per week permitted for postgraduate Master’s and PhD students.",
        "Undergraduate students can work after completing their first academic year of study.",
        "Requires employer to apply for official work permit through the ministry."
      ],
      "postStudyWork": [
        "One-year short-term residence permit available for university graduates to seek employment.",
        "Converts to standard Turquoise Card or Work Permit upon securing corporate contract.",
        "Growing international career demand across tech, logistics, and foreign trade sectors."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled / Legalized Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certificate of Equivalence",
          "status": "Denklik Belgesi) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Acceptance Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Bank Financial Solvency",
          "status": "$5,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Student Accommodation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "General Health Insurance or Private Medical Cover",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "e-İkamet Residence Permit Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at METU, Boğaziçi, Koç, Bilkent, and Sabancı",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Türkiye Bursları",
        "desc": "Apply for government scholarship on official portal",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Direct",
        "desc": "Submit online applications directly to university international offices",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Acceptance & Deposit",
        "desc": "Accept offer and transfer initial seat reservation deposit",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Embassy Student Visa",
        "desc": "Submit student visa dossier at Turkish Embassy / VFS",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Travel & Matriculation",
        "desc": "Fly to Turkey, register on campus, and get Öğrenci Belgesi",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "e-İkamet Appointment",
        "desc": "Submit e-İkamet online and complete Göç İdaresi biometrics",
        "time": "Week 1–2 on arrival"
      }
    ],
    "goodToKnow": [
      "Türkiye Bursları covers 100% tuition, monthly allowance, housing, and health insurance.",
      "Certificate of Equivalence (Denklik) from the Ministry of Education is mandatory.",
      "Public student dormitories (KYK) provide very affordable subsidized accommodation.",
      "The e-İkamet residence permit application must be filed within 30 days of arrival."
    ],
    "lastVerified": "September 2026",
    "source": "Presidency for Turks Abroad (YTB) & Presidency of Migration Management (Göç İdaresi)"
  },
  "cyprus": {
    "slug": "cyprus",
    "countryName": "Cyprus",
    "heroDescription": "Study in a sunny Mediterranean education hub with affordable European degrees, 100% English programs, and high visa approval rates.",
    "heroImage": "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Cyprus edition",
    "heroFacts": {
      "tuition": "€3,000–€8,000 / yr",
      "livingCost": "€500–€950 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 70+",
      "studentVisa": "Entry Visa / Student Permit (CRMD)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Fully English-taught European curriculum degrees accredited across the EU."
      },
      {
        "num": "02",
        "text": "Highly affordable tuition rates and Mediterranean student living expenses."
      },
      {
        "num": "03",
        "text": "Safe, peaceful island nation with warm weather and scenic coastal environment."
      },
      {
        "num": "04",
        "text": "Streamlined visa processing with high issuance rates for international candidates."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Student Visa / Temporary Residence Permit (Pink Slip)",
      "majorIntakes": "Fall (September/October - Primary) · Spring (February)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Hospitality & Tourism · Computer Science · Business Administration · Civil Engineering · Nursing & Medicine"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "50%–60%+ (approx. GPA 2.3+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL 70–80+ / University English placement test",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with attested document dossier",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (September - Application: May to August)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5+ / TOEFL 70+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Internal English Placement",
        "score": "Free English exam conducted upon arrival by university",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "Health Screening Exam",
        "score": "Mandatory HIV, Hepatitis B/C, and chest X-ray screening",
        "validity": "3 months",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive conditional offer and pay initial tuition fee deposit."
      },
      {
        "step": "02",
        "title": "Document Attestation",
        "desc": "Attest academic certificates, police clearance, and medical check."
      },
      {
        "step": "03",
        "title": "Migration Filing",
        "desc": "University submits visa dossier to Civil Registry and Migration Department."
      },
      {
        "step": "04",
        "title": "Entry Visa Issuance",
        "desc": "Receive official Cyprus Entry Visa authorization letter."
      },
      {
        "step": "05",
        "title": "Travel to Cyprus",
        "desc": "Enter Cyprus through Larnaca or Paphos international airports."
      },
      {
        "step": "06",
        "title": "Pink Slip Registration",
        "desc": "Complete local medical exam and apply for Temporary Residence Permit."
      }
    ],
    "costOfStudy": {
      "tuition": "€3,000–€8,000 / year (Standard: €3k–€5.5k · STEM/Biz: €5.5k–€8k · Medicine: €15k–€20k)",
      "livingExpenses": "€500–€950 / month (Nicosia/Famagusta: €500–€700 · Limassol: €750–€950)",
      "healthInsurance": "€150–€250 / year (Mandatory private student health insurance policy)",
      "visaApplication": "€60 Student Entry Visa fee (+ €70 Pink Slip residence permit fee)",
      "proofOfFunds": "€4,000–€7,000 / year bank solvency statement in student/sponsor name"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during semesters (after six months of initial study).",
        "Permitted in designated sectors: food delivery, restaurants, retail, and tourism.",
        "Requires signing an approved student employment contract registered with the ministry."
      ],
      "postStudyWork": [
        "60-day post-study residence extension to search for corporate employment.",
        "Converts to standard Third-Country National Work Permit upon securing sponsorship.",
        "Strong hiring demand in international shipping, corporate services, and FinTech."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested High School / Bachelor Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Certificate or Test Result",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Attested Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested Blood and Chest X-Ray Medical Reports",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Passport-Sized Photographs",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Civil Registry Migration Entry Visa Approval",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First Semester Tuition Fee Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested Bank Financial Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Student Medical Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Rental Agreement or University Dormitory Proof",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "University Selection",
        "desc": "Research programs at University of Cyprus, UNIC, and CUT",
        "time": "6–9 months before"
      },
      {
        "step": "02",
        "title": "Document Attestation",
        "desc": "Complete ministry attestations on police clearance and medicals",
        "time": "4–6 months before"
      },
      {
        "step": "03",
        "title": "Application Submissions",
        "desc": "Submit online applications with attested academic dossier",
        "time": "3–5 months before"
      },
      {
        "step": "04",
        "title": "Offer & Tuition Deposit",
        "desc": "Accept offer and transfer first semester tuition payment",
        "time": "2–3 months before"
      },
      {
        "step": "05",
        "title": "Migration Processing",
        "desc": "Civil Registry and Migration Department processes student entry visa",
        "time": "1–2 months before"
      },
      {
        "step": "06",
        "title": "Travel & Airport Arrival",
        "desc": "Fly to Cyprus and present entry visa approval at border",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "Pink Slip & Medicals",
        "desc": "Complete post-arrival blood test and collect Pink Slip",
        "time": "Week 1–2 on arrival"
      }
    ],
    "goodToKnow": [
      "University of Nicosia (UNIC) is a global pioneer in blockchain and digital currency degrees.",
      "Document attestations by the Ministry of Foreign Affairs and Embassy are mandatory.",
      "Part-time work authorization becomes active after six months of continuous residence.",
      "Cyprus is an EU member state offering high European educational standards."
    ],
    "lastVerified": "September 2026",
    "source": "Civil Registry and Migration Department (CRMD) & Study in Cyprus"
  },
  "lithuania": {
    "slug": "lithuania",
    "countryName": "Lithuania",
    "heroDescription": "Study in the Baltic FinTech and laser tech capital with affordable European tuition, 100% English degrees, and Schengen access.",
    "heroImage": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Lithuania edition",
    "heroFacts": {
      "tuition": "€2,500–€6,500 / yr",
      "livingCost": "€450–€850 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 72+",
      "studentVisa": "National Visa D / Temporary Residence (TRP)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Baltic financial technology and laser innovation leader with expanding global startups."
      },
      {
        "num": "02",
        "text": "Prestigious historic universities (Vilnius University founded 1579, VILNIUS TECH, KTU)."
      },
      {
        "num": "03",
        "text": "Highly affordable tuition rates and cost-effective modern European student living."
      },
      {
        "num": "04",
        "text": "12-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa D / Temporary Residence Permit (MIGRIS)",
      "majorIntakes": "Autumn (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "FinTech & Software Engineering · Laser Physics · Cyber Security · International Business · Biotechnology"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (SKVC)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL iBT 72–80+ / Duolingo 100+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal + SKVC academic recognition",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Dec to June 1)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5+ / TOEFL 72+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Duolingo English Test",
        "score": "100–115+ score accepted by KTU and VILNIUS TECH",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "SKVC Academic Recognition",
        "score": "Center for Quality Assessment in Higher Education",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "University Motivation Interview",
        "score": "Conducted online via Zoom/Teams with faculty professors",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter and mediation letter number."
      },
      {
        "step": "02",
        "title": "SKVC Recognition",
        "desc": "Complete academic credential recognition through university or SKVC."
      },
      {
        "step": "03",
        "title": "MIGRIS Application",
        "desc": "Submit online Temporary Residence Permit (TRP) application on MIGRIS."
      },
      {
        "step": "04",
        "title": "VFS Appointment",
        "desc": "Attend VFS appointment to submit physical biometric data and passport."
      },
      {
        "step": "05",
        "title": "TRP Approval",
        "desc": "Migration Department (MIGRIS) evaluates and approves residence permit."
      },
      {
        "step": "06",
        "title": "Travel & Collect Card",
        "desc": "Travel to Lithuania and collect physical TRP card from migration."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,500–€6,500 / year (Humanities: €2.5k–€3.5k · STEM/Biz: €3.5k–€6.5k · Medicine: €10k–€13k)",
      "livingExpenses": "€450–€850 / month (Kaunas/Klaipeda: €450–€650 · Vilnius: €600–€850)",
      "healthInsurance": "€150–€300 / year (Mandatory international student health insurance policy)",
      "visaApplication": "€160 MIGRIS Temporary Residence Permit application fee",
      "proofOfFunds": "€4,440 / year (€370/month) living funds + return travel balance"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during semesters for Bachelor’s degree students.",
        "Up to 40 hours per week (full-time) permitted for Master’s and PhD students.",
        "No separate work permit required for students holding a valid Lithuanian TRP."
      ],
      "postStudyWork": [
        "12-month post-study residence permit for university graduates seeking jobs.",
        "Unrestricted employment permitted with any local or multinational employer.",
        "Direct switch to standard EU Blue Card or Temporary Residence for Employment."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled / Legalized Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "SKVC Academic Equivalence Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "University Electronic Mediation Letter Number",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "MIGRIS Online Application Summary Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "€4,440+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Recognized Health Insurance Policy",
          "status": "€30,000+) (Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at Vilnius University, VILNIUS TECH, and KTU",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language Testing",
        "desc": "Complete IELTS, TOEFL, or Duolingo English Test",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Submit online applications with legalized transcripts before June 1",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & Mediation",
        "desc": "Receive formal offer and university mediation letter code",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "MIGRIS Online Filing",
        "desc": "Complete TRP application on MIGRIS and book VFS appointment",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Migration Decision",
        "desc": "Migration Department approves TRP within four to six weeks",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & TRP Collection",
        "desc": "Arrive in Lithuania, collect TRP card, and attend orientation",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Master’s and PhD students in Lithuania are allowed to work full-time (40 hours/week).",
      "MIGRIS processes Temporary Residence Permits directly before departure via VFS.",
      "Duolingo English Test is widely accepted across top Lithuanian technical universities.",
      "Lithuania has one of Europe’s fastest-growing FinTech and startup ecosystems."
    ],
    "lastVerified": "September 2026",
    "source": "Migration Department under the Ministry of the Interior (MIGRIS) & Study in Lithuania"
  },
  "latvia": {
    "slug": "latvia",
    "countryName": "Latvia",
    "heroDescription": "Study in northern Europe with low tuition fees, affordable student living, English-medium programs, and a 9-month stay-back visa.",
    "heroImage": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Latvia edition",
    "heroFacts": {
      "tuition": "€2,000–€5,500 / yr",
      "livingCost": "€450–€800 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 70+",
      "studentVisa": "Long-Stay Visa D / Residence Permit (PMLP)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Leading institutions (University of Latvia, Riga Technical University, RTU)."
      },
      {
        "num": "02",
        "text": "Among the most affordable tuition fees and living expenses in the EU."
      },
      {
        "num": "03",
        "text": "Full Schengen travel privileges across 27 European countries throughout study."
      },
      {
        "num": "04",
        "text": "Nine-month post-study temporary residence permit for career job seeking."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Long-Stay Visa (Type D) / Temporary Residence Permit (PMLP)",
      "majorIntakes": "Autumn (September - Primary) · Spring (February)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Aviation Engineering · Computer Science & IT · Telecommunications · International Business · Medicine & Dentistry"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (AIC)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.4+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL iBT 70–80+ / Duolingo 100+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal + AIC academic credential verification",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Jan to June 15)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5+ / TOEFL 70+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Duolingo Test / MOI",
        "score": "Accepted by select universities with internal interview",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "AIC Credential Verification",
        "score": "Academic Information Centre credential evaluation",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "University Entrance Math Exam",
        "score": "Online mathematics examination for engineering/IT programs",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Pass online entrance exams and receive conditional admission offer."
      },
      {
        "step": "02",
        "title": "AIC Verification",
        "desc": "Academic Information Centre (AIC) completes credential verification."
      },
      {
        "step": "03",
        "title": "Tuition & Security",
        "desc": "Pay first-year tuition fee and refundable security deposit."
      },
      {
        "step": "04",
        "title": "University Inviting",
        "desc": "University registers formal invitation code with PMLP immigration."
      },
      {
        "step": "05",
        "title": "Visa Dossier",
        "desc": "Submit National Visa Type D application at Latvian Embassy/VFS."
      },
      {
        "step": "06",
        "title": "Travel & Residence",
        "desc": "Collect stamped Visa D, fly to Riga, and collect residence card."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,000–€5,500 / year (Standard: €2k–€4k · Tech/Aviation: €4k–€6.5k · Medicine: €10k–€13k)",
      "livingExpenses": "€450–€800 / month (Jelgava/Liepaja: €450–€600 · Riga: €550–€800)",
      "healthInsurance": "€120–€250 / year (Mandatory international student health insurance policy)",
      "visaApplication": "€60 National Visa (D) fee (+ PMLP residence permit fee ~€100)",
      "proofOfFunds": "€7,440 / year (€620/month) living funds in personal bank account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular academic study semesters.",
        "Up to 40 hours per week (full-time) permitted for Master’s and PhD degree students.",
        "No separate work permit required for students holding a valid residence permit."
      ],
      "postStudyWork": [
        "Nine-month temporary residence permit for university graduates seeking employment.",
        "Unrestricted job search rights across technology, logistics, and business hubs.",
        "Direct transition to standard Latvian EU Blue Card or Work Residence Permit."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "AIC Equivalence Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Invitation Letter Number",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition & Security Deposit Receipts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statement with Solvency",
          "status": "€7,440+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled / Legalized Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Recognized Health Insurance Policy",
          "status": "€42,600+) (Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Research",
        "desc": "Shortlist programs at University of Latvia, RTU, and TSI",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Exams & AIC",
        "desc": "Complete language exams and submit transcripts for AIC verification",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Portals",
        "desc": "Submit online applications and complete math entrance exams",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Deposit & Invitation",
        "desc": "Transfer tuition deposit; university registers PMLP invitation code",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Embassy Filing",
        "desc": "Submit National Visa Type D dossier at Latvian Embassy / VFS",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Issuance",
        "desc": "Receive approved National Visa D sticker in passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & PMLP",
        "desc": "Fly to Latvia, matriculate at university, and collect residence card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Academic Information Centre (AIC) verification takes approximately two to four weeks.",
      "Master’s degree students in Latvia are legally entitled to work up to 40 hours/week.",
      "Riga Technical University offers world-renowned aviation and robotics engineering labs.",
      "Most universities require a refundable security deposit of approx. €500–€1,000."
    ],
    "lastVerified": "September 2026",
    "source": "Office of Citizenship and Migration Affairs (PMLP) & Study in Latvia"
  },
  "estonia": {
    "slug": "estonia",
    "countryName": "Estonia",
    "heroDescription": "Study in the world’s most digitally advanced society with top-ranked universities, e-Residency infrastructure, and a 9-month stay-back visa.",
    "heroImage": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Estonia edition",
    "heroFacts": {
      "tuition": "€3,000–€8,000 / yr",
      "livingCost": "€500–€950 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Temporary Residence Permit for Study (TRP)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "World’s most advanced digital society (birthplace of Skype, Bolt, Wise)."
      },
      {
        "num": "02",
        "text": "Top institutions (University of Tartu ranked top 1% globally, TalTech)."
      },
      {
        "num": "03",
        "text": "Nine-month post-study residence permit for university graduates seeking employment."
      },
      {
        "num": "04",
        "text": "Unrestricted working hours during studies as long as academic progress is maintained."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Temporary Residence Permit for Study (TRP) / Visa D",
      "majorIntakes": "Autumn (August/September - Primary Intake)",
      "popularLevels": "Bachelor · Master of Science · Doctoral (PhD)",
      "popularFields": "Cyber Security · Software Engineering · E-Governance Technologies · Clean Energy · International Business"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (ENIC/NARIC)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%–65%+ (approx. GPA 2.8+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ (min 5.5) or TOEFL iBT 75–85+ / PTE 58+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "DreamApply national unified admissions portal (estonia.dreamapply.com)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: Jan 2 to March 15/April 15)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.0–6.5 overall (min 5.5 each band)",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "75–85 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "58 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "University Motivation Video / Interview",
        "score": "Recorded video essay or live Zoom interview",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "DreamApply Admission",
        "desc": "Receive formal admission offer on DreamApply and pay tuition invoice."
      },
      {
        "step": "02",
        "title": "Confirm Enrollment",
        "desc": "University issues official admission certificate and confirmation."
      },
      {
        "step": "03",
        "title": "TRP Application",
        "desc": "Submit Temporary Residence Permit (TRP) application at Estonian Embassy."
      },
      {
        "step": "04",
        "title": "Biometrics & Interview",
        "desc": "Attend embassy interview and complete biometric fingerprint recording."
      },
      {
        "step": "05",
        "title": "TRP Approval",
        "desc": "Police and Border Guard Board (PBGB) evaluates and issues TRP card."
      },
      {
        "step": "06",
        "title": "Travel & Isikukood",
        "desc": "Arrive in Estonia, register residence, and activate e-services."
      }
    ],
    "costOfStudy": {
      "tuition": "€3,000–€8,000 / year (Humanities: €3k–€4.5k · STEM/Tech: €5k–€8k · Medicine: €13k–€15k)",
      "livingExpenses": "€500–€950 / month (Tartu: €500–€700 · Tallinn: €650–€950)",
      "healthInsurance": "€150–€300 / year (Private student health insurance - Swisscare, ERGO, or IF)",
      "visaApplication": "€100 Visa D fee / €100 TRP application fee at Embassy",
      "proofOfFunds": "€3,600 / year (€300/month) living funds in personal bank account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "No statutory restriction on weekly working hours for international students.",
        "Students must maintain full-time academic progress and pass all required credits.",
        "High student hiring demand across booming software, tech support, and startup hubs."
      ],
      "postStudyWork": [
        "Nine-month post-study residence permit for graduates to seek qualified employment.",
        "Can launch startups through the streamlined Estonian Startup Visa committee.",
        "Direct conversion to standard Temporary Residence Permit for Employment."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "DreamApply Official Application Summary",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Motivation / Video Essay",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Fee Payment Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statement in Student’s Name",
          "status": "€3,600+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Recognized Comprehensive Health Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Police and Border Guard Board TRP Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Course Search",
        "desc": "Explore programs on DreamApply for Tartu, TalTech, and Tallinn Univ",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL and record motivation video essays",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "DreamApply Submission",
        "desc": "Submit applications before March 15 / April 15 deadlines",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Tuition",
        "desc": "Receive admission offer and pay first-year tuition fee invoice",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Embassy TRP Filing",
        "desc": "Submit TRP application and attend interview at Estonian Embassy",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "PBGB Decision",
        "desc": "Police and Border Guard Board approves TRP and issues identity card",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Digital ID",
        "desc": "Fly to Estonia, receive digital ID card (Isikukood), and matriculate",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "All non-EU applications are handled through the unified DreamApply portal.",
      "Estonia imposes no legal limit on student working hours during study.",
      "Students receive a digital identity code (Isikukood) for seamless e-governance.",
      "University of Tartu ranks in the global top 1% across numerous research fields."
    ],
    "lastVerified": "September 2026",
    "source": "Police and Border Guard Board (PBGB) & Study in Estonia"
  },
  "greece": {
    "slug": "greece",
    "countryName": "Greece",
    "heroDescription": "Study in the cradle of Western philosophy with affordable public university degrees, Mediterranean lifestyle, and full Schengen mobility.",
    "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Greece edition",
    "heroFacts": {
      "tuition": "€1,500–€7,000 / yr",
      "livingCost": "€500–€950 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 78+",
      "studentVisa": "National Visa Type D (Study)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Historic universities (National and Kapodistrian University of Athens, Aristotle)."
      },
      {
        "num": "02",
        "text": "Among the most affordable cost of living and tuition rates in the Mediterranean."
      },
      {
        "num": "03",
        "text": "Full Schengen travel privileges across 27 European nations throughout studies."
      },
      {
        "num": "04",
        "text": "Expanding catalog of innovative English-taught undergraduate and Master’s degrees."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa Type D (Study / Higher Education)",
      "majorIntakes": "Autumn (September/October - Primary Intake)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Archaeology & Classics · Shipping & Maritime Management · Computer Science · Environmental Sciences · Tourism Management"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (DOATAP)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 78–85+ / PTE 58+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal or Ministry of Education international platform",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (September - Application: March to June/July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 78+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Greek Language Exam",
        "score": "B2 certificate (only for Greek-medium degree tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "DOATAP Recognition",
        "score": "Hellenic National Academic Recognition Information Center",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Online academic motivation interview for selective Master’s",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal Certificate of Admission and tuition fee invoice."
      },
      {
        "step": "02",
        "title": "Tuition Payment",
        "desc": "Transfer required tuition fee directly to the university account."
      },
      {
        "step": "03",
        "title": "Criminal & Medical",
        "desc": "Obtain apostilled police clearance certificate and medical fitness report."
      },
      {
        "step": "04",
        "title": "Consular Filing",
        "desc": "Submit National Visa Type D dossier at Greek Embassy or Global Visa Center."
      },
      {
        "step": "05",
        "title": "Visa D Collection",
        "desc": "Receive stamped National Visa Type D sticker in passport."
      },
      {
        "step": "06",
        "title": "Residence Permit",
        "desc": "Arrive in Greece and apply for Student Residence Permit at immigration."
      }
    ],
    "costOfStudy": {
      "tuition": "€1,500–€7,000 / year (Standard: €1.5k–€3.5k · STEM/Biz: €3.5k–€7k · Medicine: €12k–€15k)",
      "livingExpenses": "€500–€950 / month (Patras/Crete: €500–€650 · Athens/Thessaloniki: €650–€950)",
      "healthInsurance": "€150–€300 / year (Private student health insurance or state health registration)",
      "visaApplication": "€90 National Visa Type D fee (+ consular/VFS service charge)",
      "proofOfFunds": "€4,800 / year (€400/month) living funds in personal bank account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular academic semesters for degree students.",
        "Full-time work permitted during scheduled summer and official university breaks.",
        "High student hiring demand across tourism, hospitality, and customer service."
      ],
      "postStudyWork": [
        "Post-study residence permit available for university graduates seeking employment.",
        "Converts directly to standard Greek Residence Permit for Highly Qualified Workers.",
        "Growing international opportunities in maritime trade, logistics, and renewable energy."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Letters of Academic Recommendation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Certificate of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Fee Payment Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "€4,800+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Recognized Comprehensive Health Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research English-taught programs at NKUA, Aristotle, and AUEB",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language Testing",
        "desc": "Complete IELTS or TOEFL examination to meet score criteria",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Submit online applications with legalized documents before June",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & Tuition",
        "desc": "Accept admission offer and pay first-year tuition fee instalment",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Consular Dossier",
        "desc": "Complete police clearance, medical checks, and submit at Greek Embassy",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa D Collection",
        "desc": "Receive approved National Visa D sticker in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Residence",
        "desc": "Fly to Greece, enroll at university, and apply for Residence Permit",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Greece has launched numerous world-class 100% English-taught Bachelor and Master degrees.",
      "All official foreign documents require Hague Apostille and certified Greek translation.",
      "The National Visa Type D allows free travel throughout all 27 Schengen countries.",
      "Greek public transport offers 50% discount cards for all registered university students."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of Foreign Affairs (MFA Greece) & Study in Greece"
  },
  "malta": {
    "slug": "malta",
    "countryName": "Malta",
    "heroDescription": "Study in Europe’s only native English-speaking Mediterranean archipelago with historic universities, low costs, and strong tech/iGaming hubs.",
    "heroImage": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Malta edition",
    "heroFacts": {
      "tuition": "€5,000–€11,000 / yr",
      "livingCost": "€650–€1,100 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "National Visa D / e-Residence (Identità)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Official English-speaking EU country with 100% English-medium education."
      },
      {
        "num": "02",
        "text": "Historic University of Malta (founded 1592) with globally recognized curriculum."
      },
      {
        "num": "03",
        "text": "Global hub for iGaming, blockchain, financial services, and aviation maintenance."
      },
      {
        "num": "04",
        "text": "Nine-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa Type D / e-Residence Permit (Identità)",
      "majorIntakes": "October (Primary Fall Intake) · February (Spring)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "iGaming & Game Development · Software Engineering · Financial Services · Aviation Management · Marine Biology"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or British 2:2 equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80–90+ / Cambridge English",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with credential evaluation",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "October Intake (Application: March to June/July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Cambridge English",
        "score": "C1 Advanced / B2 First score",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "English MOI Letter",
        "score": "Accepted for students with prior degree taught entirely in English",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Online academic interview for specialized degrees",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Formal Admission",
        "desc": "Receive official unconditional acceptance letter from Maltese institution."
      },
      {
        "step": "02",
        "title": "Tuition Payment",
        "desc": "Transfer first-year tuition fee directly to the university trust account."
      },
      {
        "step": "03",
        "title": "Visa Application",
        "desc": "Submit National Visa Type D application at Maltese Embassy or VFS."
      },
      {
        "step": "04",
        "title": "Visa D Issuance",
        "desc": "Receive National Visa Type D entry vignette in passport."
      },
      {
        "step": "05",
        "title": "Travel to Malta",
        "desc": "Fly to Malta and complete on-campus university matriculation."
      },
      {
        "step": "06",
        "title": "Identità Permit",
        "desc": "Apply for e-Residence card at Identità agency within 90 days."
      }
    ],
    "costOfStudy": {
      "tuition": "€5,000–€11,000 / year (Arts/Biz: €5k–€7.5k · STEM/Tech: €7.5k–€11k · Medicine: €22k–€26k)",
      "livingExpenses": "€650–€1,100 / month (Msida/Gzira: €650–€850 · Sliema/St. Julian’s: €850–€1.1k)",
      "healthInsurance": "€150–€300 / year (Mandatory international student comprehensive health cover)",
      "visaApplication": "€100 National Visa (Type D) application fee",
      "proofOfFunds": "€75% of national minimum wage (~€750/month) living solvency proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during academic semesters (after 90 days of study).",
        "Requires obtaining an Employment Licence from Jobsplus with employer sponsorship.",
        "High student hiring demand across iGaming customer support, tourism, and IT."
      ],
      "postStudyWork": [
        "Nine-month post-study residence permit for graduates to seek qualified employment.",
        "Converts directly to Single Work Permit with Jobsplus upon securing employment.",
        "Key Employee Initiative (KEI) offers fast-track 5-day work permit processing."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Letters of Academic Recommendation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Letter of Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Fee Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statement Demonstrating Living Solvency",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Comprehensive Travel and Medical Insurance Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Accommodation in Malta",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at University of Malta and MCAST",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language Testing",
        "desc": "Complete IELTS/TOEFL or assemble English MOI documents",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Applications",
        "desc": "Submit online admissions dossiers before June deadline",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & Tuition",
        "desc": "Receive unconditional offer and pay first-year tuition fees",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Visa Submission",
        "desc": "Submit National Visa Type D file at Maltese Embassy / VFS",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Decision",
        "desc": "Receive approved National Visa D sticker in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Identità",
        "desc": "Fly to Malta, register on campus, and file for e-Residence card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "English is an official national language, so daily communication is 100% in English.",
      "Part-time work authorization through Jobsplus is available after 90 days of residence.",
      "Malta is Europe’s primary hub for the global iGaming and financial technology sectors.",
      "The Key Employee Initiative (KEI) provides expedited work permits for top tech graduates."
    ],
    "lastVerified": "September 2026",
    "source": "Identità (Identity Malta Agency) & University of Malta"
  },
  "romania": {
    "slug": "romania",
    "countryName": "Romania",
    "heroDescription": "Study in eastern Europe’s fastest growing IT hub with low tuition fees, affordable living, world-class medical programs, and Schengen access.",
    "heroImage": "https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Romania edition",
    "heroFacts": {
      "tuition": "€2,000–€5,000 / yr",
      "livingCost": "€400–€750 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 70+",
      "studentVisa": "Long-Stay Visa (Type D/SD - IGI)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Booming European IT, software engineering, and multinational tech center."
      },
      {
        "num": "02",
        "text": "Highly renowned medical, dental, and engineering programs taught in English."
      },
      {
        "num": "03",
        "text": "Among the most economical tuition fees and student living costs in the EU."
      },
      {
        "num": "04",
        "text": "Full Schengen mobility with access to 27 European countries during study."
      }
    ],
    "quickFacts": {
      "currency": "Romanian Leu (RON)",
      "visa": "Long-Stay Visa for Study (Type D/SD) / Residence Permit (IGI)",
      "majorIntakes": "Autumn (October - Primary Intake)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science & Software · General Medicine & Dentistry · Cyber Security · Civil Engineering · International Business"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (CNRED)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.4+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL iBT 70–80+ / English MOI letter",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal + Ministry of National Education Letter of Acceptance",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (October - Application: March to July/August)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5+ / TOEFL 70+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "English MOI Letter",
        "score": "Accepted for prior degrees conducted in English medium",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "CNRED Credential Verification",
        "score": "National Center for Recognition and Equivalence of Diplomas",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "University Entrance Assessment",
        "score": "File-based evaluation or online motivation interview",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Ministry Acceptance",
        "desc": "Receive official Letter of Acceptance from the Ministry of Education."
      },
      {
        "step": "02",
        "title": "Tuition Payment",
        "desc": "Transfer first-year tuition fee directly to the university account."
      },
      {
        "step": "03",
        "title": "eViza Application",
        "desc": "Submit online visa application on Romanian eViza portal (eviza.mae.ro)."
      },
      {
        "step": "04",
        "title": "Consular Appointment",
        "desc": "Attend consular interview and submit physical dossier at Embassy."
      },
      {
        "step": "05",
        "title": "Visa D Collection",
        "desc": "Receive stamped Long-Stay Visa (D/SD) sticker in passport."
      },
      {
        "step": "06",
        "title": "Permis de Ședere",
        "desc": "Travel to Romania and apply for Residence Permit at IGI office."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,000–€5,000 / year (General/STEM: €2k–€3.8k · Medicine/Dentistry: €6k–€8.5k)",
      "livingExpenses": "€400–€750 / month (Cluj/Timisoara: €400–€600 · Bucharest: €550–€750)",
      "healthInsurance": "€0–€150 / year (Free statutory health insurance for foreign students under 26)",
      "visaApplication": "€120 Long-Stay Student Visa (D/SD) application fee",
      "proofOfFunds": "Minimum national wage (~€500/month) living solvency proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week (4 hours per day) during regular study semesters.",
        "No separate work permit required for full-time registered university students.",
        "Strong hiring demand across IT support, software testing, and language centers."
      ],
      "postStudyWork": [
        "Post-study temporary residence extension available for university graduates seeking jobs.",
        "Converts directly to standard Single Work Permit (Permis Unic) upon hiring.",
        "Thriving career opportunities in software development, automotive tech, and BPO."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Birth Certificate with Legalized Translation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Medical Fitness Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate or MOI",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Ministry of Education Official Letter of Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Fee Payment Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "€3,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled / Legalized Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Accommodation",
          "status": "Dormitory or Lease) (Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at Univ of Bucharest, UPB, UBB Cluj, and UMF",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Transcripts Legalization",
        "desc": "Complete diplomatic legalization and translations of documents",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "Ministry Applications",
        "desc": "Submit dossiers for Ministry Letter of Acceptance before July",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Acceptance & Tuition",
        "desc": "Receive Ministry Letter of Acceptance and pay first-year tuition",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "eViza Online Portal",
        "desc": "Submit online visa application on eViza and book embassy interview",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa D Collection",
        "desc": "Receive approved Long-Stay Visa D/SD sticker in passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & IGI Permit",
        "desc": "Fly to Romania, matriculate, and file for Permis de Ședere at IGI",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "International students under age 26 receive 100% free Romanian state healthcare.",
      "The official Ministry of Education Letter of Acceptance is mandatory for visa filing.",
      "Part-time student work of up to 4 hours/day does not require a separate work permit.",
      "Cluj-Napoca and Bucharest are among the fastest growing tech hubs in Eastern Europe."
    ],
    "lastVerified": "September 2026",
    "source": "General Inspectorate for Immigration (IGI) & Ministry of National Education"
  },
  "croatia": {
    "slug": "croatia",
    "countryName": "Croatia",
    "heroDescription": "Study in one of Europe’s safest Mediterranean nations with affordable university tuition, English-taught programs, and Schengen mobility.",
    "heroImage": "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Croatia edition",
    "heroFacts": {
      "tuition": "€2,000–€6,000 / yr",
      "livingCost": "€500–€900 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Temporary Residence for Study (MUP)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top research institutions including University of Zagreb and University of Split."
      },
      {
        "num": "02",
        "text": "Full member of the Eurozone and Schengen Area with seamless European mobility."
      },
      {
        "num": "03",
        "text": "Exceptional Mediterranean safety, clean environment, and coastal quality of life."
      },
      {
        "num": "04",
        "text": "Flexible student employment rights through the official Student Service center."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "National Visa (Type D) / Temporary Residence (MUP)",
      "majorIntakes": "Autumn (October - Primary Intake)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer Science · General Medicine · Naval Architecture · Tourism Management · International Business"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (AZVO)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75–80+ / PTE 55+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal + Agency for Science and Higher Education (AZVO)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (October - Application: March to June/July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "AZVO Recognition",
        "score": "Agency for Science and Higher Education credential evaluation",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "University Entrance Exam",
        "score": "Online entrance examination for engineering or medicine",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Motivation Interview",
        "score": "Online video interview conducted by faculty admissions board",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal Letter of Acceptance and pay seat reservation deposit."
      },
      {
        "step": "02",
        "title": "Police Clearance",
        "desc": "Obtain criminal record certificate with Hague Apostille legalization."
      },
      {
        "step": "03",
        "title": "Financial Solvency",
        "desc": "Demonstrate €4,000 annual living funds in personal bank account."
      },
      {
        "step": "04",
        "title": "Embassy Visa Filing",
        "desc": "Submit Temporary Residence and Visa D dossier at Croatian Embassy/VFS."
      },
      {
        "step": "05",
        "title": "Visa D Approval",
        "desc": "Receive approved National Visa D sticker in international passport."
      },
      {
        "step": "06",
        "title": "OIB & Biometrics",
        "desc": "Arrive in Croatia, obtain OIB tax number, and collect residence card."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,000–€6,000 / year (Humanities: €2k–€3.5k · STEM/Biz: €3.5k–€6k · Medicine: €10k–€12k)",
      "livingExpenses": "€500–€900 / month (Osijek/Rijeka: €500–€650 · Zagreb/Split: €650–€900)",
      "healthInsurance": "€60–€80 / month (Croatian Health Insurance Fund - HZZO student enrollment)",
      "visaApplication": "€93 Temporary Residence application fee (+ €60 entry Visa D)",
      "proofOfFunds": "€3,600–€5,000 / year living funds in personal bank account"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time student work permitted through the official university Student Centre (Studentski Centar).",
        "Student Service contracts (Studentski Ugovor) provide fair hourly wages and legal protection.",
        "Strong student hiring demand across tourism, tech startups, and customer support hubs."
      ],
      "postStudyWork": [
        "Post-study residence permit available for university graduates seeking employment.",
        "Converts directly to standard Residence and Work Permit (Dozvola za boravak i rad).",
        "Expanding job market in software development, digital marketing, and green technology."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "AZVO Credential Recognition Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Fee Payment Receipt",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Statement Demonstrating Living Solvency",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Criminal Record Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Accommodation in Croatia",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Selection",
        "desc": "Research programs at University of Zagreb, Split, and Rijeka",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language & AZVO",
        "desc": "Take IELTS/TOEFL and submit transcripts for AZVO recognition",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Portals",
        "desc": "Submit online applications before June deadlines",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & Deposit",
        "desc": "Accept offer and transfer initial seat reservation deposit",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Embassy Filing",
        "desc": "Submit Temporary Residence application at Croatian Embassy / VFS",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa D Issuance",
        "desc": "Receive approved National Visa D sticker in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Police",
        "desc": "Arrive in Croatia, register with police (MUP), and collect residence card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Croatia is a full Eurozone and Schengen member with zero border controls to western Europe.",
      "Student work is legally administered through the university Studentski Centar.",
      "Foreign documents require Hague Apostille and official translation into Croatian.",
      "Foreign students can enroll in the comprehensive public HZZO health insurance system."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of the Interior of the Republic of Croatia (MUP) & Study in Croatia"
  },
  "slovenia": {
    "slug": "slovenia",
    "countryName": "Slovenia",
    "heroDescription": "Study in one of Europe’s greenest and safest nations with low tuition fees, top research universities, and subsidized student meal coupons.",
    "heroImage": "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Slovenia edition",
    "heroFacts": {
      "tuition": "€2,000–€5,000 / yr",
      "livingCost": "€450–€850 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Temporary Residence Permit for Study (Upravna Enota)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top research universities (University of Ljubljana founded 1919, Univ of Maribor)."
      },
      {
        "num": "02",
        "text": "Highly affordable tuition rates and unique government-subsidized student meal vouchers (Boni)."
      },
      {
        "num": "03",
        "text": "Ranked among the top ten safest and greenest nations in the world."
      },
      {
        "num": "04",
        "text": "Nine-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Temporary Residence Permit for Study (Entry Visa D)",
      "majorIntakes": "Autumn (October - Primary Intake)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Computer & Information Science · Mechanical Engineering · Environmental Sciences · Economics & Business · Pharmacy"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (ENIC/NARIC)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75–80+ / PTE 55+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "eVŠ national centralized application portal (portal.evs.gov.si)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (October - Application: Feb to April/June)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "eVŠ Credential Recognition",
        "score": "Centralized academic evaluation on the eVŠ portal",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "University Entrance Assessment",
        "score": "Test or interview for selective Master’s programs",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "Slovene Language Exam",
        "score": "B2 certificate (only for Slovene-taught degree tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "eVŠ Admission",
        "desc": "Receive official Decision on Admission via the national eVŠ portal."
      },
      {
        "step": "02",
        "title": "Tuition Payment",
        "desc": "Transfer first-year tuition fee directly to the university account."
      },
      {
        "step": "03",
        "title": "Residence Application",
        "desc": "Submit Temporary Residence Permit application at Slovenian Embassy."
      },
      {
        "step": "04",
        "title": "Biometrics & Police",
        "desc": "Attend embassy appointment to submit biometric data and police check."
      },
      {
        "step": "05",
        "title": "Visa D Collection",
        "desc": "Receive single-entry Visa D sticker once residence permit is approved."
      },
      {
        "step": "06",
        "title": "Upravna Enota Card",
        "desc": "Arrive in Slovenia and collect physical residence card at Upravna Enota."
      }
    ],
    "costOfStudy": {
      "tuition": "€2,000–€5,000 / year (Humanities: €2k–€3k · STEM/Biz: €3k–€5k · Medicine: €10k–€15k)",
      "livingExpenses": "€450–€850 / month (Maribor/Koper: €450–€600 · Ljubljana: €600–€850)",
      "healthInsurance": "€120–€250 / year (Private student health insurance or ZZZS voluntary cover)",
      "visaApplication": "€102 Temporary Residence Permit application fee (+ €50 Visa D)",
      "proofOfFunds": "€4,800 / year (€402/month) living funds in personal/sponsor bank"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time student work permitted through the official Student Work Agency (Študentski Servis).",
        "Referral forms (Napotnica) provide legal work contracts, tax benefits, and insurance.",
        "High student hiring demand across tech companies, research labs, and hospitality."
      ],
      "postStudyWork": [
        "Nine-month temporary residence permit for university graduates seeking employment.",
        "Converts directly to Single Residence and Work Permit (Enotno dovoljenje).",
        "Expanding job market across pharmaceutical, high-tech manufacturing, and IT."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Legalized Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "eVŠ Official Application Form Summary",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Decision on Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "First-Year Tuition Fee Payment Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "€4,800+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled / Legalized Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Recognized Health Insurance Policy",
          "status": "€30,000+) (Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs on eVŠ for University of Ljubljana and Maribor",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL and prepare legalized transcripts",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "eVŠ Central Submission",
        "desc": "Submit applications on the national eVŠ portal before April",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal Decision on Admission and pay tuition fee",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Embassy Residence Filing",
        "desc": "Submit residence permit dossier at Slovenian Embassy / VFS",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa D Collection",
        "desc": "Receive approved entry Visa D sticker in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Upravna Enota",
        "desc": "Fly to Slovenia, register address, and collect residence card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Slovenia provides heavily subsidized student meal vouchers (Študentski Boni) in restaurants nationwide.",
      "All higher education applications are submitted through the centralized eVŠ government portal.",
      "Student work is legally managed through Študentski Servis with favorable tax allowances.",
      "The University of Ljubljana is consistently ranked among the world’s top 500 universities."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of the Interior (MNZ Slovenia) & Study in Slovenia"
  },
  "south-africa": {
    "slug": "south-africa",
    "countryName": "South Africa",
    "heroDescription": "Study at Africa’s top-ranked research institutions with affordable tuition, English-medium education, and rich cultural biodiversity.",
    "heroImage": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · South Africa edition",
    "heroFacts": {
      "tuition": "ZAR 45k–110k / yr",
      "livingCost": "ZAR 7k–15k / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 80+",
      "studentVisa": "Study Visa (Section 13 - DHA)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Home to Africa’s highest-ranked universities (University of Cape Town, Wits, Stellenbosch)."
      },
      {
        "num": "02",
        "text": "100% English-medium teaching across all major university departments and laboratories."
      },
      {
        "num": "03",
        "text": "Highly affordable tuition rates and remarkably competitive international student living costs."
      },
      {
        "num": "04",
        "text": "Global research pioneer in astronomy, mining engineering, biodiversity, and global health."
      }
    ],
    "quickFacts": {
      "currency": "South African Rand (ZAR)",
      "visa": "Study Visa (Section 13 - Department of Home Affairs)",
      "majorIntakes": "Semester 1 (February - Primary Intake) · Semester 2 (July)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Mining Engineering · Global Health & Medicine · Environmental Sciences · Data Science · International Law"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (SAQA)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or Matriculation Exemption equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0–6.5+ or TOEFL iBT 80–90+ / English MOI letter",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal + SAQA credential evaluation",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Semester 1 (February - Application: April to September/October)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 80+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "SAQA Certificate of Evaluation",
        "score": "South African Qualifications Authority credential verification",
        "validity": "Lifetime",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Matriculation Exemption (USAF)",
        "score": "Universities South Africa exemption for undergraduate study",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "National Benchmark Tests (NBT)",
        "score": "Academic and quantitative placement test for undergraduate",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive unconditional admission offer and pay required tuition deposit."
      },
      {
        "step": "02",
        "title": "SAQA Verification",
        "desc": "Obtain official Certificate of Evaluation from SAQA authorities."
      },
      {
        "step": "03",
        "title": "Medical Clearance",
        "desc": "Complete standard radiological chest X-ray and medical fitness exam."
      },
      {
        "step": "04",
        "title": "Medical Aid Cover",
        "desc": "Purchase South African registered medical aid scheme health insurance."
      },
      {
        "step": "05",
        "title": "VFS Application",
        "desc": "Submit Study Visa dossier at South African Embassy or VFS."
      },
      {
        "step": "06",
        "title": "Visa Collection",
        "desc": "Receive approved Study Visa label in international passport."
      }
    ],
    "costOfStudy": {
      "tuition": "ZAR 45,000–110,000 / year (~$2,400–$5,800 USD · STEM/Medicine: ZAR 70k–140k)",
      "livingExpenses": "ZAR 7,000–15,000 / month (Stellenbosch/Pretoria: ZAR 7k–10k · Cape Town: ZAR 10k–15k)",
      "healthInsurance": "ZAR 4,000–7,000 / year (Registered SA medical scheme - Momentum or CompCare)",
      "visaApplication": "ZAR 425 Department of Home Affairs visa fee (+ VFS charge)",
      "proofOfFunds": "ZAR 36,000–50,000 living expenses proof + return repatriation guarantee"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular university academic terms.",
        "No separate work permit required if authorized on your Study Visa.",
        "On-campus tutor, student assistant, and research roles widely accessible."
      ],
      "postStudyWork": [
        "Critical Skills Work Visa available for eligible STEM and technical graduates.",
        "Direct pathway to General Work Visa upon securing employer job offer.",
        "High career demand across data analytics, mining engineering, and healthcare."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certified Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "SAQA Certificate of Evaluation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate or MOI",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of Provisional Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Financial Living Solvency",
          "status": "ZAR 36k+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "South African Registered Medical Aid Policy",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certified Radiological Chest X-Ray Report",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Police Clearance Certificate from Home Country",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at University of Cape Town, Wits, and Stellenbosch",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "SAQA Credential Application",
        "desc": "Submit transcripts to SAQA for official qualification evaluation",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply directly on university portals before September/October",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Offer & Medical Aid",
        "desc": "Accept offer, pay deposit, and enroll in registered SA Medical Aid",
        "time": "3–5 months before"
      },
      {
        "step": "05",
        "title": "Visa Dossier",
        "desc": "Complete police clearance and radiological report for VFS visa filing",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Study Visa Issuance",
        "desc": "Receive approved Study Visa label in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Orientation",
        "desc": "Fly to South Africa, settle into housing, and attend orientation",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Health insurance must be purchased from a Council for Medical Schemes registered provider.",
      "SAQA qualification evaluation is mandatory for all international degree holders.",
      "University of Cape Town (UCT) consistently ranks as the top university in Africa.",
      "Living costs in South Africa are significantly lower than in Western Europe or the US."
    ],
    "lastVerified": "September 2026",
    "source": "Department of Home Affairs (DHA South Africa) & Universities South Africa (USAf)"
  },
  "thailand": {
    "slug": "thailand",
    "countryName": "Thailand",
    "heroDescription": "Study in the heart of Southeast Asia with affordable international programs, tropical lifestyle, rich culture, and low living costs.",
    "heroImage": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Thailand edition",
    "heroFacts": {
      "tuition": "$2,500–$7,500 / yr",
      "livingCost": "$400–$850 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 70+",
      "studentVisa": "Non-Immigrant ED Visa"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top regional institutions (Chulalongkorn, Mahidol, Thammasat, AIT)."
      },
      {
        "num": "02",
        "text": "Highly economical tuition fees and remarkably affordable student living costs."
      },
      {
        "num": "03",
        "text": "International regional education and research hub in the center of ASEAN."
      },
      {
        "num": "04",
        "text": "Warm tropical climate, welcoming culture, and world-renowned street culinary heritage."
      }
    ],
    "quickFacts": {
      "currency": "Thai Baht (THB)",
      "visa": "Non-Immigrant Visa Category \"ED\" (Education)",
      "majorIntakes": "Semester 1 (August - Primary Intake) · Semester 2 (January)",
      "popularLevels": "Bachelor · Master’s Degree · Doctoral (PhD)",
      "popularFields": "International Business Management · Public Health & Tropical Medicine · Tourism & Hospitality · Computer Science · Environmental Engineering"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL iBT 70–80+ / University English test",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with credential verification",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Semester 1 (August - Application: Jan to May/June)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5+ / TOEFL 70+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "CU-TEP / TU-GET",
        "score": "Chulalongkorn/Thammasat internal English proficiency tests",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Interview",
        "score": "Online academic interview conducted by faculty admissions panel",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "Medical Health Check",
        "score": "Basic medical certificate confirming free of contagious diseases",
        "validity": "3 months",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Acceptance",
        "desc": "Receive official Letter of Acceptance and tuition payment invoice."
      },
      {
        "step": "02",
        "title": "MoHEST Approval",
        "desc": "University obtains educational certification from the Ministry of Higher Education."
      },
      {
        "step": "03",
        "title": "Royal Thai Embassy",
        "desc": "Submit Non-Immigrant ED Visa application at Thai Embassy/eVisa."
      },
      {
        "step": "04",
        "title": "Single Entry Visa",
        "desc": "Receive 90-day single-entry Non-Immigrant ED visa sticker."
      },
      {
        "step": "05",
        "title": "Enter Thailand",
        "desc": "Travel to Thailand and complete on-campus semester registration."
      },
      {
        "step": "06",
        "title": "Immigration Extension",
        "desc": "Extend ED visa annually at local Immigration Bureau."
      }
    ],
    "costOfStudy": {
      "tuition": "$2,500–$7,500 / year (Standard: $2.5k–$5k · STEM/Biz: $4.5k–$7.5k · Medicine: $12k–$18k)",
      "livingExpenses": "$400–$850 / month (Chiang Mai: $400–$600 · Bangkok: $550–$850)",
      "healthInsurance": "$150–$350 / year (Comprehensive student inpatient/outpatient medical cover)",
      "visaApplication": "$80 single-entry Non-Immigrant ED visa fee (+ THB 1,900 annual extension)",
      "proofOfFunds": "$2,000–$4,000 bank statement financial solvency proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time employment is generally restricted under the Non-Immigrant ED visa category.",
        "On-campus student assistantships and research fellowships are readily available.",
        "Internships integrated into academic degree curricula are fully permitted."
      ],
      "postStudyWork": [
        "Non-Immigrant B (Business) Visa available through sponsoring corporate employers.",
        "SMART Visa category offers multi-year work permits for tech and startup talent.",
        "Expanding multinational regional headquarters across Bangkok’s digital economy."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Certified Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Passport-Sized Photographs",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of Acceptance from Thai University",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Ministry of Higher Education Certification Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Financial Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Basic Medical Health Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Royal Thai Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research international degrees at Chulalongkorn, Mahidol, and AIT",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language Testing",
        "desc": "Complete IELTS/TOEFL or register for CU-TEP examination",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Applications",
        "desc": "Submit online admissions dossiers before May deadline",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & MoHEST",
        "desc": "Receive formal acceptance; university processes ministry clearance",
        "time": "2–3 months before"
      },
      {
        "step": "05",
        "title": "Embassy ED Visa",
        "desc": "Submit Non-Immigrant ED visa application on Thai eVisa portal",
        "time": "1–2 months before"
      },
      {
        "step": "06",
        "title": "Travel & Registration",
        "desc": "Fly to Thailand, matriculate at university, and find accommodation",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "90-Day Extension",
        "desc": "Report to Thai Immigration Bureau for initial 1-year visa extension",
        "time": "Month 2–3 on arrival"
      }
    ],
    "goodToKnow": [
      "Initial Non-Immigrant ED visas are granted for 90 days and extended annually in Thailand.",
      "Students must complete 90-day address reporting with the Thai Immigration Bureau.",
      "Asian Institute of Technology (AIT) is an acclaimed global post-graduate hub in Bangkok.",
      "Living expenses and food costs in Thailand are among the most economical in Asia."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of Higher Education, Science, Research and Innovation (MHESI) & Immigration Bureau"
  },
  "saudi-arabia": {
    "slug": "saudi-arabia",
    "countryName": "Saudi Arabia",
    "heroDescription": "Study at ultra-modern research universities with 100% fully funded scholarships, cutting-edge laboratories, and Vision 2030 growth.",
    "heroImage": "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Saudi Arabia edition",
    "heroFacts": {
      "tuition": "$0 (Fully Funded) / yr",
      "livingCost": "$0 (Stipend Provided) / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 85+",
      "studentVisa": "Saudi Educational Visa (Study in Saudi)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Fully funded government scholarships covering 100% tuition, free housing, and monthly stipends."
      },
      {
        "num": "02",
        "text": "World-ranked research powerhouses (KAUST, King Fahd Univ KFUPM, King Saud University)."
      },
      {
        "num": "03",
        "text": "Multibillion-dollar research facilities and vanguard innovation centers under Vision 2030."
      },
      {
        "num": "04",
        "text": "Simplified centralized international application portal (Study in Saudi platform)."
      }
    ],
    "quickFacts": {
      "currency": "Saudi Riyal (SAR)",
      "visa": "Educational Visa (Study in Saudi - Ministry of Foreign Affairs)",
      "majorIntakes": "Fall (August/September - Primary Intake) · Spring (January)",
      "popularLevels": "Bachelor · Master of Science · Doctoral (PhD)",
      "popularFields": "Petroleum & Chemical Engineering · Artificial Intelligence · Renewable Solar Energy · Material Science · Cyber Security"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "75%–80%+ (GPA 3.2–3.5+ / 4.0; top institutions highly selective)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (min 6.0) or TOEFL iBT 85–90+ / GRE recommended",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Unified \"Study in Saudi\" national portal (studyinsaudi.moe.gov.sa) or direct KAUST portal",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (September - Application: Oct to Jan/Feb)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 85+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE General",
        "score": "Quantitative 160+ recommended for KAUST and KFUPM",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Academic Video Interview",
        "score": "In-depth technical interview conducted with research faculty",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Comprehensive Medical Exam",
        "score": "Mandatory medical fitness certificate for visa endorsement",
        "validity": "3 months",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "Scholarship Admission",
        "desc": "Secure formal unconditional admission offer and full scholarship grant."
      },
      {
        "step": "02",
        "title": "Ministry Approval",
        "desc": "University obtains visa authorization number from Ministry of Foreign Affairs."
      },
      {
        "step": "03",
        "title": "Medical Clearance",
        "desc": "Complete authorized panel clinic medical exam and police clearance check."
      },
      {
        "step": "04",
        "title": "Enjaz / Tasheel Filing",
        "desc": "Submit educational visa dossier at Saudi Visa Center (VFS Tasheel)."
      },
      {
        "step": "05",
        "title": "Visa Stamping",
        "desc": "Receive stamped Educational Visa passport sticker."
      },
      {
        "step": "06",
        "title": "Iqama Issuance",
        "desc": "Arrive in Saudi Arabia and collect student residence card (Iqama)."
      }
    ],
    "costOfStudy": {
      "tuition": "$0 / year (100% fully covered by university government scholarship)",
      "livingExpenses": "$0 / month (Free on-campus housing + SAR 1,500–3,000 monthly stipend)",
      "healthInsurance": "$0 / year (100% free comprehensive on-campus medical care & insurance)",
      "visaApplication": "$0–$50 (Educational visa fees covered by university sponsorship)",
      "proofOfFunds": "$0 required (Full scholarship package covers living and travel)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time off-campus employment is restricted under standard educational visa regulations.",
        "On-campus research assistantships, lab work, and teaching fellowships are fully integrated.",
        "Substantial monthly student stipends (SAR 1,500–3,000+) cover all personal expenses."
      ],
      "postStudyWork": [
        "Saudi Premium Residency (Special Talent) pathway for outstanding graduates.",
        "Direct conversion to standard employer-sponsored Iqama work permit.",
        "Tremendous career growth across giga-projects (NEOM, Red Sea), tech, and energy."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested Degree Certificates and Full Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Research Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Three Academic Recommendation Letters",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "GRE General Test Score Report",
          "status": "Program Specific",
          "badgeVariant": "specific"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Ministry Scholarship Admission Letter",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Ministry of Foreign Affairs Visa Authorization Number",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Medical Examination Fitness Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested National Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Saudi Visa Application Summary",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at KAUST, KFUPM, and King Saud University",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Exams & GRE",
        "desc": "Complete IELTS/TOEFL and GRE General test for STEM degrees",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Portal Submissions",
        "desc": "Apply via Study in Saudi or direct KAUST portal before January",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Faculty Interviews",
        "desc": "Complete technical video interviews with prospective research supervisors",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Visa Authorization",
        "desc": "University secures MOFA visa approval and issues admission pack",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Tasheel Biometrics",
        "desc": "Submit visa application at VFS Tasheel / Saudi Embassy",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Iqama",
        "desc": "Fly to Saudi Arabia (free flight provided), settle in, and get Iqama",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Saudi university scholarships include 100% free tuition, free furnished housing, and annual flights.",
      "KAUST provides an annual living fellowship stipend of $20,000–$30,000 for graduate researchers.",
      "Vision 2030 is generating massive engineering and high-tech corporate career opportunities.",
      "The \"Study in Saudi\" platform enables applying to multiple public universities simultaneously."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of Education (Study in Saudi) & Ministry of Foreign Affairs (MOFA)"
  },
  "qatar": {
    "slug": "qatar",
    "countryName": "Qatar",
    "heroDescription": "Study at world-renowned US/European branch campuses in Education City with generous Qatar Foundation scholarships and high living standards.",
    "heroImage": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Qatar edition",
    "heroFacts": {
      "tuition": "$0–$45,000 / yr",
      "livingCost": "QAR 3,500–6,500 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 85+",
      "studentVisa": "Student Residence Permit (MOI Qatar)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Elite American branch campuses (Carnegie Mellon, Georgetown, Texas A&M, Northwestern)."
      },
      {
        "num": "02",
        "text": "Qatar Foundation interest-free loan scholarships covering 100% tuition and living."
      },
      {
        "num": "03",
        "text": "State-of-the-art Education City campus infrastructure with world-class facilities."
      },
      {
        "num": "04",
        "text": "Safe, ultra-modern cosmopolitan society with zero personal income tax."
      }
    ],
    "quickFacts": {
      "currency": "Qatari Riyal (QAR)",
      "visa": "Student Residence Permit (Ministry of Interior - MOI)",
      "majorIntakes": "Fall (August/September - Primary Intake) · Spring (January)",
      "popularLevels": "Bachelor of Science · Master’s Degree · Executive Master · Doctoral (PhD)",
      "popularFields": "Computer Science · Petroleum & Chemical Engineering · International Affairs · Journalism & Media · Business Administration"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "70%–75%+ (GPA 3.0–3.5+ / 4.0; Education City highly selective)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5–7.0+ or TOEFL iBT 85–100+ / SAT/ACT (UG)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university application portal (same standards as parent US/UK campuses)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (September - Application: Nov to Feb 1)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 85+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "SAT / ACT",
        "score": "Required for Education City undergraduate admissions (CMU-Q, GU-Q)",
        "validity": "5 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GRE / GMAT",
        "score": "Recommended for postgraduate degrees at Hamad Bin Khalifa University (HBKU)",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Academic Admissions Interview",
        "score": "Evaluative video interview conducted by parent campus admissions",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal unconditional admission offer from university."
      },
      {
        "step": "02",
        "title": "QF Financial Aid",
        "desc": "Apply for Qatar Foundation need-based loan or merit scholarship."
      },
      {
        "step": "03",
        "title": "University Visa Sponsorship",
        "desc": "University submits student entry permit application to MOI."
      },
      {
        "step": "04",
        "title": "Enter Qatar",
        "desc": "Fly to Doha using approved electronic student entry visa permit."
      },
      {
        "step": "05",
        "title": "Medical & Biometrics",
        "desc": "Complete blood test, chest X-ray, and fingerprint scanning in Doha."
      },
      {
        "step": "06",
        "title": "QID Card Collection",
        "desc": "Receive physical Qatar Identity Card (QID) from Ministry of Interior."
      }
    ],
    "costOfStudy": {
      "tuition": "$0–$45,000 / year (100% loan-covered via QF Financial Aid · HBKU: $0–$15k)",
      "livingExpenses": "QAR 3,500–6,500 / month (Education City housing: QAR 2k–3.5k · Private: QAR 4.5k–6.5k)",
      "healthInsurance": "QAR 100 / year (Hamad Medical Corporation - HMC government health card)",
      "visaApplication": "Covered by university sponsorship (+ QAR 500 annual QID issuance fee)",
      "proofOfFunds": "Covered via Qatar Foundation loan or sponsor bank solvency statement"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "On-campus student employment permitted across Education City universities.",
        "Students can work up to 20 hours per week during regular academic terms.",
        "Generous student hourly wages (approx. QAR 40–60+ per hour)."
      ],
      "postStudyWork": [
        "Qatar Foundation scholarship loans can be 100% forgiven by working in Qatar post-study.",
        "Direct transition to employer-sponsored Residence Permit upon securing employment.",
        "High-paying corporate career pathways in energy, technology, media, and finance."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Standardized Test Scores",
          "status": "SAT/ACT or GRE) (Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Statement of Academic Purpose and Essays",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Two to Three Academic Recommendation Letters",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Qatar Foundation Scholarship / Aid Award Letter",
          "status": "Program Specific",
          "badgeVariant": "specific"
        },
        {
          "name": "Medical Health Screening Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Attested National Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "University Visa Sponsorship Undertaking",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Campus Research",
        "desc": "Compare branch campuses (CMU-Q, Texas A&M, Georgetown, HBKU)",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Standardized Exams",
        "desc": "Complete SAT/ACT or GRE and IELTS/TOEFL test requirements",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "Application Submission",
        "desc": "Submit online applications before February 1 priority deadline",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & QF Aid",
        "desc": "Accept admission offer and complete Qatar Foundation aid agreement",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "Visa Sponsorship",
        "desc": "University initiates electronic student entry permit with MOI",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Travel & Medical",
        "desc": "Fly to Doha, complete medical screening check, and do biometrics",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "QID Card",
        "desc": "Receive physical QID card and settle into Education City residence",
        "time": "Week 1 on arrival"
      }
    ],
    "goodToKnow": [
      "Degrees awarded at Education City branch campuses are identical to parent US home campuses.",
      "Qatar Foundation Financial Aid offers 100% interest-free loans that can be forgiven through employment.",
      "Students access top-tier medical care via the Hamad Medical Corporation health card.",
      "Doha is one of the safest and most technologically modern student capitals in the world."
    ],
    "lastVerified": "September 2026",
    "source": "Qatar Foundation (QF) & Ministry of Interior (MOI Qatar)"
  },
  "luxembourg": {
    "slug": "luxembourg",
    "countryName": "Luxembourg",
    "heroDescription": "Study in Europe’s richest financial capital with trilingual higher education, low tuition fees, and free nationwide public transit.",
    "heroImage": "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Luxembourg edition",
    "heroFacts": {
      "tuition": "€400–€1,600 / yr",
      "livingCost": "€900–€1,600 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 90+",
      "studentVisa": "Temporary Authorisation to Stay (AST)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Highest GDP per capita in the world with Europe’s leading investment fund hub."
      },
      {
        "num": "02",
        "text": "Highly subsidized public university tuition (€200–€400 per semester)."
      },
      {
        "num": "03",
        "text": "100% completely free nationwide public transportation across trains, trams, and buses."
      },
      {
        "num": "04",
        "text": "Nine-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Euro (EUR)",
      "visa": "Temporary Authorisation to Stay (AST) / Type D Visa",
      "majorIntakes": "Winter (September - Primary Intake) · Summer (February)",
      "popularLevels": "Bachelor · Master of Science · Doctoral (PhD)",
      "popularFields": "Banking & Financial Economics · Data Science & AI · European Law · Cybersecurity · Logistics & Supply Chain"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (approx. GPA 3.0+ / 4.0 or European Grade B equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ (min 6.0) or TOEFL iBT 90+ / Multilingual tracks vary",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct University of Luxembourg admissions portal (uni.lu)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Winter Semester (September - Application: Feb 1 to April 30)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.5+ / TOEFL 90+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "GMAT / GRE",
        "score": "Recommended for Master in Finance & Economics",
        "validity": "5 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Language Proficiency (FR/DE)",
        "score": "B2/C1 level (for bilingual degree tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Motivation Interview",
        "score": "Online video interview for competitive Master’s",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter and pay semester registration fee (€200–€400)."
      },
      {
        "step": "02",
        "title": "AST Application",
        "desc": "Submit Temporary Authorisation to Stay (AST) dossier directly to Immigration Directorate."
      },
      {
        "step": "03",
        "title": "Receive AST",
        "desc": "Receive official Authorisation de Séjour Temporaire letter by postal mail/courier."
      },
      {
        "step": "04",
        "title": "Visa D Stamping",
        "desc": "Submit AST letter to Belgian/Luxembourg Embassy to receive entry Visa D sticker."
      },
      {
        "step": "05",
        "title": "Travel & Commune",
        "desc": "Enter Luxembourg and submit declaration of arrival at local Commune within 3 days."
      },
      {
        "step": "06",
        "title": "Medical & Residence",
        "desc": "Complete medical screening check and collect biometric residence card."
      }
    ],
    "costOfStudy": {
      "tuition": "€400–€1,600 / year (€200–€400 / semester at University of Luxembourg)",
      "livingExpenses": "€900–€1,600 / month (University residence: €400–€600 · Private: €900–€1.4k)",
      "healthInsurance": "€0 / year (Free universal coverage under National Health Fund - CNS on enrollment)",
      "visaApplication": "€50 Immigration Directorate application fee (+ €50 entry Visa D)",
      "proofOfFunds": "€10,500 / year (80% of national minimum social wage index)"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 15 hours per week during regular academic study semesters.",
        "Full-time work permitted during scheduled university vacation periods (up to 40 hrs/wk).",
        "High statutory national minimum wage (approx. €14.80+ per hour)."
      ],
      "postStudyWork": [
        "Nine-month post-study residence permit for university graduates seeking employment.",
        "Unrestricted working rights across multinational financial and tech institutions.",
        "Direct switch to standard Salaried Worker Residence Permit upon securing contract."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled / Legalized Academic Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Letters of Academic Recommendation",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Financial Living Solvency",
          "status": "€10,500+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled National Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Temporary Authorisation to Stay",
          "status": "AST) Approval Letter (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Arranged Student Accommodation",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research Master’s degrees at University of Luxembourg (uni.lu)",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS/TOEFL and prepare apostilled transcripts",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply on the uni.lu portal before April 30 non-EU deadline",
        "time": "5–7 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal acceptance and pay semester tuition invoice",
        "time": "4–5 months before"
      },
      {
        "step": "05",
        "title": "AST Immigration Filing",
        "desc": "Post AST application dossier directly to the Immigration Directorate",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Embassy Visa D",
        "desc": "Collect Visa D entry sticker from diplomatic embassy using AST approval",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Commune",
        "desc": "Fly to Luxembourg, declare arrival at Commune, and get residence card",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "All public public transportation (trains, buses, trams) is 100% free nationwide in Luxembourg.",
      "You must apply for your Temporary Authorisation to Stay (AST) before requesting a visa sticker.",
      "Enrolled students are automatically registered for free universal CNS healthcare.",
      "University housing is heavily subsidized, with student rooms starting from €400/month."
    ],
    "lastVerified": "September 2026",
    "source": "Directorate of Immigration (Ministère des Affaires Étrangères) & University of Luxembourg"
  },
  "iceland": {
    "slug": "iceland",
    "countryName": "Iceland",
    "heroDescription": "Study in the land of fire and ice with zero tuition at public universities, world-leading geothermal research, and high quality of life.",
    "heroImage": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Iceland edition",
    "heroFacts": {
      "tuition": "ISK 75,000 (~€500) / yr",
      "livingCost": "ISK 180,000–260,000 / mo",
      "englishBenchmark": "IELTS 6.5+ / TOEFL 79+",
      "studentVisa": "Residence Permit for Students (UTL)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Zero tuition fees charged at public universities (only an annual registration fee applies)."
      },
      {
        "num": "02",
        "text": "Global vanguard in geothermal energy, sustainability, and volcanology research."
      },
      {
        "num": "03",
        "text": "Ranked consistently as the safest and most gender-equal nation in the world."
      },
      {
        "num": "04",
        "text": "Six-month post-study residence permit for university graduates seeking employment."
      }
    ],
    "quickFacts": {
      "currency": "Icelandic Króna (ISK)",
      "visa": "Residence Permit for Students (Directorate of Immigration - ÚTL)",
      "majorIntakes": "Autumn (August/September - Primary Intake)",
      "popularLevels": "Bachelor · Master of Science · Doctoral (PhD)",
      "popularFields": "Renewable & Geothermal Energy · Earth Sciences & Volcanology · Computer Science · Environmental Economics · Marine Biology"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "Recognized 3 or 4-year Bachelor degree in relevant discipline",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "65%+ (approx. GPA 3.0+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.5+ or TOEFL iBT 79–90+ / PTE 58+",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university admissions portal (University of Iceland / Reykjavik University)",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Autumn Semester (August - Non-EU Application Deadline: Feb 1)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS Academic",
        "score": "6.5 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "TOEFL iBT",
        "score": "79–90 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PTE Academic",
        "score": "58 overall score",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Statement of Academic Motivation",
        "score": "Research interest essay evaluated by faculty board",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter and pay annual registration fee (ISK 75,000)."
      },
      {
        "step": "02",
        "title": "Financial Guarantee",
        "desc": "Prepare bank statement showing ISK 217,799/month living solvency."
      },
      {
        "step": "03",
        "title": "Health Insurance",
        "desc": "Purchase private student health insurance policy covering ISK 2,000,000."
      },
      {
        "step": "04",
        "title": "ÚTL Application",
        "desc": "Post physical residence permit application dossier to Directorate of Immigration."
      },
      {
        "step": "05",
        "title": "Permit Approval",
        "desc": "ÚTL evaluates application and issues official residence permit approval notice."
      },
      {
        "step": "06",
        "title": "Travel & Kennitala",
        "desc": "Travel to Iceland, complete photo biometrics, and collect Kennitala ID."
      }
    ],
    "costOfStudy": {
      "tuition": "ISK 75,000 / year (~€500 registration fee Public · Private: €4k–€9k)",
      "livingExpenses": "ISK 180,000–260,000 / month (Reykjavik: ISK 180k–260k ~€1,200–€1,750)",
      "healthInsurance": "ISK 30,000–50,000 / year (Private insurance for first 6 months, free state care after)",
      "visaApplication": "ISK 15,000 Directorate of Immigration (ÚTL) application fee",
      "proofOfFunds": "ISK 217,799 / month (~ISK 2.6M / year) living funds in personal bank"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Up to 20 hours per week during regular academic study semesters.",
        "Requires applying for a student work permit through the Directorate of Labour (VMST).",
        "High student hourly wages (approx. ISK 2,200–2,800+ per hour)."
      ],
      "postStudyWork": [
        "Six-month post-study residence permit for university graduates seeking employment.",
        "Direct transition to standard Expert Work Permit once hired by Icelandic employer.",
        "High demand across renewable energy, software development, and biotech sectors."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Official Degree Certificate and Complete Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Two Academic Letters of Recommendation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official University Letter of Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "ISK 2.6M+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Private Health Insurance Policy",
          "status": "ISK 2,000,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled National Criminal Record Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed ÚTL Residence Permit Application Form",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research programs at University of Iceland and Reykjavik University",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Language Prep",
        "desc": "Complete IELTS or TOEFL test to meet prerequisites",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply directly on university portals before February 1 deadline",
        "time": "6–8 months before"
      },
      {
        "step": "04",
        "title": "Admission & Registration",
        "desc": "Receive admission offer and pay annual registration fee",
        "time": "4–6 months before"
      },
      {
        "step": "05",
        "title": "ÚTL Permit Filing",
        "desc": "Courier residence permit dossier to Directorate of Immigration",
        "time": "3–4 months before"
      },
      {
        "step": "06",
        "title": "Permit Approval",
        "desc": "Receive official permit approval letter before booking flight",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Kennitala",
        "desc": "Arrive in Iceland, complete biometrics, and activate Kennitala ID",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Public universities in Iceland do not charge tuition, only an annual ISK 75,000 fee.",
      "The non-EU application deadline closes early on February 1 across public universities.",
      "After six months of continuous residence, international students transition to free state healthcare.",
      "The Icelandic national ID number (Kennitala) is essential for all banking and public services."
    ],
    "lastVerified": "September 2026",
    "source": "Directorate of Immigration (ÚTL) & Study in Iceland"
  },
  "mexico": {
    "slug": "mexico",
    "countryName": "Mexico",
    "heroDescription": "Study in Latin America’s cultural powerhouse with top-ranked universities (UNAM, Tec de Monterrey), low tuition, and vibrant student lifestyle.",
    "heroImage": "https://images.unsplash.com/photo-1512815767263-ef5a02e64817?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Mexico edition",
    "heroFacts": {
      "tuition": "$2,000–$7,000 / yr",
      "livingCost": "$400–$850 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Temporary Resident Student Visa (INM)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Leading universities (UNAM ranked top in Latin America, Tec de Monterrey #184)."
      },
      {
        "num": "02",
        "text": "Highly affordable tuition rates and remarkably economical cost of student living."
      },
      {
        "num": "03",
        "text": "Dynamic global trade hub with deep economic ties across North and South America."
      },
      {
        "num": "04",
        "text": "Rich historical heritage, world-class gastronomy, and vibrant student communities."
      }
    ],
    "quickFacts": {
      "currency": "Mexican Peso (MXN)",
      "visa": "Temporary Resident Student Visa (Visa de Residente Temporal Estudiante)",
      "majorIntakes": "Fall (August - Primary Intake) · Spring (January)",
      "popularLevels": "Licenciatura (UG) · Maestría (PG) · Doctorado (PhD)",
      "popularFields": "International Trade & Business · Civil Engineering · Biomedical Sciences · Architecture & Urbanism · Latin American Studies"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (Revalidación)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or 8.0/10 Mexican equivalent)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75–85+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with apostilled document dossier",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Fall Semester (August - Application: Feb to May)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "PAA Exam",
        "score": "Academic Aptitude Test conducted by College Board / Tec de Monterrey",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "DELE / SIELE",
        "score": "B2 level (only for Spanish-taught degree tracks)",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "University Motivation Interview",
        "score": "Online interview with academic faculty committee",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal unconditional Acceptance Letter (Carta de Aceptación)."
      },
      {
        "step": "02",
        "title": "Consular Appointment",
        "desc": "Book visa appointment on the official MiConsulado portal."
      },
      {
        "step": "03",
        "title": "Embassy Interview",
        "desc": "Attend consular interview at Mexican Embassy/Consulate with financial proof."
      },
      {
        "step": "04",
        "title": "Visa Stamping",
        "desc": "Receive Temporary Resident Student Visa sticker in international passport."
      },
      {
        "step": "05",
        "title": "Travel to Mexico",
        "desc": "Fly to Mexico and present visa sticker at immigration (FMM)."
      },
      {
        "step": "06",
        "title": "INM Card",
        "desc": "Exchange visa for Temporary Resident Student Card at INM within 30 days."
      }
    ],
    "costOfStudy": {
      "tuition": "$2,000–$7,000 / year (Public UNAM: $1k–$2.5k · Private Tec: $8k–$14k)",
      "livingExpenses": "$400–$850 / month (Puebla/Guadalajara: $400–$600 · Mexico City/Monterrey: $550–$850)",
      "healthInsurance": "$150–$350 / year (Mandatory comprehensive student international medical policy)",
      "visaApplication": "$51 USD consular visa fee (+ approx. MXN 3,500 INM card fee)",
      "proofOfFunds": "$7,000–$10,000 annual living funds proof or $700/month bank statement"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time employment is generally restricted under standard student resident status.",
        "On-campus academic assistantships and research fellowships are accessible to students.",
        "Internships integrated into academic degree curricula are fully permitted."
      ],
      "postStudyWork": [
        "Post-study work authorization available upon securing an official job offer.",
        "Converts directly to standard Temporary Resident with Work Permission (INM).",
        "Rapidly expanding manufacturing, automotive, and IT software startup ecosystems."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Motivation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Passport-Sized Photographs",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of Acceptance",
          "status": "Carta de Aceptación) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Statements",
          "status": "Past 3–6 months) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Economic Solvency or Scholarship Award",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Mexican Consular Visa Application Form",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Valid International Passport with Photocopy",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Selection",
        "desc": "Research programs at UNAM, Tec de Monterrey, and ITAM",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Language & Apostille",
        "desc": "Complete IELTS/TOEFL and obtain Hague Apostille on transcripts",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply online to target universities before May deadline",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive Carta de Aceptación and assemble financial solvency files",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "MiConsulado Filing",
        "desc": "Book appointment on MiConsulado and attend consular visa interview",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Stamping",
        "desc": "Receive student resident visa sticker in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & INM",
        "desc": "Fly to Mexico and exchange visa for resident card at INM within 30 days",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Tecnológico de Monterrey (ITESM) is world-renowned for entrepreneurship and engineering.",
      "All foreign academic documents must have a Hague Apostille and official Spanish translation.",
      "You must complete the \"Canje\" process at the National Migration Institute (INM) within 30 days.",
      "Public university tuition at UNAM is remarkably affordable for international candidates."
    ],
    "lastVerified": "September 2026",
    "source": "National Migration Institute (INM Mexico) & Secretaría de Relaciones Exteriores (SRE)"
  },
  "brazil": {
    "slug": "brazil",
    "countryName": "Brazil",
    "heroDescription": "Study in South America’s largest economy with top-ranked research institutions (USP, Unicamp), zero public tuition, and rich biodiversity.",
    "heroImage": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Brazil edition",
    "heroFacts": {
      "tuition": "R$ 0 (Public) / yr",
      "livingCost": "R$ 2,000–4,500 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Student Temporary Visa (VITEM IV)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Top research universities in Latin America (University of São Paulo USP, Unicamp)."
      },
      {
        "num": "02",
        "text": "Completely tuition-free education at all federal and state public research universities."
      },
      {
        "num": "03",
        "text": "Global leader in agricultural science, biofuel technology, deepwater drilling, and aviation."
      },
      {
        "num": "04",
        "text": "Warm, multicultural society with rich biodiversity and dynamic student culture."
      }
    ],
    "quickFacts": {
      "currency": "Brazilian Real (BRL)",
      "visa": "Student Temporary Visa (VITEM IV - Polícia Federal)",
      "majorIntakes": "Semester 1 (February/March - Primary) · Semester 2 (August)",
      "popularLevels": "Graduação (UG) · Mestrado (PG) · Doutorado (PhD)",
      "popularFields": "Aeronautical Engineering · Biofuels & Renewable Energy · Agriculture & Agronomy · Tropical Medicine · Computer Science"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or equivalent academic benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75–85+ (for English tracks)",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university admissions portal or PEC-G / PEC-PG government programs",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Semester 1 (February/March - Application: May to September)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "Celpe-Bras Exam",
        "score": "Certificate of Proficiency in Portuguese for Foreigners",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "POSCOMP Exam",
        "score": "Computer Science national graduate examination (for MSc/PhD)",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      },
      {
        "test": "University Selection Exam",
        "score": "File evaluation or online interview conducted by postgraduate board",
        "validity": "1 year",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal unconditional Letter of Acceptance from Brazilian university."
      },
      {
        "step": "02",
        "title": "Police Clearance",
        "desc": "Obtain national criminal background check with Hague Apostille legalization."
      },
      {
        "step": "03",
        "title": "Financial Proof",
        "desc": "Demonstrate sufficient financial solvency ($7,000+) in bank account."
      },
      {
        "step": "04",
        "title": "Consular Filing",
        "desc": "Submit VITEM IV student visa application at Brazilian Embassy or Consulate."
      },
      {
        "step": "05",
        "title": "Visa Stamping",
        "desc": "Receive VITEM IV entry visa sticker in international passport."
      },
      {
        "step": "06",
        "title": "Federal Police Registration",
        "desc": "Register with Polícia Federal within 90 days to receive CRNM card."
      }
    ],
    "costOfStudy": {
      "tuition": "R$ 0 / year (Public Federal/State universities are 100% tuition-free · Private: R$ 15k–35k)",
      "livingExpenses": "R$ 2,000–4,500 / month (Campinas/Curitiba: R$ 2k–3k · São Paulo/Rio: R$ 3k–4.5k)",
      "healthInsurance": "R$ 0 / year (Free universal healthcare for all residents under SUS - Sistema Único de Saúde)",
      "visaApplication": "$100–$160 USD VITEM IV visa fee (+ approx. R$ 204 Federal Police registration fee)",
      "proofOfFunds": "$7,000 / year financial living solvency bank statement"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time employment is generally restricted under standard VITEM IV visa regulations.",
        "On-campus research fellowships (CAPES/CNPq) offer monthly tax-free living stipends.",
        "Mandatory curricular internships (Estágio) are fully permitted under Brazilian law."
      ],
      "postStudyWork": [
        "One-year post-study residence authorization available for graduates with employment offer.",
        "Converts directly to standard Temporary Visa for Work (VITEM V).",
        "Strong hiring demand in aviation (Embraer ecosystem), agribusiness, and FinTech."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Academic Recommendation Letters",
          "status": "Usually Required",
          "badgeVariant": "usually"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Acceptance",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Criminal Record Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Solvency Statement",
          "status": "$7,000+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Birth Certificate with Sworn Portuguese Translation",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Completed Brazilian Visa Application Summary",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research graduate programs at USP, Unicamp, and UFRJ",
        "time": "10–14 months before"
      },
      {
        "step": "02",
        "title": "Transcripts Apostille",
        "desc": "Obtain Hague Apostille and sworn Portuguese translations",
        "time": "8–10 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply directly to university graduate programs before September",
        "time": "5–7 months before"
      },
      {
        "step": "04",
        "title": "Admission Offers",
        "desc": "Receive formal acceptance letter and apply for CAPES/CNPq stipends",
        "time": "3–5 months before"
      },
      {
        "step": "05",
        "title": "Consular VITEM IV",
        "desc": "Submit student visa application at Brazilian Embassy / Consulate",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Visa Stamping",
        "desc": "Receive VITEM IV visa sticker in international passport",
        "time": "1–2 months before"
      },
      {
        "step": "07",
        "title": "Travel & Polícia Federal",
        "desc": "Fly to Brazil, matriculate, and register with Polícia Federal for CRNM",
        "time": "1–2 weeks before"
      }
    ],
    "goodToKnow": [
      "Public federal and state universities (USP, Unicamp, UNESP, UFRJ) charge zero tuition.",
      "All foreign students can access 100% free public healthcare through the SUS network.",
      "You must register with the Polícia Federal within 90 days to receive your CRNM resident card.",
      "CAPES and CNPq government research fellowships provide monthly stipends for Master’s/PhD."
    ],
    "lastVerified": "September 2026",
    "source": "Ministry of Foreign Affairs (Itamaraty) & Polícia Federal"
  },
  "argentina": {
    "slug": "argentina",
    "countryName": "Argentina",
    "heroDescription": "Study in South America’s cultural and intellectual capital with zero tuition at prestigious public universities like UBA and low living costs.",
    "heroImage": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Argentina edition",
    "heroFacts": {
      "tuition": "$0 (Public) / yr",
      "livingCost": "$350–$700 / mo",
      "englishBenchmark": "IELTS 6.0+ / TOEFL 75+",
      "studentVisa": "Student Residence Visa (Migraciones - DNM)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "Home to Universidad de Buenos Aires (UBA), consistently ranked in global top 100."
      },
      {
        "num": "02",
        "text": "100% tuition-free undergraduate and subsidized postgraduate degrees at public institutions."
      },
      {
        "num": "03",
        "text": "Exceptionally affordable student living costs and favorable foreign exchange dynamics."
      },
      {
        "num": "04",
        "text": "Rich intellectual tradition, renowned literary culture, and European architectural charm."
      }
    ],
    "quickFacts": {
      "currency": "Argentine Peso (ARS)",
      "visa": "Student Visa (Visa de Estudiante - Migraciones DNM)",
      "majorIntakes": "Semester 1 (March - Primary Intake) · Semester 2 (August)",
      "popularLevels": "Grado (UG) · Maestría (PG) · Doctorado (PhD)",
      "popularFields": "Software Engineering · Medicine & Healthcare · Literature & Philosophy · International Economics · Visual & Cinema Arts"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (Convalidación)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "60%+ (approx. GPA 2.8+ / 4.0 or equivalent academic benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 6.0+ or TOEFL iBT 75+ (for English tracks) / Spanish proficiency",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university portal + Radex digital immigration pre-registration",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Semester 1 (March - Application: October to December)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 6.0+ / TOEFL 75+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "CELU / DUCLE Exam",
        "score": "Certificate of Spanish Language and Use",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "CBC (Ciclo Básico Común)",
        "score": "Foundation first-year common cycle for UBA undergraduate study",
        "validity": "1 year",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Academic Evaluation Interview",
        "score": "Online interview conducted for specialized Master’s programs",
        "validity": "1 year",
        "requirement": "Optional",
        "badgeVariant": "optional"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive formal admission letter and university entry in the DNM database."
      },
      {
        "step": "02",
        "title": "Police Clearance",
        "desc": "Obtain apostilled criminal background certificate from home country."
      },
      {
        "step": "03",
        "title": "Consular Visa",
        "desc": "Apply for Student Visa at Argentine Embassy or enter visa-free and convert locally."
      },
      {
        "step": "04",
        "title": "Radex Portal Filing",
        "desc": "Submit online residency application on the Radex immigration system."
      },
      {
        "step": "05",
        "title": "DNM Appointment",
        "desc": "Attend in-person appointment at Dirección Nacional de Migraciones (DNM)."
      },
      {
        "step": "06",
        "title": "DNI Card Collection",
        "desc": "Receive physical Argentine National Identity Card (DNI) by mail."
      }
    ],
    "costOfStudy": {
      "tuition": "$0 / year (Public universities like UBA are 100% free · Private: $2.5k–$6k)",
      "livingExpenses": "$350–$700 / month (Cordoba/Rosario: $350–$500 · Buenos Aires: $450–$700)",
      "healthInsurance": "$0–$150 / year (Free emergency care in public hospitals or private prepaga)",
      "visaApplication": "$150–$200 USD Student Visa consular fee (+ Radex migration fee ~ARS 6,000)",
      "proofOfFunds": "$3,500–$5,000 / year bank solvency statement in student/sponsor name"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Full-time and part-time work rights permitted once temporary residency (DNI) is obtained.",
        "International students holding a DNI can work legally across all economic sectors.",
        "Thriving student job opportunities across software development, tourism, and services."
      ],
      "postStudyWork": [
        "Post-study residence easily extendable for university graduates seeking employment.",
        "Direct pathway to permanent residency after two years of continuous legal residence.",
        "Rapidly expanding IT outsourcing and digital services ecosystem in Buenos Aires."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Certificates and Transcripts",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Statement of Academic Purpose and Plan",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Apostilled Birth Certificate",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Official Letter of University Admission",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled National Criminal Record Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Argentine Criminal Record Check",
          "status": "RNR) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Proof of Financial Solvency",
          "status": "$3,500+) (Required",
          "badgeVariant": "required"
        },
        {
          "name": "Radex Online Application Receipt and Fee Confirmation",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Shortlist",
        "desc": "Research degree programs at Universidad de Buenos Aires (UBA) and UNLP",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "Transcripts Legalization",
        "desc": "Obtain Hague Apostille and official Spanish translations",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply directly on university portals before December",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & Entry",
        "desc": "Receive formal admission; university enters details into DNM system",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Consular / Radex Filing",
        "desc": "Complete Radex online application and book DNM appointment",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Travel & Arrival",
        "desc": "Fly to Buenos Aires and attend in-person DNM immigration interview",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "DNI Card",
        "desc": "Receive physical Argentine DNI card at residential address",
        "time": "Month 1 on arrival"
      }
    ],
    "goodToKnow": [
      "Universidad de Buenos Aires (UBA) is completely tuition-free for all international students.",
      "Undergraduate admission at UBA requires completing the Ciclo Básico Común (CBC) foundation.",
      "Obtaining an Argentine DNI card grants full legal working rights without separate permits.",
      "Buenos Aires is celebrated as one of the world’s most culturally vibrant student metropolises."
    ],
    "lastVerified": "September 2026",
    "source": "Dirección Nacional de Migraciones (DNM Argentina) & Universidad de Buenos Aires"
  },
  "philippines": {
    "slug": "philippines",
    "countryName": "Philippines",
    "heroDescription": "Study in Asia’s native English-speaking archipelagic nation with highly affordable medical and nursing degrees, low costs, and warm hospitality.",
    "heroImage": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
    "heroBadgeText": "Plan with clarity · Philippines edition",
    "heroFacts": {
      "tuition": "$1,500–$4,500 / yr",
      "livingCost": "$300–$650 / mo",
      "englishBenchmark": "IELTS 5.5+ / TOEFL 70+",
      "studentVisa": "Student Visa (Section 9F - BI)"
    },
    "whyStudyHere": [
      {
        "num": "01",
        "text": "100% English-medium education nationwide with US-aligned medical and nursing curricula."
      },
      {
        "num": "02",
        "text": "Highly renowned and affordable Doctor of Medicine (MD) programs (UST, UERM, DLSU)."
      },
      {
        "num": "03",
        "text": "Among the lowest tuition rates and student living expenses in the Asia-Pacific region."
      },
      {
        "num": "04",
        "text": "Warm, hospitable culture across stunning tropical islands with zero language barriers."
      }
    ],
    "quickFacts": {
      "currency": "Philippine Peso (PHP)",
      "visa": "Student Visa (Section 9F - Bureau of Immigration)",
      "majorIntakes": "Semester 1 (August/September - Primary) · Semester 2 (January/February)",
      "popularLevels": "Bachelor · Doctor of Medicine (MD) · Master’s Degree · Doctoral (PhD)",
      "popularFields": "Doctor of Medicine (MD) · Nursing & Health Sciences · Computer Science · Maritime Engineering · Business Administration"
    },
    "admissionRequirements": {
      "academicQualification": {
        "title": "ACADEMIC QUALIFICATION",
        "value": "12 years schooling / recognized 3/4-year Bachelor degree (CHED)",
        "badge": "Typical"
      },
      "academicBenchmark": {
        "title": "ACADEMIC BENCHMARK",
        "value": "55%–60%+ (approx. GPA 2.5+ / 4.0 or equivalent benchmark)",
        "badge": "Competitive"
      },
      "englishRequirement": {
        "title": "ENGLISH REQUIREMENT",
        "value": "IELTS 5.5–6.0+ or TOEFL iBT 70–80+ / English MOI letter",
        "badge": "Program Specific"
      },
      "applicationRequirement": {
        "title": "APPLICATION REQUIREMENT",
        "value": "Direct university online admissions portal with CHED eligibility",
        "badge": "Typical"
      },
      "majorIntakes": {
        "title": "MAJOR INTAKES",
        "value": "Semester 1 (August - Application: March to June/July)",
        "badge": "Typical"
      }
    },
    "testsAndExams": [
      {
        "test": "IELTS / TOEFL",
        "score": "IELTS 5.5+ / TOEFL 70+",
        "validity": "2 years",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      },
      {
        "test": "NMAT Exam",
        "score": "National Medical Admission Test for Doctor of Medicine (MD)",
        "validity": "2 years",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "English MOI Letter",
        "score": "Accepted for students with prior degrees conducted in English",
        "validity": "Lifetime",
        "requirement": "Program Specific",
        "badgeVariant": "specific"
      },
      {
        "test": "Quarantine Medical Check",
        "score": "Mandatory Bureau of Quarantine medical clearance",
        "validity": "3 months",
        "requirement": "Usually Required",
        "badgeVariant": "usually"
      }
    ],
    "visaProcess": [
      {
        "step": "01",
        "title": "University Admission",
        "desc": "Receive Notice of Acceptance (NOA) and pay initial tuition deposit."
      },
      {
        "step": "02",
        "title": "CHED Clearance",
        "desc": "University obtains eligibility certificate from Commission on Higher Education."
      },
      {
        "step": "03",
        "title": "DFA Authority",
        "desc": "Department of Foreign Affairs sends visa authorization to Philippine Embassy."
      },
      {
        "step": "04",
        "title": "9F Visa Stamping",
        "desc": "Submit visa dossier at Philippine Embassy and receive 9F visa sticker."
      },
      {
        "step": "05",
        "title": "Travel to Manila",
        "desc": "Enter the Philippines and report to university international office."
      },
      {
        "step": "06",
        "title": "ACR I-Card",
        "desc": "Complete biometrics at Bureau of Immigration to receive ACR I-Card."
      }
    ],
    "costOfStudy": {
      "tuition": "$1,500–$4,500 / year (Standard: $1.5k–$3k · Medicine/MD: $3.5k–$6.5k)",
      "livingExpenses": "$300–$650 / month (Cebu/Davao: $300–$450 · Metro Manila: $450–$650)",
      "healthInsurance": "$100–$250 / year (Mandatory international student comprehensive health policy)",
      "visaApplication": "$200–$250 9F Student Visa fee (+ ACR I-Card fee ~$50 USD)",
      "proofOfFunds": "$3,000–$5,000 bank statement financial solvency proof"
    },
    "workAndPostStudy": {
      "partTimeWork": [
        "Part-time off-campus employment is restricted under standard Section 9F student visa rules.",
        "On-campus teaching assistantships and research fellowships are accessible to students.",
        "Clinical rotations and nursing internships integrated into curricula are fully authorized."
      ],
      "postStudyWork": [
        "Special Work Permit (SWP) or 9G Commercial Work Visa via employer sponsorship.",
        "Direct pathway to corporate careers in multinational business process outsourcing (BPO).",
        "Strong clinical training foundation recognized by international medical licensing boards."
      ]
    },
    "documents": {
      "universityApplication": [
        {
          "name": "Valid International Passport",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Academic Transcripts and Certificates",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Notice of Acceptance",
          "status": "NOA) from University (Required",
          "badgeVariant": "required"
        },
        {
          "name": "English Language Test Certificate or MOI",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Updated Academic Curriculum Vitae",
          "status": "Usually Required",
          "badgeVariant": "usually"
        },
        {
          "name": "Passport-Sized Photographs",
          "status": "Required",
          "badgeVariant": "required"
        }
      ],
      "financialAndVisa": [
        {
          "name": "Commission on Higher Education",
          "status": "CHED) Clearance (Required",
          "badgeVariant": "required"
        },
        {
          "name": "DFA Visa Authorization Confirmation Sheet",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bank Account Financial Solvency Statement",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Apostilled Police Clearance Certificate",
          "status": "Required",
          "badgeVariant": "required"
        },
        {
          "name": "Bureau of Quarantine Medical Clearance Report",
          "status": "Required",
          "badgeVariant": "required"
        }
      ]
    },
    "timeline": [
      {
        "step": "01",
        "title": "Program Selection",
        "desc": "Research medical and graduate degrees at UP, UST, DLSU, and Ateneo",
        "time": "8–12 months before"
      },
      {
        "step": "02",
        "title": "NMAT Exam",
        "desc": "Complete NMAT examination (for Doctor of Medicine applicants)",
        "time": "6–8 months before"
      },
      {
        "step": "03",
        "title": "University Submissions",
        "desc": "Apply directly on university portals before June deadline",
        "time": "4–6 months before"
      },
      {
        "step": "04",
        "title": "Admission & CHED",
        "desc": "Receive Notice of Acceptance; university submits CHED and DFA visa pack",
        "time": "3–4 months before"
      },
      {
        "step": "05",
        "title": "Embassy 9F Visa",
        "desc": "Submit visa dossier at Philippine Embassy once DFA clearance arrives",
        "time": "2–3 months before"
      },
      {
        "step": "06",
        "title": "Travel & Quarantine Check",
        "desc": "Fly to Philippines and complete Bureau of Quarantine medical clearance",
        "time": "1–2 weeks before"
      },
      {
        "step": "07",
        "title": "ACR I-Card",
        "desc": "Register at Bureau of Immigration and collect ACR I-Card",
        "time": "Month 1 on arrival"
      }
    ],
    "goodToKnow": [
      "English is an official national language and the sole language of higher education instruction.",
      "The Philippines is a premier destination for affordable USMLE-aligned medical education.",
      "Foreign students must obtain an Alien Certificate of Registration Identity Card (ACR I-Card).",
      "Living costs in the Philippines are among the most economical in the world."
    ],
    "lastVerified": "September 2026",
    "source": "Bureau of Immigration (BI Philippines) & Commission on Higher Education (CHED)"
  }
};
