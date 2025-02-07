import { Box, Button, Stack } from "@mui/material";
import "./app.css";
import AudioExplorerChat from "./components/AudioExplorerChat";
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

export type AudioFile = {
  filename: string;
  name: string;
  source: string;
  emoji: string;
  duration: string;
};

const App: React.FC = () => {
  const [youtubeResults, setYoutubeResults] = useState<
    { url: string; title: string; id: string; description: string }[]
  >([]);
  const [isKrakenLoading, setIsKrakenLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<
    {
      isUser: boolean;
      content: string;
    }[]
  >([]);
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
  // const [audioFiles, setAudioFiles] = useState<AudioFile[]>([
  //   {
  //     filename: "sample1.mp3",
  //     name: "Happy",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😀",
  //     duration: "0:10",
  //   },
  //   {
  //     filename: "sample2.mp3",
  //     name: "Angry",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😤",
  //     duration: "0:02",
  //   },
  //   {
  //     filename: "sample3.mp3",
  //     name: "Disgusted",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🤮",
  //     duration: "0:03",
  //   },
  //   {
  //     filename: "sample4.mp3",
  //     name: "Mindblown",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🤯",
  //     duration: "0:05",
  //   },
  //   {
  //     filename: "sample5.mp3",
  //     name: "Cool",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😎",
  //     duration: "0:04",
  //   },
  //   {
  //     filename: "sample6.mp3",
  //     name: "In Love",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😍",
  //     duration: "0:04",
  //   },
  //   {
  //     filename: "sample7.mp3",
  //     name: "Typical",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🙄",
  //     duration: "0:03",
  //   },
  //   {
  //     filename: "sample8.mp3",
  //     name: "Shocking",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😱",
  //     duration: "0:04",
  //   },
  //   {
  //     filename: "sample9.mp3",
  //     name: "Welling Up",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🥹",
  //     duration: "0:04",
  //   },
  //   {
  //     filename: "sample10.mp3",
  //     name: "Unhappy",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😢",
  //     duration: "0:05",
  //   },
  //   {
  //     filename: "sample11.mp3",
  //     name: "Hmmmm",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🤔",
  //     duration: "0:09",
  //   },
  //   {
  //     filename: "sample12.mp3",
  //     name: "Giggles",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🤭",
  //     duration: "0:04",
  //   },
  //   {
  //     filename: "sample13.mp3",
  //     name: "Dizzy",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😵‍💫",
  //     duration: "0:02",
  //   },
  //   {
  //     filename: "sample14.mp3",
  //     name: "Noooo",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🫣",
  //     duration: "0:03",
  //   },
  //   {
  //     filename: "sample15.mp3",
  //     name: "Sad",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "☹️",
  //     duration: "0:08",
  //   },
  //   {
  //     filename: "sample16.mp3",
  //     name: "Laughing",
  //     source: "https://www.youtube.com/watch?v=XEbhjrGyKuE&t=21s",
  //     emoji: "😂",
  //     duration: "0:01",
  //   },
  //   {
  //     filename: "sample17.mp3",
  //     name: "Cuddles",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🤗",
  //     duration: "0:03",
  //   },
  //   {
  //     filename: "sample18.mp3",
  //     name: "Shhhh",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "🤫",
  //     duration: "0:04",
  //   },
  //   {
  //     filename: "sample19.mp3",
  //     name: "Oh no!",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😵",
  //     duration: "0:03",
  //   },
  //   {
  //     filename: "sample20.mp3",
  //     name: "Surprise",
  //     source: "https://youtu.be/dQw4w9WgXcQ",
  //     emoji: "😲",
  //     duration: "0:02",
  //   },
  // ]);
  // const [selectedNode, setSelectedNode] = useState<AudioFile | null>(null);
  // const [audioNodes, setAudioNodes] = useState<LocalAudioNode[]>([]);
  const fetchSpeakersUrl = async (video_url: string) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_AGENT_SERVER_URL
        }/youtube-video-speakers-extraction`,
        { video_url }
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
    } catch (e) {
      console.log(e);
    } finally {
      // setIsKrakenLoading(false);
    }
  };

  const onVideoSelected = async (video: {
    url: string;
    title: string;
    id: string;
    description: string;
  }) => {
    setYoutubeResults([]);
    setIsKrakenLoading(true);
    setConversations((prev) => [
      ...prev,
      { isUser: false, content: `Processing your selection...` },
    ]);
    await fetchSpeakersUrl(video.url);
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
      name: "New Voice",
      emotion: "Happy",
      slug: "new-voice",
      jobId: jobInfo.id,
      audioUrl: getSpeakerAudioUrl(jobInfo.id, speakerPath),
    });
    setConversations((prev) => [
      ...prev,
      { isUser: false, content: `Your NFT has been created!` },
    ]);
    setIsKrakenLoading(false);
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
          ) : youtubeResults.length ? (
            <Box height={"100%"} display={"flex"} alignItems={"center"}>
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"center"}
                // alignItems={"center"}
                // height={"100%"}
                gap={4}
              >
                {youtubeResults.map((result) => (
                  <VideoOption
                    key={result.id}
                    video={result}
                    onVideoSelected={onVideoSelected}
                  />
                ))}
              </Stack>
            </Box>
          ) : (
            <Box></Box>
          )}
        </Box>
      </Box>
      <Box
        width={"400px"}
        height={"100%"}
        ml={"auto"}
        borderLeft={"1px solid rgba(0, 255, 255, 0.2)"}
        px={1}
      >
        <AudioExplorerChat
          youtubeResults={youtubeResults}
          setYoutubeResults={setYoutubeResults}
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
