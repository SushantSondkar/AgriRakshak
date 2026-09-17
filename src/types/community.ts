export type CommunityCategory = 
  | 'All' 
  | 'Crops' 
  | 'Pest & Disease' 
  | 'Irrigation' 
  | 'Soil' 
  | 'Weather' 
  | 'Market Prices' 
  | 'Crop Protection' 
  | 'Government Schemes';

export interface CommunityReply {
  id: string;
  post_id: string;
  author_name: string;
  author_role: string;
  author_location?: string;
  is_expert: boolean;
  is_verified_expert?: boolean;
  content: string;
  image_url?: string;
  helpful_count: number;
  is_helpful_by_me?: boolean;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  author_name: string;
  author_role: string;
  author_location: string;
  time_ago: string;
  is_expert: boolean;
  is_verified_expert?: boolean;
  title: string;
  content: string;
  crop: string;
  category: CommunityCategory;
  image_url?: string;
  helpful_count: number;
  reply_count: number;
  views_count: number;
  is_pinned?: boolean;
  is_helpful_by_me?: boolean;
  created_at: string;
  replies?: CommunityReply[];
}

export interface CreatePostInput {
  title: string;
  crop: string;
  category: CommunityCategory;
  content: string;
  image_url?: string;
  location: string;
  language?: string;
}
