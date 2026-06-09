import { storage } from './config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param {File} file - The file to upload
 * @param {string} folderPath - The folder path, e.g. 'projects/images'
 * @param {function} onProgress - Callback function (progressPercent) => {}
 * @returns {Promise<string>} - Promise resolving to the download URL
 */
export const uploadFile = (file, folderPath, onProgress, customFileName) => {
  const isOffline = !storage || localStorage.getItem("mock_admin_logged") === "true";

  return new Promise((resolve, reject) => {
    // If Firebase Storage is not configured or mock mode is active, simulate upload with Base64 persistence
    if (isOffline) {
      console.warn("Local mock upload active. Reading file as Base64 for local storage persistence...");
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        if (onProgress) onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (err) => {
            reject(err);
          };
          reader.readAsDataURL(file);
        }
      }, 100);
      return;
    }

    try {
      const fileName = customFileName || `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `${folderPath}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error("Storage upload error:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Delete a file from Firebase Storage given its public HTTP URL
 * @param {string} fileUrl - The public download URL
 * @returns {Promise<boolean>}
 */
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return false;
  const isOffline = !storage || localStorage.getItem("mock_admin_logged") === "true";

  if (isOffline) {
    console.warn("Local mock delete active. Mocking file delete...");
    return true;
  }

  // Check if it's a firebase storage URL
  if (!fileUrl.includes('firebasestorage.googleapis.com')) {
    return true; // Not in Firebase, assume success
  }

  try {
    // Decode the URL path to extract the storage ref path
    const decodedUrl = decodeURIComponent(fileUrl);
    const pathPart = decodedUrl.split('/o/')[1]?.split('?')[0];
    if (!pathPart) return false;

    const fileRef = ref(storage, pathPart);
    await deleteObject(fileRef);
    return true;
  } catch (err) {
    console.error("Storage delete error:", err);
    return false;
  }
};
