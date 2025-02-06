import * as THREE from "three";
import { AudioFile } from "./App";

export class LocalAudioNode {
  data: any;
  mesh: THREE.Mesh;
  embedUrl: string;
  targetPosition: THREE.Vector3;
  animationProgress: number;
  randomOffset: THREE.Vector3;
  startDelay: number;
  hasStarted: boolean;
  elapsedTime: number;
  label: HTMLElement;

  constructor(
    position: THREE.Vector3,
    data: AudioFile,
    index: number,
    totalNodes: number
  ) {
    this.data = data;
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0,
      })
    );

    if (data && data.source) {
      try {
        const videoId = this.extractVideoId(data.source);
        // Look specifically for t=XXs format
        const timeMatch = data.source.match(/[?&]t=(\d+)s?/);
        const startTime = timeMatch ? parseInt(timeMatch[1]) : 0;

        // Construct embed URL with start time if present
        this.embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1${
          startTime ? "&start=" + startTime : ""
        }`;
        console.log("Video will start at:", startTime, "seconds");
        console.log("Final embed URL:", this.embedUrl);
      } catch (error) {
        console.error("Error processing YouTube URL:", error);
      }
    }

    // Start at center
    this.mesh.position.set(0, 0, 0);
    this.targetPosition = position.clone();
    this.animationProgress = 0;
    this.randomOffset = new THREE.Vector3(
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.8,
      (Math.random() - 0.5) * 0.8
    );

    // Stagger the start time based on index
    this.startDelay = (index / totalNodes) * 0.5; // 0.5 seconds total stagger
    this.hasStarted = false;
    this.elapsedTime = 0;

    // Create label with 0 opacity
    this.label = document.createElement("div");
    this.label.className = "node-label";
    this.label.textContent = data.emoji;
    this.label.style.opacity = "0";
    document.body.appendChild(this.label);
  }

  update(deltaTime: number) {
    const ANIMATION_SPEED = 1.2;
    this.elapsedTime += deltaTime;

    // Don't start animation until delay is over
    if (this.elapsedTime < this.startDelay) {
      return;
    }

    if (!this.hasStarted) {
      this.hasStarted = true;
      this.animationProgress = 0;
    }

    if (this.animationProgress < 1) {
      this.animationProgress += deltaTime * ANIMATION_SPEED;
      this.animationProgress = Math.min(this.animationProgress, 1);

      const t = this.animationProgress;
      const eased =
        t < 0.5
          ? 4 * t * t * t
          : 1 +
            Math.sin((t - 0.5) * Math.PI) * Math.exp(-(t - 0.5) * 2.5) * 0.35;

      const progress = eased;
      const overshotPosition = this.targetPosition.clone().add(
        this.targetPosition
          .clone()
          .normalize()
          .multiplyScalar(3.5 * (1 - progress))
      );

      const currentOffset = this.randomOffset
        .clone()
        .multiplyScalar(1 - progress);

      this.mesh.position.lerpVectors(
        new THREE.Vector3(0, 0, 0),
        overshotPosition.add(currentOffset),
        progress
      );

      // Fade in opacity with a quick ease-in
      const fadeProgress = Math.min(this.animationProgress * 2, 1);
      if (this.mesh.material instanceof THREE.Material) {
        this.mesh.material.opacity = 0.9 * fadeProgress;
        this.mesh.material.transparent = true;
      } else if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach((mat) => {
          mat.opacity = 0.9 * fadeProgress;
          mat.transparent = true;
        });
      }
      this.label.style.opacity = fadeProgress.toString();
    }
  }
  updateLabelPosition(camera: THREE.Camera) {
    const vector = this.mesh.position.clone().project(camera);
    this.label.style.left = `${(vector.x * 0.5 + 0.5) * window.innerWidth}px`;
    this.label.style.top = `${(-vector.y * 0.5 + 0.5) * window.innerHeight}px`;
  }

  dispose() {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((material) => material.dispose());
    } else {
      this.mesh.material.dispose();
    }
    this.label.remove();
  }

  extractVideoId(url: string) {
    // Handle both youtube.com and youtu.be formats
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  }

  onClick() {
    if (!this.embedUrl) return;

    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";

    const iframe = document.createElement("iframe");
    iframe.width = "800";
    iframe.height = "450";
    iframe.src = this.embedUrl;
    iframe.frameBorder = "0";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    modal.appendChild(iframe);
    console.log("Opening video at URL:", iframe.src); // Debug log

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    document.body.appendChild(modal);
  }
}
