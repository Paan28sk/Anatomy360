import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';

// --- Constants & Globals ---
let currentlanguage = 'en';
let camera, scene, renderer, labelRenderer, brain, heart, mann, controls;
let currentModel = 'mann'; // Track which model is active
let isAnimating = false;


// fade utility
function fadeModel(model, opacity, duration = 1) {
  model.traverse(child => {
    if (child.isMesh && child.material) {
      child.material.transparent = true;
      gsap.to(child.material, {
        opacity,
        duration,
        ease: "power2.inOut"
      });
    }
  });
}


function setModelOpacity(model, opacity) {
  model.traverse(child => {
    if (child.isMesh) {
      child.material.transparent = true;
      child.material.opacity = opacity;
    }
  });
}


// --- Utility Functions ---
function setActiveLangButton(lang) {
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-ms').classList.toggle('active', lang === 'ms');
}


window.hidePopup = function () {
  document.getElementById('infoPopup').style.display = 'none';
};


// --- Event Listeners ---
document.getElementById('lang-en').onclick = () => {
  currentlanguage = 'en';
  setActiveLangButton('en');
  // Language switched, no checkpoint update needed
};


document.getElementById('lang-ms').onclick = () => {
  currentlanguage = 'ms';
  setActiveLangButton('ms');
  // Language switched, no checkpoint update needed
};
setActiveLangButton(currentlanguage);



// --- Initialization ---
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-5, 1.1, 2.1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('canvasContainer').appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
  };
  controls.target.set(0, 0, 0);
  controls.update();

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(labelRenderer.domElement);

  // REPLACE WITH THIS:
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
fillLight.position.set(-5, 2, -3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4);
rimLight.position.set(0, -5, -5);
scene.add(rimLight);

const brainlight = new THREE.DirectionalLight(0xffffff, 5);
brainlight.position.set(-1, 3.25, -0.53);
scene.add(brainlight);
  scene.background = new THREE.Color(0xe8edf2);

  new GLTFLoader().load('/Models/heart.glb', (gltf) => {
    heart = gltf.scene;
    heart.scale.set(1, 1, 1);
    heart.visible = false;
    heart.traverse((child) => {
      if (child.isMesh && child.material) {
        const m = child.material;
        if (m.type === 'MeshStandardMaterial' || m.type === 'MeshPhysicalMaterial') {
          m.metalness = 0;
          m.roughness = 0.7;
          m.envMapIntensity = 3.0;
          m.clearcoat = 1.0;
          m.clearcoatRoughness = 0.05;
          m.transparent = true;
          m.opacity = 1;
        }
      }
    });
    scene.add(heart);
    setModelOpacity(heart, 1);
  });

  new GLTFLoader().load('/Models/mann.glb', (gltf) => {
    mann = gltf.scene;
    mann.scale.set(4, 4, 4);
    mann.position.set(0, -1, 0);
    mann.visible = true;
    mann.traverse((child) => {
      if (child.isMesh && child.material) {
        if (
          child.material.type === 'MeshStandardMaterial' ||
          child.material.type === 'MeshPhysicalMaterial'
        ) {
          child.material.metalness = 0;
          child.material.roughness = 1.05;
          child.material.envMapIntensity = 3.0;
          child.material.clearcoat = 1.0;
          child.material.clearcoatRoughness = 0.05;
          child.material.transparent = true;
        }
      }
    });
    scene.add(mann);
    setModelOpacity(mann, 1);
  });

  new GLTFLoader().load('/Models/fullbrain.glb', (gltf) => {
    brain = gltf.scene;
    brain.scale.set(0.007, 0.007, 0.007);
    brain.position.set(0, 2.5, 0);
    brain.rotation.y = Math.PI / 2;
    brain.visible = false;
    brain.traverse((child) => {
      if (child.isMesh && child.material) {
        if (
          child.material.type === 'MeshStandardMaterial' ||
          child.material.type === 'MeshPhysicalMaterial'
        ) {
          child.material.metalness = 0;
          child.material.roughness = 1.05;
          child.material.envMapIntensity = 3.0;
          child.material.clearcoat = 1.0;
          child.material.clearcoatRoughness = 0.05;
          child.material.transparent = true;
          child.material.opacity = 1;
        }
      }
    });
    scene.add(brain);
    setModelOpacity(brain, 1);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'c') {
      gsap.to(camera.position, {
        duration: 2,
        x: 0, y: 3.061616997868383e-16, z: 5,
        onUpdate: () => camera.lookAt(0, 0, 0)
      });
      return;
    }
    if (e.key.toLowerCase() === 'p') {
      console.log('📍 Camera position:', camera.position);
      console.log('🎯 Camera target (controls.target):', controls.target);
      return;
    }
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (isAnimating) return;

    let nextModel;
    if (e.key === 'ArrowRight') {
      if (currentModel === 'mann') nextModel = 'heart';
      else if (currentModel === 'heart') nextModel = 'brain';
      else nextModel = 'mann';
    } else {
      if (currentModel === 'mann') nextModel = 'brain';
      else if (currentModel === 'heart') nextModel = 'mann';
      else nextModel = 'heart';
    }

    const models = { mann, heart, brain };
    const current = models[currentModel];
    const next = models[nextModel];
    
    // Only check if current and next models are loaded
    if (!current || !next) return;

    isAnimating = true;

    const views = {
      heart: { pos: { x: -1, y: 0, z: 0 }, target: { x: 0, y: 0, z: 0 } },
      brain: { pos: { x: -1, y: 3.25, z: -0.53 }, target: { x:1, y: 2, z: 0.455 } },
      mann: { pos: { x: -0.68, y: 0.84, z: 5.5 }, target: { x: 0.3, y: -0.05, z: 0.32 } }
    };
    const { pos, target } = views[nextModel];

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    next.visible = true;
    setModelOpacity(next, 0);

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating = false;
      }
    });

    tl.to(camera.position, {
      duration: 2,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      ease: 'power2.inOut'
    }, 0);

    tl.to(controls.target, {
      duration: 2,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: 'power2.inOut',
      onUpdate: () => controls.update()
    }, 0);

    tl.add(() => {
      fadeModel(current, 0, 1.2);
      fadeModel(next, 1, 1.2);
    }, 0);

    tl.call(() => {
      current.visible = false;
      currentModel = nextModel;
      updateCheckpointButtons();
    });

    
  });
}

// --- Update Checkpoint Redirect Buttons ---
function updateCheckpointButtons() {
  const heartBtn = document.getElementById('heartRedirectBtn');
  const brainBtn = document.getElementById('brainRedirectBtn');
  
  // Hide all redirect buttons
  heartBtn.style.display = 'none';
  brainBtn.style.display = 'none';
  
  // Show the appropriate button based on current model
  if (currentModel === 'heart') {
    heartBtn.style.display = 'block';
  } else if (currentModel === 'brain') {
    brainBtn.style.display = 'block';
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// --- Start ---
init();
animate();