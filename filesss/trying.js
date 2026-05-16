import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


// --- Constants & Globals ---
const LANGS = ['en', 'ms'];
let currentlanguage = 'en';
let currentCheckpoint = 0;
let camera, scene, renderer, labelRenderer, brain, heart, fullbody, controls;
let labelObjects = [];
let currentAudio = null;
let currentModel = 'fullbody'; // Track which model is active

// --- Checkpoints & Info ---




// --- Audio Preloading ---
function fadeModel(model, opacity, duration = 1) {
  model.traverse(child => {
    if (child.isMesh) {
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

function createLabelDiv(text) {
  const div = document.createElement('div');
  div.className = 'heart-label';
  div.textContent = text;
  return div;
}

function addLabel(mesh, description, name) {
  const div = createLabelDiv(name);
  div.addEventListener("click", (event) => {
    event.stopPropagation();
    showPopup(name, description);
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    moveCameraTo(worldPos.x + 1.5, worldPos.y + 1.5, worldPos.z + 2, worldPos);
  });

  const label = new CSS2DObject(div);
  label.position.set(0, 0.5, 0);
  mesh.add(label);
  labelObjects.push(label);
}

function showPopup(title, text) {
  const popup = document.getElementById('infoPopup');
  if (popup) {
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupText').textContent = text;
    popup.style.display = 'block';
  }
}
window.hidePopup = function () {
  document.getElementById('infoPopup').style.display = 'none';
};

// --- Camera Animation ---
function moveCameraTo(x, y, z, lookAt = { x: -1.4023490122330493, y: 2.0104319859718913, z: -1.8132739482054463 }) {
  gsap.to(camera.position, {
    duration: 2,
    x,
    y,
    z,
    onUpdate: () => {
        controls.target.set(x, y, z);
        controls.update();
    }
  });
}

// --- Main Checkpoint Logic ---
function goToCheckpoint(fromIndex, toIndex, skipCamera = false) {
  const from = checkpoints[fromIndex];
  const to = checkpoints[toIndex];
  if (!to || !from) return;

  const overlay = document.getElementById('textOverlay');
  const title = document.getElementById('checkpointTitle');
  const desc = document.getElementById('checkpointDesc');
  const info = checkpointInfo[toIndex];

  if (skipCamera) {
    // Only update overlay and audio, no camera movement
    title.textContent = info.title[currentlanguage] || '';
    desc.innerHTML = (info.description[currentlanguage] || '').replace(/\n/g, '<br>');
    gsap.set(overlay, { opacity: 0 });
    gsap.to(overlay, { opacity: 1, duration: 1 });

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (preloadedAudio[toIndex] && preloadedAudio[toIndex][currentlanguage]) {
      currentAudio = preloadedAudio[toIndex][currentlanguage];
      currentAudio.currentTime = 0;
      currentAudio.play();
      currentAudio.addEventListener('ended', () => {
        setTimeout(() => {
          gsap.to(overlay, { opacity: 0, duration: 1 });
        }, 5000);
      });
    }
    return;
  }

  // Camera animation
  let key = `${fromIndex}-${toIndex}`;
  let path = midpoints[key];
  if (!path) {
    const reverseKey = `${toIndex}-${fromIndex}`;
    const reversePath = midpoints[reverseKey];
    path = reversePath ? [...reversePath].reverse() : [];
  }
  const fullPath = [from.position, ...path, to.position];

  const timeline = gsap.timeline();
  for (let i = 0; i < fullPath.length - 1; i++) {
    const start = fullPath[i];
    const end = fullPath[i + 1];
    timeline.to(camera.position, {
      duration: 1.5,
      x: end.x,
      y: end.y,
      z: end.z,
      onUpdate: () => {
        controls.target.set(to.target.x, to.target.y, to.target.z);
        controls.update();
      }
    });
  }
  timeline.to(controls.target, {
    duration: 1.5 * fullPath.length,
    x: to.target.x,
    y: to.target.y,
  
    z: to.target.z
  }, 0);

  timeline.call(() => {
    title.textContent = info.title[currentlanguage] || '';
    desc.innerHTML = (info.description[currentlanguage] || '').replace(/\n/g, '<br>');
    gsap.set(overlay, { opacity: 0 });
    gsap.to(overlay, { opacity: 1, duration: 1 });

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    if (preloadedAudio[toIndex] && preloadedAudio[toIndex][currentlanguage]) {
      currentAudio = preloadedAudio[toIndex][currentlanguage];
      currentAudio.currentTime = 0;
      currentAudio.play();
      currentAudio.addEventListener('ended', () => {
        setTimeout(() => {
          gsap.to(overlay, { opacity: 0, duration: 1 });
        }, 5000);
      });
    }
  });
}
//document.getElemetn
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



window.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

  // 🛑 Prevent running before models load
  if (!fullbody || !heart || !brain) return;

  let nextModel;
  if (currentModel === 'fullbody') nextModel = 'heart';
  else if (currentModel === 'heart') nextModel = 'brain';
  else nextModel = 'fullbody';

  const views = {
    heart: {
      pos: { x: -1, y: 0, z: 0 },
      target: { x: 0, y: 0, z: 0 }
    },
    brain: {
      pos: { x: -5, y: 1.1, z: 2.1 },
      target: { x: 0, y: 1, z: 0 }
    },
    fullbody: {
      pos: { x: 0, y: 2, z: 5 },
      target: { x: 0, y: 1, z: 0 }
    }
  };

  const models = { fullbody, heart, brain };

  const current = models[currentModel];
  const next = models[nextModel];
  const modelCenter = new THREE.Vector3();
  new THREE.Box3().setFromObject(next).getCenter(modelCenter);
  // 🛑 Stop overlapping animations
  gsap.killTweensOf(camera.position);
  gsap.killTweensOf(controls.target);

  // 🌫️ Prepare next model
  next.visible = true;
  setModelOpacity(next, 0);

  const tl = gsap.timeline();

  // 🎥 Camera movement
  tl.to(camera.position, {
    duration: 2,
    x: pos.x,
    y: pos.y,
    z: pos.z,
    ease: "power2.inOut"
  }, 0);

  // 🎯 Target movement (IMPORTANT)
  tl.to(controls.target, {
    duration: 2,
    x: target.x,
    y: target.y,
    z: target.z,
    ease: "power2.inOut",
    onUpdate: () => controls.update()
  }, 0);

  // 🌫️ Crossfade
  tl.add(() => {
    fadeModel(current, 0, 1.2);
    fadeModel(next, 1, 1.2);
  }, 0);

  // 🧹 Cleanup
  tl.call(() => {
    current.visible = false;
    currentModel = nextModel;
    // ✅ sync orbit system with new target
  currentTarget.set(target.x, target.y, target.z);

  // ✅ recalculate orbit angles based on new camera position
  const offset = new THREE.Vector3().subVectors(camera.position, currentTarget);

  radius = offset.length();

  angleX = Math.atan2(offset.x, offset.z);
  angleY = Math.asin(offset.y / radius);
  });

});


// --- Mouse Controls for Model Rotation ---



// --- Initialization ---
function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(-5, 1.1, 2.1);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enableRotate = true;
  controls.enablePan = true;
  // Change mouse buttons: left click for model rotation (custom), right click for camera rotation
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,  // Disable left click for OrbitControls
    RIGHT: null,  // Right click for camera rotation
    MIDDLE: THREE.MOUSE.PAN  // Middle click for pan
  };
  controls.target.set(0, 0, 0);
  controls.update();

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(labelRenderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const backlight = new THREE.DirectionalLight(0xffffff, .7);
  backlight.position.set(-2.306, -1.006, -2.787);
  scene.add(backlight);
  const light = new THREE.DirectionalLight(0xffffff, .7);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.background = new THREE.Color(0x050a12);

  new GLTFLoader().load('/Models/heart.glb', (gltf) => {
    heart = gltf.scene;
    heart.scale.set(1, 1, 1);
    heart.visible = false; // Hidden until selected
    heart.traverse((child) => {
      if (child.isMesh && child.material) {
        const m = child.material;
        if (m.type === 'MeshStandardMaterial' || m.type === 'MeshPhysicalMaterial') {
          m.metalness = 0;
          m.roughness = 1.05;
          m.envMapIntensity = 3.0;
          m.clearcoat = 1.0;
          m.clearcoatRoughness = 0.05;
          m.opacity = 1;
        }
      }
    });
    scene.add(heart);
    setModelOpacity(heart, 1);
  });

  // --- Load Fullbody Model ---
  new GLTFLoader().load('/Models/fullbody.glb', (gltf) => {
    fullbody = gltf.scene;
    fullbody.scale.set(3, 3, 3);
    fullbody.position.set(0, -1, 0); // Lower position (y = -1)
    fullbody.visible = true; // Start with fullbody visible

    // Make all materials shiny and physically realistic
    fullbody.traverse((child) => {  
      if (child.isMesh && child.material) {
        // Ensure MeshStandardMaterial or MeshPhysicalMaterial
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

    scene.add(fullbody);
    setModelOpacity(fullbody, 1);
  });

  // --- Load Brain Model ---
  new GLTFLoader().load('/Models/fullbrain.glb', (gltf) => {
    brain = gltf.scene;
    brain.scale.set(0.007, 0.007, 0.007); // Smaller size
    brain.position.set(0, 2.5, 0); // Center it
    brain.rotation.y = Math.PI / 2; // Rotate 90 degrees
    brain.visible = false; // Start with brain hidden

    // Make all materials shiny and physically realistic
    brain.traverse((child) => {
      if (child.isMesh && child.material) {
        // Ensure MeshStandardMaterial or MeshPhysicalMaterial
        if (
          child.material.type === 'MeshStandardMaterial' ||
          child.material.type === 'MeshPhysicalMaterial'
        ) {
          child.material.metalness = 0;           // Maximum metalness for mirror-like reflections
          child.material.roughness = 1.05;          // Very low roughness for high gloss
          child.material.envMapIntensity = 3.0;     // Stronger reflection from HDR
          child.material.clearcoat = 1.0;           // Extra shine (if MeshPhysicalMaterial)
          child.material.clearcoatRoughness = 0.05; // Smooth clearcoat
          child.material.transparent = true;          // Enable transparency
                // Fully opaque (can be adjusted for effects)
        }
      }
    });

    scene.add(brain);
    setModelOpacity(brain, 1);
  });

  window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {

    let nextModel;
    if (currentModel === 'fullbody') nextModel = 'heart';
    else if (currentModel === 'heart') nextModel = 'brain';
    else nextModel = 'fullbody';

    const views = {
      heart: {
        pos: { x: -1, y: 0, z: 0 },
        target: { x: 0, y: 0, z: 0 }
      },
      brain: {
        pos: { x: -5, y: 1.1, z: 2.1 },
        target: { x: 0, y: 1, z: 0 }
      },
      fullbody: {
        pos: { x: 0, y: 2, z: 5 },
        target: { x: 0, y: 1, z: 0 }
      }
    };

    const models = { fullbody, heart, brain };

    const current = models[currentModel];
    const next = models[nextModel];

    const { pos, target } = views[nextModel];

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);

    next.visible = true;
    setModelOpacity(next, 0);

    const tl = gsap.timeline();

    tl.to(camera.position, {
      duration: 2,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      ease: "power2.inOut"
    }, 0);

    tl.to(controls.target, {
      duration: 2,
      x: target.x,
      y: target.y,
      z: target.z,
      ease: "power2.inOut",
      onUpdate: () => controls.update()
    }, 0);

    tl.add(() => {
      fadeModel(current, 0, 1.2);
      fadeModel(next, 1, 1.2);
    }, 0);

    tl.call(() => {
      current.visible = false;
      currentModel = nextModel;
    });

  }
});

window.addEventListener("keydown", (o) => {
  console.log("POSITION:", camera.position);
  console.log("TARGET:", controls.target);
});

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