const INSTA_REELS_BASE = "https://www.bucketlistt.com/Images/InstaReelsReview";

export const videoReviews = [
    {
        id: 1,
        videoUrl: `${INSTA_REELS_BASE}/1.mp4`,
        thumbnail: "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2e02a172-14fb-4941-bfc4-139a492a706e/1759668537684_1.svg",
        userName: "Aryan Sharma",
        location: "Rishikesh",
    },
    {
        id: 2,
        videoUrl: `${INSTA_REELS_BASE}/2.mp4`,
        thumbnail: "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/f1572973-c789-4c08-b9b4-bc700b67e690/1759768073298_0.svg",
        userName: "Priya Patel",
        location: "Kasauli",
    },
    {
        id: 3,
        videoUrl: `${INSTA_REELS_BASE}/3.mp4`,
        thumbnail: "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/e9573d22-0646-43b8-835e-d6d73fa6180a/1759670665392_1.svg",
        userName: "Rahul Verma",
        location: "Goa",
    },
    {
        id: 4,
        videoUrl: `${INSTA_REELS_BASE}/4.mp4`,
        thumbnail: "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2c0fe969-6f4a-4d2b-acec-e0b1f3618fc9/1759672720528_1.svg",
        userName: "Sneha Kapur",
        location: "Ujjain",
    },
];


export const TestimonialsHeading = "Hear what our customers are saying ❤️";

/** Table columns for AllBookings: Title, Activity, Contact Number, Contact Name, Email, Referred by, Timeslot, Activity Date, No. Of Participants, Notes for guides, Booking Type, Official Price/ Original Price, B2B Price, Commission as per vendor, Website Price, Discount Coupon, Ticket Price (customer cost), Advance paid, Pending amount from customer, Net Commission, (- Net from agent) / to agent, Advance + discount, Booking Created At, Admin Note, Actions */
export interface AllBookingRow {
    id: string;
    title: string;
    activity: string;
    contactNumber: string;
    contactName: string;
    email: string;
    referredBy: string;
    timeslot: string;
    activityDate: string;
    numberOfParticipants: number;
    notesForGuides: string;
    bookingType: string;
    officialPrice: number;
    b2bPrice: number;
    commissionAsPerVendor: number;
    websitePrice: number;
    discountCoupon: string;
    ticketPrice: number;
    advancePaid: number;
    pendingAmount: number;
    netCommission: number;
    netFromAgentToAgent: number;
    advancePlusDiscount: number;
    bookingCreatedAt: string;
    adminNote: string;
}

export const ALL_BOOKINGS: AllBookingRow[] = [
    { id: "1", title: "Rishikesh Bungy", activity: "Bungy Jump", contactNumber: "+91 98765 43210", contactName: "Aryan Sharma", email: "aryan@example.com", referredBy: "Website", timeslot: "10:00 AM", activityDate: "2025-03-15", numberOfParticipants: 2, notesForGuides: "First time", bookingType: "B2C", officialPrice: 4000, b2bPrice: 3200, commissionAsPerVendor: 400, websitePrice: 3600, discountCoupon: "WELCOME10", ticketPrice: 3240, advancePaid: 1500, pendingAmount: 1740, netCommission: 240, netFromAgentToAgent: 0, advancePlusDiscount: 1560, bookingCreatedAt: "2025-02-18T10:30:00", adminNote: "" },
    { id: "2", title: "River Rafting", activity: "Rafting", contactNumber: "+91 91234 56789", contactName: "Priya Patel", email: "priya@example.com", referredBy: "Agent", timeslot: "09:00 AM", activityDate: "2025-03-20", numberOfParticipants: 4, notesForGuides: "Group of 4", bookingType: "B2B", officialPrice: 2800, b2bPrice: 2240, commissionAsPerVendor: 280, websitePrice: 2520, discountCoupon: "", ticketPrice: 2240, advancePaid: 2240, pendingAmount: 0, netCommission: 280, netFromAgentToAgent: -280, advancePlusDiscount: 2240, bookingCreatedAt: "2025-02-17T14:20:00", adminNote: "Agent: Adventure Co" },
    { id: "3", title: "Flying Fox", activity: "Flying Fox", contactNumber: "+91 99887 76655", contactName: "Rahul Verma", email: "rahul@example.com", referredBy: "Website", timeslot: "02:00 PM", activityDate: "2025-03-22", numberOfParticipants: 1, notesForGuides: "", bookingType: "B2C", officialPrice: 2600, b2bPrice: 2080, commissionAsPerVendor: 260, websitePrice: 2340, discountCoupon: "", ticketPrice: 2340, advancePaid: 1000, pendingAmount: 1340, netCommission: 260, netFromAgentToAgent: 0, advancePlusDiscount: 1000, bookingCreatedAt: "2025-02-18T09:15:00", adminNote: "" },
    { id: "4", title: "Valley Rope Jump", activity: "Rope Jump", contactNumber: "+91 98765 11223", contactName: "Sneha Kapur", email: "sneha@example.com", referredBy: "Instagram", timeslot: "11:00 AM", activityDate: "2025-03-18", numberOfParticipants: 2, notesForGuides: "Couple", bookingType: "B2C", officialPrice: 6400, b2bPrice: 5120, commissionAsPerVendor: 640, websitePrice: 5760, discountCoupon: "INSTA15", ticketPrice: 4896, advancePaid: 2500, pendingAmount: 2396, netCommission: 576, netFromAgentToAgent: 0, advancePlusDiscount: 2640, bookingCreatedAt: "2025-02-16T11:00:00", adminNote: "" },
    { id: "5", title: "The OG Bungy", activity: "Bungy Jump", contactNumber: "+91 87654 32109", contactName: "Vikram Singh", email: "vikram@example.com", referredBy: "Agent", timeslot: "03:00 PM", activityDate: "2025-03-25", numberOfParticipants: 3, notesForGuides: "Corporate group", bookingType: "B2B", officialPrice: 3700, b2bPrice: 2960, commissionAsPerVendor: 370, websitePrice: 3330, discountCoupon: "", ticketPrice: 2960, advancePaid: 2960, pendingAmount: 0, netCommission: 370, netFromAgentToAgent: -370, advancePlusDiscount: 2960, bookingCreatedAt: "2025-02-15T16:45:00", adminNote: "Agent: Thrill Hub" },
    { id: "6", title: "Giant Swing", activity: "Giant Swing", contactNumber: "+91 76543 21098", contactName: "Anita Desai", email: "anita@example.com", referredBy: "Website", timeslot: "10:30 AM", activityDate: "2025-03-19", numberOfParticipants: 1, notesForGuides: "Solo traveller", bookingType: "B2C", officialPrice: 2200, b2bPrice: 1760, commissionAsPerVendor: 220, websitePrice: 1980, discountCoupon: "", ticketPrice: 1980, advancePaid: 1980, pendingAmount: 0, netCommission: 220, netFromAgentToAgent: 0, advancePlusDiscount: 1980, bookingCreatedAt: "2025-02-18T08:00:00", adminNote: "" },
    { id: "7", title: "River Rafting", activity: "Rafting", contactNumber: "+91 65432 10987", contactName: "Karan Mehta", email: "karan@example.com", referredBy: "Google", timeslot: "09:00 AM", activityDate: "2025-03-21", numberOfParticipants: 6, notesForGuides: "Family of 6", bookingType: "B2C", officialPrice: 2800, b2bPrice: 2240, commissionAsPerVendor: 280, websitePrice: 2520, discountCoupon: "FAMILY20", ticketPrice: 2016, advancePaid: 3000, pendingAmount: 9096, netCommission: 504, netFromAgentToAgent: 0, advancePlusDiscount: 3600, bookingCreatedAt: "2025-02-17T13:30:00", adminNote: "" },
    { id: "8", title: "Bungy Jump", activity: "Bungy Jump", contactNumber: "+91 54321 09876", contactName: "Divya Nair", email: "divya@example.com", referredBy: "Website", timeslot: "12:00 PM", activityDate: "2025-03-24", numberOfParticipants: 2, notesForGuides: "", bookingType: "B2C", officialPrice: 4000, b2bPrice: 3200, commissionAsPerVendor: 400, websitePrice: 3600, discountCoupon: "", ticketPrice: 3600, advancePaid: 2000, pendingAmount: 5200, netCommission: 400, netFromAgentToAgent: 0, advancePlusDiscount: 2000, bookingCreatedAt: "2025-02-18T12:00:00", adminNote: "" },
    { id: "9", title: "Flying Fox – Solo", activity: "Flying Fox", contactNumber: "+91 43210 98765", contactName: "Arjun Reddy", email: "arjun@example.com", referredBy: "Agent", timeslot: "04:00 PM", activityDate: "2025-03-23", numberOfParticipants: 1, notesForGuides: "Repeat customer", bookingType: "B2B", officialPrice: 2600, b2bPrice: 2080, commissionAsPerVendor: 260, websitePrice: 2340, discountCoupon: "", ticketPrice: 2080, advancePaid: 2080, pendingAmount: 0, netCommission: 260, netFromAgentToAgent: -260, advancePlusDiscount: 2080, bookingCreatedAt: "2025-02-14T10:00:00", adminNote: "Loyalty discount applied" },
    { id: "10", title: "Valley Rope Jump (Couple)", activity: "Rope Jump", contactNumber: "+91 32109 87654", contactName: "Meera Iyer", email: "meera@example.com", referredBy: "Website", timeslot: "11:30 AM", activityDate: "2025-03-16", numberOfParticipants: 2, notesForGuides: "Anniversary", bookingType: "B2C", officialPrice: 6400, b2bPrice: 5120, commissionAsPerVendor: 640, websitePrice: 5760, discountCoupon: "LOVE10", ticketPrice: 5184, advancePaid: 2600, pendingAmount: 2584, netCommission: 576, netFromAgentToAgent: 0, advancePlusDiscount: 2860, bookingCreatedAt: "2025-02-18T07:45:00", adminNote: "" },
    { id: "11", title: "River Rafting", activity: "Rafting", contactNumber: "+91 21098 76543", contactName: "Rohan Bhat", email: "rohan@example.com", referredBy: "Instagram", timeslot: "09:00 AM", activityDate: "2025-03-26", numberOfParticipants: 5, notesForGuides: "Friends group", bookingType: "B2C", officialPrice: 2800, b2bPrice: 2240, commissionAsPerVendor: 280, websitePrice: 2520, discountCoupon: "", ticketPrice: 12600, advancePaid: 6000, pendingAmount: 6600, netCommission: 1400, netFromAgentToAgent: 0, advancePlusDiscount: 6000, bookingCreatedAt: "2025-02-16T15:20:00", adminNote: "" },
    { id: "12", title: "The OG Bungy", activity: "Bungy Jump", contactNumber: "+91 10987 65432", contactName: "Neha Gupta", email: "neha@example.com", referredBy: "Website", timeslot: "02:30 PM", activityDate: "2025-03-27", numberOfParticipants: 1, notesForGuides: "", bookingType: "B2C", officialPrice: 3330, b2bPrice: 2664, commissionAsPerVendor: 333, websitePrice: 2997, discountCoupon: "FIRST15", ticketPrice: 2547, advancePaid: 1500, pendingAmount: 1047, netCommission: 333, netFromAgentToAgent: 0, advancePlusDiscount: 1725, bookingCreatedAt: "2025-02-18T11:10:00", adminNote: "" },
    { id: "13", title: "Giant Swing", activity: "Giant Swing", contactNumber: "+91 99887 66554", contactName: "Suresh Kumar", email: "suresh@example.com", referredBy: "Agent", timeslot: "10:00 AM", activityDate: "2025-03-28", numberOfParticipants: 4, notesForGuides: "Team outing", bookingType: "B2B", officialPrice: 2200, b2bPrice: 1760, commissionAsPerVendor: 220, websitePrice: 1980, discountCoupon: "", ticketPrice: 7040, advancePaid: 7040, pendingAmount: 0, netCommission: 880, netFromAgentToAgent: -880, advancePlusDiscount: 7040, bookingCreatedAt: "2025-02-13T09:00:00", adminNote: "Corporate booking" },
    { id: "14", title: "Flying Fox", activity: "Flying Fox", contactNumber: "+91 88776 55443", contactName: "Pooja Shah", email: "pooja@example.com", referredBy: "Google", timeslot: "03:00 PM", activityDate: "2025-03-29", numberOfParticipants: 2, notesForGuides: "", bookingType: "B2C", officialPrice: 2600, b2bPrice: 2080, commissionAsPerVendor: 260, websitePrice: 2340, discountCoupon: "", ticketPrice: 4680, advancePaid: 2340, pendingAmount: 2340, netCommission: 520, netFromAgentToAgent: 0, advancePlusDiscount: 2340, bookingCreatedAt: "2025-02-17T17:00:00", adminNote: "" },
    { id: "15", title: "Valley Rope Jump", activity: "Rope Jump", contactNumber: "+91 77665 44332", contactName: "Amit Joshi", email: "amit@example.com", referredBy: "Website", timeslot: "11:00 AM", activityDate: "2025-03-30", numberOfParticipants: 2, notesForGuides: "Birthday treat", bookingType: "B2C", officialPrice: 6400, b2bPrice: 5120, commissionAsPerVendor: 640, websitePrice: 5760, discountCoupon: "BDAY20", ticketPrice: 4608, advancePaid: 2300, pendingAmount: 2308, netCommission: 1152, netFromAgentToAgent: 0, advancePlusDiscount: 2760, bookingCreatedAt: "2025-02-18T06:30:00", adminNote: "" },
];