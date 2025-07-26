import React, { useState } from 'react';
import { Star, Clock, DollarSign, Plus, Filter, BookOpen, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import type { Skill, BookingRequest } from '../../types';

const SkillsMarketplace: React.FC = () => {
  const { user } = useAuth();
  const { skills, addSkill, bookingRequests, addBookingRequest, updateBookingStatus } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-skills' | 'bookings'>('browse');
  const [newSkill, setNewSkill] = useState({
    title: '',
    description: '',
    category: 'programming' as Skill['category'],
    level: 'intermediate' as Skill['level'],
    hourlyRate: 500,
    availableSlots: ['']
  });
  const [bookingData, setBookingData] = useState({
    requestedSlot: '',
    message: ''
  });

  const categories = [
    { value: 'all', label: 'All Skills' },
    { value: 'programming', label: 'Programming' },
    { value: 'design', label: 'Design' },
    { value: 'languages', label: 'Languages' },
    { value: 'academic', label: 'Academic' },
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800'
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skills.filter(skill => skill.isOffered)
    : skills.filter(skill => skill.category === selectedCategory && skill.isOffered);

  const mySkills = skills.filter(skill => skill.teacherId === user?.id);
  const myBookings = bookingRequests.filter(booking => 
    booking.studentId === user?.id || booking.teacherId === user?.id
  );

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addSkill({
      ...newSkill,
      isOffered: true,
      teacherId: user.id,
      teacherName: user.name,
      teacherContact: user.email,
      availableSlots: newSkill.availableSlots.filter(slot => slot.trim() !== '')
    });

    setNewSkill({
      title: '',
      description: '',
      category: 'programming',
      level: 'intermediate',
      hourlyRate: 500,
      availableSlots: ['']
    });
    setShowAddForm(false);
  };

  const handleBookingRequest = (e: React.FormEvent, skillId: string) => {
    e.preventDefault();
    if (!user) return;

    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    addBookingRequest({
      skillId,
      teacherId: skill.teacherId,
      studentId: user.id,
      studentName: user.name,
      ...bookingData,
      status: 'pending'
    });

    setBookingData({ requestedSlot: '', message: '' });
    setShowBookingForm(null);
  };

  const addSlot = () => {
    setNewSkill(prev => ({
      ...prev,
      availableSlots: [...prev.availableSlots, '']
    }));
  };

  const updateSlot = (index: number, value: string) => {
    setNewSkill(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.map((slot, i) => i === index ? value : slot)
    }));
  };

  const removeSlot = (index: number) => {
    setNewSkill(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skill Exchange Marketplace</h1>
          <p className="text-gray-600 mt-1">Learn from peers and share your expertise</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Offer Skill</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'browse', label: 'Browse Skills', icon: BookOpen },
            { id: 'my-skills', label: 'My Skills', icon: User },
            { id: 'bookings', label: 'Bookings', icon: MessageCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Skill Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Offer Your Skill</h2>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Title</label>
              <input
                type="text"
                required
                value={newSkill.title}
                onChange={(e) => setNewSkill(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="e.g., React.js Development, Guitar Lessons"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={newSkill.description}
                onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Describe what you'll teach and your experience"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value as Skill['category'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="languages">Languages</option>
                  <option value="academic">Academic</option>
                  <option value="music">Music</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value as Skill['level'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={newSkill.hourlyRate}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Time Slots</label>
              {newSkill.availableSlots.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={slot}
                    onChange={(e) => updateSlot(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Monday 6-8 PM, Weekends 2-4 PM"
                  />
                  {newSkill.availableSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSlot}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Another Slot
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Offer Skill
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Browse Skills Tab */}
      {activeTab === 'browse' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColors[skill.level]}`}>
                        {skill.level.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">₹{skill.hourlyRate}</div>
                    <div className="text-xs text-gray-500">per hour</div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{skill.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{skill.teacherName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{skill.availableSlots.length} time slots available</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowBookingForm(skill.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Request Session
                  </button>
                </div>

                {/* Booking Form Modal */}
                {showBookingForm === skill.id && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Request Session</h3>
                      <form onSubmit={(e) => handleBookingRequest(e, skill.id)}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
                            <select
                              required
                              value={bookingData.requestedSlot}
                              onChange={(e) => setBookingData(prev => ({ ...prev, requestedSlot: e.target.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                              <option value="">Choose a time slot</option>
                              {skill.availableSlots.map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                              required
                              rows={3}
                              value={bookingData.message}
                              onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Tell the teacher about your learning goals"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                          <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Send Request
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowBookingForm(null)}
                            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* My Skills Tab */}
      {activeTab === 'my-skills' && (
        <div className="space-y-4">
          {mySkills.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="text-gray-400 mb-4">
                <BookOpen className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills offered yet</h3>
              <p className="text-gray-600">Start sharing your expertise with fellow students!</p>
            </div>
          ) : (
            mySkills.map(skill => (
              <div key={skill.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.title}</h3>
                    <p className="text-gray-600 mb-4">{skill.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${levelColors[skill.level]}`}>
                        {skill.level.toUpperCase()}
                      </span>
                      <span>₹{skill.hourlyRate}/hour</span>
                      <span>{skill.availableSlots.length} slots</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      Edit
                    </button>
                    <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600">Your booking requests and received requests will appear here.</p>
            </div>
          ) : (
            myBookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {booking.teacherId === user?.id ? 'Received Request' : 'Your Request'}
                    </h3>
                    <p className="text-gray-600 mb-2">{booking.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Student: {booking.studentName}</span>
                      <span>Slot: {booking.requestedSlot}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {booking.teacherId === user?.id && booking.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'accepted')}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'rejected')}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SkillsMarketplace;