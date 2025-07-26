export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  studentId?: string;
  department?: string;
  year?: number;
  hostelRoom?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'academic' | 'events' | 'hostel' | 'general' | 'urgent';
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: 'electronics' | 'clothing' | 'books' | 'accessories' | 'documents' | 'other';
  type: 'lost' | 'found';
  location: string;
  imageUrl?: string;
  contactInfo: string;
  reporterId: string;
  reporterName: string;
  status: 'active' | 'claimed' | 'resolved';
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  subject: string;
  instructor: string;
  room: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  startTime: string;
  endTime: string;
  color: string;
}

export interface Timetable {
  id: string;
  userId: string;
  semester: string;
  slots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'water' | 'electricity' | 'cleaning' | 'maintenance' | 'wifi' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: string;
  hostelRoom?: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  studentId: string;
  studentName: string;
  assignedTo?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: 'programming' | 'design' | 'languages' | 'academic' | 'music' | 'sports' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced';
  hourlyRate?: number;
  isOffered: boolean;
  teacherId: string;
  teacherName: string;
  teacherContact: string;
  availableSlots: string[];
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  skillId: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  requestedSlot: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}