import { Box } from "@mui/material";
import "./app.css";
import AudioExplorerChat from "./components/AudioExplorerChat";
import KrakenEffect from "./components/KrakenEffect";

export type AudioFile = {
  filename: string;
  name: string;
  source: string;
  emoji: string;
  duration: string;
};

const App: React.FC = () => {
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

  return (
    <Box height="100vh" width={"100vw"} display={"flex"}>
      <Box width={"calc(100% - 400px)"} position={"relative"} height={"100%"}>
        <KrakenEffect />
      </Box>
      <Box width={"400px"} height={"100%"} ml={"auto"}>
        <AudioExplorerChat />
      </Box>
    </Box>
  );
};

export default App;
