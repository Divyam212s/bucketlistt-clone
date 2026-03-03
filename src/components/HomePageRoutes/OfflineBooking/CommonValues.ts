/** Dummy data for Create Offline Booking form */

export interface OfflineActivityOption {
  id: string;
  label: string;
  image?: string;
  basePricePerPerson?: number;
  variants?: { id: string; label: string }[];
}

/** One activity in a multi-activity offline booking */
export interface SingleActivityBooking {
  activityId: string;
  variantId: string;
  date: string;
  slot: string;
  fullName: string;
  phone: string;
  email: string;
  participants: number;
  amountPerPerson: number;
  advanceAmount: number;
  noteForGuide: string;
}

export const DUMMY_ACTIVITY_IMAGE = "https://images.unsplash.com/photo-1549221360-456a9c197d5b?w=400&auto=format&fit=crop";

export function defaultSingleActivityBooking(): SingleActivityBooking {
  return {
    activityId: "",
    variantId: "",
    date: "",
    slot: "",
    fullName: "",
    phone: "",
    email: "",
    participants: 1,
    amountPerPerson: 0,
    advanceAmount: 0,
    noteForGuide: "",
  };
}

export const OFFLINE_ACTIVITIES: OfflineActivityOption[] = [
  {
    id: "bike-rent-rishikesh",
    label: "Bike on Rent in Rishikesh",
    image: DUMMY_ACTIVITY_IMAGE,
    basePricePerPerson: 800,
    variants: [
      { id: "activa", label: "Activa or similar 2 wheeler" },
      { id: "bullet", label: "Royal Enfield or similar" },
      { id: "scooty", label: "Scooty Pep or similar" },
    ],
  },
  {
    id: "bungy-jump",
    label: "Bungy Jump",
    image: DUMMY_ACTIVITY_IMAGE,
    basePricePerPerson: 1500,
    variants: [
      { id: "og", label: "The OG Bungy" },
      { id: "valley", label: "Valley Bungy" },
    ],
  },
  {
    id: "rafting",
    label: "Rafting",
    image: DUMMY_ACTIVITY_IMAGE,
    basePricePerPerson: 1200,
    variants: [
      { id: "standard", label: "Standard Rafting" },
      { id: "long", label: "Long Rafting" },
    ],
  },
  {
    id: "flying-fox",
    label: "Flying Fox",
    variants: [{ id: "solo", label: "Flying Fox – Solo" }],
  },
  {
    id: "giant-swing",
    label: "Giant Swing",
    variants: [{ id: "standard", label: "Giant Swing" }],
  },
  {
    id: "rope-jump",
    label: "Rope Jump",
    variants: [{ id: "valley", label: "Valley Rope Jump" }],
  },
];

export const OFFLINE_TIMESLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "4:00 PM",
];
