"use client";

import Link from "next/link";
import "./Wishlist.css";

const WISHLIST_ITEMS: unknown[] = []; // Replace with real data when wishlist is implemented

export default function Wishlist() {
    const hasItems = WISHLIST_ITEMS.length > 0;

    return (
        <section className="Wishlist PaddingTop50">
            <div className="MaxWidthComponent MarginAuto WishlistContainer">
                <Link href="/" className="WishlistBackBtn" aria-label="Back to home">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Home</span>
                </Link>
                <h1 className="WishlistHeading">Wishlist</h1>

                {!hasItems && (
                    <div className="WishlistEmptyState" role="status" aria-label="No wishlist items">
                        <div className="WishlistEmptyIcon" aria-hidden>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <h2 className="WishlistEmptyTitle">No favorites yet</h2>
                        <p className="WishlistEmptySubtitle">Start exploring and save experiences you love!</p>
                        <Link href="/all-destination" className="WishlistEmptyCta">
                            Browse Experiences
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}