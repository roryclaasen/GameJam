import * as PIXI from 'pixi.js';

import tilesheetBuilding from './resources/building.tilesheet.png';
import tilesheetBuildingData from './resources/building.tilesheet.json';
import cellblock from './resources/map/cellblock.json';
import level2 from './resources/map/level2.json';

import oldMan from './resources/manOld_stand.png';

export class AssetManager {

    private static loader = PIXI.loader;
    private static resources = AssetManager.loader.resources;

    static loadAll(): void {
        this.loader.add('sheetBuilding', tilesheetBuilding);
        this.loader.add('sheetBuildingData', tilesheetBuildingData);
        this.loader.add('level0', cellblock);
        this.loader.add('level1', level2);
        this.loader.add('player', oldMan);

        this.loader.on("complete", AssetManager.completed);
    }

    private static completed(loader: PIXI.loaders.Loader, object: any) {
    }

    static getLevel(name: string): any {
        return this.resources[name].data;
    }

    static getTextureWithFrame(id: number, sheet: string, sheetData?: string): PIXI.Texture {
        var texture = this.resources[sheet].texture.clone();
        if (texture) {
            if (sheetData === undefined) sheetData = sheet + "Data";
            texture.frame = AssetManager.getRectange(id, sheetData);
            return texture;
        }
        throw ("Missing texture");
    }

    static newSprite(name: string): PIXI.Sprite {
        return new PIXI.Sprite(this.resources[name].texture.clone());
    }

    static getSprite(id: number, sheet: string, sheetData?: string): PIXI.Sprite {
        return new PIXI.Sprite(AssetManager.getTextureWithFrame(id, sheet, sheetData));
    }

    static getRectange(id: number, data: string): PIXI.Rectangle {
        var textureData = this.resources[data].data;
        if (textureData) {
            var tileHeight = textureData.tileheight;
            var tileWidth = textureData.tilewidth;
            var x = Math.floor(id % textureData.columns) * tileWidth;
            var y = Math.floor(id / textureData.columns) * tileHeight;
            return new PIXI.Rectangle(x, y, tileWidth, tileHeight)
        }
        throw ("Missing texture data");
    }
}