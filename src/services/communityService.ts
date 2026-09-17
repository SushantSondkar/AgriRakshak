import type { CommunityPost, CommunityReply, CreatePostInput } from '../types/community';

const POSTS_STORAGE_KEY = 'agrirakshak_community_posts_v2';
const REPLIES_STORAGE_KEY = 'agrirakshak_community_replies_v2';

const INITIAL_MOCK_REPLIES: Record<string, CommunityReply[]> = {
  'post-1': [
    {
      id: 'rep-101',
      post_id: 'post-1',
      author_name: 'Dr. Ramesh Sharma',
      author_role: 'Senior Agriculture Officer & Pathologist',
      author_location: 'KVK Nashik',
      is_expert: true,
      is_verified_expert: true,
      content: 'Yellowing of leaves in young onion crops during humid weather is typically a sign of early Stemphylium leaf blight or nitrogen leaching due to irrigation. Ensure drainage and apply a foliar spray of Mancozeb 75% WP @ 2.5g/L.',
      helpful_count: 24,
      is_helpful_by_me: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'rep-102',
      post_id: 'post-1',
      author_name: 'Vishwas Patil',
      author_role: 'Progressive Farmer',
      author_location: 'Lasalgaon',
      is_expert: false,
      content: 'I had the same issue last week. Drenching with trichoderma and reducing afternoon watering helped stop the yellowing.',
      helpful_count: 8,
      is_helpful_by_me: false,
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ],
  'post-2': [
    {
      id: 'rep-201',
      post_id: 'post-2',
      author_name: 'Dr. Sunita Deshmukh',
      author_role: 'Cotton Extension Specialist',
      author_location: 'ICAR-CICR',
      is_expert: true,
      is_verified_expert: true,
      content: 'Due to high relative humidity (>85%), irrigate strictly through alternate furrows in early morning. Stagnant water for over 6 hours will trigger bacterial black arm and root rot.',
      helpful_count: 32,
      is_helpful_by_me: false,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ]
};

const INITIAL_MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author_name: 'Suresh Desai',
    author_role: 'Onion & Vegetable Farmer',
    author_location: 'Pune',
    time_ago: '2 hours ago',
    is_expert: false,
    title: 'Why are my onion leaves turning yellow in early morning dew?',
    content: 'Observing noticeable leaf yellowing and brown tip burn on my 45-day-old Onion crop after recent foggy mornings. Has anyone experienced this in the Pune region? Seeking advice on organic or spray treatments.',
    crop: 'Onion',
    category: 'Pest & Disease',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80',
    helpful_count: 18,
    reply_count: 4,
    views_count: 142,
    is_pinned: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'post-2',
    author_name: 'Dr. Ramesh Sharma',
    author_role: 'Agriculture Specialist & Pathologist',
    author_location: 'KVK Nashik',
    time_ago: '5 hours ago',
    is_expert: true,
    is_verified_expert: true,
    title: 'High Humidity Warning: Managing Cotton & Soybean Fields',
    content: 'Due to the sudden spike in atmospheric humidity (>85%), please ensure cotton and soybean fields are thoroughly drained. Standing water dramatically increases root rot and bacterial blight risk. Avoid field operations when foliage is wet.',
    crop: 'Cotton',
    category: 'Irrigation',
    helpful_count: 54,
    reply_count: 8,
    views_count: 380,
    is_pinned: true,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'post-3',
    author_name: 'Ananda Jadhav',
    author_role: 'Soybean Cultivator',
    author_location: 'Baramati, Pune',
    time_ago: '1 day ago',
    is_expert: false,
    title: 'Soybean leaves showing small brown spot pustules',
    content: 'My soybean crop leaves have tiny reddish-brown spots on the underside. Is this Asian Soybean Rust or Cercospora leaf blight? Uploaded leaf photo for diagnosis.',
    crop: 'Soybean',
    category: 'Pest & Disease',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    helpful_count: 12,
    reply_count: 3,
    views_count: 98,
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'post-4',
    author_name: 'Vikas Kadam',
    author_role: 'Grape Grower',
    author_location: 'Nashik',
    time_ago: '2 days ago',
    is_expert: false,
    title: 'How can I improve soil organic carbon before next sowing season?',
    content: 'Looking for proven green manure recommendations (such as Dhaincha or Sunn hemp) to incorporate into light black soil to build organic carbon before grape pruning.',
    crop: 'Grapes',
    category: 'Soil',
    helpful_count: 22,
    reply_count: 6,
    views_count: 210,
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'post-5',
    author_name: 'Mahesh Gite',
    author_role: 'Trader & Farmer',
    author_location: 'Kopargaon',
    time_ago: '3 days ago',
    is_expert: false,
    title: 'Current Onion Mandi price expectations for next week',
    content: 'Onion arrivals in Lasalgaon and Kopargaon mandis are reaching ₹4,300/Q. What are other farmers observing regarding quality and transport freight costs?',
    crop: 'Onion',
    category: 'Market Prices',
    helpful_count: 31,
    reply_count: 11,
    views_count: 450,
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'post-6',
    author_name: 'Dr. Sunita Deshmukh',
    author_role: 'Extension Officer',
    author_location: 'Pune',
    time_ago: '4 days ago',
    is_expert: true,
    is_verified_expert: true,
    title: 'State Subsidies for Drip Irrigation & Solar Pumps under PM-KUSUM',
    content: 'Maharshtra farmers can now apply for up to 80% subsidy on automation drip kits and solar pumps. Step-by-step application guidance available at your local Panchayat office.',
    crop: 'All',
    category: 'Government Schemes',
    helpful_count: 76,
    reply_count: 14,
    views_count: 820,
    is_pinned: false,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const getStoredPosts = (): CommunityPost[] => {
  try {
    const raw = localStorage.getItem(POSTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_POSTS));
      return INITIAL_MOCK_POSTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load community posts:', err);
    return INITIAL_MOCK_POSTS;
  }
};

export const saveStoredPosts = (posts: CommunityPost[]) => {
  try {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save community posts:', err);
  }
};

export const getStoredReplies = (postId: string): CommunityReply[] => {
  try {
    const raw = localStorage.getItem(REPLIES_STORAGE_KEY);
    const allReplies = raw ? JSON.parse(raw) : INITIAL_MOCK_REPLIES;
    return allReplies[postId] || [];
  } catch (err) {
    console.error('Failed to load replies:', err);
    return INITIAL_MOCK_REPLIES[postId] || [];
  }
};

export const saveStoredReply = (postId: string, reply: CommunityReply) => {
  try {
    const raw = localStorage.getItem(REPLIES_STORAGE_KEY);
    const allReplies = raw ? JSON.parse(raw) : INITIAL_MOCK_REPLIES;
    const postReplies = allReplies[postId] || [];
    allReplies[postId] = [...postReplies, reply];
    localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(allReplies));

    // Update reply count in posts
    const posts = getStoredPosts();
    const target = posts.find(p => p.id === postId);
    if (target) {
      target.reply_count += 1;
      saveStoredPosts(posts);
    }
  } catch (err) {
    console.error('Failed to save reply:', err);
  }
};

export const createNewPost = (input: CreatePostInput): CommunityPost => {
  const newPost: CommunityPost = {
    id: `post-${Date.now()}`,
    author_name: 'Farmer User',
    author_role: 'Farmer',
    author_location: input.location || 'Pune',
    time_ago: 'Just now',
    is_expert: false,
    title: input.title,
    content: input.content,
    crop: input.crop || 'General',
    category: input.category || 'Crops',
    image_url: input.image_url,
    helpful_count: 0,
    reply_count: 0,
    views_count: 1,
    is_pinned: false,
    created_at: new Date().toISOString()
  };

  const posts = getStoredPosts();
  saveStoredPosts([newPost, ...posts]);
  return newPost;
};

export const togglePostHelpful = (postId: string): CommunityPost | null => {
  const posts = getStoredPosts();
  const target = posts.find(p => p.id === postId);
  if (target) {
    if (target.is_helpful_by_me) {
      target.helpful_count = Math.max(0, target.helpful_count - 1);
      target.is_helpful_by_me = false;
    } else {
      target.helpful_count += 1;
      target.is_helpful_by_me = true;
    }
    saveStoredPosts(posts);
    return target;
  }
  return null;
};
