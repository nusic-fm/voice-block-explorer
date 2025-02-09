import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.service";

const COLLECTION_NAME = "voices";

export type Voice = {
  audioPath: string;
  name: string;
  symbol: string;
  audioUrl: string;
  jobId: string;
  isNFTDeployed: boolean;
  yVid?: string;
  emoji: string;
  tweetTitle?: string;
  twitterUsername?: string;
  tweetVideoUrl?: string;
  tweetId?: string;
  duration: number;
};

export type VoiceDoc = Voice & {
  id: string;
};

export const createVoice = async (voice: Voice) => {
  const voiceRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(voiceRef, {
    ...voice,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getVoices = async () => {
  const voiceRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(voiceRef);
  return snapshot.docs.map((doc) => doc.data());
};

export const createTtsConversionDoc = async (
  voice: VoiceDoc,
  ttsText: string
) => {
  const ttsRef = collection(db, COLLECTION_NAME, voice.id, "tts");
  const docRef = await addDoc(ttsRef, {
    text: ttsText,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};
