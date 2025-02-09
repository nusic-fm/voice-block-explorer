import { Box, Typography, Button } from "@mui/material";
import React from "react";
import { TwitterResult } from "../App";

interface VideoProps {
  video: TwitterResult;
  onVideoSelected: (video: TwitterResult) => void;
}

const VideoOption: React.FC<VideoProps> = ({ video, onVideoSelected }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Box
      width={280}
      height={240}
      borderRadius={1}
      onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      sx={{
        outline: "1px solid #00ffff",
        position: "relative",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
          borderColor: "rgba(0, 255, 255, 0.8)",
        },
      }}
    >
      <Box sx={{ position: "relative", height: 160 }}>
        {isHovered ? (
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
      <Box
        sx={{
          padding: "1rem",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
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
          mt={1}
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
      </Box>
    </Box>
  );
};

export default VideoOption;
