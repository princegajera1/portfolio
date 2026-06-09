import { db, isFirebaseConfigured } from './config';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

const COLLECTION = 'messages';
const LOCAL_STORAGE_KEY = 'prince_messages';

export const saveMessage = async (name, email, subject, message) => {
  const msgData = {
    name,
    email,
    subject,
    message,
    createdAt: new Date().toISOString(),
    read: false
  };

  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (!isOffline) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), msgData);
      return { id: docRef.id, ...msgData };
    } catch (err) {
      console.error('Firebase save failed, falling back to local:', err);
    }
  }

  // Fallback: save to localStorage if Firebase is unavailable/offline
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  let localMessages = [];
  if (saved) {
    try {
      localMessages = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing local messages", e);
    }
  }
  const mockMsg = { id: `msg-${Date.now()}`, ...msgData };
  localMessages.unshift(mockMsg);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
  
  // Dispatch custom event for real-time offline updates
  window.dispatchEvent(new CustomEvent('messagesUpdated'));
  return mockMsg;
};

export const subscribeToMessages = (callback) => {
  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (isOffline) {
    const fetchLocal = () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      let localMessages = [];
      if (saved) {
        try {
          localMessages = JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing local messages", e);
        }
      }
      return localMessages;
    };

    callback(fetchLocal());

    const handleUpdate = () => {
      callback(fetchLocal());
    };

    window.addEventListener('messagesUpdated', handleUpdate);
    return () => {
      window.removeEventListener('messagesUpdated', handleUpdate);
    };
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      callback(data);
    }, (error) => {
      console.error("Error in messages subscription:", error);
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      let localMessages = [];
      if (saved) {
        try {
          localMessages = JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing local messages fallback", e);
        }
      }
      callback(localMessages);
    });
  } catch (e) {
    console.error("Failed to setup onSnapshot for messages:", e);
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    let localMessages = [];
    if (saved) {
      try {
        localMessages = JSON.parse(saved);
      } catch (err) {
        console.error("Error parsing local messages fallback", err);
      }
    }
    callback(localMessages);
    return () => {};
  }
};

export const setMessageReadStatus = async (messageId, isRead) => {
  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (isOffline) {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const localMessages = JSON.parse(saved);
        const index = localMessages.findIndex(m => m.id === messageId);
        if (index > -1) {
          localMessages[index].read = isRead;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
          window.dispatchEvent(new CustomEvent('messagesUpdated'));
          return true;
        }
      } catch (e) {
        console.error("Error setting local message status", e);
      }
    }
    return false;
  }

  try {
    const docRef = doc(db, COLLECTION, messageId);
    await updateDoc(docRef, { read: isRead });
    // Update local storage cache as well for consistency
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const localMessages = JSON.parse(saved);
        const index = localMessages.findIndex(m => m.id === messageId);
        if (index > -1) {
          localMessages[index].read = isRead;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localMessages));
        }
      } catch (e) {
        console.error("Error updating local cache read status", e);
      }
    }
    return true;
  } catch (err) {
    console.error("Error updating message read status:", err);
    throw err;
  }
};

export const deleteMessage = async (messageId) => {
  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (isOffline) {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const localMessages = JSON.parse(saved);
        const filtered = localMessages.filter(m => m.id !== messageId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent('messagesUpdated'));
        return true;
      } catch (e) {
        console.error("Error deleting local message", e);
      }
    }
    return false;
  }

  try {
    const docRef = doc(db, COLLECTION, messageId);
    await deleteDoc(docRef);
    
    // Update local storage cache as well
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const localMessages = JSON.parse(saved);
        const filtered = localMessages.filter(m => m.id !== messageId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      } catch (e) {
        console.error("Error deleting from local cache", e);
      }
    }
    return true;
  } catch (err) {
    console.error("Error deleting message from Firestore:", err);
    throw err;
  }
};
