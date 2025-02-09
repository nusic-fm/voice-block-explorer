import { Box, Typography, Button, Stack } from "@mui/material";
import React from "react";
import { TwitterResult } from "../App";

interface VideoProps {
  video: TwitterResult;
  onVideoSelected: (video: TwitterResult) => void;
}

const VideoOption: React.FC<VideoProps> = ({ video, onVideoSelected }) => {
  const [readyToLoad, setReadyToLoad] = React.useState(false);

  return (
    <Stack
      width={280}
      height={260}
      borderRadius={1}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      onClick={() => setReadyToLoad(true)}
      justifyContent={"space-between"}
      sx={{
        position: "relative",
        outline: "1px solid rgba(0, 255, 255, 0.8)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
        },
      }}
    >
      <Box sx={{ height: 160 }} display={"flex"} justifyContent={"center"}>
        {readyToLoad ? (
          <video
            style={{
              width: 280,
              height: 160,
              objectFit: "cover",
            }}
            src={video.videoUrl}
            // muted
            // loop
            // autoPlay
            controls
          />
        ) : (
          <img
            style={{
              width: 280,
              height: 160,
              objectFit: "cover",
            }}
            src={video.videoPreview}
            alt={video.text}
          />
        )}
        {/* {isHovered && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
          >
            <PlayCircleIcon sx={{ fontSize: 48, color: "white" }} />
          </Box>
        )} */}
      </Box>
      <Stack justifyContent={"space-between"} px={1} gap={1}>
        <Box sx={{ fontSize: "1.1rem", fontWeight: "500" }}>
          <Typography
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {video.text}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          py={1}
        >
          <Typography
            variant="caption"
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {video.likes} likes
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onVideoSelected(video)}
            // sx={{
            //   minWidth: "auto",
            //   padding: "4px 8px",
            //   backgroundColor: "#00ffff",
            //   "&:hover": {
            //     backgroundColor: "#00cccc",
            //   },
            // }}
          >
            Select
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default VideoOption;
