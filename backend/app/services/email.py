import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from ..config import settings


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
