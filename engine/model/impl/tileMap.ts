
import {SpriteSheet} from "./spriteSheet";
import {Game} from "../../core/game";
import {Rect} from "../../core/geometry/rect";
import {AbstractFilter} from "../../core/renderer/webGl/filters/abstract/abstractFilter";
import {RigidRectangle,Vec2} from '../../core/physics/rigidShapes';
import {CommonObject} from "../commonObject";
import {DebugError} from "../../debugError";



export class TileMap extends CommonObject  {

    type:string = "TileMap";
    spriteSheet:SpriteSheet = null;
    data:any[] = [];
    _tilesInScreenX:number;
    _tilesInScreenY:number;
    width:number = 0;
    height:number = 0;

    filters: AbstractFilter[];
    blendMode:string = '';

    constructor(public game:Game){
        super();
    }

    fromTiledJSON(source:number[],mapWidth:number,mapHeight:number){
        this.data = [];
        let cnt:number = 0;
        for (let j=0;j<mapHeight;j++){
            this.data[j] = [];
            for (let i=0;i<mapWidth;i++) {
                let val:number = source[cnt++];
                if (val===0) this.data[j][i] = undefined;
                else {
                    this.data[j][i] = {};
                    this.data[j][i].val = val - 1;
                    let w = this.spriteSheet._frameWidth;
                    let h = this.spriteSheet._frameHeight;
                    let x = i*w;
                    let y = j*h;
                    let c = new Vec2(x+w/2,y+h/2);
                    let r = new RigidRectangle(this.game,c,w,h,0);
                    r.fixedAngle = true;
                    this.data[j][i].rect = r;
                }
            }
        }
        this.width = mapWidth;
        this.height = mapHeight;
        if (DEBUG) {
            let found = cnt;
            let expected = source.length;
            if (expected!==found) {
                throw new DebugError(`incorrect mapWidth/mapHeight provided. Expected ${expected} tiles, but ${found} found (${mapWidth}*${mapHeight})`);
            }
        }
    }

    revalidate(){
        this.game.camera._updateRect();
        let camRect = this.game.camera.getRectScaled();
        if (!this.spriteSheet) return;
        this._tilesInScreenX = ~~(camRect.width / this.spriteSheet._frameWidth);
        this._tilesInScreenY = ~~(camRect.height / this.spriteSheet._frameHeight);
    }

    getTileAt(x:number,y:number){
        if (!this.spriteSheet) return;
        let tilePosX = ~~(x / this.spriteSheet._frameWidth);
        let tilePosY = ~~(y / this.spriteSheet._frameHeight);
        if (!this.data[tilePosY]) return;
        let tile = this.data[tilePosY][tilePosX];
        if (!tile) return;
        return {
            tileIndex: this.spriteSheet.numOfFramesH * tilePosY + tilePosX + 1,
            tile
        }
    }

    getTilesAtRect(rect){
        let result = [];
        if (!this.spriteSheet) return result;
        let alreadyCheckedTiles = {};

        let x = rect.x,y;
        let maxX = rect.x+rect.width,maxY = rect.y+rect.height;
        while (true) {
            y = rect.y;
            while (true) {
                let tileInfo = this.getTileAt(x,y);
                if (tileInfo) {
                    if (!alreadyCheckedTiles[tileInfo.tileIndex]) {
                        result.push(tileInfo.tile);
                        alreadyCheckedTiles[tileInfo.tileIndex] = true;
                    }
                }
                if (y===maxY) break;
                y+=this.spriteSheet._frameHeight;
                if (y>maxY) y = maxY;
            }
            if (x===maxX) break;
            x+=this.spriteSheet._frameWidth;
            if (x>maxX) x = maxX;
        }
        return result;
    }

    render(){
        let spriteSheet = this.spriteSheet;
        if (!spriteSheet) return;
        let camera = this.game.camera;
        let renderer = this.game.getRenderer();
        let cameraRect = camera.getRectScaled();
        let tilePosX = ~~((cameraRect.x) / this.spriteSheet._frameWidth);
        let tilePosY = ~~((cameraRect.y) / this.spriteSheet._frameHeight);
        if (tilePosX<0) tilePosX = 0;
        if (tilePosY<0) tilePosY = 0;
        let w = tilePosX + this._tilesInScreenX + 1;
        let h = tilePosY + this._tilesInScreenY + 1;
        for (let y=tilePosY;y<=h;y++) {
            for (let x=tilePosX;x<=w;x++) {
                let tileVal = this.data[y] && this.data[y][x] && this.data[y][x].val;
                if (tileVal===false || tileVal===null || tileVal===undefined) continue;
                let destRect:Rect = Rect.fromPool().clone();
                destRect.setXYWH(
                    x*spriteSheet._frameWidth, y*spriteSheet._frameHeight,
                    spriteSheet._frameWidth, spriteSheet._frameHeight
                );
                // todo
                // renderer.drawImage(
                //     spriteSheet.getDefaultResourcePath(),
                //     spriteSheet.getFrameRect(tileVal),
                //     destRect
                // );
            }
        }
    }
    
}