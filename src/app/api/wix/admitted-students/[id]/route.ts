import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Student ID is required' }, { status: 400 });
    }

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    let found: any = null;

    if (wixApiKey && wixSiteId) {
      try {
        const headers = {
          'Authorization': wixApiKey,
          'wix-site-id': wixSiteId,
          'Content-Type': 'application/json',
        };

        // Try direct query with filter by studentId or _id
        const directQueryRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataCollectionId: 'Import6',
            query: {
              filter: {
                $or: [
                  { studentId: { $eq: id } },
                  { _id: { $eq: id } },
                ],
              },
              paging: { limit: 1 },
            },
          }),
        });

        if (directQueryRes.ok) {
          const directData = await directQueryRes.json();
          if (directData.dataItems && directData.dataItems.length > 0) {
            found = directData.dataItems[0].data || directData.dataItems[0];
            found._id = directData.dataItems[0].id || found._id;
          }
        }

        // If not found yet (e.g. slug provided like "rohan-anderson"), query items and find match
        if (!found) {
          let cursor: string | null = null;
          let hasMore = true;

          while (hasMore && !found) {
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

            for (const item of items) {
              const d = item.data || item;
              const generatedSlug = (d.studentName || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');

              if (
                d.studentId === id ||
                d._id === id ||
                item.id === id ||
                generatedSlug === id.toLowerCase() ||
                (d.studentId && d.studentId.toLowerCase() === id.toLowerCase())
              ) {
                found = d;
                found._id = d._id || item.id;
                break;
              }
            }

            if (found) break;

            if (data.pagingMetadata?.hasNext && data.pagingMetadata?.cursors?.next) {
              cursor = data.pagingMetadata.cursors.next;
            } else {
              hasMore = false;
            }
          }
        }
      } catch (err) {
        console.warn('Wix query single student error:', err);
      }
    }

    if (!found) {
      return NextResponse.json({
        success: false,
        student: null,
        error: 'Student profile not found',
      }, { status: 404 });
    }

    // Sanitize and structure the full student profile
    const student = {
      id: found._id || found.id || id,
      studentId: found.studentId || id,
      studentName: found.studentName || 'Admitted Student',
      admittedCollege: found.admittedCollege || 'University',
      collegeLocation: found.collegeLocation || '',
      collegeType: found.collegeType || 'Higher Education',
      admissionDecision: found.admissionDecision || 'Accepted',
      applicationType: found.applicationType || 'Regular Decision',
      classYear: found.classYear || 2028,
      intendedMajor: found.intendedMajor || 'Undecided',

      // Academics
      gpaUnweighted40: found.gpaUnweighted40 ?? 'N/A',
      gpaWeighted: found.gpaWeighted ?? 'N/A',
      classRank: found.classRank || '',
      satScoreTotal: found.satScoreTotal ?? 'N/A',
      satMath: found.satMath ?? 'N/A',
      satEbrw: found.satEbrw ?? 'N/A',
      actScore: found.actScore ?? 'N/A',
      numberOfApCourses: Number(found.numberOfApCourses) || 0,
      apCoursesTaken: found.apCoursesTaken || '',
      apScores: found.apScores || '',
      numberOfIbCourses: Number(found.numberOfIbCourses) || 0,
      ibCoursesDiploma: found.ibCoursesDiploma || '',

      // Extracurriculars & Honors
      numberOfExtracurriculars: Number(found.numberOfExtracurriculars) || 0,
      extracurricularActivities: found.extracurricularActivities || '',
      numberOfAwards: Number(found.numberOfAwards) || 0,
      awardsHonors: found.awardsHonors || '',
      leadershipPositions: found.leadershipPositions || '',
      researchExperience: found.researchExperience || '',
      sportsAthletics: found.sportsAthletics || '',
      communityServiceVolunteering: found.communityServiceVolunteering || '',
      workExperience: found.workExperience || '',

      // Demographics & Background
      gender: found.gender || '',
      ethnicity: found.ethnicity || '',
      stateCountry: found.stateCountry || '',
      firstGeneration: found.firstGeneration || 'No',
      internationalStudent: found.internationalStudent || 'No',
      schoolType: found.schoolType || '',

      // Essays & Subjective Evaluation
      numberOfEssays: Number(found.numberOfEssays) || 0,
      personalStatementEssay: found.personalStatementEssay || '',
      supplementalEssays: found.supplementalEssays || '',
      lettersOfRecommendation: found.lettersOfRecommendation || '',
      interview: found.interview || '',

      // Sources & Metadata
      source: found.source || '',
      profileUrl: found.profileUrl || '',
      createdDate: found._createdDate ? (found._createdDate.$date || found._createdDate) : null,
      updatedDate: found._updatedDate ? (found._updatedDate.$date || found._updatedDate) : null,
    };

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error: any) {
    console.error('Error fetching student profile by ID:', error);
    return NextResponse.json({
      success: false,
      student: null,
      error: error.message || 'Failed to fetch student profile',
    }, { status: 500 });
  }
}
