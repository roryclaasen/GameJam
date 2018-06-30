import * as PIXI from 'pixi.js';

import { Game } from './game';

const renderer = PIXI.autoDetectRenderer(708, 576);
renderer.options.antialias = true;
renderer.options.forceFXAA = true;

document.body.appendChild(renderer.view);
const game = new Game(renderer);


