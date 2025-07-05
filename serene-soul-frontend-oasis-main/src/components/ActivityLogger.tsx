
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Moon, Heart, Zap } from 'lucide-react';

const ActivityLogger = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [moodRating, setMoodRating] = useState(5);
  const [stressRating, setStressRating] = useState(5);
  const [sleepHours, setSleepHours] = useState(8);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activityTypes } = useQuery({
    queryKey: ['activityTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_types')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const logActivityMutation = useMutation({
    mutationFn: async (activityData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type_id: activityData.activityId,
          mood_rating: activityData.mood,
          stress_rating: activityData.stress,
          sleep_hours: activityData.sleep,
          notes: activityData.notes
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Activity Logged!",
        description: "Your wellness activity has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ['progressData'] });
      // Reset form
      setSelectedActivity('');
      setMoodRating(5);
      setStressRating(5);
      setSleepHours(8);
      setNotes('');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) {
      toast({
        title: "Error",
        description: "Please select an activity",
        variant: "destructive"
      });
      return;
    }

    logActivityMutation.mutate({
      activityId: selectedActivity,
      mood: moodRating,
      stress: stressRating,
      sleep: sleepHours,
      notes
    });
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5 text-blue-600" />
          <span>Log Today's Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity
            </label>
            <Select value={selectedActivity} onValueChange={setSelectedActivity}>
              <SelectTrigger>
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes?.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Heart className="w-4 h-4 inline mr-1" />
                Mood (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={moodRating}
                onChange={(e) => setMoodRating(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Zap className="w-4 h-4 inline mr-1" />
                Stress (1-10)
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={stressRating}
                onChange={(e) => setStressRating(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Moon className="w-4 h-4 inline mr-1" />
                Sleep Hours
              </label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling today?"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            disabled={logActivityMutation.isPending}
          >
            {logActivityMutation.isPending ? 'Logging...' : 'Log Activity'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityLogger;
