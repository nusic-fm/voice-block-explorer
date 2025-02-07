import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.service";

const COLLECTION_NAME = "pyannote_jobs";

export type PyannoteJob = {
  id: string;
  status: string;
  audioPath: string;
  audioUrl: string;
  diarization?: {
    start: number;
    end: number;
    speaker: string;
  }[];
  speakers?: string[];
};

export const getPyannoteJob = (
  jobId: string,
  listenerCallback: (job: PyannoteJob | null) => void
) => {
  const jobRef = doc(db, COLLECTION_NAME, jobId);

  // Set up real-time listener
  return onSnapshot(jobRef, (snapshot) => {
    if (snapshot.exists()) {
      const jobData = snapshot.data() as PyannoteJob;
      listenerCallback(jobData);
    } else {
      listenerCallback(null);
    }
  });
};
