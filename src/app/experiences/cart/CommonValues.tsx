export interface BookingActivityItem {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  originalPrice: number;
  image: string;
}

export const DUMMY_ACTIVITIES: BookingActivityItem[] = [
  {
    id: "1",
    title: "Valley Rope Jump / Cut chord rope (Couple)",
    category: "Adventure",
    location: "Rishikesh",
    price: 6400,
    originalPrice: 6800,
    image: "https://images.unsplash.com/photo-1549221360-456a9c197d5b?w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "The OG Bungy Jump",
    category: "Adventure",
    location: "Rishikesh",
    price: 3330,
    originalPrice: 3700,
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Flying Fox – Solo",
    category: "Adventure",
    location: "Rishikesh",
    price: 2600,
    originalPrice: 2800,
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=400&auto=format&fit=crop",
  },
];

export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export interface ParticipantDetails {
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface PerActivityBooking {
  date: string;
  slot: string;
  /** One participant per activity (name, email, phone). */
  participants: ParticipantDetails[];
  /** Number of tickets for this activity (same participant, multiple tickets). */
  ticketCount: number;
}

export function initialBooking(): PerActivityBooking {
  return { date: "", slot: "", participants: [], ticketCount: 1 };
}

export function formatPriceShort(price: number): string {
  return price >= 1000 ? `₹${(price / 1000).toFixed(1)}K` : `₹${price}`;
}

export function getDiscountPercent(originalPrice: number, price: number): number | null {
  if (originalPrice <= 0 || price >= originalPrice) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function getDatePills(count: number): { value: string; day: string; label: string }[] {
  const pills: { value: string; day: string; label: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = d.toISOString().slice(0, 10);
    pills.push({
      value,
      day: DAYS[d.getDay()],
      label: `${MONTHS[d.getMonth()]} ${d.getDate()}`,
    });
  }
  return pills;
}

export function getMonthGrid(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = first.getDay();
  const grid: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

export function toISODate(year: number, month: number, day: number): string {
  const d = new Date(year, month, day);
  return d.toISOString().slice(0, 10);
}

export function isPastDate(year: number, month: number, day: number): boolean {
  const d = new Date(year, month, day);
  const t = new Date();
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  return d < t;
}
