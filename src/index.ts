import * as PIXI from 'pixi.js';

import { Game } from './game';

const WIDTH = 768, HEIGHT = 768;

const renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
renderer.options.antialias = false;
renderer.options.forceFXAA = false;

document.body.appendChild(renderer.view);
const game = new Game(renderer);


