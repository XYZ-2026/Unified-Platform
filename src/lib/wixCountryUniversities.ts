import type { CanadaUniversity } from '@/app/country/canada/page';
import type { GermanyUniversity } from '@/app/country/germany/page';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let canadaCache: CacheEntry<CanadaUniversity[]> | null = null;
let germanyCache: CacheEntry<GermanyUniversity[]> | null = null;

/**
 * Robust clean slug generator handling special characters and German umlauts
 */
export function toCleanSlug(name: string): string {
  if (!name) return '';
  return name
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/Ä/g, 'ae')
    .replace(/Ö/g, 'oe')
    .replace(/Ü/g, 'ue')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format Wix image URL if present in wix:image:// format
 */
function formatWixImageUrl(url: any): string {
  if (!url) return '';
  if (typeof url !== 'string') {
    if (url.url) return formatWixImageUrl(url.url);
    if (url.src) return formatWixImageUrl(url.src);
    return '';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('wix:image://v1/')) {
    const match = trimmed.match(/^wix:image:\/\/v1\/([^\/#]+)/);
    if (match && match[1]) {
      return `https://static.wixstatic.com/media/${match[1]}`;
    }
  }
  return trimmed;
}

/**
 * Generic helper to fetch all items from a Wix CMS collection using cursor-based pagination
 */
async function fetchAllItemsFromWixCollection(
  collectionCandidates: string[],
  wixApiKey: string,
  wixSiteId: string
): Promise<any[]> {
  const headers = {
    Authorization: wixApiKey,
    'wix-site-id': wixSiteId,
    'Content-Type': 'application/json',
  };

  for (const collectionId of collectionCandidates) {
    try {
      let allItems: any[] = [];
      let cursor: string | null = null;
      let hasMore = true;

      while (hasMore) {
        const queryPayload: any = {
          dataCollectionId: collectionId,
          query: {
            paging: { limit: 100 },
          },
        };

        if (cursor) {
          queryPayload.query.cursorPaging = { cursor, limit: 100 };
          delete queryPayload.query.paging;
        }

        const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
          method: 'POST',
          headers,
          body: JSON.stringify(queryPayload),
          next: { revalidate: 900 }, // Next.js cache revalidate 15 mins
        });

        if (!res.ok) {
          break;
        }

        const data = await res.json();
        const items = data.dataItems || [];
        allItems = allItems.concat(items);

        if (data.pagingMetadata?.hasNext && data.pagingMetadata?.cursors?.next) {
          cursor = data.pagingMetadata.cursors.next;
        } else {
          hasMore = false;
        }
      }

      if (allItems.length > 0) {
        return allItems;
      }
    } catch (err) {
      console.warn(`Error querying Wix collection ${collectionId}:`, err);
    }
  }

  return [];
}

/**
 * Maps raw Wix CMS document from "Canadian Universities" collection (Import7)
 * to strongly-typed CanadaUniversity containing all 34 specific columns.
 */
function mapWixToCanadaUniversity(d: any): CanadaUniversity {
  const bannerImage = formatWixImageUrl(d.bannerImage || d['Banner Image'] || '');

  return {
    // 1. institution_id
    institutionId: String(d.institution_id || d.institutionId || '').trim(),
    // 2. institution_name
    institutionName: String(d.institution_name || d.institutionName || 'Unknown University').trim(),
    // 3. province
    province: String(d.province || '').trim(),
    // 4. city
    city: String(d.city || '').trim(),
    // 5. institution_type
    institutionType: String(d.institution_type || d.institutionType || 'Public University').trim(),
    // 6. public_private
    publicPrivate: String(d.public_private || d.publicPrivate || 'Public institution').trim(),
    // 7. official_website
    officialWebsite: String(d.official_website || d.officialWebsite || '').trim(),
    // 8. domain
    domain: String(d.domain || '').trim(),
    // 9. dli_number
    dliNumber: String(d.dli_number || d.dliNumber || '').trim(),
    // 10. international_student_eligible
    internationalStudentEligible: String(d.international_student_eligible || d.internationalStudentEligible || 'Yes').trim(),
    // 11. offers_undergraduate
    offersUndergraduate: String(d.offers_undergraduate || d.offersUndergraduate || 'Yes').trim(),
    // 12. offers_postgraduate
    offersPostgraduate: String(d.offers_postgraduate || d.offersPostgraduate || 'Yes').trim(),
    // 13. offers_doctoral
    offersDoctoral: String(d.offers_doctoral || d.offersDoctoral || 'No').trim(),
    // 14. language_of_instruction
    languageOfInstruction: String(d.language_of_instruction || d.languageOfInstruction || 'English').trim(),
    // 15. last_verified_date
    lastVerifiedDate: String(d.last_verified_date || d.lastVerifiedDate || '').trim(),
    // 16. country
    country: String(d.country || 'Canada').trim(),
    // 17. country_code
    countryCode: String(d.country_code || d.countryCode || 'CA').trim(),
    // 18. QS Ranking
    qsRanking: String(d.qsRanking || d['QS Ranking'] || 'Unranked').trim(),
    // 19. Acceptance Rate
    acceptanceRate: String(d.acceptanceRate || d['Acceptance Rate'] || 'N/A').trim(),
    // 20. Tuition (note CMS field name is 'tution')
    tuition: String(d.tution || d.tuition || d['Tuition'] || 'N/A').trim(),
    // 21. Living Costs
    livingCosts: String(d.livingCosts || d['Living Costs'] || 'CAD 15,000/yr').trim(),
    // 22. Popular Majors
    popularMajors: String(d.popularMajors || d['Popular Majors'] || '').trim(),
    // 23. Banner Image
    bannerImage,
    // 24. Banner Image alt text
    bannerImageAlt: String(
      d.bannerImageAltText ||
      d.bannerImageAlt ||
      `${d.institution_name || 'Canadian University'} official campus banner`
    ).trim(),
    // 25. Avg Need Based Grant
    avgNeedBasedGrant: String(d.avgNeedBasedGrant || d['Avg Need Based Grant'] || 'N/A').trim(),
    // 26. Avg GPA
    avgGpa: String(d.avgGpa || d['Avg GPA'] || 'N/A').trim(),
    // 27. SAT Score
    satScore: String(d.satScore || d['SAT Score'] || 'Optional / Not Required').trim(),
    // 28. Writing Requirements
    writingRequirements: String(d.writingRequirements || d['Writing Requirements'] || 'IELTS / TOEFL').trim(),
    // 29. Required Essay Prompts & Details
    requiredEssayPrompts: String(
      d.requiredEssayPromptsDetails ||
      d.requiredEssayPrompts ||
      d['Required Essay Prompts & Details'] ||
      ''
    ).trim(),
    // 30. Scholarships
    scholarships: String(d.scholarships || d['Scholarships'] || '').trim(),
    // 31. Total Cost
    totalCost: String(d.totalCost || d['Total Cost'] || '').trim(),
    // 32. Career Outcomes
    careerOutcomes: String(d.careerOutcomes || d['Career Outcomes'] || '').trim(),
    // 33. Expected Salary
    expectedSalary: String(d.expectedSalary || d['Expected Salary'] || '').trim(),
    // 34. ROI
    roi: String(d.roi || d['ROI'] || '').trim(),
  };
}

/**
 * Maps raw Wix CMS document from "Germany Universities" collection (Import8)
 * to strongly-typed GermanyUniversity containing all 25 specific columns.
 */
function mapWixToGermanyUniversity(d: any): GermanyUniversity {
  const uniTypeRaw = String(d.universityTypePublicPrivate || d.universityType || 'Public').toLowerCase();
  const universityType: 'Public' | 'Private' = uniTypeRaw.includes('private') ? 'Private' : 'Public';
  const uniName = String(d.universityName || d.name || 'Unknown University').trim();
  const state = String(d.federalState || d.state || '').trim();

  return {
    // 1. University Name
    universityName: uniName,
    // 2. City
    city: String(d.city || '').trim(),
    // 3. Institution Type
    institutionType: String(d.institutionType || 'University').trim(),
    // 4. University Type - Public / Private
    universityType,
    // 5. Federal State
    federalState: state,
    // 6. NC / Numerus Clausus
    ncNumerusClausus: String(d.ncNumerusClausus || 'Varies by subject').trim(),
    // 7. NC Grade / Cut-off
    ncGradeCutoff: String(d.ncGradeCutOff || d.ncGradeCutoff || 'Varies').trim(),
    // 8. HZB / Hochschulzugangsberechtigung
    hzb: String(d.hzbHochschulzugangsberechtigung || d.hzb || 'Allgemeine Hochschulreife / recognized equivalent').trim(),
    // 9. Studienkolleg Required
    studienkollegRequired: String(d.studienkollegRequired || 'Yes – for non-equivalent secondary diplomas').trim(),
    // 10. APS Certificate Required
    apsCertificateRequired: String(d.apsCertificateRequired || 'Yes – mandatory for Indian applicants').trim(),
    // 11. uni-assist Application
    uniAssistApplication: String(d.uniAssistApplication || 'Yes / via uni-assist for international applications').trim(),
    // 12. Hochschulstart Application
    hochschulstartApplication: String(d.hochschulstartApplication || 'Yes – for nationwide NC programs (Medicine/Pharmacy)').trim(),
    // 13. Semester Contribution
    semesterContribution: String(d.semesterContribution || '€150–€350 / semester').trim(),
    // 14. Semester Ticket
    semesterTicket: String(d.semesterTicket || 'Included / public transport valid in state/region').trim(),
    // 15. Baden-Wuerttemberg Tuition Fee
    bwTuitionFee: String(
      d.badenWuerttembergTuitionFee ||
      d.bwTuitionFee ||
      (state === 'Baden-Württemberg' ? 'Yes – €1,500/semester for non-EU students' : 'No – €0 public tuition fee')
    ).trim(),
    // 16. ECTS Requirements
    ectsRequirements: String(d.ectsRequirements || 'Bachelor: 180–240 ECTS; Master: 120 ECTS').trim(),
    // 17. German Language Requirement
    germanLanguageRequirement: String(d.germanLanguageRequirement || 'DSH-2 / TestDaF TDN 4 for German-taught; IELTS 6.5+ for English-taught').trim(),
    // 18. TestDaF
    testDaF: String(d.testDaF || 'TDN 4 in all sections').trim(),
    // 19. DSH
    dsh: String(d.dsh || 'DSH-2 minimum').trim(),
    // 20. Blocked Account / Proof of Funds
    blockedAccountProofOfFunds: String(d.blockedAccountProofOfFunds || '€11,904/year (€992/month)').trim(),
    // 21. Winter Semester
    winterSemester: String(d.winterSemester || 'Yes – main intake (deadline Jul 15)').trim(),
    // 22. Summer Semester
    summerSemester: String(d.summerSemester || 'Limited programs (deadline Jan 15)').trim(),
    // 23. Indian qualification equivalency
    indianQualificationEquivalency: String(d.indianQualificationEquivalency || 'Class 12 requires Studienkolleg; 4-yr Bachelor recognized for Master').trim(),
    // 24. Anabin / qualification recognition
    anabinRecognition: String(d.anabinQualificationRecognition || d.anabinRecognition || 'Check anabin.kmk.org (H+ status recognized)').trim(),
    // 25. Country-specific admission requirements
    countrySpecificRequirements: String(d.countrySpecificAdmissionRequirements || d.countrySpecificRequirements || 'APS certificate, German language proof or IELTS, Blocked account €11,904').trim(),

    // Display helpers
    ranking: String(d.ranking || d.qsRanking || '#Top German University').trim(),
    website: String(d.official_website || d.website || `https://www.google.com/search?q=${encodeURIComponent(uniName)}`).trim(),

    // Backwards compatibility aliases
    name: uniName,
    state,
    ncRequired: String(d.ncNumerusClausus || '').toLowerCase().startsWith('yes'),
    ncGrade: String(d.ncGradeCutOff || d.ncGradeCutoff || '').trim(),
    apsRequired: String(d.apsCertificateRequired || '').trim(),
    uniAssist: String(d.uniAssistApplication || '').trim(),
    hochschulstart: String(d.hochschulstartApplication || '').trim(),
    semesterFee: String(d.semesterContribution || '').trim(),
    germanRequired: String(d.germanLanguageRequirement || '').trim(),
    blockedAccount: String(d.blockedAccountProofOfFunds || '').trim(),
  };
}

/**
 * Fetches "Canadian Universities" from Wix Studio CMS (Collection: Import7)
 * Using the Wix Studio API Key and Site ID.
 */
export async function fetchCanadianUniversitiesFromWix(): Promise<CanadaUniversity[]> {
  const now = Date.now();
  if (canadaCache && now - canadaCache.timestamp < CACHE_TTL_MS && canadaCache.data.length > 0) {
    return canadaCache.data;
  }

  const wixApiKey = process.env.WIX_API_KEY;
  const wixSiteId = process.env.WIX_SITE_ID;

  if (!wixApiKey || !wixSiteId) {
    console.warn('Wix Studio credentials missing for Canadian Universities fetch.');
    return [];
  }

  // Collection identifiers for "Canadian Universities" in Wix Studio CMS
  const collections = ['Import7', 'Canadian Universities', 'canadian-universities'];
  const rawItems = await fetchAllItemsFromWixCollection(collections, wixApiKey, wixSiteId);

  if (rawItems.length === 0) {
    console.warn('No items returned from Wix Studio CMS for Canadian Universities.');
    return [];
  }

  const mapped = rawItems.map((item) => mapWixToCanadaUniversity(item.data || item));
  canadaCache = { data: mapped, timestamp: now };
  return mapped;
}

/**
 * Fetches "Germany Universities" from Wix Studio CMS (Collection: Import8)
 * Using the Wix Studio API Key and Site ID.
 */
export async function fetchGermanyUniversitiesFromWix(): Promise<GermanyUniversity[]> {
  const now = Date.now();
  if (germanyCache && now - germanyCache.timestamp < CACHE_TTL_MS && germanyCache.data.length > 0) {
    return germanyCache.data;
  }

  const wixApiKey = process.env.WIX_API_KEY;
  const wixSiteId = process.env.WIX_SITE_ID;

  if (!wixApiKey || !wixSiteId) {
    console.warn('Wix Studio credentials missing for Germany Universities fetch.');
    return [];
  }

  // Collection identifiers for "Germany Universities" in Wix Studio CMS
  const collections = ['Import8', 'Germany Universities', 'germany-universities'];
  const rawItems = await fetchAllItemsFromWixCollection(collections, wixApiKey, wixSiteId);

  if (rawItems.length === 0) {
    console.warn('No items returned from Wix Studio CMS for Germany Universities.');
    return [];
  }

  const mapped = rawItems.map((item) => mapWixToGermanyUniversity(item.data || item));
  germanyCache = { data: mapped, timestamp: now };
  return mapped;
}
