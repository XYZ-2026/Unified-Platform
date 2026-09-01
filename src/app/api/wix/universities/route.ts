import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const country = searchParams.get('country') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const wixApiKey = process.env.WIX_API_KEY;
    const wixSiteId = process.env.WIX_SITE_ID;

    if (!wixApiKey || !wixSiteId) {
      return NextResponse.json({
        success: false,
        universities: [],
        error: 'Wix API credentials not configured.',
      });
    }

    const headers = {
      'Authorization': wixApiKey,
      'wix-site-id': wixSiteId,
      'Content-Type': 'application/json',
    };

    // Fetch all items using pagination (Wix limits to 1000 per request)
    let allItems: any[] = [];
    let cursor: string | null = null;
    let hasMore = true;

    while (hasMore) {
      const queryPayload: any = {
        dataCollectionId: 'Import2',
        query: {
          paging: { limit: 1000 },
          sort: [{ fieldName: 'university_name', order: 'ASC' }],
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

      // Safety cap at 5000
      if (allItems.length >= 5000) break;
    }

    // Parse items into a clean format
    const parsedUniversities = allItems.map((item) => {
      const d = item.data || item;
      const majorsRaw = d.popularMajors || '';
      const majorsArray = majorsRaw
        .split(',')
        .map((m: string) => m.trim())
        .filter(Boolean);

      // Generate a URL-safe slug from the name
      const slug = (d.university_name || 'university')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      return {
        id: d._id || item.id,
        universityId: d.university_id || '',
        name: d.university_name || 'Unknown University',
        country: d.country || 'Unknown',
        countryCode: d.country_code || '',
        state: d.state_province || '',
        qsRanking: d.qsRanking || 'Unranked',
        tuition: d.tution || 'N/A', // Note: field is "tution" (typo in Wix)
        livingCosts: d.livingCosts || 'N/A',
        acceptanceRate: d.acceptanceRate || 'N/A',
        website: d.official_website || '',
        bannerAlt: d.bannerImageAltText || '',
        popularMajors: majorsArray.slice(0, 8), // Cap at 8 tags for UI
        allMajors: majorsArray,
        slug,
        // New detailed fields
        avgGpa: d.avgGpa ?? null,
        satScore: d.satScore || '',
        avgNeedBasedGrant: d.avgNeedBasedGrant || '',
        requiredEssayPromptsDetails: d.requiredEssayPromptsDetails || '',
        writingRequirements: d.writingRequirements || '',
      };
    });

    // Apply server-side filtering
    let filtered = parsedUniversities;

    if (search) {
      filtered = filtered.filter((u) =>
        u.name.toLowerCase().includes(search) ||
        u.state.toLowerCase().includes(search) ||
        u.country.toLowerCase().includes(search) ||
        u.allMajors.some((m: string) => m.toLowerCase().includes(search))
      );
    }

    if (country && country !== 'ALL') {
      filtered = filtered.filter((u) =>
        u.countryCode === country || u.country.toLowerCase().includes(country.toLowerCase())
      );
    }

    // Paginate
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      universities: paginatedResults,
      totalCount,
      page,
      totalPages,
      limit,
      source: 'Import2',
    });
  } catch (error: any) {
    console.error('Error fetching universities from Wix CMS:', error);
    return NextResponse.json({
      success: false,
      universities: [],
      error: error.message || 'Failed to query Wix CMS',
    });
  }
}
