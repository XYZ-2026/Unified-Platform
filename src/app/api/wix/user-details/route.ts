import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    // If no user identification is provided, return null to avoid leaking unrelated data
    if ((!userId || userId === 'guest-user') && (!userEmail || !userEmail.trim())) {
      return NextResponse.json({ success: true, data: null });
    }

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
        paging: { limit: 50 },
        sort: [{ fieldName: '_updatedDate', order: 'DESC' }]
      }
    };

    if (userId && userId !== 'guest-user') {
      queryPayload.query.filter = { userId: { "$eq": userId } };
    } else if (userEmail) {
      queryPayload.query.filter = { userEmail: { "$eq": userEmail.trim().toLowerCase() } };
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
    const targetEmail = (userEmail || '').toLowerCase().trim();

    // Strict in-memory filter to ensure we ONLY match this specific user
    const userItems = items.filter((item: any) => {
      const d = item.data || item;
      const itemUid = (d.userId || item.userId || '').trim();
      const itemEmail = (d.userEmail || item.userEmail || d.email || item.email || '').toLowerCase().trim();

      if (userId && userId !== 'guest-user' && itemUid && itemUid === userId) return true;
      if (targetEmail && itemEmail && itemEmail === targetEmail) return true;
      return false;
    });

    if (userItems.length > 0) {
      // Sort in-memory descending by updatedAt / _updatedDate / _createdDate to guarantee the absolute newest entry is chosen
      userItems.sort((a: any, b: any) => {
        const dataA = a.data || a;
        const dataB = b.data || b;
        const timeA = new Date(dataA.updatedAt || a._updatedDate || a._createdDate || 0).getTime();
        const timeB = new Date(dataB.updatedAt || b._updatedDate || b._createdDate || 0).getTime();
        return timeB - timeA;
      });

      const latestItem = userItems[0];
      const data = latestItem.data || latestItem;
      
      // Parse extracurriculars if stored as JSON string
      if (typeof data.extracurriculars === 'string' && data.extracurriculars.trim()) {
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

    // 1. Ensure collection exists with complete schema
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
                { key: 'gpa', type: 'TEXT', displayName: 'Unweighted GPA' },
                { key: 'gpaWeighted', type: 'TEXT', displayName: 'Weighted GPA' },
                { key: 'country', type: 'TEXT', displayName: 'Country' },
                { key: 'financialAid', type: 'BOOLEAN', displayName: 'Financial Aid Required' },
                { key: 'fullName', type: 'TEXT', displayName: 'Full Name' },
                { key: 'phone', type: 'TEXT', displayName: 'Phone' },
                { key: 'satScore', type: 'TEXT', displayName: 'SAT Score' },
                { key: 'actScore', type: 'TEXT', displayName: 'ACT Score' },
                { key: 'classRank', type: 'TEXT', displayName: 'Class Rank' },
                { key: 'highSchool', type: 'TEXT', displayName: 'High School' },
                { key: 'extracurriculars', type: 'TEXT', displayName: 'Extracurricular Activities JSON' },
                { key: 'updatedAt', type: 'TEXT', displayName: 'Last Updated' }
              ]
            }
          })
        });
      }
    } catch (e) {
      console.error('Wix collection check notice:', e);
    }

    const userId = body.userId || 'guest-user';
    const userEmail = (body.userEmail || body.email || '').toLowerCase().trim();

    // 2. Query for existing records for THIS user specifically
    let existingItem: any = null;
    let existingId: string | null = null;
    let existingData: any = {};
    let duplicateIdsToDelete: string[] = [];

    try {
      const queryPayload: any = {
        dataCollectionId: collectionId,
        query: {
          paging: { limit: 50 },
          sort: [{ fieldName: '_updatedDate', order: 'DESC' }]
        }
      };

      if (userId && userId !== 'guest-user') {
        queryPayload.query.filter = { userId: { "$eq": userId } };
      } else if (userEmail) {
        queryPayload.query.filter = { userEmail: { "$eq": userEmail } };
      }

      const checkRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
        method: 'POST',
        headers,
        body: JSON.stringify(queryPayload)
      });

      if (checkRes.ok) {
        const checkJson = await checkRes.json();
        const foundItems = checkJson.dataItems || checkJson.items || [];
        
        // Strict matching in memory
        const matched = foundItems.filter((item: any) => {
          const d = item.data || item;
          const itemUid = (d.userId || item.userId || '').trim();
          const itemEmail = (d.userEmail || item.userEmail || d.email || item.email || '').toLowerCase().trim();

          if (userId && userId !== 'guest-user' && itemUid && itemUid === userId) return true;
          if (userEmail && itemEmail && itemEmail === userEmail) return true;
          return false;
        });

        if (matched.length > 0) {
          // Sort matched items descending so newest is first
          matched.sort((a: any, b: any) => {
            const dataA = a.data || a;
            const dataB = b.data || b;
            const timeA = new Date(dataA.updatedAt || a._updatedDate || a._createdDate || 0).getTime();
            const timeB = new Date(dataB.updatedAt || b._updatedDate || b._createdDate || 0).getTime();
            return timeB - timeA;
          });

          existingItem = matched[0];
          existingId = existingItem.id || existingItem._id;
          existingData = existingItem.data || existingItem;

          // Track any duplicate older items to clean up
          if (matched.length > 1) {
            duplicateIdsToDelete = matched.slice(1).map((m: any) => m.id || m._id).filter(Boolean);
          }
        }
      }
    } catch (err) {
      console.warn('Could not query existing Wix user item before save:', err);
    }

    // 3. Format and merge extracurriculars
    let extracurricularsStr = existingData.extracurriculars || '';
    if (body.extracurriculars !== undefined) {
      if (typeof body.extracurriculars === 'string') {
        extracurricularsStr = body.extracurriculars;
      } else {
        extracurricularsStr = JSON.stringify(body.extracurriculars);
      }
    }

    // 4. Construct merged payload: incoming values overwrite existing values
    const mergedPayload = {
      userId: body.userId !== undefined ? body.userId : (existingData.userId || 'guest-user'),
      userEmail: userEmail || existingData.userEmail || '',
      userRole: body.userRole !== undefined ? body.userRole : (existingData.userRole || 'applicant'),
      applicationCycle: body.applicationCycle !== undefined ? body.applicationCycle : (existingData.applicationCycle || 'Fall 2026'),
      targetMajor: body.targetMajor !== undefined ? body.targetMajor : (body.intendedMajor !== undefined ? body.intendedMajor : (existingData.targetMajor || '')),
      dreamSchool: body.dreamSchool !== undefined ? body.dreamSchool : (existingData.dreamSchool || ''),
      gpa: body.gpa !== undefined ? body.gpa : (existingData.gpa || ''),
      gpaWeighted: body.gpaWeighted !== undefined ? body.gpaWeighted : (existingData.gpaWeighted || ''),
      country: body.country !== undefined ? body.country : (existingData.country || ''),
      financialAid: body.financialAid !== undefined ? Boolean(body.financialAid) : Boolean(existingData.financialAid),
      fullName: body.fullName !== undefined ? body.fullName : (body.name !== undefined ? body.name : (existingData.fullName || '')),
      phone: body.phone !== undefined ? body.phone : (body.mobile !== undefined ? body.mobile : (existingData.phone || '')),
      satScore: body.satScore !== undefined ? body.satScore : (body.sat !== undefined ? body.sat : (existingData.satScore || '')),
      actScore: body.actScore !== undefined ? body.actScore : (body.act !== undefined ? body.act : (existingData.actScore || '')),
      classRank: body.classRank !== undefined ? body.classRank : (existingData.classRank || ''),
      highSchool: body.highSchool !== undefined ? body.highSchool : (existingData.highSchool || ''),
      extracurriculars: extracurricularsStr,
      updatedAt: new Date().toISOString()
    };

    let saveResult: any = null;

    // 5. Update existing item if ID exists, or Insert new item
    if (existingId) {
      const updateRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${existingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          dataCollectionId: collectionId,
          dataItem: {
            id: existingId,
            data: mergedPayload
          }
        })
      });

      if (updateRes.ok) {
        saveResult = await updateRes.json();
      } else {
        console.warn('Wix PUT update returned:', updateRes.status, '- attempting insertion');
      }
    }

    if (!saveResult) {
      const insertRes = await fetch('https://www.wixapis.com/wix-data/v2/items', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dataCollectionId: collectionId,
          dataItem: {
            data: mergedPayload
          }
        })
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.warn('Wix item insertion status & error:', insertRes.status, errText);
        return NextResponse.json(
          { success: false, error: errText },
          { status: insertRes.status }
        );
      }

      saveResult = await insertRes.json();
    }

    // Clean up duplicate older records in background if any exist
    if (duplicateIdsToDelete.length > 0) {
      for (const dupId of duplicateIdsToDelete) {
        try {
          await fetch(`https://www.wixapis.com/wix-data/v2/items/${dupId}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ dataCollectionId: collectionId })
          });
        } catch (e) {
          // Non-blocking cleanup
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User profile & application data successfully saved and synchronized to Wix CMS',
      data: mergedPayload,
      dataItem: saveResult
    });
  } catch (error: any) {
    console.error('Error saving user data to Wix CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
