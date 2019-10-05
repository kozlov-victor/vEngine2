import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/geometry/image";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Camera} from "@engine/renderer/camera";
import {Size} from "@engine/geometry/size";
import {IResource} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/texture";
import {ResourceLink} from "@engine/resources/resourceLink";


export class TileMap extends RenderableModel implements IResource<ITexture> {

    public readonly type:string = "TileMap";
    public data:number[][] = [];

    public readonly drawInfo = {
        numOfTilesInWidth: 0,
        numOfTilesInHeight: 0
    };
    public tileWidth:number = 32;
    public tileHeight:number = 32;


    private _tilesInScreenX:number;
    private _tilesInScreenY:number;

    private _sprTilesInX:number = 0;
    private _sprTilesInY:number = 0;

    private _cellImage:Image;

    // resource
    private _resourceLink:ResourceLink<ITexture>;

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

        this.game.getCurrScene().width = this._tilesInScreenX * this.tileWidth;
        this.game.getCurrScene().height = this._tilesInScreenY * this.tileHeight;

        const texSize:Size = this.getResourceLink().getTarget().size;
        this._sprTilesInX = ~~(texSize.width / this.tileWidth);
        this._sprTilesInY = ~~(texSize.height / this.tileHeight);

        this._cellImage = new Image(this.game);
        this._cellImage.setResourceLink(this.getResourceLink());
        this._cellImage.revalidate();
    }


    public update(): void {
        this.prepareDrawableInfo();
        super.update();
    }

    public draw(): boolean {

        const width:number = this.drawInfo.numOfTilesInWidth;
        const height:number = this.drawInfo.numOfTilesInHeight;
        for (let y:number=0;y<=height;y++) {
            for (let x:number=0;x<=width;x++) {
                const tileVal:number =this.data[y][x];
                this._cellImage.getSrcRect().setXY(this.getFramePosX(tileVal),this.getFramePosY(tileVal));
                this._cellImage.pos.setXY(
                    ~~(x * this.tileWidth  - this.pos.x),
                    ~~(y * this.tileHeight - this.pos.y)
                );
                this._cellImage.render();
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

    public getFramePosX(frameIndex:number):number {
        return (frameIndex % this._sprTilesInX) * this.tileWidth;
    }

    public getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._sprTilesInX) * this.tileHeight;
    }


    private prepareDrawableInfo(){
        const camera:Camera = this.game.camera;
        //const cameraRect:Rect = camera.getRectScaled(); // todo remove this method
        //let tilePosX:number = ~~((cameraRect.x) / this.numOfTilesInWidth);
        //let tilePosY:number = ~~((cameraRect.y) / this.numOfTilesInHeight);
        let tilePosX:number = ~~((camera.pos.x) / this.tileWidth);
        let tilePosY:number = ~~((camera.pos.y) / this.tileHeight);
        if (tilePosX<0) tilePosX = 0;
        if (tilePosY<0) tilePosY = 0;
        let w:number =  this._tilesInScreenX + 1;
        let h:number =  this._tilesInScreenY + 1;
        if (w>this._tilesInScreenX-1) w = this._tilesInScreenX-1;
        if (h>this._tilesInScreenY-1) h = this._tilesInScreenY-1;
        this.drawInfo.numOfTilesInWidth = w;
        this.drawInfo.numOfTilesInHeight = h;
        this.pos.setXY(tilePosX*this.tileWidth,tilePosY*this.tileHeight);
    }

    
}
