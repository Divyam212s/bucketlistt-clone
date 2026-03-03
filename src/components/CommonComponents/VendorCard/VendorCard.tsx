"use client";

import Link from "next/link";
import "./VendorCard.css";

export interface VendorCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price?: string;
  href?: string;
}

export default function VendorCard({
  imageUrl,
  title,
  description,
  price,
  href = "#",
}: VendorCardProps) {
  return (
    <article className="VendorCard">
      <div className="VendorCardImageWrap">
        <img src={imageUrl} alt={`${title} - activity provider and experiences`} />
        <div className="VendorCardOverlay" aria-hidden />
      </div>
      <div className="VendorCardContent">
        <h3 className="VendorCardTitle">{title}</h3>
        <p className="VendorCardDescription">{description}</p>
        <Link href={href} className="VendorCardBtn">
          View all activities
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
