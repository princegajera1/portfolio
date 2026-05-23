import { db, isFirebaseConfigured } from './config';
import { 
  collection, addDoc, getDocs, doc, 
  deleteDoc, updateDoc, query, orderBy 
} from 'firebase/firestore';

const COLLECTION = 'messages';
const LOCAL_STORAGE_KEY = 'prince_messages';

const initialMessagesSeed = [
  {
    id: "m-1",
    name: "John Doe",
    email: "john@example.com",
    message: "Hey Prince! Love your portfolio design. I have a custom React + GSAP project that needs a developer. Let me know if you are available!",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: false
  },
  {
    id: "m-2",
    name: "Jane Smith",
    email: "jane@company.com",
    message: "Hi Prince, we are looking for a remote Full Stack Intern with Firebase experience. Would you be interested in talking next week?",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: true
  }
];

const updateUnreadCount = (list) => {
  const count = list.filter(m => !m.read).length;
  localStorage.setItem('prince_unread_count', count);
};

const getLocalMessages = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      updateUnreadCount(parsed);
      return parsed;
    } catch (e) {
      console.error("Error parsing local messages", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialMessagesSeed));
  updateUnreadCount(initialMessagesSeed);
  return [...initialMessagesSeed];
};

let localMessages = getLocalMessages();

export const saveMessage = async (name, email, message) => {
  const msgData = {
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
    read: false
  };

  if (!isFirebaseConfigured || !db) {
    const mockMsg = { id: `msg-${Date.now()}`, ...msgData };
    localMessages.unshift(mockMsg);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
    updateUnreadCount(localMessages);
    return mockMsg;
  }

  const docRef = await addDoc(collection(db, COLLECTION), msgData);
  return { id: docRef.id, ...msgData };
};

export const getMessages = async () => {
  if (!isFirebaseConfigured || !db) {
    const list = [...localMessages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    updateUnreadCount(list);
    return list;
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    updateUnreadCount(list);
    return list;
  } catch (error) {
    console.error('Error fetching messages from Firestore:', error);
    return [];
  }
};

export const deleteMessage = async (id) => {
  if (!isFirebaseConfigured || !db) {
    localMessages = localMessages.filter(m => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
    updateUnreadCount(localMessages);
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await deleteDoc(docRef);
  return true;
};

export const markAsRead = async (id, readStatus = true) => {
  if (!isFirebaseConfigured || !db) {
    localMessages = localMessages.map(m => m.id === id ? { ...m, read: readStatus } : m);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
    updateUnreadCount(localMessages);
    return true;
  }

  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { read: readStatus });
  return true;
};
