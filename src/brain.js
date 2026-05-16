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
let camera, scene, renderer, labelRenderer, brain, controls;
let labelObjects = [];
let currentAudio = null;

// --- Checkpoints & Info ---
const checkpoints = [
  { position: new THREE.Vector3(0, 3.061616997868383e-16, 5), target: new THREE.Vector3(0, 0, 0) },
    { position: new THREE.Vector3(-1.9863532702023994, 2.9217942770887286, 1.4055547452876862), target: new THREE.Vector3(0.3443435333172512, 0.32343017829175025, 0.08540883101296075) },
    { position: new THREE.Vector3(0.6727901158351712, 0.33098229934521484, 0.9086561232044061), target: new THREE.Vector3(0.3008710153855998, 0.20858830976712897, 0.7975992890152299) },
    { position: new THREE.Vector3(-1.8989325217813111, -1.4280148721850758, 1.3648355561705587), target: new THREE.Vector3(-0.5685015694184434, -1.0106106930808918, -0.02322332130986333) },
    { position: new THREE.Vector3(0.7989529266408407, 0.27426502262956354, 1.1948060052544491), target: new THREE.Vector3(-0.0885222061973044, -0.019513560919356184, 1.0963562138312708) },
    { position: new THREE.Vector3(-0.6916198460918312, -1.3282597432979495, 1.345896984979905), target: new THREE.Vector3(0.09398875275602292, -1.2415908046812107, 0.6741213359385542) }
];

const midpoints = {
  "0-1": [ // Vena Cava → Tricuspid Valve
    new THREE.Vector3(0, 3.061616997868383, 5)
  ],
  "1-2": [ // Vena Cava → Tricuspid Valve
    new THREE.Vector3(-0.8677438167531266, 2.054067512896102, -0.946388540923102)
  ],
  "2-3": [ // Tricuspid Valve → Semilunar Valve
    new THREE.Vector3(-0.9006903717936546, -1.2867167587344204, -0.8181693719883538)
  ],
  "3-4": [ // Semilunar Valve → Outer Heart
    new THREE.Vector3(-1.0104316098650217, 0.7465867385188663, 0.007992387750980795)
  ],
  "4-5": [ // Outer Heart → Pulmonary Veins
    new THREE.Vector3(2.5976267766846672, 0.7359748863214668, 0.871031979298722), // Example midpoint — update as needed
    new THREE.Vector3(0.499614736110647, 0.8366593786710019, -2.039611011569733),  // Another optional midpoint
  ],
  "5-6": [ // Pulmonary Veins → Bicuspid Valve
    new THREE.Vector3(0.27881024112066705, 0.29792332312431397, -0.778873631083522), // Example midpoint — update as needed
  ],
  "6-7": [ // Bicuspid Valve → Semilunar Valve (Aorta)
    new THREE.Vector3(-0.29184666168342444, -1.305016977577012, 0.511365105674376), // Example midpoint — update as needed
  ],
  "7-8": [ //  Semilunar Valve (Aorta) → Aorta
    new THREE.Vector3(-0.9751912159401902, 0.9727848540463673, -0.4886180807998388), // Example midpoint — update as needed
  ],
  "8-9": [ // Aorta → Outer Heart
    new THREE.Vector3(-0.5854567377419312, 1.5796048125109696, 0.1617675014270474), // Example midpoint — update as needed
  ]
  
};

const checkpointInfo = [
  { 
    title: { en: "", ms: "" },
    description: { en: "", ms: "" },
    audio: { en: '', ms: '' } 
  },
  { 
    title: { en: "Serebrum", ms: "Serebrum" },
    description: { en: "• The cerebrum is the largest part of the brain.\n\n• It controls emotions, personality, and senses like vision and hearing.\n\n• It is where learning, memory, language, and problem-solving happen.\n\n• It receives information from the body, interprets it, and decides how you should respond.",
                   ms: "• Serebrum ialah bahagian otak yang paling besar.\n\n• Ia mengawal emosi, personaliti, serta deria seperti penglihatan dan pendengaran.\n\n• Tempat berlakunya pembelajaran, ingatan, bahasa dan penyelesaian masalah.\n\n• Menerima maklumat daripada badan, mentafsirnya, dan menentukan tindak balas." },  
    audio: { en: '/Audio/VenaCava.mp3', ms: '' }
  },
  { 
    title: { en: "Hipotalamus", ms: "Hipotalamus" },
    description: { en: "• The hypothalamus keeps the body balanced (homeostasis)\n\n• It controls body temperature, water levels, and blood pressure.\n\n• It tells you when you are hungry, thirsty, or tired.\n\n• It connects the brain to the endocrine system through the pituitary gland.",
                   ms: "• Hipotalamus memastikan badan berada dalam keadaan seimbang (homeostasis).\n\n• Ia mengawal suhu badan, paras air, dan tekanan darah.\n\n• Memberitahu bila kita lapar, dahaga atau letih.\n\n• Menghubungkan sistem saraf dengan sistem endokrin melalui kelenjar pituitari." },
    audio: { en: '/Audio/TricuspidValve.mp3', ms: '' }
  },
  { 
    title: { en: "Serebelum", ms: "Serebelum" },
    description: { en: "• The cerebellum helps you stay balanced.\n\n• It makes muscle movements smooth and coordinated.",
                   ms: "• Serebelum membantu mengekalkan keseimbangan badan.\n\n• Ia membuat gerakan otot menjadi licin dan terkoordinasi." },
    audio: { en: '/Audio/PulmonarySemilunarValve.mp3', ms: '' }
  },
  { 
    title: { en: "Kelenjar Pituitari", ms: "Kelenjar Pituitari" },
    description: { en: "• The pituitary gland is the master gland of the body.\n\n• It releases hormones that control other glands.",
                   ms: "• Kelenjar pituitari ialah kelenjar utama dalam sistem endokrin.\n\n• Ia merembes hormon yang mengawal kelenjar lain dalam badan." },
    audio: { en: '/Audio/PulmonaryArtery.mp3', ms: '' }
  },
  { 
    title: { en: "Medula Oblongata", ms: "Medula Oblongata" },
    description: { en: "• The medulla oblongata controls automatic actions like heartbeat and breathing.\n\n• It also manages digestion and blood pressure.\n\n• It controls reflexes such as coughing, sneezing, swallowing, and vomiting.",
                   ms: "• Medula oblongata mengawal tindakan automatik seperti denyutan jantung dan pernafasan.\n\n• Ia juga mengawal pencernaan dan tekanan darah.\n\n• Mengurus refleks seperti batuk, bersin, menelan dan muntah." },
    audio: { en: '/Audio/PulmonaryVeins.mp3', ms: '' }
  },
];

// --- Audio Preloading ---
const preloadedAudio = {};
checkpointInfo.forEach((info, index) => {
  preloadedAudio[index] = {};
  LANGS.forEach(lang => {
    if (info.audio && info.audio[lang]) {
      const audio = new Audio(info.audio[lang]);
      audio.preload = 'auto';
      preloadedAudio[index][lang] = audio;
    }
  });
});

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
      camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
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
        camera.lookAt(to.target);
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
  goToCheckpoint(currentCheckpoint, currentCheckpoint, true);
};
document.getElementById('lang-ms').onclick = () => {
  currentlanguage = 'ms';
  setActiveLangButton('ms');
  goToCheckpoint(currentCheckpoint, currentCheckpoint, true);
};
setActiveLangButton(currentlanguage);

window.addEventListener('keydown', (e) => {
  let newCheckpoint = currentCheckpoint;
  if (e.key === 'ArrowRight') {
    if (currentAudio && !currentAudio.paused) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      document.getElementById('textOverlay').style.opacity = 0;
    }
    newCheckpoint = (currentCheckpoint + 1) % checkpoints.length;
    goToCheckpoint(currentCheckpoint, newCheckpoint);
    currentCheckpoint = newCheckpoint;
  } else if (e.key === 'ArrowLeft') {
    newCheckpoint = (currentCheckpoint - 1 + checkpoints.length) % checkpoints.length;
    goToCheckpoint(currentCheckpoint, newCheckpoint);
    currentCheckpoint = newCheckpoint;
  } else if (e.key === 'c') {
    moveCameraTo(0, 3.061616997868383e-16, 5);
    lookAt(0, 0, 0);
  } else if (e.key.toLowerCase() === 'p') {
    console.log('📍 Camera position:', camera.position);
    console.log('🎯 Camera target (controls.target):', controls.target);
  }
});


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
  controls.target.set(0, 0, 0);
  controls.update();

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.top = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  document.getElementById('canvasContainer').appendChild(renderer.domElement);
  
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const backlight = new THREE.DirectionalLight(0xffffff, .7);
  backlight.position.set(-2.306, -1.006, -2.787);
  scene.add(backlight);
  const light = new THREE.DirectionalLight(0xffffff, .7);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.background = new THREE.Color(0x050a12);

  // --- Load Heart Model (only here!) ---
  new GLTFLoader().load('/Models/brainglb.glb', (gltf) => {
    brain = gltf.scene;
    brain.scale.set(3, 3, 3
    );

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
        }
      }
    });

    scene.add(brain);
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