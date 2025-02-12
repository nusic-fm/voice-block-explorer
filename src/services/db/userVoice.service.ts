import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase.service";

export type UserVoiceSample = {
  userId: string;
  emotionId: string; // Exmaple: "user-voices/${emotionId}_${id}.mp3"
};

const COLLECTION_NAME = "user-voice-samples";

export const createUserVoiceSample = async (
  userVoiceSample: UserVoiceSample
) => {
  const userVoiceSampleRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(userVoiceSampleRef, {
    ...userVoiceSample,
  });
  return docRef.id;
};
