import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image/image";
import {DebugError} from "@engine/debug/debugError";
import {Camera} from "@engine/renderer/camera";
import {ISize, Size} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {RenderableModelWithTexture} from "@engine/renderable/abstract/renderableModelWithTexture";
import {ITexture} from "@engine/renderer/common/texture";
import {TileMapRigidBodyDelegate} from "@engine/physics/arcade/tileMapRigidBodyDelegate";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {Point2d} from "@engine/geometry/point2d";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export interface ITiledJSON {
    width: number,
    height: number,
    tilesets: {
        "tileheight":number,
        "tilewidth":number,
    }[],
    layers: {
        name: string,
        type: 'objectgroup'|'tilelayer',
        data?: number[],
        id:number,
        opacity:number,
        visible:boolean,
        width:number,
        height:number,
        x:number,
        y:number,
        objects:({
            gid:number,
            id:number,
            name:string,
            properties:({
                name:string,
                type:string,
                value:string,
            })[],
            rotation:number,
            type:number,
            visible:boolean,
            width:number,
            height:number,
            x:number,
            y:number,
        })[],
    }[]
}

export interface ICollisionInfo {
    useCollision:boolean,
    collideWithTiles:number[]|'all',
    exceptCollisionTiles?:number[],
    groupNames?: string[],
    restitution?:number,
    ignoreCollisionsWithGroupNames?:string[],
    debug?:boolean,
}

export class TileMap extends RenderableModelWithTexture {

    public override readonly type:string = "TileMap";

    public override getRigidBody:never = undefined!;

    private _data:number[][] = [];
    private _tileWidth:number;
    private _tileHeight:number;

    private readonly _drawInfo = {
        firstTileToDrawByX: NaN,
        firstTileToDrawByY: NaN,
        changed: false,
    };


    private _numOfTilesInMapByX:number;
    private _numOfTilesInMapByY:number;

    private _numOfTilesInSpriteByX:number = 0;
    private _numOfTilesInSpriteByY:number = 0;

    private _numOfTilesInScreenByX:number = 0;
    private _numOfTilesInScreenByY:number = 0;

    private _cellImage:Image;
    private _drawingSurface:DrawingSurface;

    private _rigidBodyDelegate: TileMapRigidBodyDelegate;

    private static _isTileCollideable(tileId:number,collisionInfo:ICollisionInfo) {
        let result:boolean;
        if (collisionInfo.collideWithTiles ==='all') {
            result = true;
        } else {
            result = collisionInfo.collideWithTiles.indexOf(tileId)>-1;
        }
        if (collisionInfo.exceptCollisionTiles!==undefined) {
            if (result) {
                result = collisionInfo.exceptCollisionTiles.indexOf(tileId)===-1;
            }
        }
        return result;
    }

    constructor(game:Game,texture:ITexture){
        super(game);
        this.setTexture(texture);
    }

    public fromData(source:number[],mapWidth:number,mapHeight:Optional<number>,tileWidth:number,tileHeight:number,collisionInfo:ICollisionInfo = {useCollision:false,collideWithTiles:[]}): void{
        if (DEBUG) {
            if (!source?.length) {
                throw new DebugError(`can not create tileMap: wrong "source" parameter`);
            }
            if (!mapWidth) {
                throw new DebugError(`can not create tileMap: wrong "mapWidth" parameter: ${mapWidth}`);
            }
            if (!tileWidth) {
                throw new DebugError(`can not create tileMap: wrong "tileWidth" parameter: ${tileWidth}`);
            }
            if (!tileHeight) {
                throw new DebugError(`can not create tileMap: wrong "tileHeight" parameter: ${tileHeight}`);
            }
        }

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
        this.initCollisions(collisionInfo);
    }

    public fromTiledJSON(map:ITiledJSON,collisionInfo?:ICollisionInfo):void {
        const tileMapLayer = map.layers.find(it=>it.type==='tilelayer')!;

        if (DEBUG) {
            if (!tileMapLayer) {
                throw new DebugError('no layer with type "tilelayer"');
            }
            if (!map.tilesets.length) {
                throw new DebugError(`tileSet is not provided`);
            }
        }

        const source = tileMapLayer.data!;
        if (source===undefined) {
            if (DEBUG) throw new DebugError(`no data provided im tiled map`);
        }

        const mapWidth = map.width;
        const mapHeight = map.height;
        const tileWidth = map.tilesets[0].tilewidth;
        const tileHeight = map.tilesets[0].tileheight;

        this.fromData(source,mapWidth,mapHeight,tileWidth,tileHeight,collisionInfo);
    }

    private initCollisions(collisionInfo:ICollisionInfo):void {
        if (!collisionInfo.useCollision) return;
        const rigidBodies:IRigidBody[] = [];
        for (let y:number=0;y<this._numOfTilesInMapByY;y++) {
            for (let x:number=0;x<this._numOfTilesInMapByX;x++) {
                const tileId:number =this._data[y][x] - 1;
                if (tileId>-1 && TileMap._isTileCollideable(tileId,collisionInfo)) {
                    const rigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({
                        type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
                        rect: new Rect(0,0,this._tileWidth,this._tileHeight),
                        groupNames: collisionInfo.groupNames,
                        ignoreCollisionWithGroupNames: collisionInfo.ignoreCollisionsWithGroupNames,
                        restitution: collisionInfo.restitution,
                    });
                    rigidBody.addInfo = {tileId};
                    rigidBody.setModel(this);
                    rigidBody.setBounds(
                        new Point2d(x * this._tileWidth, y * this._tileHeight),
                        new Size(this._tileWidth,this._tileHeight)
                    );
                    rigidBodies.push(rigidBody);
                    if (collisionInfo.debug) {
                        const debugRect = new Rectangle(this.game);
                        debugRect.lineWidth = 0;
                        debugRect.fillColor.setRGB(0,100,0);
                        debugRect.alpha = 0.4;
                        debugRect.setPosAndSize(x * this._tileWidth, y * this._tileHeight,this._tileWidth,this._tileHeight);
                        this.appendChild(debugRect);
                    }
                }
            }
        }
        this._rigidBodyDelegate = new TileMapRigidBodyDelegate(rigidBodies);
    }


    public override revalidate(): void{
        const scene = this.game.getCurrentScene();
        scene.size.width = Math.max(scene.size.width,this._numOfTilesInMapByX * this._tileWidth);
        scene.size.height = Math.max(scene.size.height,this._numOfTilesInMapByY * this._tileHeight);

        const texSize:ISize = this.getTexture().size;
        this._numOfTilesInSpriteByX = ~~(texSize.width / this._tileWidth);
        this._numOfTilesInSpriteByY = ~~(texSize.height / this._tileHeight);

        this._cellImage = new Image(this.game,this.getTexture());
        this._cellImage.size.setWH(this._tileWidth,this._tileHeight);
        this._cellImage.srcRect.setWH(this._tileWidth,this._tileHeight);
        this._cellImage.revalidate();
        if (!this._drawingSurface) {
            const size:Size = new Size();
            size.setFrom(this.game.size);
            size.addWH(this._tileWidth*2,this._tileHeight*2);
            this._drawingSurface = new DrawingSurface(this.game,size);
            this.prependChild(this._drawingSurface);
        }
        scene.camera.worldTransformDirty = true;
    }


    public override update(): void {
        if (this._rigidBodyDelegate!==undefined) this._rigidBodyDelegate.nextTick();
        super.update();
    }

    public draw(): void {

        this.prepareDrawableInfo();
        if (!this._drawInfo.changed) {
            this.updateDrawingSurfacePos();
            return;
        }

        this._drawingSurface.clear();
        for (let y:number=0;y<this._numOfTilesInScreenByY;y++) {
            const currTileByY:number = this._drawInfo.firstTileToDrawByY + y;
            if (currTileByY<0) continue;
            if (currTileByY>this._numOfTilesInMapByY-1) continue;
            for (let x:number=0;x<this._numOfTilesInScreenByX;x++) {
                const currTileByX:number = this._drawInfo.firstTileToDrawByX + x;
                if (currTileByX<0) continue;
                if (currTileByX>this._numOfTilesInMapByX-1) continue;

                let tileVal:number =this._data[currTileByY][currTileByX];
                if (tileVal===0) continue;
                tileVal-=1;
                this._cellImage.srcRect.setXY(this.getFramePosX(tileVal),this.getFramePosY(tileVal));
                this._cellImage.pos.setXY(x * this._tileWidth, y * this._tileHeight);
                this._drawingSurface.drawModel(this._cellImage);
            }
        }

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
        const camera:Camera = this.game.getCurrentScene().camera;
        const firstTileToDrawByX:number = ~~((camera.pos.x) / this._tileWidth) - 1;
        const firstTileToDrawByY:number = ~~((camera.pos.y) / this._tileHeight) - 1;

        this._drawInfo.changed =
            this._drawInfo.firstTileToDrawByX !== firstTileToDrawByX ||
            this._drawInfo.firstTileToDrawByY !== firstTileToDrawByY;

        this._drawInfo.firstTileToDrawByX = firstTileToDrawByX;
        this._drawInfo.firstTileToDrawByY = firstTileToDrawByY;
    }


}
