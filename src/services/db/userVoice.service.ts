import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase.service";

export type UserVoiceSample = {
  address: string;
  emotionIds: string[]; // Exmaple: "user-voices/${emotionId}_${id}.mp3"
  name: string;
};

const COLLECTION_NAME = "user-voice-samples";

export const createUserVoiceSample = async (
  userVoiceSample: UserVoiceSample
) => {
  const userVoiceSampleRef = doc(db, COLLECTION_NAME, userVoiceSample.name);
  await setDoc(userVoiceSampleRef, {
    ...userVoiceSample,
    createdAt: serverTimestamp(),
  });
};

export const isVoiceNameUnique = async (voiceName: string) => {
  const userVoiceSampleRef = doc(db, COLLECTION_NAME, voiceName);
  const docSnap = await getDoc(userVoiceSampleRef);
  return !docSnap.exists();
};
