import { db, isFirebaseConfigured } from './config';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';

const COLLECTION = 'resumeMeta';
const DOCUMENT_ID = 'current';
const LOCAL_STORAGE_KEY = 'prince_resume_meta';

const isOfflineMode = () => !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

export const getLocalResumeMeta = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.downloadURL === 'local_pdf') {
        parsed.downloadURL = localStorage.getItem('prince_resume_pdf') || '';
      }
      return parsed;
    } catch (e) {
      console.error("Error parsing local resume meta", e);
    }
  }
  return {
    fileName: '',
    uploadDate: '',
    downloadURL: '',
    fileSize: 0,
    downloadCount: 0
  };
};

export const saveResumeMeta = async (meta) => {
  const data = {
    fileName: meta.fileName || '',
    uploadDate: meta.uploadDate || '',
    downloadURL: meta.downloadURL || '',
    fileSize: meta.fileSize || 0,
    downloadCount: meta.downloadCount || 0
  };

  if (isOfflineMode()) {
    const dataToSave = { ...data };
    if (dataToSave.downloadURL && dataToSave.downloadURL.startsWith('data:')) {
      localStorage.setItem('prince_resume_pdf', dataToSave.downloadURL);
      dataToSave.downloadURL = 'local_pdf';
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));

    // Resolve Base64 in custom event payload so subscribers get full string
    const uiData = { ...dataToSave };
    if (uiData.downloadURL === 'local_pdf') {
      uiData.downloadURL = localStorage.getItem('prince_resume_pdf') || '';
    }
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: uiData }));
    return uiData;
  }

  try {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    await setDoc(docRef, data, { merge: true });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: data }));
    return data;
  } catch (error) {
    console.error("Error saving resume meta to firestore:", error);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: data }));
    return data;
  }
};

export const incrementDownloadCount = async () => {
  if (isOfflineMode()) {
    const data = getLocalResumeMeta();
    data.downloadCount = (data.downloadCount || 0) + 1;
    // Store back with local_pdf placeholder
    const dataToSave = { ...data };
    if (dataToSave.downloadURL && dataToSave.downloadURL.startsWith('data:')) {
      dataToSave.downloadURL = 'local_pdf';
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: data }));
    return data.downloadCount;
  }

  try {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    await updateDoc(docRef, {
      downloadCount: increment(1)
    });
    // Fetch updated to sync local storage
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const updatedData = docSnap.data();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: updatedData }));
      return updatedData.downloadCount;
    }
  } catch (error) {
    console.error("Error incrementing resume download count:", error);
    const data = getLocalResumeMeta();
    data.downloadCount = (data.downloadCount || 0) + 1;
    const dataToSave = { ...data };
    if (dataToSave.downloadURL && dataToSave.downloadURL.startsWith('data:')) {
      dataToSave.downloadURL = 'local_pdf';
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: data }));
    return data.downloadCount;
  }
};

export const deleteResumeMeta = async () => {
  const empty = {
    fileName: '',
    uploadDate: '',
    downloadURL: '',
    fileSize: 0,
    downloadCount: 0
  };

  localStorage.removeItem('prince_resume_pdf');
  localStorage.removeItem('resume_url');

  if (isOfflineMode()) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(empty));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: empty }));
    return true;
  }

  try {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    await setDoc(docRef, empty);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(empty));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: empty }));
    return true;
  } catch (error) {
    console.error("Error deleting resume meta:", error);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(empty));
    window.dispatchEvent(new CustomEvent('resumeMetaUpdated', { detail: empty }));
    return true;
  }
};

export const subscribeToResumeMeta = (callback) => {
  if (isOfflineMode()) {
    const initialData = getLocalResumeMeta();
    callback(initialData);

    const handleUpdate = (e) => {
      callback(e.detail || getLocalResumeMeta());
    };

    window.addEventListener('resumeMetaUpdated', handleUpdate);
    return () => {
      window.removeEventListener('resumeMetaUpdated', handleUpdate);
    };
  }

  try {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        callback(data);
      } else {
        callback(getLocalResumeMeta());
      }
    }, (error) => {
      console.error("Error in resumeMeta subscription:", error);
      callback(getLocalResumeMeta());
    });
  } catch (e) {
    console.error("Failed to setup onSnapshot for resumeMeta, falling back to local:", e);
    const initialData = getLocalResumeMeta();
    callback(initialData);

    const handleUpdate = (e) => {
      callback(e.detail || getLocalResumeMeta());
    };

    window.addEventListener('resumeMetaUpdated', handleUpdate);
    return () => {
      window.removeEventListener('resumeMetaUpdated', handleUpdate);
    };
  }
};
