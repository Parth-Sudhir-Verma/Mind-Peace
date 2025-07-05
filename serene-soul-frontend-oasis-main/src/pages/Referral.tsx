
import React, { useState } from 'react';
import { Send, Copy, Check, Gift, Users, Star } from 'lucide-react';
import Layout from '../components/Layout';

const Referral = () => {
  const [formData, setFormData] = useState({
    friendName: '',
    friendEmail: '',
    personalMessage: '',
    referrerName: '',
    referrerEmail: ''
  });
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const referralLink = "https://mindpeace.com/join/abc123";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle form submission logic here
    console.log('Referral sent:', formData);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const benefits = [
    {
      icon: Gift,
      title: 'Get Rewarded',
      description: 'Earn premium features for every successful referral',
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      icon: Users,
      title: 'Help Others',
      description: 'Share the gift of mental wellness with people you care about',
      color: 'from-blue-400 to-blue-500'
    },
    {
      icon: Star,
      title: 'Build Community',
      description: 'Grow our supportive community and make a difference',
      color: 'from-purple-400 to-purple-500'
    }
  ];

  if (submitted) {
    return (
      <Layout>
        <div className="min-h-screen py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Referral Sent Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your invitation has been sent to {formData.friendName}. 
                We'll notify you when they join Mind Peace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200"
                >
                  Send Another Referral
                </button>
                <button
                  onClick={() => window.location.href = '/community'}
                  className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200"
                >
                  Visit Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Share Mind Peace with Friends
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help your friends discover their path to mental wellness and earn rewards together
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Quick Share */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Share</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Referral Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">Share on social media:</p>
                <div className="flex space-x-4">
                  <button className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 py-3 bg-blue-400 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 py-3 bg-blue-800 text-white font-medium rounded-lg hover:bg-blue-900 transition-colors">
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>

            {/* Personal Referral Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Personal Invitation</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="referrerName"
                      value={formData.referrerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="referrerEmail"
                      value={formData.referrerEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Friend's Name
                    </label>
                    <input
                      type="text"
                      name="friendName"
                      value={formData.friendName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Friend's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Friend's Email
                    </label>
                    <input
                      type="email"
                      name="friendEmail"
                      value={formData.friendEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="friend@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    name="personalMessage"
                    value={formData.personalMessage}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a personal touch to your invitation..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Invitation</span>
                </button>
              </form>
            </div>
          </div>

          {/* Referral Stats */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Your Referral Impact</h2>
              <p className="text-blue-100">See how you're helping others find their peace of mind</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-blue-100">Friends Invited</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">8</div>
                <div className="text-blue-100">Successfully Joined</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">3</div>
                <div className="text-blue-100">Premium Rewards Earned</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">156</div>
                <div className="text-blue-100">Wellness Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Referral;
