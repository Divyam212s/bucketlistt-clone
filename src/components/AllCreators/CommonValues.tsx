export type CreatorStatus = "pending" | "selected" | "rejected";

export interface CreatorSubmissionRow {
    id: string;
    name: string;
    instagramProfile: string;
    email: string;
    phone: string;
    dateOfArrival: string;
    deliverableDates: string; // comma-separated for display
    aadharAttachment: string;
    agreementAttachment: string;
    description: string;
    status: CreatorStatus;
    createdAt: string;
}

function date(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
}

function dateStr(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
}

export const ALL_CREATOR_SUBMISSIONS: CreatorSubmissionRow[] = [
    { id: "1", name: "Riya Sharma", instagramProfile: "https://instagram.com/riyasharma", email: "riya@example.com", phone: "919876543210", dateOfArrival: dateStr(1), deliverableDates: "2026-03-01, 2026-03-05, 2026-03-10", aadharAttachment: "aadhar_riya.pdf", agreementAttachment: "agreement_riya.pdf", description: "Travel content creator, focus on North India.", status: "pending", createdAt: date(1) },
    { id: "2", name: "Arjun Mehta", instagramProfile: "https://instagram.com/arjunm", email: "arjun@example.com", phone: "918765432101", dateOfArrival: dateStr(2), deliverableDates: "2026-03-02", aadharAttachment: "aadhar_arjun.pdf", agreementAttachment: "agreement_arjun.pdf", description: "Adventure and trekking reels.", status: "selected", createdAt: date(2) },
    { id: "3", name: "Priya Nair", instagramProfile: "https://instagram.com/priyanair", email: "priya@example.com", phone: "917654321012", dateOfArrival: dateStr(3), deliverableDates: "2026-03-03, 2026-03-08", aadharAttachment: "aadhar_priya.pdf", agreementAttachment: "agreement_priya.pdf", description: "Food and culture vlogs.", status: "rejected", createdAt: date(3) },
    { id: "4", name: "Vikram Singh", instagramProfile: "https://instagram.com/vikrams", email: "vikram@example.com", phone: "916543210123", dateOfArrival: dateStr(4), deliverableDates: "2026-03-04, 2026-03-06, 2026-03-12", aadharAttachment: "aadhar_vikram.pdf", agreementAttachment: "agreement_vikram.pdf", description: "Wildlife and nature photography.", status: "pending", createdAt: date(4) },
    { id: "5", name: "Ananya Reddy", instagramProfile: "https://instagram.com/ananyar", email: "ananya@example.com", phone: "915432101234", dateOfArrival: dateStr(5), deliverableDates: "2026-03-05", aadharAttachment: "aadhar_ananya.pdf", agreementAttachment: "agreement_ananya.pdf", description: "Luxury travel and hotels.", status: "pending", createdAt: date(5) },
    { id: "6", name: "Karan Joshi", instagramProfile: "https://instagram.com/karanj", email: "karan@example.com", phone: "914321012345", dateOfArrival: dateStr(6), deliverableDates: "2026-03-06, 2026-03-09", aadharAttachment: "aadhar_karan.pdf", agreementAttachment: "agreement_karan.pdf", description: "Road trips and biking.", status: "selected", createdAt: date(6) },
    { id: "7", name: "Sneha Patel", instagramProfile: "https://instagram.com/snehap", email: "sneha@example.com", phone: "913210123456", dateOfArrival: dateStr(7), deliverableDates: "2026-03-07", aadharAttachment: "aadhar_sneha.pdf", agreementAttachment: "agreement_sneha.pdf", description: "Beach and water sports.", status: "pending", createdAt: date(7) },
    { id: "8", name: "Rahul Verma", instagramProfile: "https://instagram.com/rahulv", email: "rahul@example.com", phone: "912101234567", dateOfArrival: dateStr(8), deliverableDates: "2026-03-08, 2026-03-11, 2026-03-14", aadharAttachment: "aadhar_rahul.pdf", agreementAttachment: "agreement_rahul.pdf", description: "Budget travel guides.", status: "rejected", createdAt: date(8) },
    { id: "9", name: "Divya Krishnan", instagramProfile: "https://instagram.com/divyak", email: "divya@example.com", phone: "911012345678", dateOfArrival: dateStr(9), deliverableDates: "2026-03-09", aadharAttachment: "aadhar_divya.pdf", agreementAttachment: "agreement_divya.pdf", description: "Yoga and wellness retreats.", status: "pending", createdAt: date(9) },
    { id: "10", name: "Amit Desai", instagramProfile: "https://instagram.com/amitd", email: "amit@example.com", phone: "910123456789", dateOfArrival: dateStr(10), deliverableDates: "2026-03-10, 2026-03-13", aadharAttachment: "aadhar_amit.pdf", agreementAttachment: "agreement_amit.pdf", description: "Heritage and history tours.", status: "selected", createdAt: date(10) },
    { id: "11", name: "Neha Gupta", instagramProfile: "https://instagram.com/nehag", email: "neha@example.com", phone: "919998887776", dateOfArrival: dateStr(11), deliverableDates: "2026-03-11", aadharAttachment: "aadhar_neha.pdf", agreementAttachment: "agreement_neha.pdf", description: "Family travel content.", status: "pending", createdAt: date(11) },
    { id: "12", name: "Suresh Iyer", instagramProfile: "https://instagram.com/sureshi", email: "suresh@example.com", phone: "918887776665", dateOfArrival: dateStr(12), deliverableDates: "2026-03-12, 2026-03-15", aadharAttachment: "aadhar_suresh.pdf", agreementAttachment: "agreement_suresh.pdf", description: "Paragliding and adventure.", status: "pending", createdAt: date(12) },
];
