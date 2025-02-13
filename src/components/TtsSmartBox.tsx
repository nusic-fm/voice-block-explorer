import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { textToSpeech } from "../helper";
import AudioPlayer from "./AudioPlayer";
import { LoadingButton } from "@mui/lab";

const voiceEmotionsData: {
  [key: string]: { id: string; emoji: string; audioUrl: string }[];
} = {
  adam: [
    { id: "happy", emoji: "😊", audioUrl: "" },
    { id: "sad", emoji: "😢", audioUrl: "" },
    { id: "excited", emoji: "🎉", audioUrl: "" },
  ],
  logesh: [
    { id: "neutral", emoji: "😐", audioUrl: "" },
    { id: "angry", emoji: "😠", audioUrl: "" },
    { id: "surprised", emoji: "😮", audioUrl: "" },
  ],
  zeeshan: [
    { id: "happy", emoji: "😊", audioUrl: "" },
    { id: "calm", emoji: "😌", audioUrl: "" },
    { id: "energetic", emoji: "⚡", audioUrl: "" },
  ],
};

const TtsSmartBox: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState(
    Object.keys(voiceEmotionsData)[0]
  );
  const [selectedEmotion, setSelectedEmotion] = useState(
    () => voiceEmotionsData[Object.keys(voiceEmotionsData)[0]][0].emoji
  );
  const [text, setText] = useState("");
  const [generatedSpeechUrl, setGeneratedSpeechUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    const audioUrl = `https://firebasestorage.googleapis.com/v0/b/nusic-ai-agent.firebasestorage.app/o/tts-yt-audio%2FTrump_%20'I%20am%20your%20voice'%20(mp3cut%20(mp3cut.net).mp3?alt=media`;
    // voiceEmotionsData[selectedVoice].find(
    //   (e) => e.emoji === selectedEmotion
    // )?.audioUrl;
    if (audioUrl) {
      setIsGenerating(true);
      try {
        const speechUrl = await textToSpeech(text, audioUrl);
        setGeneratedSpeechUrl(speechUrl);
      } catch (e) {
        alert("Error");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: 4,
        backdropFilter: "blur(15px)",
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        Text to Speech Playground
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }} justifyContent={"start"}>
        <FormControl size="small" sx={{ width: "150px" }}>
          <InputLabel>Voice</InputLabel>
          <Select
            value={selectedVoice}
            label="Voice"
            size="small"
            onChange={(e) => {
              setSelectedVoice(e.target.value);
              setSelectedEmotion(
                voiceEmotionsData[e.target.value as string][0].id
              );
            }}
          >
            {Object.keys(voiceEmotionsData).map((voiceId) => (
              <MenuItem key={voiceId} value={voiceId}>
                {voiceId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: "80px" }}>
          <InputLabel>Emotion</InputLabel>
          <Select
            value={selectedEmotion}
            label="Emotion"
            onChange={(e) => setSelectedEmotion(e.target.value)}
            size="small"
          >
            {voiceEmotionsData[selectedVoice].map((emotion) => (
              <MenuItem key={emotion.id} value={emotion.id}>
                <span style={{ fontSize: "1.2rem" }}>{emotion.emoji}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {generatedSpeechUrl ? (
        <AudioPlayer
          src={generatedSpeechUrl}
          title="Converted Audio"
          showCloseButton
          onClose={() => {
            setGeneratedSpeechUrl("");
          }}
        />
      ) : (
        <TextField
          multiline
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to convert to speech..."
          variant="outlined"
          sx={{ width: 500 }}
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <LoadingButton
          loading={isGenerating}
          onClick={() => {
            if (generatedSpeechUrl) {
              setGeneratedSpeechUrl("");
              setText("");
            } else {
              handleSubmit();
            }
          }}
        >
          {generatedSpeechUrl ? "Retry" : "Convert"}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default TtsSmartBox;
