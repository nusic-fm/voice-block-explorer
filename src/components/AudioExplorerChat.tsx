import { LoadingButton } from "@mui/lab";
import {
  Stack,
  Typography,
  Box,
  TextField,
  Divider,
  Link,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { TwitterResult } from "../App";

export type Conversation = {
  isUser: boolean;
  content: string;
  isHighlight?: boolean;
  isError?: boolean;
  link?: string;
};

type Props = {
  twitterResults: TwitterResult[];
  setTwitterResults: React.Dispatch<React.SetStateAction<TwitterResult[]>>;
  onLoadingStarted: () => void;
  onLoadingCompleted: () => void;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
};

const AudioExplorerChat = ({
  twitterResults,
  setTwitterResults,
  onLoadingStarted,
  onLoadingCompleted,
  conversations,
  setConversations,
}: Props) => {
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessStarted, setIsProcessStarted] = useState<boolean>(false);

  const handleSend = async () => {
    setIsLoading(true);
    setIsProcessStarted(true);
    setConversations((prev) => [
      ...prev,
      { isUser: true, content: currentPrompt },
    ]);
    // setPrompts([...prompts, currentPrompt]);
    // await fetchAndSetAnswer(currentPrompt);
    await fetchYoutubeResults();
    setIsLoading(false);
  };

  // const fetchAndSetAnswer = async (prompt: string) => {
  //   setIsLoading(true);
  //   const response = await axios.post(
  //     `${import.meta.env.VITE_AGENT_SERVER_URL}/text-to-voicename`,
  //     {
  //       text: prompt,
  //     }
  //   );
  //   setIsLoading(false);
  //   const { voice_name } = response.data;
  //   if (voice_name === "None") {
  //     setAnswers([
  //       ...answers,
  //       {
  //         type: "helper",
  //         content: `Oh no! I couldn't find a voice name for that. Here are some suggestions:`,
  //       },
  //     ]);
  //     await fetchYoutubeResults();
  //   } else {
  //     setVoiceName(response.data.voiceName);
  //     setAnswers([
  //       ...answers,
  //       {
  //         type: "voiceName",
  //         content: `oh yeah! We are looking through youtube to find ${response.data.voiceName} voice clips`,
  //       },
  //     ]);
  //   }
  // };
  const fetchYoutubeResults = async () => {
    setIsLoading(true);
    const searchText = currentPrompt;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AGENT_SERVER_URL}/find-twitter-videos`,
        {
          text: searchText,
        }
      );
      setTwitterResults(response.data);
      setConversations((prev) => [
        ...prev,
        {
          isUser: false,
          content: `I found several versions of "${searchText}"... please select one or feel free to paste a Youtube url in the chat`,
        },
      ]);
    } catch (error) {
      console.error(error);
      setConversations((prev) => [
        ...prev,
        {
          isUser: false,
          content: "Oh no! I couldn't find any results. try again later!",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) {
      onLoadingStarted();
    } else {
      onLoadingCompleted();
    }
  }, [isLoading]);

  return (
    <Stack gap={2} height="100%" width={"100%"} py={2}>
      <Stack gap={2}>
        <Typography variant="h6" align="center">
          Audio Explorer Chat
        </Typography>
        <Divider sx={{ borderColor: "rgba(0, 255, 255, 0.2)" }} />
        <Stack gap={2}>
          <Typography>
            Welcome! I can help you explore the audio samples. What would you
            like to know?
          </Typography>
          {/* {!isProcessStarted ? (
          ) : ( */}
          <Stack gap={2}>
            {conversations.map((conversation, index) => (
              <Stack gap={2}>
                {conversation.isUser ? (
                  <Box display={"flex"} justifyContent={"end"}>
                    <Box
                      sx={{
                        backgroundColor: "primary.main",
                        borderRadius: "20px 20px 4px 20px",
                        padding: "6px 12px",
                        maxWidth: "80%",
                        color: "primary.contrastText",
                        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        alignSelf: "flex-end",
                      }}
                    >
                      <Typography color="black">
                        {conversation.content}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    display={"flex"}
                    gap={2}
                    alignItems={"start"}
                    sx={{
                      opacity: conversations.length - 3 < index ? 1 : 0.6,
                    }}
                  >
                    <img
                      src={"favicon.png"}
                      alt="agent"
                      width={30}
                      height={30}
                    />
                    <Typography variant="subtitle1">
                      {conversation.isHighlight && <span>✨</span>}{" "}
                      {conversation.isError && <span>🚨</span>}{" "}
                      {conversation.content}{" "}
                      {conversation.link && (
                        <Link href={conversation.link} target="_blank">
                          View on BaseScan
                        </Link>
                      )}
                    </Typography>
                  </Box>
                )}
              </Stack>
            ))}
          </Stack>
          {/* )} */}
          {/* ))} */}
          {/* {youtubeResults.length > 0 && (
            <Stack gap={2}>
              <Box
                display={"flex"}
                gap={1}
                flexWrap={"wrap"}
                justifyContent={"center"}
              >
                {youtubeResults.map((result) => (
                  // TODO: Render youtube video with a choose button
                  <Stack key={result.id}>
                    <iframe
                      key={result.id}
                      width="300"
                      height="200"
                      src={`https://www.youtube.com/embed/${result.id}`}
                      title={result.title}
                      frameBorder="0"
                      allowFullScreen
                    />
                    <Button
                      variant="outlined"
                      onClick={() => fetchSpeakersUrl(result.url)}
                    >
                      Choose
                    </Button>
                  </Stack>
                ))}
              </Box>
            </Stack>
          )} */}
        </Stack>
      </Stack>
      {twitterResults.length === 0 && !isProcessStarted && (
        <Box
          marginTop="auto"
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={2}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Find your character"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            disabled={isLoading || !!voiceName}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            onClick={handleSend}
            disabled={isLoading || !!voiceName}
          >
            Send
          </LoadingButton>
        </Box>
      )}
    </Stack>
  );
};

export default AudioExplorerChat;
