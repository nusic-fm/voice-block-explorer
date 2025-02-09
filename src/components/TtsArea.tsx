import {
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  createTtsConversionDoc,
  VoiceDoc,
} from "../services/db/voices.service";
import { textToSpeech } from "../helper";
import AudioPlayer from "./AudioPlayer";
import axios from "axios";

type Props = {
  voice: VoiceDoc;
  ttsInput: string;
};

const TtsArea = ({ voice, ttsInput }: Props) => {
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [tokenomics, setTokenomics] = useState<{
    voice_owner: number;
    launcher: number;
  } | null>(null);

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
        // setIsGenerating(false);
      }
    }
  };

  const fetchTokenomics = async () => {
    const tokenomics = await axios.post(
      `${import.meta.env.VITE_AGENT_SERVER_URL}/tokenomics`,
      {
        voice_name: ttsInput,
      }
    );
    setTokenomics(tokenomics.data);
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
      <AudioPlayer src={voice.audioUrl} title="Agent Audio" />
      <Box my={4}>
        <Typography variant="h4">{ttsInput}</Typography>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <IconButton>
          {convertedAudioUrl ? (
            <AudioPlayer src={convertedAudioUrl} title="Generated Audio" />
          ) : isGenerating ? (
            <CircularProgress />
          ) : (
            <Box />
          )}
        </IconButton>
      </Box>
      {!isGenerating && (
        <Typography align="center" variant="body1">
          waiting for your input...
        </Typography>
      )}
      {!isLaunching ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={async () => {
            setIsLaunching(true);
            await fetchTokenomics();
          }}
        >
          Launch your Voice Agent with Coinbase Agentkit
        </Button>
      ) : tokenomics ? (
        <Stack alignItems="center" spacing={2}>
          <Typography variant="body1">Tokens Split from AVA:</Typography>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: (theme) => `conic-gradient(
                ${theme.palette.success.main} 0% ${
                tokenomics?.voice_owner * 100
              }%, 
                ${theme.palette.primary.main} ${
                tokenomics?.voice_owner * 100
              }% 100%
              )`,
            }}
          />
          <Stack spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "success.main",
                }}
              />
              <Typography>
                Voice Owner: {tokenomics.voice_owner * 100}%
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: "primary.main",
                }}
              />
              <Typography>Launcher: {tokenomics.launcher * 100}%</Typography>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert("coming soon")}
          >
            Launch
          </Button>
        </Stack>
      ) : (
        <Typography align="center">
          AVA is evaluating the tokenomics...
        </Typography>
      )}
    </Stack>
  );
};

export default TtsArea;
