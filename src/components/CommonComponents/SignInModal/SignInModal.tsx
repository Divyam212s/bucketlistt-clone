"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Modal, Segmented, Input, Button } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  getGoogleAuthUrl,
} from "@/redux/api";
import "./SignInModal.css";

const OTP_LENGTH = 6;
const RESEND_OTP_SECONDS = 60;

const DEMO_EMAIL = "test@bucketlistt.com";
const DEMO_PASSWORD = "password123";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

function normalizeIndianPhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function isValidIndianPhone(value: string): boolean {
  const normalized = normalizeIndianPhone(value);
  return normalized.length === 10 && /^\d{10}$/.test(normalized);
}

function isValidEmailOrPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return isValidEmail(trimmed) || isValidIndianPhone(trimmed);
}

function getEmailOrPhoneValidationError(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Enter your email or phone number";
  if (isValidEmail(trimmed) || isValidIndianPhone(trimmed)) return "";
  if (/^\d+$/.test(trimmed) || /^[\d\s+()-]+$/.test(trimmed))
    return "Enter a valid 10-digit Indian phone number";
  return "Enter a valid email address or 10-digit Indian phone number";
}

/**
 * Always return phone for API request body as "91" + 10 digits (e.g. "918308063687").
 * Compulsory: 91 is added dynamically so send/verify always receive this format.
 */
function toApiPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  let tenDigits = "";
  if (digits.length === 12 && digits.startsWith("91")) tenDigits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) tenDigits = digits.slice(1);
  else if (digits.length === 10) tenDigits = digits;
  if (tenDigits.length !== 10 || !/^\d{10}$/.test(tenDigits)) return "";
  return "91" + tenDigits;
}

export type ModalView = "signIn" | "signUp1" | "signUp2";

export interface SignInModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (user: { email: string; role: string }) => void;
}

const SignInModal = ({ open, onClose, onSuccess }: SignInModalProps) => {
  const [modalView, setModalView] = useState<ModalView>("signIn");
  const [method, setMethod] = useState<"otp" | "password">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [sendOtp, { isLoading: sendOtpLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyLoading }] = useVerifyOtpMutation();

  // Create Account flow
  const [signUpEmailOrPhone, setSignUpEmailOrPhone] = useState("");
  const [signUpOtpDigits, setSignUpOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [signUpResendSeconds, setSignUpResendSeconds] = useState(0);
  const signUpOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const signUpValidationError = signUpEmailOrPhone.trim()
    ? getEmailOrPhoneValidationError(signUpEmailOrPhone)
    : "";
  const signUpIsValid = isValidEmailOrPhone(signUpEmailOrPhone);

  const segmentOptions: SegmentedLabeledOption[] = [
    { label: "Via Password", value: "password" },
    { label: "Via OTP", value: "otp" },
  ];

  const otpValue = otpDigits.join("");

  const resetOtpState = useCallback(() => {
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
  }, []);

  useEffect(() => {
    if (method !== "otp") resetOtpState();
  }, [method, resetOtpState]);

  useEffect(() => {
    if (open) setModalView("signIn");
  }, [open]);

  useEffect(() => {
    if (modalView !== "signUp2" || signUpResendSeconds <= 0) return;
    const t = setInterval(() => setSignUpResendSeconds((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [modalView, signUpResendSeconds]);

  const handleMethodChange = (v: string | number) => {
    setMethod(v as "otp" | "password");
  };

  const handleSubmit = async () => {
    setLoginError("");
    if (method === "password") {
      const e = email.trim().toLowerCase();
      const p = password;
      if (e === DEMO_EMAIL && p === DEMO_PASSWORD) {
        onSuccess?.({ email: e, role: "User" });
        onClose();
      } else {
        setLoginError("Invalid email or password. Use test@bucketlistt.com / password123");
      }
      return;
    }
    // OTP verify (RTK Query)
    const phoneNumber = toApiPhoneNumber(email.trim());
    if (!phoneNumber || otpValue.length !== OTP_LENGTH) return;
    try {
      const res = await verifyOtp({
        phoneNumber,
        otp: otpValue,
        platform: "bucketlistt",
      }).unwrap();
      // Store only { token: string, authenticated: true } so prepareHeaders uses Bearer <jwt-string>
      const token = res?.token;
      if (token && typeof token === "string" && typeof localStorage !== "undefined") {
        localStorage.setItem(
          "okghumo_auth",
          JSON.stringify({ token, authenticated: true })
        );
      }
      const user = res?.user;
      if (user) {
        onSuccess?.({ email: user.email ?? email.trim(), role: user.role ?? "User" });
        onClose();
      } else {
        setLoginError("Verification failed. Please check the OTP and try again.");
      }
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    const phoneNumber = toApiPhoneNumber(trimmed);
    if (!phoneNumber) {
      setLoginError("Please enter a valid 10-digit Indian phone number for OTP login.");
      return;
    }
    setLoginError("");
    try {
      await sendOtp({
        phoneNumber,
        platform: "bucketlistt",
      }).unwrap();
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Failed to send OTP. Please check the number and try again.");
    }
  };

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...otpDigits];
    next[index] = v;
    setOtpDigits(next);
    if (v && index < OTP_LENGTH - 1) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const next = [...otpDigits];
      next[index - 1] = "";
      setOtpDigits(next);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const next = [...otpDigits];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtpDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusIdx]?.focus();
  };

  const goToSignUp = () => {
    setModalView("signUp1");
    setSignUpEmailOrPhone("");
    setSignUpOtpDigits(Array(OTP_LENGTH).fill(""));
    setSignUpResendSeconds(0);
  };

  const goToSignIn = () => setModalView("signIn");

  const handleSignUpSendOtp = () => {
    if (!signUpIsValid) return;
    setModalView("signUp2");
    setSignUpResendSeconds(RESEND_OTP_SECONDS);
    setSignUpOtpDigits(Array(OTP_LENGTH).fill(""));
    setTimeout(() => signUpOtpRefs.current[0]?.focus(), 100);
  };

  const handleSignUpResend = () => {
    if (signUpResendSeconds > 0) return;
    setSignUpResendSeconds(RESEND_OTP_SECONDS);
    setSignUpOtpDigits(Array(OTP_LENGTH).fill(""));
    setTimeout(() => signUpOtpRefs.current[0]?.focus(), 100);
  };

  const handleChangePhoneNumber = () => {
    setModalView("signUp1");
    setSignUpOtpDigits(Array(OTP_LENGTH).fill(""));
    setSignUpResendSeconds(0);
  };

  const signUpOtpValue = signUpOtpDigits.join("");
  const handleSignUpCreateAccount = () => {
    if (signUpOtpValue.length !== OTP_LENGTH) return;
    // Dummy: later call API then onSuccess/onClose
    onSuccess?.({ email: signUpEmailOrPhone.trim(), role: "User" });
    onClose();
  };

  const handleSignUpOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...signUpOtpDigits];
    next[index] = v;
    setSignUpOtpDigits(next);
    if (v && index < OTP_LENGTH - 1) signUpOtpRefs.current[index + 1]?.focus();
  };

  const handleSignUpOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !signUpOtpDigits[index] && index > 0) {
      signUpOtpRefs.current[index - 1]?.focus();
      const next = [...signUpOtpDigits];
      next[index - 1] = "";
      setSignUpOtpDigits(next);
    }
  };

  const handleSignUpOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length === 0) return;
    const next = [...signUpOtpDigits];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setSignUpOtpDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    signUpOtpRefs.current[focusIdx]?.focus();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={500}
      centered
      className="SignInModal"
      styles={{ body: { padding: 0 } }}
    >
      <div className="SignInModal-inner">
        <button
          type="button"
          className="SignInModal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="SignInModal-header">
          <h2 className="SignInModal-title">
            {modalView === "signIn" ? "Welcome back" : "Create Account"}
          </h2>
          <p className="SignInModal-subtitle">
            {modalView === "signIn" && "Sign in to continue to bucketlistt"}
            {modalView === "signUp1" && "Enter your email or phone number to get started"}
            {modalView === "signUp2" && "Enter the OTP sent to your phone number"}
          </p>
        </div>

        {modalView === "signUp1" && (
          <>
            <div className="SignInModal-form">
              <label className="SignInModal-label">Email or Phone Number</label>
              <Input
                placeholder="Enter email or 10-digit phone number"
                value={signUpEmailOrPhone}
                onChange={(e) => setSignUpEmailOrPhone(e.target.value)}
                status={signUpValidationError ? "error" : undefined}
                className="SignInModal-input"
                size="large"
              />
              {signUpValidationError && (
                <p className="SignInModal-error" role="alert">{signUpValidationError}</p>
              )}
              <p className="SignInModal-hint">We&apos;ll send an OTP to your email or phone</p>
              <Button
                type="primary"
                block
                size="large"
                className="SignInModal-submit SignInModal-submit-signup"
                onClick={handleSignUpSendOtp}
                disabled={!signUpEmailOrPhone.trim() || !signUpIsValid}
              >
                Send OTP
              </Button>
            </div>
            <p className="SignInModal-footer">
              Already have an account?{" "}
              <button type="button" className="SignInModal-link SignInModal-link-btn" onClick={goToSignIn}>
                Sign in here
              </button>
            </p>
          </>
        )}

        {modalView === "signUp2" && (
          <>
            <div className="SignInModal-form">
              <label className="SignInModal-label">Email or Phone</label>
              <Input
                value={signUpEmailOrPhone}
                readOnly
                className="SignInModal-input SignInModal-input-readonly"
                size="large"
              />
              <label className="SignInModal-label">Enter OTP</label>
              <p className="SignInModal-hint">Enter the 6-digit code sent to your phone number</p>
              <div className="SignInModal-otp-boxes">
                {Array.from({ length: OTP_LENGTH }, (_, i) => (
                  <input
                    key={i}
                    ref={(el) => { signUpOtpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={signUpOtpDigits[i]}
                    onChange={(e) => handleSignUpOtpChange(i, e)}
                    onKeyDown={(e) => handleSignUpOtpKeyDown(i, e)}
                    onPaste={handleSignUpOtpPaste}
                    className="SignInModal-otp-box"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
              <p className="SignInModal-resend">
                {signUpResendSeconds > 0 ? (
                  <>Resend OTP in {signUpResendSeconds} seconds</>
                ) : (
                  <button type="button" className="SignInModal-link SignInModal-link-btn" onClick={handleSignUpResend}>
                    Resend OTP
                  </button>
                )}
              </p>
              <Button
                type="primary"
                block
                size="large"
                className="SignInModal-submit"
                onClick={handleSignUpCreateAccount}
                disabled={signUpOtpValue.length !== OTP_LENGTH}
              >
                Create Account
              </Button>
              <button
                type="button"
                className="SignInModal-link SignInModal-link-btn SignInModal-change-phone"
                onClick={handleChangePhoneNumber}
              >
                Change Phone Number
              </button>
            </div>
            <p className="SignInModal-footer">
              Already have an account?{" "}
              <button type="button" className="SignInModal-link SignInModal-link-btn" onClick={goToSignIn}>
                Sign in here
              </button>
            </p>
          </>
        )}

        {modalView === "signIn" && (
          <>
            <Button
              type="default"
              className="SignInModal-google"
              block
              onClick={() => {
                window.location.href = getGoogleAuthUrl();
              }}
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.59a7.398 7.398 0 0 0 2.19-5.65c0-.57-.05-.66-.15-1.18z"
                  />
                  <path
                    fill="#34A853"
                    d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"
                  />
                  <path
                    fill="#EA4335"
                    d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>

            <div className="SignInModal-divider">
              <span>or</span>
            </div>

            <Segmented
              block
              options={segmentOptions}
              value={method}
              onChange={handleMethodChange}
              className="SignInModal-segment"
            />

            <div className="SignInModal-form">
              {method === "password" ? (
                <>
                  <label className="SignInModal-label">Email</label>
                  <Input
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="SignInModal-input"
                    size="large"
                  />
                  <div className="SignInModal-label-row">
                    <label className="SignInModal-label">Password</label>
                    <a href="#" className="SignInModal-link">Forgot password?</a>
                  </div>
                  <Input.Password
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    className="SignInModal-input"
                    size="large"
                  />
                </>
              ) : (
                <>
                  <div className="SignInModal-otp-email-row">
                    <div className="SignInModal-otp-email-wrap">
                      <label className="SignInModal-label">Phone Number</label>
                      <Input
                        placeholder="10-digit Indian phone number"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="SignInModal-input"
                        size="large"
                        disabled={otpSent}
                      />
                    </div>
                    <Button
                      type="default"
                      className="SignInModal-otp-btn"
                      onClick={handleSendOtp}
                      disabled={!email.trim() || sendOtpLoading}
                      loading={sendOtpLoading}
                    >
                      Send OTP
                    </Button>
                  </div>

                  {otpSent && (
                    <>
                      <label className="SignInModal-label">
                        Enter 6-digit code sent to your phone
                      </label>
                      <div className="SignInModal-otp-boxes">
                        {Array.from({ length: OTP_LENGTH }, (_, i) => (
                          <input
                            key={i}
                            ref={(el) => { otpRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otpDigits[i]}
                            onChange={(e) => handleOtpChange(i, e)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            onPaste={handleOtpPaste}
                            className="SignInModal-otp-box"
                            aria-label={`Digit ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {loginError && (
                <p className="SignInModal-error" role="alert">{loginError}</p>
              )}
              <Button
                type="primary"
                block
                size="large"
                className="SignInModal-submit"
                onClick={handleSubmit}
                disabled={method === "otp" && (!otpSent || otpValue.length !== OTP_LENGTH)}
                loading={method === "otp" && verifyLoading}
              >
                {method === "password" ? "Sign in" : "Verify & sign in"}
              </Button>
            </div>

            <p className="SignInModal-footer">
              Don&apos;t have an account?{" "}
              <button type="button" className="SignInModal-link SignInModal-link-btn" onClick={goToSignUp}>
                Sign up
              </button>
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SignInModal;
