import { NextResponse } from 'next/server';

export interface AdmittedStudentSummary {
  id: string;
  studentId: string;
  studentName: string;
  admittedCollege: string;
  collegeLocation: string;
  collegeType: string;
  admissionDecision: string;
  applicationType: string;
  classYear: number | string;
  intendedMajor: string;
  gpaUnweighted40: number | string;
  gpaWeighted: number | string;
  satScoreTotal: number | string;
  satMath: number | string;
  satEbrw: number | string;
  actScore: number | string;
  classRank: string;
  numberOfApCourses: number;
  numberOfIbCourses: number;
  numberOfExtracurriculars: number;
  numberOfAwards: number;
  numberOfEssays: number;
  stateCountry: string;
  schoolType: string;
  gender: string;
  ethnicity: string;
  firstGeneration: string;
  internationalStudent: string;
  lettersOfRecommendation: string;
  interview: string;
  extracurricularActivitiesPreview: string;
  awardsHonorsPreview: string;
}

// In-memory cache
let cachedStudents: any[] | null = null;
let lastStudentsFetch = 0;
const STUDENTS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let isFetchingStudents = false;

async function fetchAllStudentsFromWix(apiKey: string, siteId: string): Promise<any[]> {
  try {
    const headers = {
      'Authorization': apiKey,
      'wix-site-id': siteId,
      'Content-Type': 'application/json',
    };

    let allItems: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const queryPayload: any = {
        dataCollectionId: 'Import6',
        query: {
          paging: { limit: 1000 },
        },
      };

      if (cursor) {
        queryPayload.query.cursorPaging = { cursor, limit: 1000 };
        delete queryPayload.query.paging;
      }

      const res = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers,
        body: JSON.stringify(queryPayload),
      });

      if (!res.ok) break;

      const data = await res.json();
      const items = data.dataItems || [];
      allItems = allItems.concat(items);

      if (data.pagingMetadata?.hasNext && data.pagingMetadata?.cursors?.next) {
        cursor = data.pagingMetadata.cursors.next;
      } else {
        hasMore = false;
      }

      if (allItems.length >= 3000) break;
    }

    if (allItems.length > 0) {
      return allItems.map((item) => {
        const d = item.data || item;
        return {
          id: d._id || item.id,
          studentId: d.studentId || d._id || item.id,
          studentName: d.studentName || 'Anonymous Student',
          admittedCollege: d.admittedCollege || 'University',
          collegeLocation: d.collegeLocation || '',
          collegeType: d.collegeType || 'Higher Education',
          admissionDecision: d.admissionDecision || 'Accepted',
          applicationType: d.applicationType || 'Regular Decision',
          classYear: d.classYear || 2028,
          intendedMajor: d.intendedMajor || 'Undecided',
          gpaUnweighted40: d.gpaUnweighted40 ?? 'N/A',
          gpaWeighted: d.gpaWeighted ?? 'N/A',
          satScoreTotal: d.satScoreTotal ?? 'N/A',
          satMath: d.satMath ?? 'N/A',
          satEbrw: d.satEbrw ?? 'N/A',
          actScore: d.actScore ?? 'N/A',
          classRank: d.classRank || '',
          numberOfApCourses: Number(d.numberOfApCourses) || 0,
          numberOfIbCourses: Number(d.numberOfIbCourses) || 0,
          numberOfExtracurriculars: Number(d.numberOfExtracurriculars) || 0,
          numberOfAwards: Number(d.numberOfAwards) || 0,
          numberOfEssays: Number(d.numberOfEssays) || 0,
          stateCountry: d.stateCountry || '',
          schoolType: d.schoolType || '',
          gender: d.gender || '',
          ethnicity: d.ethnicity || '',
          firstGeneration: d.firstGeneration || 'No',
          internationalStudent: d.internationalStudent || 'No',
          lettersOfRecommendation: d.lettersOfRecommendation || '',
          interview: d.interview || '',
          extracurricularActivitiesPreview: (d.extracurricularActivities || '').slice(0, 180),
          awardsHonorsPreview: (d.awardsHonors || '').slice(0, 150),
          source: d.source || '',
          profileUrl: d.profileUrl || '',
        };
      });
    }
  } catch (err) {
    console.warn('Wix admitted students fetch notice:', err);
  }
  return [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const major = searchParams.get('major') || 'ALL';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    const now = Date.now();
    const isStale = now - lastStudentsFetch > STUDENTS_CACHE_TTL;

    if (!cachedStudents && wixApiKey && wixSiteId) {
      const fresh = await fetchAllStudentsFromWix(wixApiKey, wixSiteId);
      if (fresh.length > 0) {
        cachedStudents = fresh;
        lastStudentsFetch = now;
      }
    } else if (cachedStudents && isStale && !isFetchingStudents && wixApiKey && wixSiteId) {
      isFetchingStudents = true;
      fetchAllStudentsFromWix(wixApiKey, wixSiteId)
        .then((fresh) => {
          if (fresh.length > 0) {
            cachedStudents = fresh;
            lastStudentsFetch = Date.now();
          }
        })
        .finally(() => {
          isFetchingStudents = false;
        });
    }

    let results = cachedStudents || [];

    // Filter by search term
    if (search) {
      results = results.filter((s) =>
        (s.studentName && s.studentName.toLowerCase().includes(search)) ||
        (s.admittedCollege && s.admittedCollege.toLowerCase().includes(search)) ||
        (s.intendedMajor && s.intendedMajor.toLowerCase().includes(search)) ||
        (s.collegeLocation && s.collegeLocation.toLowerCase().includes(search)) ||
        (s.stateCountry && s.stateCountry.toLowerCase().includes(search)) ||
        (s.collegeType && s.collegeType.toLowerCase().includes(search)) ||
        (s.satScoreTotal && String(s.satScoreTotal).includes(search)) ||
        (s.actScore && String(s.actScore).includes(search))
      );
    }

    // Filter by major category
    if (major && major !== 'ALL') {
      const mLower = major.toLowerCase();
      results = results.filter((s) => {
        const sMajor = (s.intendedMajor || '').toLowerCase();
        if (mLower === 'computer science') {
          return sMajor.includes('computer') || sMajor.includes('software') || sMajor.includes('data') || sMajor.includes('ai') || sMajor.includes('cognitive');
        }
        if (mLower === 'business') {
          return sMajor.includes('business') || sMajor.includes('finance') || sMajor.includes('economics') || sMajor.includes('management') || sMajor.includes('marketing') || sMajor.includes('accounting');
        }
        if (mLower === 'engineering') {
          return sMajor.includes('engineering') || sMajor.includes('robotics') || sMajor.includes('mechanical') || sMajor.includes('biomedical');
        }
        if (mLower === 'science') {
          return sMajor.includes('science') || sMajor.includes('biology') || sMajor.includes('chemistry') || sMajor.includes('physics') || sMajor.includes('neuroscience') || sMajor.includes('environmental');
        }
        if (mLower === 'humanities') {
          return sMajor.includes('english') || sMajor.includes('literature') || sMajor.includes('history') || sMajor.includes('political') || sMajor.includes('philosophy') || sMajor.includes('communications');
        }
        return sMajor.includes(mLower);
      });
    }

    // Paginate
    const totalCount = results.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      students: paginated,
      totalCount,
      page,
      totalPages,
      limit,
    });
  } catch (error: any) {
    console.error('Error fetching admitted students:', error);
    return NextResponse.json({
      success: false,
      students: [],
      error: error.message || 'Failed to query admitted students',
    }, { status: 500 });
  }
}
