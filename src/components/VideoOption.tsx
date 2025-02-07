import { Box, Typography } from "@mui/material";
import React from "react";

interface VideoProps {
  video: {
    url: string;
    title: string;
    id: string;
    description: string;
    // duration: string;
  };
  onVideoSelected: (video: {
    url: string;
    title: string;
    id: string;
    description: string;
    // duration: string;
  }) => void;
}

const VideoOption: React.FC<VideoProps> = ({ video, onVideoSelected }) => {
  console.log({ video });
  return (
    <Box
      width={280}
      height={240}
      borderRadius={1}
      sx={{
        outline: "1px solid #00ffff",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
          borderColor: "rgba(0, 255, 255, 0.8)",
        },
      }}
      onClick={() => onVideoSelected(video)}
    >
      <img
        style={{
          width: 280,
          height: 160,
          objectFit: "cover",
          transition: "transform 0.3s ease",
        }}
        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
        alt={video.title}
      />
      {/* <Box
        sx={{
          position: "absolute",
          bottom: "8px",
          right: "8px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "2px 4px",
          borderRadius: "4px",
          fontSize: "0.8rem",
        }}
      >
        {video.duration}
      </Box> */}
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
            {video.title}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {video.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default VideoOption;
