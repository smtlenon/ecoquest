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
  icon: string;
  description: string;
  unlockedAt?: string;
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

export interface Hotspot {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  status: string;
}

export interface RewardItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  category: string;
  description: string;
}

export interface AppData {
  user: User;
  missions: Mission[];
  feed: FeedItem[];
  leaderboard: User[];
  hotspots: Hotspot[];
  rewards: RewardItem[];
  dailyBonusClaimedAt?: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'plastic-bottles',
    title: 'Plastic Bottle Segregation',
    description: 'Collect and segregate 5 plastic bottles for recycling.',
    points: 60,
    category: 'waste',
    completed: false,
    image: 'https://images.unsplash.com/photo-1653406384710-08688ec6b979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'lights-off',
    title: 'Lights Off Hour',
    description: 'Turn off non-essential lights and unplug unused chargers for 1 hour.',
    points: 80,
    category: 'energy',
    completed: false,
    image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'reusable-cup',
    title: 'Bring a Reusable Cup',
    description: 'Use your own reusable cup for any drink order today.',
    points: 70,
    category: 'waste',
    completed: false,
    image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'compost-waste',
    title: 'Compost Kitchen Waste',
    description: 'Separate biodegradable waste and set up a simple compost bin.',
    points: 120,
    category: 'nature',
    completed: false,
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'public-transit',
    title: 'Take Public Transit',
    description: 'Choose public transport, walking, or biking for your main trip today.',
    points: 140,
    category: 'community',
    completed: false,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'water-save',
    title: 'Save 10 Liters of Water',
    description: 'Reduce water use by shortening showers or reusing rinse water.',
    points: 90,
    category: 'water',
    completed: false,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export const FRESH_USER: User = {
  id: 'drei',
  name: 'Drei',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Drei',
  points: 0,
  streak: 0,
  level: 1,
  badges: [],
  school: '',
  bio: '',
};

export const HERO_USER: User = {
  id: 'drei',
  name: 'Drei',
  avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=Drei',
  points: 1240,
  streak: 7,
  level: 4,
  badges: [],
  school: '',
  bio: '',
};

export const HERO_MISSIONS: Mission[] = MISSIONS.map((mission, i) => ({
  ...mission,
  completed: i < 5,
}));

export function createInitialAppData(): AppData {
  return {
    user: FRESH_USER,
    missions: MISSIONS,
    feed: [],
    leaderboard: [FRESH_USER],
    hotspots: [
      { id: 1, name: 'La Mesa Ecopark', lat: 14.711, lng: 121.076, type: 'Park', status: 'Open' },
      { id: 2, name: 'Masungi Georeserve', lat: 14.604, lng: 121.328, type: 'Reserve', status: 'Protected' },
      { id: 3, name: 'Las Piñas-Parañaque Wetland', lat: 14.496, lng: 120.983, type: 'Wetland', status: 'Cleanup Needed' },
      { id: 4, name: 'Arroceros Forest Park', lat: 14.594, lng: 120.982, type: 'Forest', status: 'Event Today' },
    ],
    rewards: [
      {
        id: 'r1',
        name: 'Bamboo Utensil Set',
        cost: 500,
        category: 'Eco Gear',
        description: 'Reusable spoon, fork, and knife made from sustainable bamboo.',
        image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=400&auto=format&fit=crop&q=60',
      },
      {
        id: 'r2',
        name: 'Metal Straw Kit',
        cost: 300,
        category: 'Eco Gear',
        description: 'Stainless steel straw with cleaner and pouch.',
        image: 'https://images.unsplash.com/photo-1572559092429-c70e3a6a978d?w=400&auto=format&fit=crop&q=60',
      },
      {
        id: 'r3',
        name: 'P100 GCash Load',
        cost: 1000,
        category: 'Voucher',
        description: 'Electronic load for any network.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400&auto=format&fit=crop&q=60',
      },
      {
        id: 'r4',
        name: 'Cinema Ticket',
        cost: 1500,
        category: 'Entertainment',
        description: 'One movie pass at participating SM Cinemas.',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=60',
      },
      {
        id: 'r5',
        name: 'Organic Soap Bar',
        cost: 400,
        category: 'Lifestyle',
        description: 'Handmade organic soap with natural ingredients.',
        image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&auto=format&fit=crop&q=60',
      },
    ],
  };
}
