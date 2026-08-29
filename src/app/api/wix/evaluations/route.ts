import { NextResponse } from 'next/server';

/* ═══════════════════════════════════════════════════════════════════════
   Wix CMS — Candidate Evaluations & Re-evaluation Store
   Collection: 'evaluations'
   - Stores each candidate's past admissions evaluation per university
   - Upserts (updates existing row instead of creating duplicates on re-eval)
   ═══════════════════════════════════════════════════════════════════════ */

const COLLECTION_ID = 'evaluations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    const universityName = searchParams.get('universityName');

    if ((!userId || userId === 'guest-user') && (!userEmail || !userEmail.trim())) {
      return NextResponse.json({ success: true, data: [] });
    }

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json({ success: true, data: [] });
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    const targetEmail = (userEmail || '').toLowerCase().trim();
    const queryPayload: any = {
      dataCollectionId: COLLECTION_ID,
      query: {
        paging: { limit: 100 },
        sort: [{ fieldName: '_updatedDate', order: 'DESC' }]
      }
    };

    if (userId && userId !== 'guest-user') {
      queryPayload.query.filter = { userId: { "$eq": userId } };
    } else if (targetEmail) {
      queryPayload.query.filter = { userEmail: { "$eq": targetEmail } };
    }

    const queryRes = await fetch('https://www.wixapis.com/wix-data/v2/items/query', {
      method: 'POST',
      headers,
      body: JSON.stringify(queryPayload)
    });

    if (!queryRes.ok) {
      const errText = await queryRes.text();
      console.warn('Wix evaluations query status:', queryRes.status, errText);
      return NextResponse.json({ success: true, data: [] });
    }

    const result = await queryRes.json();
    const items = result.dataItems || result.items || [];

    // Filter to this candidate
    const userItems = items.filter((item: any) => {
      const d = item.data || item;
      const itemUid = (d.userId || item.userId || '').trim();
      const itemEmail = (d.userEmail || item.userEmail || d.email || item.email || '').toLowerCase().trim();

      if (userId && userId !== 'guest-user' && itemUid && itemUid === userId) return true;
      if (targetEmail && itemEmail && itemEmail === targetEmail) return true;
      return false;
    });

    // Format and parse evaluations
    const parsedEvaluations = userItems.map((item: any) => {
      const d = item.data || item;
      let fullResult: any = null;

      if (d.resultJson) {
        try {
          fullResult = typeof d.resultJson === 'string' ? JSON.parse(d.resultJson) : d.resultJson;
        } catch (e) {
          fullResult = null;
        }
      }

      return {
        id: item.id || item._id,
        userId: d.userId || userId,
        userEmail: d.userEmail || targetEmail,
        universityName: d.universityName || d.targetSchool || '',
        school: d.universityName || d.targetSchool || '',
        major: d.major || d.targetMajor || 'General',
        odds: d.odds || `${d.admitChance || 50}%`,
        admitChance: Number(d.admitChance) || 50,
        tier: d.admitTier || d.tier || 'Target',
        admitTier: d.admitTier || d.tier || 'Target',
        spiceLevel: d.spiceLevel || 'candid',
        verdictHeadline: d.verdictHeadline || '',
        verdict: d.verdict || '',
        recommendation: d.recommendation || '',
        fullResult: fullResult,
        date: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently',
        updatedAt: d.updatedAt || item._updatedDate || item._createdDate || new Date().toISOString()
      };
    });

    // If specific university requested
    if (universityName) {
      const normalizedUni = universityName.trim().toLowerCase();
      const matched = parsedEvaluations.find((ev: any) =>
        ev.universityName.trim().toLowerCase() === normalizedUni
      );
      return NextResponse.json({ success: true, data: matched || null });
    }

    // Sort descending by updated timestamp
    parsedEvaluations.sort((a: any, b: any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return NextResponse.json({
      success: true,
      data: parsedEvaluations,
      totalCount: parsedEvaluations.length
    });

  } catch (error: any) {
    console.error('Error fetching candidate evaluations from Wix CMS:', error);
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

    // 1. Ensure collection exists with complete schema
    try {
      const getCollectionRes = await fetch(
        `https://www.wixapis.com/wix-data/v2/collections/${COLLECTION_ID}`,
        { method: 'GET', headers }
      );

      if (getCollectionRes.status === 404) {
        await fetch('https://www.wixapis.com/wix-data/v2/collections', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            collection: {
              id: COLLECTION_ID,
              displayName: 'Candidate Evaluations',
              fields: [
                { key: 'userId', type: 'TEXT', displayName: 'User ID' },
                { key: 'userEmail', type: 'TEXT', displayName: 'User Email' },
                { key: 'universityName', type: 'TEXT', displayName: 'University Name' },
                { key: 'major', type: 'TEXT', displayName: 'Major' },
                { key: 'admitChance', type: 'NUMBER', displayName: 'Admit Chance (%)' },
                { key: 'admitTier', type: 'TEXT', displayName: 'Admit Tier' },
                { key: 'spiceLevel', type: 'TEXT', displayName: 'Spice Persona' },
                { key: 'verdictHeadline', type: 'TEXT', displayName: 'Verdict Headline' },
                { key: 'verdict', type: 'TEXT', displayName: 'Full Verdict' },
                { key: 'recommendation', type: 'TEXT', displayName: 'Recommendation' },
                { key: 'resultJson', type: 'TEXT', displayName: 'Full Result JSON' },
                { key: 'evaluatedAt', type: 'TEXT', displayName: 'Evaluated At' },
                { key: 'updatedAt', type: 'TEXT', displayName: 'Last Updated' }
              ]
            }
          })
        });
      }
    } catch (e) {
      console.warn('Wix collection setup notice:', e);
    }

    const userId = body.userId || 'guest-user';
    const userEmail = (body.userEmail || body.email || '').toLowerCase().trim();
    const universityName = (body.universityName || body.targetSchool || '').trim();

    if (!universityName) {
      return NextResponse.json(
        { success: false, error: 'University name is required' },
        { status: 400 }
      );
    }

    // 2. Query for existing row for THIS user AND THIS university to update the same row
    let existingItem: any = null;
    let existingId: string | null = null;
    let duplicateIdsToDelete: string[] = [];

    try {
      const queryPayload: any = {
        dataCollectionId: COLLECTION_ID,
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
        const normTargetUni = universityName.toLowerCase().trim();

        const matched = foundItems.filter((item: any) => {
          const d = item.data || item;
          const itemUid = (d.userId || item.userId || '').trim();
          const itemEmail = (d.userEmail || item.userEmail || d.email || item.email || '').toLowerCase().trim();
          const itemUni = (d.universityName || d.targetSchool || '').toLowerCase().trim();

          const userMatch = (userId && userId !== 'guest-user' && itemUid === userId) || (userEmail && itemEmail === userEmail);
          const uniMatch = itemUni === normTargetUni;

          return userMatch && uniMatch;
        });

        if (matched.length > 0) {
          existingItem = matched[0];
          existingId = existingItem.id || existingItem._id;
          if (matched.length > 1) {
            duplicateIdsToDelete = matched.slice(1).map((m: any) => m.id || m._id).filter(Boolean);
          }
        }
      }
    } catch (err) {
      console.warn('Could not check existing evaluation row before save:', err);
    }

    // 3. Prepare payload
    const resultJsonStr = typeof body.resultData === 'string'
      ? body.resultData
      : JSON.stringify(body.resultData || {});

    const now = new Date().toISOString();
    const evaluationPayload = {
      userId,
      userEmail,
      universityName,
      major: body.major || body.targetMajor || 'General',
      admitChance: Number(body.admitChance) || 50,
      admitTier: body.admitTier || body.tier || 'Target',
      spiceLevel: body.spiceLevel || 'candid',
      verdictHeadline: body.verdictHeadline || '',
      verdict: body.verdict || '',
      recommendation: body.recommendation || '',
      resultJson: resultJsonStr,
      evaluatedAt: body.evaluatedAt || now,
      updatedAt: now
    };

    let saveResult: any = null;

    // 4. Update the SAME row if it exists, or insert new row
    if (existingId) {
      console.log(`[Wix Evaluations] Updating existing evaluation row ${existingId} for university "${universityName}"`);
      const updateRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${existingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          dataCollectionId: COLLECTION_ID,
          dataItem: {
            id: existingId,
            data: evaluationPayload
          }
        })
      });

      if (updateRes.ok) {
        saveResult = await updateRes.json();
      } else {
        console.warn('Wix PUT evaluation update returned status:', updateRes.status);
      }
    }

    if (!saveResult) {
      console.log(`[Wix Evaluations] Inserting new evaluation row for university "${universityName}"`);
      const insertRes = await fetch('https://www.wixapis.com/wix-data/v2/items', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dataCollectionId: COLLECTION_ID,
          dataItem: {
            data: evaluationPayload
          }
        })
      });

      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.warn('Wix evaluation insertion failed:', insertRes.status, errText);
        return NextResponse.json(
          { success: false, error: errText },
          { status: insertRes.status }
        );
      }

      saveResult = await insertRes.json();
    }

    // Clean up duplicate rows if any
    if (duplicateIdsToDelete.length > 0) {
      for (const dupId of duplicateIdsToDelete) {
        try {
          await fetch(`https://www.wixapis.com/wix-data/v2/items/${dupId}`, {
            method: 'DELETE',
            headers,
            body: JSON.stringify({ dataCollectionId: COLLECTION_ID })
          });
        } catch (e) {
          // non-blocking
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: existingId ? 'Evaluation updated successfully in Wix CMS' : 'Evaluation saved to Wix CMS',
      isUpdated: !!existingId,
      data: evaluationPayload,
      dataItem: saveResult
    });

  } catch (error: any) {
    console.error('Error saving candidate evaluation to Wix CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
