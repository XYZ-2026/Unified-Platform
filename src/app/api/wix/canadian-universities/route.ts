import { NextResponse } from 'next/server';
import { fetchCanadianUniversitiesFromWix } from '@/lib/wixCountryUniversities';
import { CANADA_UNIVERSITIES } from '@/app/country/canada/page';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const wixData = await fetchCanadianUniversitiesFromWix();
    const universities = wixData.length > 0 ? wixData : CANADA_UNIVERSITIES;

    return NextResponse.json({
      success: true,
      count: universities.length,
      source: wixData.length > 0 ? 'WixStudioCMS:CanadianUniversities' : 'FallbackDataset',
      universities,
    });
  } catch (error: any) {
    console.error('Error in /api/wix/canadian-universities:', error);
    return NextResponse.json({
      success: true,
      count: CANADA_UNIVERSITIES.length,
      source: 'FallbackDataset',
      universities: CANADA_UNIVERSITIES,
      error: error.message,
    });
  }
}
