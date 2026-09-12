// University types and data service
// Dual-mode: Uses Firebase Firestore when configured, static JSON otherwise

export interface ScholarshipItem {
  title: string;
  amount: string;
  description: string;
}

export interface SATScore {
  min: number;
  max: number;
}

export interface University {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  state: string;
  website: string;
  domain: string;
  qsRanking: string;
  acceptanceRate: number;
  tuition: number;
  livingCosts: number;
  popularMajors: string[];
  bannerImage: string;
  bannerAlt: string;
  avgNeedBasedGrant: number;
  avgGPA: number;
  satScore: SATScore;
  writingReqs: string;
  essayPrompts: string;
  toeflScore?: string;
  admissionRequirements?: string;
  scholarshipOpportunities?: string;
  scholarships?: ScholarshipItem[];
}

export interface SearchFilters {
  state?: string;
  minTuition?: number;
  maxTuition?: number;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  major?: string;
  searchQuery?: string;
  sortBy?: 'tuition' | 'netPrice' | 'acceptanceRate' | 'name' | 'gpa';
  sortOrder?: 'asc' | 'desc';
}

export interface CalculatorInputs {
  familyIncome: number;
  gpa: number;
  satScore: number;
  state: string;
  major: string;
  residency?: 'in-state' | 'out-of-state' | 'international';
  housing?: 'on-campus' | 'off-campus' | 'with-family';
  firstGen?: boolean;
  multipleInCollege?: boolean;
}

// ---- Static Data Loading ----

let cachedUniversities: University[] | null = null;

async function loadStaticData(): Promise<University[]> {
  if (cachedUniversities) return cachedUniversities;

  const data = await import('@/data/universities-us.json');
  cachedUniversities = data.default as unknown as University[];
  return cachedUniversities;
}

// ---- Public API ----

export async function getAllUniversities(): Promise<University[]> {
  return loadStaticData();
}

export async function getUniversityById(id: string): Promise<University | null> {
  const universities = await loadStaticData();
  return universities.find((u) => u.id === id) || null;
}

export async function getUniversitiesByIds(ids: string[]): Promise<University[]> {
  const universities = await loadStaticData();
  const idSet = new Set(ids);
  return universities.filter((u) => idSet.has(u.id));
}

export async function searchUniversities(filters: SearchFilters): Promise<University[]> {
  let universities = [...(await loadStaticData())];

  // Apply filters
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    universities = universities.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.state.toLowerCase().includes(query)
    );
  }

  if (filters.state) {
    universities = universities.filter((u) => u.state === filters.state);
  }

  if (filters.minTuition !== undefined) {
    universities = universities.filter((u) => u.tuition >= filters.minTuition!);
  }

  if (filters.maxTuition !== undefined) {
    universities = universities.filter((u) => u.tuition <= filters.maxTuition!);
  }

  if (filters.minAcceptanceRate !== undefined) {
    universities = universities.filter(
      (u) => u.acceptanceRate >= filters.minAcceptanceRate!
    );
  }

  if (filters.maxAcceptanceRate !== undefined) {
    universities = universities.filter(
      (u) => u.acceptanceRate <= filters.maxAcceptanceRate!
    );
  }

  if (filters.major) {
    const major = filters.major.toLowerCase();
    universities = universities.filter((u) =>
      u.popularMajors.some((m) => m.toLowerCase().includes(major))
    );
  }

  // Apply sorting
  const sortBy = filters.sortBy || 'tuition';
  const sortOrder = filters.sortOrder || 'asc';
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  universities.sort((a, b) => {
    switch (sortBy) {
      case 'tuition':
        return (a.tuition - b.tuition) * multiplier;
      case 'acceptanceRate':
        return (a.acceptanceRate - b.acceptanceRate) * multiplier;
      case 'name':
        return a.name.localeCompare(b.name) * multiplier;
      case 'gpa':
        return (a.avgGPA - b.avgGPA) * multiplier;
      default:
        return (a.tuition - b.tuition) * multiplier;
    }
  });

  return universities;
}

export async function getUniqueStates(): Promise<string[]> {
  const data = await import('@/data/states.json');
  return data.default as string[];
}

export async function getUniqueMajors(): Promise<string[]> {
  const data = await import('@/data/majors.json');
  return data.default as string[];
}

// ---- Utility Functions ----

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSATRange(sat: SATScore): string {
  if (sat.min === 0 && sat.max === 0) return 'N/A';
  if (sat.min === sat.max) return sat.min.toString();
  return `${sat.min} – ${sat.max}`;
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStickerPrice(uni: University): number {
  return uni.tuition + uni.livingCosts;
}
