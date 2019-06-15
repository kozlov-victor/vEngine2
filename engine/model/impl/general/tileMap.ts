
import {Game} from "../../../game";
import {AbstractFilter} from "../../../renderer/webGl/filters/abstract/abstractFilter";
import {Image} from "@engine/model/impl/geometry/image";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {ITexture} from "@engine/renderer/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {IResource} from "@engine/declarations";
import {Camera} from "@engine/renderer/camera";
import {Rect} from "@engine/geometry/rect";
import {Size} from "@engine/geometry/size";


export class TileMap extends RenderableModel {

    public readonly type:string = "TileMap";
    public data:number[][] = [];
    public spriteSheet:Image;


    private _tilesInScreenX:number;
    private _tilesInScreenY:number;
    private _tileWidth:number = 32;
    private _tileHeight:number = 32;

    private _sprTilesInX:number = 0;
    private _sprTilesInY:number = 0;


    constructor(protected game:Game){
        super(game);
    }

    public fromTiledJSON(source:number[],mapWidth:number,mapHeight?:number){
        if (!mapHeight) mapHeight = source.length / mapWidth;
        this.data = new Array<number[]>(mapHeight);
        let cnt:number = 0;
        for (let j:number=0;j<mapHeight;j++){
            this.data[j] =  new Array<number>(mapWidth);
            for (let i:number=0;i<mapWidth;i++) {
                this.data[j][i] = source[cnt++];
            }
        }
        this._tilesInScreenX = mapWidth;
        this._tilesInScreenY = mapHeight;
        if (DEBUG) {
            const found:number = cnt;
            const expected:number = source.length;
            if (expected!==found) {
                throw new DebugError(`Incorrect mapWidth/mapHeight provided. Expected ${expected} tiles, but ${found} found (${mapWidth}*${mapHeight}=${mapWidth*mapHeight})`);
            }
        }
    }


    public revalidate(){
        if (DEBUG && !this.spriteSheet) throw new DebugError('no spriteSheet is provided for TileMap');
        this.spriteSheet.revalidate();

        this.game.getCurrScene().width = this._tilesInScreenX * this._tileWidth;
        this.game.getCurrScene().height = this._tilesInScreenY * this._tileHeight;
        this.spriteSheet.getSrcRect().size.setWH(this._tileWidth,this._tileHeight);
        this.spriteSheet.size.set(this.spriteSheet.getSrcRect().size);
        //this.spriteSheet.size.addWH(2); // to correct possible artifacts
        const texSize:Size = this.spriteSheet.getResourceLink().getTarget().size;
        this._sprTilesInX = ~~(texSize.width / this._tileWidth);
        this._sprTilesInY = ~~(texSize.height / this._tileHeight);
    }

    public draw(): boolean {

        const camera:Camera = this.game.camera;
        const cameraRect:Rect = camera.getRectScaled();
        let tilePosX:number = ~~((cameraRect.point.x) / this._tileWidth);
        let tilePosY:number = ~~((cameraRect.point.y) / this._tileHeight);
        if (tilePosX<0) tilePosX = 0;
        if (tilePosY<0) tilePosY = 0;
        let w:number = tilePosX + this._tilesInScreenX + 1;
        let h:number = tilePosY + this._tilesInScreenY + 1;
        if (w>this._tilesInScreenX-1) w = this._tilesInScreenX-1;
        if (h>this._tilesInScreenY-1) h = this._tilesInScreenY-1;
        for (let y:number=tilePosY;y<=h;y++) {
            for (let x:number=tilePosX;x<=w;x++) {
                const tileVal:number =this.data[y][x];
                //if (tileVal===false || tileVal===null || tileVal===undefined) continue;
                this.spriteSheet.getSrcRect().setXY(this.getFramePosX(tileVal),this.getFramePosY(tileVal));
                this.spriteSheet.pos.setXY(x*this._tileWidth, y*this._tileHeight);
                this.spriteSheet.render();
            }
        }
        return false;
    }

    //getTileAt(x:number,y:number):{tileIndex:number,tile:number}{
        // if (!this.spriteSheet) return;
        // let tilePosX:Int = ~~(x / this.spriteSheet.getFrameWidth());
        // let tilePosY:Int = ~~(y / this.spriteSheet.getFrameHeight());
        // if (!this.data[tilePosY]) return;
        // let tile:number = this.data[tilePosY][tilePosX];
        // if (!tile) return;
        // return {
        //     tileIndex: this.spriteSheet.numOfFramesH * tilePosY + tilePosX + 1,
        //     tile
        // }
    //}

    // getTilesAtRect(rect:Rect){
    //     let result = [];
    //     if (!this.spriteSheet) return result;
    //     let alreadyCheckedTiles:{[key:string]:boolean} = {};
    //
    //     let x:number = rect.point.x,y:number;
    //     let maxX:number = rect.point.x+rect.size.width,
    //         maxY:number = rect.point.y+rect.size.height;
    //     while (true) {
    //         y = rect.point.y;
    //         while (true) {
    //             let tileInfo = this.getTileAt(x,y);
    //             if (tileInfo) {
    //                 if (!alreadyCheckedTiles[tileInfo.tileIndex]) {
    //                     result.push(tileInfo.tile);
    //                     alreadyCheckedTiles[tileInfo.tileIndex] = true;
    //                 }
    //             }
    //             if (y===maxY) break;
    //             y+=this.spriteSheet.getFrameHeight();
    //             if (y>maxY) y = maxY;
    //         }
    //         if (x===maxX) break;
    //         x+=this.spriteSheet.getFrameWidth();
    //         if (x>maxX) x = maxX;
    //     }
    //     return result;
    // }

    private getFramePosX(frameIndex:number):number {
        return (frameIndex % this._sprTilesInX) * this._tileWidth;
    }

    private getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._sprTilesInX) * this._tileHeight;
    }

    
}
