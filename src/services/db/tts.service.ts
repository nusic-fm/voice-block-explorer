import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.service";

export type UserTTSRequest = {
  voiceId: string;
  text: string;
  address: string;
};

const COLLECTION_NAME = "user-tts-requests";

export const createUserTTSRequest = async (userTTSRequest: UserTTSRequest) => {
  const userTTSRequestRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(userTTSRequestRef, {
    ...userTTSRequest,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
