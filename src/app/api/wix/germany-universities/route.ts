import { NextResponse } from 'next/server';
import { fetchGermanyUniversitiesFromWix } from '@/lib/wixCountryUniversities';
import { GERMANY_UNIVERSITIES } from '@/app/country/germany/page';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const wixData = await fetchGermanyUniversitiesFromWix();
    const universities = wixData.length > 0 ? wixData : GERMANY_UNIVERSITIES;

    return NextResponse.json({
      success: true,
      count: universities.length,
      source: wixData.length > 0 ? 'WixStudioCMS:GermanyUniversities' : 'FallbackDataset',
      universities,
    });
  } catch (error: any) {
    console.error('Error in /api/wix/germany-universities:', error);
    return NextResponse.json({
      success: true,
      count: GERMANY_UNIVERSITIES.length,
      source: 'FallbackDataset',
      universities: GERMANY_UNIVERSITIES,
      error: error.message,
    });
  }
}
