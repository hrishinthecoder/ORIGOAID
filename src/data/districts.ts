export type District = {
  name: string;
  division: Division;
  lat: number;
  lng: number;
};

export type Division =
  | "Dhaka"
  | "Chattogram"
  | "Khulna"
  | "Rajshahi"
  | "Rangpur"
  | "Barishal"
  | "Sylhet"
  | "Mymensingh";

export const DIVISION_COLORS: Record<Division, string> = {
  Dhaka: "#2563eb",
  Chattogram: "#0ea5e9",
  Khulna: "#06b6d4",
  Rajshahi: "#3b82f6",
  Rangpur: "#1d4ed8",
  Barishal: "#22d3ee",
  Sylhet: "#0284c7",
  Mymensingh: "#60a5fa",
};

export const DISTRICTS: District[] = [
  // Dhaka (13)
  { name: "Dhaka", division: "Dhaka", lat: 23.81, lng: 90.41 },
  { name: "Faridpur", division: "Dhaka", lat: 23.61, lng: 89.84 },
  { name: "Gazipur", division: "Dhaka", lat: 23.99, lng: 90.42 },
  { name: "Gopalganj", division: "Dhaka", lat: 23.01, lng: 89.83 },
  { name: "Kishoreganj", division: "Dhaka", lat: 24.44, lng: 90.78 },
  { name: "Madaripur", division: "Dhaka", lat: 23.16, lng: 90.19 },
  { name: "Manikganj", division: "Dhaka", lat: 23.86, lng: 90.0 },
  { name: "Munshiganj", division: "Dhaka", lat: 23.54, lng: 90.53 },
  { name: "Narayanganj", division: "Dhaka", lat: 23.62, lng: 90.5 },
  { name: "Narsingdi", division: "Dhaka", lat: 23.93, lng: 90.72 },
  { name: "Rajbari", division: "Dhaka", lat: 23.76, lng: 89.64 },
  { name: "Shariatpur", division: "Dhaka", lat: 23.2, lng: 90.34 },
  { name: "Tangail", division: "Dhaka", lat: 24.25, lng: 89.92 },
  // Chattogram (11)
  { name: "Chattogram", division: "Chattogram", lat: 22.36, lng: 91.78 },
  { name: "Cox's Bazar", division: "Chattogram", lat: 21.43, lng: 92.01 },
  { name: "Bandarban", division: "Chattogram", lat: 22.19, lng: 92.22 },
  { name: "Brahmanbaria", division: "Chattogram", lat: 23.96, lng: 91.11 },
  { name: "Chandpur", division: "Chattogram", lat: 23.23, lng: 90.66 },
  { name: "Cumilla", division: "Chattogram", lat: 23.46, lng: 91.18 },
  { name: "Feni", division: "Chattogram", lat: 23.02, lng: 91.4 },
  { name: "Khagrachhari", division: "Chattogram", lat: 23.1, lng: 91.99 },
  { name: "Lakshmipur", division: "Chattogram", lat: 22.94, lng: 90.83 },
  { name: "Noakhali", division: "Chattogram", lat: 22.83, lng: 91.1 },
  { name: "Rangamati", division: "Chattogram", lat: 22.65, lng: 92.18 },
  // Khulna (10)
  { name: "Khulna", division: "Khulna", lat: 22.84, lng: 89.54 },
  { name: "Bagerhat", division: "Khulna", lat: 22.66, lng: 89.78 },
  { name: "Chuadanga", division: "Khulna", lat: 23.64, lng: 88.84 },
  { name: "Jashore", division: "Khulna", lat: 23.17, lng: 89.2 },
  { name: "Jhenaidah", division: "Khulna", lat: 23.54, lng: 89.18 },
  { name: "Kushtia", division: "Khulna", lat: 23.9, lng: 89.12 },
  { name: "Magura", division: "Khulna", lat: 23.49, lng: 89.42 },
  { name: "Meherpur", division: "Khulna", lat: 23.76, lng: 88.63 },
  { name: "Narail", division: "Khulna", lat: 23.17, lng: 89.49 },
  { name: "Satkhira", division: "Khulna", lat: 22.71, lng: 89.07 },
  // Rajshahi (8)
  { name: "Rajshahi", division: "Rajshahi", lat: 24.37, lng: 88.6 },
  { name: "Bogura", division: "Rajshahi", lat: 24.85, lng: 89.37 },
  { name: "Joypurhat", division: "Rajshahi", lat: 25.1, lng: 89.02 },
  { name: "Naogaon", division: "Rajshahi", lat: 24.81, lng: 88.94 },
  { name: "Natore", division: "Rajshahi", lat: 24.41, lng: 89.0 },
  { name: "Chapainawabganj", division: "Rajshahi", lat: 24.59, lng: 88.27 },
  { name: "Pabna", division: "Rajshahi", lat: 24.0, lng: 89.23 },
  { name: "Sirajganj", division: "Rajshahi", lat: 24.45, lng: 89.71 },
  // Rangpur (8)
  { name: "Rangpur", division: "Rangpur", lat: 25.74, lng: 89.27 },
  { name: "Dinajpur", division: "Rangpur", lat: 25.63, lng: 88.64 },
  { name: "Gaibandha", division: "Rangpur", lat: 25.33, lng: 89.54 },
  { name: "Kurigram", division: "Rangpur", lat: 25.81, lng: 89.64 },
  { name: "Lalmonirhat", division: "Rangpur", lat: 25.92, lng: 89.45 },
  { name: "Nilphamari", division: "Rangpur", lat: 25.93, lng: 88.86 },
  { name: "Panchagarh", division: "Rangpur", lat: 26.34, lng: 88.55 },
  { name: "Thakurgaon", division: "Rangpur", lat: 26.04, lng: 88.46 },
  // Barishal (6)
  { name: "Barishal", division: "Barishal", lat: 22.7, lng: 90.37 },
  { name: "Barguna", division: "Barishal", lat: 22.16, lng: 90.12 },
  { name: "Bhola", division: "Barishal", lat: 22.68, lng: 90.65 },
  { name: "Jhalokati", division: "Barishal", lat: 22.64, lng: 90.2 },
  { name: "Patuakhali", division: "Barishal", lat: 22.36, lng: 90.33 },
  { name: "Pirojpur", division: "Barishal", lat: 22.58, lng: 89.97 },
  // Sylhet (4)
  { name: "Sylhet", division: "Sylhet", lat: 24.89, lng: 91.87 },
  { name: "Habiganj", division: "Sylhet", lat: 24.38, lng: 91.42 },
  { name: "Moulvibazar", division: "Sylhet", lat: 24.48, lng: 91.78 },
  { name: "Sunamganj", division: "Sylhet", lat: 25.07, lng: 91.4 },
  // Mymensingh (4)
  { name: "Mymensingh", division: "Mymensingh", lat: 24.75, lng: 90.4 },
  { name: "Jamalpur", division: "Mymensingh", lat: 24.94, lng: 89.94 },
  { name: "Netrokona", division: "Mymensingh", lat: 24.87, lng: 90.73 },
  { name: "Sherpur", division: "Mymensingh", lat: 25.02, lng: 90.02 },
];
