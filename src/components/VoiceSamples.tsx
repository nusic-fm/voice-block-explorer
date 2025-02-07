import { useState } from "react";
import { getSpeakerAudioUrl } from "../helper";
import { IconButton, Stack, Typography } from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

type Props = {
  jobId: string;
  speakers: string[];
};

const VoiceSamples = ({ jobId, speakers }: Props) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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
    }
  };

  return (
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
        >
          <IconButton
            onClick={() => handlePlay(speaker)}
            size="large"
            sx={{ border: "1px solid #00ffff" }}
          >
            {playing === speaker ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <Typography>Speaker {i + 1}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};
export default VoiceSamples;
