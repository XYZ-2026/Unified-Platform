"use client";

import React, { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { sanitizeHtml } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/apiConfig";
import { useToast, ToastContainer } from "@/components/Toast";
import { useAuth } from "@/context/AuthContext";
import {
  IconSend,
  IconSparkles,
  IconChevronLeft,
  IconDeviceFloppy,
  IconDownload,
  IconBook,
  IconChevronRight,
  IconUpload,
  IconX,
  IconArrowRight,
  IconFileTypePdf,
} from "@tabler/icons-react";


/* ── Lazy-load the editor so SSR doesn't break ─────────────────── */
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex-grow flex items-center justify-center bg-white border border-[#E7E2DE] rounded-2xl">
      <div className="w-10 h-10 border-3 border-[#690B1B] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

/* ── Helper: strip HTML to plain text for word count ────────────── */
function stripHTML(html: string): string {
  if (typeof document === "undefined") return "";
  const el = document.createElement("div");
  el.innerHTML = html;
  return el.textContent || el.innerText || "";
}

/* ── Helper: strip leading duplicate section headings ────────────── */
function cleanSectionHtmlForExport(html: string): string {
  if (!html) return "";
  let cleaned = html.trim();
  const headerRegex = /^<h[1-3]>[^<]*(?:introduction|methodology|results|discussion|conclusion|references|abstract)[^<]*<\/h[1-3]>/i;
  if (headerRegex.test(cleaned)) {
    cleaned = cleaned.replace(headerRegex, "").trim();
  }
  return cleaned;
}

/* ── Section type ───────────────────────────────────────────────── */
interface SectionContent {
  id: string;
  title: string;
  html: string;
}

function formatAuthorForRef(authorName: string): string {
  if (!authorName || authorName === "Author Name") return "J. Doe";
  const parts = authorName.trim().split(/\s+/);
  if (parts.length >= 2) {
    const firstInitial = parts[0][0].toUpperCase();
    const lastName = parts[parts.length - 1];
    return `${firstInitial}. ${lastName}`;
  }
  return authorName;
}

/* ── Default sections with HTML content ─────────────────────────── */
function getPaperContent(topic: string, author = "Author Name") {
  const t = topic.toLowerCase();
  const formattedAuthor = formatAuthorForRef(author);
  
  if (t.includes("federated") || t.includes("privacy")) {
    return {
      abstract: `<p>Privacy regulations pose constraints for training clinical models across multi-institutional pediatric databases. This paper details a federated learning architecture that allows training diagnostic models locally, aggregating model weights securely, and preserving patient privacy.</p>
<p>Validated on multi-site clinical datasets, the proposed federated schema achieves a convergence AUROC of <strong>0.92</strong>, within 1.5% of a centrally trained model, verifying diagnostic validity while maintaining HIPAA compliance.</p>`,
      intro: `<p>Data sharing in pediatric medicine is highly restricted due to ethical and legal constraints. Centralizing sensitive patient records introduces security risks, making traditional deep learning models difficult to scale across multiple institutions.</p>
<p>Federated Learning (FL) provides a decentralized alternative where training occurs locally at each hospital site, and only model updates (gradients or weights) are shared with a central aggregator.</p>
<p>However, securing FL against gradient inversion attacks and handling heterogeneous data distribution (non-IID) remain open challenges in clinical deployment.</p>`,
      methods: `<h3>2.1 Secure Weight Aggregation</h3>
<p>We deploy the Federated Averaging (FedAvg) algorithm combined with secure multi-party computation. The global model update at epoch <em>t+1</em> is computed as:</p>
<blockquote><p>w<sub>t+1</sub> = &Sigma; (n<sub>k</sub> / n) &middot; w<sub>t+1</sub><sup>(k)</sup></p></blockquote>
<p>where <em>n<sub>k</sub></em> is the number of local samples at node <em>k</em>, and <em>w<sup>(k)</sup></em> represents the local model weights. To ensure privacy, cryptographic noise is injected into updates via differential privacy protocols before aggregation.</p>`,
      results: `<p>The federated framework was evaluated across three simulated hospital nodes using pediatric clinical cohorts. The global model achieved a convergence AUROC of <strong>0.92</strong>, demonstrating robust diagnostic generalizability. We observed minimal performance degradation compared to centralized training baselines, validating the efficacy of secure aggregation.</p>
<h3>Table I: Federated Model Performance</h3>
<table>
  <tr><th>Node</th><th>Local Samples</th><th>Local AUROC</th><th>Federated AUROC</th></tr>
  <tr><td>Hospital A</td><td>3,200</td><td>0.89</td><td><strong>0.92</strong></td></tr>
  <tr><td>Hospital B</td><td>4,500</td><td>0.91</td><td><strong>0.92</strong></td></tr>
  <tr><td>Hospital C</td><td>2,800</td><td>0.88</td><td><strong>0.92</strong></td></tr>
</table>`,
      conclusion: `<p>We demonstrated privacy-preserving federated training for pediatric diagnostics, showing that decentralized training can match centralized performance while preserving confidentiality. Future work will investigate differential privacy optimization and robust aggregation under adversarial conditions.</p>
<ul>
  <li>Prospective clinical validation of global aggregated parameters</li>
  <li>Optimizing client communication efficiency in low-bandwidth networks</li>
  <li>Investigating client-level differential privacy bounds</li>
</ul>`,
      references: `<ol>
  <li>${formattedAuthor}, "Federated Learning Schemas in Privacy-Preserving Pediatric Diagnostics," <em>High School Journal of Computing and AI</em>, vol. 4, no. 2, pp. 112–120, 2024.</li>
  <li>J. Doe and R. Smith, "Decentralized Deep Sequence Modeling for Real-Time Clinical Analysis," <em>IEEE Transactions on Biomedical Engineering</em>, vol. 52, no. 6, pp. 430–439, 2023.</li>
</ol>`
    };
  } else {
    return {
      abstract: `<p>Early identification of pediatric sepsis in Intensive Care Units (ICUs) remains a significant clinical challenge due to the rapid progression of physiological deterioration. This paper introduces an optimized transformer-based neural architecture designed to analyze multi-modal clinical time-series data. By incorporating self-attention mechanisms across varying temporal scales, our approach models complex physiological correlations over extended windows.</p>
<p>Validated on clinical datasets, the proposed architecture achieves a predictive AUROC of <strong>0.94</strong>, outperforming traditional recurrent networks and clinical scoring tools. These results highlight the potential of deep learning sequence modeling to augment real-time ICU diagnostic alert systems.</p>`,
      intro: `<p>Sepsis is characterized by a life-threatening organ dysfunction caused by a dysregulated host response to infection. In pediatric populations, the pathophysiology of sepsis is uniquely dynamic, requiring prompt diagnostic intervention to mitigate risks of severe tissue hypoxia and shock <sup>[1]</sup>.</p>
<p>Traditionally, clinical rule-based scores such as the Pediatric Sequential Organ Failure Assessment (pSOFA) have been used to identify early-stage organ failure. However, these scores often exhibit latency and fail to capture multi-variable temporal interactions.</p>
<p>Recent machine learning advances offer promising directions, yet modeling heterogeneous, irregularly sampled physiological sequences remains a core constraint.</p>`,
      methods: `<p>Our dataset consists of high-frequency physiological time-series extracted from pediatric ICU EHR systems. Variables include heart rate, systolic blood pressure, peripheral oxygen saturation, and body temperature.</p>
<h3>2.1 Model Architecture</h3>
<p>The proposed model utilizes a <strong>multi-head temporal self-attention block</strong>. Let <em>X ∈ ℝ<sup>T×D</sup></em> represent the clinical sequence. The Query, Key, and Value matrices are formulated as:</p>
<blockquote><p><strong>Q</strong> = X · W<sub>Q</sub>,&nbsp;&nbsp;<strong>K</strong> = X · W<sub>K</sub>,&nbsp;&nbsp;<strong>V</strong> = X · W<sub>V</sub></p></blockquote>
<p>The attention mechanism is calculated using a scaled dot-product format:</p>
<blockquote><p>Attention(Q, K, V) = Softmax( (Q · K<sup>T</sup>) / √d<sub>k</sub> ) · V</p></blockquote>
<p>This formulation allows the network to dynamically assign predictive weights to physiological changes observed several hours before overt clinical deterioration.</p>`,
      results: `<p>The predictive transformer model was benchmarked against baseline recurrent neural architectures (LSTM, GRU) and classical regression models. The model achieved a peak sensitivity of <strong>91.2%</strong> and a specificity of <strong>87.5%</strong> with a lead time of 4 hours prior to sepsis onset.</p>
<h3>Table I: Model Performance Metrics</h3>
<table>
  <tr><th>Metric</th><th>LSTM Base</th><th>GRU Model</th><th>Transformer</th></tr>
  <tr><td>AUROC</td><td>0.82</td><td>0.84</td><td><strong>0.94</strong></td></tr>
  <tr><td>Sensitivity</td><td>81.2%</td><td>83.0%</td><td><strong>91.2%</strong></td></tr>
  <tr><td>F1-Score</td><td>0.78</td><td>0.81</td><td><strong>0.89</strong></td></tr>
</table>
<p>These findings suggest that modeling contextual long-term correlations is crucial for robust predictive diagnostics in pediatric care.</p>`,
      conclusion: `<p>In this work, we developed and validated a temporal transformer architecture for the early detection of pediatric sepsis. By employing multi-head self-attention, the model effectively captures early physiological decline, outperforming standard recurrent neural networks.</p>
<p>Future work will focus on:</p>
<ul>
  <li>Prospective clinical validation across multiple hospital sites</li>
  <li>Testing federated learning schemas for privacy-preserving multi-site training</li>
  <li>Investigating attention visualization for clinician-interpretable insights</li>
</ul>`,
      references: `<ol>
  <li>${formattedAuthor}, "Transformer-Based Sepsis Prediction in Pediatric ICU Settings," <em>High School Journal of Engineering and Innovation</em>, vol. 4, no. 2, pp. 112–120, 2024.</li>
  <li>J. Doe and R. Smith, "Deep Sequence Modeling for Real-Time Physiological Time-Series Analysis," <em>IEEE Transactions on Biomedical Engineering</em>, vol. 52, no. 6, pp. 430–439, 2023.</li>
</ol>`
    };
  }
}

const buildDefaultSections = (topic: string, includeTitlePage: boolean, author = "Author Name", affiliation = "Independent Researcher"): SectionContent[] => {
  const sections: SectionContent[] = [];
  const content = getPaperContent(topic, author);
  
  if (includeTitlePage) {
    sections.push({
      id: "title",
      title: "Title & Affiliations",
      html: `<h1 style="text-align: center">${topic.toUpperCase()}</h1>
<p style="text-align: center"><strong>${author}</strong><br>${affiliation}</p>
<hr>
<p><strong>Abstract</strong> — ${stripHTML(content.abstract).replace(/^Abstract\s*—\s*/i, "")}</p>`,
    });
  }

  sections.push(
    {
      id: "abstract",
      title: "Abstract",
      html: content.abstract,
    },
    {
      id: "intro",
      title: "1. Introduction",
      html: content.intro,
    },
    {
      id: "methods",
      title: "2. Methodology",
      html: content.methods,
    },
    {
      id: "results",
      title: "3. Results & Discussion",
      html: content.results,
    },
    {
      id: "conclusion",
      title: "4. Conclusion",
      html: content.conclusion,
    },
    {
      id: "references",
      title: "References",
      html: content.references,
    }
  );

  return sections;
};

/* ═══════════════════════════════════════════════════════════════════ */
/*                         STUDIO CONTENT                            */
/* ═══════════════════════════════════════════════════════════════════ */

function StudioContent() {
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTopic = searchParams?.get("topic") || "Early Sepsis Detection Using Transformer Architectures";
  const format = searchParams?.get("format") || "ieee";
  const doubleSpaced = searchParams?.get("doubleSpaced") === "true";
  const titlePage = searchParams?.get("titlePage") === "true";
  const margins = searchParams?.get("margins") === "true";

  const role = searchParams?.get("role"); // "reviewer" or "publisher"
  const paperId = searchParams?.get("paperId");

  const [showReviewModal, setShowReviewModal] = useState<"none" | "reject" | "comment">("none");
  const [reviewComment, setReviewComment] = useState("");
  const [successNotification, setSuccessNotification] = useState("");
  const { toasts, toast, dismiss } = useToast();
  const { userData } = useAuth();
  const [paperAuthor, setPaperAuthor] = useState<string>("");
  const [paperAffiliation, setPaperAffiliation] = useState<string>("");
  const [paperStatus, setPaperStatus] = useState<string>("");
  const [paperAssignmentStatus, setPaperAssignmentStatus] = useState<string>("");
  const [draftId, setDraftId] = useState<string>("");
  const [currentReviewerName, setCurrentReviewerName] = useState<string>("Dr. Elizabeth Vance");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generationStep, setGenerationStep] = useState(0);
  const [isHumanising, setIsHumanising] = useState(false);
  const [humaniseStep, setHumaniseStep] = useState(0);

  /* ── PDF Upload state (for papers uploaded via PDF) ────────────── */
  const [uploadedPdfContent, setUploadedPdfContent] = useState<string>("");
  const [uploadedPdfName, setUploadedPdfName] = useState<string>("");

  /* ── PDF Re-upload modal state (for reverted PDF papers) ─────────── */
  const [showPdfReuploadModal, setShowPdfReuploadModal] = useState(false);
  const [pdfReuploadFile, setPdfReuploadFile] = useState<File | null>(null);
  const [pdfReuploadError, setPdfReuploadError] = useState("");
  const [isPdfReuploading, setIsPdfReuploading] = useState(false);

  useEffect(() => {
    const initPaper = async () => {
      try {
        const currentAuthor = userData?.fullName || "Author Name";
        const currentEmail = userData?.email || "author@example.com";
        const currentAffiliation = userData?.institution || "Independent Researcher";

        const { getPapersList } = await import("@/lib/papersStore");
        const stored = await getPapersList();
        const paper = stored.find((p: any) => (paperId && p.id === paperId) || (!paperId && p.title === rawTopic));
        if (paper) {
          setPaperStatus(paper.status);
          setPaperAssignmentStatus(paper.assignmentStatus || "");
          setDraftId(paper.id);
          if (paper.reviewerName) setCurrentReviewerName(paper.reviewerName);
          if (paper.author) setPaperAuthor(paper.author);
          if (paper.affiliation) setPaperAffiliation(paper.affiliation);
          if (paper.aiScore !== undefined && paper.aiScore !== null) {
            setAiScore(paper.aiScore);
            setAiCheckStatus("done");
          }
          if (paper.score !== undefined && paper.score !== null) {
            setQualityScore(paper.score);
            setQualityCheckStatus("done");
          }
          if (paper.rubricRigor !== undefined && paper.rubricRigor !== null) {
            setRubricRigor(paper.rubricRigor);
          }
          if (paper.rubricStyle !== undefined && paper.rubricStyle !== null) {
            setRubricStyle(paper.rubricStyle);
          }
          if (paper.rubricNovelty !== undefined && paper.rubricNovelty !== null) {
            setRubricNovelty(paper.rubricNovelty);
          }
          // If this is a PDF-uploaded manuscript, load PDF content and skip section loading
          if (paper.uploadedPdfContent) {
            setUploadedPdfContent(paper.uploadedPdfContent);
            setUploadedPdfName(paper.uploadedPdfName || paper.title || "Manuscript PDF");
            setSections([]);
          } else if (paper.sections && Array.isArray(paper.sections) && paper.sections.length > 0) {
            const sanitizedSections = paper.sections.map((s: any) => ({
              ...s,
              html: sanitizeHtml(s.html)
            }));
            setSections(sanitizedSections);
          }
          setIsGenerating(false);
          setLoading(false);
        } else {
          setPaperAuthor(currentAuthor);
          setPaperAffiliation(currentAffiliation);
          const generatedId = paperId || `draft-${Math.floor(Math.random() * 100000)}`;
          setDraftId(generatedId);
          if (!role) {
            setIsGenerating(true);
            setLoading(false);
            setGenerationStep(1);
            
            const step2Timer = setTimeout(() => setGenerationStep(2), 4000);
            const step3Timer = setTimeout(() => setGenerationStep(3), 12000);
            
            try {
              const res = await fetch(`${API_BASE_URL}/generate-paper`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  topic: rawTopic,
                  format: format,
                  include_title_page: titlePage,
                }),
              });
              
              clearTimeout(step2Timer);
              clearTimeout(step3Timer);
              
              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || `API returned status ${res.status}`);
              }
              
              const data = await res.json();
              let generatedSections = data.sections.map((s: any) => ({
                ...s,
                html: sanitizeHtml(s.html)
              }));
              
              if (titlePage) {
                const abstractHtml = generatedSections.find((s: any) => s.id === "abstract")?.html || "";
                const titleHtml = `<h1 style="text-align: center">${rawTopic.toUpperCase()}</h1>
<p style="text-align: center"><strong>${currentAuthor}</strong><br>${currentAffiliation}</p>
<hr>
<p><strong>Abstract</strong> &mdash; ${stripHTML(abstractHtml).replace(/^Abstract\s*(?:—|&mdash;)\s*/i, "")}</p>`;
                generatedSections = [
                  { id: "title", title: "Title & Affiliations", html: titleHtml },
                  ...generatedSections
                ];
              }
              
              const wordCountVal = generatedSections.reduce(
                (sum: number, s: any) => sum + stripHTML(s.html).split(/\s+/).filter(Boolean).length,
                0
              );
              const pageCountVal = Math.max(1, Math.ceil(wordCountVal / 380));
              
              const newDraft = {
                id: generatedId,
                title: rawTopic,
                author: currentAuthor,
                authorEmail: currentEmail,
                affiliation: currentAffiliation,
                format: format,
                wordCount: wordCountVal.toString(),
                pageCount: pageCountVal.toString(),
                score: qualityScore !== null ? qualityScore : 85,
                rubricRigor: rubricRigor !== null ? rubricRigor : 8.5,
                rubricStyle: rubricStyle !== null ? rubricStyle : 8.5,
                rubricNovelty: rubricNovelty !== null ? rubricNovelty : 8.5,
                status: "In Progress",
                submittedAt: new Date().toISOString(),
                assignmentStatus: null,
                pref1: "",
                pref2: "",
                pref3: "",
                currentReviewerId: "",
                dueDate: null,
                doi: "N/A",
                sections: generatedSections,
              };
              
              const { updatePaperInStore } = await import("@/lib/papersStore");
              await updatePaperInStore(newDraft as any);
              setSections(generatedSections);
            } catch (error: any) {
              console.error("AI Research Paper generator offline/error, using fallback:", error);
              toast.error(`AI Paper generation failed: ${error.message || error}. Reverting to offline template.`);
              const initialSections = buildDefaultSections(rawTopic, titlePage, currentAuthor, currentAffiliation).map((s) => ({
                ...s,
                html: sanitizeHtml(s.html)
              }));
              const initialWords = initialSections.reduce(
                (sum, s) => sum + stripHTML(s.html).split(/\s+/).filter(Boolean).length,
                0
              );
              const initialPages = Math.max(1, Math.ceil(initialWords / 380));
              const newDraft = {
                id: generatedId,
                title: rawTopic,
                author: currentAuthor,
                authorEmail: currentEmail,
                affiliation: currentAffiliation,
                format: format,
                wordCount: initialWords.toString(),
                pageCount: initialPages.toString(),
                score: qualityScore !== null ? qualityScore : 85,
                rubricRigor: rubricRigor !== null ? rubricRigor : 8.5,
                rubricStyle: rubricStyle !== null ? rubricStyle : 8.5,
                rubricNovelty: rubricNovelty !== null ? rubricNovelty : 8.5,
                status: "In Progress",
                submittedAt: new Date().toISOString(),
                assignmentStatus: null,
                pref1: "",
                pref2: "",
                pref3: "",
                currentReviewerId: "",
                dueDate: null,
                doi: "N/A",
                sections: initialSections,
              };
              const { updatePaperInStore } = await import("@/lib/papersStore");
              await updatePaperInStore(newDraft as any);
              setSections(initialSections);
            } finally {
              setIsGenerating(false);
              setGenerationStep(0);
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        }
      } catch (e) {
        console.error(e);
        setIsGenerating(false);
        setLoading(false);
      }
    };
    initPaper();
  }, [paperId, rawTopic, role, userData]);



  const updatePaperStatus = async (status: string, comment: string) => {
    try {
      const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
      const stored = await getPapersList();
      let paper = stored.find((p: any) => (paperId && p.id === paperId) || (!paperId && p.title === rawTopic));
      
      if (paper) {
        paper.status = status;
        paper.comments = comment;
        paper.evaluatedAt = new Date().toISOString();
        paper.sections = sections.map((s: any) => ({
          ...s,
          html: sanitizeHtml(s.html)
        })); // Save latest sections!
        paper.aiScore = aiScore;
        if (status === "Rejected Draft") {
          paper.assignmentStatus = null;
          paper.currentReviewerId = "";
          paper.dueDate = null;
        }
      } else {
        const wordCountVal = sections.reduce(
          (sum, s) => sum + stripHTML(s.html).split(/\s+/).filter(Boolean).length,
          0
        );
        const pageCountVal = Math.max(1, Math.ceil(wordCountVal / 380));

        paper = {
          id: paperId || `asn-${Math.floor(Math.random() * 1000) + 200}`,
          title: rawTopic,
          author: paperAuthor || userData?.fullName || "Author Name",
          authorEmail: userData?.email || "author@example.com",
          affiliation: paperAffiliation || userData?.institution || "Independent Researcher",
          format: format,
          wordCount: wordCountVal.toString(),
          pageCount: pageCountVal.toString(),
          reviewerId: "elizabeth-vance",
          reviewerName: "Dr. Elizabeth Vance",
          journal: "High School Journal of Engineering and Innovation",
          score: 94,
          status: status,
          comments: comment,
          submittedAt: new Date().toISOString(),
          evaluatedAt: new Date().toISOString(),
          doi: status === "Accepted" ? "10.5142/as.2026." + Math.floor(1000 + Math.random() * 9000) : "N/A",
          sections: sections,
          aiScore: aiScore,
        } as any;
      }

      await updatePaperInStore(paper!);
      setPaperStatus(status);

      let successMsg = `Paper successfully updated!`;
      if (status === "Awaiting Publisher") {
        successMsg = "Paper approved! Sent to publisher.";
      } else if (status === "Rejected Draft") {
        successMsg = "Paper reverted to author with comments.";
      } else if (status === "Accepted") {
        successMsg = "Paper successfully published!";
      } else if (status === "Rejected") {
        successMsg = "Paper rejected.";
      }
      router.push(`/dashboard?successMsg=${encodeURIComponent(successMsg)}`);
    } catch (e) {
      console.error("Failed to update paper status:", e);
      toast.error("An error occurred while updating the paper status.");
    }
  };

  const handleReviewAction = (action: "Accept" | "Reject" | "Comment") => {
    if (action === "Accept") {
      const nextStatus = role === "reviewer" ? "Awaiting Publisher" : "Accepted";
      updatePaperStatus(nextStatus, "");
    } else if (action === "Reject") {
      setShowReviewModal("reject");
      setReviewComment("");
    } else if (action === "Comment") {
      setShowReviewModal("comment");
      setReviewComment("");
    }
  };

  const submitReviewFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.warning("Feedback is mandatory!");
      return;
    }
    const nextStatus = role === "reviewer" ? "Rejected Draft" : "Rejected";
    updatePaperStatus(nextStatus, reviewComment.trim());
    setShowReviewModal("none");
  };

  /* ── Mobile layout active tab ──────────────────────────────────── */
  const [mobileTab, setMobileTab] = useState<"outline" | "write" | "ai">("write");

  /* ── Section state ──────────────────────────────────────────────── */
  const [sections, setSections] = useState<SectionContent[]>([]);

  const [activeSectionId, setActiveSectionId] = useState<string>(() =>
    titlePage ? "title" : "abstract"
  );

  /* ── Active section's HTML content for the editor ───────────────── */
  const activeContent = sections.find((s) => s.id === activeSectionId)?.html || "";

  /* ── Handle editor content updates ──────────────────────────────── */
  const handleEditorUpdate = useCallback(
    (html: string) => {
      setSections((prev) =>
        prev.map((s) => (s.id === activeSectionId ? { ...s, html } : s))
      );
      setIsSaving(true);
    },
    [activeSectionId]
  );

  /* ── AI chat state ──────────────────────────────────────────────── */
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text:
        "Welcome to the Paper Studio! I have pre-formatted your workspace under the " +
        format.toUpperCase() +
        " style. How can I assist you with your paper draft today?",
    },
  ]);
  const [promptInput, setPromptInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* ── AI Content Detection state ─────────────────────────────────── */
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [aiCheckStatus, setAiCheckStatus] = useState<"idle" | "checking" | "done" | "error">("idle");
  const [aiReasoning, setAiReasoning] = useState<string>("");
  const [aiConfidence, setAiConfidence] = useState<"low" | "medium" | "high">("medium");
  const [aiLastChecked, setAiLastChecked] = useState<Date | null>(null);
  const aiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);

  /* ── AI Quality Evaluation state ────────────────────────────────── */
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [rubricRigor, setRubricRigor] = useState<number | null>(null);
  const [rubricStyle, setRubricStyle] = useState<number | null>(null);
  const [rubricNovelty, setRubricNovelty] = useState<number | null>(null);
  const [qualityCheckStatus, setQualityCheckStatus] = useState<"idle" | "checking" | "done" | "error">("idle");
  const qualityAbortRef = useRef<AbortController | null>(null);

  /* ── Real Auto-save & Parameter Persistence ───────────────────────── */
  // Append url search params with paperId if it isn't there, so that page reload does not regenerate
  useEffect(() => {
    if (draftId && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("paperId") !== draftId) {
        params.set("paperId", draftId);
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [draftId]);

  const savePaperDraft = useCallback(async () => {
    if (!draftId || isGenerating) return;
    try {
      const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
      const stored = await getPapersList();
      let paper = stored.find((p: any) => p.id === draftId);
      
      const wordCountVal = uploadedPdfContent 
        ? stripHTML(uploadedPdfContent).split(/\s+/).filter(Boolean).length
        : sections.reduce(
            (sum, s) => sum + stripHTML(s.html).split(/\s+/).filter(Boolean).length,
            0
          );
      const pageCountVal = Math.max(1, Math.ceil(wordCountVal / 380));

      const updatedPaper = {
        ...(paper || {}),
        id: draftId,
        title: rawTopic,
        author: paperAuthor || userData?.fullName || "Author Name",
        authorEmail: userData?.email || "author@example.com",
        affiliation: paperAffiliation || userData?.institution || "Independent Researcher",
        format: format,
        wordCount: wordCountVal.toString(),
        pageCount: pageCountVal.toString(),
        score: qualityScore !== null ? qualityScore : (paper?.score || 85),
        rubricRigor: rubricRigor !== null ? rubricRigor : (paper?.rubricRigor || 8.5),
        rubricStyle: rubricStyle !== null ? rubricStyle : (paper?.rubricStyle || 8.5),
        rubricNovelty: rubricNovelty !== null ? rubricNovelty : (paper?.rubricNovelty || 8.5),
        status: paperStatus || (paper?.status || "In Progress"),
        assignmentStatus: paperAssignmentStatus || (paper?.assignmentStatus || null),
        reviewerName: currentReviewerName || (paper?.reviewerName || "Dr. Elizabeth Vance"),
        sections: sections,
        aiScore: aiScore !== null ? aiScore : (paper?.aiScore || null),
        uploadedPdfContent: uploadedPdfContent || (paper?.uploadedPdfContent || null),
        uploadedPdfName: uploadedPdfName || (paper?.uploadedPdfName || null),
      };
      
      await updatePaperInStore(updatedPaper as any);
    } catch (e) {
      console.error("Auto-save failed:", e);
    }
  }, [
    draftId,
    isGenerating,
    sections,
    uploadedPdfContent,
    uploadedPdfName,
    rawTopic,
    paperAuthor,
    userData,
    paperAffiliation,
    format,
    qualityScore,
    rubricRigor,
    rubricStyle,
    rubricNovelty,
    paperStatus,
    paperAssignmentStatus,
    currentReviewerName,
    aiScore
  ]);

  useEffect(() => {
    if (!draftId || isGenerating) return;
    setIsSaving(true);
    const delayDebounceFn = setTimeout(async () => {
      await savePaperDraft();
      setIsSaving(false);
    }, 1000); // 1 second debounce

    return () => clearTimeout(delayDebounceFn);
  }, [
    sections,
    uploadedPdfContent,
    uploadedPdfName,
    aiScore,
    qualityScore,
    rubricRigor,
    rubricStyle,
    rubricNovelty,
    paperAuthor,
    paperAffiliation,
    savePaperDraft,
    draftId,
    isGenerating
  ]);

  /* ── AI Content Detection & Quality Evaluation logic ────────────────── */
  const runAiDetection = useCallback(async (sectionsToCheck?: SectionContent[], isManual: boolean = false) => {
    let payload: any = {};
    if (uploadedPdfContent) {
      const base64Prefix = "data:application/pdf;base64,";
      const rawBase64 = uploadedPdfContent.startsWith(base64Prefix)
        ? uploadedPdfContent.slice(base64Prefix.length)
        : uploadedPdfContent;
      payload = { pdfBase64: rawBase64 };
    } else {
      if (!sectionsToCheck || sectionsToCheck.length === 0) {
        if (isManual) toast.warning("No content sections found to analyze.");
        return;
      }
      // Gather plain text from all sections
      const fullText = sectionsToCheck
        .map((s) => stripHTML(s.html))
        .join(" ")
        .trim();
      const wordCount = fullText.split(/\s+/).filter(Boolean).length;
      if (wordCount < 30) {
        if (isManual) {
          toast.warning("Please write at least 30 words before running AI analysis.");
        }
        return;
      }
      payload = { text: fullText };
    }

    // Cancel previous in-flight request
    if (aiAbortRef.current) {
      aiAbortRef.current.abort();
    }
    const controller = new AbortController();
    aiAbortRef.current = controller;

    setAiCheckStatus("checking");
    try {
      const res = await fetch("/api/detect-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (typeof data.percentage === "number") {
        setAiScore(data.percentage);
        setAiReasoning(data.reasoning || "");
        setAiConfidence(data.confidence || "medium");
        setAiLastChecked(new Date());
        setAiCheckStatus("done");

        // Auto-save the calculated aiScore back to store immediately
        if (draftId) {
          try {
            const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
            const stored = await getPapersList();
            const existingIndex = stored.findIndex((p: any) => p.id === draftId);
            if (existingIndex > -1) {
              const paper = stored[existingIndex];
              paper.aiScore = data.percentage;
              await updatePaperInStore(paper);
            }
          } catch (e) {
            console.error("Auto-saving evaluated aiScore failed:", e);
          }
        }
      } else {
        setAiCheckStatus("error");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("AI detection failed:", err);
        setAiCheckStatus("error");
      }
    }
  }, [uploadedPdfContent, draftId]);

  const runQualityEvaluation = useCallback(async (sectionsToCheck?: SectionContent[]) => {
    let payload: any = {};
    if (uploadedPdfContent) {
      const base64Prefix = "data:application/pdf;base64,";
      const rawBase64 = uploadedPdfContent.startsWith(base64Prefix)
        ? uploadedPdfContent.slice(base64Prefix.length)
        : uploadedPdfContent;
      payload = { pdfBase64: rawBase64 };
    } else {
      if (!sectionsToCheck || sectionsToCheck.length === 0) return;
      const fullText = sectionsToCheck
        .map((s) => stripHTML(s.html))
        .join(" ")
        .trim();
      const wordCount = fullText.split(/\s+/).filter(Boolean).length;
      if (wordCount < 30) return;
      payload = { text: fullText };
    }

    if (qualityAbortRef.current) {
      qualityAbortRef.current.abort();
    }
    const controller = new AbortController();
    qualityAbortRef.current = controller;

    setQualityCheckStatus("checking");
    try {
      const res = await fetch("/api/evaluate-quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (typeof data.score === "number") {
        setQualityScore(data.score);
        setRubricRigor(data.rubric_rigor);
        setRubricStyle(data.rubric_style);
        setRubricNovelty(data.rubric_novelty);
        setQualityCheckStatus("done");

        // Auto-save the calculated score back to store immediately
        if (draftId) {
          try {
            const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
            const stored = await getPapersList();
            const existingIndex = stored.findIndex((p: any) => p.id === draftId);
            if (existingIndex > -1) {
              const paper = stored[existingIndex];
              paper.score = data.score;
              paper.rubricRigor = data.rubric_rigor;
              paper.rubricStyle = data.rubric_style;
              paper.rubricNovelty = data.rubric_novelty;
              await updatePaperInStore(paper);
            }
          } catch (e) {
            console.error("Auto-saving evaluated quality failed:", e);
          }
        }
      } else {
        setQualityCheckStatus("error");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("Quality evaluation failed:", err);
        setQualityCheckStatus("error");
      }
    }
  }, [uploadedPdfContent, draftId]);

  // Initial trigger: fire 3s after sections first become non-empty or PDF loaded
  const hasInitiallyDetected = useRef(false);
  useEffect(() => {
    if (hasInitiallyDetected.current) return;
    const hasContent = sections.length > 0 || !!uploadedPdfContent;
    if (hasContent) {
      const needAi = aiScore === null;
      const needQuality = qualityScore === null;

      if (!needAi && !needQuality) {
        hasInitiallyDetected.current = true;
        return;
      }
      const timer = setTimeout(() => {
        hasInitiallyDetected.current = true;
        if (needAi) runAiDetection(sections);
        if (needQuality) runQualityEvaluation(sections);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sections, uploadedPdfContent, runAiDetection, runQualityEvaluation, aiScore, qualityScore]);

  // Debounce: run detection 8s after last content change (rate-limit friendly)
  useEffect(() => {
    if (sections.length === 0 || role) return; // skip for reviewers
    if (!hasInitiallyDetected.current) return; // let initial trigger handle first run
    if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    aiDebounceRef.current = setTimeout(() => {
      runAiDetection(sections);
      runQualityEvaluation(sections);
    }, 8000);
    return () => {
      if (aiDebounceRef.current) clearTimeout(aiDebounceRef.current);
    };
  }, [sections, runAiDetection, runQualityEvaluation, role]);

  // Periodic re-check every 2 minutes
  useEffect(() => {
    if (role) return; // skip for reviewers
    if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    aiIntervalRef.current = setInterval(() => {
      setSections((prev) => {
        runAiDetection(prev);
        runQualityEvaluation(prev);
        return prev;
      });
    }, 120000);
    return () => {
      if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
      if (aiAbortRef.current) aiAbortRef.current.abort();
      if (qualityAbortRef.current) qualityAbortRef.current.abort();
    };
  }, [runAiDetection, runQualityEvaluation, role]);



  /* ── Send AI prompt handler ─────────────────────────────────────── */
  const handleSendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    const userMsg = promptInput;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setPromptInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/co-write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMsg,
          section_id: activeSectionId,
          section_title: sections.find((s) => s.id === activeSectionId)?.title || "",
          section_html: activeContent,
          topic: rawTopic,
          format: format,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.response }]);
      setIsTyping(false);
    } catch (error) {
      console.warn("AI Co-Writer Backend offline, using fallback:", error);
      // Fallback
      setTimeout(() => {
        let aiResponse =
          "I have reviewed your selection. Let me know if you would like me to rewrite or format it in the chosen " +
          format.toUpperCase() +
          " style.";

        if (userMsg.toLowerCase().includes("improve") || userMsg.toLowerCase().includes("tone")) {
          aiResponse = `Rewriting section for formal academic tone:\n\n"The clinical relevance of early forecasting models lies in their predictive ability to alert ICU teams before significant decompensation occurs. Rather than relying on simple scoring thresholds, modeling dynamic self-attention establishes predictive weights across multiple physiological cycles, maximizing sensitivity."`;
        } else if (userMsg.toLowerCase().includes("citation") || userMsg.toLowerCase().includes("cite")) {
          const refName = paperAuthor ? formatAuthorForRef(paperAuthor).replace(/^[A-Z]\.\s+/, "") : "Doe";
          aiResponse =
            `I suggest incorporating an APA/IEEE citation here, such as: ${refName} (2024) or [1]. I have updated your references to match this suggestion.`;
        } else if (userMsg.toLowerCase().includes("methods") || userMsg.toLowerCase().includes("formula")) {
          aiResponse =
            "Here is the mathematically robust formulation for Multi-Head Attention:\n\nMultiHead(Q, K, V) = Concat(head₁, ..., headₕ) · W_O\n   where headᵢ = Attention(Q · W_Qᵢ, K · W_Kᵢ, V · W_Vᵢ)";
        }

        setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
        setIsTyping(false);
      }, 1200);
    }
  };

  /* ── AI autocomplete section ────────────────────────────────────── */
  const [completingSectionId, setCompletingSectionId] = useState<string | null>(null);

  const triggerAIAutocomplete = async (sectionId: string) => {
    setCompletingSectionId(sectionId);
    try {
      const res = await fetch(`${API_BASE_URL}/autocomplete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section_id: sectionId,
          section_title: sections.find((s) => s.id === sectionId)?.title || "",
          section_html: sections.find((s) => s.id === sectionId)?.html || "",
          topic: rawTopic,
          format: format,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      const aiInsert = data.suggestion;

      if (sectionId === activeSectionId && editorRef.current) {
        editorRef.current.appendContent(aiInsert);
      } else {
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId ? { ...s, html: s.html + aiInsert } : s
          )
        );
      }
      setIsSaving(true);
      setCompletingSectionId(null);
    } catch (error) {
      console.warn("AI Autocomplete Backend offline, using fallback:", error);
      // Fallback
      setTimeout(() => {
        const aiInsert =
          "<p><em>[AI Extended Insight]</em> Further rigorous ablation testing verified that multi-head temporal blocks outperform standard unidirectional recurrent pipelines. In particular, self-attention parameters successfully suppress high-frequency baseline signal noise without introducing diagnostic latency.</p>";

        if (sectionId === activeSectionId && editorRef.current) {
          editorRef.current.appendContent(aiInsert);
        } else {
          setSections((prev) =>
            prev.map((s) =>
              s.id === sectionId ? { ...s, html: s.html + aiInsert } : s
            )
          );
        }
        setIsSaving(true);
        setCompletingSectionId(null);
      }, 1200);
    }
  };

  /* ── Insert citation into the editor ────────────────────────────── */
  const handleInsertCitation = (cit: string) => {
    if (editorRef.current) {
      editorRef.current.insertContent(` ${cit}`);
    } else {
      setSections((prev) =>
        prev.map((s) =>
          s.id === activeSectionId
            ? { ...s, html: s.html.replace(/<\/p>\s*$/, ` ${cit}</p>`) }
            : s
        )
      );
    }
    setIsSaving(true);
  };

  const getFormatStyles = (formatStyle: string) => {
    // Base styles shared by ALL formats
    const commonBase = `
      * { box-sizing: border-box; }
      body {
        color: #000;
        background: #fff;
        padding: 0;
        margin: 0;
      }
      blockquote, table, pre { page-break-inside: avoid; break-inside: avoid; }
      h1, h2, h3, h4, h5 {
        page-break-after: avoid;
        break-after: avoid;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      th, td {
        border: 1px solid #000;
        padding: 6px 8px;
        text-align: left;
        font-size: inherit;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      th { background-color: #f2f2f2; font-weight: bold; }
      img { max-width: 100%; height: auto; }
      ul, ol { margin: 0.5em 0 0.5em 1.5em; }
      li { margin-bottom: 0.3em; }
      a { color: inherit; text-decoration: underline; }
      .paper-container { width: 100%; }
      @media print {
        .no-print { display: none !important; }
        body { background: #fff !important; }
      }
    `;

    switch (formatStyle.toLowerCase()) {
      case "ieee":
        return `
          ${commonBase}
          @page { size: letter; margin: 0.75in; }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 10pt;
            line-height: 1.3;
          }
          h1, h2, h3, h4 { font-family: "Times New Roman", Times, serif; color: #000; }
          .full-width { width: 100%; }
          .paper-title {
            text-align: center;
            font-size: 20pt;
            font-weight: bold;
            margin: 0 0 12px 0;
            line-height: 1.2;
          }
          .authors {
            text-align: center;
            font-size: 10pt;
            margin-bottom: 6px;
            font-style: italic;
            line-height: 1.5;
          }
          .author-affiliation {
            text-align: center;
            font-size: 9pt;
            color: #444;
            margin-bottom: 18px;
          }
          .abstract-section {
            margin-bottom: 14px;
            font-size: 9.5pt;
            line-height: 1.3;
          }
          .abstract-title { font-weight: bold; font-style: italic; }
          .content-columns {
            column-count: 2;
            column-gap: 0.25in;
          }
          .content-columns > * { margin-top: 0 !important; }
          .content-columns table,
          .content-columns figure,
          .content-columns .katex-display {
            column-span: all;
            -webkit-column-span: all;
            margin: 1.2em 0;
          }
          h2 {
            text-align: center;
            font-size: 10pt;
            text-transform: uppercase;
            font-weight: bold;
            margin: 0 0 10px 0;
            letter-spacing: 0.05em;
          }
          h3 {
            font-size: 10pt;
            font-style: italic;
            font-weight: bold;
            margin: 10px 0 4px 0;
          }
          p {
            text-align: justify;
            text-indent: 0.15in;
            margin: 0 0 4px 0;
          }
        `;
      case "apa":
        return `
          ${commonBase}
          @page { size: letter; margin: 1in; }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 2.0;
          }
          h1, h2, h3, h4 { font-family: "Times New Roman", Times, serif; color: #000; }
          .paper-title {
            text-align: center;
            font-size: 12pt;
            font-weight: bold;
            margin: 3em 0 0.5em 0;
          }
          .authors {
            text-align: center;
            font-size: 12pt;
            margin-bottom: 0.25em;
            line-height: 2.0;
          }
          .author-affiliation {
            text-align: center;
            font-size: 12pt;
            margin-bottom: 3em;
            line-height: 2.0;
          }
          .abstract-section { margin: 0 0 2em 0; }
          .abstract-title {
            text-align: center;
            font-weight: bold;
            display: block;
            margin-bottom: 0;
          }
          .abstract-body { text-indent: 0; }
          p { text-indent: 0.5in; margin: 0; text-align: justify; }
          h2 {
            text-align: center;
            font-size: 12pt;
            font-weight: bold;
            margin: 1em 0 0 0;
          }
          h3 {
            text-align: left;
            font-size: 12pt;
            font-weight: bold;
            font-style: italic;
            margin: 1em 0 0 0;
          }
        `;
      case "mla":
        return `
          ${commonBase}
          @page { size: letter; margin: 1in; }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 2.0;
          }
          h1, h2, h3, h4 { font-family: "Times New Roman", Times, serif; color: #000; }
          .title-block {
            text-align: left;
            margin-bottom: 0;
            line-height: 2.0;
          }
          .paper-title {
            text-align: center;
            font-size: 12pt;
            font-weight: normal;
            margin: 0 0 0.5em 0;
          }
          p { text-indent: 0.5in; margin: 0; text-align: justify; }
          h2 {
            text-align: left;
            font-size: 12pt;
            font-weight: bold;
            margin: 1em 0 0 0;
          }
          h3 {
            text-align: left;
            font-size: 12pt;
            font-weight: bold;
            font-style: italic;
            margin: 0.8em 0 0 0;
          }
        `;
      case "nature":
        return `
          ${commonBase}
          @page { size: letter; margin: 0.8in; }
          body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 9.5pt;
            line-height: 1.5;
            color: #222;
          }
          h1, h2, h3, h4 { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }
          .paper-title {
            font-size: 22pt;
            font-weight: bold;
            margin: 0 0 12px 0;
            color: #111;
            line-height: 1.15;
          }
          .authors { font-size: 10pt; font-weight: bold; margin-bottom: 6px; color: #222; }
          .author-affiliation {
            font-size: 8.5pt;
            color: #555;
            margin-bottom: 18px;
            font-style: italic;
          }
          .abstract-section {
            font-size: 10pt;
            font-weight: 500;
            line-height: 1.5;
            margin-bottom: 20px;
            border-top: 2px solid #000;
            border-bottom: 1px solid #ccc;
            padding: 12px 0;
          }
          .abstract-title {
            font-weight: bold;
            font-size: 8pt;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
            margin-bottom: 6px;
          }
          h2 {
            font-size: 10.5pt;
            font-weight: bold;
            color: #000;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
            margin: 18px 0 6px 0;
            text-transform: uppercase;
          }
          h3 {
            font-size: 10pt;
            font-weight: bold;
            font-style: italic;
            color: #222;
            margin: 14px 0 4px 0;
          }
          p { text-align: justify; margin: 0 0 8px 0; }
        `;
      case "acm":
        return `
          ${commonBase}
          @page { size: letter; margin: 0.75in; }
          body {
            font-family: Georgia, serif;
            font-size: 9.5pt;
            line-height: 1.3;
          }
          h1, h2, h3, h4 { font-family: Georgia, serif; color: #000; }
          .full-width { width: 100%; }
          .paper-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin: 0 0 10px 0;
            line-height: 1.2;
          }
          .authors { text-align: center; font-size: 10pt; margin-bottom: 4px; }
          .author-affiliation {
            text-align: center;
            font-size: 9pt;
            color: #555;
            margin-bottom: 14px;
            font-style: italic;
          }
          .abstract-section {
            background: #fafafa;
            border: 1px solid #e0e0e0;
            padding: 10px 12px;
            margin-bottom: 14px;
            font-size: 9pt;
          }
          .abstract-title { font-weight: bold; font-size: 9pt; }
          .content-columns {
            column-count: 2;
            column-gap: 0.2in;
          }
          .content-columns > * { margin-top: 0 !important; }
          .content-columns table,
          .content-columns .katex-display {
            column-span: all;
            -webkit-column-span: all;
          }
          h2 {
            font-size: 10pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1.5pt solid #000;
            margin: 0 0 10px 0;
            padding-bottom: 2px;
          }
          h3 {
            font-size: 9.5pt;
            font-weight: bold;
            font-style: italic;
            margin: 10px 0 4px 0;
          }
          p { text-align: justify; margin: 0 0 4px 0; }
        `;
      case "chicago":
        return `
          ${commonBase}
          @page { size: letter; margin: 1in; }
          body {
            font-family: Georgia, serif;
            font-size: 12pt;
            line-height: 2.0;
          }
          h1, h2, h3, h4 { font-family: Georgia, serif; color: #000; }
          .paper-title {
            text-align: center;
            font-size: 14pt;
            font-weight: bold;
            margin: 3em 0 0.5em 0;
            line-height: 1.5;
          }
          .authors { text-align: center; font-size: 12pt; line-height: 2.0; }
          .author-affiliation {
            text-align: center;
            font-size: 12pt;
            margin-bottom: 3em;
            line-height: 2.0;
          }
          .abstract-section { margin-bottom: 2em; }
          p { text-indent: 0.5in; margin: 0; text-align: justify; }
          h2 {
            text-align: center;
            font-size: 12pt;
            font-weight: bold;
            font-variant: small-caps;
            margin: 1em 0 0 0;
          }
          h3 {
            text-align: left;
            font-size: 12pt;
            font-weight: bold;
            font-style: italic;
            margin: 0.8em 0 0 0;
          }
        `;
      default:
        return `
          ${commonBase}
          @page { size: letter; margin: 1in; }
          body {
            font-family: "Times New Roman", Times, serif;
            font-size: 12pt;
            line-height: 1.6;
          }
          h1, h2, h3, h4 { font-family: "Times New Roman", Times, serif; color: #000; }
          .paper-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .authors { text-align: center; font-size: 11pt; margin-bottom: 30px; line-height: 1.5; }
          p { text-align: justify; margin-bottom: 1em; }
          h2 {
            font-size: 13pt;
            font-weight: bold;
            margin-top: 20px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 4px;
          }
        `;
    }
  };

  // Helper: build properly formatted paper HTML for PDF export
  const buildPaperHtmlForExport = (
    fmt: string,
    title: string,
    author: string,
    affiliation: string,
    sectionsList: SectionContent[]
  ): string => {
    const fmtLow = fmt.toLowerCase();
    const abstractSection = sectionsList.find((s) => s.id === "abstract");
    const otherSections = sectionsList.filter((s) => s.id !== "title" && s.id !== "abstract");
    let html = "";

    if (fmtLow === "ieee" || fmtLow === "acm") {
      html += `
        <div class="full-width">
          <h1 class="paper-title">${title}</h1>
          <div class="authors">${author}</div>
          <div class="author-affiliation">${affiliation}</div>
          ${abstractSection ? `
            <div class="abstract-section">
              <span class="abstract-title">Abstract&mdash;</span>${stripHTML(abstractSection.html).replace(/^Abstract\s*[\u2014\u2015\u2013\-]\s*/i, "")}
            </div>
          ` : ""}
        </div>
      `;
      otherSections.forEach((sec) => {
        const cleanHtml = cleanSectionHtmlForExport(sec.html);
        html += `<div class="content-columns"><h2>${sec.title.toUpperCase()}</h2>${cleanHtml}</div>`;
      });
    } else if (fmtLow === "apa") {
      html += `
        <div class="paper-title">${title}</div>
        <div class="authors">${author}</div>
        <div class="author-affiliation">${affiliation}</div>
        ${abstractSection ? `
          <div class="abstract-section" style="page-break-after: always;">
            <span class="abstract-title">Abstract</span>
            <div class="abstract-body">${stripHTML(abstractSection.html).replace(/^Abstract\s*[\u2014\u2015\u2013\-]\s*/i, "")}</div>
          </div>
        ` : ""}
      `;
      otherSections.forEach((sec) => {
        html += `<h2>${sec.title}</h2>${cleanSectionHtmlForExport(sec.html)}`;
      });
    } else if (fmtLow === "mla") {
      const today = new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
      html += `
        <div class="title-block">
          ${author}<br>
          Course Instructor<br>
          Department of Academic Research<br>
          ${today}
        </div>
        <div class="paper-title">${title}</div>
      `;
      if (abstractSection) {
        html += `<div><h2>${abstractSection.title}</h2>${cleanSectionHtmlForExport(abstractSection.html)}</div>`;
      }
      otherSections.forEach((sec) => {
        html += `<h2>${sec.title}</h2>${cleanSectionHtmlForExport(sec.html)}`;
      });
    } else if (fmtLow === "nature") {
      html += `
        <h1 class="paper-title">${title}</h1>
        <div class="authors">${author}</div>
        <div class="author-affiliation">${affiliation}</div>
        ${abstractSection ? `
          <div class="abstract-section">
            <span class="abstract-title">Abstract</span>
            ${stripHTML(abstractSection.html).replace(/^Abstract\s*[\u2014\u2015\u2013\-]\s*/i, "")}
          </div>
        ` : ""}
      `;
      otherSections.forEach((sec) => {
        html += `<h2>${sec.title}</h2>${cleanSectionHtmlForExport(sec.html)}`;
      });
    } else {
      // Chicago and default
      html += `
        <h1 class="paper-title">${title}</h1>
        <div class="authors">${author}</div>
        <div class="author-affiliation">${affiliation}</div>
        ${abstractSection ? `
          <div class="abstract-section">
            <h2>Abstract</h2>
            ${cleanSectionHtmlForExport(abstractSection.html)}
          </div>
        ` : ""}
      `;
      otherSections.forEach((sec) => {
        html += `<h2>${sec.title}</h2>${cleanSectionHtmlForExport(sec.html)}`;
      });
    }
    return html;
  };

  const handleExportPaper = () => {
    const formatStyle = format.toLowerCase();
    const author = paperAuthor || userData?.fullName || "Author Name";
    const affiliation = paperAffiliation || userData?.institution || "Independent Researcher";
    const formatLabel = format.toUpperCase();
    const paperHtml = buildPaperHtmlForExport(formatStyle, rawTopic, author, affiliation, sections.map((s: any) => ({ ...s, html: sanitizeHtml(s.html) })));
    const compiledStyles = getFormatStyles(formatStyle);

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.warning("Please allow popups to export your formatted paper.");
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${rawTopic.replace(/"/g, "&quot;")}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"><\/script>
  <style>
    ${compiledStyles}
    body.with-viewer { padding-top: 56px; }
    .pdf-viewer-bar {
      position: fixed; top: 0; left: 0; right: 0; height: 56px;
      background: #690B1B; display: flex; align-items: center;
      justify-content: space-between; padding: 0 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25); z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .bar-left { display: flex; align-items: center; gap: 12px; color: #fff; }
    .fmt-badge {
      background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25);
      border-radius: 6px; padding: 3px 9px; font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase; color: #ffd6a0;
    }
    .bar-title {
      font-size: 13px; font-weight: 600; color: #fff;
      max-width: 480px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .bar-actions { display: flex; align-items: center; gap: 10px; }
    .bar-actions button {
      border: none; cursor: pointer; border-radius: 8px;
      font-size: 12px; font-weight: 700; padding: 7px 16px; transition: all 0.15s;
    }
    .btn-print { background: #fff; color: #690B1B; }
    .btn-print:hover { background: #f5e6e8; }
    .btn-close { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.25) !important; }
    .btn-close:hover { background: rgba(255,255,255,0.2); }
    .paper-page-wrap {
      background: #d0cdc9; min-height: calc(100vh - 56px); padding: 28px 16px 48px;
    }
    .paper-sheet {
      background: #fff; max-width: 816px; margin: 0 auto;
      padding: 1in; box-shadow: 0 4px 24px rgba(0,0,0,0.18); border-radius: 3px;
    }
    @media print {
      @page {
        @top-center {
          content: "${rawTopic.replace(/"/g, '\\"')}";
          font-family: "Times New Roman", Times, serif;
          font-size: 8pt;
          color: #555;
        }
        @bottom-center {
          content: counter(page);
          font-family: "Times New Roman", Times, serif;
          font-size: 8pt;
          color: #555;
        }
      }
      body.with-viewer { padding-top: 0 !important; }
      .pdf-viewer-bar { display: none !important; }
      .paper-page-wrap { background: #fff !important; padding: 0 !important; min-height: auto; }
      .paper-sheet { max-width: none !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
    }
  </style>
</head>
<body class="with-viewer">
  <div class="pdf-viewer-bar">
    <div class="bar-left">
      <span class="fmt-badge">${formatLabel}</span>
      <span class="bar-title">${rawTopic.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
    </div>
    <div class="bar-actions">
      <button class="btn-print" onclick="window.print()">&#128438; Print / Save PDF</button>
      <button class="btn-close" onclick="window.close()">&#x2715; Close</button>
    </div>
  </div>
  <div class="paper-page-wrap">
    <div class="paper-sheet paper-container">
      ${paperHtml}
    </div>
  </div>
  <script>
    window.addEventListener("load", function() {
      if (window.renderMathInElement) {
        renderMathInElement(document.body, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\\\(", right: "\\\\)", display: false },
            { left: "\\\\[", right: "\\\\]", display: true }
          ],
          throwOnError: false
        });
      }
    });
  <\/script>
</body>
</html>`);
    printWindow.document.close();
  };

  const handleHumanisePaper = async () => {
    setIsHumanising(true);
    setHumaniseStep(0);
    
    // Animate the progress steps sequentially as a safe indicator for sequential processing
    const t1 = setTimeout(() => setHumaniseStep(1), 3000);
    const t2 = setTimeout(() => setHumaniseStep(2), 15000);
    const t3 = setTimeout(() => setHumaniseStep(3), 27000);
    const t4 = setTimeout(() => setHumaniseStep(4), 39000);
    const t5 = setTimeout(() => setHumaniseStep(5), 51000);
    const t6 = setTimeout(() => setHumaniseStep(6), 63000);
    const t7 = setTimeout(() => setHumaniseStep(7), 75000);

    try {
      const res = await fetch(`${API_BASE_URL}/humanise-paper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sections: sections,
          topic: rawTopic,
          format: format,
        }),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `API returned status ${res.status}`);
      }

      const data = await res.json();
      const updatedSections = data.sections;

      // Update sections in state
      setSections(updatedSections);

      // Persist to remote db via store
      const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
      const stored = await getPapersList();
      const existingIndex = stored.findIndex((p: any) => 
        (paperId && p.id === paperId) || (draftId && p.id === draftId) || (!paperId && !draftId && p.title === rawTopic)
      );
      
      const targetId = draftId.trim() || paperId || `draft-${Math.floor(Math.random() * 100000)}`;
      
      let paper = existingIndex > -1 ? stored[existingIndex] : null;
      if (paper) {
        paper.wordCount = wordCount.toString();
        paper.pageCount = pageCount.toString();
        paper.sections = updatedSections;
        paper.submittedAt = new Date().toISOString();
        paper.aiScore = aiScore;
        if (qualityScore !== null) {
          paper.score = qualityScore;
          paper.rubricRigor = rubricRigor;
          paper.rubricStyle = rubricStyle;
          paper.rubricNovelty = rubricNovelty;
        }
      } else {
        paper = {
          id: targetId,
          title: rawTopic,
          author: paperAuthor || userData?.fullName || "Author Name",
          authorEmail: userData?.email || "author@example.com",
          affiliation: paperAffiliation || userData?.institution || "Independent Researcher",
          format: format,
          wordCount: wordCount.toString(),
          pageCount: pageCount.toString(),
          score: qualityScore !== null ? qualityScore : 85,
          rubricRigor: rubricRigor !== null ? rubricRigor : 8.5,
          rubricStyle: rubricStyle !== null ? rubricStyle : 8.5,
          rubricNovelty: rubricNovelty !== null ? rubricNovelty : 8.5,
          status: "In Progress",
          submittedAt: new Date().toISOString(),
          assignmentStatus: null,
          pref1: "",
          pref2: "",
          pref3: "",
          currentReviewerId: "",
          dueDate: null,
          doi: "N/A",
          sections: updatedSections,
          aiScore: aiScore,
        } as any;
      }
      
      await updatePaperInStore(paper!);

      setSuccessNotification("Paper humanised and draft updated successfully!");
      setTimeout(() => setSuccessNotification(""), 3000);
    } catch (err: any) {
      console.error("Error humanising paper:", err);
      toast.error(`An error occurred while humanising your paper: ${err.message || err}`);
    } finally {
      setIsHumanising(false);
      setHumaniseStep(0);
    }
  };

  /* ── Statistics ─────────────────────────────────────────────────── */
  const wordCount = sections.reduce(
    (sum, s) => sum + stripHTML(s.html).split(/\s+/).filter(Boolean).length,
    0
  );
  const pageCount = Math.max(1, Math.ceil(wordCount / 380));

  /* ── Save Draft and Redirect Helper ─────────────────────────────── */
  const saveDraftAndRedirect = async (url: string) => {
    try {
      const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
      const stored = await getPapersList();
      const existingIndex = stored.findIndex((p: any) => 
        (paperId && p.id === paperId) || (draftId && p.id === draftId) || (!paperId && !draftId && p.title === rawTopic)
      );
      const targetId = draftId.trim() || paperId || `draft-${Math.floor(Math.random() * 100000)}`;
      
      let paper = existingIndex > -1 ? stored[existingIndex] : null;
      if (paper) {
        let newStatus = paper.status;
        if (newStatus === "Rejected") {
          newStatus = "Rejected Draft";
        }
        paper.wordCount = wordCount.toString();
        paper.pageCount = pageCount.toString();
        paper.sections = sections;
        paper.submittedAt = new Date().toISOString();
        paper.status = newStatus;
        paper.aiScore = aiScore;
        if (qualityScore !== null) {
          paper.score = qualityScore;
          paper.rubricRigor = rubricRigor;
          paper.rubricStyle = rubricStyle;
          paper.rubricNovelty = rubricNovelty;
        }
      } else {
        paper = {
          id: targetId,
          title: rawTopic,
          author: paperAuthor || userData?.fullName || "Author Name",
          authorEmail: userData?.email || "author@example.com",
          affiliation: paperAffiliation || userData?.institution || "Independent Researcher",
          format: format,
          wordCount: wordCount.toString(),
          pageCount: pageCount.toString(),
          score: qualityScore !== null ? qualityScore : 85,
          rubricRigor: rubricRigor !== null ? rubricRigor : 8.5,
          rubricStyle: rubricStyle !== null ? rubricStyle : 8.5,
          rubricNovelty: rubricNovelty !== null ? rubricNovelty : 8.5,
          status: "In Progress",
          submittedAt: new Date().toISOString(),
          assignmentStatus: null,
          pref1: "",
          pref2: "",
          pref3: "",
          currentReviewerId: "",
          dueDate: null,
          doi: "N/A",
          sections: sections,
          aiScore: aiScore,
        } as any;
      }
      await updatePaperInStore(paper!);
      
      // Replace targetId in final URL if present
      const finalUrl = url.replace(encodeURIComponent(draftId), encodeURIComponent(paper!.id));
      router.push(finalUrl);
    } catch (e) {
      console.error("Save draft and redirect failed:", e);
      router.push(url);
    }
  };

  /* ── Save Draft handler ─────────────────────────────────────────── */
  const handleSaveDraft = async () => {
    try {
      const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
      const stored = await getPapersList();
      const existingIndex = stored.findIndex((p: any) => 
        (paperId && p.id === paperId) || (draftId && p.id === draftId) || (!paperId && !draftId && p.title === rawTopic)
      );
      const targetId = draftId.trim() || paperId || `draft-${Math.floor(Math.random() * 100000)}`;
      
      let paper = existingIndex > -1 ? stored[existingIndex] : null;
      if (paper) {
        let newStatus = paper.status;
        if (newStatus === "Rejected") {
          newStatus = "Rejected Draft";
        }
        paper.wordCount = wordCount.toString();
        paper.pageCount = pageCount.toString();
        paper.sections = sections;
        paper.submittedAt = new Date().toISOString();
        paper.status = newStatus;
        paper.aiScore = aiScore;
        if (qualityScore !== null) {
          paper.score = qualityScore;
          paper.rubricRigor = rubricRigor;
          paper.rubricStyle = rubricStyle;
          paper.rubricNovelty = rubricNovelty;
        }
      } else {
        paper = {
          id: targetId,
          title: rawTopic,
          author: paperAuthor || userData?.fullName || "Author Name",
          authorEmail: userData?.email || "author@example.com",
          affiliation: paperAffiliation || userData?.institution || "Independent Researcher",
          format: format,
          wordCount: wordCount.toString(),
          pageCount: pageCount.toString(),
          score: qualityScore !== null ? qualityScore : 85,
          rubricRigor: rubricRigor !== null ? rubricRigor : 8.5,
          rubricStyle: rubricStyle !== null ? rubricStyle : 8.5,
          rubricNovelty: rubricNovelty !== null ? rubricNovelty : 8.5,
          status: "In Progress",
          submittedAt: new Date().toISOString(),
          assignmentStatus: null,
          pref1: "",
          pref2: "",
          pref3: "",
          currentReviewerId: "",
          dueDate: null,
          doi: "N/A",
          sections: sections,
          aiScore: aiScore,
        } as any;
      }
      
      await updatePaperInStore(paper!);
      
      const newUrl = `/studio?topic=${encodeURIComponent(rawTopic)}&format=${format}&paperId=${encodeURIComponent(targetId)}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);

      setSuccessNotification(`Draft successfully saved! ID: ${targetId}`);
      setTimeout(() => {
        setSuccessNotification("");
        router.push("/dashboard");
      }, 2000);
    } catch (e) {
      console.error("Failed to save draft:", e);
      toast.error("Failed to save draft.");
    }
  };

  /* ── PDF Re-upload handler (for reverted PDF papers) ────────────── */
  const handlePdfReupload = async () => {
    if (!pdfReuploadFile) {
      setPdfReuploadError("Please select a valid PDF file.");
      return;
    }
    setIsPdfReuploading(true);
    setPdfReuploadError("");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64Data = event.target?.result as string;
          if (!base64Data) throw new Error("Failed to read PDF file.");

          const { getPapersList, updatePaperInStore } = await import("@/lib/papersStore");
          const stored = await getPapersList();
          const existingPaper = stored.find((p: any) => p.id === draftId || p.title === rawTopic);

          if (!existingPaper) throw new Error("Paper not found in store.");

          // Read reviewer prefs from the stored paper
          const p1 = existingPaper.pref1 || "";
          const p2 = existingPaper.pref2 || "";
          const p3 = existingPaper.pref3 || "";

          const updatedPaper = {
            ...existingPaper,
            uploadedPdfContent: base64Data,
            uploadedPdfName: pdfReuploadFile!.name,
            status: "Rejected Draft",
            submittedAt: new Date().toISOString(),
          };
          await updatePaperInStore(updatedPaper);

          setShowPdfReuploadModal(false);
          setPdfReuploadFile(null);

          const prefsQuery = p1 ? `&pref1=${p1}&pref2=${p2}&pref3=${p3}` : "";
          router.push(
            `/studio/export?topic=${encodeURIComponent(rawTopic)}&format=${format}&wordCount=${wordCount}&pageCount=${pageCount}&paperId=${encodeURIComponent(draftId)}&bypassPayment=true${prefsQuery}`
          );
        } catch (err: any) {
          console.error("PDF reupload error:", err);
          setPdfReuploadError(err.message || "Failed to save PDF file.");
        } finally {
          setIsPdfReuploading(false);
        }
      };
      reader.onerror = () => {
        setPdfReuploadError("Error reading PDF file.");
        setIsPdfReuploading(false);
      };
      reader.readAsDataURL(pdfReuploadFile);
    } catch (err: any) {
      console.error(err);
      setPdfReuploadError(err.message || "Failed to upload PDF.");
      setIsPdfReuploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF8F9] font-[Poppins]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#690B1B] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#690B1B] text-[15px] font-medium tracking-wide">
            Loading manuscript...
          </span>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    const stepMessages = [
      "",
      "Searching global academic databases for relevant literature and publications...",
      "Synthesizing academic research data and drafting manuscript sections...",
      "Compiling original references and formatting bibliography style..."
    ];
    return (
      <div className="min-h-screen bg-[#F6F4F2] flex items-center justify-center font-[Poppins] p-6 text-center select-none">
        <div className="max-w-2xl bg-white border border-[#E7E2DE] shadow-xl rounded-3xl p-8 sm:p-12 space-y-8 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#690B1B] border-t-transparent rounded-full animate-spin mb-2" />
          
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#C9A55D]">
              Abroad Simplified AI Research Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3A000C] font-serif leading-snug">
              Generating Research Paper Template
            </h1>
            <p className="text-[#6B6B6B] text-[14px] font-medium italic">
              "{rawTopic}"
            </p>
          </div>
          
          <hr className="w-full border-[#ECE6E2]" />
          
          <div className="space-y-4 w-full">
            <div className="flex justify-between text-[12px] font-bold text-[#690B1B]">
              <span>{stepMessages[generationStep]}</span>
              <span>{generationStep * 33}%</span>
            </div>
            <div className="w-full h-2 bg-[#F6F4F2] rounded-full overflow-hidden border border-[#EDE8E4]">
              <div 
                className="h-full bg-[#690B1B] rounded-full transition-all duration-500" 
                style={{ width: `${generationStep * 33.3}%` }} 
              />
            </div>
          </div>
          
          <p className="text-xs text-[#A5A5A5] leading-relaxed max-w-md">
            This process queries global literature indexes to obtain real-world academic references, then synthesizes a comprehensive academic draft containing data, equations, and structured tables. This may take up to a minute.
          </p>
        </div>
      </div>
    );
  }

  if (isHumanising) {
    const stepMessages = [
      "Connecting to secure document processing servers...",
      "Analyzing paper structure and calculating baseline word count parameters...",
      "Humanising Section 1/5: Abstract (optimizing tone & maintaining word count)...",
      "Humanising Section 2/5: Introduction (enriching academic prose & parameters)...",
      "Humanising Section 3/5: Methodology (re-validating math formulations & equations)...",
      "Humanising Section 4/5: Results & Discussion (preserving tabular data & findings)...",
      "Humanising Section 5/5: Conclusion (integrating future directions & bibliography)...",
      "Verifying structural integrity and checking final word count constraints..."
    ];
    // Map steps to approximate percentage
    const progressPercent = Math.min(100, Math.round((humaniseStep / 7) * 100));
    return (
      <div className="min-h-screen bg-[#F6F4F2] flex items-center justify-center font-[Poppins] p-6 text-center select-none">
        <div className="max-w-2xl bg-white border border-[#E7E2DE] shadow-xl rounded-3xl p-8 sm:p-12 space-y-8 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#690B1B] border-t-transparent rounded-full animate-spin mb-2" />
          
          <div className="space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#C9A55D]">
              Academic Humanisation Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3A000C] font-serif leading-snug">
              Humanising Paper Draft
            </h1>
            <p className="text-[#6B6B6B] text-[14px] font-medium italic">
              "{rawTopic}"
            </p>
          </div>
          
          <hr className="w-full border-[#ECE6E2]" />
          
          <div className="space-y-4 w-full">
            <div className="flex justify-between text-[12px] font-bold text-[#690B1B]">
              <span className="text-left max-w-[80%]">{stepMessages[humaniseStep] || "Processing manuscript..."}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#F6F4F2] rounded-full overflow-hidden border border-[#EDE8E4]">
              <div 
                className="h-full bg-gradient-to-r from-[#690B1B] to-[#C9A55D] rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
          
          <p className="text-xs text-[#A5A5A5] leading-relaxed max-w-md">
            This processes your entire manuscript sequentially to humanise the language. It rewrites the text to sound completely natural and peer-reviewed while strictly preserving your exact tables, math LaTeX structures, and citations. To ensure highest quality synthesis, this process takes about 60-70 seconds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-[#F6F4F2] text-[#111] flex flex-col font-[Poppins] overflow-hidden">
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      {/* ──── STUDIO HEADER ──────────────────────────────────────────── */}
      <header className="h-[74px] bg-white border-b border-[#E7E2DE] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full border border-[#E6DFDA] bg-white flex items-center justify-center text-[#6B6B6B] hover:bg-[#690B1B] hover:text-white transition-all duration-300 shrink-0 cursor-pointer"
          >
            <IconChevronLeft size={18} stroke={2} />
          </button>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3">
              <h1 className="text-[14px] sm:text-[17px] font-bold text-[#111] tracking-tight truncate max-w-[130px] sm:max-w-[450px]">
                {rawTopic}
              </h1>
              <span className="px-2 py-0.5 rounded-[5px] bg-[#690B1B]/[0.06] text-[#690B1B] text-[8.5px] sm:text-[9.5px] uppercase tracking-wider font-extrabold shrink-0">
                {format.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isSaving ? "bg-[#C9A55D] animate-ping" : "bg-[#0F8A43]"
                    }`}
                />
                <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-semibold truncate max-w-[110px] sm:max-w-none">
                  {isSaving ? "Auto-saving..." : "Saved to cloud"}
                </span>
              </div>
              <span className="text-[#DED7D1] hidden sm:inline text-[10px] font-semibold">|</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] sm:text-[10px] text-[#A5A5A5] font-semibold">ID:</span>
                <input
                  type="text"
                  value={draftId}
                  disabled={!!role}
                  onChange={(e) => setDraftId(e.target.value)}
                  placeholder="assign ID"
                  className="bg-transparent text-[9px] sm:text-[10px] text-[#690B1B] font-bold border-b border-dashed border-[#690B1B]/40 focus:border-[#690B1B] outline-none w-[110px] px-1 py-0 font-mono transition-all"
                  title={role ? "Paper ID" : "Click to edit Draft ID"}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {role ? (
            <>
              {((role === "reviewer" && ["Awaiting Publisher", "Rejected Draft", "Accepted", "Rejected"].includes(paperStatus)) ||
                (role === "publisher" && ["Accepted", "Rejected"].includes(paperStatus))) ? (
                <div className="flex items-center gap-2">
                  <span className={`h-[42px] px-5 rounded-xl text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider ${
                    ["Accepted", "Awaiting Publisher"].includes(paperStatus) ? "bg-[#0F8A43]" : "bg-[#9C1C1C]"
                  }`}>
                    {paperStatus === "Awaiting Publisher" ? "Approved" : paperStatus === "Rejected Draft" ? "Reverted" : paperStatus}
                  </span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleReviewAction("Accept")}
                    className="h-[42px] px-3.5 sm:px-5 rounded-xl bg-[#0F8A43] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#0D7539] active:scale-[0.98] transition-all cursor-pointer"
                    title={role === "reviewer" ? "Approve Paper" : "Publish Paper"}
                  >
                    <span>{role === "reviewer" ? "Approve" : "Publish"}</span>
                  </button>
                  <button
                    onClick={() => handleReviewAction("Reject")}
                    className="h-[42px] px-3.5 sm:px-5 rounded-xl bg-[#9C1C1C] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#851818] active:scale-[0.98] transition-all cursor-pointer"
                    title={role === "reviewer" ? "Revert Paper" : "Reject Paper"}
                  >
                    <span>{role === "reviewer" ? "Revert" : "Reject"}</span>
                  </button>
                  <button
                    onClick={() => handleReviewAction("Comment")}
                    className="h-[42px] px-3.5 sm:px-5 rounded-xl border border-[#E6DFDA] bg-white text-[#5B5B5B] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-neutral-50 active:scale-[0.98] transition-all cursor-pointer"
                    title="Comment & Reject/Revert"
                  >
                    <span>Comment</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {!["Review Pending", "Under Review", "Pending Acceptance", "Accepted", "Awaiting Publisher"].includes(paperStatus) && (
                <>
                  <button
                    onClick={handleHumanisePaper}
                    className="h-[42px] px-3.5 sm:px-5 rounded-xl text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                    style={{ background: "linear-gradient(135deg, #690B1B 0%, #9E1B32 100%)" }}
                    title="Humanise Paper Draft"
                  >
                    <IconSparkles size={16} className="text-[#C9A55D] animate-pulse" />
                    <span className="hidden sm:inline">Humanise Paper</span>
                    <span className="sm:hidden">Humanise</span>
                  </button>
                </>
              )}
              
              <button
                onClick={handleExportPaper}
                className="h-[42px] px-3.5 sm:px-5 rounded-xl border border-[#EDE8E4] bg-white text-[#690B1B] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#690B1B]/5 active:scale-[0.98] transition-all cursor-pointer"
                title="Export PDF"
              >
                <IconDownload size={16} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>

              {paperStatus === "Accepted" ? (
                <span className="h-[42px] px-5 rounded-xl bg-[#0F8A43] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider">
                  Accepted
                </span>
              ) : paperStatus === "Awaiting Publisher" ? (
                <span className="h-[42px] px-5 rounded-xl bg-[#0F4C75] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider">
                  Awaiting Publisher
                </span>
              ) : paperStatus === "Review Pending" || paperStatus === "Under Review" ? (
                <span className="h-[42px] px-5 rounded-xl bg-[#C9A55D] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider">
                  {paperAssignmentStatus === "Pending Acceptance" ? "Pending Acceptance" : "Pending"}
                </span>
              ) : paperStatus === "Rejected Draft" ? (
                /* Paper was reverted by reviewer */
                uploadedPdfContent ? (
                  /* PDF paper: offer to upload a revised PDF */
                  <button
                    onClick={() => {
                      setPdfReuploadFile(null);
                      setPdfReuploadError("");
                      setShowPdfReuploadModal(true);
                    }}
                    className="h-[42px] px-3.5 sm:px-5 rounded-xl bg-[#690B1B] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#7A1022] active:scale-[0.98] transition-all cursor-pointer"
                    title="Upload Revised PDF to Resubmit"
                  >
                    <IconUpload size={16} />
                    <span className="hidden sm:inline">Upload Revised PDF</span>
                    <span className="sm:hidden">Upload PDF</span>
                  </button>
                ) : (
                  /* Studio paper: skip reviewer selection, go straight to export */
                  <button
                    onClick={() => {
                      let p1 = "", p2 = "", p3 = "";
                      try {
                        const stored = JSON.parse(localStorage.getItem("abroad_submitted_papers") || "[]");
                        const paper = stored.find((p: any) => p.id === draftId || p.title === rawTopic);
                        if (paper) { p1 = paper.pref1 || ""; p2 = paper.pref2 || ""; p3 = paper.pref3 || ""; }
                      } catch (e) { console.error(e); }
                      const prefsQuery = p1 ? `&pref1=${p1}&pref2=${p2}&pref3=${p3}` : "";
                      saveDraftAndRedirect(`/studio/export?topic=${encodeURIComponent(rawTopic)}&format=${format}&wordCount=${wordCount}&pageCount=${pageCount}&paperId=${encodeURIComponent(draftId)}&bypassPayment=true${prefsQuery}`);
                    }}
                    className="h-[42px] px-3.5 sm:px-5 rounded-xl bg-[#0F8A43] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#0D7539] active:scale-[0.98] transition-all cursor-pointer"
                    title="Resubmit for Review (No Payment)"
                  >
                    <span className="hidden sm:inline">Resubmit for Review</span>
                    <span className="sm:hidden">Resubmit</span>
                    <IconChevronRight size={16} />
                  </button>
                )
              ) : (
                <button
                  onClick={handleSaveDraft}
                  className="h-[42px] px-3.5 sm:px-5 rounded-xl bg-[#690B1B] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm hover:bg-[#7A1022] active:scale-[0.98] transition-all cursor-pointer"
                  title="Save Draft"
                >
                  <IconDeviceFloppy size={16} />
                  <span>Save Draft</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* ──── THREE PANE LAYOUT ──────────────────────────────────────── */}
      <div className="flex-grow flex items-stretch overflow-hidden">
        {/* ── LEFT: Outline Navigator ─────────────────────────────────── */}
        <aside className={`flex-col w-full md:w-[260px] lg:w-[280px] bg-white border-r border-[#E7E2DE] shrink-0 overflow-y-auto p-6 space-y-6 ${mobileTab === "outline" ? "flex" : "hidden md:flex"}`}>
          <div className="text-[10px] text-[#B0A08A] uppercase tracking-[0.2em] font-extrabold">
            Paper Structure
          </div>

          <div className="space-y-1 relative pl-3 border-l-2 border-[#ECE6E2]">
            {uploadedPdfContent ? (
              /* PDF Manuscript — single item in outline */
              <div className="group relative flex items-center justify-between">
                <div className="absolute -left-[17px] w-2 h-2 rounded-full border bg-[#690B1B] border-[#690B1B] scale-125 shadow-sm" />
                <div className="flex-grow text-left py-2 px-3.5 rounded-lg text-[13.5px] font-bold tracking-tight bg-[#690B1B]/[0.05] text-[#690B1B]">
                  📄 Manuscript PDF
                </div>
              </div>
            ) : (
              sections.map((section) => {
                const isActive = activeSectionId === section.id;
                const isCompleting = completingSectionId === section.id;
                return (
                  <div key={section.id} className="group relative flex items-center justify-between">
                    {/* Indicator Dot */}
                    <div
                      className={`absolute -left-[17px] w-2 h-2 rounded-full border transition-all ${isActive
                          ? "bg-[#690B1B] border-[#690B1B] scale-125 shadow-sm"
                          : "bg-white border-[#C9A55D]/60 group-hover:bg-[#C9A55D]/40"
                        }`}
                    />

                    <button
                      onClick={() => setActiveSectionId(section.id)}
                      className={`flex-grow text-left py-2 px-3.5 rounded-lg text-[13.5px] font-medium tracking-tight transition-all duration-300 cursor-pointer ${isActive
                          ? "bg-[#690B1B]/[0.05] text-[#690B1B] font-bold"
                          : "text-[#5F5F5F] hover:bg-neutral-50 hover:text-[#111]"
                        }`}
                    >
                      {section.title}
                    </button>

                    {!role && (
                      <button
                        onClick={() => triggerAIAutocomplete(section.id)}
                        disabled={isCompleting}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#C9A55D] hover:text-[#690B1B] transition-all absolute right-2 bg-white rounded-md shadow-sm border border-neutral-100 cursor-pointer"
                        title="AI Autocomplete Section"
                      >
                        <IconSparkles size={13} className={isCompleting ? "animate-spin" : ""} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>



          {/* ── AI Content Detector Card ──────────────────────────── */}
          {true && (
            <div className="pt-2 pb-4">
              <div
                className="rounded-2xl overflow-hidden border"
                style={{
                  background:
                    aiCheckStatus === "checking"
                      ? "linear-gradient(135deg, #fefce8 0%, #fef9ee 100%)"
                      : aiScore === null
                      ? "linear-gradient(135deg, #f8f7f5 0%, #f3f1ef 100%)"
                      : aiScore <= 30
                      ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                      : aiScore <= 60
                      ? "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)"
                      : "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)",
                  borderColor:
                    aiCheckStatus === "checking"
                      ? "rgba(201,165,93,0.3)"
                      : aiScore === null
                      ? "rgba(0,0,0,0.07)"
                      : aiScore <= 30
                      ? "rgba(15,138,67,0.25)"
                      : aiScore <= 60
                      ? "rgba(201,165,93,0.4)"
                      : "rgba(156,28,28,0.25)",
                }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between px-4 pt-4 pb-2">
                  <div className="flex items-center gap-1.5">
                    <IconSparkles
                      size={13}
                      style={{
                        color:
                          aiCheckStatus === "checking" ? "#C9A55D" :
                          aiScore === null ? "#A5A5A5" :
                          aiScore <= 30 ? "#0F8A43" :
                          aiScore <= 60 ? "#B07B00" : "#9C1C1C",
                      }}
                      className={aiCheckStatus === "checking" ? "animate-pulse" : ""}
                    />
                    <span
                      className="text-[9px] font-extrabold uppercase tracking-[0.2em]"
                      style={{
                        color:
                          aiCheckStatus === "checking" ? "#C9A55D" :
                          aiScore === null ? "#A5A5A5" :
                          aiScore <= 30 ? "#0F8A43" :
                          aiScore <= 60 ? "#B07B00" : "#9C1C1C",
                      }}
                    >
                      AI Content Detector
                    </span>
                  </div>
                  {/* Live pulse dot */}
                  {aiCheckStatus === "checking" && (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-[#C9A55D]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A55D] animate-ping" />
                      Live
                    </span>
                  )}
                  {aiCheckStatus === "done" && aiLastChecked && (
                    <span className="text-[8.5px] text-[#A5A5A5] font-medium">
                      {aiLastChecked.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  )}
                </div>

                {/* Arc Gauge */}
                <div className="flex flex-col items-center pb-1 pt-2">
                  <div className="relative" style={{ width: 140, height: 88 }}>
                    <svg width="140" height="96" viewBox="0 0 140 96">
                      {/* Track arc */}
                      <path
                        d="M 14 76 A 56 56 0 0 1 126 76"
                        fill="none"
                        stroke="rgba(0,0,0,0.08)"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      {/* Value arc */}
                      {aiCheckStatus === "checking" ? (
                        <path
                          d="M 14 76 A 56 56 0 0 1 126 76"
                          fill="none"
                          stroke="#C9A55D"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray="175.9"
                          strokeDashoffset="88"
                          className="animate-pulse"
                          opacity="0.6"
                        />
                      ) : aiScore !== null ? (
                        <path
                          d="M 14 76 A 56 56 0 0 1 126 76"
                          fill="none"
                          stroke={
                            aiScore <= 30 ? "#0F8A43" :
                            aiScore <= 60 ? "#C9A55D" : "#9C1C1C"
                          }
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray="175.9"
                          strokeDashoffset={175.9 - (aiScore / 100) * 175.9}
                          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.6s ease" }}
                        />
                      ) : null}

                      {/* Center number */}
                      {aiCheckStatus === "checking" ? (
                        <text x="70" y="72" textAnchor="middle" fontSize="22" fontWeight="800" fill="#C9A55D" fontFamily="system-ui">
                          …
                        </text>
                      ) : aiScore !== null ? (
                        <text
                          x="70" y="68"
                          textAnchor="middle"
                          fontSize="26"
                          fontWeight="900"
                          fill={aiScore <= 30 ? "#0F8A43" : aiScore <= 60 ? "#B07B00" : "#9C1C1C"}
                          fontFamily="system-ui"
                          style={{ transition: "fill 0.6s ease" }}
                        >
                          {aiScore}%
                        </text>
                      ) : (
                        <text x="70" y="68" textAnchor="middle" fontSize="14" fontWeight="700" fill="#C0BAB5" fontFamily="system-ui">
                          —
                        </text>
                      )}

                      {/* Scale labels */}
                      <text x="8" y="92" textAnchor="middle" fontSize="8" fill="#A5A5A5" fontFamily="system-ui">0</text>
                      <text x="132" y="92" textAnchor="middle" fontSize="8" fill="#A5A5A5" fontFamily="system-ui">100</text>
                    </svg>
                  </div>

                  {/* Classification label */}
                  <div className="mt-[-6px] mb-3 text-center">
                    {aiCheckStatus === "checking" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#C9A55D]/10 text-[#B07B00]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A55D] animate-bounce" />
                        Analyzing...
                      </span>
                    ) : aiCheckStatus === "error" ? (
                      <button
                        onClick={() => runAiDetection(sections)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer transition-colors border border-orange-200"
                      >
                        ↻ Retry Detection
                      </button>
                    ) : aiScore !== null ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                        style={{
                          background:
                            aiScore <= 30 ? "rgba(15,138,67,0.12)" :
                            aiScore <= 60 ? "rgba(201,165,93,0.18)" : "rgba(156,28,28,0.12)",
                          color: aiScore <= 30 ? "#0F8A43" : aiScore <= 60 ? "#B07B00" : "#9C1C1C",
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: aiScore <= 30 ? "#0F8A43" : aiScore <= 60 ? "#C9A55D" : "#9C1C1C" }}
                        />
                        {aiScore <= 30 ? "Likely Human" : aiScore <= 60 ? "Mixed Content" : "Likely AI"}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#A5A5A5] font-medium">Warming up...</span>
                    )}
                  </div>
                </div>

                {/* Reasoning + bands */}
                {aiScore !== null && aiCheckStatus === "done" && (
                  <div className="px-4 pb-4 space-y-3">
                    {/* Scale bands */}
                    <div className="flex gap-1">
                      {[
                        { label: "Human", range: "0-30", color: "#0F8A43", active: aiScore <= 30 },
                        { label: "Mixed", range: "31-60", color: "#C9A55D", active: aiScore > 30 && aiScore <= 60 },
                        { label: "AI", range: "61+", color: "#9C1C1C", active: aiScore > 60 },
                      ].map((band) => (
                        <div
                          key={band.label}
                          className="flex-1 rounded-lg py-1.5 text-center transition-all"
                          style={{
                            background: band.active ? `${band.color}18` : "rgba(0,0,0,0.04)",
                            borderBottom: band.active ? `2px solid ${band.color}` : "2px solid transparent",
                          }}
                        >
                          <div className="text-[9px] font-extrabold" style={{ color: band.active ? band.color : "#B5B0AB" }}>
                            {band.label}
                          </div>
                          <div className="text-[8px] font-medium" style={{ color: band.active ? band.color : "#C8C3BE" }}>
                            {band.range}%
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reasoning */}
                    {aiReasoning && (
                      <p className="text-[10.5px] text-[#727272] leading-relaxed italic border-t border-black/5 pt-2.5">
                        {aiReasoning}
                      </p>
                    )}

                    {/* Confidence + re-check */}
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={{
                          background:
                            aiConfidence === "high" ? "rgba(15,138,67,0.1)" :
                            aiConfidence === "medium" ? "rgba(201,165,93,0.12)" : "rgba(0,0,0,0.05)",
                          color:
                            aiConfidence === "high" ? "#0F8A43" :
                            aiConfidence === "medium" ? "#B07B00" : "#A5A5A5",
                        }}
                      >
                        {aiConfidence} confidence
                      </span>
                      <button
                        onClick={() => runAiDetection(sections)}
                        className="text-[9px] font-bold text-[#A5A5A5] hover:text-[#690B1B] transition-colors cursor-pointer"
                      >
                        ↻ Re-check
                      </button>
                    </div>
                  </div>
                )}

                {/* Loading shimmer bar at bottom */}
                {aiCheckStatus === "checking" && (
                  <div className="h-1 w-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-transparent via-[#C9A55D] to-transparent"
                      style={{ animation: "shimmer 1.5s infinite", backgroundSize: "200% 100%" }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* ── CENTER: Editor ──────────────────────────────────────────── */}
        <main className={`flex-grow flex-col bg-[#F6F4F2] overflow-hidden p-4 lg:p-8 min-w-0 ${mobileTab === "write" ? "flex" : mobileTab === "outline" ? "hidden md:flex" : "hidden lg:flex"}`}>
          <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col min-h-0">
            {/* Section header above editor */}
            <div className="bg-white border border-[#E7E2DE] border-b-0 rounded-t-2xl px-6 py-4 shrink-0">
              <span className="text-[9.5px] uppercase tracking-[0.2em] font-extrabold text-[#C9A55D]">
                {uploadedPdfContent ? "Uploaded Manuscript" : "Active Segment"}
              </span>
              <h2 className="text-[#3A000C] text-[20px] font-bold tracking-tight mt-1">
                {uploadedPdfContent
                  ? (uploadedPdfName || "Manuscript PDF")
                  : sections.find((s) => s.id === activeSectionId)?.title}
              </h2>
            </div>

            {/* Rich Text Editor or PDF Viewer */}
            <div className="flex-grow flex flex-col min-h-0">
              {uploadedPdfContent ? (
                /* PDF iframe viewer */
                <iframe
                  src={uploadedPdfContent}
                  className="w-full flex-grow border-0 bg-white"
                  style={{ minHeight: 0, height: "100%" }}
                  title={uploadedPdfName || "Manuscript PDF"}
                />
              ) : (
                <RichTextEditor
                  ref={editorRef}
                  content={activeContent}
                  onUpdate={handleEditorUpdate}
                  doubleSpaced={doubleSpaced}
                  placeholder="Start crafting your academic masterpiece..."
                  readOnly={!!role}
                />
              )}
            </div>

            {/* Status Stats Bar — hidden for PDF manuscripts */}
            {!uploadedPdfContent && (
              <div className="w-full bg-[#EAE6E2] border border-[#DED7D1] border-t-0 rounded-b-2xl px-6 py-3 flex items-center justify-between text-[12px] text-[#5F5F5F] font-medium shrink-0">
                <div className="flex items-center gap-5">
                  <span>
                    Words: <strong className="text-[#111]">{wordCount}</strong>
                  </span>
                  <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#A5A5A5]" />
                  <span>
                    Estimated Pages: <strong className="text-[#111]">{pageCount}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mini AI score pill in stats bar */}
                  {aiScore !== null && (
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background:
                          aiScore <= 30 ? "rgba(15,138,67,0.1)" :
                          aiScore <= 60 ? "rgba(201,165,93,0.15)" : "rgba(156,28,28,0.1)",
                        color: aiScore <= 30 ? "#0F8A43" : aiScore <= 60 ? "#B07B00" : "#9C1C1C",
                      }}
                    >
                      AI {aiScore}%
                    </span>
                  )}
                  {aiCheckStatus === "checking" && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-[#C9A55D] bg-[#C9A55D]/10 animate-pulse">
                      Scanning...
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded bg-white text-[11px] text-[#690B1B] font-bold uppercase tracking-wider">
                    {role ? "Under Review" : "Drafting"}
                  </span>
                </div>
              </div>
            )}


          </div>
        </main>

        {/* ── RIGHT: AI Assistant or Evaluation Rubric ──────────────────── */}
        <aside className={`flex-col w-full lg:w-[300px] xl:w-[350px] bg-white border-l border-[#E7E2DE] shrink-0 overflow-hidden ${mobileTab === "ai" ? "flex" : "hidden lg:flex"}`}>
          {role ? (
            /* ── RIGHT: Reviewer/Publisher Evaluation Rubric ── */
            <div className="h-full flex flex-col justify-between overflow-hidden p-5 bg-[#FCFAF8]">
              <div className="flex-grow overflow-y-auto space-y-6">
                <div>
                  <h3 className="text-[13px] font-extrabold text-[#690B1B] tracking-wider uppercase border-b border-[#E7E2DE] pb-2 mb-4 flex items-center gap-1.5">
                    <IconBook size={16} /> Evaluation Rubric
                  </h3>
                  <p className="text-[11.5px] text-[#6B6B6B] leading-relaxed">
                    Evaluate this submission against peer-review standards before taking an editorial decision (Accept / Reject / Comment).
                  </p>
                </div>

                {/* Criterion 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[12px] font-bold text-[#111]">
                    <span>1. Academic Rigor</span>
                    <span className="text-[#C9A55D]">{(rubricRigor !== null ? rubricRigor : 9.0).toFixed(1)} / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EAE6E2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A55D] rounded-full" style={{ width: `${(rubricRigor !== null ? rubricRigor : 9.0) * 10}%` }} />
                  </div>
                  <p className="text-[10.5px] text-[#8E8E8E] leading-normal">
                    Correct methodologies, appropriate baseline comparisons, and rigorous validation metrics are present.
                  </p>
                </div>

                {/* Criterion 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[12px] font-bold text-[#111]">
                    <span>2. Structure & Style</span>
                    <span className="text-[#C9A55D]">{(rubricStyle !== null ? rubricStyle : 9.5).toFixed(1)} / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EAE6E2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A55D] rounded-full" style={{ width: `${(rubricStyle !== null ? rubricStyle : 9.5) * 10}%` }} />
                  </div>
                  <p className="text-[10.5px] text-[#8E8E8E] leading-normal">
                    Proper styling according to {format.toUpperCase()} formatting guidelines. Organized sections and clear structures.
                  </p>
                </div>

                {/* Criterion 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[12px] font-bold text-[#111]">
                    <span>3. Novelty & Impact</span>
                    <span className="text-[#690B1B]">{(rubricNovelty !== null ? rubricNovelty : 9.2).toFixed(1)} / 10</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EAE6E2] rounded-full overflow-hidden">
                    <div className="h-full bg-[#690B1B] rounded-full" style={{ width: `${(rubricNovelty !== null ? rubricNovelty : 9.2) * 10}%` }} />
                  </div>
                  <p className="text-[10.5px] text-[#8E8E8E] leading-normal">
                    Fidelity of results, pediatric healthcare relevance, and validity of actionable insights.
                  </p>
                </div>

                {/* Quick Info Box */}
                <div className="p-4 rounded-xl bg-[#690B1B]/[0.03] border border-[#690B1B]/10 space-y-2">
                  <span className="text-[9px] font-extrabold uppercase text-[#690B1B] tracking-wider block">
                    Reviewer Profile
                  </span>
                  <div className="text-[12.5px] font-bold text-[#111]">
                    {role === "reviewer" ? currentReviewerName : "Editorial Publisher"}
                  </div>
                  <div className="text-[10.5px] text-[#6B6B6B] leading-relaxed">
                    You are evaluating &apos;{rawTopic}&apos;. Decisions update live on the researcher&apos;s dashboard.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── RIGHT: Original AI Assistant & Citations ── */
            <>
              {/* Tab Headers */}
              <div className="flex border-b border-[#E7E2DE] p-4 shrink-0">
                <div className="flex bg-[#ECE6E2] rounded-xl p-1 w-full">
                  <span className="flex-1 text-center py-2 text-[12px] font-bold rounded-lg bg-white text-[#690B1B] shadow-sm">
                    AI Co-Writer
                  </span>
                </div>
              </div>

              <div className="flex-grow flex flex-col justify-between overflow-hidden">
                {/* Discussion Thread */}
                <div className="flex-grow overflow-y-auto p-5 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`text-[10px] text-[#A5A5A5] uppercase tracking-wider font-semibold mb-1 ${msg.sender === "user" ? "text-right" : "text-left"
                          }`}
                      >
                        {msg.sender === "user" ? "You" : "Simplified AI"}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 max-w-[270px] text-[13.5px] leading-relaxed whitespace-pre-line shadow-sm border ${msg.sender === "user"
                            ? "bg-[#690B1B] text-white border-[#690B1B]"
                            : "bg-[#FAFAF9] text-[#3A000C] border-[#EDE8E4]"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-1 text-[#A5A5A5] pl-2 text-[12px]">
                      <span className="w-1.5 h-1.5 bg-[#A5A5A5] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#A5A5A5] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#A5A5A5] rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="ml-1">AI is thinking...</span>
                    </div>
                  )}
                </div>

                {/* Quick Citation Inserter */}
                <div className="border-t border-[#E7E2DE] p-4 bg-[#FAF9F7] shrink-0">
                  <div className="text-[10px] text-[#B0A08A] uppercase tracking-[0.16em] font-extrabold mb-3 flex items-center gap-1">
                    <IconBook size={14} /> Citations Inserter ({format.toUpperCase()})
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        id: "cit1",
                        label: `${paperAuthor ? formatAuthorForRef(paperAuthor).replace(/^[A-Z]\.\s+/, "") : "Doe"} (Nature 2024)`,
                        val: format === "ieee" ? "[1]" : `(${paperAuthor ? formatAuthorForRef(paperAuthor).replace(/^[A-Z]\.\s+/, "") : "Doe"}, 2024)`,
                      },
                      {
                        id: "cit2",
                        label: "Doe & Smith (IEEE 2023)",
                        val: format === "ieee" ? "[2]" : "(Doe & Smith, 2023)",
                      },
                    ].map((cit) => (
                      <button
                        key={cit.id}
                        onClick={() => handleInsertCitation(cit.val)}
                        className="w-full bg-white border border-[#EDE8E4] hover:border-[#690B1B]/40 px-3.5 py-2 rounded-xl text-[12px] font-bold text-[#111] flex items-center justify-between hover:shadow-sm transition cursor-pointer"
                      >
                        <span className="truncate">{cit.label}</span>
                        <span className="text-[#690B1B] bg-[#690B1B]/[0.06] px-2 py-0.5 rounded font-mono text-[10px]">
                          {cit.val}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Panel */}
                <form
                  onSubmit={handleSendPrompt}
                  className="border-t border-[#E7E2DE] p-4 flex gap-2 shrink-0 bg-white"
                >
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Ask AI to co-write, rephrase..."
                    className="flex-grow h-[46px] rounded-xl bg-[#F6F4F2] border border-[#E6DFDA] px-4 text-[13.5px] outline-none text-[#111] placeholder:text-[#A5A5A5]"
                  />
                  <button
                    type="submit"
                    className="w-[46px] h-[46px] rounded-xl bg-[#690B1B] text-white flex items-center justify-center shadow-sm hover:bg-[#7A1022] shrink-0 cursor-pointer"
                  >
                    <IconSend size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* ──── MOBILE/TABLET BOTTOM TAB BAR ─────────────────────────────────── */}
      <div className="lg:hidden h-[64px] bg-white border-t border-[#E7E2DE] px-4 flex items-center justify-around shrink-0 z-40">
        <button
          onClick={() => setMobileTab("outline")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors duration-200 ${
            mobileTab === "outline" ? "text-[#690B1B]" : "text-[#8E8E8E]"
          }`}
        >
          <IconBook size={20} stroke={2} />
          <span className="text-[10px] font-bold">Outline</span>
        </button>
        
        <button
          onClick={() => setMobileTab("write")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors duration-200 ${
            mobileTab === "write" ? "text-[#690B1B]" : "text-[#8E8E8E]"
          }`}
        >
          <IconSparkles size={20} stroke={2} className={mobileTab === "write" ? "animate-pulse" : ""} />
          <span className="text-[10px] font-bold">Write</span>
        </button>
        
        <button
          onClick={() => setMobileTab("ai")}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors duration-200 ${
            mobileTab === "ai" ? "text-[#690B1B]" : "text-[#8E8E8E]"
          }`}
        >
          <IconSend size={20} stroke={2} />
          <span className="text-[10px] font-bold">{role ? "Rubric" : "AI Assistant"}</span>
        </button>
      </div>

      {/* ──── REJECTION / COMMENT MODAL ──── */}
      {showReviewModal !== "none" && (
        <div className="fixed inset-0 bg-[#3A000C]/20 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-[#E7E2DE] rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-[16px] font-bold text-[#690B1B]">
                {role === "reviewer"
                  ? (showReviewModal === "reject" ? "Revert with Feedback" : "Add Referee Comments")
                  : (showReviewModal === "reject" ? "Reject with Feedback" : "Add Editorial Comments")}
              </h3>
              <p className="text-[12px] text-[#6B6B6B] mt-1">
                {role === "reviewer"
                  ? (showReviewModal === "reject"
                    ? "Provide a mandatory reason to revert the paper. The status will update to Rejected Draft."
                    : "Submit comments to the author. The status will update to Rejected Draft.")
                  : (showReviewModal === "reject"
                    ? "Provide a mandatory rejection reason. The status will update to Rejected."
                    : "Submit comments to the author. The status will update to Rejected.")}
              </p>
            </div>

            <form onSubmit={submitReviewFeedback} className="space-y-4">
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Write your comments/feedback here..."
                required
                rows={4}
                className="w-full rounded-xl bg-[#F6F4F2] border border-[#E6DFDA] p-3.5 text-[13px] outline-none text-[#111] placeholder:text-[#A5A5A5] focus:border-[#690B1B] focus:ring-1 focus:ring-[#690B1B]/15 transition-all font-[Poppins]"
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowReviewModal("none")}
                  className="h-[38px] px-4 rounded-xl border border-[#E6DFDA] bg-white text-[#5B5B5B] text-[12.5px] font-bold hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-[38px] px-5 rounded-xl bg-[#9C1C1C] text-white text-[12.5px] font-bold hover:bg-[#851818] cursor-pointer shadow-sm transition-all"
                >
                  {role === "reviewer" ? "Submit & Revert" : "Submit & Reject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──── SUCCESS NOTIFICATION TOAST ──── */}
      {successNotification && (
        <div className="fixed bottom-6 right-6 bg-[#0F8A43] text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 border border-[#0D7539] animate-in slide-in-from-bottom-5 duration-300">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-[12.5px] font-bold">{successNotification}</span>
        </div>
      )}

      {/* ──── PDF REVISED UPLOAD MODAL ──── */}
      {showPdfReuploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(58,0,12,0.35)" }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowPdfReuploadModal(false); setPdfReuploadFile(null); setPdfReuploadError(""); } }}
        >
          <div className="w-full max-w-lg bg-white rounded-[32px] shadow-[0_32px_80px_rgba(58,0,12,0.18)] overflow-hidden border border-[#EFE8E2] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 pt-8 pb-0 flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A55D] font-extrabold block mb-2">
                  Revised Manuscript
                </span>
                <h2 className="text-[#3A000C] text-[22px] font-bold tracking-tight leading-snug">
                  Upload Revised PDF
                </h2>
                <p className="text-[#6D6263] text-[13px] mt-2 leading-relaxed max-w-sm">
                  Upload your revised manuscript PDF. It will replace the previous version and be resubmitted for review — no additional payment required.
                </p>
                {rawTopic && (
                  <p className="text-[12px] font-bold text-[#690B1B] mt-2 truncate max-w-sm">
                    &quot;{rawTopic}&quot;
                  </p>
                )}
              </div>
              <button
                onClick={() => { setShowPdfReuploadModal(false); setPdfReuploadFile(null); setPdfReuploadError(""); }}
                className="w-9 h-9 rounded-full bg-[#F6F4F2] flex items-center justify-center text-[#6D6263] hover:bg-[#3A000C] hover:text-white transition-all shrink-0 mt-1 cursor-pointer"
              >
                <IconX size={16} stroke={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 space-y-4">
              <label className="relative border-2 border-dashed border-[#C9A55D]/40 hover:border-[#3A000C]/60 rounded-2xl p-8 bg-[#F8F7F4] flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[160px] block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.type === "application/pdf") {
                        setPdfReuploadFile(file);
                        setPdfReuploadError("");
                      } else {
                        setPdfReuploadError("Please upload a valid PDF file only.");
                      }
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <IconFileTypePdf size={32} className="text-[#C9A55D] mb-3" />
                <span className="text-[14px] font-bold text-[#3A000C]">
                  {pdfReuploadFile ? pdfReuploadFile.name : "Select Revised PDF File"}
                </span>
                <span className="text-[11px] text-[#A5A5A5] mt-1">
                  {pdfReuploadFile
                    ? `${(pdfReuploadFile.size / (1024 * 1024)).toFixed(2)} MB · PDF only`
                    : "Click to browse — PDF files only"}
                </span>
              </label>

              {pdfReuploadError && (
                <p className="text-[12px] text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">
                  {pdfReuploadError}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 pb-8 flex gap-3">
              <button
                type="button"
                onClick={() => { setShowPdfReuploadModal(false); setPdfReuploadFile(null); setPdfReuploadError(""); }}
                className="flex-1 h-[50px] rounded-[14px] border border-[#EFE8E2] bg-white text-[#6D6263] text-[14px] font-bold hover:bg-[#F8F7F4] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePdfReupload}
                disabled={!pdfReuploadFile || isPdfReuploading}
                className="flex-1 h-[50px] rounded-[14px] bg-[#690B1B] text-white text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#7A1022] active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(105,11,27,0.2)] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                {isPdfReuploading ? "Uploading..." : "Upload & Resubmit"} <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*                        PAGE EXPORT                                */
/* ═══════════════════════════════════════════════════════════════════ */

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCF8F9]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#690B1B] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#690B1B] text-[15px] font-medium tracking-wide">
              Initializing Paper Studio...
            </span>
          </div>
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
