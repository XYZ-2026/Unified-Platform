import { NextResponse } from 'next/server';
import universitiesData from '@/data/universities-us.json';
import statesData from '@/data/states.json';
import majorsData from '@/data/majors.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ids = searchParams.get('ids');
    const state = searchParams.get('state');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '0', 10);
    const metaOnly = searchParams.get('meta') === 'true';

    if (metaOnly) {
      return NextResponse.json({
        success: true,
        states: statesData,
        majors: majorsData,
        totalCount: universitiesData.length,
      });
    }

    // Single university query
    if (id) {
      const uni = (universitiesData as any[]).find((u) => u.id === id);
      if (!uni) {
        return NextResponse.json({ success: false, error: 'University not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, university: uni });
    }

    // Multiple IDs query (for compare)
    if (ids) {
      const idList = new Set(ids.split(',').map((s) => s.trim()));
      const matches = (universitiesData as any[]).filter((u) => idList.has(u.id));
      return NextResponse.json({ success: true, universities: matches });
    }

    let filtered = universitiesData as any[];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.state.toLowerCase().includes(q)
      );
    }

    if (state) {
      filtered = filtered.filter((u) => u.state.toLowerCase() === state.toLowerCase());
    }

    if (limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      totalCount: (universitiesData as any[]).length,
      matchedCount: filtered.length,
      universities: filtered,
      states: statesData,
      majors: majorsData,
    });
  } catch (err: any) {
    console.error('NPC Universities API error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
