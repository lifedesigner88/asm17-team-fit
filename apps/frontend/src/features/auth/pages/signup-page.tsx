import { useCallback, useState } from "react";
import { Form, Link, useActionData, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Field, Input, ShellCard, StatusPill } from "@/common/components";

import { verifyOtp } from "../api";
import type { AuthActionData } from "../types";

const ID_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateId(): string {
  return Array.from({ length: 6 }, () => ID_CHARSET[Math.floor(Math.random() * ID_CHARSET.length)]).join("");
}

export function SignupPage() {
  const { t } = useTranslation("auth");
  const actionData = useActionData() as AuthActionData | undefined;
  const navigate = useNavigate();
  const [userId, setUserId] = useState(() => generateId());
  const [copied, setCopied] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // OTP verification state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [userId]);

  const handleRandomize = useCallback(() => {
    setUserId(generateId());
  }, []);

  const handleVerify = useCallback(async () => {
    if (!actionData?.signupEmail || otp.length !== 6) return;
    setVerifying(true);
    setOtpError(null);
    const result = await verifyOtp(actionData.signupEmail, otp);
    setVerifying(false);
    if (result.error) {
      setOtpError(result.error);
    } else {
      setVerified(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    }
  }, [actionData?.signupEmail, otp]);

  // Step 3: Verified
  if (actionData?.generatedUserId && verified) {
    return (
      <ShellCard className="mx-auto max-w-xl bg-white/92">
        <div className="space-y-2">
          <StatusPill label={t("signup.step3Pill")} />
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{t("signup.step3Title")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("signup.step3Description")}</p>
        </div>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-600">{t("signup.personaIdLabel")}</p>
          <div className="mt-1 flex items-center gap-3">
            <p className="font-mono text-4xl font-bold tracking-widest text-amber-900">
              {actionData.generatedUserId}
            </p>
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(actionData.generatedUserId!)}
            >
              {t("signup.copy")}
            </Button>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{t("signup.redirecting")}</p>
      </ShellCard>
    );
  }

  // Step 2: OTP verification
  if (actionData?.generatedUserId) {
    return (
      <ShellCard className="mx-auto max-w-xl bg-white/92">
        <div className="space-y-2">
          <StatusPill label={t("signup.step2Pill")} />
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{t("signup.step2Title")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {t("signup.step2Description", { email: actionData.signupEmail })}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-widest text-amber-600">{t("signup.personaIdLabel")}</p>
          <p className="mt-1 font-mono text-3xl font-bold tracking-widest text-amber-900">
            {actionData.generatedUserId}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <Field label={t("signup.verificationCodeLabel")}>
            <Input
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              minLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </Field>
          {otpError ? (
            <p className="text-sm text-red-600">{otpError}</p>
          ) : null}
          <div className="flex justify-end">
            <Button disabled={otp.length !== 6 || verifying} onClick={handleVerify}>
              {verifying ? t("signup.verifying") : t("signup.verify")}
            </Button>
          </div>
        </div>
      </ShellCard>
    );
  }

  // Step 1: Signup form
  return (
    <ShellCard className="mx-auto max-w-xl bg-white/92">
      <div className="space-y-2">
        <StatusPill label={t("signup.step1Pill")} />
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">{t("signup.step1Title")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("signup.step1Description")}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-amber-600">{t("signup.personaIdLabel")}</p>
        <div className="mt-1 flex items-center gap-3">
          <p className="font-mono text-4xl font-bold tracking-widest text-amber-900">{userId}</p>
          <div className="flex flex-col gap-1.5">
            <Button size="sm" type="button" variant="outline" onClick={handleCopy}>
              {copied ? t("signup.copied") : t("signup.copy")}
            </Button>
            <Button size="sm" type="button" variant="outline" onClick={handleRandomize}>
              {t("signup.shuffle")}
            </Button>
          </div>
        </div>
        <p className="mt-3 text-xs text-amber-700">{t("signup.personaIdHint")}</p>
      </div>

      <Form className="mt-6 space-y-4" method="post">
        <input name="user_id" type="hidden" value={userId} />
        <Field label={t("signup.emailLabel")} hint={t("signup.emailHint")}>
          <Input autoComplete="email" name="email" required type="email" />
        </Field>
        <Field label={t("signup.pinLabel")}>
          <div className="flex items-center gap-2">
            <Input
              autoComplete="new-password"
              inputMode="numeric"
              maxLength={4}
              minLength={4}
              name="password"
              pattern="\d{4}"
              required
              type={showPin ? "text" : "password"}
            />
            <Button size="sm" type="button" variant="outline" onClick={() => setShowPin((v) => !v)}>
              {showPin ? t("signup.hide") : t("signup.show")}
            </Button>
          </div>
        </Field>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t("signup.pinNote")}</p>
          <Button type="submit">{t("signup.createAccount")}</Button>
        </div>
      </Form>

      {actionData?.error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionData.error}
        </div>
      ) : null}
    </ShellCard>
  );
}
