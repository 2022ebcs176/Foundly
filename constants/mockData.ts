// Mock data for items
export interface Item {
  id: string;
  title: string;
  description: string;
  location: string;
  timeAgo: string;
  type: "lost" | "found";
  category: string;
  image: any;
  date: string;
}

export const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    title: "Aadhaar Card",
    description: "Found an Aadhaar card near the temple entrance. Contact if this belongs to you.",
    location: "Lingaraj Temple, Bhubaneswar",
    timeAgo: "2 hours ago",
    type: "lost",
    category: "Documents",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
  {
    id: "2",
    title: "Golden Retriever - Max",
    description: "Friendly golden retriever, 3 years old wearing blue collar with name tag 'Max'.",
    location: "Cubbon Park, Bangalore",
    timeAgo: "2 hours ago",
    type: "lost",
    category: "Pets",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
  {
    id: "3",
    title: "iPhone 16 Pro",
    description: "Golden iPhone 16 pro in a clear case, found on metro platform.",
    location: "Rajiv Chowk Metro, Delhi",
    timeAgo: "10 hours ago",
    type: "found",
    category: "Electronic",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-10",
  },
  {
    id: "4",
    title: "Black Leather Wallet",
    description: "Black leather wallet with cards inside, found near chai shop.",
    location: "Marine Drive, Mumbai",
    timeAgo: "1 day ago",
    type: "found",
    category: "Accessories",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-09",
  },
  {
    id: "5",
    title: "Passport",
    description: "Lost passport on local train. Urgent! Please contact if found.",
    location: "Howrah Station, Kolkata",
    timeAgo: "3 hours ago",
    type: "lost",
    category: "Documents",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
  {
    id: "6",
    title: "AirPods Pro",
    description: "White AirPods Pro case found on park bench near lake.",
    location: "Hussain Sagar Lake, Hyderabad",
    timeAgo: "5 hours ago",
    type: "found",
    category: "Electronic",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
];

export const CATEGORIES = ["Pets", "Electronic", "Documents", "Accessories"];
