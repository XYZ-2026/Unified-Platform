import { NextResponse } from 'next/server';

/**
 * GET /api/wix/universities/[slug]
 * Fetches a single university by its URL-safe slug from the Wix CMS.
 * The slug is matched by regenerating it from university_name.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json({
        success: false,
        university: null,
        error: 'Wix API credentials not configured.',
      });
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    // Fetch all universities (we need to match by generated slug)
    // Use pagination to handle large datasets
    let allItems: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;
    let found: any = null;

    while (hasMore && !found) {
      const queryPayload: any = {
        dataCollectionId: 'Import2',
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

      // Search for matching slug in this batch
      for (const item of items) {
        const d = item.data || item;
        const generatedSlug = (d.university_name || 'university')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        if (generatedSlug === slug) {
          found = d;
          found.id = d._id || item.id;
          break;
        }
      }

      if (found) break;

      if (data.pagingMetadata?.hasNext && data.pagingMetadata?.cursors?.next) {
        cursor = data.pagingMetadata.cursors.next;
      } else {
        hasMore = false;
      }

      if (allItems.length >= 5000) break;
    }

    if (!found) {
      return NextResponse.json({
        success: false,
        university: null,
        error: 'University not found',
      }, { status: 404 });
    }

    // Parse majors
    const majorsRaw = found.popularMajors || '';
    const majorsArray = majorsRaw
      .split(',')
      .map((m: string) => m.trim())
      .filter(Boolean);

    const university = {
      id: found.id || found._id,
      universityId: found.university_id || '',
      name: found.university_name || 'Unknown University',
      country: found.country || 'Unknown',
      countryCode: found.country_code || '',
      state: found.state_province || '',
      qsRanking: found.qsRanking || 'Unranked',
      tuition: found.tution || 'N/A',
      livingCosts: found.livingCosts || 'N/A',
      acceptanceRate: found.acceptanceRate || 'N/A',
      website: found.official_website || '',
      bannerAlt: found.bannerImageAltText || '',
      popularMajors: majorsArray,
      slug,
      // Detailed fields
      avgGpa: found.avgGpa ?? null,
      satScore: found.satScore || '',
      avgNeedBasedGrant: found.avgNeedBasedGrant || '',
      requiredEssayPromptsDetails: found.requiredEssayPromptsDetails || '',
      writingRequirements: found.writingRequirements || '',
    };

    return NextResponse.json({
      success: true,
      university,
    });
  } catch (error: any) {
    console.error('Error fetching university by slug:', error);
    return NextResponse.json({
      success: false,
      university: null,
      error: error.message || 'Failed to fetch university',
    }, { status: 500 });
  }
}
