import * as PIXI from 'pixi.js';
import consts from './matter'

import { AssetManager } from './assetManager';
import { GameObject, Player, Entity } from './object';

export class Game {
	renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	stage: PIXI.Container;
	ticker: PIXI.ticker.Ticker;

	tileSize = 64;

	level: Level;

	engine = consts.Engine.create();

	constructor(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) {
		this.renderer = renderer;
		this.ticker = new PIXI.ticker.Ticker();
		this.setUp();
	}

	setUp(): void {
		AssetManager.loadAll();
		PIXI.loader.on("progress", (loader, resource) => {
			console.log("loading: " + resource.url);
			console.log("progress: " + loader.progress + "%");
		});
		PIXI.loader.load((loader: PIXI.loaders.Loader, resources: PIXI.loaders.ResourceDictionary) => {
			this.start();
		});
	}

	start(): void {
		this.level = new Level(AssetManager.getLevel('levelCellblock'));
		consts.World.add(this.engine.world, this.level.bodies);
		this.stage = this.level.container;

		this.renderer.render(this.stage);
		this.ticker.add(delta => this.gameLoop(delta));
		consts.Engine.run(this.engine);
		this.ticker.start();
	}

	private gameLoop(delta: number) {
		this.level.gameLoop(delta);
		this.renderer.render(this.stage);
	}
}

export class Level {
	protected world: any;

	protected stage: PIXI.Container;
	protected rawData: any;

	protected width: number;
	protected height: number;

	player: Player;

	objects: Array<GameObject>;

	constructor(tiledMap: any) {
		this.stage = new PIXI.Container();
		this.objects = new Array<GameObject>();

		this.rawData = tiledMap;
		this.width = tiledMap.width;
		this.height = tiledMap.height;

		this.placeLayers();

		this.player = new Player();
		this.player.x = 128;
		this.player.y = 128;
		this.addEntityToLevel(this.player);
	}

	addEntityToLevel(entity: Entity): void {
		this.objects.push(entity);
		this.stage.addChild(entity.bodySprite);
		this.stage.addChild(entity.pixiSprite);
	}

	private placeLayers(): void {
		for (var l = 0; l < this.rawData.layers.length; l++) {
			var layer = this.rawData.layers[l];
			if (layer.type == "tilelayer") this.placeTileLayer(layer);
			if (layer.type == "objectlayer") this.placeObjectLayer(layer);
		}
	}

	private placeTileLayer(layer: any): void {
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var id = layer.data[x + y * this.width] - 1;
				if (id === -1) continue;
				var sprite = AssetManager.getSprite(id, 'sheetBuilding');
				sprite.x = x * this.rawData.tilewidth;
				sprite.y = y * this.rawData.tileheight;

				this.stage.addChild(sprite);
			}
		}
	}

	private placeObjectLayer(layer: any): void {
		layer.objects.forEach((object: any) => {
			if (object.type == "wall") {

			}
		});
	}

	gameLoop(delta: number): void {
		this.objects.forEach(object => object.gameLoop(delta));
	}

	get container(): PIXI.Container {
		return this.stage;
	}

	get bodies(): Array<Matter.Body> {
		var bods = new Array<Matter.Body>();
		this.objects.forEach((object) => {
			bods.push(object.body);
		});
		return bods;
	}
}
