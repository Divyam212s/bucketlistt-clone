"use client"
import { useState, useEffect, useRef, useCallback } from "react";
import "../NavigationBar.css";
import { navContent } from "../CommonValues";
import Link from "next/link";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SignInModal from "@/components/CommonComponents/SignInModal/SignInModal";

const USER_STORAGE_KEY = "bucketlistt_user";
const PROFILE_STORAGE_KEY = "bucketlistt_profile";

type User = { email: string; role: string };

const PROFILE_MODAL_TRANSITION = { enter: 280, exit: 220 };

const NavigationBar = () => {
    const [placeholder, setPlaceholder] = useState("");
    const [showActivities, setShowActivities] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [signInOpen, setSignInOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [profileFirstName, setProfileFirstName] = useState("");
    const [profileLastName, setProfileLastName] = useState("");
    const [profilePhone, setProfilePhone] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [profileSaving, setProfileSaving] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const readUser = () => {
            try {
                const stored = localStorage.getItem(USER_STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored) as User;
                    if (parsed?.email) setUser(parsed);
                }
            } catch {
                // ignore
            }
        };
        readUser();
        window.addEventListener("bucketlistt_user_updated", readUser);
        return () => window.removeEventListener("bucketlistt_user_updated", readUser);
    }, []);

    const openProfileModal = useCallback(() => {
        setProfileDropdownOpen(false);
        if (user) {
            setProfileEmail(user.email);
            try {
                const profile = localStorage.getItem(PROFILE_STORAGE_KEY);
                if (profile) {
                    const p = JSON.parse(profile) as { firstName?: string; lastName?: string; phone?: string };
                    setProfileFirstName(p.firstName ?? "");
                    setProfileLastName(p.lastName ?? "");
                    setProfilePhone(p.phone ?? "");
                } else {
                    setProfileFirstName("");
                    setProfileLastName("");
                    setProfilePhone("");
                }
            } catch {
                setProfileFirstName("");
                setProfileLastName("");
                setProfilePhone("");
            }
        }
        setProfileModalOpen(true);
    }, [user]);

    const closeProfileModal = useCallback(() => {
        if (profileSaving) return;
        setProfileModalOpen(false);
    }, [profileSaving]);

    const handleUpdateProfile = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        setProfileSaving(true);
        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
                firstName: profileFirstName,
                lastName: profileLastName,
                phone: profilePhone,
            }));
        } catch {
            // ignore
        }
        setTimeout(() => {
            setProfileSaving(false);
            setProfileModalOpen(false);
        }, 1000);
    }, [profileFirstName, profileLastName, profilePhone]);

    const handleLoginSuccess = (u: User) => {
        setUser(u);
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
        } catch {
            // ignore
        }
        setProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        setProfileDropdownOpen(false);
        setIsLoggingOut(true);
        setTimeout(() => {
            setUser(null);
            try {
                localStorage.removeItem(USER_STORAGE_KEY);
            } catch {
                // ignore
            }
            setIsLoggingOut(false);
        }, 1500);
    };

    useEffect(() => {
        if (!profileDropdownOpen) return;
        const onDocClick = (e: MouseEvent) => {
            if (profileDropdownRef.current?.contains(e.target as Node)) return;
            setProfileDropdownOpen(false);
        };
        document.addEventListener("mousedown", onDocClick, true);
        return () => document.removeEventListener("mousedown", onDocClick, true);
    }, [profileDropdownOpen]);

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

    const renderActivityIcon = (activity: { name: string; icon: string }) => {
        if (activity.icon.startsWith("/")) {
            return <img src={activity.icon} alt={`${activity.name} - navigation activity`} className="ActivityIconImg" />;
        }
        return null;
    };

    return (
        <>
            {isLoggingOut && (
                <div className="NavLogoutOverlay" aria-live="polite" aria-busy="true">
                    <div className="NavLogoutLoader">
                        <div className="NavLogoutSpinner" />
                        <span className="NavLogoutText">Logging out...</span>
                    </div>
                </div>
            )}
            <header id="MainHeader" className="StickyHeader">
            <nav id="NavigationBar">
                <div className="MaxWidthComponent MarginAuto NavContainer">
                    {/* Left Section: Logo */}
                    <Link href="/" >
                        <div className="NavLeft">
                            <img src="/Images/BucketlisttLogos/bucketlistt_orange.png" alt="Bucketlistt - Adventure experiences and activities" className="NavLogo" />
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
                        <Link href="/experiences/cart">
                            <button className="CartButton" title="Cart">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1"></circle>
                                    <circle cx="20" cy="21" r="1"></circle>
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                </svg>
                            </button>
                        </Link>
                        {user ? (
                            <div className="NavProfileWrap" ref={profileDropdownRef}>
                                <button
                                    type="button"
                                    className="NavProfileBtn"
                                    onClick={() => setProfileDropdownOpen((prev) => !prev)}
                                    aria-expanded={profileDropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="NavProfileAvatar" aria-hidden>
                                        {user.email.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="NavProfileChevron">▾</span>
                                </button>
                                {profileDropdownOpen && (
                                    <div className="NavProfileDropdown">
                                        <div className="NavProfileUserInfo">
                                            <div className="NavProfileUserLabel">Signed in as</div>
                                            <div className="NavProfileUserEmail">{user.email}</div>
                                            <div className="NavProfileUserRole">{user.role}</div>
                                        </div>
                                        <div className="NavProfileDivider" />
                                        <nav className="NavProfileMenu">
                                            <button type="button" className="NavProfileItem" onClick={openProfileModal}>Profile</button>
                                            <Link href="/bookings" className="NavProfileItem" onClick={() => setProfileDropdownOpen(false)}>Bookings</Link>
                                            <Link href="/wishlist" className="NavProfileItem" onClick={() => setProfileDropdownOpen(false)}>Wishlists</Link>
                                            <Link href="/reviews" className="NavProfileItem" onClick={() => setProfileDropdownOpen(false)}>Reviews</Link>
                                            <Link href="/users" className="NavProfileItem" onClick={() => setProfileDropdownOpen(false)}>Users</Link>
                                            <button type="button" className="NavProfileItem NavProfileItemHighlight" onClick={openProfileModal}>Go To Profile</button>
                                        </nav>
                                        <div className="NavProfileDivider" />
                                        <div className="NavProfileMenu">
                                            <button type="button" className="NavProfileItem NavProfileItemLogout" onClick={handleLogout}>Logout</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="LoginBtn" onClick={() => setSignInOpen(true)}>Login</button>
                        )}
                    </div>
                </div>
            </nav>

            <div id="ActivitiesBar" className={`${showActivities ? "visible" : "hidden"}`}>
                <div className="MaxWidthComponent MarginAuto ActivitiesContainer">
                    {activities.map((activity) => (
                        <div key={activity.name} className="NavActivityItem">
                            <div className="ActivityIconBox">
                                {renderActivityIcon(activity)}
                            </div>
                            <span className="ActivityLabel">{activity.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} onSuccess={handleLoginSuccess} />

            <Modal
                open={profileModalOpen}
                onClose={closeProfileModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        transitionDuration: PROFILE_MODAL_TRANSITION,
                        sx: { backgroundColor: "rgba(0,0,0,0.4)" },
                    },
                }}
                className="NavProfileModalWrap"
                aria-labelledby="NavProfileModalTitle"
            >
                <Fade in={profileModalOpen} timeout={PROFILE_MODAL_TRANSITION}>
                    <div className="NavProfileModal" tabIndex={-1}>
                        {profileSaving && (
                            <div className="NavProfileModalLoader" aria-live="polite">
                                <CircularProgress size={40} sx={{ color: "#fff" }} />
                                <span className="NavProfileModalLoaderText">Saving...</span>
                            </div>
                        )}
                        <div className="NavProfileModalHeader">
                            <h2 id="NavProfileModalTitle" className="NavProfileModalTitle">Update Personal Information</h2>
                            <button type="button" className="NavProfileModalClose" onClick={closeProfileModal} disabled={profileSaving} aria-label="Close">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <form className="NavProfileModalForm" onSubmit={handleUpdateProfile}>
                            <div className="NavProfileModalRow NavProfileModalRowHalf">
                                <div className="NavProfileModalField">
                                    <label htmlFor="nav-profile-first" className="NavProfileModalLabel">First Name</label>
                                    <input id="nav-profile-first" type="text" className="NavProfileModalInput" placeholder="Enter first name" value={profileFirstName} onChange={(e) => setProfileFirstName(e.target.value)} disabled={profileSaving} />
                                </div>
                                <div className="NavProfileModalField">
                                    <label htmlFor="nav-profile-last" className="NavProfileModalLabel">Last Name</label>
                                    <input id="nav-profile-last" type="text" className="NavProfileModalInput" placeholder="Enter last name" value={profileLastName} onChange={(e) => setProfileLastName(e.target.value)} disabled={profileSaving} />
                                </div>
                            </div>
                            <div className="NavProfileModalField">
                                <label htmlFor="nav-profile-phone" className="NavProfileModalLabel">Phone Number</label>
                                <input id="nav-profile-phone" type="tel" className="NavProfileModalInput" placeholder="Enter phone number" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} disabled={profileSaving} />
                            </div>
                            <div className="NavProfileModalField">
                                <label htmlFor="nav-profile-email" className="NavProfileModalLabel">Email</label>
                                <input id="nav-profile-email" type="email" className="NavProfileModalInput" placeholder="Email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} disabled={profileSaving} />
                                <span className="NavProfileModalHelper">Your email will be updated immediately.</span>
                            </div>
                            <div className="NavProfileModalActions">
                                <button type="button" className="NavProfileModalBtn NavProfileModalBtnCancel" onClick={closeProfileModal} disabled={profileSaving}>Cancel</button>
                                <button type="submit" className="NavProfileModalBtn NavProfileModalBtnPrimary" disabled={profileSaving}>Update Profile</button>
                            </div>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </header>
        </>
    );
};

export default NavigationBar;