-- Fix the update_daily_wellness function to properly handle sleep_hours in GROUP BY
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
      COALESCE(LEAST(AVG(sleep_hours) * 4, 32), 0) + 
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