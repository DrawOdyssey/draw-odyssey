-- ============================================
-- DRAW ODYSSEY - Supabase Database Setup
-- ============================================
-- Copy and paste this entire file into your
-- Supabase Dashboard → SQL Editor → New Query
-- Then click "Run" to create all tables.
-- ============================================

-- 1. User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  credits_balance INTEGER DEFAULT 20, -- Free credits on signup!
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits_balance)
  VALUES (NEW.id, NEW.email, 20);
  
  -- Log the free credits as a bonus transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 20, 'bonus', 'Welcome bonus: 20 free credits');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Credit transactions log
CREATE TABLE public.credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- positive = added, negative = used
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'refund', 'bonus')),
  description TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);


-- 3. AI generation jobs
CREATE TABLE public.generation_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  prompt TEXT NOT NULL,
  model TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result_url TEXT,
  credits_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jobs"
  ON public.generation_jobs FOR SELECT
  USING (auth.uid() = user_id);


-- 4. Media library
CREATE TABLE public.media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own media"
  ON public.media_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own media"
  ON public.media_items FOR DELETE
  USING (auth.uid() = user_id);


-- 5. Video editor projects
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Project',
  timeline_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);


-- 6. Video exports
CREATE TABLE public.exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  output_url TEXT,
  format TEXT DEFAULT 'mp4',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exports"
  ON public.exports FOR SELECT
  USING (auth.uid() = user_id);


-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_credit_transactions_user ON public.credit_transactions (user_id, created_at DESC);
CREATE INDEX idx_generation_jobs_user ON public.generation_jobs (user_id, created_at DESC);
CREATE INDEX idx_media_items_user ON public.media_items (user_id, created_at DESC);
CREATE INDEX idx_media_items_type ON public.media_items (user_id, type);
CREATE INDEX idx_projects_user ON public.projects (user_id, updated_at DESC);


-- ============================================
-- PHASE 2: LoRA Models, Gallery, API Keys
-- ============================================

-- 7. LoRA trained models
CREATE TABLE public.lora_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_word TEXT NOT NULL,
  trainer TEXT NOT NULL DEFAULT 'flux-lora',
  status TEXT DEFAULT 'training' CHECK (status IN ('training', 'ready', 'failed')),
  steps INTEGER DEFAULT 1000,
  image_count INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  model_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lora_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own LoRA models"
  ON public.lora_models FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_lora_models_user ON public.lora_models (user_id, created_at DESC);


-- 8. Gallery likes
CREATE TABLE public.gallery_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  media_item_id UUID REFERENCES public.media_items ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, media_item_id)
);

ALTER TABLE public.gallery_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own likes"
  ON public.gallery_likes FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX idx_gallery_likes_media ON public.gallery_likes (media_item_id);


-- 9. API keys
CREATE TABLE public.api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  name TEXT DEFAULT 'Default',
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own API keys"
  ON public.api_keys FOR ALL
  USING (auth.uid() = user_id);


-- 10. User subscriptions
CREATE TABLE public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'standard', 'premium', 'pro')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);


-- Add shared flag and view/like counts to media_items
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.media_items ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Allow public media to be viewed by anyone
CREATE POLICY "Anyone can view public media"
  ON public.media_items FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Update free credits from 20 to 50 to match new pricing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits_balance)
  VALUES (NEW.id, NEW.email, 50);
  
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 50, 'bonus', 'Welcome bonus: 50 free credits');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- Done! Your database is ready.
-- New users get 50 free credits on signup.
-- ============================================