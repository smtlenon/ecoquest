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

export type RewardCategory = 'food' | 'voucher' | 'merch';

export interface Reward {
  id: string;
  emoji: string;
  title: string;
  partner: string;
  description: string;
  points: number;
  category: RewardCategory;
  redeemed?: boolean;
}

export type ClaimStatus = 'unclaimed' | 'claimed' | 'expired';

export interface ClaimedReward {
  id: string;
  rewardId: string;
  title: string;
  partner: string;
  pointsSpent: number;
  code: string;
  redeemedAt: string;
  expiresAt: string;
  status: ClaimStatus;
  instructions: string;
}

export interface AppData {
  user: User;
  missions: Mission[];
  feed: FeedItem[];
  leaderboard: User[];
  hotspots: Hotspot[];
  rewards: Reward[];
  claimedRewards: ClaimedReward[];
  dailyBonusClaimedAt?: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'mission-1',
    category: 'energy',
    title: 'Turn Off the Fan',
    description: "Turn off all electric fans in rooms you're not using. Submit a photo of the fan switched off.",
    points: 60,
    completed: false,
    image: 'https://images.unsplash.com/photo-1588001895517-cb4c7fe6b392?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=akshar-dave-Tk_Arhwj4Xk-unsplash.jpg&w=1080',
  },
  {
    id: 'mission-2',
    category: 'waste',
    title: 'Pick It Up',
    description: 'Pick up any trash that missed the bin. Submit a photo of the trash now properly disposed.',
    points: 60,
    completed: false,
    image: 'https://images.unsplash.com/photo-1653406384710-08688ec6b979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'mission-3',
    category: 'water',
    title: 'Fix the Faucet',
    description: "Make sure all faucets are fully closed - no drips. Submit a photo of your dry sink.",
    points: 70,
    completed: false,
    image: 'https://images.unsplash.com/photo-1521207418485-99c705420785?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=imani-vDQ-e3RtaoE-unsplash.jpg&w=1080',
  },
  {
    id: 'mission-4',
    category: 'waste',
    title: 'Segregate Your Trash',
    description: 'Separate your trash into biodegradable and non-biodegradable. Submit a photo of your sorted bins.',
    points: 70,
    completed: false,
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=nareeta-martin-FoG7PKNYjpM-unsplash.jpg&w=1080',
  },
  {
    id: 'mission-5',
    category: 'waste',
    title: 'Plastic Bottle Roundup',
    description: 'Collect all plastic bottles at home and place them in a labeled box or bag for recycling. Submit a photo.',
    points: 80,
    completed: false,
    image: 'https://images.unsplash.com/photo-1653406384710-08688ec6b979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'mission-6',
    category: 'energy',
    title: 'Close the Fridge',
    description: 'Make sure the refrigerator door is fully shut. Submit a photo of your closed fridge.',
    points: 30,
    completed: false,
    image: 'https://images.unsplash.com/photo-1540542688561-a862088d5e0a?ixlib=rb-4.1.0&q=85&fm=jpg&crop=entropy&cs=srgb&dl=uve-sanchez-5LC2CsKBCF0-unsplash.jpg&w=1080',
  },
  {
    id: 'mission-7',
    category: 'waste',
    title: 'Clear the Table',
    description: 'Clean up food mess from the dining table after eating. Submit a photo of your clean table.',
    points: 50,
    completed: false,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'mission-8',
    category: 'water',
    title: 'Wash Your Dishes',
    description: "Don't leave dishes sitting in the sink. Wash them and submit a photo of your clean sink.",
    points: 100,
    completed: false,
    image: 'https://images.pexels.com/photos/9462195/pexels-photo-9462195.jpeg?auto=compress&cs=tinysrgb&w=1080',
  },
  {
    id: 'mission-9',
    category: 'waste',
    title: 'Bedroom Cleanup',
    description: 'Declutter your room - pick up clothes, trash, and wrappers off the floor. Submit a photo.',
    points: 100,
    completed: false,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    id: 'mission-10',
    category: 'energy',
    title: 'Unplug Unused Appliances',
    description: 'Unplug chargers, appliances, or electronics not in use. Submit a photo of the unplugged outlets.',
    points: 70,
    completed: false,
    image: 'https://images.pexels.com/photos/14071432/pexels-photo-14071432.jpeg?auto=compress&cs=tinysrgb&w=1080',
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

export const REWARDS: Reward[] = [
  {
    id: 'reward-1',
    emoji: '🍦',
    title: "McDonald's McFlurry",
    partner: "McDonald's PH",
    description: "One regular McFlurry of your choice at any McDonald's PH branch.",
    points: 250,
    category: 'food',
    redeemed: false,
  },
  {
    id: 'reward-2',
    emoji: '🍝',
    title: 'Jollibee Jolly Spaghetti',
    partner: 'Jollibee',
    description: "A plate of Jollibee's sweet-style spaghetti. Valid at all Jollibee PH branches.",
    points: 280,
    category: 'food',
    redeemed: false,
  },
  {
    id: 'reward-3',
    emoji: '🍗',
    title: 'Jollibee 1-pc Chickenjoy',
    partner: 'Jollibee',
    description: "One piece of Jollibee's iconic Chickenjoy with a side of gravy. Dine-in or take-out.",
    points: 350,
    category: 'food',
    redeemed: false,
  },
  {
    id: 'reward-7',
    emoji: '📚',
    title: 'National Bookstore GC ₱100',
    partner: 'National Bookstore',
    description: 'A ₱100 National Bookstore Gift Certificate. Perfect for eco-notebooks, planners, and supplies.',
    points: 400,
    category: 'voucher',
    redeemed: false,
  },
  {
    id: 'reward-5',
    emoji: '🛍️',
    title: 'SM Gift Pass ₱100',
    partner: 'SM Supermalls',
    description: 'A ₱100 SM Gift Pass usable at any SM Store, SM Supermarket, or SM affiliate tenant.',
    points: 400,
    category: 'voucher',
    redeemed: false,
  },
  {
    id: 'reward-6',
    emoji: '🎫',
    title: 'Robinsons Gift Certificate ₱100',
    partner: 'Robinsons Malls',
    description: 'A ₱100 Robinsons GC valid at Robinsons Malls, Robinsons Supermarket, and more.',
    points: 400,
    category: 'voucher',
    redeemed: false,
  },
  {
    id: 'reward-4',
    emoji: '🧋',
    title: 'Starbucks Bring Your Own Tumbler Drink',
    partner: 'Starbucks PH',
    description: 'Any handcrafted beverage when you bring your own tumbler. Earn green, drink green.',
    points: 420,
    category: 'food',
    redeemed: false,
  },
  {
    id: 'reward-8',
    emoji: '🍔',
    title: "McDonald's Value Meal Voucher",
    partner: "McDonald's PH",
    description: "Any 1-pc Chickenjoy with rice and drink at McDonald's PH. Valid for dine-in or take-out.",
    points: 550,
    category: 'food',
    redeemed: false,
  },
  {
    id: 'reward-9',
    emoji: '🍃',
    title: 'Starbucks Frappuccino',
    partner: 'Starbucks PH',
    description: 'Any grande Frappuccino at participating Starbucks PH branches.',
    points: 700,
    category: 'food',
    redeemed: false,
  },
  {
    id: 'reward-10',
    emoji: '🥤',
    title: 'EcoQuest Reusable Straw Set',
    partner: 'EcoQuest',
    description: 'A set of 4 stainless steel straws with a cleaning brush and EcoQuest pouch. Ditch plastic straws for good.',
    points: 800,
    category: 'merch',
    redeemed: false,
  },
  {
    id: 'reward-11',
    emoji: '📚',
    title: 'National Bookstore GC ₱300',
    partner: 'National Bookstore',
    description: 'A ₱300 NBS GC. Stock up on sustainable school and office supplies.',
    points: 1200,
    category: 'voucher',
    redeemed: false,
  },
  {
    id: 'reward-12',
    emoji: '🛍️',
    title: 'SM Gift Pass ₱300',
    partner: 'SM Supermalls',
    description: "A ₱300 SM Gift Pass. Shop sustainably at SM's eco-partner stores.",
    points: 1200,
    category: 'voucher',
    redeemed: false,
  },
  {
    id: 'reward-13',
    emoji: '👜',
    title: 'EcoQuest Tote Bag',
    partner: 'EcoQuest',
    description: 'An EcoQuest branded canvas tote bag. Say no to plastic - carry your quest with you.',
    points: 1800,
    category: 'merch',
    redeemed: false,
  },
  {
    id: 'reward-14',
    emoji: '🎫',
    title: 'Robinsons Gift Certificate ₱500',
    partner: 'Robinsons Malls',
    description: 'A ₱500 Robinsons GC. Treat yourself after doing good for the planet.',
    points: 2000,
    category: 'voucher',
    redeemed: false,
  },
  {
    id: 'reward-15',
    emoji: '🧃',
    title: 'EcoQuest Bamboo Tumbler',
    partner: 'EcoQuest',
    description: 'A 500ml bamboo-finish tumbler with EcoQuest branding. Keep your drinks cold, keep the planet cooler.',
    points: 3500,
    category: 'merch',
    redeemed: false,
  },
];

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
    rewards: REWARDS,
    claimedRewards: [],
  };
}

