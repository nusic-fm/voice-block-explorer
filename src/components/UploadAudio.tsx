import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadToYtAudioStorage } from "../services/storage/ytAudio.storage";

interface UploadAudioProps {
  onUploadStarted?: () => void;
  onUploadComplete?: (url: string) => void;
}

const UploadAudio = ({ onUploadComplete }: UploadAudioProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB in bytes

  const validateFile = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      setError("Please upload an audio file");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be less than 15MB");
      return false;
    }
    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setError(null);
      setUploading(true);

      const downloadUrl = await uploadToYtAudioStorage(file, file.name);

      // Call the callback with the URL if provided
      if (onUploadComplete) {
        onUploadComplete(downloadUrl);
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "md", mx: "auto" }}>
      <Box
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "grey.300",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: isDragging ? "primary.50" : "background.paper",
          opacity: uploading ? 0.5 : 1,
          pointerEvents: uploading ? "none" : "auto",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "primary.50",
          },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="audio/*"
          style={{ display: "none" }}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="body1" color="text.primary" gutterBottom>
          {uploading
            ? "Uploading..."
            : "Drag and drop an audio file here, or click to select"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size: 15MB
        </Typography>
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default UploadAudio;
