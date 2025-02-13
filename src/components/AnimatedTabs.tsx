import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { styled } from "@mui/system";

const TabButton = styled(Button)(({ theme }) => ({
  //   color: "rgba(255, 255, 255, 0.6)",
  padding: "12px 24px",
  fontSize: "1rem",
  position: "relative",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const AnimatedUnderline = styled(motion.div)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "2px",
  background: "linear-gradient(90deg, #7928CA, #FF0080)",
});

interface AnimatedTabsProps {
  currentTab: "emotionWheel" | "tts";
  onTabChange: (tab: "emotionWheel" | "tts") => void;
  tabs: string[];
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  currentTab,
  onTabChange,
  tabs,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 2,
        padding: "8px",
        borderRadius: "12px",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 999,
      }}
    >
      <TabButton
        onClick={() => onTabChange("emotionWheel")}
        sx={{
          color: currentTab === "emotionWheel" ? "#00ffff" : "white",
        }}
      >
        Emotion Wheel
        {currentTab === "emotionWheel" && (
          <AnimatedUnderline
            layoutId="tab-underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </TabButton>
      <TabButton
        onClick={() => onTabChange("tts")}
        sx={{
          color: currentTab === "tts" ? "#00ffff" : "#fff",
        }}
      >
        Text to Speech
        {currentTab === "tts" && (
          <AnimatedUnderline
            layoutId="tab-underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </TabButton>
    </Box>
  );
};

export default AnimatedTabs;
