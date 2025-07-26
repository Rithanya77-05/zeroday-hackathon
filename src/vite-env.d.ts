/// <reference types="vite/client" />

import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // adjust the path as needed
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const querySnapshot = await getDocs(collection(db, 'announcements'));
      setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAnnouncements();
  }, []);

  // Add announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'announcements'), { title, content, date: new Date() });
    setTitle('');
    setContent('');
    // Refresh list
    const querySnapshot = await getDocs(collection(db, 'announcements'));
    setAnnouncements(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

export default Announcements;
