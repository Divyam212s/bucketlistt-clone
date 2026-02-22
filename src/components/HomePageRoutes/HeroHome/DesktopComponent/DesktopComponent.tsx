"use client"
import { useState, useEffect } from "react";
import { HeroHomeDeskTopImage, SlidingWords, HeroHomeCta } from "../CommonValues";
import "../HeroHome.css";
import CtaButton from "@/components/CommonComponents/CtaButton/CtaButton";

const HeroHomeDesktopComponent = () => {
    const [wordIndex, setWordIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Mock suggestions - in a real app these could come from an API or common values
    const allDestinations = ["Bali, Indonesia", "Paris, France", "Santorini, Greece", "Tokyo, Japan", "Swiss Alps"];
    const filteredSuggestions = allDestinations.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setWordIndex((prev) => (prev + 1) % SlidingWords.length);
                setIsAnimating(false);
            }, 500); // Half second for fade out
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div id="desktop-component">
            <div className="cinematic-overlay" />
            <div className="DesktopMainContainer">
                <div className="DesktopImageContainer">
                    <img src={HeroHomeDeskTopImage} alt="Hero Home Desktop" />
                </div>
                <div className="DesktopContent">
                    <div className="DesktopContentContainer PaddingBottomDesktopOnly  MaxWidthComponent MarginAuto">
                        <div className="RegularSectionHeading PrimaryHeadingFont MaxWidth600 ColorWhite">
                            Hand-picked experiences for <span className="SwooshContainer">
                                tourists
                                <svg className="SwooshSvg" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M 0 15 Q 50 5 100 15" stroke="white" strokeWidth="2" fill="transparent" strokeLinecap="round" />
                                </svg>
                            </span> <span className={`SlidingWord ${isAnimating ? 'fade-out' : 'fade-in'} `}>
                                {SlidingWords[wordIndex]}
                            </span>
                        </div>
                        <CtaButton
                            label={HeroHomeCta.label}
                            href={HeroHomeCta.href}
                            external={HeroHomeCta.external}
                        />
                        {/* <div className="DesktopSearchBarContainer">
                            <div className="MinimalSearchBarContainer">
                                <div className="MinimalSearchBar">
                                    <svg className="SearchIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search experiences, destinations..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                </div>
                                {showSuggestions && searchQuery.length > 0 && (
                                    <div className="SuggestionsDropdown">
                                        {filteredSuggestions.length > 0 ? (
                                            filteredSuggestions.map((suggestion, index) => (
                                                <div key={index} className="SuggestionItem" onClick={() => {
                                                    setSearchQuery(suggestion);
                                                    setShowSuggestions(false);
                                                }}>
                                                    {suggestion}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="EmptySuggestions">
                                                <svg viewBox="0 0 100 100" className="EmptyIcon">
                                                    
                                                    <path d="M10 80 L35 40 L50 60 L75 25 L95 80 Z" stroke="#ddd" strokeWidth="2" fill="none" />
                                                 
                                                    <circle cx="80" cy="20" r="8" stroke="#ddd" strokeWidth="1" fill="none" strokeDasharray="2 2" />
                                            
                                                    <path d="M40 85 Q 50 75 60 85" stroke="#ddd" strokeWidth="1" fill="none" />
                                                </svg>
                                                <span>No adventures found yet</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HeroHomeDesktopComponent;