import { db, isFirebaseConfigured } from './config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const COLLECTION = 'settings';
const DOCUMENT_ID = 'profile';
const LOCAL_STORAGE_KEY = 'prince_profile_settings';

export const initialSettingsSeed = {
  name: "Prince Gajera",
  title: "Frontend Developer",
  bio: "Frontend Developer specializing in high-performance React application structures, responsive web designs, and serverless database integrations.",
  email: "princegajera944@gmail.com",
  phone: "+91 9727031027",
  location: "Ahmedabad, Gujarat, India (Remote Friendly)",
  avatarUrl: "/avatar.png",
  resumeUrl: "/resume.pdf",
  socialLinks: {
    github: "https://github.com/princegajera1",
    linkedin: "https://www.linkedin.com/in/gajera-prince/",
    twitter: "https://x.com/GajeraPrin20670",
    instagram: "https://www.instagram.com/gajera6902/"
  },
  seoTitle: "Prince Gajera | Frontend Developer & React Specialist",
  seoDescription: "High-performance Frontend Developer specializing in React, Vite, Firebase, and modern UI animations. Explore expert developer portfolios, SaaS structures, and interactive animations.",
  openToWork: true,
  defaultTheme: "dark",
  accentColor: "#6C63FF"
};

// Immediate localStorage cleanup for quota overflow from previous failed uploads
try {
  const settingsKey = 'prince_profile_settings';
  const settingsVal = localStorage.getItem(settingsKey);
  const metaKey = 'prince_resume_meta';
  const metaVal = localStorage.getItem(metaKey);

  let extractedPdf = null;
  let parsedSettings = null;
  let parsedMeta = null;

  if (settingsVal && settingsVal.includes('data:application/pdf')) {
    const parsed = JSON.parse(settingsVal);
    if (parsed.resumeUrl && parsed.resumeUrl.startsWith('data:')) {
      extractedPdf = parsed.resumeUrl;
      parsedSettings = parsed;
      parsedSettings.resumeUrl = 'local_pdf';
    }
  }

  if (metaVal && metaVal.includes('data:application/pdf')) {
    const parsed = JSON.parse(metaVal);
    if (parsed.downloadURL && parsed.downloadURL.startsWith('data:')) {
      if (!extractedPdf) {
        extractedPdf = parsed.downloadURL;
      }
      parsedMeta = parsed;
      parsedMeta.downloadURL = 'local_pdf';
    }
  }

  if (extractedPdf) {
    // 1. Save the cleared (shrunk) JSON structures first to free up LocalStorage quota
    if (parsedSettings) {
      localStorage.setItem(settingsKey, JSON.stringify(parsedSettings));
    }
    if (parsedMeta) {
      localStorage.setItem(metaKey, JSON.stringify(parsedMeta));
    }
    // 2. Now write the single large PDF string - this will fit easily in the freed space
    localStorage.setItem('prince_resume_pdf', extractedPdf);
    console.log("Successfully ran local storage cleanup and freed database quota.");
  }
} catch (e) {
  console.error("Failed to run local storage cleanup:", e);
}

const getLocalSettings = () => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Restore large resume Base64 from separate key to prevent quota exceed
      if (parsed.resumeUrl === "local_pdf") {
        parsed.resumeUrl = localStorage.getItem('prince_resume_pdf') || '';
      }
      // Migrate old unsplash placeholder to local avatar
      let migrated = false;
      if (parsed.avatarUrl && parsed.avatarUrl.includes("images.unsplash.com/photo-1535713875002-d1d0cf377fde")) {
        parsed.avatarUrl = "/avatar.png";
        migrated = true;
      }
      if (parsed.socialLinks) {
        if (!parsed.socialLinks.twitter || parsed.socialLinks.twitter.includes("PrinceGajera14")) {
          parsed.socialLinks.twitter = "https://x.com/GajeraPrin20670";
          migrated = true;
        }
        if (!parsed.socialLinks.instagram || parsed.socialLinks.instagram.includes("prince_gajera_14")) {
          parsed.socialLinks.instagram = "https://www.instagram.com/gajera6902/";
          migrated = true;
        }
      }
      if (migrated) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    } catch (e) {
      console.error("Error parsing local settings", e);
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSettingsSeed));
  return { ...initialSettingsSeed };
};

const isOfflineMode = () => !isFirebaseConfigured || !db || localStorage.getItem("mock_admin_logged") === "true";

export const getSettings = async () => {
  if (isOfflineMode()) {
    return getLocalSettings();
  }

  try {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      let updated = false;
      if (!data.socialLinks) {
        data.socialLinks = { ...initialSettingsSeed.socialLinks };
        updated = true;
      } else {
        if (!data.socialLinks.twitter || data.socialLinks.twitter.includes("PrinceGajera14")) {
          data.socialLinks.twitter = "https://x.com/GajeraPrin20670";
          updated = true;
        }
        if (!data.socialLinks.instagram || data.socialLinks.instagram.includes("prince_gajera_14")) {
          data.socialLinks.instagram = "https://www.instagram.com/gajera6902/";
          updated = true;
        }
      }
      if (updated) {
        await setDoc(docRef, data, { merge: true });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    }
    // Seed database if empty
    await setDoc(docRef, initialSettingsSeed);
    return initialSettingsSeed;
  } catch (error) {
    console.error('Error fetching settings from Firestore:', error);
    return getLocalSettings();
  }
};

export const saveSettings = async (settingsData) => {
  if (isOfflineMode()) {
    const dataToSave = { ...settingsData };
    if (!dataToSave.resumeUrl) {
      localStorage.removeItem('prince_resume_pdf');
      localStorage.removeItem('resume_url');
    } else if (dataToSave.resumeUrl.startsWith('data:')) {
      localStorage.setItem('prince_resume_pdf', dataToSave.resumeUrl);
      localStorage.setItem('resume_url', dataToSave.resumeUrl);
      dataToSave.resumeUrl = 'local_pdf';
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    window.dispatchEvent(new CustomEvent('settingsUpdated'));
    return true;
  }

  try {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);
    await setDoc(docRef, settingsData, { merge: true });
    if (settingsData.resumeUrl) {
      localStorage.setItem('resume_url', settingsData.resumeUrl);
    }
    window.dispatchEvent(new CustomEvent('settingsUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving settings to Firestore:', error);
    throw error;
  }
};
