"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Image, Tooltip } from "antd";
import "../../DestinationLocation/DestinationLocation.css";
import "../ActivityGallery.css";

export interface ActivityGalleryProps {
    title: string;
    destinationName: string;
    destinationHref?: string;
    rating: number;
    reviewCount: number;
    location: string;
    mainImageUrl: string;
    secondaryImageUrls: [string, string, string, string];
    allImages?: string[];
}

const ActivityGallery = ({
    title,
    destinationName,
    destinationHref = "/destination",
    rating,
    reviewCount,
    location,
    mainImageUrl,
    secondaryImageUrls,
    allImages,
}: ActivityGalleryProps) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const previewImages = useMemo(
        () => [mainImageUrl, ...secondaryImageUrls],
        [mainImageUrl, secondaryImageUrls]
    );
    const galleryImages = useMemo(
        () => allImages ?? previewImages,
        [allImages, previewImages]
    );

    return (
        <section className="ActivityGallery MaxWidthComponent MarginAuto PaddingTop30">
            <div className="Breadcrumb MarginBottom20" aria-label="Breadcrumb">
                <Link href="/">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                </Link>
                <span className="Separator">&rsaquo;</span>
                <Link href="/">Home</Link>
                <span className="Separator">&rsaquo;</span>
                <Link href={destinationHref}>{destinationName}</Link>
                <span className="Separator">&rsaquo;</span>
                <span className="Current">{title}</span>
            </div>

            <div className="ActivityGalleryHeader MarginBottom30">
                <div className="ActivityGalleryHeaderLeft">
                    <h1 className="SecondaryHeadingFont">{title}</h1>
                    <div className="ActivityGalleryMeta">
                        <div className="ActivityGalleryRatingRow">
                            <svg
                                viewBox="0 0 24 24"
                                fill="var(--star-rating-color)"
                                className="ActivityGalleryStar"
                                aria-hidden
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            <p>{rating} ({reviewCount.toLocaleString()})</p>
                        </div>
                        <p>{location}</p>
                    </div>
                </div>
                <div className="ActivityGalleryActions">
                    <button type="button" className="ActivityGalleryActionBtn" aria-label="Share">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        <span>Share</span>
                    </button>
                    <button type="button" className="ActivityGalleryActionBtn" aria-label="Save to wishlist">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>Save to wishlist</span>
                    </button>
                </div>
            </div>

            <div className="ActivityGalleryGrid">
                <div className="ActivityGalleryGridMain">
                    <img src={mainImageUrl} alt={title} />
                </div>
                <div className="ActivityGalleryGridSecondary">
                    {secondaryImageUrls.map((url, idx) => (
                        <div
                            key={idx}
                            className="ActivityGalleryGridItem"
                        >
                            <img src={url} alt={`${title} - ${idx + 2}`} />
                            {idx === 3 && (
                                <button
                                    type="button"
                                    className="ActivityGallerySeeAllBtn"
                                    onClick={() => setLightboxOpen(true)}
                                    aria-label="See all images"
                                >
                                    <span className="ActivityGallerySeeAllOverlay" aria-hidden />
                                    <span className="ActivityGallerySeeAllLabel">See all images</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="ActivityGalleryTags" role="list">
                <div className="ActivityGalleryTagItem" role="listitem">
                    <span className="ActivityGalleryTagIcon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                            <path d="M7 15h.01M12 15h.01M17 15h.01" />
                        </svg>
                    </span>
                    <span className="ActivityGalleryTagLabel">Pay 10% to book</span>
                    <Tooltip
                        title="Pay just 10% upfront to confirm your booking. Rest is to be paid on spot."
                        placement="top"
                        trigger="hover"
                    >
                        <span className="ActivityGalleryTagInfoIcon" role="img" aria-label="More info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                            </svg>
                        </span>
                    </Tooltip>
                </div>
                <div className="ActivityGalleryTagItem" role="listitem">
                    <span className="ActivityGalleryTagIcon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9z" />
                            <path d="M12 6v12M8 12h8" />
                        </svg>
                    </span>
                    <span className="ActivityGalleryTagLabel">Mobile Tickets</span>
                    <Tooltip
                        title="Get tickets directly on your Whatsapp & Email."
                        placement="top"
                        trigger="hover"
                    >
                        <span className="ActivityGalleryTagInfoIcon" role="img" aria-label="More info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                            </svg>
                        </span>
                    </Tooltip>
                </div>
                <div className="ActivityGalleryTagItem" role="listitem">
                    <span className="ActivityGalleryTagIcon" aria-hidden>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </span>
                    <span className="ActivityGalleryTagLabel">Free Cancellation</span>
                    <Tooltip
                        title="Get 100% refund If you cancel 24 hours before the activity start time."
                        placement="top"
                        trigger="hover"
                    >
                        <span className="ActivityGalleryTagInfoIcon" role="img" aria-label="More info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4M12 8h.01" />
                            </svg>
                        </span>
                    </Tooltip>
                </div>
            </div>

            {/* Hidden Image.PreviewGroup for "See all images" – opens antd preview (built-in swiper) */}
            <div className="ActivityGalleryAntdPreviewRoot" aria-hidden>
                <Image.PreviewGroup
                    preview={{
                        visible: lightboxOpen,
                        onVisibleChange: (visible) => setLightboxOpen(visible),
                    }}
                >
                    {galleryImages.map((url, idx) => (
                        <Image
                            key={idx}
                            src={url}
                            alt={`${title} - ${idx + 1}`}
                            className="ActivityGalleryAntdPreviewHiddenImage"
                        />
                    ))}
                </Image.PreviewGroup>
            </div>
        </section>
    );
};

export default ActivityGallery;
