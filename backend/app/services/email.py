import httpx
from ..config import settings


def send_verification_email(to_email: str, name: str, code: str) -> bool:
    """Send 6-digit verification code via Resend. Returns True on success, False on failure."""
    if not settings.resend_api_key:
        print(f"\n[EMAIL SKIPPED — no RESEND_API_KEY]\nTo: {to_email}\nCode: {code}\n")
        return True

    payload = {
        "from": "Helio <onboarding@resend.dev>",
        "to": [to_email],
        "subject": f"{code} is your Helio verification code",
        "html": f"""
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
        """,
    }

    try:
        r = httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            json=payload,
            timeout=10,
        )
        return r.status_code == 200
    except Exception as e:
        print(f"[EMAIL ERROR] {e}")
        return False
