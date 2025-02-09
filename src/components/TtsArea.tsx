import {
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  createTtsConversionDoc,
  VoiceDoc,
} from "../services/db/voices.service";
import { textToSpeech } from "../helper";
import AudioPlayer from "./AudioPlayer";

type Props = {
  voice: VoiceDoc;
  ttsInput: string;
};

const TtsArea = ({ voice, ttsInput }: Props) => {
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const performTts = async (text: string) => {
    if (voice.audioUrl) {
      setIsGenerating(true);
      try {
        const url = await textToSpeech(text, voice.audioUrl);
        setConvertedAudioUrl(url);
        await createTtsConversionDoc(voice, text);
      } catch (error) {
        console.error(error);
        alert("Running out of credits, please try again later");
      } finally {
        setIsGenerating(false);
      }
    }
  };
  useEffect(() => {
    if (ttsInput) {
      performTts(ttsInput);
    }
  }, [ttsInput]);

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
        <IconButton>
          {convertedAudioUrl ? (
            <AudioPlayer src={convertedAudioUrl} title="Agent Audio" />
          ) : (
            <CircularProgress />
          )}
        </IconButton>
      </Box>
      <Typography align="center" variant="body1">
        waiting for your input...
      </Typography>
    </Stack>
  );
};

export default TtsArea;
