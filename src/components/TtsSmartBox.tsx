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
  CircularProgress,
  Modal,
  Paper,
} from "@mui/material";
import { getEmojiFromEmotionId, textToSpeech } from "../helper";
import AudioPlayer from "./AudioPlayer";
import { LoadingButton } from "@mui/lab";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { db } from "../services/firebase.service";
import { UserVoiceSample } from "../services/db/userVoice.service";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import { getUserSampleAudioUrl } from "../services/storage/userUploads.storage";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";

type Props = {};
const TtsSmartBox: React.FC<Props> = () => {
  const { isConnected, address } = useAccount();
  const [selectedVoice, setSelectedVoice] = useState("");
  const [selectedUserVoice, setSelectedUserVoice] =
    useState<UserVoiceSample | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [text, setText] = useState("");
  const [generatedSpeechUrl, setGeneratedSpeechUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [voicesData] = useCollectionData(
    query(
      collection(db, "user-voice-samples"),
      where("address", "==", address || "")
    )
  );
  const [sourceAudioUrl, setSourceAudioUrl] = useState<string>("");
  const [isLoadingSourceAudio, setIsLoadingSourceAudio] = useState(false);
  const [isPlayingSourceAudio, setIsPlayingSourceAudio] = useState(false);
  const sourceAudioRef = useRef<HTMLAudioElement | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

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

  const handleSourceAudioPlayback = async () => {
    if (isPlayingSourceAudio) {
      sourceAudioRef.current?.pause();
      setIsPlayingSourceAudio(false);
    } else {
      setIsLoadingSourceAudio(true);
      try {
        const audioUrl = getUserSampleAudioUrl(
          selectedUserVoice?.address || "",
          selectedEmotion
        );
        if (!sourceAudioRef.current) {
          sourceAudioRef.current = new Audio(audioUrl);
          sourceAudioRef.current.addEventListener("ended", () => {
            setIsPlayingSourceAudio(false);
          });
        }
        await sourceAudioRef.current.play();
        setIsPlayingSourceAudio(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      } finally {
        setIsLoadingSourceAudio(false);
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

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (sourceAudioRef.current) {
        sourceAudioRef.current.pause();
        sourceAudioRef.current = null;
      }
    };
  }, []);

  // Reset audio when source changes
  useEffect(() => {
    if (sourceAudioRef.current) {
      sourceAudioRef.current.pause();
      sourceAudioRef.current = null;
      setIsPlayingSourceAudio(false);
    }
  }, [selectedUserVoice, selectedEmotion]);

  const handleVoiceClick = (event: React.MouseEvent) => {
    if (!isConnected) {
      event.preventDefault();
      setShowConnectModal(true);
    }
  };

  useEffect(() => {
    if (isConnected) {
      setShowConnectModal(false);
    }
  }, [isConnected]);

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
        <FormControl
          size="small"
          sx={{ width: "150px" }}
          onClick={handleVoiceClick}
        >
          <InputLabel>Voice</InputLabel>
          <Select
            value={selectedVoice}
            label="Voice"
            size="small"
            disabled={!isConnected}
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
            {voicesData?.length === 0 ? (
              <MenuItem value="">No voices found</MenuItem>
            ) : (
              (voicesData as UserVoiceSample[])?.map((voiceEmotion) => (
                <MenuItem key={voiceEmotion.address} value={voiceEmotion.name}>
                  {voiceEmotion.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{ width: "120px" }}
          disabled={!selectedVoice}
        >
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
            onClick={handleSourceAudioPlayback}
            disabled={isLoadingSourceAudio}
          >
            {isLoadingSourceAudio ? (
              <CircularProgress size={24} />
            ) : isPlayingSourceAudio ? (
              <Pause />
            ) : (
              <PlayArrow />
            )}
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
          disabled={!text || !selectedVoice || !selectedEmotion}
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

      <Modal
        open={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        aria-labelledby="connect-wallet-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            outline: "none",
            // maxWidth: "450px",
            // width: "95%",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3 }} align="center">
            Connect Wallet to Select Your Voice
          </Typography>
          <ConnectKitButton />
        </Paper>
      </Modal>
    </Box>
  );
};

export default TtsSmartBox;
