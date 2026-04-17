import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from ..config import settings


def send_connection_email(
    to_email: str,
    sender_name: str,
    alumni_name: str,
    alumni_role: str,
    alumni_company: str,
    message: str,
) -> bool:
    """Send a connection-request confirmation to the user who clicked Connect."""

    if not settings.gmail_user or not settings.gmail_app_password:
        print(
            f"\n[EMAIL SKIPPED — GMAIL not configured]\n"
            f"To: {to_email}\nAlumni: {alumni_name} @ {alumni_company}\n"
            f"Message: {message}\n"
        )
        return True

    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;color:#18181b">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px">
        <div style="background:#4f46e5;border-radius:8px;width:32px;height:32px;
                    display:flex;align-items:center;justify-content:center">
          <span style="color:#fff;font-weight:700;font-size:15px">H</span>
        </div>
        <span style="font-size:18px;font-weight:700;letter-spacing:-0.5px">Helio</span>
      </div>

      <h2 style="font-size:20px;font-weight:700;margin:0 0 6px">
        Connection request sent to {alumni_name}
      </h2>
      <p style="color:#52525b;font-size:14px;margin:0 0 24px">
        Hi {sender_name}, your request has been delivered. Here's a copy for your records.
      </p>

      <div style="background:#f4f4f5;border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="font-size:13px;font-weight:600;color:#71717a;
                  text-transform:uppercase;letter-spacing:.6px;margin:0 0 10px">
          Alumni
        </p>
        <p style="font-size:16px;font-weight:700;margin:0 0 2px">{alumni_name}</p>
        <p style="font-size:13px;color:#52525b;margin:0">{alumni_role} · {alumni_company}</p>
      </div>

      <div style="border:1px solid #e4e4e7;border-radius:12px;padding:20px;margin-bottom:28px">
        <p style="font-size:13px;font-weight:600;color:#71717a;
                  text-transform:uppercase;letter-spacing:.6px;margin:0 0 10px">
          Your message
        </p>
        <p style="font-size:14px;color:#3f3f46;line-height:1.6;margin:0;
                  white-space:pre-wrap">{message}</p>
      </div>

      <p style="font-size:12px;color:#a1a1aa;margin:0">
        Sent via Helio Alumni Network · University of Toronto Finance Platform
      </p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Connection request sent to {alumni_name} — Helio"
    msg["From"] = f"Helio <{settings.gmail_user}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.gmail_user, settings.gmail_app_password)
            server.sendmail(settings.gmail_user, to_email, msg.as_string())
        print(f"[EMAIL SENT] Connection request confirmation → {to_email}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False


def send_verification_email(to_email: str, name: str, code: str) -> bool:
    """Send 6-digit verification code via Gmail SMTP."""

    if not settings.gmail_user or not settings.gmail_app_password:
        print(f"\n[EMAIL SKIPPED — GMAIL_USER/GMAIL_APP_PASSWORD not set]\nTo: {to_email}\nCode: {code}\n")
        return True

    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px">
        <h2 style="color:#4f46e5">Welcome to Helio, {name}!</h2>
        <p style="color:#52525b">Enter this code to verify your email address:</p>
        <div style="margin:28px 0;text-align:center">
            <span style="display:inline-block;letter-spacing:12px;font-size:42px;
                         font-weight:700;color:#18181b;background:#f4f4f5;
                         padding:16px 28px;border-radius:12px;font-family:monospace">
                {code}
            </span>
        </div>
        <p style="color:#a1a1aa;font-size:13px">This code expires in 15 minutes.</p>
        <p style="color:#a1a1aa;font-size:12px;margin-top:32px">
            If you didn't sign up for Helio, ignore this email.
        </p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{code} is your Helio verification code"
    msg["From"] = f"Helio <{settings.gmail_user}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.gmail_user, settings.gmail_app_password)
            server.sendmail(settings.gmail_user, to_email, msg.as_string())
        print(f"[EMAIL SENT] Code {code} → {to_email}")
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False
