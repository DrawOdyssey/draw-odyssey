export interface User {
  id: string;
  email: string;
  credits_balance: number;
  created_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "purchase" | "usage" | "refund" | "bonus";
  description: string;
  stripe_session_id?: string;
  created_at: string;
}

export interface GenerationJob {
  id: string;
  user_id: string;
  type: "image" | "video";
  prompt: string;
  model: string;
  status: "pending" | "processing" | "completed" | "failed";
  result_url?: string;
  credits_used: number;
  created_at: string;
}

export interface MediaItem {
  id: string;
  user_id: string;
  type: "image" | "video";
  url: string;
  thumbnail_url?: string;
  prompt?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  timeline_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceDisplay: string;
  perCredit: string;
  popular: boolean;
}
