import { storage } from "../firebase.service.js";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";

const FOLDER_NAME = "user-voice-samples";

const uploadUserVoiceSample = async (file: Blob, fileName: string) => {
  // Create a reference to the file in Firebase Storage
  const endPath = `${FOLDER_NAME}/${fileName}`;
  const storageRef = ref(storage, endPath);

  // Upload the file
  await uploadBytes(storageRef, file);

  // Get the download URL
  const downloadUrl = await getDownloadURL(storageRef);
  console.log({ downloadUrl });
  return `${import.meta.env.VITE_FIREBASE_STORAGE_URL}/${encodeURIComponent(
    endPath
  )}?alt=media`;
};

const getUserSampleAudioUrl = (address: string, emotionId: string) => {
  return `${import.meta.env.VITE_FIREBASE_STORAGE_URL}/${encodeURIComponent(
    `${FOLDER_NAME}/${address}/${emotionId}.mp3`
  )}?alt=media`;
};

export { uploadUserVoiceSample, getUserSampleAudioUrl };
