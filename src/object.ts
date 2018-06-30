import { AssetManager } from './assetManager';
import { Sprite } from 'pixi.js';
import consts from './matter'

import { Game } from './game';
import Keyboard from './keyboard';

export class GameObject {
    protected _body: Matter.Body;
    protected _bodySprite: PIXI.Sprite;
    protected _sprite: PIXI.Sprite;

    protected constructor(x: number, y: number, w: number, h: number, sprite?: PIXI.Sprite) {
        if (sprite.x + sprite.y + sprite.width + sprite.height > 0) {
            x = sprite.x;
            y = sprite.y
            w = sprite.width;
            h = sprite.height;
        }

        this._body = consts.Bodies.rectangle(x, y, w, h);
        this._sprite = sprite;
        this._sprite.anchor.x = 0.5;
        this._sprite.anchor.y = 0.5;

        var shape = new PIXI.Graphics();
        shape.beginFill(0xFF00FF);
        shape.lineStyle(2, 0xFFFFFF)
        shape.drawRect(0, 0, w, h);
        var texture = shape.generateCanvasTexture();
        this._bodySprite = new PIXI.Sprite(texture);
        this._bodySprite.anchor.x = 0.5;
        this._bodySprite.anchor.y = 0.5;
        this._bodySprite.position.x = x;
        this._bodySprite.position.y = y;

        this.angle = 0;
    }

    get body(): Matter.Body {
        return this._body;
    }

    get sprite(): PIXI.Sprite {
        return this._sprite;
    }

    get bodySprite(): PIXI.Sprite {
        return this._bodySprite;
    }

    get x(): number {
        return this._body.position.x;
    }

    get y(): number {
        return this._body.position.y;
    }

    set x(value: number) {
        this._body.position.x = value;

        this._sprite.position.x = this._body.position.x;// * 2;
        this._bodySprite.position.x = this._body.position.x;// * 2;
    }

    set y(value: number) {
        this._body.position.y = value;

        this._sprite.position.y = this._body.position.y;// * 2;
        this._bodySprite.position.y = this._body.position.y;// * 2;
    }

    get angle(): number {
        return this._body.angle;
    }

    set angle(value: number) {
        this._body.angle = value;

        this._sprite.rotation = this._body.angle;
        this._bodySprite.rotation = this._body.angle;
    }

    radians = function (degrees: number) {
          return (degrees * Math.PI) / 180;
    };

    degrees = function (radians: number) {
          return (radians * 180) / Math.PI;
    };

    moveForward(value: number) {
        this.x += value * Math.cos(this.angle);
        this.y += value * Math.sin(this.angle);
    }

    moveBackward(value: number) {
        this.x -= value * Math.cos(this.angle);
        this.y -= value * Math.sin(this.angle);
    }

    destroy(): void {
        if (this._sprite) this._sprite.destroy();
    }

    gameLoop(delta: number): void {}
}

export class Entity extends GameObject {
    protected movingSpeed: number =  1;
    protected turningSpeed: number = 0.3;

    constructor(sprite?: PIXI.Sprite) {
        super(0, 0, 0, 0, (sprite === undefined) ? new Sprite() : sprite);
    }

    get width(): number {
        return this.sprite.width;
    }

    get height(): number {
        return this.sprite.height;
    }

    get pixiSprite(): PIXI.Sprite {
        return this.sprite;
    }

    get position(): PIXI.Point | PIXI.ObservablePoint{
        return this.sprite.position;
    }
}

export class Player extends Entity {
    constructor() {
        super(AssetManager.newSprite('player'));
        this._body.isStatic = true;
        this.movingSpeed = 1.2;
        this.turningSpeed = 0.1;
    }

    gameLoop(delta: number) { 
        if (Keyboard.isDown(Keyboard.A)) this.angle -= this.turningSpeed * delta;
        if (Keyboard.isDown(Keyboard.D)) this.angle += this.turningSpeed * delta;
        if (Keyboard.isDown(Keyboard.W)) this.moveForward(this.movingSpeed * delta);
        if (Keyboard.isDown(Keyboard.S)) this.moveBackward(this.movingSpeed * delta);
    }
}