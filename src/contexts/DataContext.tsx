import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Announcement, LostFoundItem, Timetable, Complaint, Skill, BookingRequest } from '../types';

interface DataContextType {
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  
  // Lost & Found
  lostFoundItems: LostFoundItem[];
  addLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => void;
  updateLostFoundStatus: (id: string, status: LostFoundItem['status']) => void;
  
  // Timetables
  timetables: Timetable[];
  updateTimetable: (timetable: Omit<Timetable, 'createdAt' | 'updatedAt'>) => void;
  
  // Complaints
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComplaintStatus: (id: string, status: Complaint['status'], adminNotes?: string) => void;
  
  // Skills
  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt'>) => void;
  
  // Bookings
  bookingRequests: BookingRequest[];
  addBookingRequest: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Mid-Semester Examinations',
      content: 'Mid-semester examinations will commence from March 15th. Please check your individual timetables for specific dates and timings.',
      category: 'academic',
      authorId: 'admin1',
      authorName: 'Academic Office',
      priority: 'high',
      createdAt: '2024-03-01T10:00:00Z',
      updatedAt: '2024-03-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'Annual Cultural Fest - TechFest 2024',
      content: 'Get ready for the biggest cultural event of the year! Registration opens March 10th. Multiple categories including dance, music, drama, and tech competitions.',
      category: 'events',
      authorId: 'admin2',
      authorName: 'Student Affairs',
      priority: 'medium',
      createdAt: '2024-03-05T14:30:00Z',
      updatedAt: '2024-03-05T14:30:00Z'
    }
  ]);

  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>([
    {
      id: '1',
      title: 'Lost iPhone 14',
      description: 'Black iPhone 14 with blue case. Lost near the library.',
      category: 'electronics',
      type: 'lost',
      location: 'Central Library',
      contactInfo: 'john.doe@university.edu',
      reporterId: 'student1',
      reporterName: 'John Doe',
      status: 'active',
      createdAt: '2024-03-06T09:15:00Z'
    }
  ]);

  const [timetables, setTimetables] = useState<Timetable[]>([]);
  
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Water Supply Issue',
      description: 'No water supply in the hostel wing for the past 2 days.',
      category: 'water',
      priority: 'high',
      location: 'Hostel Block A',
      hostelRoom: 'A-201',
      status: 'in-progress',
      studentId: 'ST1234',
      studentName: 'Alice Johnson',
      assignedTo: 'Maintenance Team',
      createdAt: '2024-03-07T08:30:00Z',
      updatedAt: '2024-03-07T10:00:00Z'
    }
  ]);

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      title: 'React.js Development',
      description: 'Learn React.js from basics to advanced concepts. Includes hooks, state management, and project development.',
      category: 'programming',
      level: 'intermediate',
      hourlyRate: 500,
      isOffered: true,
      teacherId: 'student2',
      teacherName: 'Sarah Wilson',
      teacherContact: 'sarah.wilson@university.edu',
      availableSlots: ['Monday 6-8 PM', 'Wednesday 7-9 PM', 'Saturday 2-4 PM'],
      createdAt: '2024-03-05T16:20:00Z'
    }
  ]);

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const addLostFoundItem = (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setLostFoundItems(prev => [newItem, ...prev]);
  };

  const updateLostFoundStatus = (id: string, status: LostFoundItem['status']) => {
    setLostFoundItems(prev => 
      prev.map(item => item.id === id ? { ...item, status } : item)
    );
  };

  const updateTimetable = (timetable: Omit<Timetable, 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const existingIndex = timetables.findIndex(t => t.id === timetable.id);
    
    if (existingIndex >= 0) {
      setTimetables(prev => 
        prev.map((t, index) => 
          index === existingIndex 
            ? { ...timetable, createdAt: t.createdAt, updatedAt: now }
            : t
        )
      );
    } else {
      const newTimetable: Timetable = {
        ...timetable,
        createdAt: now,
        updatedAt: now
      };
      setTimetables(prev => [...prev, newTimetable]);
    }
  };

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: Complaint['status'], adminNotes?: string) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { 
              ...complaint, 
              status, 
              adminNotes,
              updatedAt: new Date().toISOString(),
              resolvedAt: status === 'resolved' ? new Date().toISOString() : complaint.resolvedAt
            }
          : complaint
      )
    );
  };

  const addSkill = (skill: Omit<Skill, 'id' | 'createdAt'>) => {
    const newSkill: Skill = {
      ...skill,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSkills(prev => [newSkill, ...prev]);
  };

  const addBookingRequest = (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: BookingRequest = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setBookingRequests(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: BookingRequest['status']) => {
    setBookingRequests(prev => 
      prev.map(booking => 
        booking.id === id 
          ? { ...booking, status, updatedAt: new Date().toISOString() }
          : booking
      )
    );
  };

  return (
    <DataContext.Provider value={{
      announcements,
      addAnnouncement,
      lostFoundItems,
      addLostFoundItem,
      updateLostFoundStatus,
      timetables,
      updateTimetable,
      complaints,
      addComplaint,
      updateComplaintStatus,
      skills,
      addSkill,
      bookingRequests,
      addBookingRequest,
      updateBookingStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};