
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Heart, Sparkles, Shield, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import Layout from '../components/Layout';
import FeedbackButton from '../components/FeedbackButton';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Mental Health Assessment',
      description: 'Take our comprehensive quiz to understand your current mental state and get personalized insights.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Heart,
      title: 'Wellness Resources',
      description: 'Access curated content, guided meditations, and expert advice tailored to your needs.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Sparkles,
      title: 'Progress Tracking',
      description: 'Monitor your journey with beautiful charts and celebrate your wellness milestones.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Safe Community',
      description: 'Connect with others on similar journeys in our supportive and moderated community.',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-green-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Find Your{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Mind Peace
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-fade-in">
              Your personal journey to mental wellness starts here. Discover tools, resources, and a supportive community 
              to help you achieve inner peace and emotional balance.
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link
                  to="/assessment"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Continue Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/resources"
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Explore Resources
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Link
                  to="/auth"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <UserPlus className="mr-2 w-5 h-5" />
                  Get Started Free
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <LogIn className="mr-2 w-5 h-5" />
                  Sign In
                </Link>
              </div>
            )}
            
            {!user && (
              <p className="text-sm text-gray-500 mt-4">
                Join thousands on their wellness journey • No credit card required
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Wellness Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and resources designed to support your mental health and well-being
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Users Supported</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Community Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards better mental health. Our assessment takes just 5 minutes 
            and provides personalized insights for your wellness journey.
          </p>
          <Link
            to={user ? "/assessment" : "/auth"}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {user ? "Start Assessment" : "Start Free Assessment"}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Feedback Button */}
      <FeedbackButton />
    </Layout>
  );
};

export default Index;
