import * as THREE from 'three';
import { OrganScene } from './common.js';
import { brainConfig, checkpoints, midpoints, checkpointInfo } from './config/brain.js';

const scene = new OrganScene(brainConfig, checkpoints, checkpointInfo, midpoints);
scene.init();
