import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json(
        { success: false, error: 'Wix credentials missing' },
        { status: 400 }
      );
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    const collectionId = 'user-details';

    // Query items from Wix Data REST API v2
    const queryPayload: any = {
      dataCollectionId: collectionId,
      query: {
        paging: { limit: 10 }
      }
    };

    if (userId) {
      queryPayload.query.filter = { userId: { "$eq": userId } };
    } else if (userEmail) {
      queryPayload.query.filter = { userEmail: { "$eq": userEmail } };
    }

    const queryRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers,
      body: JSON.stringify(queryPayload)
    });

    if (!queryRes.ok) {
      const errText = await queryRes.text();
      console.warn('Wix query failed:', queryRes.status, errText);
      return NextResponse.json({ success: false, data: null });
    }

    const result = await queryRes.json();
    const items = result.dataItems || result.items || [];

    if (items.length > 0) {
      const latestItem = items[items.length - 1];
      const data = latestItem.data || latestItem;
      
      // Parse extracurriculars if stored as JSON string
      if (typeof data.extracurriculars === 'string') {
        try {
          data.extracurriculars = JSON.parse(data.extracurriculars);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }

      return NextResponse.json({
        success: true,
        dataItem: latestItem,
        data: data
      });
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    console.error('Error fetching user details from Wix CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json(
        { success: false, error: 'Wix credentials not configured in .env.local' },
        { status: 400 }
      );
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    const collectionId = 'user-details';

    // 1. Ensure collection exists with complete updated schema (including extracurriculars)
    try {
      const getCollectionRes = await fetch(
        `https://www.wixapis.com/wix-data/v2/collections/${collectionId}`,
        { method: 'GET', headers }
      );

      if (getCollectionRes.status === 404) {
        await fetch('https://www.wixapis.com/wix-data/v2/collections', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            dataCollection: {
              id: collectionId,
              displayName: 'User Details',
              fields: [
                { key: 'userId', type: 'TEXT', displayName: 'User ID' },
                { key: 'userEmail', type: 'TEXT', displayName: 'User Email' },
                { key: 'userRole', type: 'TEXT', displayName: 'Role' },
                { key: 'applicationCycle', type: 'TEXT', displayName: 'Application Cycle' },
                { key: 'targetMajor', type: 'TEXT', displayName: 'Target Major' },
                { key: 'dreamSchool', type: 'TEXT', displayName: 'Dream School' },
                { key: 'gpa', type: 'TEXT', displayName: 'GPA' },
                { key: 'country', type: 'TEXT', displayName: 'Country' },
                { key: 'financialAid', type: 'BOOLEAN', displayName: 'Financial Aid Required' },
                { key: 'fullName', type: 'TEXT', displayName: 'Full Name' },
                { key: 'phone', type: 'TEXT', displayName: 'Phone' },
                { key: 'satScore', type: 'TEXT', displayName: 'SAT Score' },
                { key: 'actScore', type: 'TEXT', displayName: 'ACT Score' },
                { key: 'classRank', type: 'TEXT', displayName: 'Class Rank' },
                { key: 'highSchool', type: 'TEXT', displayName: 'High School' },
                { key: 'extracurriculars', type: 'TEXT', displayName: 'Extracurricular Activities JSON' }
              ]
            }
          })
        });
      }
    } catch (e) {
      console.error('Wix collection check notice:', e);
    }

    // Prepare extracurriculars JSON representation if passed as array
    let extracurricularsStr = '';
    if (body.extracurriculars) {
      if (typeof body.extracurriculars === 'string') {
        extracurricularsStr = body.extracurriculars;
      } else {
        extracurricularsStr = JSON.stringify(body.extracurriculars);
      }
    }

    // 2. Prepare payload for Wix Data REST API v2 dataItem
    const itemPayload = {
      userId: body.userId || 'guest-user',
      userEmail: body.userEmail || body.email || '',
      userRole: body.userRole || 'applicant',
      applicationCycle: body.applicationCycle || 'Fall 2026',
      targetMajor: body.targetMajor || body.intendedMajor || 'Computer Science',
      dreamSchool: body.dreamSchool || 'UPenn',
      gpa: body.gpa || '3.9',
      country: body.country || 'Unspecified',
      financialAid: Boolean(body.financialAid),
      fullName: body.fullName || body.name || '',
      phone: body.phone || body.mobile || '',
      satScore: body.satScore || body.sat || '',
      actScore: body.actScore || body.act || '',
      classRank: body.classRank || '',
      highSchool: body.highSchool || '',
      extracurriculars: extracurricularsStr,
      updatedAt: new Date().toISOString()
    };

    const itemData = {
      dataCollectionId: collectionId,
      dataItem: {
        data: itemPayload
      }
    };

    const insertRes = await fetch('https://www.wixapis.com/wix-data/v2/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(itemData)
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.warn('Wix item insertion status & error:', insertRes.status, errText);
      return NextResponse.json(
        { success: false, error: errText },
        { status: insertRes.status }
      );
    }

    const insertedResult = await insertRes.json();

    return NextResponse.json({
      success: true,
      message: 'User profile & application data successfully saved to Wix CMS',
      data: insertedResult
    });
  } catch (error: any) {
    console.error('Error saving user data to Wix CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
