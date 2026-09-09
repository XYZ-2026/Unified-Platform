/**
 * High-Performance Fuzzy Search & Relevance Scoring Engine for Universities
 * 
 * Supports:
 * - Exact acronyms & abbreviations (MIT, CMU, UCLA, UIUC, TUM, UBC, UNSW, etc.)
 * - Typo tolerance & Damerau-Levenshtein distance (Stanfrod, Havard, Berkley, Oxfrd, etc.)
 * - Spacing and punctuation insensitivity (m.i.t., ucberkeley, cal tech, u of t)
 * - Multi-word partial & prefix matching
 * - Curated alias & nickname dictionary (The Farm, Crimson, Cal, Co-op, etc.)
 * - Majors, state, country, and city keyword search
 * - Deterministic relevance scoring and ranking (< 1ms execution time)
 */

export interface UniversitySearchRecord {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  state?: string;
  qsRanking?: string;
  tuition?: string;
  livingCosts?: string;
  acceptanceRate?: string;
  website?: string;
  popularMajors?: string[];
  allMajors?: string[];
  slug?: string;
  [key: string]: any;
}

export interface SearchResult<T = UniversitySearchRecord> {
  item: T;
  score: number;
  matchType: 'exact' | 'alias' | 'acronym' | 'prefix' | 'substring' | 'fuzzy' | 'major';
  matchedField?: string;
  matchedAlias?: string;
}

// ─── CURATED UNIVERSITY ALIASES & NICKNAMES ────────────────────────────────────
// Maps university slug, id, or normalized name tokens to common nicknames and aliases
export const UNIVERSITY_ALIASES: Record<string, string[]> = {
  // United States
  'mit': ['mit', 'mass tech', 'massachusetts tech', 'boston tech', 'm.i.t.'],
  'massachusetts-institute-of-technology': ['mit', 'mass tech', 'massachusetts tech', 'boston tech', 'm.i.t.'],
  
  'stanford': ['stanford', 'stanfurd', 'the farm', 'cardinal', 'su', 'stanford university', 'palo alto'],
  'stanford-university': ['stanford', 'stanfurd', 'the farm', 'cardinal', 'su', 'stanford university', 'palo alto'],
  
  'harvard': ['harvard', 'crimson', 'cambridge ma', 'harvard university', 'harvard yard'],
  'harvard-university': ['harvard', 'crimson', 'cambridge ma', 'harvard university', 'harvard yard'],
  
  'caltech': ['caltech', 'cal tech', 'california tech', 'cit', 'california institute of technology', 'pasadena'],
  'california-institute-of-technology': ['caltech', 'cal tech', 'california tech', 'cit', 'pasadena'],
  
  'uc-berkeley': ['ucb', 'cal', 'berkeley', 'uc berkeley', 'california', 'golden bears', 'eecs', 'cal berkeley', 'uc-berkeley'],
  'university-of-california-berkeley': ['ucb', 'cal', 'berkeley', 'uc berkeley', 'california', 'golden bears', 'eecs', 'cal berkeley'],
  
  'cmu': ['cmu', 'carnegie mellon', 'carnegie', 'mellon', 'tartan', 'cmu pittsburgh'],
  'carnegie-mellon': ['cmu', 'carnegie mellon', 'carnegie', 'mellon', 'tartan', 'cmu pittsburgh'],
  'carnegie-mellon-university': ['cmu', 'carnegie mellon', 'carnegie', 'mellon', 'tartan', 'cmu pittsburgh'],
  
  'princeton': ['princeton', 'pu', 'tigers', 'princeton university', 'new jersey uni'],
  'princeton-university': ['princeton', 'pu', 'tigers', 'princeton university', 'new jersey uni'],
  
  'columbia': ['columbia', 'cu', 'columbia university nyc', 'lions', 'columbia new york', 'morningside'],
  'columbia-university': ['columbia', 'cu', 'columbia university nyc', 'lions', 'columbia new york', 'morningside'],
  
  'uiuc': ['uiuc', 'illinois', 'urbana champaign', 'u of i', 'illini', 'university of illinois'],
  'university-of-illinois-urbana-champaign': ['uiuc', 'illinois', 'urbana champaign', 'u of i', 'illini'],
  
  // United Kingdom
  'oxford': ['oxford', 'oxon', 'oxfordshire', 'bodleian', 'university of oxford', 'oxford uni'],
  'university-of-oxford': ['oxford', 'oxon', 'oxfordshire', 'bodleian', 'oxford uni'],
  
  'cambridge': ['cambridge', 'cantab', 'cambridgeshire', 'university of cambridge', 'cambridge uni'],
  'university-of-cambridge': ['cambridge', 'cantab', 'cambridgeshire', 'cambridge uni'],
  
  'imperial': ['imperial', 'imperial college london', 'icl', 'south kensington', 'imperial college'],
  'imperial-college-london': ['imperial', 'imperial college london', 'icl', 'south kensington', 'imperial college'],
  
  'ucl': ['ucl', 'university college london', 'bloomsbury', 'ucl london'],
  'university-college-london': ['ucl', 'university college london', 'bloomsbury', 'ucl london'],
  
  'edinburgh': ['edinburgh', 'uoe', 'scotland uni', 'university of edinburgh', 'edinburgh uni'],
  'university-of-edinburgh': ['edinburgh', 'uoe', 'scotland uni', 'edinburgh uni'],
  
  'manchester': ['manchester', 'uom', 'university of manchester', 'manchester uni'],
  'university-of-manchester': ['manchester', 'uom', 'manchester uni'],

  // Canada
  'utoronto': ['utoronto', 'u of t', 'toronto uni', 'uoft', 'st george', 'university of toronto', 'toronto'],
  'university-of-toronto': ['utoronto', 'u of t', 'toronto uni', 'uoft', 'st george', 'toronto'],
  
  'mcgill': ['mcgill', 'mcgill university', 'mcgill montreal', 'quebec uni'],
  'mcgill-university': ['mcgill', 'mcgill university', 'mcgill montreal', 'quebec uni'],
  
  'ubc': ['ubc', 'british columbia', 'vancouver uni', 'university of british columbia', 'point grey'],
  'university-of-british-columbia': ['ubc', 'british columbia', 'vancouver uni', 'point grey'],
  
  'uwaterloo': ['waterloo', 'uw', 'uwaterloo', 'waterloo co-op', 'university of waterloo'],
  'university-of-waterloo': ['waterloo', 'uw', 'uwaterloo', 'waterloo co-op'],
  
  'ualberta': ['ualberta', 'u of a', 'alberta uni', 'edmonton uni', 'university of alberta'],
  'university-of-alberta': ['ualberta', 'u of a', 'alberta uni', 'edmonton uni'],

  // Germany
  'tum': ['tum', 'tu munich', 'technical university of munich', 'munich tech', 'tum munich', 'tu münchen'],
  'technical-university-of-munich': ['tum', 'tu munich', 'munich tech', 'tum munich', 'tu münchen'],
  
  'lmu': ['lmu', 'lmu munich', 'ludwig maximilians', 'uni munich', 'ludwig-maximilians-universität'],
  'lmu-munich': ['lmu', 'lmu munich', 'ludwig maximilians', 'uni munich', 'ludwig-maximilians-universität'],
  
  'heidelberg': ['heidelberg', 'uni heidelberg', 'heidelberg university', 'ruprecht karl'],
  'heidelberg-university': ['heidelberg', 'uni heidelberg', 'ruprecht karl'],
  
  'rwth': ['rwth', 'rwth aachen', 'aachen tech', 'aachen university', 'rwth aachen university'],
  'rwth-aachen-university': ['rwth', 'rwth aachen', 'aachen tech', 'aachen university'],
  
  'humboldt': ['humboldt', 'hu berlin', 'humboldt university', 'humboldt-universität zu berlin'],
  'humboldt-university-of-berlin': ['humboldt', 'hu berlin', 'humboldt university', 'humboldt-universität zu berlin'],

  // Australia
  'unimelb': ['unimelb', 'melb uni', 'melbourne university', 'u of melbourne', 'university of melbourne', 'parkville'],
  'university-of-melbourne': ['unimelb', 'melb uni', 'melbourne university', 'u of melbourne', 'parkville'],
  
  'usyd': ['usyd', 'sydney uni', 'university of sydney', 'sydney university', 'camperdown'],
  'university-of-sydney': ['usyd', 'sydney uni', 'sydney university', 'camperdown'],
  
  'unsw': ['unsw', 'unsw sydney', 'new south wales', 'university of new south wales', 'kensington sydney'],
  'unsw-sydney': ['unsw', 'unsw sydney', 'new south wales', 'kensington sydney'],
  
  'anu': ['anu', 'australian national university', 'canberra uni', 'act uni'],
  'australian-national-university': ['anu', 'canberra uni', 'act uni'],
  
  'uq': ['uq', 'queensland uni', 'university of queensland', 'st lucia brisbane'],
  'university-of-queensland': ['uq', 'queensland uni', 'st lucia brisbane'],
  
  'monash': ['monash', 'monash university', 'clayton campus', 'caulfield'],
  'monash-university': ['monash', 'clayton campus', 'caulfield'],
};

// ─── STRING NORMALIZATION UTILITIES ──────────────────────────────────────────

/**
 * Normalizes a string by converting to lowercase, stripping accents,
 * removing non-alphanumeric characters, and collapsing whitespace.
 */
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents
    .replace(/[^a-z0-9\s]/g, ' ')   // replace punctuation with space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns string with all spaces & non-alphanumeric stripped (for space-insensitive matching).
 */
export function stripSpaces(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Automatically derives acronyms from a university name (e.g. "Massachusetts Institute of Technology" -> "mit").
 */
export function extractAcronyms(name: string): string[] {
  if (!name) return [];
  const acronyms: string[] = [];

  // 1. Acronym from parentheses if present (e.g. "(MIT)", "(UIUC)", "(CMU)", "(TUM)")
  const parenMatch = name.match(/\(([^)]+)\)/);
  if (parenMatch && parenMatch[1]) {
    const inside = normalizeText(parenMatch[1]);
    if (inside.length >= 2 && inside.length <= 8) {
      acronyms.push(inside);
      acronyms.push(stripSpaces(inside));
    }
  }

  // 2. Acronym from capital/initial letters of words (excluding common stop words)
  const stopWords = new Set(['of', 'and', 'the', 'for', 'in', 'at', 'on', 'der', 'zu', 'und', 'de', 'la']);
  const clean = name.replace(/\([^)]*\)/g, '').replace(/[^a-zA-Z\s]/g, ' ');
  const words = clean.split(/\s+/).filter((w) => w.length > 0 && !stopWords.has(w.toLowerCase()));

  if (words.length >= 2) {
    const initials = words.map((w) => w[0].toLowerCase()).join('');
    acronyms.push(initials);
  }

  return Array.from(new Set(acronyms.filter(Boolean)));
}

// ─── DAMERAU-LEVENSHTEIN DISTANCE (TYPO TOLERANCE) ──────────────────────────

/**
 * Calculates Damerau-Levenshtein edit distance (supports insertions, deletions, substitutions, and transpositions).
 * Optimized with an early exit threshold.
 */
export function damerauLevenshteinDistance(a: string, b: string, maxDistance: number = 3): number {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const lenA = a.length;
  const lenB = b.length;

  if (Math.abs(lenA - lenB) > maxDistance) return maxDistance + 1;

  // Single-row / 2D DP matrix
  const matrix: number[][] = [];
  for (let i = 0; i <= lenA; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lenB; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let dist = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dist = Math.min(dist, matrix[i - 2][j - 2] + 1);
      }

      matrix[i][j] = dist;
      if (dist < rowMin) rowMin = dist;
    }

    if (rowMin > maxDistance) return maxDistance + 1;
  }

  return matrix[lenA][lenB];
}

// ─── RELEVANCE SCORING ENGINE ───────────────────────────────────────────────

/**
 * Evaluates how closely a single university matches the user query.
 * Returns a numerical score (0 = no match, 1000+ = perfect match).
 */
export function scoreUniversityMatch(
  uni: UniversitySearchRecord,
  query: string,
  normalizedQuery: string,
  compactQuery: string
): { score: number; matchType: SearchResult['matchType']; matchedField?: string; matchedAlias?: string } {
  if (!normalizedQuery || !compactQuery) {
    return { score: 0, matchType: 'substring' };
  }

  const nameNorm = normalizeText(uni.name);
  const nameCompact = stripSpaces(uni.name);
  const slugNorm = normalizeText(uni.slug || '');
  const stateNorm = normalizeText(uni.state || '');
  const countryNorm = normalizeText(uni.country || '');
  const countryCodeNorm = normalizeText(uni.countryCode || '');

  // Collect all aliases and acronyms for this university
  const directAliases = [
    ...(UNIVERSITY_ALIASES[uni.slug || ''] || []),
    ...(UNIVERSITY_ALIASES[uni.id || ''] || []),
    ...(UNIVERSITY_ALIASES[nameNorm] || []),
  ];
  const autoAcronyms = extractAcronyms(uni.name);
  const allAliases = Array.from(new Set([...directAliases, ...autoAcronyms].map(normalizeText)));

  // ── 1. EXACT MATCHES (Top Tier: 1000+) ──────────────────────────────────────
  // Exact name or compact name match
  if (nameNorm === normalizedQuery || nameCompact === compactQuery) {
    return { score: 1200, matchType: 'exact', matchedField: 'name' };
  }

  // Exact acronym / alias match (e.g. "mit", "cmu", "tum", "ubc", "ucl")
  for (const alias of allAliases) {
    const aliasCompact = stripSpaces(alias);
    if (alias === normalizedQuery || aliasCompact === compactQuery) {
      return { score: 1100, matchType: 'alias', matchedAlias: alias, matchedField: 'alias' };
    }
  }

  // ── 2. PREFIX & WORD-START MATCHES (Tier 2: 600 - 850) ──────────────────────
  // Name starts with query (e.g. "stan" -> Stanford)
  if (nameNorm.startsWith(normalizedQuery) || nameCompact.startsWith(compactQuery)) {
    const lengthRatio = normalizedQuery.length / nameNorm.length;
    return { score: 850 + Math.round(lengthRatio * 100), matchType: 'prefix', matchedField: 'name' };
  }

  // Alias starts with query (e.g. "mass tech" -> MIT)
  for (const alias of allAliases) {
    if (alias.startsWith(normalizedQuery) || stripSpaces(alias).startsWith(compactQuery)) {
      return { score: 800, matchType: 'alias', matchedAlias: alias, matchedField: 'alias' };
    }
  }

  // A word in the university name starts with query (e.g. "berkeley" in "University of California, Berkeley")
  const nameWords = nameNorm.split(' ').filter(Boolean);
  for (const word of nameWords) {
    if (word.startsWith(normalizedQuery)) {
      return { score: 750, matchType: 'prefix', matchedField: 'name' };
    }
  }

  // ── 3. SUBSTRING MATCHES (Tier 3: 400 - 650) ───────────────────────────────
  // Query is contained in name
  if (nameNorm.includes(normalizedQuery) || nameCompact.includes(compactQuery)) {
    return { score: 600, matchType: 'substring', matchedField: 'name' };
  }

  // Query is contained in an alias
  for (const alias of allAliases) {
    if (alias.includes(normalizedQuery) || stripSpaces(alias).includes(compactQuery)) {
      return { score: 550, matchType: 'alias', matchedAlias: alias, matchedField: 'alias' };
    }
  }

  // Location match: state / province
  if (stateNorm && (stateNorm === normalizedQuery || stateNorm.startsWith(normalizedQuery))) {
    return { score: 500, matchType: 'substring', matchedField: 'state' };
  }
  if (stateNorm && stateNorm.includes(normalizedQuery)) {
    return { score: 450, matchType: 'substring', matchedField: 'state' };
  }

  // Location match: country
  if (countryNorm === normalizedQuery || countryCodeNorm === normalizedQuery) {
    return { score: 400, matchType: 'substring', matchedField: 'country' };
  }

  // ── 4. POPULAR MAJORS MATCH (Tier 4: 300 - 480) ────────────────────────────
  const majors = uni.allMajors || uni.popularMajors || [];
  for (const major of majors) {
    const majorNorm = normalizeText(major);
    const majorCompact = stripSpaces(major);

    if (majorNorm === normalizedQuery || majorCompact === compactQuery) {
      return { score: 480, matchType: 'major', matchedField: major };
    }
    if (majorNorm.startsWith(normalizedQuery)) {
      return { score: 420, matchType: 'major', matchedField: major };
    }
    if (majorNorm.includes(normalizedQuery)) {
      return { score: 350, matchType: 'major', matchedField: major };
    }
  }

  // ── 5. FUZZY MATCH & TYPO TOLERANCE (Tier 5: 100 - 350) ───────────────────
  // Only evaluate fuzzy distance if query has 3 or more characters to avoid false positives on short noise
  if (compactQuery.length >= 3) {
    let bestFuzzyScore = 0;
    let bestFuzzyAlias = '';
    const maxAllowedDist = compactQuery.length >= 8 ? 3 : compactQuery.length >= 4 ? 2 : 1;

    // A. Fuzzy match against aliases / acronyms (e.g. "stanfurd" -> "stanford", "caltechh" -> "caltech")
    for (const alias of allAliases) {
      const aliasCompact = stripSpaces(alias);
      const dist = damerauLevenshteinDistance(compactQuery, aliasCompact, maxAllowedDist);
      if (dist <= maxAllowedDist) {
        const fuzzyScore = 320 - dist * 40;
        if (fuzzyScore > bestFuzzyScore) {
          bestFuzzyScore = fuzzyScore;
          bestFuzzyAlias = alias;
        }
      }
    }

    // B. Fuzzy match against individual words in university name (e.g. "Havard" -> "Harvard", "Berkley" -> "Berkeley")
    for (const word of nameWords) {
      if (word.length >= 3) {
        const dist = damerauLevenshteinDistance(normalizedQuery, word, maxAllowedDist);
        if (dist <= maxAllowedDist) {
          const fuzzyScore = 300 - dist * 40;
          if (fuzzyScore > bestFuzzyScore) {
            bestFuzzyScore = fuzzyScore;
          }
        }
      }
    }

    // C. Fuzzy match against full name compact (e.g. "tornto university" -> "toronto university")
    if (nameCompact.length > 0) {
      const dist = damerauLevenshteinDistance(compactQuery, nameCompact, maxAllowedDist);
      if (dist <= maxAllowedDist) {
        const fuzzyScore = 280 - dist * 40;
        if (fuzzyScore > bestFuzzyScore) {
          bestFuzzyScore = fuzzyScore;
        }
      }
    }

    // D. Fuzzy match against majors (e.g. "cmputer science" -> "computer science")
    for (const major of majors) {
      const majorWords = normalizeText(major).split(' ');
      for (const mWord of majorWords) {
        if (mWord.length >= 4) {
          const dist = damerauLevenshteinDistance(normalizedQuery, mWord, maxAllowedDist);
          if (dist <= maxAllowedDist) {
            const fuzzyScore = 220 - dist * 40;
            if (fuzzyScore > bestFuzzyScore) {
              bestFuzzyScore = fuzzyScore;
            }
          }
        }
      }
    }

    if (bestFuzzyScore > 0) {
      return {
        score: bestFuzzyScore,
        matchType: 'fuzzy',
        matchedAlias: bestFuzzyAlias || undefined,
        matchedField: bestFuzzyAlias ? 'alias' : 'name',
      };
    }
  }

  // No match
  return { score: 0, matchType: 'substring' };
}

// ─── MAIN SEARCH & FILTER FUNCTION ──────────────────────────────────────────

export interface SearchOptions {
  search?: string;
  country?: string;
  minScoreThreshold?: number;
}

/**
 * Searches and ranks universities with extreme speed (< 1ms), typo tolerance,
 * alias resolution, and deterministic relevance ranking.
 */
export function searchUniversities<T extends UniversitySearchRecord>(
  universities: T[],
  options: SearchOptions = {}
): SearchResult<T>[] {
  const { search = '', country = 'ALL', minScoreThreshold = 50 } = options;

  const rawQuery = search.trim();
  const normalizedQuery = normalizeText(rawQuery);
  const compactQuery = stripSpaces(rawQuery);
  const isAllCountry = !country || country === 'ALL';

  // 1. Filter by country first if specified
  const countryFiltered = isAllCountry
    ? universities
    : universities.filter((u) => {
        const cCode = (u.countryCode || '').toUpperCase();
        const cName = (u.country || '').toUpperCase();
        const target = country.toUpperCase();
        return cCode === target || cName.includes(target);
      });

  // 2. If no search term, return all items with neutral score (preserving default/ranking order)
  if (!normalizedQuery) {
    return countryFiltered.map((item) => ({
      item,
      score: 100,
      matchType: 'substring',
    }));
  }

  // 3. Score every university
  const scoredResults: SearchResult<T>[] = [];

  for (const item of countryFiltered) {
    const { score, matchType, matchedField, matchedAlias } = scoreUniversityMatch(
      item,
      rawQuery,
      normalizedQuery,
      compactQuery
    );

    if (score >= minScoreThreshold) {
      // QS Rank tie-breaker bonus: lower rank number gives slight score boost for identical matches
      let rankBonus = 0;
      if (item.qsRanking && item.qsRanking !== 'Unranked') {
        const rankNum = parseInt(item.qsRanking.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(rankNum) && rankNum > 0) {
          rankBonus = Math.max(0, 10 - rankNum * 0.05); // slight tie-break advantage
        }
      }

      scoredResults.push({
        item,
        score: score + rankBonus,
        matchType,
        matchedField,
        matchedAlias,
      });
    }
  }

  // 4. Sort results descending by score, then alphabetically
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (a.item.name || '').localeCompare(b.item.name || '');
  });

  return scoredResults;
}
