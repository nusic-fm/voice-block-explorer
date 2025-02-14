import { Box, Snackbar, Typography } from "@mui/material";
import KrakenEffect from "./components/KrakenEffect";
import { useEffect, useState } from "react";
import EmotionSphere from "./components/EmotionSphere";
import "./app.css";
import { createUserVoiceSample } from "./services/db/userVoice.service";
import EmotionWheel from "./components/EmotionWheel";
import TtsSmartBox from "./components/TtsSmartBox";
import AnimatedTabs from "./components/AnimatedTabs";
import { uploadUserVoiceSample } from "./services/storage/userUploads.storage";
import { useAccount } from "wagmi";
import { useNFTContract } from "./services/contracts/NFTFactory";

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
  const { deployNft, isPending, isSuccess, isError, hash } = useNFTContract({
    contractAddress: import.meta.env.VITE_STORY_NFT_FACTORY_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: "string",
            name: "_voiceName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_name",
            type: "string",
          },
          {
            internalType: "string",
            name: "_symbol",
            type: "string",
          },
          {
            internalType: "string",
            name: "_baseUri",
            type: "string",
          },
        ],
        name: "deployAIVoiceNFT",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  });
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const onEncrypt = async (
    voiceName: string,
    emotionIds: string[],
    audioBlobs: Blob[]
  ) => {
    if (address && isConnected) {
      // TODO: Audio Analyzer /encode-hash
      setIsAudioUploading(true);
      await createUserVoiceSample({
        address,
        emotionIds,
        name: voiceName,
      });
      emotionIds.forEach(async (emotionId, index) => {
        await uploadUserVoiceSample(
          audioBlobs[index],
          `${address}/${emotionId}.mp3`
        );
      });
      // Make a tx to smart contract
      await deployNft(
        voiceName,
        voiceName,
        voiceName.slice(0, 3).toUpperCase(),
        ""
      );
      setIsAudioUploading(false);
    }
  };

  useEffect(() => {
    if (isSuccess && hash) {
      setSnackbarMessage(hash);
    }
  }, [hash]);

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
              {isPending && <Typography>Deploying on Story...</Typography>}
              {currentTab === "emotionWheel" && !isPending && (
                <EmotionWheel onEncrypt={onEncrypt} isConnected={isConnected} />
              )}
              {currentTab === "tts" && !isPending && <TtsSmartBox />}
            </Box>
          </>
        )}
      </Box>
      <Snackbar
        open={snackbarMessage !== ""}
        onClose={() => setSnackbarMessage("")}
        disableWindowBlurListener
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        message={
          <Typography
            component="a"
            sx={{
              color: "black",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            href={`https://aeneid.storyscan.xyz/tx/${snackbarMessage}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Story
          </Typography>
        }
      />
    </Box>
  );
};

export default App;
