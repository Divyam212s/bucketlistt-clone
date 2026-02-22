"use client"
import { useRef, useState } from "react"
import "../HomeReview.css"
import { videoReviews, TestimonialsHeading } from "../CommonValues"

const HomeReviewDesktop = () => {
    const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
    const [muted, setMuted] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });

    const handleCardClick = (reviewId: number) => {
        const video = videoRefs.current[reviewId];
        if (!video) return;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const handleMuteClick = (e: React.MouseEvent, reviewId: number) => {
        e.stopPropagation();
        const nextMuted = !muted[reviewId];
        setMuted((prev) => ({ ...prev, [reviewId]: nextMuted }));
        const video = videoRefs.current[reviewId];
        if (video) video.muted = nextMuted;
    };

    return (
        <section className="HomeReviewSection MarginTop30">
            <div className="GlowTop"></div>
            <div id="HomeReviewDesktop" className="MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom30">
                <div className="HomeReviewHeader">
                    <h2 className="SecondaryHeadingFont text-center">{TestimonialsHeading}</h2>
                    <p className="SectionSubtitle text-center">Real stories, real adventures – join our community today.</p>
                </div>

                <div className="VideoReviewsGrid PaddingTop30">
                    {videoReviews.map((review) => (
                        <div
                            key={review.id}
                            className="VideoCard"
                            onClick={() => handleCardClick(review.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && handleCardClick(review.id)}
                        >
                            <div className="VideoThumbnailContainer">
                                <video
                                    ref={(el) => { videoRefs.current[review.id] = el; }}
                                    src={review.videoUrl}
                                    poster={review.thumbnail}
                                    muted={muted[review.id]}
                                    loop
                                    playsInline
                                    className="VideoReviewPlayer"
                                />
                                <div className="PlayIconOverlay">
                                    <div className="PlayButtonCircle">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="VideoCardBadge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                    <span>Travel Reel</span>
                                </div>
                                <button
                                    type="button"
                                    className="MuteBtn"
                                    onClick={(e) => handleMuteClick(e, review.id)}
                                    aria-label={muted[review.id] ? "Unmute" : "Mute"}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeReviewDesktop;
