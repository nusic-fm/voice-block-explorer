import { Box } from "@mui/material";
import KrakenEffect from "./components/KrakenEffect";
import { useState } from "react";
import EmotionSphere from "./components/EmotionSphere";
import "./app.css";
import { UserVoiceSample } from "./services/db/userVoice.service";
import EmotionWheel from "./components/EmotionWheel";
import TtsSmartBox from "./components/TtsSmartBox";
import AnimatedTabs from "./components/AnimatedTabs";

export type TwitterResult = {
  id: string;
  text: string;
  videoId: string;
  videoPreview: string;
  videoUrl: string;
  views: number;
  likes: number;
  username: string;
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<"emotionWheel" | "tts">(
    "emotionWheel"
  );
  const [isKrakenLoading, setIsKrakenLoading] = useState<boolean>(false);
  const [showEmotionSphere, setShowEmotionSphere] = useState<boolean>(false);
  const [userVoiceInfo, setUserVoiceInfo] = useState<UserVoiceSample | null>(
    null
  );

  // const onGenerate = async (speakerPath: string) => {
  //   setIsKrakenLoading(true);
  //   const _voice: Voice = {
  //     audioPath: speakerPath,
  //     name: nftInfo?.name || "---",
  //     symbol: nftInfo?.symbol || "---",
  //     jobId: jobInfo.id,
  //     audioUrl: getSpeakerAudioUrl(jobInfo.id, speakerPath),
  //     isNFTDeployed: false,
  //     yVid: selectedVideo?.videoId,
  //     tweetTitle: selectedVideo?.text,
  //     twitterUsername: selectedVideo?.username,
  //     tweetId: selectedVideo?.id,
  //     tweetVideoUrl: selectedVideo?.videoUrl,
  //     emoji: nftInfo?.emoji || randomEmoji(),
  //     duration: Math.floor(Math.random() * 60) + 60,
  //   };
  //   const voiceId = await createVoice(_voice);
  //   setConversations((prev) => [
  //     ...prev,
  //     { isUser: false, content: `Creating your NFT...` },
  //   ]);
  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_AGENT_SERVER_URL}/deploy-nft`,
  //       {
  //         voice_name: nftInfo?.name,
  //         nft_name: nftInfo?.name,
  //         nft_symbol: nftInfo?.symbol,
  //       }
  //     );
  //     const tx = res.data.tx;
  //     if (tx) {
  //       setSelectedVoice({ ..._voice, id: voiceId });
  //       setConversations((prev) => [
  //         ...prev,
  //         {
  //           isUser: false,
  //           content: `Your NFT is deployed!`,
  //           link: `${import.meta.env.VITE_BASESCAN_URL}/${tx}`,
  //           isHighlight: true,
  //         },
  //         {
  //           isUser: false,
  //           content: `You can now do Text to Speech with your Audio Dataset! Type in something to hear it in the chosen voice!`,
  //           isHighlight: true,
  //         },
  //       ]);
  //       setShowTts(true);
  //     } else {
  //       setConversations((prev) => [
  //         ...prev,
  //         {
  //           isUser: false,
  //           content: `Error deploying your NFT, please try again later.`,
  //         },
  //       ]);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setIsKrakenLoading(false);
  //     // setShowEmotionSphere(true);
  //   }
  // };

  const onEncrypt = async () => {
    // TODO: Audio Analyzer /encode-hash
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
              {currentTab === "emotionWheel" && <EmotionWheel />}
              {currentTab === "tts" && <TtsSmartBox />}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default App;
