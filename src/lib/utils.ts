/**
 * Helper to sanitize HTML content to fix encoding issues,
 * strip/convert broken LaTeX image tags, and fix paragraph spacing.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";
  let cleaned = html;

  // 1. Replace <img src="...latex..." alt="FORMULA" ...> with $FORMULA$ for KaTeX
  cleaned = cleaned.replace(/<img[^>]+src="[^"]*(?:latex|artofproblemsolving|codecogs)[^"]*"[^>]*alt="([^"]+)"[^>]*>/gi, (match, altText) => {
    const decodedAlt = altText
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');
    return ` $${decodedAlt}$ `;
  });

  // 2. Replace <img alt="FORMULA" src="...latex..." ...> with $FORMULA$ for KaTeX
  cleaned = cleaned.replace(/<img[^>]+alt="([^"]+)"[^>]+src="[^"]*(?:latex|artofproblemsolving|codecogs)[^"]*"[^>]*>/gi, (match, altText) => {
    const decodedAlt = altText
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');
    return ` $${decodedAlt}$ `;
  });

  // 3. Remove any other leftover broken LaTeX images
  cleaned = cleaned.replace(/<img[^>]+src="[^"]*(?:latex|artofproblemsolving|codecogs)[^"]*"[^>]*>/gi, "");

  // 4. Replace escaped characters like \* and \_ with * and _
  cleaned = cleaned.replace(/\\([*_])/g, "$1");

  // 5. Replace LaTeX greek symbols with their corresponding unicode characters
  const greekMap: Record<string, string> = {
    "\\alpha": "α",
    "\\beta": "β",
    "\\gamma": "γ",
    "\\delta": "δ",
    "\\epsilon": "ε",
    "\\zeta": "ζ",
    "\\eta": "η",
    "\\theta": "θ",
    "\\iota": "ι",
    "\\kappa": "κ",
    "\\lambda": "λ",
    "\\mu": "μ",
    "\\nu": "ν",
    "\\xi": "ξ",
    "\\pi": "π",
    "\\rho": "ρ",
    "\\sigma": "σ",
    "\\tau": "τ",
    "\\upsilon": "υ",
    "\\phi": "φ",
    "\\chi": "χ",
    "\\psi": "ψ",
    "\\omega": "ω",
    "\\Sigma": "Σ",
    "\\Delta": "Δ",
    "\\Theta": "Θ",
    "\\Lambda": "Λ",
    "\\Xi": "Ξ",
    "\\Pi": "Π",
    "\\Phi": "Φ",
    "\\Psi": "Ψ",
    "\\Omega": "Ω"
  };

  Object.entries(greekMap).forEach(([command, unicode]) => {
    const escapedCommand = command.replace(/\\/g, "\\\\");
    const regex = new RegExp(escapedCommand + "(?![a-zA-Z])", "g");
    cleaned = cleaned.replace(regex, unicode);
  });

  // 6. Sanitize unicode characters that display as Mojibake (e.g. â€” -> &mdash;)
  cleaned = cleaned
    .replace(/â€”/g, "&mdash;")
    .replace(/â€“/g, "&ndash;")
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/\uFFFD/g, " ");

  return cleaned;
};
