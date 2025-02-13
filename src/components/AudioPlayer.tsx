import React, { useState, useRef, useEffect } from "react";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import CloseIcon from "@mui/icons-material/Close";

const PlayerContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  backgroundColor: "rgba(0, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
}));

const TimeSlider = styled(Slider)(({ theme }) => ({
  color: "#00ffff",
  height: 4,
  "& .MuiSlider-thumb": {
    width: 8,
    height: 8,
    transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
    "&:hover": {
      boxShadow: "0 0 0 10px rgba(0, 255, 255, 0.1)",
      width: 12,
      height: 12,
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.28,
  },
}));

interface AudioPlayerProps {
  src: string;
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  showCloseButton,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleDurationChange = () => {
      if (isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("durationchange", handleDurationChange);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("durationchange", handleDurationChange);
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (audioRef.current && typeof newValue === "number") {
      audioRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audio.mp3";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading audio:", error);
    }
  };

  return (
    <PlayerContainer>
      <audio ref={audioRef} src={src} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {title && (
          <Typography variant="caption" color="textSecondary" noWrap>
            {title}
          </Typography>
        )}
        {showCloseButton && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton
          onClick={handlePlayPause}
          sx={{
            color: "#00ffff",
            "&:hover": { backgroundColor: "rgba(0, 255, 255, 0.1)" },
          }}
        >
          {isPlaying ? <PauseRounded /> : <PlayArrowRounded />}
        </IconButton>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="caption" color="textSecondary" width={40}>
            {formatTime(currentTime)}
          </Typography>
          <TimeSlider
            size="small"
            value={currentTime}
            max={duration}
            onChange={handleSliderChange}
            sx={{ width: 100 }}
          />
          {!!duration && (
            <Typography variant="caption" color="textSecondary">
              {formatTime(duration)}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={handleDownload}
          sx={{
            color: "#00ffff",
            "&:hover": { backgroundColor: "rgba(0, 255, 255, 0.1)" },
          }}
        >
          <DownloadRounded />
        </IconButton>
      </Box>
    </PlayerContainer>
  );
};

export default AudioPlayer;
