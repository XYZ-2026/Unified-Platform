import { API_BASE_URL } from "./apiConfig";

export interface PaperSection {
  id: string;
  title: string;
  html: string;
}

export interface Paper {
  id: string;
  title: string;
  author: string;
  authorEmail: string;
  affiliation: string;
  orcid?: string | null;
  mobileNumber?: string | null;
  co_authors?: string | null;
  format: string;
  wordCount: string;
  pageCount: string;
  pref1?: string | null;
  pref2?: string | null;
  pref3?: string | null;
  currentReviewerId?: string | null;
  preferenceIndex?: number;
  assignmentStatus?: string | null;
  status: string;
  submittedAt?: string;
  dueDate?: string | null;
  reviewerId?: string | null;
  reviewerName?: string | null;
  journal?: string | null;
  score?: number;
  doi?: string | null;
  comments?: string | null;
  sections: PaperSection[];
  uploadedPdfName?: string | null;
  uploadedPdfContent?: string | null;
  evaluatedAt?: string | null;
  assignedAt?: string | null;
  aiScore?: number | null;
  rubricRigor?: number | null;
  rubricStyle?: number | null;
  rubricNovelty?: number | null;
}

export async function fetchPapers(): Promise<Paper[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE_URL}/papers`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error("Failed to fetch papers list");
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function fetchPaperById(id: string): Promise<Paper> {
  const res = await fetch(`${API_BASE_URL}/papers/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch paper: ${id}`);
  return await res.json();
}

export async function savePaper(paper: Paper): Promise<Paper> {
  const res = await fetch(`${API_BASE_URL}/papers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paper),
  });
  if (!res.ok) throw new Error("Failed to save paper to database");
  return await res.json();
}

export async function deletePaper(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/papers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete paper from database");
}

export interface ManuscriptEvaluation {
  id: string;
  title: string;
  pdf_name: string;
  pdf_text_content?: string;
  score_novelty: number;
  score_clarity: number;
  score_methodology: number;
  score_citations: number;
  overall_score: number;
  peer_review_feedback: string;
  created_at: string;
}

export async function evaluateManuscript(payload: {
  text?: string;
  pdfBase64?: string;
  fileName?: string;
  userId?: string;
}): Promise<ManuscriptEvaluation> {
  const res = await fetch(`${API_BASE_URL}/api/reviewer/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Manuscript evaluation failed");
  return await res.json();
}

export async function fetchReviewHistory(userId: string): Promise<Partial<ManuscriptEvaluation>[]> {
  const res = await fetch(`${API_BASE_URL}/api/reviewer/history?user_id=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch manuscript evaluation history");
  return await res.json();
}

export async function fetchReviewDetails(id: string): Promise<ManuscriptEvaluation> {
  const res = await fetch(`${API_BASE_URL}/api/reviewer/evaluation/${id}`);
  if (!res.ok) throw new Error("Failed to fetch manuscript evaluation details");
  return await res.json();
}

export async function deleteReview(id: string, userId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/reviewer/evaluation/${id}?user_id=${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete manuscript evaluation");
}


