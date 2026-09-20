import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid JSON request body' },
        { status: 400 }
      );
    }

    const { email, name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const data = await sendWelcomeEmail({
      to: email.trim(),
      name: typeof name === 'string' ? name.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome email dispatched successfully',
      data,
    });
  } catch (error: any) {
    console.error('[API /api/send-welcome-email] Error sending email:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to send welcome email',
      },
      { status: 500 }
    );
  }
}
