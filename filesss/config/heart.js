// Heart organ configuration and data
import * as THREE from 'three';

export const heartConfig = {
  modelPath: '/Models/heart.glb',
  modelScale: 5,
  initialCameraPos: { x: 0, y: 0, z: 5 },
  initialCameraTarget: { x: 0, y: 0, z: 0 }
};

// Heart-specific checkpoints (keep from heart.js)
export const checkpoints = [
  { position: new THREE.Vector3(0.000, 0.000, 5.000), target: new THREE.Vector3(0.000, 0.000, 0.000) },
  { position: new THREE.Vector3(-1.402, 2.010, -1.813), target: new THREE.Vector3(0.185, 0.576, 0.309) },
  { position: new THREE.Vector3(-0.549, -0.119, -1.559), target: new THREE.Vector3(-0.582, -0.639, -1.205) },
  { position: new THREE.Vector3(-1.389, -0.995, -0.537), target: new THREE.Vector3(-1.224, 0.119, -0.143) },
  { position: new THREE.Vector3(0.260, 0.395, 1.623), target: new THREE.Vector3(-0.471, 0.414, 0.275) },
  { position: new THREE.Vector3(0.516, 0.693, -1.828), target: new THREE.Vector3(0.108, 0.215, 0.044) },
  { position: new THREE.Vector3(0.341, 0.115, -0.534), target: new THREE.Vector3(0.323, -0.100, -0.366) },
  { position: new THREE.Vector3(-0.448, -1.247, 0.477), target: new THREE.Vector3(-0.571, -0.149, -0.366) },
  { position: new THREE.Vector3(-0.975, 0.973, -0.489), target: new THREE.Vector3(-0.929, 1.248, -0.307) },
  { position: new THREE.Vector3(-0.791, 2.237, 0.436), target: new THREE.Vector3(-0.680, 1.959, 0.161) }
];

export const midpoints = {
  "0-1": [new THREE.Vector3(0.000, 3.062, 5.000)],
  "1-2": [new THREE.Vector3(-0.868, 2.054, -0.946)],
  "2-3": [new THREE.Vector3(-0.901, -1.287, -0.818)],
  "3-4": [new THREE.Vector3(-1.010, 0.747, 0.008)],
  "4-5": [
    new THREE.Vector3(2.598, 0.736, 0.871),
    new THREE.Vector3(0.500, 0.837, -2.040)
  ],
  "5-6": [new THREE.Vector3(0.279, 0.298, -0.779)],
  "6-7": [new THREE.Vector3(-0.292, -1.305, 0.511)],
  "7-8": [new THREE.Vector3(-0.975, 0.973, -0.489)],
  "8-9": [new THREE.Vector3(-0.585, 1.580, 0.162)]
};a

export const checkpointInfo = [
  { 
    title: { en: "", ms: "" },
    description: { en: "", ms: "" },
    audio: { en: '', ms: '' } 
  },
  { 
    title: { en: "Vena Cav", ms: "Vena Kava" },
    description: { en: "• The vena cava has two big veins that bring used blood back to the heart.\n\n• These veins carry blood low in oxygen from the body.\n\n• It's like a main station where all the blood gathers.\n\n• This is where the blood's trip through the heart starts to get fresh oxygen.",
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
                   ms: "• Injap sabit pulmonari menghubungkan ventrikel kanan dengan arteri pulmonari.\n\n• Bentuknya seperti bulan separuh, sebab itulah ia dipanggil \"semilunar.\"\n\n• Apabila ventrikel kanan mengecut, injap ini terbuka untuk membenarkan darah mengalir ke paru-paru.\n\n• Selepas itu ia tertutup untuk menghalang darah mengalir semula dan mengekalkan tekanan yang kuat." },
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
    description: { en: "• The aorta is the heart's main exit and the largest artery in the body.\n\n• It carries oxygen-rich blood to your whole body—from brain to organs.\n\n• Its thick walls handle strong pressure from each heartbeat.\n\n• It branches into smaller arteries and capillaries to deliver oxygen to every cell.",
                   ms: "• Aorta ialah pintu keluar utama jantung dan arteri terbesar dalam badan.\n\n• Ia membawa darah kaya oksigen ke seluruh badan—dari otak hingga organ.\n\n• Dindingnya yang tebal mampu menahan tekanan kuat setiap degupan jantung.\n\n• Ia bercabang menjadi arteri dan kapilari kecil untuk menghantar oksigen ke setiap sel." },
    audio: { en: 'audio/7.mp3', ms: '' }
  },
  { 
    title: { en: "Body Circulation", ms: "Peredaran Badan" },
    description: { 
      en: "• You've just explored the amazing system that keeps you alive—the heart.\n\n• Every part—chambers, valves, and vessels—works together nonstop.\n\n• It pumps 5 liters of blood every minute and beats over 100,000 times a day.\n\n• From tiny capillaries to the giant aorta, it's a natural engineering marvel.",
      ms: "• Anda baru sahaja menjelajahi sistem menakjubkan yang memastikan anda terus hidup—jantung.\n\n• Setiap bahagian—ruang, injap, dan salur darah—bekerja bersama tanpa henti.\n\n• Ia mengepam 5 liter darah setiap minit dan berdegup lebih 100,000 kali sehari.\n\n• Dari kapilari kecil hingga aorta besar, ia adalah keajaiban kejuruteraan semula jadi."
    },
    audio: { en: 'audio/8.mp3', ms: '' }
  }
];
