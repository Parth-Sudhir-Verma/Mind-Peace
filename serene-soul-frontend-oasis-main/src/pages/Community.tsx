
import React, { useState } from 'react';
import { MessageCircle, Heart, Share2, Plus, Search, Filter, Users } from 'lucide-react';
import Layout from '../components/Layout';

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchTerm, setSearchTerm] = useState('');

  const discussions = [
    {
      id: 1,
      title: 'Daily meditation challenges - who\'s joining?',
      author: 'Sarah M.',
      time: '2 hours ago',
      replies: 23,
      likes: 45,
      category: 'Meditation',
      preview: 'I\'ve been struggling to maintain a consistent meditation practice. Would love to start a daily challenge group...',
      trending: true
    },
    {
      id: 2,
      title: 'How do you deal with work-related stress?',
      author: 'Alex K.',
      time: '4 hours ago',
      replies: 18,
      likes: 32,
      category: 'Stress Management',
      preview: 'My job has been incredibly demanding lately and I\'m looking for practical strategies that have worked for others...',
      trending: false
    },
    {
      id: 3,
      title: 'Celebrating small wins - share yours!',
      author: 'Maria L.',
      time: '6 hours ago',
      replies: 41,
      likes: 89,
      category: 'Motivation',
      preview: 'I finally managed to sleep 8 hours last night without waking up! What small victories are you celebrating today?',
      trending: true
    },
    {
      id: 4,
      title: 'Book recommendations for anxiety management',
      author: 'David R.',
      time: '1 day ago',
      replies: 15,
      likes: 28,
      category: 'Resources',
      preview: 'Looking for some good books that have helped you understand and manage anxiety better...',
      trending: false
    }
  ];

  const supportGroups = [
    {
      id: 1,
      name: 'Mindful Mornings',
      description: 'Start your day with intention and mindfulness',
      members: 234,
      activity: 'Very Active',
      image: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      name: 'Anxiety Support Circle',
      description: 'A safe space to share experiences and coping strategies',
      members: 156,
      activity: 'Active',
      image: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      name: 'Sleep Better Together',
      description: 'Improve sleep quality with community support',
      members: 98,
      activity: 'Moderate',
      image: 'from-purple-400 to-purple-600'
    },
    {
      id: 4,
      name: 'Working Parents Wellness',
      description: 'Balancing family, work, and personal well-being',
      members: 187,
      activity: 'Active',
      image: 'from-pink-400 to-pink-600'
    }
  ];

  const categories = ['All', 'Meditation', 'Stress Management', 'Motivation', 'Resources', 'Sleep', 'Anxiety'];

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mind Peace Community
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with others on their wellness journey, share experiences, and find support
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">2,847</div>
              <div className="text-blue-100">Active Members</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">1,256</div>
              <div className="text-green-100">Discussions Today</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">8,432</div>
              <div className="text-purple-100">Support Given</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'discussions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Discussions
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'groups'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Support Groups
                </button>
              </nav>
            </div>

            {/* Search and Create */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200">
                  <Plus className="w-5 h-5 mr-2" />
                  {activeTab === 'discussions' ? 'New Discussion' : 'Create Group'}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'discussions' && (
                <div>
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Discussions List */}
                  <div className="space-y-4">
                    {discussions.map((discussion) => (
                      <div
                        key={discussion.id}
                        className="p-6 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                              {discussion.title}
                            </h3>
                            {discussion.trending && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                                Trending
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{discussion.time}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {discussion.preview}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>by {discussion.author}</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {discussion.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{discussion.replies}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{discussion.likes}</span>
                            </div>
                            <button className="text-gray-400 hover:text-blue-600">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'groups' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supportGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-6 border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${group.image} flex items-center justify-center mr-4`}>
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {group.members} members • {group.activity}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {group.description}
                      </p>
                      <button className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-all duration-200">
                        Join Group
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
