import { LucideIcon, Leaf, Droplets, Trash2, ShoppingBag, MapPin, Award, Zap, Users } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
  badges: Badge[];
  school?: string;
  bio?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  description: string;
  unlockedAt?: Date;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  points: number;
  category: 'waste' | 'water' | 'energy' | 'nature' | 'community';
  completed: boolean;
  image: string;
}

export interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  timestamp: string;
  image?: string;
  location?: string;
  likes: number;
}

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Miguel Santos',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
  points: 1250,
  level: 5,
  streak: 12,
  school: 'Rizal High School',
  bio: 'Nature lover & Eco-warrior 🌱',
  badges: [
    { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'Completed a mission before 8AM', unlockedAt: new Date() },
    { id: 'b2', name: 'Recycler', icon: '♻️', description: 'Recycled 5kg of plastic', unlockedAt: new Date() },
  ]
};

export const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Plastic Bottle Segregation',
    description: 'Collect and segregate 5 plastic bottles for recycling.',
    points: 50,
    category: 'waste',
    completed: false,
    image: 'https://images.unsplash.com/photo-1653406384710-08688ec6b979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwcmVjeWNsaW5nJTIwYmlufGVufDF8fHx8MTc3MTIyMDk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'm2',
    title: 'Plant a Seedling',
    description: 'Plant a tree or a small plant in your garden or community.',
    points: 100,
    category: 'nature',
    completed: false,
    image: 'https://images.unsplash.com/photo-1721457616561-701d25702874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxpcGlubyUyMHN0dWRlbnRzJTIwcGxhbnRpbmclMjB0cmVlc3xlbnwxfHx8fDE3NzEyMjA5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'm3',
    title: 'Use a Reusable Bag',
    description: 'Avoid single-use plastic bags when shopping today.',
    points: 30,
    category: 'waste',
    completed: true,
    image: 'https://images.unsplash.com/photo-1607011753273-5a3cc90fca78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHJldXNhYmxlJTIwYmFnfGVufDF8fHx8MTc3MTIyMDk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'm4',
    title: 'Coastal Cleanup',
    description: 'Join a local beach or river cleanup drive.',
    points: 200,
    category: 'community',
    completed: false,
    image: 'https://images.unsplash.com/photo-1559551410-1457ef2a5c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGJlYWNoJTIwcGhpbGlwcGluZXN8ZW58MXx8fHwxNzcxMjIwOTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export const LEADERBOARD: User[] = [
  { ...CURRENT_USER, id: 'u1', points: 1250, streak: 12 },
  {
    id: 'u2',
    name: 'Sofia Reyes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    points: 1420,
    level: 6,
    streak: 15,
    badges: [],
    school: 'Ateneo de Manila'
  },
  {
    id: 'u3',
    name: 'Juan Dela Cruz',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60',
    points: 1100,
    level: 4,
    streak: 5,
    badges: [],
    school: 'UP Diliman'
  },
  {
    id: 'u4',
    name: 'Maria Clara',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60',
    points: 980,
    level: 4,
    streak: 8,
    badges: [],
    school: 'UST'
  },
  {
    id: 'u5',
    name: 'Pedro Penduko',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60',
    points: 850,
    level: 3,
    streak: 2,
    badges: [],
    school: 'DLSU'
  }
];

export const FEED_ITEMS: FeedItem[] = [
  {
    id: 'f1',
    userId: 'u2',
    userName: 'Sofia Reyes',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    action: 'planted a tree',
    timestamp: '2h ago',
    image: 'https://images.unsplash.com/photo-1763856957026-a74ab4f05891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudGluZyUyMHRyZWUlMjBzZWVkbGluZyUyMHNwcm91dCUyMGhhbmRzJTIwc29pbHxlbnwxfHx8fDE3NzEyMjIyMjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'La Mesa Ecopark',
    likes: 24
  },
  {
    id: 'f2',
    userId: 'u3',
    userName: 'Juan Dela Cruz',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&auto=format&fit=crop&q=60',
    action: 'cleaned up the beach',
    timestamp: '5h ago',
    image: 'https://images.unsplash.com/photo-1758599669016-acedd3942ca2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGNsZWFudXAlMjB2b2x1bnRlZXIlMjBjb2xsZWN0aW5nJTIwcGxhc3RpYyUyMHdhc3RlfGVufDF8fHx8MTc3MTIyMjIyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    location: 'Manila Bay',
    likes: 45
  }
];

export const HOTSPOTS = [
  { id: 1, name: "La Mesa Ecopark", lat: 14.711, lng: 121.076, type: "Park", status: "Open" },
  { id: 2, name: "Masungi Georeserve", lat: 14.604, lng: 121.328, type: "Reserve", status: "Protected" },
  { id: 3, name: "Las Piñas-Parañaque Wetland", lat: 14.496, lng: 120.983, type: "Wetland", status: "Cleanup Needed" },
  { id: 4, name: "Arroceros Forest Park", lat: 14.594, lng: 120.982, type: "Forest", status: "Event Today" },
];
