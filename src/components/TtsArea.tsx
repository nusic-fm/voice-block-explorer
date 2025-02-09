import {
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { createTtsConversion, VoiceDoc } from "../services/db/voices.service";

type Props = {
  voice: VoiceDoc;
  ttsInput: string;
};

const TtsArea = ({ voice, ttsInput }: Props) => {
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const performTts = async () => {
    if (convertedAudioUrl) {
      const audio = new Audio(convertedAudioUrl);
      audio.play();
      setIsPlaying(true);
      return;
    }
    if (voice.audioUrl) {
      const response = await axios.post(
        `${import.meta.env.VITE_AGENT_SERVER_URL}/llasa-voice-synthesizer`,
        {
          text: voice.name,
          audio_url: voice.audioUrl,
        }
      );
      const url = response.data.url;
      setConvertedAudioUrl(url);
      await createTtsConversion(voice, voice.name);
    }
  };

  return (
    <Stack
      sx={{
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        p: 2,
        borderRadius: 2,
      }}
      gap={2}
    >
      <Typography variant="h6">Your Agent is ready to speak! 🔊</Typography>
      <Divider />
      <Box my={4}>
        <Typography variant="h4">{ttsInput}</Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton onClick={performTts}>
          {convertedAudioUrl ? <PlayArrowIcon /> : <CircularProgress />}
        </IconButton>
      </Box>
      <Typography align="center" variant="body1">
        waiting for your input...
      </Typography>
    </Stack>
  );
};

export default TtsArea;
