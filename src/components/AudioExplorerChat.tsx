import { Stack, Typography, Box, TextField } from "@mui/material";

type Props = {};

const AudioExplorerChat = (props: Props) => {
  return (
    <Stack m={2} gap={2}>
      <Typography variant="h6">Audio Explorer Chat</Typography>
      <Box width={400}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Find your character"
        />
      </Box>
    </Stack>
  );
};

export default AudioExplorerChat;
