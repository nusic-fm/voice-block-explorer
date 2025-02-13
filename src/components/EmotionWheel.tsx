import React, { useState, useRef } from "react";
import { Box, IconButton, Stack, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { LoadingButton } from "@mui/lab";
import { ConnectKitButton } from "connectkit";

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

type Emotion = {
  emoji: string;
  name: string;
  examples: string[];
  audioUrl: string | null;
  angle: number;
  audioBlob: Blob;
};

const emotionsData = getAngles([
  {
    emoji: "😐",
    name: "neutral",
    examples: [
      "I don't really feel strongly about this one way or the other.",
      "It's just another regular day, nothing too exciting or upsetting.",
      "I'm just going with the flow, not much to react to right now.",
    ],
    audioUrl: null,
  },
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
    emoji: "🤝",
    name: "trust",
    examples: [
      "I know I can count on you. You've always been there for me.",
      "This feels right. I have complete confidence in how things will turn out.",
      "I feel safe and supported. There's no doubt in my mind that we're in this together.",
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
    emoji: "🤢",
    name: "disgust",
    examples: [
      "Ugh, that's absolutely revolting! I can't even look at it.",
      "I feel so uncomfortable just thinking about this. It's making my skin crawl.",
      "This is just wrong on so many levels. I want nothing to do with it.",
    ],
    audioUrl: null,
  },
  {
    emoji: "⏳",
    name: "anticipation",
    examples: [
      "I can feel something big coming! The suspense is killing me!",
      "I'm counting down the days. I know it's going to be worth the wait!",
      "I have a feeling that something amazing is just around the corner.",
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
})<{ angle: number; selectedIndex: number }>(({ theme, selectedIndex }) => {
  // TODO
  // Calculate angle per slice based on emotions length
  const sliceAngle = 360 / emotionsData.length;

  // Generate the conic gradient for the selected slice
  const conicGradient = `conic-gradient(
    from ${270 + (selectedIndex + 2) * sliceAngle}deg,
    ${theme.palette.primary.main}20 0deg,
    ${theme.palette.primary.main}20 ${sliceAngle}deg,
    transparent ${sliceAngle}deg,
    transparent 360deg
  )`;

  // // Generate the dividing lines gradients
  // const dividerLines = Array.from({ length: emotionsData.length })
  //   .map((_, index) => {
  //     const angle = (360 / emotionsData.length) * index;
  //     return `linear-gradient(${angle}deg, transparent 49.5%, ${theme.palette.primary.main}20 49.5%, ${theme.palette.primary.main}20 50.5%, transparent 50.5%)`;
  //   })
  //   .join(",");

  return {
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
      background: conicGradient,
      borderRadius: "50%",
    },
    // "&::after": {
    //   content: '""',
    //   position: "absolute",
    //   top: 0,
    //   left: 0,
    //   width: "100%",
    //   height: "100%",
    //   background: dividerLines,
    //   borderRadius: "50%",
    // },
  };
});

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
  shouldForwardProp: (prop) =>
    prop !== "isSelected" && prop !== "angle" && prop !== "isAdded",
})<{ isSelected?: boolean; angle: number; isAdded: boolean }>(
  ({ theme, isSelected, angle, isAdded }) => ({
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
      isSelected ? "scale(1.2)" : "scale(1)"
    }`,
    backgroundColor: isAdded
      ? "#4caf50"
      : isSelected
      ? theme.palette.action.selected
      : "transparent",
    zIndex: 1,
    cursor: "pointer",
  })
);

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
  visibility: isVisible ? "visible" : "hidden",
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
type Props = {
  onEncrypt: (
    voiceName: string,
    emotionIds: string[],
    audioBlobs: Blob[]
  ) => void;
  isConnected: boolean;
};
const ChooseOptions: React.FC<Props> = ({ onEncrypt, isConnected }) => {
  const [emotions, setEmotions] = useState<Emotion[]>(emotionsData);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(
    "neutral"
  );
  const [selectionAngle, setSelectionAngle] = useState(0);
  const [selectedExample, setSelectedExample] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [freezeSelectionChange, setFreezeSelectionChange] = useState(false);
  const hasAudio = emotions.filter((e) => e.audioUrl).length > 0;
  const [isTutorialMode, setIsTutorialMode] = useState(true);
  // const [showTutorialTooltip, setShowTutorialTooltip] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const playableAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [voiceName, setVoiceName] = useState<string>("");

  const displayedEmotions = isTutorialMode
    ? emotions.filter((e) => e.name === "neutral")
    : emotions;

  const handleMicClick = async () => {
    if (isTutorialMode && tutorialStep === 0) {
      setSelectedEmotion("neutral");
      // setShowTutorialTooltip(true);
      setTutorialStep(1);
    }
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
      setIsRecording(true);
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
        const audioUrl = URL.createObjectURL(audioBlob);
        setEmotions((prevEmotions) =>
          prevEmotions.map((emotion) =>
            emotion.name === selectedEmotion
              ? { ...emotion, audioUrl, audioBlob }
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
    if (isTutorialMode) {
      setIsTutorialMode(false);
      // setShowTutorialTooltip(false);
    }
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
    if (isRecording || freezeSelectionChange || isTutorialMode) return;
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
      playableAudioRef.current = audio; // TODO
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
        {isTutorialMode
          ? "Let's start with a simple emotion"
          : "Choose an emotion to Record your voice"}
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
            "& .MuiIconButton-root": {
              animation:
                isTutorialMode && tutorialStep === 0
                  ? "blinkAttention 1.5s infinite"
                  : "none",
            },
            "@keyframes blinkAttention": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": {
                transform: "scale(1.2)",
                background: "rgba(0, 255, 255, 0.4)",
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
          displayedEmotions.map((emotion) => (
            <EmotionBox
              key={emotion.name}
              angle={emotion.angle}
              isSelected={selectedEmotion === emotion.name}
              onClick={onEmoSelection}
              isAdded={!!emotion.audioUrl}
            >
              {emotion.emoji}
            </EmotionBox>
          ))}
      </Container>
      <EmotionLabel
        isVisible={!!selectedEmotion && (!isTutorialMode || !isRecording)}
      >
        {selectedEmotion || "-"}
      </EmotionLabel>
      {isRecording && selectedExample && (
        <Stack sx={{ position: "relative" }} alignItems="center">
          <ExampleText
            sx={{
              position: "relative",
              color: isTutorialMode ? "primary.main" : "text.primary",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 255, 255, 0.1)",
                animation: isTutorialMode
                  ? "highlightPulse 2s infinite"
                  : "none",
                borderRadius: "4px",
                zIndex: -1,
              },
              animation: isTutorialMode ? "scaleText 2s infinite" : "none",
              "@keyframes highlightPulse": {
                "0%, 100%": {
                  background: "rgba(0, 255, 255, 0.1)",
                },
                "50%": {
                  background: "rgba(0, 255, 255, 0.3)",
                },
              },
              "@keyframes scaleText": {
                "0%, 100%": {
                  transform: "scale(1)",
                },
                "50%": {
                  transform: "scale(1.05)",
                },
              },
            }}
          >
            {selectedExample}
          </ExampleText>

          <Box
            sx={{
              mt: 2,
              p: 1.5,
              backgroundColor: "rgba(0, 255, 255, 0.05)",
              borderRadius: 2,
              border: "1px solid rgba(0, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                color: "rgba(0, 255, 255, 0.8)",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              PRO TIP:
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
              }}
            >
              Use mic to record without background noise
            </Typography>
          </Box>
        </Stack>
      )}
      {hasAudio && !isRecording && (
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

          {!isTutorialMode && (
            <TextField
              label="Voice Name"
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              sx={{
                width: "100%",
                maxWidth: 300,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(0, 255, 255, 0.8)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                "& .MuiInputBase-input": {
                  color: "white",
                },
              }}
            />
          )}

          <Stack
            direction="row"
            spacing={2}
            sx={{
              width: "100%",
              maxWidth: 300,
              justifyContent: "center",
            }}
          >
            {!isConnected ? (
              <ConnectKitButton />
            ) : (
              <LoadingButton
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
                onClick={async () => {
                  if (!voiceName) {
                    alert("Please enter a voice name");
                    return;
                  }
                  const emotionsIds: string[] = [];
                  const audioBlobs: Blob[] = [];
                  emotions.map((e) => {
                    if (e.audioBlob) {
                      emotionsIds.push(e.name);
                      audioBlobs.push(e.audioBlob);
                    }
                  });
                  setFreezeSelectionChange(true);
                  setIsEncrypting(true);
                  await onEncrypt(voiceName, emotionsIds, audioBlobs);
                  setIsEncrypting(false);
                  setFreezeSelectionChange(false);
                }}
                loading={isEncrypting}
              >
                {isConnected ? "Encrypt" : "Connect Wallet & Encrypt"}
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      )}

      {/* {showTutorialTooltip && isRecording && (
        <Box
          sx={{
            // position: "absolute",
            // top: "90%",
            // left: "50%",
            // transform: "translate(-50%, 0)",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            padding: 2,
            borderRadius: 2,
            border: "1px solid rgba(0, 255, 255, 0.3)",
            backdropFilter: "blur(4px)",
            maxWidth: 300,
            textAlign: "center",
            animation: "fadeIn 0.3s ease-in-out",
            zIndex: 10,
            "&::before": {
              content: '""',
              position: "absolute",
              top: -8,
              left: "50%",
              transform: "translateX(-50%)",
              borderStyle: "solid",
              borderWidth: "0 8px 8px 8px",
              borderColor:
                "transparent transparent rgba(0, 255, 255, 0.3) transparent",
            },
          }}
        >
          <Typography>
            Say this example out loud while recording and then hit stop
          </Typography>
        </Box>
      )} */}
    </Box>
  );
};

export default ChooseOptions;
