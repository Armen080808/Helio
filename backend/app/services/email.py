"""
Email service — sends via Namecheap Private Email SMTP (mail.privateemail.com).
From address: helio@baystreet.cc

Required env vars on Render:
  SMTP_USER=helio@baystreet.cc
  SMTP_PASSWORD=<mailbox password>
"""

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from ..config import settings

_SMTP_HOST = "mail.privateemail.com"
_FROM_NAME = "Helio"
_FROM_ADDR = "helio@baystreet.cc"


def _send(*, to: str, subject: str, html: str) -> bool:
    """Send via Namecheap Private Email SMTP (port 587 STARTTLS). Returns True on success."""
    if not settings.smtp_user or not settings.smtp_password:
        print(
            f"[EMAIL SKIPPED] SMTP_USER/SMTP_PASSWORD not set on Render.\n"
            f"  To: {to} | Subject: {subject}"
        )
        return True  # Don't crash the app

    print(f"[EMAIL] Connecting to {_SMTP_HOST}:587 as {settings.smtp_user} ...")

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{_FROM_NAME} <{_FROM_ADDR}>"
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))

    # Try port 587 (STARTTLS) — more reliable from cloud hosts than 465
    try:
        with smtplib.SMTP(_SMTP_HOST, 587, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(_FROM_ADDR, to, msg.as_string())
        print(f"[EMAIL SENT] '{subject}' → {to}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        print(f"[EMAIL ERROR] Authentication failed — check SMTP_USER/SMTP_PASSWORD: {e}")
        return False
    except smtplib.SMTPException as e:
        print(f"[EMAIL ERROR] SMTP error: {e}")
        return False
    except Exception as e:
        print(f"[EMAIL ERROR] Unexpected error: {e}")
        return False


# ─── Verification email ───────────────────────────────────────────────────────

def send_verification_email(to_email: str, name: str, code: str) -> bool:
    first = name.split()[0] if name else "there"
    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                max-width:480px;margin:auto;padding:40px 32px;background:#ffffff;
                border-radius:16px;color:#18181b">

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
        <div style="background:#4f46e5;border-radius:10px;width:36px;height:36px;
                    display:flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-weight:800;font-size:16px">H</span>
        </div>
        <span style="font-size:20px;font-weight:700;letter-spacing:-0.5px">Helio</span>
      </div>

      <h1 style="font-size:22px;font-weight:700;margin:0 0 8px;line-height:1.3">
        Verify your email, {first}
      </h1>
      <p style="color:#71717a;font-size:14px;margin:0 0 32px;line-height:1.6">
        Enter this code in Helio to activate your account.
        It expires in <strong style="color:#18181b">15 minutes</strong>.
      </p>

      <div style="background:#f4f4f5;border-radius:14px;padding:28px 20px;
                  text-align:center;margin-bottom:32px">
        <span style="font-family:'Courier New',monospace;font-size:48px;font-weight:800;
                     letter-spacing:14px;color:#18181b;display:inline-block;
                     padding-left:14px">{code}</span>
      </div>

      <p style="color:#a1a1aa;font-size:12px;margin:0;line-height:1.6">
        If you didn't create a Helio account, you can safely ignore this email.
      </p>

      <hr style="border:none;border-top:1px solid #f4f4f5;margin:28px 0">
      <p style="color:#d4d4d8;font-size:11px;margin:0">
        Helio &middot;
        <a href="https://baystreet.cc" style="color:#d4d4d8">baystreet.cc</a>
        &middot; Built for Canadian finance students
      </p>
    </div>
    """
    return _send(
        to=to_email,
        subject=f"{code} is your Helio verification code",
        html=html,
    )


# ─── Alumni connection email ──────────────────────────────────────────────────

def send_connection_email(
    to_email: str,
    sender_name: str,
    alumni_name: str,
    alumni_role: str,
    alumni_company: str,
    message: str,
) -> bool:
    first = sender_name.split()[0] if sender_name else "there"
    html = f"""
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
                max-width:520px;margin:auto;padding:40px 32px;background:#ffffff;
                border-radius:16px;color:#18181b">

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
        <div style="background:#4f46e5;border-radius:10px;width:36px;height:36px;
                    display:flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-weight:800;font-size:16px">H</span>
        </div>
        <span style="font-size:20px;font-weight:700;letter-spacing:-0.5px">Helio</span>
      </div>

      <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">
        Connection request sent to {alumni_name}
      </h1>
      <p style="color:#71717a;font-size:14px;margin:0 0 28px;line-height:1.6">
        Hi {first}, your request has been delivered. Here's a copy for your records.
      </p>

      <div style="background:#f4f4f5;border-radius:12px;padding:20px;margin-bottom:16px">
        <p style="font-size:11px;font-weight:600;color:#a1a1aa;
                  text-transform:uppercase;letter-spacing:.8px;margin:0 0 8px">Alumni</p>
        <p style="font-size:16px;font-weight:700;margin:0 0 2px">{alumni_name}</p>
        <p style="font-size:13px;color:#71717a;margin:0">{alumni_role} · {alumni_company}</p>
      </div>

      <div style="border:1px solid #e4e4e7;border-radius:12px;padding:20px;margin-bottom:32px">
        <p style="font-size:11px;font-weight:600;color:#a1a1aa;
                  text-transform:uppercase;letter-spacing:.8px;margin:0 0 8px">Your message</p>
        <p style="font-size:14px;color:#3f3f46;line-height:1.6;margin:0;
                  white-space:pre-wrap">{message}</p>
      </div>

      <hr style="border:none;border-top:1px solid #f4f4f5;margin:0 0 20px">
      <p style="color:#d4d4d8;font-size:11px;margin:0">
        Helio &middot;
        <a href="https://baystreet.cc" style="color:#d4d4d8">baystreet.cc</a>
        &middot; Alumni Network
      </p>
    </div>
    """
    return _send(
        to=to_email,
        subject=f"Connection request sent to {alumni_name} — Helio",
        html=html,
    )
