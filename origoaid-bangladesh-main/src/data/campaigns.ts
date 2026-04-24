export type CampaignCategory =
  | "Education"
  | "Healthcare"
  | "Community"
  | "Emergency"
  | "Startup"
  | "Agriculture"
  | "Environment"
  | "Technology"
  | "Sports"
  | "Arts"
  | "Charity"
  | "Religious";

export type CampaignStatus = "active" | "completed" | "draft" | "under_review";

export type ProfileType = "Individual" | "Organization" | "Group";

export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  body: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorName: string;
  amount: number;
  method: "bkash" | "nagad" | "upay" | "rocket" | "card" | "bank" | "international";
  message?: string;
  anonymous?: boolean;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  gallery?: string[];
  raised: number;
  goal: number;
  daysLeft: number;
  category: CampaignCategory;
  organizer?: string;
  organizerType?: ProfileType;
  organizerVerified?: boolean;
  location?: string;
  backers?: number;
  status?: CampaignStatus;
  createdAt?: string;
  updates?: CampaignUpdate[];
  tags?: string[];
  featured?: boolean;
}

export const campaignsData: Campaign[] = [
  {
    id: "clean-water-sylhet",
    title: "Clean Water for Sylhet Villages",
    description:
      "Providing safe drinking water to 500 families in remote areas of Sylhet through tube well installations.",
    longDescription:
      "Access to clean drinking water remains one of the most pressing challenges for rural communities in Sylhet. This campaign aims to install 50 deep tube wells across 10 villages, providing safe and reliable water to over 500 families. Each tube well serves approximately 10 families and is built to last 15+ years with minimal maintenance. Our team of local engineers and community volunteers will oversee installation and provide training on water safety and hygiene practices.",
    image: "https://images.unsplash.com/photo-1594398901394-4e34939a02eb?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=800&h=600&fit=crop",
    ],
    raised: 285000,
    goal: 500000,
    daysLeft: 18,
    category: "Community",
    organizer: "Sylhet Water Foundation",
    organizerType: "Organization",
    organizerVerified: true,
    location: "Sylhet Division",
    backers: 342,
    status: "active",
    featured: true,
    tags: ["water", "rural", "infrastructure"],
    updates: [
      {
        id: "u1",
        date: "2025-12-10",
        title: "First 10 tube wells installed!",
        body: "Thanks to your generosity, we completed the first 10 installations in Jaintapur. 100 families now have safe drinking water.",
      },
    ],
  },
  {
    id: "girls-education-rangpur",
    title: "Girls' Education Fund - Rangpur",
    description:
      "Supporting 200 girls in Rangpur with scholarships, books, and school supplies for a full academic year.",
    longDescription:
      "Education is the most powerful tool for change. In Rangpur, many talented girls are forced to drop out due to financial constraints. This fund provides full scholarships covering tuition, textbooks, uniforms, and school supplies for 200 deserving students. We also offer after-school tutoring and mentorship programs to ensure academic success. Every donation directly impacts a young girl's future and her community.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=800&fit=crop",
    raised: 420000,
    goal: 600000,
    daysLeft: 25,
    category: "Education",
    organizer: "Rangpur Education Trust",
    organizerType: "Organization",
    organizerVerified: true,
    location: "Rangpur Division",
    backers: 587,
    status: "active",
    featured: true,
    tags: ["education", "girls", "scholarship"],
  },
  {
    id: "mobile-health-clinic",
    title: "Mobile Health Clinic - Char Areas",
    description: "A floating medical clinic bringing healthcare to flood-prone char communities in the Brahmaputra.",
    longDescription:
      "Char communities along the Brahmaputra river are among the most isolated in Bangladesh. With no roads and limited access to medical facilities, residents often go without basic healthcare. Our mobile floating clinic will travel between char islands providing primary care, vaccinations, maternal health services, and emergency treatment.",
    image: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=1200&h=800&fit=crop",
    raised: 780000,
    goal: 1200000,
    daysLeft: 32,
    category: "Healthcare",
    organizer: "River Health Initiative",
    organizerType: "Organization",
    organizerVerified: true,
    location: "Kurigram District",
    backers: 1024,
    status: "active",
    featured: true,
    tags: ["healthcare", "mobile", "maternal"],
  },
  {
    id: "tech-skills-dhaka",
    title: "Tech Skills for Youth - Dhaka",
    description: "Free coding bootcamp for 100 underprivileged youth in Dhaka to build careers in technology.",
    longDescription:
      "Bangladesh's tech sector is booming, but access to quality training remains unequal. This bootcamp provides 100 young people from low-income backgrounds with 6 months of intensive training in web development, mobile apps, and data science.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800&fit=crop",
    raised: 150000,
    goal: 350000,
    daysLeft: 40,
    category: "Technology",
    organizer: "Code for Bangladesh",
    organizerType: "Organization",
    organizerVerified: true,
    location: "Dhaka",
    backers: 198,
    status: "active",
    tags: ["tech", "youth", "coding"],
  },
  {
    id: "flood-relief-north",
    title: "Flood Relief - Northern Bangladesh",
    description: "Emergency relief and rehabilitation for families affected by monsoon floods in northern districts.",
    longDescription:
      "The monsoon season has devastated northern Bangladesh, displacing thousands of families. This emergency fund provides immediate relief including food packages, clean water, temporary shelter, and medical supplies. Phase two focuses on rebuilding homes, restoring livelihoods, and providing psychological support.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=800&fit=crop",
    raised: 950000,
    goal: 1000000,
    daysLeft: 5,
    category: "Emergency",
    organizer: "Bangladesh Relief Network",
    organizerType: "Organization",
    organizerVerified: true,
    location: "Northern Districts",
    backers: 2150,
    status: "active",
    featured: true,
    tags: ["flood", "relief", "urgent"],
  },
  {
    id: "organic-farming-khulna",
    title: "Organic Farming Co-op - Khulna",
    description: "Establishing an organic farming cooperative for 50 small farmers in the Khulna region.",
    longDescription:
      "Small farmers in Khulna face mounting challenges from climate change and rising input costs. This cooperative will unite 50 farmers to practice organic farming, share resources, and access premium markets.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&h=800&fit=crop",
    raised: 88000,
    goal: 400000,
    daysLeft: 45,
    category: "Agriculture",
    organizer: "Green Khulna Initiative",
    organizerType: "Group",
    location: "Khulna Division",
    backers: 112,
    status: "active",
    tags: ["farming", "organic", "cooperative"],
  },
  {
    id: "robotics-imo-paris",
    title: "Team Bangladesh to International Robotics Olympiad",
    description: "Sending 5 students to represent Bangladesh at the World Robot Olympiad finals in Paris.",
    longDescription:
      "Our team of 5 brilliant students from Notre Dame College and BUET won the national robotics championship and qualified for the World Robot Olympiad finals in Paris. We need support for flights, accommodation, equipment shipping, and competition fees. Your contribution helps Bangladesh shine on the world stage.",
    image: "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=1200&h=800&fit=crop",
    raised: 220000,
    goal: 800000,
    daysLeft: 20,
    category: "Technology",
    organizer: "BD Robotics Alliance",
    organizerType: "Group",
    organizerVerified: true,
    location: "Dhaka → Paris",
    backers: 165,
    status: "active",
    featured: true,
    tags: ["robotics", "olympiad", "international"],
  },
  {
    id: "eid-clothes-orphanage",
    title: "Eid Clothing Drive for Orphanages",
    description: "New Eid outfits and festive meals for 300 children across 8 orphanages in Dhaka & Chittagong.",
    longDescription:
      "Every Eid, orphaned children deserve to feel the joy of new clothes and special meals. This drive covers 8 orphanages and brings 300 children the Eid they deserve — complete with new Punjabis, dresses, and a proper Eid feast.",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1200&h=800&fit=crop",
    raised: 165000,
    goal: 300000,
    daysLeft: 12,
    category: "Charity",
    organizer: "Anisur Rahman",
    organizerType: "Individual",
    organizerVerified: true,
    location: "Dhaka & Chittagong",
    backers: 412,
    status: "active",
    tags: ["eid", "children", "orphanage"],
  },
  {
    id: "cricket-academy-barisal",
    title: "Barisal Girls' Cricket Academy",
    description: "Launching Bangladesh's first free cricket academy for girls aged 10-16 in Barisal.",
    longDescription:
      "Inspired by the rise of Bangladeshi women's cricket, we're starting an academy that trains 40 girls every year at no cost. Funds cover coaching staff, kit, a rented training ground, and transport stipends.",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&h=800&fit=crop",
    raised: 72000,
    goal: 500000,
    daysLeft: 50,
    category: "Sports",
    organizer: "Barisal Sports Trust",
    organizerType: "Organization",
    location: "Barisal",
    backers: 88,
    status: "active",
    tags: ["cricket", "girls", "sports"],
  },
];
