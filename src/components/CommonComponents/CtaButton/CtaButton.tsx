"use client";
import Link from "next/link";
import "./CtaButton.css";

export interface CtaButtonProps {
  label: string;
  href: string;
  containerClassName?: string;
  buttonClassName?: string;
  external?: boolean;
}

const CtaButton = ({
  label,
  href,
  containerClassName = "",
  buttonClassName = "",
  external = false,
}: CtaButtonProps) => {
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  const containerClass = ["CtaButtonBanner", containerClassName].filter(Boolean).join(" ");
  const btnClass = ["CtaButton", buttonClassName].filter(Boolean).join(" ");

  return (
    <div className={containerClass}>
      <Link href={href} className={btnClass} {...linkProps}>
        {label}
      </Link>
    </div>
  );
};

export default CtaButton;