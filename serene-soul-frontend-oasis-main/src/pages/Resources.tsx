
import React, { useState } from 'react';
import { Book, Play, Headphones, Download, Search, Filter } from 'lucide-react';
import Layout from '../components/Layout';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Resources' },
    { id: 'meditation', name: 'Meditation' },
    { id: 'articles', name: 'Articles' },
    { id: 'videos', name: 'Videos' },
    { id: 'audio', name: 'Audio' },
  ];

  const resources = [
    {
      id: 1,
      title: 'Introduction to Mindfulness Meditation',
      description: 'Learn the basics of mindfulness meditation with this comprehensive guide for beginners.',
      type: 'meditation',
      icon: Headphones,
      duration: '10 min',
      color: 'from-blue-500 to-blue-600',
      featured: true
    },
    {
      id: 2,
      title: 'Managing Anxiety in Daily Life',
      description: 'Practical strategies and techniques to help you cope with anxiety and stress.',
      type: 'articles',
      icon: Book,
      duration: '5 min read',
      color: 'from-green-500 to-green-600',
      featured: true
    },
    {
      id: 3,
      title: 'Deep Breathing Exercises',
      description: 'Guided breathing exercises to help you relax and center yourself.',
      type: 'videos',
      icon: Play,
      duration: '8 min',
      color: 'from-purple-500 to-purple-600',
      featured: false
    },
    {
      id: 4,
      title: 'Sleep Meditation for Better Rest',
      description: 'Soothing meditation to help you fall asleep peacefully and wake up refreshed.',
      type: 'audio',
      icon: Headphones,
      duration: '20 min',
      color: 'from-indigo-500 to-indigo-600',
      featured: true
    },
    {
      id: 5,
      title: 'Building Emotional Resilience',
      description: 'Learn how to bounce back from setbacks and build emotional strength.',
      type: 'articles',
      icon: Book,
      duration: '7 min read',
      color: 'from-teal-500 to-teal-600',
      featured: false
    },
    {
      id: 6,
      title: 'Progressive Muscle Relaxation',
      description: 'Step-by-step guide to releasing physical tension and stress.',
      type: 'videos',
      icon: Play,
      duration: '15 min',
      color: 'from-pink-500 to-pink-600',
      featured: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.type === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(resource => resource.featured);

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Wellness Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover curated content to support your mental health and well-being journey
            </p>
          </div>

          {/* Featured Resources */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  >
                    <div className={`h-2 bg-gradient-to-r ${resource.color}`}></div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${resource.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-gray-500">{resource.duration}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      <button className="w-full py-3 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium rounded-lg transition-all duration-200">
                        Access Resource
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* All Resources */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              All Resources ({filteredResources.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <div
                    key={resource.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${resource.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-500">{resource.duration}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full">
                          {resource.type}
                        </span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                          Access
                          <Download className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
