import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
} from "@mui/material";
import { getEmojiFromEmotionId, textToSpeech } from "../helper";
import AudioPlayer from "./AudioPlayer";
import { LoadingButton } from "@mui/lab";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../services/firebase.service";
import { UserVoiceSample } from "../services/db/userVoice.service";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import { getUserSampleAudioUrl } from "../services/storage/userUploads.storage";

type Props = {};
const TtsSmartBox: React.FC<Props> = () => {
  const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedUserVoice, setSelectedUserVoice] =
    useState<UserVoiceSample | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [text, setText] = useState("");
  const [generatedSpeechUrl, setGeneratedSpeechUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [voicesData] = useCollectionData(collection(db, "user-voice-samples"));
  const [sourceAudioUrl, setSourceAudioUrl] = useState<string>("");
  const [isPlayingSourceAudio, setIsPlayingSourceAudio] = useState(false);
  const sourceAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async () => {
    if (!selectedUserVoice?.address) {
      alert("Please select a voice");
      return;
    }
    const audioUrl = getUserSampleAudioUrl(
      selectedUserVoice.address,
      selectedEmotion
    );
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

  useEffect(() => {
    if (selectedUserVoice && selectedEmotion) {
      setSourceAudioUrl(
        getUserSampleAudioUrl(selectedUserVoice.address, selectedEmotion)
      );
    }
  }, [selectedUserVoice, selectedEmotion]);

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
              const userVoiceData = voicesData?.find(
                (v) => v.name === e.target.value
              );
              if (userVoiceData) {
                setSelectedUserVoice(userVoiceData as UserVoiceSample);
                setSelectedEmotion(userVoiceData.emotionIds[0] || "");
              }
            }}
          >
            {(voicesData as UserVoiceSample[])?.map((voiceEmotion) => (
              <MenuItem key={voiceEmotion.address} value={voiceEmotion.name}>
                {voiceEmotion.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: "120px" }}>
          <InputLabel>Emotion</InputLabel>
          <Select
            value={selectedEmotion}
            label="Emotion"
            onChange={(e) => setSelectedEmotion(e.target.value)}
            size="small"
          >
            {selectedUserVoice?.emotionIds.map((emotionId) => (
              <MenuItem key={emotionId} value={emotionId}>
                <span>{getEmojiFromEmotionId(emotionId)}</span>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {sourceAudioUrl && (
          <IconButton
            onClick={() => {
              if (isPlayingSourceAudio) {
                sourceAudioRef.current?.pause();
              } else {
                const audioUrl = getUserSampleAudioUrl(
                  selectedUserVoice?.address || "",
                  selectedEmotion
                );
                const audio = new Audio(audioUrl);
                audio.play();
                sourceAudioRef.current = audio;
              }
              setIsPlayingSourceAudio(!isPlayingSourceAudio);
            }}
          >
            {isPlayingSourceAudio ? <Pause /> : <PlayArrow />}
          </IconButton>
        )}
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
