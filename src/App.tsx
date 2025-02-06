import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import styled from "styled-components";
import CloseButton from "@mui/icons-material/Close";
import { extractYoutubeId } from "./helper";
import { Box, Drawer, Stack, TextField, Typography } from "@mui/material";
import { LocalAudioNode } from "./LocalAudioNode";
import "./app.css";
import AudioExplorerChat from "./components/AudioExplorerChat";

const MetadataPanel = styled.div`
  position: fixed;
  background: var(--glass-panel);
  border: 1px solid var(--subtle-border);
  border-radius: 12px;
  padding: 1.5rem;
  padding-top: 2.5rem;
  width: 360px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: grid;
  gap: 1rem;
  border-image: linear-gradient(
      145deg,
      rgba(0, 255, 255, 0.15),
      rgba(0, 255, 255, 0.05)
    )
    1;
`;

// Components
interface MetadataPanelProps {
  node: AudioFile | null;
  position: { x: number; y: number };
  onClose: () => void;
}

const MetadataPanelComponent: React.FC<MetadataPanelProps> = ({
  node,
  position,
  onClose,
}) => {
  if (!node) return null;

  return (
    <MetadataPanel style={{ left: position.x, top: position.y }}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <div className="metadata-content">
        <h3>{`${node.emoji} ${node.name}`}</h3>
        <iframe
          className="youtube-embed"
          src={`https://www.youtube.com/embed/${extractYoutubeId(
            node.source
          )}?modestbranding=1&rel=0`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
        <table>
          <tr>
            <td>Duration:</td>
            <td>{node.duration}</td>
          </tr>
        </table>
      </div>
    </MetadataPanel>
  );
};
export type AudioFile = {
  filename: string;
  name: string;
  source: string;
  emoji: string;
  duration: string;
};
const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([
    {
      filename: "sample1.mp3",
      name: "Happy",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😀",
      duration: "0:10",
    },
    {
      filename: "sample2.mp3",
      name: "Angry",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😤",
      duration: "0:02",
    },
    {
      filename: "sample3.mp3",
      name: "Disgusted",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🤮",
      duration: "0:03",
    },
    {
      filename: "sample4.mp3",
      name: "Mindblown",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🤯",
      duration: "0:05",
    },
    {
      filename: "sample5.mp3",
      name: "Cool",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😎",
      duration: "0:04",
    },
    {
      filename: "sample6.mp3",
      name: "In Love",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😍",
      duration: "0:04",
    },
    {
      filename: "sample7.mp3",
      name: "Typical",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🙄",
      duration: "0:03",
    },
    {
      filename: "sample8.mp3",
      name: "Shocking",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😱",
      duration: "0:04",
    },
    {
      filename: "sample9.mp3",
      name: "Welling Up",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🥹",
      duration: "0:04",
    },
    {
      filename: "sample10.mp3",
      name: "Unhappy",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😢",
      duration: "0:05",
    },
    {
      filename: "sample11.mp3",
      name: "Hmmmm",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🤔",
      duration: "0:09",
    },
    {
      filename: "sample12.mp3",
      name: "Giggles",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🤭",
      duration: "0:04",
    },
    {
      filename: "sample13.mp3",
      name: "Dizzy",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😵‍💫",
      duration: "0:02",
    },
    {
      filename: "sample14.mp3",
      name: "Noooo",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🫣",
      duration: "0:03",
    },
    {
      filename: "sample15.mp3",
      name: "Sad",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "☹️",
      duration: "0:08",
    },
    {
      filename: "sample16.mp3",
      name: "Laughing",
      source: "https://www.youtube.com/watch?v=XEbhjrGyKuE&t=21s",
      emoji: "😂",
      duration: "0:01",
    },
    {
      filename: "sample17.mp3",
      name: "Cuddles",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🤗",
      duration: "0:03",
    },
    {
      filename: "sample18.mp3",
      name: "Shhhh",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "🤫",
      duration: "0:04",
    },
    {
      filename: "sample19.mp3",
      name: "Oh no!",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😵",
      duration: "0:03",
    },
    {
      filename: "sample20.mp3",
      name: "Surprise",
      source: "https://youtu.be/dQw4w9WgXcQ",
      emoji: "😲",
      duration: "0:02",
    },
  ]);
  const [selectedNode, setSelectedNode] = useState<AudioFile | null>(null);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [audioNodes, setAudioNodes] = useState<LocalAudioNode[]>([]);
  let audioContextInitialized = false;
  let lastTime = 0;

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;

    const init = async () => {
      // Initialize Three.js scene
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      try {
        const nodeCount = audioFiles.length;
        const radius = 10 + Math.cbrt(nodeCount) * 2;

        audioFiles.forEach((file, index) => {
          const phi = Math.acos(-1 + (2 * index) / nodeCount);
          const theta = Math.sqrt(nodeCount * Math.PI) * phi;

          const position = new THREE.Vector3(
            Math.cos(theta) * radius * Math.sin(phi),
            Math.sin(theta) * radius * Math.sin(phi),
            Math.cos(phi) * radius
          );

          const node = new LocalAudioNode(position, file, index, nodeCount);
          scene.add(node.mesh);
          audioNodes.push(node);
        });
      } catch (error) {
        console.error(error);
        return;
      }

      camera.position.z = 40;
      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      renderer.domElement.addEventListener("click", (e) => {
        if (!audioContextInitialized) {
          audioContextInitialized = true;
          const context = new AudioContext();
          context.resume();
        }

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          audioNodes.map((n) => n.mesh)
        );

        if (intersects.length > 0) {
          const node = audioNodes.find((n) => n.mesh === intersects[0].object);
          showMetadataPanel(node, e.clientX, e.clientY);
        }
      });

      const animate = () => {
        requestAnimationFrame(animate);
        const time = performance.now();
        const deltaTime = (time - lastTime) / 1000;
        lastTime = time;

        audioNodes.forEach((node) => {
          node.update(deltaTime);
          node.updateLabelPosition(camera);
        });
        controls?.update();
        renderer?.render(scene, camera);
      };

      animate();
    };

    init();

    return () => {
      // Cleanup
      renderer?.dispose();
      // Additional cleanup as needed
      audioNodes.forEach((node) => {
        node.dispose();
      });
    };
  }, []);

  const showMetadataPanel = (node: any, x: number, y: number) => {
    setSelectedNode(node);
    setPanelPosition({ x, y });
  };

  return (
    <Box>
      <Typography>Hello</Typography>
      <canvas ref={canvasRef} />
      <MetadataPanelComponent
        node={selectedNode}
        position={panelPosition}
        onClose={() => setSelectedNode(null)}
      />
      {/* A drawer for the right side, no backdrop, no close button, always open */}
      <Drawer anchor="right" open={true} onClose={() => {}} hideBackdrop>
        <AudioExplorerChat />
      </Drawer>
    </Box>
  );
};

export default App;
