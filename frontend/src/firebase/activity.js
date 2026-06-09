import { db, isFirebaseConfigured } from './config';
import { collection, addDoc, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const COLLECTION = 'activityLog';
const LOCAL_STORAGE_KEY = 'prince_activity_log';

export const logActivity = async (action, details) => {
  const logData = {
    action,
    details,
    timestamp: new Date().toISOString()
  };

  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (!isOffline) {
    try {
      await addDoc(collection(db, COLLECTION), logData);
      window.dispatchEvent(new CustomEvent('activityLogged'));
      return;
    } catch (err) {
      console.error('Firebase logging failed:', err);
    }
  }

  // Local Storage fallback
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const logs = saved ? JSON.parse(saved) : [];
    logs.unshift(logData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs.slice(0, 50)));
    window.dispatchEvent(new CustomEvent('activityLogged'));
  } catch (e) {
    console.error("Local storage logging failed:", e);
  }
};

export const getLatestActivities = async () => {
  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (isOffline) {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved).slice(0, 5) : [];
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('timestamp', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching activities:', error);
    // fallback to local
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved).slice(0, 5) : [];
  }
};

export const subscribeToActivities = (callback) => {
  const isOffline = !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

  if (isOffline) {
    const fetchLocal = () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved).slice(0, 5) : [];
    };

    callback(fetchLocal());

    const handleUpdate = () => {
      callback(fetchLocal());
    };

    window.addEventListener('activityLogged', handleUpdate);
    return () => {
      window.removeEventListener('activityLogged', handleUpdate);
    };
  }

  try {
    const q = query(collection(db, COLLECTION), orderBy('timestamp', 'desc'), limit(5));
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      callback(data);
    }, (error) => {
      console.error("Error in activities subscription:", error);
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      callback(saved ? JSON.parse(saved).slice(0, 5) : []);
    });
  } catch (e) {
    console.error("Failed to setup onSnapshot for activities:", e);
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    callback(saved ? JSON.parse(saved).slice(0, 5) : []);
    return () => {};
  }
};
