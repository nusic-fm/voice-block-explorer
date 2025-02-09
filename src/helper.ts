import axios from "axios";
import { Voice } from "./services/db/voices.service";

const extractYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const getSpeakerAudioUrl = (jobId: string, speaker: string) => {
  return `${
    import.meta.env.VITE_FIREBASE_STORAGE_URL
  }/tts-yt-audio%2f${jobId}%2f${speaker}?alt=media`;
};

const randomEmoji = () => {
  const emojis = [
    "🤖",
    "🎯",
    "🚀",
    "✨",
    "💫",
    "🎮",
    "🎪",
    "🎭",
    "🎨",
    "🎼",
    "🎧",
    "🎤",
    "🎹",
    "🌟",
    "💡",
    "⚡️",
    "🔥",
    "🌈",
    "🎪",
    "🎭",
    "🦾",
    "🤝",
    "👾",
    "🎲",
    "🎯",
    "🎪",
    "🎨",
    "🎭",
    "🎬",
    "🎤",
    "🔮",
    "💎",
    "🎪",
    "🎭",
    "🎨",
    "🎼",
    "🎧",
    "🎤",
    "🎹",
    "🌟",
    "🦄",
    "🐉",
    "🍀",
    "🌿",
    "🌴",
    "🌳",
  ];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getAverageDuration = (voices: Voice[]) => {
  return (
    voices.reduce((acc, voice) => acc + voice.duration, 0) /
    (voices.length || 1)
  );
};

const getLongestDuration = (voices: Voice[]) => {
  return voices.reduce(
    (acc, voice) => (acc > voice.duration ? acc : voice.duration),
    0
  );
};

const getShortestDuration = (voices: Voice[]) => {
  if (!voices || voices.length === 0) return 0;
  return voices.reduce(
    (acc, voice) => (acc > voice.duration ? voice.duration : acc),
    voices[0].duration
  );
};

const textToSpeech = async (text: string, audio_url: string) => {
  const response = await axios.post(
    `${import.meta.env.VITE_AGENT_SERVER_URL}/llasa-voice-synthesizer`,
    {
      text,
      audio_url,
    }
  );
  const url = response.data.url;
  return url;
};

export {
  extractYoutubeId,
  getSpeakerAudioUrl,
  randomEmoji,
  getAverageDuration,
  getLongestDuration,
  getShortestDuration,
  textToSpeech,
};
