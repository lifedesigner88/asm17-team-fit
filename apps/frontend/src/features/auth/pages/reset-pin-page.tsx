import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Field, Input, ShellCard, StatusPill } from "@/common/components";

import { confirmPinReset, requestPinReset } from "../api";

export function ResetPinPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    const result = await requestPinReset(email);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setStep("confirm");
    }
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const result = await confirmPinReset(email, otp, newPin);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate("/auth/login");
    }
  }

  if (step === "confirm") {
    return (
      <ShellCard className="mx-auto max-w-xl bg-white/92">
        <div className="space-y-2">
          <StatusPill label="Check your email" />
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">Enter your reset code</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-foreground">{email}</span>.
            Enter it and set a new 4-digit PIN.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          <Field label="Verification code">
            <Input
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </Field>
          <Field label="New PIN (4 digits)">
            <div className="flex items-center gap-2">
              <Input
                autoComplete="new-password"
                inputMode="numeric"
                maxLength={4}
                minLength={4}
                pattern="\d{4}"
                placeholder="0000"
                value={newPin}
                type={showPin ? "text" : "password"}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              />
              <Button size="sm" type="button" variant="outline" onClick={() => setShowPin((v) => !v)}>
                {showPin ? "Hide" : "Show"}
              </Button>
            </div>
          </Field>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end">
            <Button disabled={otp.length !== 6 || newPin.length !== 4 || loading} onClick={handleConfirm}>
              {loading ? "Resetting…" : "Reset PIN"}
            </Button>
          </div>
        </div>
      </ShellCard>
    );
  }

  return (
    <ShellCard className="mx-auto max-w-xl bg-white/92">
      <div className="space-y-2">
        <StatusPill label="Forgot PIN" />
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">Reset your PIN</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Enter your registered email. We will send a verification code to reset your PIN.
        </p>
      </div>
      <div className="mt-6 space-y-4">
        <Field label="Email">
          <Input
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex justify-end">
          <Button disabled={!email || loading} onClick={handleRequest}>
            {loading ? "Sending…" : "Send code"}
          </Button>
        </div>
      </div>
    </ShellCard>
  );
}
