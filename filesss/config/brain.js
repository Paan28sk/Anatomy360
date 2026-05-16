// Brain organ configuration and data
import * as THREE from 'three';

export const brainConfig = {
  modelPath: '/Models/brainglb.glb',
  modelScale: 3,
  initialCameraPos: { x: -5, y: 1.1, z: 2.1 },
  initialCameraTarget: { x: 0, y: 0, z: 0 }
};

// Brain-specific checkpoints (different from heart)
export const checkpoints = [
  { position: new THREE.Vector3(0, 3.061616997868383e-16, 5), target: new THREE.Vector3(0, 0, 0) },
  { position: new THREE.Vector3(-1.9863532702023994, 2.9217942770887286, 1.4055547452876862), target: new THREE.Vector3(0.3443435333172512, 0.32343017829175025, 0.08540883101296075) },
  { position: new THREE.Vector3(0.6727901158351712, 0.33098229934521484, 0.9086561232044061), target: new THREE.Vector3(0.3008710153855998, 0.20858830976712897, 0.7975992890152299) },
  { position: new THREE.Vector3(-1.8989325217813111, -1.4280148721850758, 1.3648355561705587), target: new THREE.Vector3(-0.5685015694184434, -1.0106106930808918, -0.02322332130986333) },
  { position: new THREE.Vector3(0.7989529266408407, 0.27426502262956354, 1.1948060052544491), target: new THREE.Vector3(-0.0885222061973044, -0.019513560919356184, 1.0963562138312708) },
  { position: new THREE.Vector3(-0.6916198460918312, -1.3282597432979495, 1.345896984979905), target: new THREE.Vector3(0.09398875275602292, -1.2415908046812107, 0.6741213359385542) }
];

export const midpoints = {
  "0-1": [new THREE.Vector3(0, 3.061616997868383, 5)],
  "1-2": [new THREE.Vector3(-0.8677438167531266, 2.054067512896102, -0.946388540923102)],
  "2-3": [new THREE.Vector3(-0.9006903717936546, -1.2867167587344204, -0.8181693719883538)],
  "3-4": [new THREE.Vector3(-1.0104316098650217, 0.7465867385188663, 0.007992387750980795)],
  "4-5": [
    new THREE.Vector3(2.5976267766846672, 0.7359748863214668, 0.871031979298722),
    new THREE.Vector3(0.499614736110647, 0.8366593786710019, -2.039611011569733)
  ],
  "5-6": [new THREE.Vector3(0.27881024112066705, 0.29792332312431397, -0.778873631083522)],
  "6-7": [new THREE.Vector3(-0.29184666168342444, -1.305016977577012, 0.511365105674376)],
  "7-8": [new THREE.Vector3(-0.9751912159401902, 0.9727848540463673, -0.4886180807998388)],
  "8-9": [new THREE.Vector3(-0.5854567377419312, 1.5796048125109696, 0.1617675014270474)]
};

export const checkpointInfo = [
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
