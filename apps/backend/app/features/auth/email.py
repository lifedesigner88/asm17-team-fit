import os

import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM = os.getenv("RESEND_FROM", "onboarding@resend.dev")


def _send(to: str, subject: str, html: str) -> None:
    if not RESEND_API_KEY:
        return
    resend.api_key = RESEND_API_KEY
    resend.Emails.send({"from": RESEND_FROM, "to": to, "subject": subject, "html": html})


def _otp_block(otp: str) -> str:
    return (
        f"<div style='font-size:40px;font-weight:700;letter-spacing:12px;"
        f"color:#b45309;margin:24px 0'>{otp}</div>"
        "<p style='color:#666;font-size:13px'>This code expires in 10 minutes. "
        "Do not share it with anyone.</p>"
    )


def send_otp_email(to: str, otp: str) -> None:
    _send(
        to,
        "Your PersonaMirror verification code",
        "<div style='font-family:sans-serif;max-width:480px;margin:0 auto'>"
        "<h2 style='color:#1a1a1a'>Verify your email</h2>"
        "<p>Enter this code to activate your PersonaMirror account:</p>"
        + _otp_block(otp)
        + "</div>",
    )


def send_reset_pin_email(to: str, otp: str) -> None:
    _send(
        to,
        "Reset your PersonaMirror PIN",
        "<div style='font-family:sans-serif;max-width:480px;margin:0 auto'>"
        "<h2 style='color:#1a1a1a'>Reset your PIN</h2>"
        "<p>Enter this code to set a new 4-digit PIN:</p>"
        + _otp_block(otp)
        + "</div>",
    )
