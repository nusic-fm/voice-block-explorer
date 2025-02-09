import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  Modal,
} from "@mui/material";
import { Voice } from "../services/db/voices.service";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";
import { db } from "../services/firebase.service";
import { LoadingButton } from "@mui/lab";
import { textToSpeech } from "../helper";
import AudioPlayer from "./AudioPlayer";

// Styled components
const VisualizationContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100vh",
  zIndex: 20,
  pointerEvents: "auto",
  overflow: "hidden",
  backgroundColor: "transparent",
}));

const NodeLabel = styled("div")(({ theme }) => ({
  position: "absolute",
  fontSize: "1.8em",
  pointerEvents: "none",
  textShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
  transform: "translate(-50%, -50%)",
  zIndex: 10,
  color: "#00ffff",
  userSelect: "none",
}));

interface LocalAudioNode {
  mesh: THREE.Mesh;
  clickMesh: THREE.Mesh;
  data: Voice;
  label: HTMLDivElement;
  targetPosition: THREE.Vector3;
  animationProgress: number;
  randomOffset: THREE.Vector3;
  startDelay: number;
  hasStarted: boolean;
  elapsedTime: number;
  embedUrl?: string;
}

const EmotionSphere: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const theme = useTheme();
  const [scene] = useState(new THREE.Scene());
  const [camera] = useState(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
  );
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);
  const [audioNodes, setAudioNodes] = useState<LocalAudioNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<Voice | null>(null);
  const [ttsInput, setTtsInput] = useState<string>("");
  // const [audioFiles, setAudioFiles] = useState<Voice[]>([
  //   {
  //     emoji: "😀",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "😤",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🤮",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🤯",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "😎",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "😍",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🙄",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "😱",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🥹",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "😢",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🤔",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🤭",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "😵‍💫",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  //   {
  //     emoji: "🫣",
  //     name: "Happy",
  //     audioUrl: "https://youtu.be/dQw4w9WgXcQ",
  //     audioPath: "https://youtu.be/dQw4w9WgXcQ",
  //     jobId: "123",
  //     isNFTDeployed: false,
  //     symbol: "ELM",
  //   },
  // ]);
  const [voices] = useCollectionData(collection(db, "voices"));
  const [audioFiles, setAudioFiles] = useState<Voice[]>([]);
  const animationFrameRef = useRef<number>();
  const [raycaster] = useState(new THREE.Raycaster());
  const [mouse] = useState(new THREE.Vector2());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [convertedAudioUrl, setConvertedAudioUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!voices || voices.length === 0) return;
    setAudioFiles(voices as Voice[]);
  }, [voices]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    const newRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    const container = containerRef.current;
    newRenderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(newRenderer.domElement);
    setRenderer(newRenderer);

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    const newControls = new OrbitControls(camera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.autoRotate = true;
    newControls.autoRotateSpeed = 0.5;
    newControls.minDistance = 30;
    newControls.maxDistance = 80;
    newControls.enabled = true;

    // Update resize handler to use container dimensions
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      newRenderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    setControls(newControls);

    return () => {
      window.removeEventListener("resize", handleResize);
      newRenderer.dispose();
      if (controls) controls.dispose();
      container.removeChild(newRenderer.domElement);
    };
  }, []);

  // Create audio nodes
  useEffect(() => {
    if (!audioFiles || audioFiles.length === 0) return;
    const createAudioNode = (
      position: THREE.Vector3,
      data: Voice,
      index: number,
      totalNodes: number
    ): LocalAudioNode => {
      const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(0.4, 32),
        new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );

      const clickMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2, 8, 8),
        new THREE.MeshBasicMaterial({
          visible: false,
          depthTest: false,
          depthWrite: false,
          transparent: true,
          opacity: 0.2,
        })
      );
      clickMesh.position.copy(position);

      // Create label
      const label = document.createElement("div");
      Object.assign(label.style, {
        position: "absolute",
        fontSize: "1.8em",
        pointerEvents: "none",
        textShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
        transform: "translate(-50%, -50%)",
        zIndex: "10",
        color: "#00ffff",
        userSelect: "none",
        opacity: "0",
      });
      label.textContent = data.emoji || "";
      containerRef.current?.appendChild(label);

      return {
        mesh,
        clickMesh,
        data,
        label,
        targetPosition: position,
        animationProgress: 0,
        randomOffset: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        ),
        startDelay: (index / totalNodes) * 0.5,
        hasStarted: false,
        elapsedTime: 0,
        embedUrl: data.audioUrl,
      };
    };

    // Calculate node positions in a sphere
    const radius = 18 + Math.cbrt(audioFiles.length) * 1.2;
    const nodes = audioFiles.map((file, index) => {
      const phi = Math.acos(-1 + (2 * index) / audioFiles.length);
      const theta = Math.sqrt(audioFiles.length * Math.PI) * phi;

      // Multiply radius by a random value (0.4 to 0.8) to place nodes inside
      const innerRadius = radius * (Math.random() * 0.4 + 0.4);

      const position = new THREE.Vector3(
        Math.cos(theta) * innerRadius * Math.sin(phi),
        Math.sin(theta) * innerRadius * Math.sin(phi),
        Math.cos(phi) * innerRadius * 1.5
      );

      return createAudioNode(position, file, index, audioFiles.length);
    });

    nodes.forEach((node) => {
      scene.add(node.mesh);
      scene.add(node.clickMesh);
    });

    setAudioNodes(nodes);

    return () => {
      nodes.forEach((node) => {
        scene.remove(node.mesh);
        scene.remove(node.clickMesh);
        node.label.remove();
      });
    };
  }, [scene, audioFiles]);

  // Animation loop
  useEffect(() => {
    if (!renderer || !controls) return;

    let lastTime = performance.now();

    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      audioNodes.forEach((node) => {
        updateNode(node, deltaTime);
        updateNodeLabel(node, camera);
      });

      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderer, controls, audioNodes, scene, camera]);

  // Add a new useEffect for controls configuration
  useEffect(() => {
    if (!controls) return;

    // Enable all controls
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.enablePan = true;

    // Optional: Configure control limits
    controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
    controls.minPolarAngle = 0;

    // Optional: Add smooth damping
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }, [controls]);

  // Helper functions
  const updateNode = (node: LocalAudioNode, deltaTime: number) => {
    const ANIMATION_SPEED = 1.2;
    node.elapsedTime += deltaTime;

    if (node.elapsedTime < node.startDelay) return;

    if (!node.hasStarted) {
      node.hasStarted = true;
      node.animationProgress = 0;
    }

    if (node.animationProgress < 1) {
      node.animationProgress += deltaTime * ANIMATION_SPEED;
      node.animationProgress = Math.min(node.animationProgress, 1);

      const t = node.animationProgress;
      const eased =
        t < 0.5 ? 4 * t * t : 1 + Math.sin((t - 0.5) * Math.PI) * 0.35;

      const progress = eased;
      const overshotPosition = node.targetPosition.clone().add(
        node.targetPosition
          .clone()
          .normalize()
          .multiplyScalar(3.5 * (1 - progress))
      );

      const currentOffset = node.randomOffset
        .clone()
        .multiplyScalar(1 - progress);

      node.mesh.position.lerpVectors(
        new THREE.Vector3(0, 0, 0),
        overshotPosition.add(currentOffset),
        progress
      );

      node.mesh.lookAt(camera.position);

      const fadeProgress = Math.min(node.animationProgress * 2, 1);
      (node.mesh.material as THREE.MeshBasicMaterial).opacity =
        0.25 * fadeProgress;
      node.label.style.opacity = fadeProgress.toString();
    }

    node.clickMesh.position.copy(node.mesh.position);
    node.clickMesh.lookAt(camera.position);
  };

  const updateNodeLabel = (node: LocalAudioNode, camera: THREE.Camera) => {
    const vector = node.mesh.position.clone().project(camera);
    const container = containerRef.current;
    if (!container) return;

    // Clamp the position to stay within container bounds
    const x = Math.max(
      0,
      Math.min(
        ((vector.x + 1) / 2) * container.clientWidth,
        container.clientWidth
      )
    );
    const y = Math.max(
      0,
      Math.min(
        ((-vector.y + 1) / 2) * container.clientHeight,
        container.clientHeight
      )
    );

    // Update label position
    node.label.style.left = `${x}px`;
    node.label.style.top = `${y}px`;
  };

  const extractVideoId = (url: string): string | null => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Add the click handler method
  const onVoiceClick = (event: MouseEvent) => {
    if (!containerRef.current) return;

    // Get container bounds
    const rect = containerRef.current.getBoundingClientRect();

    // Check if click is within container bounds
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      return;
    }

    // Calculate mouse position relative to container
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      audioNodes.map((node) => node.clickMesh)
    );

    if (intersects.length > 0) {
      const clickedNode = audioNodes.find(
        (node) => node.clickMesh === intersects[0].object
      );

      if (clickedNode) {
        setSelectedNode(clickedNode.data);
        setDialogOpen(true);

        // Highlight the clicked node
        audioNodes.forEach((node) => {
          (node.mesh.material as THREE.MeshBasicMaterial).color.setHex(
            0x00ffff
          );
        });
        (clickedNode.mesh.material as THREE.MeshBasicMaterial).color.setHex(
          0xff0000
        );
      }
    }
  };

  // Add dialog close handler
  const handleCloseDialog = () => {
    if (isGenerating) return;
    setDialogOpen(false);
  };

  // Add these handlers
  const onVoiceHover = (event: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
      audioNodes.map((node) => node.clickMesh)
    );

    containerRef.current.style.cursor =
      intersects.length > 0 ? "pointer" : "default";

    // Optional: Scale up hovered node
    audioNodes.forEach((node) => {
      const isHovered =
        intersects.length > 0 && node.clickMesh === intersects[0].object;
      node.mesh.scale.lerp(
        new THREE.Vector3(isHovered ? 1.5 : 1, isHovered ? 1.5 : 1, 1),
        0.1
      );
      node.label.style.transform = `translate(-50%, -50%) scale(${
        isHovered ? 1.2 : 1
      })`;
    });
  };

  // Add the hover event listener in your useEffect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("click", onVoiceClick);
    container.addEventListener("mousemove", onVoiceHover);

    return () => {
      container.removeEventListener("click", onVoiceClick);
      container.removeEventListener("mousemove", onVoiceHover);
    };
  }, [audioNodes, camera]);

  const handleGenerate = async () => {
    if (!selectedNode) return;
    setIsGenerating(true);
    const ttsText = ttsInput;
    try {
      const url = await textToSpeech(ttsText, selectedNode?.audioUrl);
      setConvertedAudioUrl(url);
    } catch (error) {
      alert("Running out of credits, please try again later");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
      <VisualizationContainer ref={containerRef} />

      <Modal
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack
          sx={{
            ...style,
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            borderRadius: 4,
          }}
          gap={2}
        >
          <Typography variant="h6">
            {selectedNode?.emoji} {selectedNode?.name}
          </Typography>
          <Divider />
          <Stack gap={2}>
            <AudioPlayer
              src={selectedNode?.audioUrl || ""}
              title="Original Audio"
            />
          </Stack>
          <Box mt={4}>
            <TextField
              fullWidth
              label="What would you like to hear?"
              rows={4}
              value={ttsInput}
              onChange={(e) => setTtsInput(e.target.value)}
            />
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            {convertedAudioUrl ? (
              <AudioPlayer src={convertedAudioUrl} title="Generated Audio" />
            ) : (
              <LoadingButton
                loading={isGenerating}
                variant="contained"
                onClick={handleGenerate}
              >
                Generate
              </LoadingButton>
            )}
          </Box>
        </Stack>
      </Modal>
    </Box>
  );
};

export default EmotionSphere;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
