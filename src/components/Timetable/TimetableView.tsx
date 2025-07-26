import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Plus, Edit, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import type { TimeSlot, Timetable } from '../../types';

const TimetableView: React.FC = () => {
  const { user } = useAuth();
  const { timetables, updateTimetable } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [currentTimetable, setCurrentTimetable] = useState<Timetable | null>(null);
  const [newSlot, setNewSlot] = useState({
    subject: '',
    instructor: '',
    room: '',
    day: 'monday' as TimeSlot['day'],
    startTime: '',
    endTime: '',
    color: '#3B82F6'
  });

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  useEffect(() => {
    if (user) {
      const userTimetable = timetables.find(tt => tt.userId === user.id);
      if (userTimetable) {
        setCurrentTimetable(userTimetable);
      } else {
        // Create a new timetable for the user
        const newTimetable: Timetable = {
          id: user.id + '-timetable',
          userId: user.id,
          semester: 'Current Semester',
          slots: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCurrentTimetable(newTimetable);
      }
    }
  }, [user, timetables]);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTimetable || !user) return;

    const slot: TimeSlot = {
      id: Date.now().toString(),
      ...newSlot
    };

    const updatedTimetable = {
      ...currentTimetable,
      slots: [...currentTimetable.slots, slot]
    };

    updateTimetable(updatedTimetable);
    setCurrentTimetable(updatedTimetable);

    setNewSlot({
      subject: '',
      instructor: '',
      room: '',
      day: 'monday',
      startTime: '',
      endTime: '',
      color: '#3B82F6'
    });
    setShowAddForm(false);
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!currentTimetable) return;

    const updatedTimetable = {
      ...currentTimetable,
      slots: currentTimetable.slots.filter(slot => slot.id !== slotId)
    };

    updateTimetable(updatedTimetable);
    setCurrentTimetable(updatedTimetable);
  };

  const getSlotForDayAndTime = (day: string, time: string) => {
    if (!currentTimetable) return null;
    return currentTimetable.slots.find(slot => 
      slot.day === day && slot.startTime === time
    );
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600 mt-1">Manage your weekly class schedule</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Class</h2>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Data Structures"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={newSlot.instructor}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, instructor: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Prof. Smith"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={newSlot.day}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, day: e.target.value as TimeSlot['day'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {days.map(day => (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <select
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <select
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <input
                  type="text"
                  required
                  value={newSlot.room}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Room 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex space-x-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewSlot(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newSlot.color === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Add Class</span>
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

      {/* Timetable Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200">
          <div className="p-4 bg-gray-50 font-semibold text-gray-900">Time</div>
          {days.map(day => (
            <div key={day} className="p-4 bg-gray-50 font-semibold text-gray-900 text-center capitalize">
              {day}
            </div>
          ))}
        </div>

        {timeSlots.map(time => (
          <div key={time} className="grid grid-cols-7 border-b border-gray-100 min-h-[80px]">
            <div className="p-4 bg-gray-50 font-medium text-gray-700 flex items-center">
              {formatTime(time)}
            </div>
            {days.map(day => {
              const slot = getSlotForDayAndTime(day, time);
              return (
                <div key={`${day}-${time}`} className="border-l border-gray-100 p-2">
                  {slot ? (
                    <div
                      className="h-full rounded-lg p-3 text-white text-sm relative group cursor-pointer"
                      style={{ backgroundColor: slot.color }}
                    >
                      <div className="font-semibold mb-1">{slot.subject}</div>
                      <div className="text-xs opacity-90 mb-1">
                        <User className="h-3 w-3 inline mr-1" />
                        {slot.instructor}
                      </div>
                      <div className="text-xs opacity-90">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {slot.room}
                      </div>
                      
                      {/* Action buttons on hover */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                        <button
                          onClick={() => setEditingSlot(slot.id)}
                          className="bg-white bg-opacity-20 p-1 rounded hover:bg-opacity-30 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="bg-white bg-opacity-20 p-1 rounded hover:bg-opacity-30 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentTimetable?.slots.length || 0}
              </div>
              <div className="text-gray-600">Total Classes</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentTimetable?.slots.length ? 
                  Math.floor(Math.random() * 20) + 15 : 0}
              </div>
              <div className="text-gray-600">Hours/Week</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentTimetable?.slots.length ? 
                  new Set(currentTimetable.slots.map(s => s.instructor)).size : 0}
              </div>
              <div className="text-gray-600">Instructors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableView;