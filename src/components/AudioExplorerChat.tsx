import { Stack, Typography, Box, TextField, Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
type Props = {};

const AudioExplorerChat = (props: Props) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [answers, setAnswers] = useState<
    {
      type: "voiceName" | "youtubeResults" | "helper";
      content: string;
      youtubeResults?: { url: string; title: string }[];
    }[]
  >([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    setIsLoading(true);
    setPrompts([...prompts, currentPrompt]);
    setCurrentPrompt("");
    await fetchAndSetAnswer(currentPrompt);
    setIsLoading(false);
  };

  const fetchAndSetAnswer = async (prompt: string) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_AGENT_SERVER_URL
      }/test/text-to-voicename/${prompt}`,
      {
        params: {
          prompt,
        },
      }
    );
    if (!response.data.voiceName) {
      setAnswers([
        ...answers,
        { type: "helper", content: response.data.helper },
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
    const response = await axios.get(
      `${
        import.meta.env.VITE_AGENT_SERVER_URL
      }/test/youtube-results/${voiceName}`
    );
    setAnswers([
      ...answers,
      { type: "youtubeResults", content: response.data },
    ]);
  };

  return (
    <Stack m={2} gap={2} height="100%">
      <Stack>
        <Typography variant="h6" align="center">
          Audio Explorer Chat
        </Typography>
        <Stack>
          {prompts.map((prompt, index) => (
            <Stack key={index}>
              <Typography>{prompt}</Typography>
              <Typography>{answers[index]?.content || "..."}</Typography>
            </Stack>
          ))}
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
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>
    </Stack>
  );
};

export default AudioExplorerChat;
