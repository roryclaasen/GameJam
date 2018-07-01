import * as PIXI from 'pixi.js';
import consts from './matter'

import { AssetManager } from './assetManager';
import { GameObject, Player, Entity, PhysicsWall } from './object';

export class Game {
	renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
	stage: PIXI.Container;
	ticker: PIXI.ticker.Ticker;

	tileSize = 64;

	level: Level;

	engine = consts.Engine.create();

	private levelIndex: number;

	private w: number;
	private h: number;

	constructor(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer) {
		this.renderer = renderer;
		this.ticker = new PIXI.ticker.Ticker();
		this.w = this.renderer.width;
		this.h = this.renderer.height;
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
		// this.engine.world.gravity.scale = this.engine.world.gravity.y = this.engine.world.gravity.x = 0;
		//this.level = new Level(AssetManager.getLevel('levelCellblock'), this.renderer.width, this.renderer.height);
		
		this.loadNextLevel();

		this.renderer.render(this.stage);
		this.ticker.add(delta => this.gameLoop(delta));
		
		this.ticker.start();
		consts.Engine.run(this.engine);
	}

	private loadNextLevel() {
		if (this.levelIndex == undefined) this.levelIndex = -1;
		this.levelIndex++;
		var levelName = 'level' + this.levelIndex;
		this.level = new Level(AssetManager.getLevel(levelName), this.w, this.h);
		// this.level.onComplete = this.loadNextLevel;
		consts.World.clear(this.engine.world, false);
		consts.World.add(this.engine.world, this.level.bodies);
		this.stage = this.level.container;
		this.renderer.render(this.stage);
	}

	private gameLoop(delta: number) {
		this.level.gameLoop(delta);
		this.renderer.render(this.stage);
	}
}

export class Level {
	protected stage: PIXI.Container;
	protected rawData: any;

	protected width: number;
	protected height: number;

	player: Player;

	section: number = 0;
	tilesPerSector: number = 11;

	objects: Array<GameObject>;
	private makeNextLevel: any;

	constructor(tiledMap: any, width: number, height: number) {
		this.stage = new PIXI.Container();
		this.objects = new Array<GameObject>();

		this.rawData = tiledMap;
		this.width = tiledMap.width;
		this.height = tiledMap.height;

		this.placeLayers();

		this.player = new Player(width, height);
		this.player.x = this.stage.width / 2;
		this.player.y = this.stage.height / 2;
		this.player.onMove = (x: number, y: number) => {
			var tX = Math.floor(x / 64);
			var tY = Math.floor(y / 64);
			if (!this.isCellMap(tX, tY)) {
				this.player.x = this.stage.width / 2;
				this.player.y = this.stage.height / 2;
			}
			
			if (this.isEndOfMap(tX, tY)) {
				this.makeNextLevel();
			}
		};
		this.addEntityToLevel(this.player);
	}

	addEntityToLevel(entity: Entity): void {
		this.objects.push(entity);
		// this.stage.addChild(entity.bodySprite);
		this.stage.addChild(entity.pixiSprite);
	}

	private placeLayers(): void {
		for (var l = 0; l < this.rawData.layers.length; l++) {
			var layer = this.rawData.layers[l];
			if (layer.type == "tilelayer") this.placeTileLayer(layer);
			if (layer.type == "objectlayer") this.placeObjectLayer(layer);
		}
	}

	private isCellMap(x: number, y: number): boolean {
		var layer: any;
		for (var l = 0; l < this.rawData.layers.length; l++) {
			var llayer = this.rawData.layers[l];
			if (llayer.name == "map") layer = llayer;
		}
		if (layer === undefined) return true;
		var id = layer.data[x + y * layer.width] - 1;
		if (id === -1) return false;
		return true;
	}

	private isEndOfMap(x: number, y: number) {
		var layer: any;
		for (var l = 0; l < this.rawData.layers.length; l++) {
			var llayer = this.rawData.layers[l];
			if (llayer.name == "map") layer = llayer;
		}
		if (layer === undefined) return false;
		var id = layer.data[x + y * layer.width] - 1;
		return (id == layer.properties.end);
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
				var wall = new PhysicsWall(object.x, object.y, object.width, object.height);
				this.objects.push(wall);
			}
		});
	}
	scaleLimit = 0.1;
	gameLoop(delta: number): void {
		this.objects.forEach(object => object.gameLoop(delta));
		this.stage.scale.x -= 0.00005 * delta * this.player.scaleSpeed;
		this.stage.scale.y -= 0.00005 * delta * this.player.scaleSpeed;
		
		if (this.stage.scale.x < this.scaleLimit) this.stage.scale.x = this.scaleLimit;
		if (this.stage.scale.y < this.scaleLimit) this.stage.scale.y = this.scaleLimit;
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

	set onComplete(func: any) {
		this.makeNextLevel = func;
	}
}
