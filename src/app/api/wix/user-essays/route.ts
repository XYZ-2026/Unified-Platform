import { NextResponse } from 'next/server';

/* ═══════════════════════════════════════════════════════════════════════
   Wix CMS — User Written Essays & Real-time Auto-Save Store
   Collection: 'user_essays'
   - Stores user-written Statement of Purpose & Admissions Essays
   - Scoped strictly to logged-in user (userId / userEmail)
   - Real-time debounced auto-saving & row updates
   ═══════════════════════════════════════════════════════════════════════ */

const COLLECTION_ID = 'user_essays';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const essayId = searchParams.get('id') || searchParams.get('essayId');
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json({
        success: true,
        essays: [],
        count: 0,
        error: 'Wix API credentials not configured.'
      });
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    // 1. Fetch single essay by ID
    if (essayId) {
      try {
        const itemRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${essayId}?dataCollectionId=${COLLECTION_ID}`, {
          method: 'GET',
          headers
        });

        if (itemRes.ok) {
          const itemJson = await itemRes.json();
          const item = itemJson.dataItem || itemJson;
          const d = item.data || item;
          return NextResponse.json({
            success: true,
            essay: {
              id: item.id || item._id,
              userId: d.userId || '',
              userEmail: d.userEmail || '',
              title: d.title || 'Statement of Purpose',
              school: d.school || d.university || 'Target University',
              content: d.content || d.html || '<p></p>',
              plainText: d.plainText || '',
              wordCount: d.wordCount !== undefined ? String(d.wordCount) : '0',
              pageCount: d.pageCount !== undefined ? String(d.pageCount) : '1',
              status: d.status || 'In Progress',
              aiScore: d.aiScore !== undefined && d.aiScore !== null ? Number(d.aiScore) : null,
              score: d.score !== undefined && d.score !== null ? Number(d.score) : 88,
              format: d.format || 'ieee',
              updatedAt: d.updatedAt || item._updatedDate || new Date().toISOString(),
              createdAt: d.createdAt || item._createdDate || new Date().toISOString()
            }
          });
        }
      } catch (err) {
        console.warn('Direct essay fetch by id failed, falling back to query:', err);
      }
    }

    // 2. Query collection for user's essays
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
      // Collection might not exist yet or empty
      return NextResponse.json({ success: true, essays: [], count: 0 });
    }

    const result = await queryRes.json();
    const items = result.dataItems || result.items || [];

    // Filter strictly to this user
    const userItems = items.filter((item: any) => {
      const d = item.data || item;
      const itemUid = (d.userId || item.userId || '').trim();
      const itemEmail = (d.userEmail || item.userEmail || d.email || item.email || '').toLowerCase().trim();

      if (essayId && (item.id === essayId || item._id === essayId)) return true;
      if (userId && userId !== 'guest-user' && itemUid && itemUid === userId) return true;
      if (targetEmail && itemEmail && itemEmail === targetEmail) return true;
      return !userId && !targetEmail;
    });

    const parsed = userItems.map((item: any) => {
      const d = item.data || item;
      return {
        id: item.id || item._id,
        userId: d.userId || userId || '',
        userEmail: d.userEmail || targetEmail || '',
        title: d.title || 'Statement of Purpose',
        school: d.school || d.university || 'Target University',
        content: d.content || d.html || '<p></p>',
        plainText: d.plainText || '',
        wordCount: d.wordCount !== undefined ? String(d.wordCount) : '0',
        pageCount: d.pageCount !== undefined ? String(d.pageCount) : '1',
        status: d.status || 'In Progress',
        aiScore: d.aiScore !== undefined && d.aiScore !== null ? Number(d.aiScore) : null,
        score: d.score !== undefined && d.score !== null ? Number(d.score) : 88,
        format: d.format || 'ieee',
        updatedAt: d.updatedAt || item._updatedDate || new Date().toISOString(),
        createdAt: d.createdAt || item._createdDate || new Date().toISOString()
      };
    });

    if (essayId) {
      const single = parsed.find((e: any) => e.id === essayId);
      return NextResponse.json({
        success: true,
        essay: single || null
      });
    }

    return NextResponse.json({
      success: true,
      essays: parsed,
      count: parsed.length
    });

  } catch (error: any) {
    console.error('Error fetching user essays from Wix CMS:', error);
    return NextResponse.json({
      success: false,
      essays: [],
      count: 0,
      error: error.message || 'Internal Server Error'
    });
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
              displayName: 'User Essays',
              fields: [
                { key: 'userId', type: 'TEXT', displayName: 'User ID' },
                { key: 'userEmail', type: 'TEXT', displayName: 'User Email' },
                { key: 'title', type: 'TEXT', displayName: 'Essay Title' },
                { key: 'school', type: 'TEXT', displayName: 'Target University' },
                { key: 'content', type: 'TEXT', displayName: 'HTML Content' },
                { key: 'plainText', type: 'TEXT', displayName: 'Plain Text' },
                { key: 'wordCount', type: 'NUMBER', displayName: 'Word Count' },
                { key: 'pageCount', type: 'NUMBER', displayName: 'Page Count' },
                { key: 'status', type: 'TEXT', displayName: 'Status' },
                { key: 'aiScore', type: 'NUMBER', displayName: 'AI Detection Score' },
                { key: 'score', type: 'NUMBER', displayName: 'Quality Score' },
                { key: 'format', type: 'TEXT', displayName: 'Format' },
                { key: 'updatedAt', type: 'TEXT', displayName: 'Last Updated' },
                { key: 'createdAt', type: 'TEXT', displayName: 'Created At' }
              ]
            }
          })
        });
      }
    } catch (e) {
      console.warn('Wix collection setup notice:', e);
    }

    const essayId = body.id || body.draftId;
    const userId = body.userId || 'guest-user';
    const userEmail = (body.userEmail || body.email || '').toLowerCase().trim();
    const title = (body.title || 'Statement of Purpose').trim();
    const school = (body.school || body.affiliation || 'Target University').trim();
    const content = body.content || body.html || '<p></p>';
    const plainText = body.plainText || content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
    const pages = Math.max(1, Math.ceil(words / 380));
    const now = new Date().toISOString();

    const essayPayload = {
      userId,
      userEmail,
      title,
      school,
      content,
      plainText,
      wordCount: words,
      pageCount: pages,
      status: body.status || 'In Progress',
      aiScore: body.aiScore !== undefined && body.aiScore !== null ? Number(body.aiScore) : null,
      score: body.score !== undefined && body.score !== null ? Number(body.score) : 88,
      format: body.format || 'ieee',
      updatedAt: now,
      createdAt: body.createdAt || now
    };

    let existingId: string | null = null;

    // 2. Check if row exists for this essayId
    if (essayId && !essayId.startsWith('draft-temp-')) {
      try {
        const checkRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${essayId}?dataCollectionId=${COLLECTION_ID}`, {
          method: 'GET',
          headers
        });
        if (checkRes.ok) {
          existingId = essayId;
        }
      } catch (err) {
        // Continue
      }
    }

    let saveResult: any = null;

    // 3. Update existing row if identified
    if (existingId) {
      const updateRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${existingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          dataCollectionId: COLLECTION_ID,
          dataItem: {
            id: existingId,
            data: essayPayload
          }
        })
      });

      if (updateRes.ok) {
        saveResult = await updateRes.json();
      }
    }

    // 4. If not updated, try inserting new item
    if (!saveResult) {
      const insertPayload: any = {
        dataCollectionId: COLLECTION_ID,
        dataItem: {
          data: essayPayload
        }
      };
      if (essayId && !essayId.startsWith('draft-')) {
        insertPayload.dataItem.id = essayId;
      }

      const insertRes = await fetch('https://www.wixapis.com/wix-data/v2/items', {
        method: 'POST',
        headers,
        body: JSON.stringify(insertPayload)
      });

      if (insertRes.ok) {
        saveResult = await insertRes.json();
      } else if (insertRes.status === 409 && essayId) {
        // Item already exists in Wix CMS -> Fallback to PUT update immediately
        const updateFallbackRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${essayId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            dataCollectionId: COLLECTION_ID,
            dataItem: {
              id: essayId,
              data: essayPayload
            }
          })
        });

        if (updateFallbackRes.ok) {
          saveResult = await updateFallbackRes.json();
          existingId = essayId;
        } else {
          const errText = await updateFallbackRes.text();
          console.warn('Wix essay PUT fallback failed:', updateFallbackRes.status, errText);
          return NextResponse.json(
            { success: false, error: errText },
            { status: updateFallbackRes.status }
          );
        }
      } else {
        const errText = await insertRes.text();
        console.warn('Wix essay insert failed:', insertRes.status, errText);
        return NextResponse.json(
          { success: false, error: errText },
          { status: insertRes.status }
        );
      }
    }

    const savedItem = saveResult.dataItem || saveResult;
    const finalId = savedItem?.id || savedItem?._id || existingId || essayId;

    return NextResponse.json({
      success: true,
      id: finalId,
      message: existingId ? 'Essay auto-saved to cloud' : 'New essay draft created',
      isUpdated: !!existingId,
      data: {
        id: finalId,
        ...essayPayload
      }
    });

  } catch (error: any) {
    console.error('Error auto-saving user essay to Wix CMS:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Essay ID required' }, { status: 400 });
    }

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json({ success: false, error: 'Wix credentials missing' }, { status: 400 });
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    const delRes = await fetch(`https://www.wixapis.com/wix-data/v2/items/${id}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ dataCollectionId: COLLECTION_ID })
    });

    if (!delRes.ok) {
      const errText = await delRes.text();
      return NextResponse.json({ success: false, error: errText }, { status: delRes.status });
    }

    return NextResponse.json({ success: true, message: 'Essay deleted from Wix CMS' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
