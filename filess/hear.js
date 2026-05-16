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
let camera, scene, renderer, labelRenderer, heart, controls;
let labelObjects = [];
let currentAudio = null;

// --- Checkpoints & Info ---
const checkpoints = [
  {//Starter
    position: new THREE.Vector3(0, 3.061616997868383e-16, 5),
    target: new THREE.Vector3(0, 0, 0)
  },
  {//Vena Cava
    position: new THREE.Vector3(-1.4023490122330493, 2.0104319859718913, -1.8132739482054463),
    target: new THREE.Vector3(0.18469881607781946, 0.5760893100494515, 0.3088253203951971)
  },
  {//Tricuspid Valve
    position: new THREE.Vector3(-0.5485831726477581, -0.11850284899134256, -1.5589677436114984),
    target: new THREE.Vector3(-0.5824539126274394, -0.6391856798982529, -1.204664608877301)
  },
  {//Semilunar Valve (Pulmonary)
    position: new THREE.Vector3(-1.3890207457184167, -0.9954126491632772, -0.5367563814780849),
    target: new THREE.Vector3(-1.223556116202046, 0.1188021125638202, -0.14309922338318282)
  },
  {//Out of Heart (Lung)
    position: new THREE.Vector3(0.2603483930012359, 0.3949494881254664, 1.6233562845317913),
    target: new THREE.Vector3(-0.4713861282747377, 0.41354642771666494, 0.27502853379369124)
  },
  {// Pulmonary Veins
    position: new THREE.Vector3(0.5159735888008634, 0.6925290178542018, -1.828250924583656),
    target: new THREE.Vector3(0.10784812028760443, 0.2150249268103317, 0.0437546695388806)
  },
  {// Biscuspid Valve
    position: new THREE.Vector3(0.34109794622807693, 0.11476081641649863, -0.5344980877653631),
    target: new THREE.Vector3(0.323333506046966, -0.10035020481822007, -0.36624340629568264)
  },
  {// Semilunar Valve (Aorta)
    position: new THREE.Vector3(-0.4482876707762276, -1.2471912409167272, 0.47653486837266873),
    target: new THREE.Vector3(-0.5708460885795632, -0.14875668979314138, -0.36605346120740706)
  },
  {// Aorta
    position: new THREE.Vector3(-0.9751912159401902, 0.9727848540463673, -0.4886180807998388),
    target: new THREE.Vector3(-0.9289353789641681, 1.2484690533707599, -0.30718667224020757)
  },
  {// Outer Heart (Oxygenated)
    position: new THREE.Vector3(-0.7910072980056584, 2.2366910316743818, 0.4355275755810072),
    target: new THREE.Vector3(-0.6803154981734836, 1.9592420085344018, 0.1608514945770844)
  }
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
    title: { en: "Vena Cava", ms: "Vena Kava" },
    description: { en: "• The vena cava has two big veins that bring used blood back to the heart.\n\n• These veins carry blood low in oxygen from the body.\n\n• It’s like a main station where all the blood gathers.\n\n• This is where the blood’s trip through the heart starts to get fresh oxygen.",
                   ms: "• Vena kava ada dua salur darah besar yang bawa darah terpakai balik ke jantung.\n\n• Salur darah ini bawa darah yang kurang oksigen dari seluruh badan.\n\n• Ibarat stesen utama tempat semua darah berkumpul.\n\n• Di sinilah perjalanan darah dalam jantung bermula untuk dapatkan oksigen segar." },  
    audio: { en: '/Audio/VenaCava.mp3', ms: '' }
  },
  { 
    title: { en: "Tricuspid Valve", ms: "Injap Trikuspid" },
    description: { en: "• We pass through the tricuspid valve, a gate between the right atrium and right ventricle.\n\n• The valve has three flaps that open to let blood flow down.\n\n• When the ventricle fills, the flaps close to stop blood from going back.\n\n• It works like a one-way door to keep blood flowing smoothly.",
                   ms: "• Kita melalui injap trikuspid, iaitu pintu antara atrium kanan dan ventrikel kanan.\n\n• Injap ini ada tiga kepak yang terbuka untuk biarkan darah mengalir ke bawah.\n\n• Bila ventrikel penuh, kepak ini akan tertutup untuk elakkan darah mengalir semula.\n\n• Ia berfungsi seperti pintu sehala supaya darah mengalir dengan lancar." },
    audio: { en: '/Audio/TricuspidValve.mp3', ms: '' }
  },
  { 
    title: { en: "Semilunar Valve", ms: "Injap Sabit" },
    description: { en: "• The pulmonary semilunar valve connects the right ventricle to the pulmonary artery.\n\n• It's shaped like a half-moon, which is why it's called \"semilunar.\"\n\n• When the right ventricle contracts, the valve opens to let blood flow to the lungs.\n\n• It closes after to stop blood from flowing backward and keeps the pressure strong.",
                   ms: "• Injap sabit pulmonari menghubungkan ventrikel kanan dengan arteri pulmonari.\n\n• Bentuknya seperti bulan separuh, sebab itulah ia dipanggil “semilunar.”\n\n• Apabila ventrikel kanan mengecut, injap ini terbuka untuk membenarkan darah mengalir ke paru-paru.\n\n• Selepas itu ia tertutup untuk menghalang darah mengalir semula dan mengekalkan tekanan yang kuat." },
    audio: { en: '/Audio/PulmonarySemilunarValve.mp3', ms: '' }
  },
  { 
    title: { en: "Pulmonary Artery", ms: "Arteri Pulmonari" },
    description: { en: "• The pulmonary artery is the only artery that carries deoxygenated blood.\n\n• It takes oxygen-poor blood from the heart to the lungs.\n\n• It splits into left and right branches, each going to a lung.\n\n• This step is like a delivery mission—dropping off carbon dioxide for fresh oxygen.\n",
                   ms: "• Arteri pulmonari ialah satu-satunya arteri yang membawa darah tidak beroksigen.\n\n• Ia membawa darah yang kurang oksigen dari jantung ke paru-paru.\n\n• Ia bercabang kepada dua, kiri dan kanan, masing-masing menuju ke paru-paru.\n\n• Langkah ini ibarat misi penghantaran—menghantar karbon dioksida untuk diganti dengan oksigen segar." },
    audio: { en: '/Audio/PulmonaryArtery.mp3', ms: '' }
  },
  { 
    title: { en: "Pulmonary Veins", ms: "Vena Pulmonari" },
    description: { en: "• Oxygen-rich blood returns to the heart after gas exchange in the lungs.\n\n• It travels through the pulmonary veins—the only veins carrying oxygenated blood.\n\n• There are four pulmonary veins, two from each lung, entering the left atrium.\n\n• The blood is now refreshed and ready to power the rest of the body.\n",
                   ms: "• Darah kaya oksigen kembali ke jantung selepas pertukaran gas di paru-paru.\n\n• Ia melalui vena pulmonari—satu-satunya vena yang membawa darah beroksigen.\n\n• Terdapat empat vena pulmonari, dua dari setiap paru-paru, masuk ke atrium kiri.\n\n• Darah kini segar dan sedia untuk membekalkan tenaga kepada seluruh badan." },
    audio: { en: '/Audio/PulmonaryVeins.mp3', ms: '' }
  },
  { 
    title: { en: "Bicuspid Valve", ms: "Injap Bikuspid" },
    description: { en: "• The bicuspid (mitral) valve connects the left atrium to the left ventricle.\n\n• It has two flaps that open to let blood flow into the left ventricle.\n\n• Once the ventricle fills, the valve shuts tightly to prevent backflow.\n\n• Since it handles high pressure, the valve must be strong and precise.\n",
                   ms: "• Injap bikuspid (mitral) menghubungkan atrium kiri dengan ventrikel kiri.\n\n• Ia mempunyai dua kepak yang terbuka untuk membenarkan darah masuk ke ventrikel kiri.\n\n• Apabila ventrikel penuh, injap ini tertutup rapat untuk mengelakkan aliran semula darah.\n\n• Oleh kerana ia mengendalikan tekanan tinggi, injap ini mesti kuat dan tepat." },
    audio: { en: '/Audio/BicuspidValve.mp3', ms: '' }
  },
  { 
    title: { en: "Aortic Valve", ms: "Injap Aorta" },
    description: { en: "• The aortic semilunar valve connects the left ventricle to the aorta.\n\n• It opens when the left ventricle contracts, pushing oxygen-rich blood out.\n\n• After the contraction, it shuts tightly to stop blood from flowing back.\n\n• This valve keeps pressure high and blood moving efficiently.\n",
                   ms: "• Injap sabit aorta menghubungkan ventrikel kiri dengan aorta.\n\n• Ia terbuka apabila ventrikel kiri mengecut, menolak darah kaya oksigen keluar.\n\n• Selepas pengecutan, injap ini tertutup rapat untuk menghalang darah mengalir kembali.\n\n• Injap ini mengekalkan tekanan tinggi dan memastikan darah bergerak dengan cekap." },
    audio: { en: 'audio/6.mp3', ms: '' }
  },
  { 
    title: { en: "Aorta", ms: "Aorta" },
    description: { en: "• The aorta is the heart’s main exit and the largest artery in the body.\n\n• It carries oxygen-rich blood to your whole body—from brain to organs.\n\n• Its thick walls handle strong pressure from each heartbeat.\n\n• It branches into smaller arteries and capillaries to deliver oxygen to every cell.",
                   ms: "• Aorta ialah pintu keluar utama jantung dan arteri terbesar dalam badan.\n\n• Ia membawa darah kaya oksigen ke seluruh badan—dari otak hingga organ.\n\n• Dindingnya yang tebal mampu menahan tekanan kuat setiap degupan jantung.\n\n• Ia bercabang menjadi arteri dan kapilari kecil untuk menghantar oksigen ke setiap sel." },
    audio: { en: 'audio/7.mp3', ms: '' }
  },
  { 
    title: { en: "Body Circulation", ms: "Peredaran Badan" },
    description: { 
      en: "• You’ve just explored the amazing system that keeps you alive—the heart.\n\n• Every part—chambers, valves, and vessels—works together nonstop.\n\n• It pumps 5 liters of blood every minute and beats over 100,000 times a day.\n\n• From tiny capillaries to the giant aorta, it’s a natural engineering marvel.",
      ms: "• Anda baru sahaja menjelajahi sistem menakjubkan yang memastikan anda terus hidup—jantung.\n\n• Setiap bahagian—ruang, injap, dan salur darah—bekerja bersama tanpa henti.\n\n• Ia mengepam 5 liter darah setiap minit dan berdegup lebih 100,000 kali sehari.\n\n• Dari kapilari kecil hingga aorta besar, ia adalah keajaiban kejuruteraan semula jadi."
    },
    audio: { en: 'audio/8.mp3', ms: '' }
  }
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
  camera.position.set(0, 0, 5);

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
  document.body.appendChild(labelRenderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const backlight = new THREE.DirectionalLight(0xffffff, .7);
  backlight.position.set(-2.306, -1.006, -2.787);
  scene.add(backlight);
  const light = new THREE.DirectionalLight(0xffffff, .7);
  light.position.set(5, 5, 5);
  scene.add(light);
  scene.background = new THREE.Color(0x050a12);

  // --- Load Heart Model (only here!) ---
  new GLTFLoader().load('/Models/heart.glb', (gltf) => {
    heart = gltf.scene;
    heart.scale.set(5, 5, 5);

    // Make all materials shiny and physically realistic
    heart.traverse((child) => {
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

    scene.add(heart);
    console.log(gltf.scene);
    heart.position.set(0, 0, 0);
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