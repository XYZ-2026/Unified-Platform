import { NextResponse } from 'next/server';

// ── Flag to enable real Wix CMS persistence. Kept false during testing per user request. ──
// When ready to live-insert into Wix CMS Import6, change LIVE_MODE to true.
const LIVE_MODE: boolean = false;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Construct the data payload mapping to actual Import6 CMS fields
    const dataPayload: Record<string, any> = {};

    // Student Identity
    if (body.studentId !== undefined) dataPayload.studentId = String(body.studentId).trim();
    if (body.studentName !== undefined) dataPayload.studentName = String(body.studentName).trim();

    // College & Admission Info
    if (body.admittedCollege !== undefined) dataPayload.admittedCollege = String(body.admittedCollege).trim();
    if (body.collegeLocation !== undefined) dataPayload.collegeLocation = String(body.collegeLocation).trim();
    if (body.collegeType !== undefined) dataPayload.collegeType = String(body.collegeType).trim();
    if (body.admissionDecision !== undefined) dataPayload.admissionDecision = String(body.admissionDecision).trim();
    if (body.applicationType !== undefined) dataPayload.applicationType = String(body.applicationType).trim();
    if (body.classYear !== undefined) dataPayload.classYear = body.classYear;
    if (body.intendedMajor !== undefined) dataPayload.intendedMajor = String(body.intendedMajor).trim();

    // Academics
    if (body.gpaUnweighted40 !== undefined) dataPayload.gpaUnweighted40 = body.gpaUnweighted40;
    if (body.gpaWeighted !== undefined) dataPayload.gpaWeighted = body.gpaWeighted;
    if (body.classRank !== undefined) dataPayload.classRank = String(body.classRank).trim();
    if (body.satScoreTotal !== undefined) dataPayload.satScoreTotal = body.satScoreTotal;
    if (body.satMath !== undefined) dataPayload.satMath = body.satMath;
    if (body.satEbrw !== undefined) dataPayload.satEbrw = body.satEbrw;
    if (body.actScore !== undefined) dataPayload.actScore = body.actScore;
    if (body.numberOfApCourses !== undefined) dataPayload.numberOfApCourses = Number(body.numberOfApCourses) || 0;
    if (body.apCoursesTaken !== undefined) dataPayload.apCoursesTaken = String(body.apCoursesTaken).trim();
    if (body.apScores !== undefined) dataPayload.apScores = String(body.apScores).trim();
    if (body.numberOfIbCourses !== undefined) dataPayload.numberOfIbCourses = Number(body.numberOfIbCourses) || 0;
    if (body.ibCoursesDiploma !== undefined) dataPayload.ibCoursesDiploma = String(body.ibCoursesDiploma).trim();

    // Extracurriculars & Honors
    if (body.numberOfExtracurriculars !== undefined) dataPayload.numberOfExtracurriculars = Number(body.numberOfExtracurriculars) || 0;
    if (body.extracurricularActivities !== undefined) dataPayload.extracurricularActivities = String(body.extracurricularActivities).trim();
    if (body.numberOfAwards !== undefined) dataPayload.numberOfAwards = Number(body.numberOfAwards) || 0;
    if (body.awardsHonors !== undefined) dataPayload.awardsHonors = String(body.awardsHonors).trim();
    if (body.leadershipPositions !== undefined) dataPayload.leadershipPositions = String(body.leadershipPositions).trim();
    if (body.researchExperience !== undefined) dataPayload.researchExperience = String(body.researchExperience).trim();
    if (body.sportsAthletics !== undefined) dataPayload.sportsAthletics = String(body.sportsAthletics).trim();
    if (body.communityServiceVolunteering !== undefined) dataPayload.communityServiceVolunteering = String(body.communityServiceVolunteering).trim();
    if (body.workExperience !== undefined) dataPayload.workExperience = String(body.workExperience).trim();

    // Demographics & Background
    if (body.gender !== undefined) dataPayload.gender = String(body.gender).trim();
    if (body.ethnicity !== undefined) dataPayload.ethnicity = String(body.ethnicity).trim();
    if (body.stateCountry !== undefined) dataPayload.stateCountry = String(body.stateCountry).trim();
    if (body.firstGeneration !== undefined) dataPayload.firstGeneration = String(body.firstGeneration).trim();
    if (body.internationalStudent !== undefined) dataPayload.internationalStudent = String(body.internationalStudent).trim();
    if (body.schoolType !== undefined) dataPayload.schoolType = String(body.schoolType).trim();

    // Essays & Subjective
    if (body.numberOfEssays !== undefined) dataPayload.numberOfEssays = Number(body.numberOfEssays) || 0;
    if (body.personalStatementEssay !== undefined) dataPayload.personalStatementEssay = String(body.personalStatementEssay).trim();
    if (body.supplementalEssays !== undefined) dataPayload.supplementalEssays = String(body.supplementalEssays).trim();
    if (body.lettersOfRecommendation !== undefined) dataPayload.lettersOfRecommendation = String(body.lettersOfRecommendation).trim();
    if (body.interview !== undefined) dataPayload.interview = String(body.interview).trim();

    // Source & Metadata
    if (body.source !== undefined) dataPayload.source = String(body.source).trim();
    if (body.profileUrl !== undefined) dataPayload.profileUrl = String(body.profileUrl).trim();

    // Validate that at minimum studentName and admittedCollege are provided
    if (!dataPayload.studentName) {
      return NextResponse.json(
        { success: false, error: 'Student name is required' },
        { status: 400 }
      );
    }
    if (!dataPayload.admittedCollege) {
      return NextResponse.json(
        { success: false, error: 'Admitted college is required' },
        { status: 400 }
      );
    }

    // ── DRY-RUN / TESTING CHECK ──
    // If live mode is disabled, validate the data and return mock success without calling Wix
    if (!LIVE_MODE) {
      console.log('[Import6 DRY-RUN] Profile validated successfully (not saved to Wix CMS):', JSON.stringify(dataPayload, null, 2));
      return NextResponse.json({
        success: true,
        message: '[Testing Mode] Profile validated successfully. Wix API call skipped.',
        dataItem: { id: 'test-admit-' + Date.now(), data: dataPayload },
      });
    }

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json(
        { success: false, error: 'Wix credentials not configured' },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    const collectionId = 'Import6';

    // Check for duplicate submission by studentName + admittedCollege + classYear
    try {
      const checkPayload: any = {
        dataCollectionId: collectionId,
        query: {
          filter: {
            $and: [
              { studentName: { $eq: dataPayload.studentName } },
              { admittedCollege: { $eq: dataPayload.admittedCollege } },
            ],
          },
          paging: { limit: 5 },
        },
      };

      const checkRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers,
        body: JSON.stringify(checkPayload),
      });

      if (checkRes.ok) {
        const checkData = await checkRes.json();
        const existingItems = checkData.dataItems || [];
        
        // Check for exact duplicate match
        const duplicate = existingItems.find((item: any) => {
          const d = item.data || item;
          return (
            (d.studentName || '').toLowerCase().trim() === dataPayload.studentName.toLowerCase().trim() &&
            (d.admittedCollege || '').toLowerCase().trim() === dataPayload.admittedCollege.toLowerCase().trim() &&
            (dataPayload.classYear ? String(d.classYear) === String(dataPayload.classYear) : true)
          );
        });

        if (duplicate) {
          return NextResponse.json(
            { success: false, error: 'A profile with this student name and college already exists. Please update the existing entry or use a different name.' },
            { status: 409 }
          );
        }
      }
    } catch (dupCheckErr) {
      console.warn('Duplicate check notice:', dupCheckErr);
      // Continue with insertion even if duplicate check fails
    }

    // Insert new item into Import6
    const insertRes = await fetch('https://www.wixapis.com/wix-data/v2/items', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dataCollectionId: collectionId,
        dataItem: {
          data: dataPayload,
        },
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error('Wix Import6 insertion error:', insertRes.status, errText);
      return NextResponse.json(
        { success: false, error: 'Failed to save admitted student profile. Please try again.' },
        { status: insertRes.status }
      );
    }

    const insertResult = await insertRes.json();

    return NextResponse.json({
      success: true,
      message: 'Admitted student profile successfully submitted to Abroad Simplified',
      dataItem: insertResult,
    });
  } catch (error: any) {
    console.error('Error submitting to Import6:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
