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
type Props = {};

const AudioExplorerChat = (props: Props) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [answers, setAnswers] = useState<
    {
      type: "voiceName" | "youtubeResults" | "helper";
      content: string;
      youtubeResults?: { url: string; title: string }[];
      suggestions?: string[];
    }[]
  >([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [youtubeResults, setYoutubeResults] = useState<
    { url: string; title: string; id: string }[]
  >([]);

  const handleSend = async () => {
    setIsLoading(true);
    setPrompts([...prompts, currentPrompt]);
    setCurrentPrompt("");
    await fetchAndSetAnswer(currentPrompt);
    setIsLoading(false);
  };

  const fetchAndSetAnswer = async (prompt: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_AGENT_SERVER_URL}/text-to-voicename`,
      {
        text: prompt,
      }
    );
    const { voice_name, suggestions } = response.data;
    if (voice_name === "None") {
      setAnswers([
        ...answers,
        {
          type: "helper",
          content: `Oh no! I couldn't find a voice name for that. Here are some suggestions:`,
          suggestions,
        },
      ]);
    } else {
      setVoiceName(response.data.voiceName);
      setAnswers([
        ...answers,
        {
          type: "voiceName",
          content: `oh yeah! We are looking through youtube to find ${response.data.voiceName} voice clips`,
        },
      ]);
    }
  };
  const fetchYoutubeResults = async () => {
    setIsLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_AGENT_SERVER_URL}/voice-youtube-results`,
      {
        voice_name: voiceName || prompts[0],
      }
    );
    // setAnswers([
    //   ...answers,
    //   { type: "youtubeResults", content: response.data },
    // ]);
    setYoutubeResults(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (voiceName) {
      fetchYoutubeResults();
    }
  }, [voiceName]);

  return (
    <Stack m={2} gap={2} height="100%" maxWidth={400}>
      <Stack gap={2}>
        <Typography variant="h6" align="center">
          Audio Explorer Chat
        </Typography>
        <Divider />
        <Stack gap={2}>
          {prompts.length === 0 && (
            <Typography>
              Welcome! I can help you explore the audio samples. What would you
              like to know?
            </Typography>
          )}
          {prompts.map((prompt, index) => (
            <Stack key={index} gap={2}>
              <Box display={"flex"} justifyContent={"end"}>
                <Chip label={prompt} />
              </Box>
              <Stack gap={2}>
                <Box display={"flex"} gap={1}>
                  <img src={"favicon.png"} alt="agent" width={30} height={30} />
                  <Typography>
                    {answers[index]?.content || "thinking..."}
                  </Typography>
                </Box>
                {answers[index]?.suggestions && (
                  <Box display={"flex"} gap={1} flexWrap={"wrap"}>
                    {answers[index]?.suggestions?.map((suggestion) => (
                      <Chip
                        key={suggestion}
                        label={suggestion}
                        clickable
                        onClick={() => {
                          if (!voiceName) {
                            setVoiceName(suggestion);
                          }
                        }}
                        variant="outlined"
                        color={voiceName === suggestion ? "success" : "warning"}
                        size="small"
                        disabled={
                          (isLoading || !!voiceName) && voiceName !== suggestion
                        }
                      />
                    ))}
                  </Box>
                )}
                {/* Go for Youtube Search Button */}
                <Button
                  variant="contained"
                  onClick={() => fetchYoutubeResults()}
                  disabled={
                    !!voiceName || isLoading || youtubeResults.length > 0
                  }
                  size="small"
                >
                  Go for Youtube Search
                </Button>
              </Stack>
            </Stack>
          ))}
          {youtubeResults.length > 0 && (
            <Stack gap={2}>
              <Typography>Youtube Results</Typography>
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
                    <Button variant="contained">Choose</Button>
                  </Stack>
                ))}
              </Box>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Box
        width={400}
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
          variant="contained"
          onClick={handleSend}
          disabled={isLoading || !!voiceName}
        >
          Send
        </LoadingButton>
      </Box>
    </Stack>
  );
};

export default AudioExplorerChat;
