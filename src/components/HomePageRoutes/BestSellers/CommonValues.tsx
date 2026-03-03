/** Vendor names and their activity types – for display/filtering */
export const VENDORS = {
    "Himalaya Bungee": "Bungee jumping",
    "River and Rocks": "River rafting",
    "Why No Fly": "Paragliding",
    "Zipliner": "Zip lining",
    "Jumping Heights": "Bungee, Flying Fox",
    "Thrill Factory": "Bungee (different types)",
} as const;

export const bestSellerActivities = [
    {
        id: 1,
        images: [
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2e02a172-14fb-4941-bfc4-139a492a706e/1759668537684_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/f1572973-c789-4c08-b9b4-bc700b67e690/1759768073298_0.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/e9573d22-0646-43b8-835e-d6d73fa6180a/1759670665392_1.svg"
        ],
        category: "Adventure",
        title: "Jumpin Heights – OG Bungy (83 M)",
        rating: 4.8,
        reviews: 237,
        originalPrice: 3700,
        price: 3330,
        discount: "10% off",
        location: "Rishikesh",
        vendor: "Jumping Heights",
    },
    {
        id: 2,
        images: [
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/f1572973-c789-4c08-b9b4-bc700b67e690/1759768073298_0.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2e02a172-14fb-4941-bfc4-139a492a706e/1759668537684_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2c0fe969-6f4a-4d2b-acec-e0b1f3618fc9/1759672720528_1.svg"
        ],
        category: "Adventure",
        title: "Himalayan Bungy – India’s Highest Bungy",
        rating: 4.5,
        reviews: 114,
        originalPrice: 4000,
        price: 3600,
        discount: "10% off",
        location: "Rishikesh",
        vendor: "Himalaya Bungee",
    },
    {
        id: 3,
        images: [
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/e9573d22-0646-43b8-835e-d6d73fa6180a/1759670665392_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2c0fe969-6f4a-4d2b-acec-e0b1f3618fc9/1759672720528_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2e02a172-14fb-4941-bfc4-139a492a706e/1759668537684_1.svg"
        ],
        category: "Adventure",
        title: "Splash Bungee – Bungee and Water Swing",
        rating: 4.8,
        reviews: 293,
        originalPrice: 4000,
        price: 3600,
        discount: "10% off",
        location: "Goa",
        vendor: "Himalaya Bungee",
    },
    {
        id: 4,
        images: [
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2c0fe969-6f4a-4d2b-acec-e0b1f3618fc9/1759672720528_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2e02a172-14fb-4941-bfc4-139a492a706e/1759668537684_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/f1572973-c789-4c08-b9b4-bc700b67e690/1759768073298_0.svg"
        ],
        category: "Adventure",
        title: "Thrill Factory – Bungee and Adventure Park",
        rating: 4.2,
        reviews: 196,
        originalPrice: 1500,
        price: 1350,
        discount: "10% off",
        location: "Mandvi",
        vendor: "Thrill Factory",
    },
    {
        id: 5,
        images: [
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2c0fe969-6f4a-4d2b-acec-e0b1f3618fc9/1759672720528_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/2e02a172-14fb-4941-bfc4-139a492a706e/1759668537684_1.svg",
            "https://uaptkggmrsxoqayjjnlz.supabase.co/storage/v1/object/public/experience-images/f1572973-c789-4c08-b9b4-bc700b67e690/1759768073298_0.svg"
        ],
        category: "Adventure",
        title: "Thrill Factory – Bungee and Adventure Park",
        rating: 4.2,
        reviews: 196,
        originalPrice: 1500,
        price: 1350,
        discount: "10% off",
        location: "Mandvi",
        vendor: "Thrill Factory",
    },
];
