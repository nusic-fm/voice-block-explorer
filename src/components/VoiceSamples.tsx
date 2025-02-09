import { useState } from "react";
import { getSpeakerAudioUrl } from "../helper";
import { Button, CircularProgress, IconButton, Stack } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

type Props = {
  jobId: string;
  speakers: string[];
  onGenerate: (speakerPath: string) => void;
};

const VoiceSamples = ({ jobId, speakers, onGenerate }: Props) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [loadingSpeaker, setLoadingSpeaker] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handlePlay = async (speaker: string) => {
    if (playing === speaker) {
      audio?.pause();
      setPlaying(null);
      return;
    }

    // Stop any currently playing audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setLoadingSpeaker(speaker);
    try {
      // Get audio URL from Firebase
      const url = getSpeakerAudioUrl(jobId, speaker);

      // Create and play new audio
      const newAudio = new Audio(url);

      // Set up event listeners before playing
      newAudio.addEventListener("ended", () => {
        setPlaying(null);
        setAudio(null);
      });

      newAudio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
        setPlaying(null);
        setAudio(null);
      });

      // Start playing and update state
      await newAudio.play();
      setAudio(newAudio);
      setPlaying(speaker);
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlaying(null);
      setAudio(null);
    } finally {
      setLoadingSpeaker(null);
    }
  };

  return (
    <Stack
      height={"100%"}
      justifyContent={"center"}
      display={"flex"}
      alignItems={"center"}
      gap={4}
    >
      <Stack direction={"row"} gap={2} justifyContent={"center"} width={"100%"}>
        {speakers.map((speaker, i) => (
          <Stack
            key={speaker}
            border={"1px solid #00ffff"}
            py={4}
            width={220}
            borderRadius={4}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
            onClick={() => handlePlay(speaker)}
            sx={{ cursor: "pointer" }}
          >
            <IconButton size="large" sx={{ border: "1px solid #00ffff" }}>
              {loadingSpeaker === speaker ? (
                <CircularProgress size={20} />
              ) : playing === speaker ? (
                <PauseIcon />
              ) : (
                <PlayArrowIcon />
              )}
            </IconButton>
            <Button
              disabled={disabled}
              size="small"
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setDisabled(true);
                audio?.pause();
                onGenerate(speaker);
              }}
            >
              Choose Speaker {i + 1}
            </Button>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
export default VoiceSamples;
