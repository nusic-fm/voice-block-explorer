import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

const styles = {
  micButton: {
    backgroundColor: "rgba(0, 255, 255, 0.1)",
    border: "2px solid rgba(0, 255, 255, 0.3)",
    padding: "1.5rem",
    "&:hover": {
      backgroundColor: "rgba(0, 255, 255, 0.2)",
    },
  },
  recordingPulse: {
    animation: "pulse 1.5s ease-in-out infinite",
  },
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(0, 255, 255, 0.4)",
    },
    "70%": {
      boxShadow: "0 0 0 20px rgba(0, 255, 255, 0)",
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(0, 255, 255, 0)",
    },
  },
};

interface VoiceRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void;
  onRecordingStateChange?: (isRecording: boolean) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onRecordingStateChange,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          if (onRecordingComplete) {
            onRecordingComplete(audioBlob);
          }
          if (onRecordingStateChange) {
            onRecordingStateChange(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
        if (onRecordingStateChange) {
          onRecordingStateChange(true);
        }
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
      setIsRecording(false);
    }
  };

  // Add keyframes to document head
  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0.4); }
        70% { box-shadow: 0 0 0 20px rgba(0, 255, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 255, 255, 0); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <IconButton
      onClick={handleRecording}
      sx={{
        ...styles.micButton,
        ...(isRecording && styles.recordingPulse),
      }}
    >
      {isRecording ? (
        <MicOffIcon sx={{ fontSize: "2rem", color: "#00ffff" }} />
      ) : (
        <MicIcon sx={{ fontSize: "2rem", color: "#00ffff" }} />
      )}
    </IconButton>
  );
};

export default VoiceRecorder;
