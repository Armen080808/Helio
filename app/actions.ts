"use server";

import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(
  email: string
): Promise<{ ok: boolean; message: string }> {
  if (!email || !email.includes("@")) {
    return { ok: false, message: "Please enter a valid email." };
  }

  const normalized = email.toLowerCase().trim();

  // Check for duplicate
  const existing = await db.waitlist.findUnique({ where: { email: normalized } });
  if (existing) {
    return { ok: true, message: "You're already on the list!" };
  }

  // Save to database
  await db.waitlist.create({ data: { email: normalized } });

  // Send confirmation email
  try {
    await resend.emails.send({
      from: "Helio <onboarding@resend.dev>",
      to: normalized,
      subject: "You're on the Helio waitlist 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fafafa;padding:40px 0;">
              <tr>
                <td align="center">
                  <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:36px 40px;text-align:center;">
                        <p style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">helio</p>
                        <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.75);">AI-native platform for freelancers</p>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding:40px;">
                        <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#18181b;">You're on the list! 🎉</p>
                        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52525b;">
                          Thanks for joining the Helio waitlist. We're building the AI-native platform that replaces every fragmented tool freelancers deal with — proposals, contracts, invoices, scheduling, and client management, all in one place.
                        </p>
                        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#52525b;">
                          We'll reach out to <strong>${normalized}</strong> as soon as early access opens. You'll be among the first to try it.
                        </p>
                        <!-- Divider -->
                        <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0;" />
                        <p style="margin:0;font-size:13px;color:#a1a1aa;text-align:center;">
                          You're receiving this because you signed up at <a href="https://helio-git-main-armen080808s-projects.vercel.app" style="color:#4f46e5;text-decoration:none;">tryhelio.app</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
  } catch (err) {
    // Email failure is non-fatal — user is still on the list
    console.error("[Helio waitlist] Email send failed:", err);
  }

  console.log(`[Helio waitlist] New signup: ${normalized}`);
  return { ok: true, message: "You're on the list!" };
}
