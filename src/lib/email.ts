import { Resend } from 'resend';

// Sender configuration
const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'Abroad Simplified <noreply@abroadsimplified.com>';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abroadsimplified.com';

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured in environment variables.');
  }
  return new Resend(apiKey);
}

export interface WelcomeEmailOptions {
  to: string;
  name?: string;
}

/**
 * Builds a clean, premium, and fully responsive HTML welcome email matching
 * Abroad Simplified's exact visual identity:
 * - Logo: "Abroad" in #0f4c75 and "Simplified" in #690b1b
 * - Canvas: #fcfbfa
 * - Container: #ffffff with #e7e2de border and #f9f7f5 accent boxes
 * - Accent: #690b1b left border and buttons
 * - 100% mobile responsive (fluid width, padding adjustments, touch-friendly CTA)
 */
export function buildWelcomeEmailHtml(name?: string): string {
  const recipientName = name && name.trim() ? name.trim() : 'Future Scholar';
  const firstName = recipientName.split(' ')[0] || 'there';
  const dashboardUrl = `${SITE_URL}/dashboard`;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Refresh" content="none">
    <title>Welcome to Abroad Simplified</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #222222;
            background-color: #fcfbfa;
            margin: 0;
            padding: 24px 12px;
            -webkit-text-size-adjust: 100%;
        }
        .container {
            max-width: 600px;
            width: 100%;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #e7e2de;
            border-radius: 18px;
            padding: 38px 36px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #ece6e2;
            padding-bottom: 20px;
            margin-bottom: 28px;
        }
        .logo {
            font-size: 26px;
            font-weight: 800;
            color: #0f4c75;
            letter-spacing: -0.5px;
            margin-bottom: 4px;
        }
        .logo span {
            color: #690b1b;
        }
        .subtag {
            font-size: 10.5px;
            font-weight: 700;
            color: #888888;
            text-transform: uppercase;
            letter-spacing: 1.6px;
        }
        .title {
            font-size: 21px;
            font-weight: 700;
            color: #111111;
            margin-top: 0;
            margin-bottom: 16px;
            line-height: 1.35;
        }
        .message {
            font-size: 15px;
            line-height: 1.65;
            color: #444444;
            margin-bottom: 24px;
        }
        .details-box {
            background-color: #f9f7f5;
            border-radius: 12px;
            padding: 20px 22px;
            margin-bottom: 24px;
            border-left: 4px solid #690b1b;
        }
        .details-box.navy {
            border-left-color: #0f4c75;
        }
        .details-title {
            font-weight: 700;
            font-size: 13px;
            color: #690b1b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 12px;
        }
        .details-box.navy .details-title {
            color: #0f4c75;
        }
        .feature-item {
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.55;
            color: #555555;
        }
        .feature-item strong {
            color: #111111;
        }
        .cta-container {
            text-align: center;
            margin: 32px 0 28px 0;
        }
        .btn-primary {
            display: inline-block;
            background-color: #690b1b;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 34px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.2px;
            box-shadow: 0 4px 12px rgba(105, 11, 27, 0.2);
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #ece6e2;
            padding-top: 22px;
            margin-top: 28px;
            line-height: 1.6;
        }
        .footer a {
            color: #888888;
            text-decoration: underline;
        }

        /* Mobile adjustments */
        @media only screen and (max-width: 600px) {
            body {
                padding: 12px 6px !important;
            }
            .container {
                padding: 24px 18px !important;
                margin: 8px auto !important;
                border-radius: 14px !important;
            }
            .logo {
                font-size: 23px !important;
            }
            .title {
                font-size: 19px !important;
                line-height: 1.3 !important;
            }
            .message {
                font-size: 14.5px !important;
                line-height: 1.6 !important;
            }
            .details-box {
                padding: 16px 16px !important;
            }
            .btn-primary {
                display: block !important;
                width: 100% !important;
                padding: 14px 16px !important;
                text-align: center !important;
            }
        }
    </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222222; background-color: #fcfbfa; margin: 0; padding: 24px 12px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fcfbfa;">
        <tr>
            <td align="center">
                <div class="container" style="max-width: 600px; width: 100%; margin: 20px auto; background-color: #ffffff; border: 1px solid #e7e2de; border-radius: 18px; padding: 38px 36px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); text-align: left;">
                    
                    <!-- HEADER -->
                    <div class="header" style="text-align: center; border-bottom: 2px solid #ece6e2; padding-bottom: 20px; margin-bottom: 28px;">
                        <div class="logo" style="font-size: 26px; font-weight: 800; color: #0f4c75; letter-spacing: -0.5px; margin-bottom: 4px;">
                            Abroad <span style="color: #690b1b;">Simplified</span>
                        </div>
                        <div class="subtag" style="font-size: 10.5px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 1.6px;">
                            AI-Powered Study Abroad & Admissions Platform
                        </div>
                    </div>

                    <!-- TITLE & GREETING -->
                    <h2 class="title" style="font-size: 21px; font-weight: 700; color: #111111; margin-top: 0; margin-bottom: 16px; line-height: 1.35;">
                        Welcome to Abroad Simplified, ${firstName}!
                    </h2>

                    <div class="message" style="font-size: 15px; line-height: 1.65; color: #444444; margin-bottom: 24px;">
                        Dear <strong>${recipientName}</strong>,<br><br>
                        We are thrilled to welcome you to <strong>Abroad Simplified</strong>. Your account is fully set up and ready to empower your journey to world-class universities across the United States, United Kingdom, Canada, Europe, and Australia.
                    </div>

                    <!-- PLATFORM TOOLS BOX -->
                    <div class="details-box" style="background-color: #f9f7f5; border-radius: 12px; padding: 20px 22px; margin-bottom: 24px; border-left: 4px solid #690b1b;">
                        <div class="details-title" style="font-weight: 700; font-size: 13px; color: #690b1b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px;">
                            Core Admissions Tools
                        </div>
                        <div class="feature-item" style="margin-bottom: 10px; font-size: 14px; line-height: 1.55; color: #555555;">
                            <strong style="color: #111111;">&bull; AI Chance-Me Predictor:</strong> Benchmark your GPA, test scores, and profile against 500+ top universities to identify Reach, Target, and Safety programs.
                        </div>
                        <div class="feature-item" style="margin-bottom: 10px; font-size: 14px; line-height: 1.55; color: #555555;">
                            <strong style="color: #111111;">&bull; AI Essay &amp; SOP Studio:</strong> Draft, refine, and receive constructive real-time feedback on your Statements of Purpose and college essays.
                        </div>
                        <div class="feature-item" style="margin-bottom: 10px; font-size: 14px; line-height: 1.55; color: #555555;">
                            <strong style="color: #111111;">&bull; Net Price Calculator:</strong> Calculate your true out-of-pocket costs and uncover high-impact global scholarships.
                        </div>
                        <div class="feature-item" style="margin-bottom: 0; font-size: 14px; line-height: 1.55; color: #555555;">
                            <strong style="color: #111111;">&bull; Admitted Student Profiles:</strong> Review real stats, test scores, and exemplar essays from students admitted to Harvard, Stanford, Oxford, and more.
                        </div>
                    </div>

                    <!-- CTA BUTTON -->
                    <div class="cta-container" style="text-align: center; margin: 32px 0 28px 0;">
                        <a href="${dashboardUrl}" target="_blank" class="btn-primary" style="display: inline-block; background-color: #690b1b; color: #ffffff !important; text-decoration: none; padding: 14px 34px; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: 0.2px; box-shadow: 0 4px 12px rgba(105, 11, 27, 0.2);">
                            Go to Your Dashboard &rarr;
                        </a>
                    </div>

                    <!-- NEXT STEPS BOX -->
                    <div class="details-box navy" style="background-color: #f9f7f5; border-radius: 12px; padding: 20px 22px; margin-bottom: 24px; border-left: 4px solid #0f4c75;">
                        <div class="details-title" style="font-weight: 700; font-size: 13px; color: #0f4c75; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                            Quick 3-Step Start
                        </div>
                        <div style="font-size: 14px; color: #444444; line-height: 1.65;">
                            <strong>1.</strong> Fill out your academic profile (major, GPA, test scores).<br>
                            <strong>2.</strong> Shortlist target universities with AI Chance-Me predictions.<br>
                            <strong>3.</strong> Start your first Statement of Purpose in the Essay Studio.
                        </div>
                    </div>

                    <div class="message" style="font-size: 14px; line-height: 1.6; color: #555555; margin-bottom: 24px;">
                        Need help or have questions? Our admissions advisors are here to support you. Simply reply to this email or contact us at <a href="mailto:support@abroadsimplified.com" style="color: #690b1b; text-decoration: underline;">support@abroadsimplified.com</a>.
                    </div>

                    <!-- FOOTER -->
                    <div class="footer" style="text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #ece6e2; padding-top: 22px; margin-top: 28px; line-height: 1.6;">
                        &copy; ${currentYear} Abroad Simplified. All rights reserved.<br>
                        <a href="${SITE_URL}" style="color: #888888; text-decoration: underline;">abroadsimplified.com</a> &bull;
                        <a href="${SITE_URL}/privacy" style="color: #888888; text-decoration: underline;">Privacy Policy</a> &bull;
                        <a href="${SITE_URL}/terms" style="color: #888888; text-decoration: underline;">Terms of Service</a>
                    </div>

                </div>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Plain text fallback version.
 */
export function buildWelcomeEmailText(name?: string): string {
  const recipientName = name && name.trim() ? name.trim() : 'Future Scholar';
  const firstName = recipientName.split(' ')[0] || 'there';
  const dashboardUrl = `${SITE_URL}/dashboard`;

  return `Abroad Simplified | AI-Powered Study Abroad & Admissions Platform

Welcome to Abroad Simplified, ${firstName}!

Dear ${recipientName},

We are thrilled to welcome you to Abroad Simplified. Your account is fully set up and ready to empower your journey to world-class universities across the United States, United Kingdom, Canada, Europe, and Australia.

Core Admissions Tools:
- AI Chance-Me Predictor: Benchmark your GPA, test scores, and profile against 500+ top universities to identify Reach, Target, and Safety programs.
- AI Essay & SOP Studio: Draft, refine, and receive constructive real-time feedback on your Statements of Purpose and college essays.
- Net Price Calculator: Calculate your true out-of-pocket costs and uncover high-impact global scholarships.
- Admitted Student Profiles: Review real stats, test scores, and exemplar essays from students admitted to top schools.

Go to Your Dashboard:
${dashboardUrl}

Quick 3-Step Start:
1. Fill out your academic profile (major, GPA, test scores).
2. Shortlist target universities with AI Chance-Me predictions.
3. Start your first Statement of Purpose in the Essay Studio.

Need help? Reply to this email or contact support@abroadsimplified.com.

Best of luck with your applications,
The Abroad Simplified Team
https://abroadsimplified.com
`;
}

/**
 * Sends the welcome email using Resend in Node.js backend.
 */
export async function sendWelcomeEmail({ to, name }: WelcomeEmailOptions) {
  const resend = getResendClient();
  const html = buildWelcomeEmailHtml(name);
  const text = buildWelcomeEmailText(name);

  const cleanTo = to.trim().toLowerCase();
  const subject = name
    ? `Welcome to Abroad Simplified, ${name.trim().split(' ')[0]}! 🎓✈️`
    : 'Welcome to Abroad Simplified! 🎓✈️';

  const response = await resend.emails.send({
    from: DEFAULT_FROM_EMAIL,
    to: [cleanTo],
    subject,
    html,
    text,
  });

  if (response.error) {
    throw new Error(`Resend error: ${response.error.message || JSON.stringify(response.error)}`);
  }

  return response.data;
}
