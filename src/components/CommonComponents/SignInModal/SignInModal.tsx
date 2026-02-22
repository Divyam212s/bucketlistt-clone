"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Modal, Segmented, Input, Button } from "antd";
import type { SegmentedLabeledOption } from "antd/es/segmented";
import "./SignInModal.css";

const OTP_LENGTH = 6;

export interface SignInModalProps {
  open: boolean;
  onClose: () => void;
}

const SignInModal = ({ open, onClose }: SignInModalProps) => {
  const [method, setMethod] = useState<"otp" | "password">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [passwordVisible, setPasswordVisible] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleMethodChange = (v: string | number) => {
    setMethod(v as "otp" | "password");
  };

  const handleSubmit = () => {
    if (method === "password") {
      console.log("Sign in with password", { email, password });
    } else {
      console.log("Sign in with OTP", { email, otp: otpValue });
    }
  };

  const handleSendOtp = () => {
    if (!email.trim()) return;
    console.log("Send OTP to", email);
    setOtpSent(true);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
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
          <h2 className="SignInModal-title">Welcome back</h2>
          <p className="SignInModal-subtitle">Sign in to continue to bucketlistt</p>
        </div>

        <Button
          type="default"
          className="SignInModal-google"
          block
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
                  <label className="SignInModal-label">Email</label>
                  <Input
                    placeholder="you@example.com"
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
                  disabled={!email.trim()}
                >
                  Send OTP
                </Button>
              </div>

              {otpSent && (
                <>
                  <label className="SignInModal-label">
                    Enter 6-digit code sent to your email
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

          <Button
            type="primary"
            block
            size="large"
            className="SignInModal-submit"
            onClick={handleSubmit}
            disabled={method === "otp" && (!otpSent || otpValue.length !== OTP_LENGTH)}
          >
            {method === "password" ? "Sign in" : "Verify & sign in"}
          </Button>
        </div>

        <p className="SignInModal-footer">
          Don&apos;t have an account? <a href="#" className="SignInModal-link">Sign up</a>
        </p>
      </div>
    </Modal>
  );
};

export default SignInModal;
