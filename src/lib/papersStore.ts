import { fetchPapers, savePaper, deletePaper, Paper } from "./api";

// Helper to sanitize database paper response to ensure standard camelCase fields match frontend
function sanitizePaper(p: any): Paper {
  return {
    id: p.id,
    title: p.title,
    author: p.author || "",
    authorEmail: p.authorEmail || p.author_email || "",
    affiliation: p.affiliation || "",
    orcid: p.orcid || null,
    mobileNumber: p.mobileNumber || p.mobile_number || null,
    co_authors: p.co_authors || null,
    format: p.format || "ieee",
    wordCount: p.wordCount !== undefined ? p.wordCount.toString() : (p.word_count !== undefined ? p.word_count.toString() : "0"),
    pageCount: p.pageCount !== undefined ? p.pageCount.toString() : (p.page_count !== undefined ? p.page_count.toString() : "1"),
    pref1: p.pref1 || null,
    pref2: p.pref2 || null,
    pref3: p.pref3 || null,
    currentReviewerId: p.currentReviewerId || p.current_reviewer_id || null,
    preferenceIndex: p.preferenceIndex !== undefined ? p.preferenceIndex : (p.preference_index !== undefined ? p.preference_index : 1),
    assignmentStatus: p.assignmentStatus || p.assignment_status || null,
    status: p.status || "Drafting",
    submittedAt: p.submittedAt || p.submitted_at || new Date().toISOString(),
    dueDate: p.dueDate || p.due_date || null,
    reviewerId: p.reviewerId || p.reviewer_id || null,
    reviewerName: p.reviewerName || p.reviewer_name || null,
    journal: p.journal || null,
    score: p.score !== undefined ? Number(p.score) : 80,
    doi: p.doi || "N/A",
    comments: p.comments || "",
    sections: p.sections || [],
    uploadedPdfName: p.uploadedPdfName || p.uploaded_pdf_name || null,
    uploadedPdfContent: p.uploadedPdfContent || p.uploaded_pdf_content || null,
    evaluatedAt: p.evaluatedAt || p.evaluated_at || null,
    assignedAt: p.assignedAt || p.assigned_at || null,
    aiScore: p.aiScore !== undefined ? (p.aiScore === null ? null : Number(p.aiScore)) : (p.ai_score !== undefined && p.ai_score !== null ? Number(p.ai_score) : null),
    rubricRigor: p.rubricRigor !== undefined ? (p.rubricRigor === null ? null : Number(p.rubricRigor)) : (p.rubric_rigor !== undefined && p.rubric_rigor !== null ? Number(p.rubric_rigor) : null),
    rubricStyle: p.rubricStyle !== undefined ? (p.rubricStyle === null ? null : Number(p.rubricStyle)) : (p.rubric_style !== undefined && p.rubric_style !== null ? Number(p.rubric_style) : null),
    rubricNovelty: p.rubricNovelty !== undefined ? (p.rubricNovelty === null ? null : Number(p.rubricNovelty)) : (p.rubric_novelty !== undefined && p.rubric_novelty !== null ? Number(p.rubric_novelty) : null),
  };
}

export const SEED_PAPERS: any[] = [
  {
    id: "pub-seed-1",
    title: "Optimizing Solar Cell Efficiency Using Silicon Nano-Structures",
    author: "Aarav Mehta",
    authorEmail: "aarav.mehta@highschool.edu",
    affiliation: "High School of Boston",
    format: "ieee",
    wordCount: "1450",
    pageCount: "4",
    status: "Accepted",
    reviewerId: "elizabeth-vance",
    reviewerName: "Dr. Elizabeth Vance",
    journal: "High School Journal of Engineering and Innovation",
    category: "Engineering & Innovation",
    score: 95,
    doi: "10.5142/as.2026.1101",
    evaluatedAt: "2026-06-10T14:30:00Z",
    submittedAt: "2026-06-08T09:00:00Z",
    sections: [
      {id: "abstract", title: "Abstract", html: "<p>This paper presents a novel approach to optimizing solar cell efficiency through the integration of silicon nano-structures. By utilizing numerical simulations, we model the light-trapping capabilities of silicon nano-wire arrays on standard photovoltaic substrates. The results indicate a relative increase in light absorption of up to 18.4% across the solar spectrum, demonstrating a promising pathway for low-cost, high-efficiency solar energy harvesting.</p>"},
      {id: "intro", title: "1. Introduction", html: "<p>As global energy demand continues to rise, photovoltaics remain a cornerstone of renewable energy transitions. However, the efficiency limits of single-junction silicon solar cells necessitate innovative surface texturing methods. Traditional micro-pyramidal texturing, while effective, has significant material loss and surface recombination issues. Silicon nano-structures have recently emerged as a highly effective light-trapping architecture.</p>"},
      {id: "methods", title: "2. Methodology", html: "<p>The light-trapping performance was evaluated using finite-difference time-domain (FDTD) simulations. We systematically varied the height, diameter, and pitch of silicon nano-wires on a standard crystalline silicon substrate. The absorption profile was integrated over the AM1.5G solar spectrum from 300 to 1100 nm.</p>"},
      {id: "results", title: "3. Results", html: "<p>FDTD simulations revealed that the optimized nano-wire arrays (height: 500 nm, diameter: 120 nm, pitch: 300 nm) reduced average surface reflectance to less than 4.2%. The calculated short-circuit current density increased from 32.5 mA/cm² to 38.5 mA/cm², translating to a significant improvement in overall conversion efficiency.</p>"},
      {id: "conclusion", title: "4. Conclusion", html: "<p>In conclusion, we have demonstrated that silicon nano-wire arrays can significantly enhance solar cell absorption. These findings suggest a viable methodology for fabricating next-generation high-efficiency solar cells using scalable nanofabrication techniques.</p>"}
    ]
  },
  {
    id: "pub-seed-2",
    title: "Analyzing Microplastic Contamination in Local Freshwater Ecosystems",
    author: "Maya Lin",
    authorEmail: "maya.lin@middleschool.edu",
    affiliation: "Lincoln Middle School",
    format: "apa",
    wordCount: "1280",
    pageCount: "3",
    status: "Accepted",
    reviewerId: "marcus-sterling",
    reviewerName: "Prof. Marcus Sterling",
    journal: "Middle School Journal of Natural Sciences",
    category: "Natural Sciences",
    score: 92,
    doi: "10.5142/as.2026.1102",
    evaluatedAt: "2026-06-11T09:15:00Z",
    submittedAt: "2026-06-09T10:00:00Z",
    sections: [
      {id: "abstract", title: "Abstract", html: "<p>Microplastic contamination in freshwater environments is an escalating ecological concern. This study examines microplastic density and distribution in the local freshwater ecosystem of the Maple River watershed. Over a three-month sampling period, water samples were analyzed using micro-Raman spectroscopy. The findings reveal an average concentration of 4.2 particles per liter, with high-density polyethylene (HDPE) being the dominant polymer type.</p>"},
      {id: "intro", title: "1. Introduction", html: "<p>Microplastics, defined as plastic particles less than 5 mm in size, are persistent environmental pollutants. While extensive research has focused on marine plastic debris, freshwater systems remain under-studied despite serving as primary conduits for microplastics. Understanding the concentration of microplastics in local rivers is essential for local conservation efforts.</p>"},
      {id: "methods", title: "2. Methodology", html: "<p>Surface water samples were collected weekly from four distinct locations along the Maple River. Samples were filtered through a 100 μm sieve, digested using wet peroxide oxidation to remove organic matter, and analyzed via micro-Raman spectroscopy to identify polymer compositions.</p>"},
      {id: "results", title: "3. Results", html: "<p>Raman analysis confirmed a mean particle count of 4.2 particles per liter. Polyethylene and polypropylene accounted for 68% of the identified polymers, pointing directly to consumer packaging run-off as the primary source of contamination. Concentrations were significantly higher downstream of urban run-off zones.</p>"},
      {id: "conclusion", title: "4. Conclusion", html: "<p>The study highlights a clear microplastic presence in the local watershed, necessitating improved stormwater filtration systems and community awareness programs regarding single-use plastics.</p>"}
    ]
  },
  {
    id: "pub-seed-3",
    title: "Predicting Cardiovascular Risk Patterns Using Simple Machine Learning Classifiers",
    author: "Chloe Henderson",
    authorEmail: "chloe.h@highschool.edu",
    affiliation: "Oakridge High School",
    format: "acm",
    wordCount: "1600",
    pageCount: "4",
    status: "Accepted",
    reviewerId: "kenji-tanaka",
    reviewerName: "Dr. Kenji Tanaka",
    journal: "High School Journal of Computing and AI",
    category: "Computing & AI",
    score: 94,
    doi: "10.5142/as.2026.1103",
    evaluatedAt: "2026-06-12T11:00:00Z",
    submittedAt: "2026-06-10T08:00:00Z",
    sections: [
      {id: "abstract", title: "Abstract", html: "<p>Early identification of cardiovascular risk factors is critical for preventive clinical intervention. This paper presents a comparative analysis of classical machine learning classifiers (Logistic Regression, Random Forest, and Support Vector Machines) for predicting cardiovascular risk using public patient health datasets. The Random Forest model achieved a peak accuracy of 89.2% and an AUROC of 0.93, indicating that simple classifiers can yield highly reliable clinical prediction metrics.</p>"},
      {id: "intro", title: "1. Introduction", html: "<p>Cardiovascular diseases (CVDs) are the leading cause of mortality worldwide. Traditional risk calculators, such as the Framingham Risk Score, rely on static statistical tables and may underpredict risk in diverse cohorts. Machine learning classifiers can identify non-linear relationships across clinical metrics, augmenting clinician decision support systems.</p>"},
      {id: "methods", title: "2. Methodology", html: "<p>A dataset of 70,000 patient records was preprocessed, including standard normalization and imputation of missing values. We trained Logistic Regression, SVM, and Random Forest classifiers using 5-fold cross-validation. Hyperparameters were tuned via grid search optimization.</p>"},
      {id: "results", title: "3. Results", html: "<p>The Random Forest classifier achieved a sensitivity of 88.4% and specificity of 90.1%, outperforming other models. Feature importance analysis highlighted systolic blood pressure, cholesterol level, and age as the top three clinical predictors of cardiovascular risk.</p>"},
      {id: "conclusion", title: "4. Conclusion", html: "<p>Our findings validate the use of Random Forest models as accurate and lightweight diagnostic alert tools, suitable for integration into electronic health record workflows.</p>"}
    ]
  },
  {
    id: "pub-seed-4",
    title: "On the Geometric Properties of Fibonacci-like Sequences and Golden Ratio Approximations",
    author: "Justin Zhang",
    authorEmail: "justin.z@highschool.edu",
    affiliation: "Westlake High School",
    format: "chicago",
    wordCount: "1850",
    pageCount: "5",
    status: "Accepted",
    reviewerId: "helena-rostova",
    reviewerName: "Dr. Helena Rostova",
    journal: "High School Journal of Mathematics",
    category: "Mathematics",
    score: 96,
    doi: "10.5142/as.2026.1104",
    evaluatedAt: "2026-06-13T16:45:00Z",
    submittedAt: "2026-06-11T12:00:00Z",
    sections: [
      {id: "abstract", title: "Abstract", html: "<p>This paper explores the structural and geometric properties of generalized Fibonacci-like sequences. We investigate sequences defined by the recurrence relation G(n) = a*G(n-1) + b*G(n-2) for arbitrary initial values. We prove that the ratio of consecutive terms converges to a generalized golden ratio, and we formulate a geometric representation of these sequences on Cartesian coordinate planes, demonstrating interesting asymptotic spiral properties.</p>"},
      {id: "intro", title: "1. Introduction", html: "<p>The Fibonacci sequence and the golden ratio have deep mathematical and natural significance. While extensions such as Tribonacci sequences are well-documented, the general geometric representations of G(n) remain less analyzed. This paper aims to bridge this gap by defining the explicit asymptotic behavior of these sequences geometrically.</p>"},
      {id: "methods", title: "2. Methodology", html: "<p>By utilizing linear algebra and characteristic equations, we derive the closed-form Binet-like formula for G(n). We then construct geometric coordinates by mapping G(n) and G(n+1) as vertex points of nested rectangles on a plane.</p>"},
      {id: "results", title: "3. Results", html: "<p>We prove that the vertices of these nested rectangles lie asymptotically on a logarithmic spiral of the form r = c*e^(kθ). Furthermore, we demonstrate that the limiting ratio of G(n)/G(n-1) converges to the positive root of the characteristic equation x² - ax - b = 0.</p>"},
      {id: "conclusion", title: "4. Conclusion", html: "<p>The analytical formulations developed here provide a generalized geometric framework for linear recurrences, opening directions for multidimensional recurrence geometry.</p>"}
    ]
  }
];

/** Save PDF content for a single paper to its own localStorage slot */
function savePdfToLocal(id: string, pdfContent: string | null | undefined, pdfName: string | null | undefined) {
  if (!id || typeof window === "undefined") return;
  try {
    if (pdfContent) {
      localStorage.setItem(`abroad_pdf_content_${id}`, pdfContent);
    }
    if (pdfName) {
      localStorage.setItem(`abroad_pdf_name_${id}`, pdfName);
    }
  } catch (e) {
    console.warn("Failed to save PDF content to localStorage:", e);
  }
}

/** Read PDF content for a single paper from its own localStorage slot */
function loadPdfFromLocal(id: string): { uploadedPdfContent: string | null; uploadedPdfName: string | null } {
  if (!id || typeof window === "undefined") return { uploadedPdfContent: null, uploadedPdfName: null };
  try {
    const content = localStorage.getItem(`abroad_pdf_content_${id}`);
    const name = localStorage.getItem(`abroad_pdf_name_${id}`);
    return { uploadedPdfContent: content, uploadedPdfName: name };
  } catch (e) {
    return { uploadedPdfContent: null, uploadedPdfName: null };
  }
}

/** Strip large PDF blobs from a papers list before saving the main key */
function stripPdfContent(papers: Paper[]): Paper[] {
  return papers.map((p) => ({ ...p, uploadedPdfContent: null }));
}

export async function getPapersList(): Promise<Paper[]> {
  try {
    const dbPapers = await fetchPapers();
    let sanitized = dbPapers.map(sanitizePaper);
    if (sanitized.length === 0) {
      const seeded = SEED_PAPERS.map(sanitizePaper);
      // Save without PDF blobs (seed papers have none)
      try { localStorage.setItem("abroad_submitted_papers", JSON.stringify(seeded)); } catch (_) {}
      return seeded;
    }
    // Save PDF content separately, strip from main list before saving
    sanitized.forEach((p) => {
      if (p.uploadedPdfContent) {
        savePdfToLocal(p.id, p.uploadedPdfContent, p.uploadedPdfName);
      }
    });
    try { localStorage.setItem("abroad_submitted_papers", JSON.stringify(stripPdfContent(sanitized))); } catch (_) {}
    return sanitized;
  } catch (e) {
    console.warn("Failed to fetch papers from PostgreSQL, falling back to localStorage:", e);
    if (typeof window !== "undefined") {
      const local = localStorage.getItem("abroad_submitted_papers");
      if (local && JSON.parse(local).length > 0) {
        const papers: Paper[] = JSON.parse(local).map(sanitizePaper);
        // Reassemble PDF content from individual slots
        return papers.map((p) => {
          const { uploadedPdfContent, uploadedPdfName } = loadPdfFromLocal(p.id);
          return {
            ...p,
            uploadedPdfContent: uploadedPdfContent || p.uploadedPdfContent || null,
            uploadedPdfName: uploadedPdfName || p.uploadedPdfName || null,
          };
        });
      } else {
        const seeded = SEED_PAPERS.map(sanitizePaper);
        try { localStorage.setItem("abroad_submitted_papers", JSON.stringify(seeded)); } catch (_) {}
        return seeded;
      }
    }
    return SEED_PAPERS.map(sanitizePaper);
  }
}


export async function updatePaperInStore(paper: Paper): Promise<void> {
  const sanitized = sanitizePaper(paper);
  
  // 1. Sync to local storage first — store PDF content separately to avoid QuotaExceededError
  try {
    // Save PDF content to its own key
    if (sanitized.uploadedPdfContent) {
      savePdfToLocal(sanitized.id, sanitized.uploadedPdfContent, sanitized.uploadedPdfName);
    }

    const localRaw = localStorage.getItem("abroad_submitted_papers");
    let local = localRaw ? JSON.parse(localRaw) : [];
    // Strip PDF content from the main list entry
    const sanitizedForStorage = { ...sanitized, uploadedPdfContent: null };
    const idx = local.findIndex((p: any) => p.id === sanitized.id);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...sanitizedForStorage };
    } else {
      local.push(sanitizedForStorage);
    }
    localStorage.setItem("abroad_submitted_papers", JSON.stringify(local));
  } catch (e) {
    console.error("Local storage sync error:", e);
  }

  // 2. Sync to PostgreSQL (full content including PDF)
  try {
    // Map to db shape before posting
    const dbPayload = {
      id: sanitized.id,
      title: sanitized.title,
      author: sanitized.author,
      author_email: sanitized.authorEmail,
      affiliation: sanitized.affiliation,
      orcid: sanitized.orcid,
      mobile_number: sanitized.mobileNumber,
      co_authors: sanitized.co_authors,
      format: sanitized.format,
      word_count: Number(sanitized.wordCount || 0),
      page_count: Number(sanitized.pageCount || 1),
      pref1: sanitized.pref1,
      pref2: sanitized.pref2,
      pref3: sanitized.pref3,
      current_reviewer_id: sanitized.currentReviewerId,
      preference_index: sanitized.preferenceIndex,
      assignment_status: sanitized.assignmentStatus,
      status: sanitized.status,
      submitted_at: sanitized.submittedAt,
      due_date: sanitized.dueDate,
      reviewer_id: sanitized.reviewerId,
      reviewer_name: sanitized.reviewerName,
      journal: sanitized.journal,
      score: sanitized.score,
      doi: sanitized.doi,
      comments: sanitized.comments,
      sections: sanitized.sections,
      uploaded_pdf_name: sanitized.uploadedPdfName,
      uploaded_pdf_content: sanitized.uploadedPdfContent,
      evaluated_at: sanitized.evaluatedAt,
      assigned_at: sanitized.assignedAt,
      ai_score: sanitized.aiScore,
      rubric_rigor: sanitized.rubricRigor,
      rubric_style: sanitized.rubricStyle,
      rubric_novelty: sanitized.rubricNovelty,
    };
    
    await savePaper(dbPayload as any);
  } catch (e) {
    console.error("Failed to save paper to PostgreSQL database:", e);
  }
}


export async function deletePaperFromStore(id: string): Promise<void> {
  // 1. Sync to local storage first
  try {
    const localRaw = localStorage.getItem("abroad_submitted_papers");
    if (localRaw) {
      let local = JSON.parse(localRaw);
      local = local.filter((p: any) => p.id !== id);
      localStorage.setItem("abroad_submitted_papers", JSON.stringify(local));
    }
  } catch (e) {
    console.error("Local storage delete error:", e);
  }

  // 2. Delete from PostgreSQL
  try {
    await deletePaper(id);
  } catch (e) {
    console.error("Failed to delete paper from PostgreSQL database:", e);
  }
}
