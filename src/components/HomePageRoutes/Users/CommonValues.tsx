export interface UserRow {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string; // ISO date
}

function date(daysAgo: number): string {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString();
}

export const ALL_USERS: UserRow[] = [
    { id: "1", name: "Tharun Reddy", email: "tharunreddy341@gmail.com", phoneNumber: "918434227340", role: "CUSTOMER", createdAt: date(1) },
    { id: "2", name: "User Two", email: "2@bucketlistt.temp", phoneNumber: "919876543210", role: "CUSTOMER", createdAt: date(2) },
    { id: "3", name: "User Three", email: "3@bucketlistt.temp", phoneNumber: "-", role: "CUSTOMER", createdAt: date(3) },
    { id: "4", name: "User Four", email: "4@bucketlistt.temp", phoneNumber: "919999988887", role: "CUSTOMER", createdAt: date(4) },
    { id: "5", name: "User Five", email: "5@bucketlistt.temp", phoneNumber: "-", role: "CUSTOMER", createdAt: date(5) },
    { id: "6", name: "User Six", email: "6@bucketlistt.temp", phoneNumber: "918888877776", role: "CUSTOMER", createdAt: date(6) },
    { id: "7", name: "User Seven", email: "7@bucketlistt.temp", phoneNumber: "917777766665", role: "CUSTOMER", createdAt: date(7) },
    { id: "8", name: "User Eight", email: "8@bucketlistt.temp", phoneNumber: "-", role: "CUSTOMER", createdAt: date(8) },
    { id: "9", name: "User Nine", email: "9@bucketlistt.temp", phoneNumber: "916666655554", role: "CUSTOMER", createdAt: date(9) },
    { id: "10", name: "User Ten", email: "10@bucketlistt.temp", phoneNumber: "915555544443", role: "CUSTOMER", createdAt: date(10) },
    { id: "11", name: "User Eleven", email: "11@bucketlistt.temp", phoneNumber: "-", role: "CUSTOMER", createdAt: date(11) },
    { id: "12", name: "User Twelve", email: "12@bucketlistt.temp", phoneNumber: "914444433332", role: "CUSTOMER", createdAt: date(12) },
    { id: "13", name: "User Thirteen", email: "13@bucketlistt.temp", phoneNumber: "913333322221", role: "CUSTOMER", createdAt: date(13) },
    { id: "14", name: "User Fourteen", email: "14@bucketlistt.temp", phoneNumber: "-", role: "CUSTOMER", createdAt: date(14) },
    { id: "15", name: "User Fifteen", email: "15@bucketlistt.temp", phoneNumber: "912222211110", role: "CUSTOMER", createdAt: date(15) },
];
