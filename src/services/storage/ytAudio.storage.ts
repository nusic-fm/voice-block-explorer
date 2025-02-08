import { storage } from "../firebase.service.js";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";

const FOLDER_NAME = "tts-yt-audio";

const uploadToYtAudioStorage = async (file: File, fileName: string) => {
  // Create a reference to the file in Firebase Storage
  const storageRef = ref(storage, `${FOLDER_NAME}/${fileName}`);

  // Upload the file
  await uploadBytes(storageRef, file);

  // Get the download URL
  const downloadUrl = await getDownloadURL(storageRef);
  console.log({ downloadUrl });
  return `${
    import.meta.env.VITE_FIREBASE_STORAGE_URL
  }/${FOLDER_NAME}%2F${fileName}?alt=media`;
};

export { uploadToYtAudioStorage };
