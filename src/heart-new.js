import * as THREE from 'three';
import { OrganScene } from './common.js';
import { heartConfig, checkpoints, midpoints, checkpointInfo } from './config/heart.js';

const scene = new OrganScene(heartConfig, checkpoints, checkpointInfo, midpoints);
scene.init();
