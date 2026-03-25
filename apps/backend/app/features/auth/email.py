import os
from typing import Literal

import resend

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM = os.getenv("RESEND_FROM", "onboarding@resend.dev")
EmailLocale = Literal["ko", "en"]


def _send(to: str, subject: str, html: str) -> None:
    if not RESEND_API_KEY:
        print(f"[email] RESEND_API_KEY not set — skipping email to {to}")
        return
    resend.api_key = RESEND_API_KEY
    try:
        resend.Emails.send({"from": RESEND_FROM, "to": to, "subject": subject, "html": html})
    except Exception as exc:  # noqa: BLE001
        print(f"[email] Failed to send to {to}: {exc}")


def _normalize_locale(locale: str | None) -> EmailLocale:
    return "ko" if locale == "ko" else "en"

def _otp_block(otp: str, locale: str | None) -> str:
    normalized = _normalize_locale(locale)
    if normalized == "ko":
        note = "이 코드는 10분 뒤 만료됩니다. 다른 사람과 공유하지 마세요."
    else:
        note = "This code expires in 10 minutes. Do not share it with anyone."
    return (
        f"<div style='font-size:40px;font-weight:700;letter-spacing:12px;"
        f"color:#b45309;margin:24px 0'>{otp}</div>"
        f"<p style='color:#666;font-size:13px'>{note}</p>"
    )


def send_otp_email(to: str, otp: str, locale: str | None = None) -> None:
    normalized = _normalize_locale(locale)
    if normalized == "ko":
        subject = "이메일 인증 코드 안내"
        title = "이메일 인증"
        body = "아래 6자리 인증 코드를 입력해 계정을 활성화해 주세요."
        footer = "메일이 보이지 않는다면 스팸함이나 프로모션함도 함께 확인해 주세요."
    else:
        subject = "Your email verification code"
        title = "Verify your email"
        body = "Enter the 6-digit verification code below to activate your account."
        footer = "If you do not see the email, please check your spam or promotions folder too."

    _send(
        to,
        subject,
        "<div style='font-family:sans-serif;max-width:480px;margin:0 auto'>"
        f"<h2 style='color:#1a1a1a'>{title}</h2>"
        f"<p>{body}</p>"
        + _otp_block(otp, normalized)
        + "<p style='color:#444;font-size:14px;line-height:1.7'>"
        f"{footer}"
        "</p>"
        + "</div>",
    )


def send_reset_pin_email(to: str, otp: str, locale: str | None = None) -> None:
    normalized = _normalize_locale(locale)
    if normalized == "ko":
        subject = "PIN 재설정 인증 코드 안내"
        title = "PIN 재설정"
        body = "아래 6자리 인증 코드를 입력해 새 6자리 PIN을 설정해 주세요."
        footer = "직접 요청하지 않았다면 이 메일은 무시하셔도 됩니다."
    else:
        subject = "Your PIN reset code"
        title = "Reset your PIN"
        body = "Enter the 6-digit verification code below to set a new 6-digit PIN."
        footer = "If you did not request this, you can safely ignore this email."

    _send(
        to,
        subject,
        "<div style='font-family:sans-serif;max-width:480px;margin:0 auto'>"
        f"<h2 style='color:#1a1a1a'>{title}</h2>"
        f"<p>{body}</p>"
        + _otp_block(otp, normalized)
        + "<p style='color:#444;font-size:14px;line-height:1.7'>"
        f"{footer}"
        "</p>"
        + "</div>",
    )
