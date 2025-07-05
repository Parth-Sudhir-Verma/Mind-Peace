
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

export const useProgressData = () => {
  const fetchProgressData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch last 7 days of wellness data
    const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');
    
    const { data: weeklyData, error: weeklyError } = await supabase
      .from('daily_wellness')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', weekStart)
      .lte('date', weekEnd)
      .order('date');

    if (weeklyError) throw weeklyError;

    // Fetch last 6 months of wellness data
    const sixMonthsAgo = format(subDays(new Date(), 180), 'yyyy-MM-dd');
    const { data: monthlyData, error: monthlyError } = await supabase
      .from('daily_wellness')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', sixMonthsAgo)
      .order('date');

    if (monthlyError) throw monthlyError;

    // Fetch activity breakdown
    const { data: activitiesData, error: activitiesError } = await supabase
      .from('user_activities')
      .select(`
        activity_type_id,
        activity_types(name, category)
      `)
      .eq('user_id', user.id)
      .gte('completed_at', sixMonthsAgo);

    if (activitiesError) throw activitiesError;

    // Calculate current stats
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data: todayData } = await supabase
      .from('daily_wellness')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    const { data: streakData } = await supabase
      .from('daily_wellness')
      .select('date')
      .eq('user_id', user.id)
      .gte('wellness_score', 70)
      .order('date', { ascending: false });

    return {
      weeklyData: weeklyData || [],
      monthlyData: monthlyData || [],
      activitiesData: activitiesData || [],
      currentWellnessScore: todayData?.wellness_score || 0,
      streakData: streakData || []
    };
  };

  return useQuery({
    queryKey: ['progressData'],
    queryFn: fetchProgressData,
  });
};
