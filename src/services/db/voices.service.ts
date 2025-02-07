import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.service";

const COLLECTION_NAME = "voices";

export type Voice = {
  audioPath: string;
  name: string;
  emotion: string;
  slug: string;
  audioUrl: string;
  jobId: string;
};

export const createVoice = async (voice: Voice) => {
  const voiceRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(voiceRef, voice);
  return docRef.id;
};

export const getVoices = async () => {
  const voiceRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(voiceRef);
  return snapshot.docs.map((doc) => doc.data());
};
