
import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Target, Calendar, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import ActivityLogger from '../components/ActivityLogger';
import { useProgressData } from '../hooks/useProgressData';
import { format, parseISO } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MonthlyAverages {
  [month: string]: {
    total: number;
    count: number;
  };
}

const Progress = () => {
  const { data: progressData, isLoading, error } = useProgressData();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your progress...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Alert className="mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please sign in to view your progress data.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </Layout>
    );
  }

  // Process weekly data for the chart - moved outside useMemo to prevent infinite renders
  const getWeeklyChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => {
      const dayData = progressData?.weeklyData?.find(d => {
        try {
          return format(parseISO(d.date), 'EEE') === day;
        } catch {
          return false;
        }
      });
      
      return {
        day,
        mood: dayData?.mood_avg || 0,
        stress: dayData?.stress_avg || 0,
        sleep: dayData?.sleep_hours || 0
      };
    });
  };

  // Process monthly data for the chart
  const getMonthlyChartData = () => {
    if (!progressData?.monthlyData?.length) return [];
    
    const monthlyAverages: MonthlyAverages = {};
    
    progressData.monthlyData.forEach(day => {
      try {
        const month = format(parseISO(day.date), 'MMM');
        if (!monthlyAverages[month]) {
          monthlyAverages[month] = { total: 0, count: 0 };
        }
        monthlyAverages[month].total += Number(day.wellness_score) || 0;
        monthlyAverages[month].count += 1;
      } catch (error) {
        console.log('Date parsing error:', error);
      }
    });

    return Object.entries(monthlyAverages).map(([month, data]) => ({
      month,
      wellnessScore: Math.round(data.total / data.count) || 0
    }));
  };

  // Process activities data
  const getActivitiesChartData = () => {
    if (!progressData?.activitiesData?.length) return [];
    
    const activityCounts: { [key: string]: number } = {};
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    progressData.activitiesData.forEach(activity => {
      const name = activity.activity_types?.name || 'Unknown';
      activityCounts[name] = (activityCounts[name] || 0) + 1;
    });

    const total = Object.values(activityCounts).reduce((sum: number, count: number) => sum + count, 0);
    
    if (total === 0) return [];
    
    return Object.entries(activityCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      count,
      color: colors[index % colors.length]
    }));
  };

  // Calculate streak
  const getCurrentStreak = () => {
    if (!progressData?.streakData?.length) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (const day of progressData.streakData) {
      try {
        const dayDate = parseISO(day.date);
        const diffDays = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
          streak++;
        } else {
          break;
        }
      } catch (error) {
        console.log('Streak calculation error:', error);
        break;
      }
    }
    
    return streak;
  };

  const weeklyChartData = getWeeklyChartData();
  const monthlyChartData = getMonthlyChartData();
  const activitiesChartData = getActivitiesChartData();
  const currentStreak = getCurrentStreak();
  
  const totalActivities = progressData?.activitiesData?.length || 0;
  const currentWellnessScore = progressData?.currentWellnessScore || 0;

  // Achievements with safer calculations
  const achievements = [
    {
      title: '7-Day Streak',
      description: 'Maintained wellness activities for 7 consecutive days',
      icon: Award,
      color: 'from-yellow-400 to-yellow-500',
      earned: currentStreak >= 7
    },
    {
      title: 'Wellness Champion',
      description: 'Achieved 80%+ wellness score',
      icon: Target,
      color: 'from-green-400 to-green-500',
      earned: currentWellnessScore >= 80
    },
    {
      title: 'Activity Explorer',
      description: 'Completed 20 wellness activities',
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-500',
      earned: totalActivities >= 20
    },
    {
      title: 'Consistent Tracker',
      description: 'Regular activity logging',
      icon: Calendar,
      color: 'from-blue-400 to-blue-500',
      earned: totalActivities >= 10
    }
  ];

  const earnedAchievements = achievements.filter(a => a.earned).length;

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Progress Journey
            </h1>
            <p className="text-xl text-gray-600">
              Track your wellness journey and celebrate your achievements
            </p>
          </div>

          {/* Activity Logger */}
          <div className="mb-12">
            <ActivityLogger />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{currentWellnessScore}%</div>
              <div className="text-blue-100">Current Wellness Score</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{currentStreak}</div>
              <div className="text-green-100">Day Streak</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{totalActivities}</div>
              <div className="text-purple-100">Activities Completed</div>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">{earnedAchievements}</div>
              <div className="text-yellow-100">Achievements Earned</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Weekly Mood Tracking */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Mood & Stress</h3>
              {weeklyChartData.some(d => d.mood > 0 || d.stress > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                      name="Mood"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stress" 
                      stroke="#EF4444" 
                      strokeWidth={3}
                      dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                      name="Stress"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">No data yet</p>
                    <p className="text-sm">Log your first activity to see your progress!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Monthly Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Wellness Score</h3>
              {monthlyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="wellnessScore" 
                      stroke="#10B981" 
                      fill="url(#colorGradient)"
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">No monthly data yet</p>
                    <p className="text-sm">Keep logging activities to track your monthly progress!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Activities Breakdown */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Activity Breakdown</h3>
              {activitiesChartData.length > 0 ? (
                <>
                  <div className="flex justify-center">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={activitiesChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {activitiesChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} activities`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {activitiesChartData.map((activity) => (
                      <div key={activity.name} className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: activity.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{activity.name}</span>
                        <span className="text-sm font-semibold text-gray-900">({activity.count})</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p className="mb-2">No activities logged yet</p>
                    <p className="text-sm">Start logging activities to see your breakdown!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        achievement.earned 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.color} flex items-center justify-center ${
                          !achievement.earned && 'grayscale opacity-50'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            achievement.earned ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${
                            achievement.earned ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                        {achievement.earned && (
                          <div className="text-green-600 font-semibold text-sm">
                            Earned!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
