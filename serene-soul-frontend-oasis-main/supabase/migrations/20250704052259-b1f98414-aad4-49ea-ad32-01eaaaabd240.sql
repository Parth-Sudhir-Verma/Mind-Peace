
-- Create a table to track different types of activities
CREATE TABLE public.activity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a table to track user activities
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type_id UUID REFERENCES public.activity_types(id) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  stress_rating INTEGER CHECK (stress_rating >= 1 AND stress_rating <= 10),
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a table to track daily wellness scores
CREATE TABLE public.daily_wellness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  wellness_score INTEGER CHECK (wellness_score >= 0 AND wellness_score <= 100),
  mood_avg DECIMAL(3,1),
  stress_avg DECIMAL(3,1),
  sleep_hours DECIMAL(3,1),
  activities_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.activity_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_wellness ENABLE ROW LEVEL SECURITY;

-- RLS policies for activity_types (readable by all authenticated users)
CREATE POLICY "Anyone can view activity types" ON public.activity_types FOR SELECT TO authenticated USING (true);

-- RLS policies for user_activities
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON public.user_activities FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for daily_wellness
CREATE POLICY "Users can view own wellness data" ON public.daily_wellness FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wellness data" ON public.daily_wellness FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wellness data" ON public.daily_wellness FOR UPDATE USING (auth.uid() = user_id);

-- Insert default activity types
INSERT INTO public.activity_types (name, category) VALUES
('Meditation', 'mindfulness'),
('Exercise', 'physical'),
('Reading', 'learning'),
('Journaling', 'reflection'),
('Deep Breathing', 'mindfulness'),
('Yoga', 'physical'),
('Gratitude Practice', 'reflection'),
('Nature Walk', 'physical'),
('Therapy Session', 'professional'),
('Support Group', 'social');

-- Function to calculate and update daily wellness score
CREATE OR REPLACE FUNCTION public.update_daily_wellness()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.daily_wellness (user_id, date, wellness_score, mood_avg, stress_avg, sleep_hours, activities_completed)
  SELECT 
    NEW.user_id,
    DATE(NEW.completed_at),
    LEAST(100, GREATEST(0, 
      COALESCE(AVG(mood_rating) * 8, 0) + 
      COALESCE((10 - AVG(stress_rating)) * 6, 0) + 
      COALESCE(LEAST(sleep_hours * 4, 32), 0) + 
      COUNT(*) * 2
    ))::INTEGER,
    AVG(mood_rating),
    AVG(stress_rating),
    AVG(sleep_hours),
    COUNT(*)
  FROM public.user_activities
  WHERE user_id = NEW.user_id 
    AND DATE(completed_at) = DATE(NEW.completed_at)
  GROUP BY user_id
  ON CONFLICT (user_id, date) 
  DO UPDATE SET
    wellness_score = EXCLUDED.wellness_score,
    mood_avg = EXCLUDED.mood_avg,
    stress_avg = EXCLUDED.stress_avg,
    sleep_hours = EXCLUDED.sleep_hours,
    activities_completed = EXCLUDED.activities_completed,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update daily wellness when activities are added
CREATE TRIGGER update_wellness_on_activity
  AFTER INSERT OR UPDATE ON public.user_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_wellness();
