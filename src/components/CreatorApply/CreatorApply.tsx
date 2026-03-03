"use client";

import { useState, useEffect, useCallback } from "react";
import SignInModal from "@/components/CommonComponents/SignInModal/SignInModal";
import "./CreatorApply.css";

const USER_STORAGE_KEY = "bucketlistt_user";

type User = { email: string; role: string };

export default function CreatorApply() {
    const [user, setUser] = useState<User | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form state (dummy)
    const [name, setName] = useState("");
    const [instagramProfile, setInstagramProfile] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dateOfArrival, setDateOfArrival] = useState("");
    const [deliverableDates, setDeliverableDates] = useState<string[]>([""]);
    const [aadharFile, setAadharFile] = useState<File | null>(null);
    const [agreementFile, setAgreementFile] = useState<File | null>(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        try {
            const stored = localStorage.getItem(USER_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as User;
                if (parsed?.email) {
                    setUser(parsed);
                    setEmail(parsed.email);
                }
            }
        } catch {
            // ignore
        }
    }, [mounted]);

    const handleLoginSuccess = useCallback((u: User) => {
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
        } catch {
            // ignore
        }
        setUser(u);
        setEmail(u.email);
        setShowLoginModal(false);
        window.dispatchEvent(new CustomEvent("bucketlistt_user_updated"));
    }, []);

    const addDeliverableDate = useCallback(() => {
        setDeliverableDates((prev) => [...prev, ""]);
    }, []);

    const removeDeliverableDate = useCallback((index: number) => {
        setDeliverableDates((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const setDeliverableDateAt = useCallback((index: number, value: string) => {
        setDeliverableDates((prev) => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    }, []);

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            // Dummy submit – in real app would send to API
        },
        []
    );

    if (!mounted) {
        return (
            <section className="CreatorApply">
                <div className="CreatorApplyBg" aria-hidden />
                <div className="CreatorApplyOverlay" aria-hidden />
                <div className="MaxWidthComponent MarginAuto CreatorApplyContainer">
                    <div className="CreatorApplyLoading">Loading...</div>
                </div>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="CreatorApply">
                <div className="CreatorApplyBg" aria-hidden />
                <div className="CreatorApplyOverlay" aria-hidden />
                <div className="MaxWidthComponent MarginAuto CreatorApplyContainer">
                    <div className="CreatorApplyGate">
                        <h1 className="CreatorApplyGateTitle">Become a Creator</h1>
                        <p className="CreatorApplyGateText">Please log in to collaborate as a creator and submit your application.</p>
                        <button type="button" className="CreatorApplyGateBtn" onClick={() => setShowLoginModal(true)}>
                            Log in to continue
                        </button>
                    </div>
                </div>
                <SignInModal open={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />
            </section>
        );
    }

    return (
        <section className="CreatorApply">
            <div className="CreatorApplyBg" aria-hidden />
            <div className="CreatorApplyOverlay" aria-hidden />
            <div className="MaxWidthComponent MarginAuto CreatorApplyContainer">
                <header className="CreatorApplyHeader">
                    <h1 className="CreatorApplyTitle">Creator application</h1>
                    <p className="CreatorApplySubtitle">Submit your details to collaborate. All fields can be edited by you or by admin.</p>
                </header>
                <form className="CreatorApplyForm" onSubmit={handleSubmit}>
                    <div className="CreatorApplyRow CreatorApplyRowHalf">
                        <div className="CreatorApplyField">
                            <label htmlFor="creator-name" className="CreatorApplyLabel">Name</label>
                            <input id="creator-name" type="text" className="CreatorApplyInput" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="CreatorApplyField">
                            <label htmlFor="creator-instagram" className="CreatorApplyLabel">Instagram Profile</label>
                            <input id="creator-instagram" type="url" className="CreatorApplyInput" placeholder="https://instagram.com/..." value={instagramProfile} onChange={(e) => setInstagramProfile(e.target.value)} />
                        </div>
                    </div>
                    <div className="CreatorApplyRow CreatorApplyRowHalf">
                        <div className="CreatorApplyField">
                            <label htmlFor="creator-email" className="CreatorApplyLabel">Email</label>
                            <input id="creator-email" type="email" className="CreatorApplyInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="CreatorApplyField">
                            <label htmlFor="creator-phone" className="CreatorApplyLabel">Phone Number</label>
                            <input id="creator-phone" type="tel" className="CreatorApplyInput" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className="CreatorApplyField">
                        <label htmlFor="creator-arrival" className="CreatorApplyLabel">Date of arrival</label>
                        <input id="creator-arrival" type="date" className="CreatorApplyInput" value={dateOfArrival} onChange={(e) => setDateOfArrival(e.target.value)} />
                    </div>
                    <div className="CreatorApplyField">
                        <div className="CreatorApplyLabelRow">
                            <label className="CreatorApplyLabel">Date of deliverables</label>
                            <button type="button" className="CreatorApplyAddBtn" onClick={addDeliverableDate}>
                                + Add date
                            </button>
                        </div>
                        <div className="CreatorApplyDeliverableList">
                            {deliverableDates.map((d, i) => (
                                <div key={i} className="CreatorApplyDeliverableItem">
                                    <input type="date" className="CreatorApplyInput" value={d} onChange={(e) => setDeliverableDateAt(i, e.target.value)} />
                                    {deliverableDates.length > 1 && (
                                        <button type="button" className="CreatorApplyRemoveBtn" onClick={() => removeDeliverableDate(i)} aria-label="Remove date">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="CreatorApplyRow CreatorApplyRowHalf">
                        <div className="CreatorApplyField">
                            <label className="CreatorApplyLabel">Aadhar card</label>
                            <input type="file" className="CreatorApplyFile" accept=".pdf,image/*" onChange={(e) => setAadharFile(e.target.files?.[0] ?? null)} />
                            {aadharFile && <span className="CreatorApplyFileLabel">{aadharFile.name}</span>}
                        </div>
                        <div className="CreatorApplyField">
                            <label className="CreatorApplyLabel">Agreement signed (between both)</label>
                            <input type="file" className="CreatorApplyFile" accept=".pdf,image/*" onChange={(e) => setAgreementFile(e.target.files?.[0] ?? null)} />
                            {agreementFile && <span className="CreatorApplyFileLabel">{agreementFile.name}</span>}
                        </div>
                    </div>
                    <div className="CreatorApplyField">
                        <label htmlFor="creator-desc" className="CreatorApplyLabel">Description</label>
                        <textarea id="creator-desc" className="CreatorApplyTextarea" placeholder="Describe your collaboration or requirements..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="CreatorApplyActions">
                        <button type="submit" className="CreatorApplySubmitBtn">
                            Submit application
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
