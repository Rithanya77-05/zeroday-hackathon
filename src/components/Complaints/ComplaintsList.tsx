import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, Plus, Filter, MapPin, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import type { Complaint } from '../../types';

const ComplaintsList: React.FC = () => {
  const { user } = useAuth();
  const { complaints, addComplaint, updateComplaintStatus } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: 'other' as Complaint['category'],
    priority: 'medium' as Complaint['priority'],
    location: '',
    hostelRoom: ''
  });

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'water', label: 'Water Supply' },
    { value: 'electricity', label: 'Electricity' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'wifi', label: 'WiFi/Internet' },
    { value: 'other', label: 'Other' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    pending: Clock,
    'in-progress': AlertTriangle,
    resolved: CheckCircle,
    rejected: XCircle
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = selectedStatus === 'all' || complaint.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;
    const matchesUser = user?.role === 'admin' || complaint.studentId === user?.studentId;
    return matchesStatus && matchesCategory && matchesUser;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addComplaint({
      ...newComplaint,
      status: 'pending',
      studentId: user.studentId || user.id,
      studentName: user.name
    });

    setNewComplaint({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
      location: '',
      hostelRoom: ''
    });
    setShowAddForm(false);
  };

  const handleStatusUpdate = (complaintId: string, newStatus: Complaint['status']) => {
    const adminNotes = newStatus === 'resolved' ? 'Issue has been resolved by maintenance team.' : '';
    updateComplaintStatus(complaintId, newStatus, adminNotes);
  };

  const getStatusIcon = (status: Complaint['status']) => {
    const Icon = statusIcons[status];
    return <Icon className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'admin' ? 'Manage Complaints' : 'My Complaints'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'admin' 
              ? 'Review and resolve student complaints' 
              : 'Track your hostel and campus complaints'}
          </p>
        </div>
        {user?.role === 'student' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>File Complaint</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === status.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 text-sm rounded-full font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Complaint Form */}
      {showAddForm && user?.role === 'student' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">File New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={newComplaint.title}
                onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={newComplaint.description}
                onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Detailed description of the problem"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value as Complaint['category'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="water">Water Supply</option>
                  <option value="electricity">Electricity</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="wifi">WiFi/Internet</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newComplaint.priority}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, priority: e.target.value as Complaint['priority'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newComplaint.location}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Hostel Block A, Room 201"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Room (Optional)</label>
                <input
                  type="text"
                  value={newComplaint.hostelRoom}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, hostelRoom: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Room number"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Submit Complaint
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

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-600">
              {user?.role === 'admin' 
                ? 'No student complaints match your current filters.' 
                : 'You haven\'t filed any complaints yet.'}
            </p>
          </div>
        ) : (
          filteredComplaints.map(complaint => (
            <div
              key={complaint.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{complaint.title}</h3>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-lg border ${statusColors[complaint.status]}`}>
                      {getStatusIcon(complaint.status)}
                      <span className="text-sm font-medium capitalize">{complaint.status.replace('-', ' ')}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[complaint.priority]}`}>
                      {complaint.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{complaint.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{complaint.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{complaint.studentName}</span>
                    </div>
                    <span>Filed: {formatDate(complaint.createdAt)}</span>
                    {complaint.resolvedAt && (
                      <span>Resolved: {formatDate(complaint.resolvedAt)}</span>
                    )}
                  </div>
                </div>
                {user?.role === 'admin' && complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, 'in-progress')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(complaint.id, 'resolved')}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
              
              {complaint.adminNotes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-gray-900 mb-1">Admin Notes:</h4>
                  <p className="text-gray-700 text-sm">{complaint.adminNotes}</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Category: <span className="capitalize font-medium">{complaint.category}</span></span>
                  <span>ID: #{complaint.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;