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
    title: "Driver's License",
    description: "Found a driver's license near the park entrance. Contact if this belongs to you.",
    location: "Central park, NYC",
    timeAgo: "2 hours ago",
    type: "lost",
    category: "Documents",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
  {
    id: "2",
    title: "Golden Retriever - max",
    description: "Friendly golden retriever, 3 years old wearing blue collar with name tag 'Max'.",
    location: "Central park, NYC",
    timeAgo: "2 hours ago",
    type: "lost",
    category: "Pets",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
  {
    id: "3",
    title: "iPhone 16 Pro",
    description: "Golden iPhone 16 pro in a clear case, found on subway platform.",
    location: "Times Square Station",
    timeAgo: "10 hours ago",
    type: "found",
    category: "Electronic",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-10",
  },
  {
    id: "4",
    title: "Black Leather Wallet",
    description: "Black leather wallet with cards inside, found near coffee shop.",
    location: "Brooklyn Bridge",
    timeAgo: "1 day ago",
    type: "found",
    category: "Accessories",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-09",
  },
  {
    id: "5",
    title: "Passport",
    description: "Lost passport on subway. Urgent! Please contact if found.",
    location: "Grand Central Terminal",
    timeAgo: "3 hours ago",
    type: "lost",
    category: "Documents",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
  {
    id: "6",
    title: "AirPods Pro",
    description: "White AirPods Pro case found on park bench.",
    location: "Central park, NYC",
    timeAgo: "5 hours ago",
    type: "found",
    category: "Electronic",
    image: require("../assets/images/splash-icon.png"),
    date: "2025-10-11",
  },
];

export const CATEGORIES = ["Pets", "Electronic", "Documents", "Accessories"];
