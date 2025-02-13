import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
  const userVoiceSampleRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(userVoiceSampleRef, {
    ...userVoiceSample,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
