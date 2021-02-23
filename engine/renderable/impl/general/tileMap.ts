import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image";
import {DebugError} from "@engine/debug/debugError";
import {Camera} from "@engine/renderer/camera";
import {ISize, Size} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {RenderableModelWithTexture} from "@engine/renderable/abstract/renderableModelWithTexture";


export class TileMap extends RenderableModelWithTexture {

    public readonly type:string = "TileMap";

    private _data:number[][] = [];
    private _tileWidth:number;
    private _tileHeight:number;

    private readonly _drawInfo = {
        dirty:true,
        firstTileToDrawByX: NaN,
        firstTileToDrawByY: NaN,
    };


    private _numOfTilesInMapByX:number;
    private _numOfTilesInMapByY:number;

    private _numOfTilesInSpriteByX:number = 0;
    private _numOfTilesInSpriteByY:number = 0;

    private _numOfTilesInScreenByX:number = 0;
    private _numOfTilesInScreenByY:number = 0;

    private _cellImage:Image;
    private _drawingSurface:DrawingSurface;

    constructor(protected game:Game){
        super(game);
    }

    public fromTiledJSON(source:number[],mapWidth:number,mapHeight:Optional<number>,tileWidth:number,tileHeight:number): void{
        if (!mapHeight) mapHeight = source.length / mapWidth;
        this._data = new Array<number[]>(mapHeight);
        let cnt:number = 0;
        for (let j:number=0;j<mapHeight;j++){
            this._data[j] =  new Array<number>(mapWidth);
            for (let i:number=0;i<mapWidth;i++) {
                this._data[j][i] = source[cnt++];
            }
        }

        this._tileWidth = tileWidth;
        this._tileHeight = tileHeight;

        this._numOfTilesInMapByX = mapWidth;
        this._numOfTilesInMapByY = mapHeight;

        this._numOfTilesInScreenByX = ~~(this.game.size.width / this._tileWidth)+3;
        this._numOfTilesInScreenByY = ~~(this.game.size.height / this._tileHeight)+3;

        if (DEBUG) {
            const found:number = cnt;
            const expected:number = source.length;
            if (expected!==found) {
                throw new DebugError(`Incorrect mapWidth/mapHeight provided. Expected ${expected} tiles, but ${found} found (${mapWidth}*${mapHeight}=${mapWidth*mapHeight})`);
            }
        }
    }

    public revalidate(): void{

        this.game.getCurrScene().size.width = this._numOfTilesInMapByX * this._tileWidth;
        this.game.getCurrScene().size.height = this._numOfTilesInMapByY * this._tileHeight;

        const texSize:ISize = this.getTexture().size;
        this._numOfTilesInSpriteByX = ~~(texSize.width / this._tileWidth);
        this._numOfTilesInSpriteByY = ~~(texSize.height / this._tileHeight);

        this._cellImage = new Image(this.game,this.getTexture());
        this._cellImage.size.setWH(this._tileWidth,this._tileHeight);
        this._cellImage.getSrcRect().setWH(this._tileWidth,this._tileHeight);
        this._cellImage.revalidate();
        if (!this._drawingSurface) {
            const size:Size = new Size();
            size.set(this.game.size);
            size.addWH(this._tileWidth*2,this._tileHeight*2);
            this._drawingSurface = new DrawingSurface(this.game,size);
            this.appendChild(this._drawingSurface);
        }
    }


    public update(): void {
        this.prepareDrawableInfo();
        super.update();
    }

    public draw(): void {

        if (!this._drawInfo.dirty) {
            this.updateDrawingSurfacePos();
            return;
        }

        for (let y:number=0;y<this._numOfTilesInScreenByY;y++) {
            const currTileByY:number = this._drawInfo.firstTileToDrawByY + y;
            if (currTileByY<0) continue;
            if (currTileByY>this._numOfTilesInMapByY-1) continue;
            for (let x:number=0;x<this._numOfTilesInScreenByX;x++) {
                const currTileByX:number = this._drawInfo.firstTileToDrawByX + x;
                if (currTileByX<0) continue;
                if (currTileByX>this._numOfTilesInMapByX-1) continue;

                const tileVal:number =this._data[currTileByY][currTileByX];
                this._cellImage.getSrcRect().setXY(this.getFramePosX(tileVal),this.getFramePosY(tileVal));
                this._cellImage.pos.setXY(x * this._tileWidth, y * this._tileHeight);
                this._drawingSurface.drawModel(this._cellImage);
            }
        }
        this._drawInfo.dirty = false;
        this.updateDrawingSurfacePos();
    }

    //getTileAt(x:number,y:number):{tileIndex:number,tile:number}{
        // if (!this.spriteSheet) return;
        // let firstTileToDrawByX:Int = ~~(x / this.spriteSheet.getFrameWidth());
        // let firstTileToDrawByY:Int = ~~(y / this.spriteSheet.getFrameHeight());
        // if (!this.data[firstTileToDrawByY]) return;
        // let tile:number = this.data[firstTileToDrawByY][firstTileToDrawByX];
        // if (!tile) return;
        // return {
        //     tileIndex: this.spriteSheet.numOfFramesH * firstTileToDrawByY + firstTileToDrawByX + 1,
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
        return (frameIndex % this._numOfTilesInSpriteByX) * this._tileWidth;
    }

    private getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._numOfTilesInSpriteByX) * this._tileHeight;
    }


    private updateDrawingSurfacePos():void{
        this._drawingSurface.pos.setXY(
            this._drawInfo.firstTileToDrawByX * this._tileWidth,
            this._drawInfo.firstTileToDrawByY * this._tileHeight
        );
    }

    private prepareDrawableInfo():void{
        const camera:Camera = this.game.getCurrScene().camera;
        const firstTileToDrawByX:number = ~~((camera.pos.x) / this._tileWidth) - 1;
        const firstTileToDrawByY:number = ~~((camera.pos.y) / this._tileHeight) - 1;

        this._drawInfo.dirty =
            this._drawInfo.firstTileToDrawByX!==firstTileToDrawByX || this._drawInfo.firstTileToDrawByY!==firstTileToDrawByY;
        this._drawInfo.firstTileToDrawByX = firstTileToDrawByX;
        this._drawInfo.firstTileToDrawByY = firstTileToDrawByY;
    }


}
