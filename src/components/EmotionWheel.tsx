import React, { useState, useRef } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// interface Position {
//   x: number;
//   y: number;
// }

const getAngles = (items: any[]) => {
  const angleStep = 360 / items.length;
  return items.map((item, index) => ({
    ...item,
    angle: (angleStep * index + 270) % 360, // Start from top (270 degrees) and go clockwise
  }));
};

const emotionsData = getAngles([
  {
    emoji: "😊",
    name: "happy",
    examples: [
      "This is the best day ever! I can't stop smiling and laughing!",
      "I feel so grateful for everything today. Life is truly beautiful!",
      "Wow, I finally did it! I knew I could achieve my goal!",
    ],
    audioUrl: null,
  },
  {
    emoji: "😢",
    name: "sad",
    examples: [
      "Nothing feels right today, and I just want to be alone for a while.",
      "I really miss them. It hurts so much to be apart from them.",
      "No matter how hard I try, it never seems to be enough.",
    ],
    audioUrl: null,
  },
  {
    emoji: "😠",
    name: "angry",
    examples: [
      "I'm so frustrated with everything! I just want to scream and shout!",
      "Why is it always my fault? I can't win for losing!",
      "I'm so angry with you! You just don't understand me at all.",
    ],
    audioUrl: null,
  },
  {
    emoji: "😨",
    name: "fearful",
    examples: [
      "I'm so scared right now. I can't even breathe properly.",
      "I'm so scared of what might happen next. I just want to run away!",
      "I'm so scared of failure. I'm not sure I can do this.",
    ],
    audioUrl: null,
  },
  {
    emoji: "😲",
    name: "surprised",
    examples: [
      "I can't believe what just happened! I'm so shocked and surprised!",
      "Why did that happen? I'm so confused and bewildered!",
      "What is going on? I'm so surprised and bewildered!",
    ],
    audioUrl: null,
  },
  {
    emoji: "🤩",
    name: "excited",
    examples: [
      "I'm so excited for this! I can't wait to see what happens next!",
      "This is the best day ever! I can't stop smiling and laughing!",
      "I feel so grateful for everything today. Life is truly beautiful!",
    ],
    audioUrl: null,
  },
]);

// Styled components using MUI's styled API
const Container = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isShrinked",
})<{ isShrinked: boolean }>(({ theme, isShrinked }) => ({
  position: "relative",
  width: isShrinked ? 80 : 300,
  height: isShrinked ? 80 : 300,
  borderRadius: "50%",
  // border: `2px solid rgba(0, 255, 255, 0.4)`,
  boxShadow: `0 8px 32px rgba(0, 255, 255, 0.15)`,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.standard,
    easing: theme.transitions.easing.easeInOut,
  }),
}));

const SelectionArea = styled(Box, {
  shouldForwardProp: (prop) =>
    !["angle", "selectedIndex"].includes(prop as string),
})<{ angle: number; selectedIndex: number }>(({ theme, selectedIndex }) => ({
  position: "absolute",
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `conic-gradient(
      from ${270 + (selectedIndex + 1) * 60}deg,
      ${theme.palette.primary.main}20 0deg,
      ${theme.palette.primary.main}20 60deg,
      transparent 60deg,
      transparent 360deg
    )`,
    borderRadius: "50%",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      linear-gradient(0deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%),
      linear-gradient(60deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%),
      linear-gradient(120deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%),
      linear-gradient(180deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%),
      linear-gradient(240deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%),
      linear-gradient(300deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%)
    `,
    borderRadius: "50%",
  },
}));

const InnerCircle = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: 80,
  height: 80,
  borderRadius: "50%",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2,
  boxShadow: theme.shadows[2],
}));

const EmotionBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "angle",
})<{ isSelected?: boolean; angle: number }>(({ theme, isSelected, angle }) => ({
  position: "absolute",
  width: 50,
  height: 50,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 38,
  transition: theme.transitions.create(["transform", "background-color"], {
    duration: theme.transitions.duration.shorter,
  }),
  transform: `rotate(${angle}deg) translate(100px) rotate(-${angle}deg) ${
    isSelected ? "scale(1.4)" : "scale(1)"
  }`,
  backgroundColor: isSelected ? theme.palette.action.selected : "transparent",
  zIndex: 1,
  cursor: "pointer",
}));

const EmotionLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isVisible",
})<{ isVisible: boolean }>(({ theme, isVisible }) => ({
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%) translateY(240px)",
  color: theme.palette.primary.main,
  fontSize: "1.5rem",
  fontWeight: "bold",
  textTransform: "capitalize",
  // visibility: isVisible ? "visible" : "hidden",
  transition: theme.transitions.create(["opacity", "transform"], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
  transformOrigin: "center",
}));

const ExampleText = styled(Typography)(({ theme }) => ({
  // position: "absolute",
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%) translateY(100px)",
  color: theme.palette.text.primary,
  fontSize: "1.4rem",
  width: "320px",
  textAlign: "center",
  opacity: 1,
  // animation: "fadeInExample 0.5s ease-in-out forwards",
  // "@keyframes fadeInExample": {
  //   from: { opacity: 0, transform: "translate(-50%, -50%) translateY(180px)" },
  //   to: { opacity: 1, transform: "translate(-50%, -50%) translateY(160px)" },
  // },
}));

const Header = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "isRecording",
})<{ isRecording?: boolean }>(({ theme, isRecording }) => ({
  fontSize: "1.8rem",
  fontWeight: "bold",
  color: theme.palette.text.primary,
  textAlign: "center",
  marginBottom: "8px",
  opacity: 0,
  animation: "fadeIn 0.5s ease-in-out forwards",
  "& .recording-dot": {
    display: "inline-block",
    width: "8px",
    height: "8px",
    backgroundColor: "#ff4444",
    borderRadius: "50%",
    marginLeft: "8px",
    animation: isRecording ? "blink 1s infinite" : "none",
  },
  "@keyframes blink": {
    "0%": { opacity: 0 },
    "50%": { opacity: 1 },
    "100%": { opacity: 0 },
  },
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

const SubHeader = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  color: theme.palette.text.secondary,
  textAlign: "center",
  marginBottom: "18px",
  opacity: 0,
  animation: "fadeIn 0.5s ease-in-out forwards",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(-10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

const ChooseOptions: React.FC = () => {
  const [emotions, setEmotions] = useState(emotionsData);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectionAngle, setSelectionAngle] = useState(0);
  const [selectedExample, setSelectedExample] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [freezeSelectionChange, setFreezeSelectionChange] = useState(false);
  const hasAudio = emotions.filter((e) => e.audioUrl).length > 0;

  const handleMicClick = async () => {
    if (!selectedEmotion) return;

    const emotion = emotions.find((e) => e.name === selectedEmotion);
    if (emotion) {
      const randomExample =
        emotion.examples[Math.floor(Math.random() * emotion.examples.length)];
      setSelectedExample(randomExample);
    }

    // Recording
    try {
      setFreezeSelectionChange(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setIsRecording(true);
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
        const audioUrl = URL.createObjectURL(audioBlob);
        setEmotions((prevEmotions) =>
          prevEmotions.map((emotion) =>
            emotion.name === selectedEmotion
              ? { ...emotion, audioUrl }
              : emotion
          )
        );
        setFreezeSelectionChange(false);
        setIsRecording(false);
        // if (onRecordingComplete) {
        //   onRecordingComplete(audioBlob);
        // }
        // if (onRecordingStateChange) {
        //   onRecordingStateChange(false);
        // }
      };

      mediaRecorder.start();
      setIsRecording(true);
      //   if (onRecordingStateChange) {
      //     onRecordingStateChange(true);
      //   }
    } catch (error) {
      setFreezeSelectionChange(false);
      alert("Please enable microphone access");
      console.error("Error accessing microphone:", error);
    }
  };

  const onStopRecording = () => {
    if (
      isRecording &&
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRecording || freezeSelectionChange) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      // Calculate angle from center to cursor
      let angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
      angle = (angle * 180) / Math.PI;
      // Convert to 0-360 range
      angle = (angle + 360) % 360;

      setSelectionAngle(angle);

      // Find closest emotion
      const closestEmotion = emotions.reduce((prev, curr) => {
        const prevDiff = Math.abs(((prev.angle - angle + 180) % 360) - 180);
        const currDiff = Math.abs(((curr.angle - angle + 180) % 360) - 180);
        return prevDiff < currDiff ? prev : curr;
      });

      setSelectedEmotion(closestEmotion.name);
    }
  };

  const onEmoSelection = () => {
    const emotion = emotions.find((e) => e.name === selectedEmotion);
    if (emotion?.audioUrl && !isRecording && !isPlaying) {
      const audio = new Audio(emotion.audioUrl);
      audio.play();
      audio.onplay = () => {
        setIsPlaying(true);
      };
      audio.onended = () => {
        setIsPlaying(false);
      };
      return;
    }
    if (isRecording) {
      onStopRecording();
    } else if (!isPlaying) {
      handleMicClick();
    }
  };

  const getSelectedIndex = (name: string | null) => {
    if (!name) return 0;
    return emotions.findIndex((e) => e.name === name);
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Header isRecording={isRecording}>
        {isRecording ? (
          <>
            Recording
            <span className="recording-dot" />
          </>
        ) : (
          "Choose an emotion to Record your voice"
        )}
      </Header>
      <SubHeader>
        {isRecording ? "Say the words into the mic" : "Click the mic to record"}
      </SubHeader>

      <Container
        ref={containerRef}
        onMouseMove={handleMouseMove}
        isShrinked={isRecording}
      >
        <SelectionArea
          selectedIndex={getSelectedIndex(selectedEmotion)}
          angle={selectionAngle}
          sx={{
            opacity: isRecording ? 0 : 1,
            cursor: "pointer",
          }}
          onClick={handleMicClick}
        />
        <InnerCircle
          onMouseMove={(e) => e.stopPropagation()}
          sx={{
            width: isRecording ? "100%" : 80,
            height: isRecording ? "100%" : 80,
            // border: isRecording ? "2px solid red" : "none",
            transition: (theme) =>
              theme.transitions.create(["width", "height"], {
                duration: theme.transitions.duration.standard,
              }),
            ...(isRecording && {
              animation: "pulse 1.5s ease-in-out infinite",
            }),
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
          }}
          onClick={onEmoSelection}
        >
          {isPlaying ? (
            <Typography sx={{ fontSize: 38, cursor: "pointer" }}>
              <Box
                component="span"
                sx={{
                  display: "flex",
                  gap: 0.5,
                  "& .dot": {
                    width: 8,
                    height: 8,
                    backgroundColor: "#00ffff",
                    borderRadius: "50%",
                    animation: "bounce 1.4s infinite ease-in-out",
                    "&:nth-of-type(1)": {
                      animationDelay: "0s",
                    },
                    "&:nth-of-type(2)": {
                      animationDelay: "0.2s",
                    },
                    "&:nth-of-type(3)": {
                      animationDelay: "0.4s",
                    },
                  },
                  "@keyframes bounce": {
                    "0%, 80%, 100%": {
                      transform: "scale(0)",
                    },
                    "40%": {
                      transform: "scale(1)",
                    },
                  },
                }}
              >
                <Box className="dot" />
                <Box className="dot" />
                <Box className="dot" />
              </Box>
            </Typography>
          ) : isRecording ? (
            <Box sx={{ position: "relative", cursor: "pointer" }}>
              {/* Blurred stop button background */}
              <Box
                sx={{
                  position: "absolute",
                  width: 25,
                  height: 25,
                  backgroundColor: "unset",
                  borderRadius: 1,
                  filter: "blur(2px)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                  animation: "blurChange 1.5s ease-in-out forwards",
                  "@keyframes blurChange": {
                    from: { backgroundColor: "unset" },
                    to: { backgroundColor: "#00ffff" },
                  },
                }}
              />
              {/* Emoji overlay */}
              <Typography
                sx={{
                  opacity: 1,
                  animation: "sizeChange 1.5s ease-in-out forwards",
                  "@keyframes sizeChange": {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                  },
                  fontSize: 38,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {emotions.find((e) => e.name === selectedEmotion)?.emoji}
              </Typography>
            </Box>
          ) : emotions.find((e) => e.name === selectedEmotion)?.audioUrl ? (
            <IconButton
              size="large"
              sx={{
                border: "2px solid #00ffff",
                color: "white",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 40 }} />
            </IconButton>
          ) : (
            <IconButton
              size="large"
              sx={{
                border: "2px solid #00ffff",
                color: "white",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              <MicIcon sx={{ fontSize: 40 }} />
            </IconButton>
          )}
        </InnerCircle>

        {!isRecording &&
          emotions.map((emotion) => (
            <EmotionBox
              key={emotion.name}
              angle={emotion.angle}
              isSelected={selectedEmotion === emotion.name}
              onClick={onEmoSelection}
            >
              {emotion.emoji}
            </EmotionBox>
          ))}
      </Container>
      <EmotionLabel isVisible={!!selectedEmotion}>
        {selectedEmotion || "-"}
      </EmotionLabel>
      {isRecording && selectedExample && (
        <ExampleText>{selectedExample}</ExampleText>
      )}
      {hasAudio && (
        <Stack
          spacing={2}
          sx={{
            mt: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "rgba(0, 255, 255, 0.1)",
              padding: "8px 16px",
              borderRadius: "16px",
              border: "1px solid rgba(0, 255, 255, 0.2)",
            }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#00ffff",
                textShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
                fontFamily: "monospace",
              }}
            >
              {Math.round(
                (emotions.filter((e) => e.audioUrl).length / emotions.length) *
                  100
              )}
              %
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: "0.7rem",
                }}
              >
                Completion
              </Typography>
              <Box
                sx={{
                  width: 100,
                  height: 4,
                  backgroundColor: "rgba(0, 255, 255, 0.1)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${
                      (emotions.filter((e) => e.audioUrl).length /
                        emotions.length) *
                      100
                    }%`,
                    height: "100%",
                    backgroundColor: "#00ffff",
                    transition: "width 0.3s ease-in-out",
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
                    animation: "pulse 2s infinite",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.7rem",
                }}
              >
                {`${emotions.filter((e) => e.audioUrl).length}/${
                  emotions.length
                } Emotions`}
              </Typography>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: 300,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgba(0, 255, 255, 0.5)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 255, 255, 0.8)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              Skip & Publish
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default ChooseOptions;
