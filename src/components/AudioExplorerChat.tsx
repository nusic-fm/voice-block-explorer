import { LoadingButton } from "@mui/lab";
import {
  Stack,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
  youtubeResults: { url: string; title: string; id: string }[];
  setYoutubeResults: (
    results: {
      url: string;
      title: string;
      id: string;
      description: string;
    }[]
  ) => void;
  onLoadingStarted: () => void;
  onLoadingCompleted: () => void;
  conversations: {
    isUser: boolean;
    content: string;
  }[];
  setConversations: React.Dispatch<
    React.SetStateAction<
      {
        isUser: boolean;
        content: string;
      }[]
    >
  >;
};

const AudioExplorerChat = ({
  youtubeResults,
  setYoutubeResults,
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
        `${import.meta.env.VITE_AGENT_SERVER_URL}/voice-youtube-results`,
        {
          voice_name: searchText,
        }
      );
      setYoutubeResults(response.data);
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
        <Divider />
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
                    <Chip label={conversation.content} />
                  </Box>
                ) : (
                  <Box display={"flex"} gap={2} alignItems={"start"}>
                    <img
                      src={"favicon.png"}
                      alt="agent"
                      width={30}
                      height={30}
                    />
                    <Typography variant="subtitle1">
                      {conversation.content}
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
      {(!!voiceName || youtubeResults.length === 0) && (
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
