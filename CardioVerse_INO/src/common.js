// Shared scene manager for all organ visualizations
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';

const LANGS = ['en', 'ms'];

export class OrganScene {
  constructor(config, checkpoints, checkpointInfo, midpoints) {
    this.config = config;
    this.checkpoints = checkpoints;
    this.checkpointInfo = checkpointInfo;
    this.midpoints = midpoints;
    
    this.currentLanguage = 'en';
    this.currentCheckpoint = 0;
    this.currentAudio = null;
    this.organ = null;
    
    // Three.js objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.labelRenderer = null;
    this.controls = null;
    
    this.preloadedAudio = this.preloadAudio();
    this.setupLanguageUI();
  }

  preloadAudio() {
    const preloaded = {};
    this.checkpointInfo.forEach((info, index) => {
      preloaded[index] = {};
      LANGS.forEach(lang => {
        if (info.audio?.[lang]) {
          const audio = new Audio(info.audio[lang]);
          audio.preload = 'auto';
          preloaded[index][lang] = audio;
        }
      });
    });
    return preloaded;
  }

  setupLanguageUI() {
    const enBtn = document.getElementById('lang-en');
    const msBtn = document.getElementById('lang-ms');
    
    if (enBtn) {
      enBtn.onclick = () => {
        this.currentLanguage = 'en';
        this.setActiveLangButton('en');
        this.goToCheckpoint(this.currentCheckpoint, this.currentCheckpoint, true);
      };
    }
    
    if (msBtn) {
      msBtn.onclick = () => {
        this.currentLanguage = 'ms';
        this.setActiveLangButton('ms');
        this.goToCheckpoint(this.currentCheckpoint, this.currentCheckpoint, true);
      };
    }
    
    this.setActiveLangButton(this.currentLanguage);
  }

  setActiveLangButton(lang) {
    const enBtn = document.getElementById('lang-en');
    const msBtn = document.getElementById('lang-ms');
    if (enBtn) enBtn.classList.toggle('active', lang === 'en');
    if (msBtn) msBtn.classList.toggle('active', lang === 'ms');
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050a12);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const pos = this.config.initialCameraPos;
    this.camera.position.set(pos.x, pos.y, pos.z);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    const target = this.config.initialCameraTarget;
    this.controls.target.set(target.x, target.y, target.z);
    this.controls.update();

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(this.labelRenderer.domElement);

    // Lighting
    this.scene.add(new THREE.AmbientLight(0xffffff, 1));
    const backlight = new THREE.DirectionalLight(0xffffff, 0.7);
    backlight.position.set(-2.306, -1.006, -2.787);
    this.scene.add(backlight);
    const frontlight = new THREE.DirectionalLight(0xffffff, 0.7);
    frontlight.position.set(5, 5, 5);
    this.scene.add(frontlight);

    this.loadOrgan();
    this.setupKeyboardControls();
    this.animate();
  }

  loadOrgan() {
    new GLTFLoader().load(this.config.modelPath, (gltf) => {
      this.organ = gltf.scene;
      this.organ.scale.set(
        this.config.modelScale,
        this.config.modelScale,
        this.config.modelScale
      );

      // Apply material settings
      this.organ.traverse((child) => {
        if (child.isMesh && child.material) {
          const m = child.material;
          if (
            m.type === 'MeshStandardMaterial' ||
            m.type === 'MeshPhysicalMaterial'
          ) {
            m.metalness = 0;
            m.roughness = 1.05;
            m.envMapIntensity = 3.0;
            m.clearcoat = 1.0;
            m.clearcoatRoughness = 0.05;
          }
        }
      });
      this.scene.add(this.organ);
    });
  }

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        if (this.currentAudio && !this.currentAudio.paused) {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
          const overlay = document.getElementById('textOverlay');
          if (overlay) overlay.style.opacity = 0;
        }
        const next = (this.currentCheckpoint + 1) % this.checkpoints.length;
        this.goToCheckpoint(this.currentCheckpoint, next);
        this.currentCheckpoint = next;
      } else if (e.key === 'ArrowLeft') {
        const prev =
          (this.currentCheckpoint - 1 + this.checkpoints.length) %
          this.checkpoints.length;
        this.goToCheckpoint(this.currentCheckpoint, prev);
        this.currentCheckpoint = prev;
      }
    });
  }

  updateOverlay(toIndex) {
    const overlay = document.getElementById('textOverlay');
    const info = this.checkpointInfo[toIndex];

    if (!info) return;

    const titleEl = document.getElementById('checkpointTitle');
    const descEl = document.getElementById('checkpointDesc');

    if (titleEl)
      titleEl.textContent = info.title[this.currentLanguage] || '';
    if (descEl)
      descEl.innerHTML = (info.description[this.currentLanguage] || '').replace(
        /\n/g,
        '<br>'
      );

    if (overlay) {
      gsap.set(overlay, { opacity: 0 });
      gsap.to(overlay, { opacity: 1, duration: 1 });
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    const audio = this.preloadedAudio[toIndex]?.[this.currentLanguage];
    if (audio) {
      this.currentAudio = audio;
      this.currentAudio.currentTime = 0;
      this.currentAudio.play();
      this.currentAudio.addEventListener('ended', () => {
        setTimeout(() => {
          if (overlay) gsap.to(overlay, { opacity: 0, duration: 1 });
        }, 5000);
      });
    }
  }

  goToCheckpoint(fromIndex, toIndex, skipCamera = false) {
    const from = this.checkpoints[fromIndex];
    const to = this.checkpoints[toIndex];
    if (!from || !to) return;

    if (skipCamera) {
      this.updateOverlay(toIndex);
      return;
    }

    // Build camera path
    const key = `${fromIndex}-${toIndex}`;
    let path = this.midpoints[key];
    if (!path) {
      const reversePath = this.midpoints[`${toIndex}-${fromIndex}`];
      path = reversePath ? [...reversePath].reverse() : [];
    }
    const fullPath = [from.position, ...path, to.position];

    const timeline = gsap.timeline();
    for (let i = 0; i < fullPath.length - 1; i++) {
      timeline.to(
        this.camera.position,
        {
          duration: 1.5,
          x: fullPath[i + 1].x,
          y: fullPath[i + 1].y,
          z: fullPath[i + 1].z,
          onUpdate: () => this.camera.lookAt(to.target)
        }
      );
    }
    timeline.to(
      this.controls.target,
      {
        duration: 1.5 * fullPath.length,
        x: to.target.x,
        y: to.target.y,
        z: to.target.z
      },
      0
    );

    timeline.call(() => this.updateOverlay(toIndex));
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  };
}
