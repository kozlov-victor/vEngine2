import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Camera} from "@engine/renderer/camera";
import {Size} from "@engine/geometry/size";
import {IResource, Optional} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";


export class TileMap extends RenderableModel implements IResource<ITexture> {

    public readonly type:string = "TileMap";

    private data:number[][] = [];
    private tileWidth:number;
    private tileHeight:number;

    private readonly drawInfo = {
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

    // resource
    private _resourceLink:ResourceLink<ITexture>;

    constructor(protected game:Game){
        super(game);
    }

    public fromTiledJSON(source:number[],mapWidth:number,mapHeight:Optional<number>,tileWidth:number,tileHeight:number){
        if (!mapHeight) mapHeight = source.length / mapWidth;
        this.data = new Array<number[]>(mapHeight);
        let cnt:number = 0;
        for (let j:number=0;j<mapHeight;j++){
            this.data[j] =  new Array<number>(mapWidth);
            for (let i:number=0;i<mapWidth;i++) {
                this.data[j][i] = source[cnt++];
            }
        }

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this._numOfTilesInMapByX = mapWidth;
        this._numOfTilesInMapByY = mapHeight;

        this._numOfTilesInScreenByX = ~~(this.game.size.width / this.tileWidth)+3;
        this._numOfTilesInScreenByY = ~~(this.game.size.height / this.tileHeight)+3;

        if (DEBUG) {
            const found:number = cnt;
            const expected:number = source.length;
            if (expected!==found) {
                throw new DebugError(`Incorrect mapWidth/mapHeight provided. Expected ${expected} tiles, but ${found} found (${mapWidth}*${mapHeight}=${mapWidth*mapHeight})`);
            }
        }
    }

    public setResourceLink(link:ResourceLink<ITexture>):void{
        if (DEBUG && !link) {
            throw new DebugError(`can not set resource link: link is not passed`);
        }
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

    public revalidate(){

        this.game.getCurrScene().size.width = this._numOfTilesInMapByX * this.tileWidth;
        this.game.getCurrScene().size.height = this._numOfTilesInMapByY * this.tileHeight;

        const texSize:Size = this.getResourceLink().getTarget().size;
        this._numOfTilesInSpriteByX = ~~(texSize.width / this.tileWidth);
        this._numOfTilesInSpriteByY = ~~(texSize.height / this.tileHeight);

        this._cellImage = new Image(this.game);
        this._cellImage.setResourceLink(this.getResourceLink());
        this._cellImage.size.setWH(this.tileWidth,this.tileHeight);
        this._cellImage.getSrcRect().setWH(this.tileHeight,this.tileHeight);
        this._cellImage.revalidate();
        if (!this._drawingSurface) {
            const size:Size = new Size();
            size.set(this.game.size);
            size.addWH(this.tileWidth*2,this.tileHeight*2);
            this._drawingSurface = new DrawingSurface(this.game,size);
            this.appendChild(this._drawingSurface);
        }
    }


    public update(): void {
        this.prepareDrawableInfo();
        super.update();
    }

    public draw(): void {

        if (!this.drawInfo.dirty) {
            this.updateDrawingSurfacePos();
            //return;
        }

        this._drawingSurface.pos.setXY(0,0);

        for (let y:number=0;y<this._numOfTilesInScreenByY;y++) {
            const currTileByY:number = this.drawInfo.firstTileToDrawByY + y;
            if (currTileByY<0) continue;
            if (currTileByY>this._numOfTilesInMapByY-1) continue;
            for (let x:number=0;x<this._numOfTilesInScreenByX;x++) {
                const currTileByX:number = this.drawInfo.firstTileToDrawByX + x;
                if (currTileByX<0) continue;
                if (currTileByX>this._numOfTilesInMapByX-1) continue;

                const tileVal:number =this.data[currTileByY][currTileByX];
                this._cellImage.getSrcRect().setXY(this.getFramePosX(tileVal),this.getFramePosY(tileVal));
                this._cellImage.pos.setXY(
                     (x * this.tileWidth),
                     (y * this.tileHeight)
                );
                this._drawingSurface.drawModel(this._cellImage,false);
            }
        }
        this.drawInfo.dirty = false;
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
        return (frameIndex % this._numOfTilesInSpriteByX) * this.tileWidth;
    }

    private getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._numOfTilesInSpriteByX) * this.tileHeight;
    }


    private updateDrawingSurfacePos(){
        this._drawingSurface.pos.setXY(
            this.drawInfo.firstTileToDrawByX * this.tileWidth,
            this.drawInfo.firstTileToDrawByY * this.tileHeight
        );
    }

    private prepareDrawableInfo(){
        const camera:Camera = this.game.camera;
        const firstTileToDrawByX:number = ~~((camera.pos.x) / this.tileWidth) - 1;
        const firstTileToDrawByY:number = ~~((camera.pos.y) / this.tileHeight) - 1;

        this.drawInfo.dirty = this.drawInfo.firstTileToDrawByX!==firstTileToDrawByX || this.drawInfo.firstTileToDrawByY!==firstTileToDrawByY;
        this.drawInfo.firstTileToDrawByX = firstTileToDrawByX;
        this.drawInfo.firstTileToDrawByY = firstTileToDrawByY;
    }

    
}
