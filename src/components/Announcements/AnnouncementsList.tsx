import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date?: any;
}

const AnnouncementsList: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const querySnapshot = await getDocs(collection(db, 'announcements'));
      setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
    };
    fetchAnnouncements();
  }, []);

  // Add announcement
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addDoc(collection(db, 'announcements'), { title, content, date: new Date() });
    setTitle('');
    setContent('');
    // Refresh list
    const querySnapshot = await getDocs(collection(db, 'announcements'));
    setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));
  };

  return (
        <div>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {announcements.map(a => (
          <li key={a.id}>{a.title}: {a.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsList;