"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import "../ActivityContent.css";

export interface ActivityOption {
    id: string;
    title: string;
    detail: string;
    originalPrice: number;
    price: number;
}

export interface ActivityContentProps {
    activities: ActivityOption[];
    sectionTitle?: string;
    sidebarButtonLabel?: string;
    initialVisibleCount?: number;
}

const ActivityContent = ({
    activities,
    sectionTitle = "Select Activity",
    sidebarButtonLabel = "Select Activity to Book",
    initialVisibleCount = 6,
}: ActivityContentProps) => {
    const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
    const [showAll, setShowAll] = useState(false);
    const [showScrollToSelect, setShowScrollToSelect] = useState(false);
    const selectContainerRef = useRef<HTMLDivElement>(null);
    const visibleList = showAll ? activities : activities.slice(0, initialVisibleCount);
    const hasMore = activities.length > initialVisibleCount;

    useEffect(() => {
        const el = selectContainerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                const rect = entry.boundingClientRect;
                const isAboveViewport = rect.bottom <= 0;
                setShowScrollToSelect(!entry.isIntersecting && isAboveViewport);
            },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const scrollToSelectActivity = () => {
        const el = selectContainerRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top, behavior: "smooth" });
    };

    const toggleAdded = (id: string) => {
        setAddedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <section className="ActivityContent MaxWidthComponent MarginAuto PaddingTop30 PaddingBottom50">
            <div className="ActivityContentLeft">
                <div ref={selectContainerRef} className="ActivityContentSection ActivityContentSelectContainer">
                    <h2 className="ActivityContentSectionTitle">{sectionTitle}</h2>
                    <div className="ActivityContentActivities">
                        {visibleList.map((activity) => {
                            const isAdded = addedIds.has(activity.id);
                            return (
                                <div key={activity.id} className={`ActivityContentCard ${isAdded ? "ActivityContentCardAdded" : ""}`}>
                                    <div className="ActivityContentCardBody">
                                        <h3 className="ActivityContentCardTitle">{activity.title}</h3>
                                        <p className="ActivityContentCardDetail">{activity.detail}</p>
                                        <div className="ActivityContentCardFooter">
                                            <div className="ActivityContentCardPrice">
                                                <span className="ActivityContentCardOriginalPrice">₹{activity.originalPrice.toLocaleString()}</span>
                                                <span className="ActivityContentCardCurrentPrice">₹{activity.price.toLocaleString()}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className={`ActivityContentCardAddBtn ${isAdded ? "ActivityContentCardAddBtnAdded" : ""}`}
                                                onClick={() => toggleAdded(activity.id)}
                                                aria-pressed={isAdded}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <span className="ActivityContentCardAddBtnIcon" aria-hidden>
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        </span>
                                                        Added
                                                    </>
                                                ) : (
                                                    "Add to trip"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {hasMore && (
                        <button
                            type="button"
                            className="ActivityContentShowMoreBtn"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? "Show less" : "Show more"}
                        </button>
                    )}
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Highlights</h2>
                    <div className="ActivityContentBlock">
                        <ul className="ActivityContentBlockList">
                            <li>Thrilling 83M bungy jump with certified instructors and full safety gear.</li>
                            <li>Flying Fox at 140 km/hr – tandem or solo options over the valley.</li>
                            <li>Valley Rope Jump / Cut chord for an intense free-fall experience.</li>
                            <li>Combo packages: Bungy + Flying Fox + Valley Jump for the ultimate adventure.</li>
                            <li>Video and photo packages available at the venue (charges extra).</li>
                            <li>Located in Rishikesh with stunning views of the Ganges and mountains.</li>
                        </ul>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Inclusion</h2>
                    <div className="ActivityContentBlock">
                        <ul className="ActivityContentBlockList">
                            <li>Safety equipment and harness</li>
                            <li>Certified instructor guidance</li>
                            <li>Briefing and training session</li>
                            <li>One jump/ride as per package</li>
                        </ul>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Exclusion</h2>
                    <div className="ActivityContentBlock">
                        <ul className="ActivityContentBlockList">
                            <li>Video and photography (available at venue, charges extra)</li>
                            <li>Personal expenses</li>
                            <li>Transport to/from jump site</li>
                        </ul>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Eligibility</h2>
                    <div className="ActivityContentBlock">
                        <p className="ActivityContentBlockSubtitle">Age & Weight</p>
                        <ul className="ActivityContentBlockList">
                            <li>Age: 12 – 45 years</li>
                            <li>Weight: Solo 40 – 120 kg; Couple/Tandem: up to 180 kg combined</li>
                        </ul>
                        <p className="ActivityContentBlockSubtitle">Participants must:</p>
                        <ul className="ActivityContentBlockList">
                            <li>Sign a waiver</li>
                            <li>Wear comfortable clothing</li>
                            <li>Avoid loose items or jewelry</li>
                        </ul>
                        <p className="ActivityContentBlockSubtitle ActivityContentBlockSubtitleNot">Not Suitable For</p>
                        <ul className="ActivityContentBlockList">
                            <li>Heart problems</li>
                            <li>High blood pressure</li>
                            <li>Spinal injuries</li>
                            <li>Recent surgeries</li>
                            <li>Pregnancy</li>
                        </ul>
                        <p className="ActivityContentBlockText">
                            Final participation depends on on-site safety clearance.
                        </p>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Location</h2>
                    <div className="ActivityContentBlock">
                        <p className="ActivityContentBlockText">
                            Log Huts Area, Mohanchatti, Rishikesh, Uttarakhand. The jump site is about 30–40 minutes from Rishikesh town. Detailed meeting point and directions shared after booking.
                        </p>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Cancellation Policy</h2>
                    <div className="ActivityContentBlock">
                        <ul className="ActivityContentBlockList">
                            <li>100% refund if cancelled before 24 hours of activity</li>
                            <li>No refunds for last-minute cancellations or missed slots</li>
                        </ul>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">Operating Hours</h2>
                    <div className="ActivityContentBlock">
                        <p className="ActivityContentBlockText">
                            10 AM to 4 PM (closed on Tuesday)
                        </p>
                    </div>
                </div>

                <div className="ActivityContentSection">
                    <h2 className="ActivityContentSectionTitle">FAQs</h2>
                    <div className="ActivityContentBlock">
                        <dl className="ActivityContentFaqList">
                            <dt className="ActivityContentFaqQuestion">Is Himalayan Bungy safe?</dt>
                            <dd className="ActivityContentFaqAnswer">Yes. Activities follow global safety standard AS/NZS5848:2000 and are conducted by British-trained professionals using certified equipment.</dd>
                            <dt className="ActivityContentFaqQuestion">Are videos included?</dt>
                            <dd className="ActivityContentFaqAnswer">Free DSLR video is included for Freestyle Bungy (limited period). Other activities have optional paid photo/video packages.</dd>
                            <dt className="ActivityContentFaqQuestion">Can beginners try bungy?</dt>
                            <dd className="ActivityContentFaqAnswer">Yes — first-timers are welcome if they meet age, weight, and health criteria.</dd>
                            <dt className="ActivityContentFaqQuestion">Are couple jumps available?</dt>
                            <dd className="ActivityContentFaqAnswer">Yes. Himalayan Tandem Bungy allows two participants to jump together (within combined weight limits).</dd>
                            <dt className="ActivityContentFaqQuestion">What should I wear?</dt>
                            <dd className="ActivityContentFaqAnswer">Comfortable clothing and closed shoes. Avoid loose items and jewelry.</dd>
                            <dt className="ActivityContentFaqQuestion">Do you offer combo packages?</dt>
                            <dd className="ActivityContentFaqAnswer">Yes — multiple adventure combos are available.</dd>
                        </dl>
                        <p className="ActivityContentFaqContact">
                            For combo bookings or discounts, call/WhatsApp +91 8511838237.
                        </p>
                    </div>
                </div>
            </div>

            <aside className="ActivityContentRight" aria-label="Booking sidebar">
                <button type="button" className="ActivityContentSidebarBtn">
                    {addedIds.size > 0 ? `${sidebarButtonLabel} (${addedIds.size})` : sidebarButtonLabel}
                </button>

                <div className="ActivityContentWhyCard">
                    <h3 className="ActivityContentWhyTitle">Why bucketlistt?</h3>
                    <ul className="ActivityContentWhyList">
                        <li className="ActivityContentWhyItem">
                            <span className="ActivityContentWhyIcon" aria-hidden>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </span>
                            <span>2000+ happy adventurers (<Link href="#">reviews</Link>)</span>
                        </li>
                        <li className="ActivityContentWhyItem">
                            <span className="ActivityContentWhyIcon" aria-hidden>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                            </span>
                            <span>Pay just 10% to reserve – balance at location</span>
                        </li>
                        <li className="ActivityContentWhyItem">
                            <span className="ActivityContentWhyIcon" aria-hidden>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </span>
                            <span>Lowest prices with last-minute availability</span>
                        </li>
                        <li className="ActivityContentWhyItem">
                            <span className="ActivityContentWhyIcon" aria-hidden>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                </svg>
                            </span>
                            <span>Instant booking confirmation</span>
                        </li>
                        <li className="ActivityContentWhyItem">
                            <span className="ActivityContentWhyIcon" aria-hidden>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                                </svg>
                            </span>
                            <span>24/7 expert <Link href="#">support</Link></span>
                        </li>
                        <li className="ActivityContentWhyItem">
                            <span className="ActivityContentWhyIcon" aria-hidden>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </span>
                            <span>No hidden charges. Ever.</span>
                        </li>
                    </ul>
                </div>
            </aside>

            <button
                type="button"
                className={`ActivityContentScrollToSelectBtn ${showScrollToSelect ? "ActivityContentScrollToSelectBtnVisible" : ""}`}
                onClick={scrollToSelectActivity}
                aria-label="Scroll to Select Activity"
            >
                <span className="ActivityContentScrollToSelectBtnIcon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </span>
                View Your Adventures Activities
            </button>
        </section>
    );
};

export default ActivityContent;
