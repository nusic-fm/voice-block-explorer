import { Box, Stack } from "@mui/material";
import "./app.css";
import AudioExplorerChat, {
  Conversation,
} from "./components/AudioExplorerChat";
import KrakenEffect from "./components/KrakenEffect";
import { useState } from "react";
import VideoOption from "./components/VideoOption";
import axios from "axios";
import {
  getPyannoteJob,
  PyannoteJob,
} from "./services/db/pyannoteJobs.service";
import VoiceSamples from "./components/VoiceSamples";
import AnalyticsExplorer from "./components/AnalyticsExplorer";
import { createVoice } from "./services/db/voices.service";
import { getSpeakerAudioUrl } from "./helper";
import UploadAudio from "./components/UploadAudio";
import EmotionSphere from "./components/EmotionSphere";

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
  // const [youtubeResults, setYoutubeResults] = useState<
  //   { url: string; title: string; id: string; description: string }[]
  // >([]);
  const [twitterResults, setTwitterResults] = useState<TwitterResult[]>([]);
  const [isKrakenLoading, setIsKrakenLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<TwitterResult | null>(
    null
  );
  const [showEmotionSphere, setShowEmotionSphere] = useState<boolean>(false);
  // {
  //     id: "9d8bc06b-1261-4f1d-8e41-854d0e6f7da3",
  //     speakers: [
  //       "SPEAKER_00_combined.mp3",
  //       "SPEAKER_01_combined.mp3",
  //       "SPEAKER_02_combined.mp3",
  //     ],
  //     status: "completed",
  //     audioPath: "tts-yt-audio/9d8bc06b-1261-4f1d-8e41-854d0e6f7da3",
  //     audioUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/nusic-ai-agent.appspot.com/o/tts-yt-audio%2F9d8bc06b-1261-4f1d-8e41-854d0e6f7da3%2FSPEAKER_00_combined.mp3?alt=media&token=61111111-1111-1111-1111-111111111111",
  //   }
  const [jobInfo, setJobInfo] = useState<PyannoteJob | null>();
  const [nftInfo, setNftInfo] = useState<{
    name: string;
    symbol: string;
  } | null>(null);

  const fetchSpeakersUrl = async (
    video_url: string,
    isAudio: boolean = false,
    audio_path?: string,
    video_id?: string
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AGENT_SERVER_URL}/${
          isAudio ? "speakers-extraction" : "video-speakers-extraction"
        }`,
        isAudio ? { audio_url: video_url, audio_path } : { video_url, video_id }
      );
      const { jobId } = response.data;
      getPyannoteJob(jobId, (job) => {
        const speakers = job?.speakers;
        if (speakers && speakers?.length > 0) {
          setJobInfo(job);
          setIsKrakenLoading(false);
          setConversations((prev) => [
            ...prev,
            {
              isUser: false,
              content:
                speakers.length > 1
                  ? `There was more than one voice in that video, could you listen to these clips and select which voice it is you wish your agent to have?`
                  : `One speaker detected. Click Generate to create your NFT...`,
            },
          ]);
        }
      });
      if (selectedVideo || conversations.length > 0) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_AGENT_SERVER_URL}/fetch-nft-info`,
            {
              text: conversations[0].content,
            }
          );
          console.log(response.data);
          const { nftInfo } = response.data;
          setNftInfo(nftInfo);
          setConversations((prev) => [
            ...prev,
            {
              isUser: false,
              content: `My suggestion for the name of your NFT is: ${nftInfo.name} (symbol: ${nftInfo.symbol})`,
              isHighlight: true,
            },
          ]);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e: any) {
      setIsKrakenLoading(false);
      if (e.response.data.type === "VIDEO_DOWNLOAD") {
        setShowUpload(true);
        setConversations((prev) => [
          ...prev,
          {
            isUser: false,
            content: "Oh uh! One of the services is down!",
            isError: true,
          },
          {
            isUser: false,
            content: "Meanwhile, you can try uploading the audio yourself",
            isHighlight: true,
          },
        ]);
      }
    } finally {
    }
  };

  const onVideoSelected = async (video: TwitterResult) => {
    setSelectedVideo(video);
    setTwitterResults([]);
    setIsKrakenLoading(true);
    setConversations((prev) => [
      ...prev,
      {
        isUser: false,
        content: `Processing your selection "${video.text}"`,
      },
    ]);
    await fetchSpeakersUrl(video.videoUrl, false, undefined, video.videoId);
  };

  const onGenerate = async (speakerPath: string) => {
    setIsKrakenLoading(true);

    setConversations((prev) => [
      ...prev,
      { isUser: false, content: `Generating your NFT...` },
    ]);
    if (!jobInfo?.id) return;
    await createVoice({
      audioPath: speakerPath,
      name: nftInfo?.name || "---",
      symbol: nftInfo?.symbol || "---",
      jobId: jobInfo.id,
      audioUrl: getSpeakerAudioUrl(jobInfo.id, speakerPath),
      isNFTDeployed: false,
      yVid: selectedVideo?.videoId,
      tweetTitle: selectedVideo?.text,
      twitterUsername: selectedVideo?.username,
      tweetId: selectedVideo?.id,
      tweetVideoUrl: selectedVideo?.videoUrl,
    });
    setConversations((prev) => [
      ...prev,
      { isUser: false, content: `Your NFT is being deployed!` },
    ]);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_AGENT_SERVER_URL}/deploy-nft`,
        {
          voice_name: nftInfo?.name,
          nft_name: nftInfo?.name,
          nft_symbol: nftInfo?.symbol,
        }
      );
      const tx = res.data.tx;
      if (tx) {
        setConversations((prev) => [
          ...prev,
          {
            isUser: false,
            content: `Your NFT is deployed!`,
            link: `${import.meta.env.VITE_BASESCAN_URL}/${tx}`,
            isHighlight: true,
          },
        ]);
      } else {
        setConversations((prev) => [
          ...prev,
          {
            isUser: false,
            content: `Error deploying your NFT, please try again later.`,
          },
        ]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsKrakenLoading(false);
      setShowEmotionSphere(true);
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
      <Box
        width={"400px"}
        height={"100%"}
        ml={"auto"}
        borderRight={"1px solid rgba(0, 255, 255, 0.2)"}
        px={1}
      >
        <AnalyticsExplorer />
      </Box>
      <Box width={"calc(100% - 800px)"} position={"relative"} height={"100%"}>
        {showEmotionSphere ? (
          <EmotionSphere />
        ) : (
          <>
            <KrakenEffect isLoading={isKrakenLoading} />
            <Box
              position={"relative"}
              height={"100%"}
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              zIndex={99}
            >
              {jobInfo?.speakers ? (
                <VoiceSamples
                  jobId={jobInfo.id}
                  speakers={jobInfo.speakers}
                  onGenerate={onGenerate}
                />
              ) : twitterResults.length || showUpload ? (
                <Box height={"100%"} display={"flex"} alignItems={"center"}>
                  <Stack
                    direction={"row"}
                    flexWrap={"wrap"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    height={"100%"}
                    gap={4}
                  >
                    {showUpload && (
                      <UploadAudio
                        onUploadStarted={() => setIsKrakenLoading(true)}
                        onUploadComplete={async (
                          url: string,
                          filename: string
                        ) => {
                          setShowUpload(false);
                          await fetchSpeakersUrl(url, true, filename);
                          // setIsKrakenLoading(false);
                        }}
                      />
                    )}
                    <Box
                      display={"flex"}
                      flexWrap={"wrap"}
                      gap={4}
                      height={"80%"}
                      px={1}
                      sx={{ overflowY: "auto" }}
                    >
                      {twitterResults.map((result) => (
                        <VideoOption
                          key={result.videoId}
                          video={result}
                          onVideoSelected={onVideoSelected}
                        />
                      ))}
                    </Box>
                  </Stack>
                </Box>
              ) : (
                <Box></Box>
              )}
            </Box>
          </>
        )}
      </Box>
      <Box
        width={"400px"}
        height={"100%"}
        ml={"auto"}
        borderLeft={"1px solid rgba(0, 255, 255, 0.2)"}
        px={1}
      >
        <AudioExplorerChat
          twitterResults={twitterResults}
          setTwitterResults={setTwitterResults}
          onLoadingStarted={() => setIsKrakenLoading(true)}
          onLoadingCompleted={() => setIsKrakenLoading(false)}
          conversations={conversations}
          setConversations={setConversations}
        />
      </Box>
    </Box>
  );
};

export default App;
