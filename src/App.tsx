import { Box, Button } from "@mui/material";
import KrakenEffect from "./components/KrakenEffect";
import { useState } from "react";
import EmotionSphere from "./components/EmotionSphere";
import "./app.css";
import { createUserVoiceSample } from "./services/db/userVoice.service";
import EmotionWheel from "./components/EmotionWheel";
import TtsSmartBox from "./components/TtsSmartBox";
import AnimatedTabs from "./components/AnimatedTabs";
import { uploadUserVoiceSample } from "./services/storage/userUploads.storage";
import { useAccount } from "wagmi";

export type VoiceEmotion = {
  name: string;
  userId: string;
  emotionId: string;
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"emotionWheel" | "tts">(
    "emotionWheel"
  );
  const [isKrakenLoading, setIsKrakenLoading] = useState<boolean>(false);
  const [showEmotionSphere, setShowEmotionSphere] = useState<boolean>(false);
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const { address, isConnected } = useAccount();

  const onEncrypt = async (emotionIds: string[], audioBlobs: Blob[]) => {
    if (address && isConnected) {
      // TODO: Audio Analyzer /encode-hash
      setIsAudioUploading(true);
      await createUserVoiceSample({
        address,
        emotionIds,
        name: address.slice(address.length - 6),
      });
      emotionIds.forEach(async (emotionId, index) => {
        await uploadUserVoiceSample(
          audioBlobs[index],
          `${address}/${emotionId}.mp3`
        );
      });
      setIsAudioUploading(false);
    }
  };

  return (
    <Box
      height="100vh"
      width={"100vw"}
      display={"flex"}
      sx={{
        background: "rgba(10, 10, 18, 0.96)",
        backdropFilter: "blur(20px)",
      }}
    >
      <Box width={"100%"} position={"relative"} height={"100%"}>
        {showEmotionSphere ? (
          <EmotionSphere />
        ) : (
          <>
            <KrakenEffect isLoading={isKrakenLoading} onVoiceReady={() => {}} />
            <AnimatedTabs
              tabs={["emotionWheel", "tts"]}
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />
            <Box
              position={"relative"}
              height={"100%"}
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              zIndex={99}
            >
              {currentTab === "emotionWheel" && (
                <EmotionWheel onEncrypt={onEncrypt} isConnected={isConnected} />
              )}
              {currentTab === "tts" && <TtsSmartBox />}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default App;
