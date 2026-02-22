"use client"
import { useState, useEffect } from "react";
import "../NavigationBar.css";
import { navContent } from "../CommonValues";
import Link from "next/link";
import SignInModal from "@/components/CommonComponents/SignInModal/SignInModal";                                    
const NavigationBar = () => {
    const [placeholder, setPlaceholder] = useState("");
    const [showActivities, setShowActivities] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);

    const phrases = navContent.placeholderPhrases;
    const allDestinations = navContent.destinations;

    const filteredSuggestions = allDestinations.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let timer: NodeJS.Timeout;

        const type = () => {
            const currentPhrase = phrases[currentPhraseIndex];

            if (isDeleting) {
                setPlaceholder(currentPhrase.substring(0, currentCharIndex - 1));
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                setPlaceholder(currentPhrase.substring(0, currentCharIndex + 1));
                currentCharIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at end of phrase
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before starting new phrase
            }

            timer = setTimeout(type, typingSpeed);
        };

        timer = setTimeout(type, typingSpeed);

        // Optimized scroll listener for Activities Bar
        let lastScrollY = window.scrollY;
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const delta = Math.abs(currentScrollY - lastScrollY);

                    // Thresholds for better UX
                    if (currentScrollY < 100) {
                        // Always show near the top
                        setShowActivities(true);
                    } else if (delta > 15) {
                        // Only update if the user has scrolled a meaningful amount (15px)
                        if (currentScrollY > lastScrollY) {
                            // Scrolling Down
                            setShowActivities(false);
                        } else {
                            // Scrolling Up
                            setShowActivities(true);
                        }
                    }

                    lastScrollY = currentScrollY;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [phrases]);

    const activities = navContent.activities;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "bungee":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 2v20M10 5l2-2 2 2" />
                        <circle cx="12" cy="18" r="2" />
                    </svg>
                );
            case "rafting":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 12s3-2 10-2 10 2 10 2M4 15l16 0M8 10l-2 8M16 10l2 8" />
                    </svg>
                );
            case "paragliding":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 10c0-4 4.5-7 9-7s9 3 9 7M12 3v17M3 10l9 10M21 10l-9 10M8 6l4 4 4-4" />
                    </svg>
                );
            case "balloon":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 12c4 0 7-3 7-7s-3-3-7-3-7 1-7 3 3 7 7 7zM9 12l1 4h4l1-4M10 16v4M14 16v4M8 20h8" />
                    </svg>
                );
            case "zipline":
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 5l20 14M6 8v6M18 16v4M10 10l-2 8M14 13l2 8" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <header id="MainHeader" className="StickyHeader">
            <nav id="NavigationBar">
                <div className="MaxWidthComponent MarginAuto NavContainer">
                    {/* Left Section: Logo */}
                   <Link  href="/" >
                   <div className="NavLeft">
                        <img src="/Images/BucketlisttLogo.png" alt="Bucketlistt Logo" className="NavLogo" />
                    </div>
                   </Link>

                    {/* Middle Section: Search */}
                    <div className="NavSearch">
                        <div className="SearchBarWrapper">
                            <input
                                type="text"
                                className="SearchInput"
                                placeholder={placeholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            />
                            <div className="SearchIconBox">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>

                            {showSuggestions && searchQuery.length > 0 && (
                                <div className="NavSuggestionsDropdown">
                                    {filteredSuggestions.length > 0 ? (
                                        filteredSuggestions.map((suggestion, index) => (
                                            <div key={index} className="NavSuggestionItem" onClick={() => {
                                                setSearchQuery(suggestion);
                                                setShowSuggestions(false);
                                            }}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                </svg>
                                                <span>{suggestion}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="NavEmptySuggestions">
                                            <svg viewBox="0 0 100 100" className="EmptyIcon">
                                                <path d="M10 80 L35 40 L50 60 L75 25 L95 80 Z" stroke="#ddd" strokeWidth="2" fill="none" />
                                                <circle cx="80" cy="20" r="8" stroke="#ddd" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                                                <path d="M40 85 Q 50 75 60 85" stroke="#ddd" strokeWidth="1" fill="none" />
                                            </svg>
                                            <span>No matches found</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Section: Actions */}
                    <div className="NavRight">
                        <button className="CartButton" title="Cart">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                        </button>
                        <button className="LoginBtn" onClick={() => setSignInOpen(true)}>Login</button>
                    </div>
                </div>
            </nav>

            <div id="ActivitiesBar" className={`${showActivities ? "visible" : "hidden"}`}>
                <div className="MaxWidthComponent MarginAuto ActivitiesContainer">
                    {activities.map((activity) => (
                        <div key={activity.name} className="NavActivityItem">
                            <div className="ActivityIconBox">
                                {getActivityIcon(activity.icon)}
                            </div>
                            <span className="ActivityLabel">{activity.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
        </header>
    );
};

export default NavigationBar;