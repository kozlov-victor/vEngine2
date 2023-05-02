import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image/image";
import {DebugError} from "@engine/debug/debugError";
import {Camera} from "@engine/renderer/camera/camera";
import {ISize, Size} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {RenderableModelWithTexture} from "@engine/renderable/abstract/renderableModelWithTexture";
import {ITexture} from "@engine/renderer/common/texture";
import {ArcadePhysicsSystem, SLOPE_TYPE} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ARCADE_RIGID_BODY_TYPE} from "@engine/physics/arcade/arcadeRigidBody";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {IRigidBody} from "@engine/physics/common/interfaces";
import {Point2d} from "@engine/geometry/point2d";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export interface ITileAnimationInfo {
    id: number;
    animation?: {
        duration: number;
        tileid: number;
    }[]
}

export interface ITileCollisionRect {
    id: number,
    objectgroup: {
        draworder: "index";
        id: number;
        name: string;
        objects:
            {
                class: string;
                height: number;
                id: number;
                name: string;
                rotation: number;
                visible: boolean;
                width: number;
                x: number;
                y: number;
            }[],
        opacity: number;
        type: "objectgroup";
        visible: boolean;
        x: number;
        y: number;
    }
}

export interface ITiledJSON {
    width: number,
    height: number,
    tilesets: {
        columns:number;
        firstgid:number;
        image:string;
        imageheight:number;
        imagewidth:number;
        margin:number;
        name:string;
        spacing:number;
        tilecount:number;
        tileheight:number;
        tilewidth:number;
        tiles?: (ITileAnimationInfo|ITileCollisionRect)[];
    }[],
    layers: {
        name: string;
        type: 'objectgroup'|'tilelayer';
        data?: number[];
        id:number;
        opacity:number;
        visible:boolean;
        width:number;
        height:number;
        x:number;
        y:number;
        objects:({
            gid:number;
            id:number;
            name:string;
            class: string;
            properties:({
                name:string;
                type:string;
                value:string;
            })[],
            rotation:number;
            type:number;
            visible:boolean;
            width:number;
            height:number;
            x:number;
            y:number;
        })[],
    }[]
}

export interface ICollisionInfo {
    useCollision:boolean;
    collideWithTiles:number[]|'all';
    slopes?: {
        floorUp?:number[],
        floorDown?:number[],
        ceilUp?:number[],
        ceilDown?:number[],
    },
    exceptCollisionTiles?:number[];
    groupNames?: string[];
    restitution?:number;
    ignoreCollisionsWithGroupNames?:string[];
    tileCollisionRects?:Record<number, IRectJSON>;
    debug?:boolean;
}

export interface ITileAnimation {
    tileId: number;
    frames:({duration:number,tileId:number})[];
}

interface ITileAtRectInfo {
    x:number;
    y:number;
    xTile:number;
    yTile:number;
    value?:number;
    width:number;
    height:number;
}

export class TileMap extends RenderableModelWithTexture {

    public override readonly type = "TileMap" as const;

    public override getRigidBody:never = undefined!;

    private _data:number[][] = [];
    private _tileWidth:number;
    private _tileHeight:number;
    private _dataOffsetIndex:number = 1; // to work properly with "firstgid" tiled property

    public static getCollisionRect(levelData:ITiledJSON,nameOfTilesetInEditor:string):Optional<IRectJSON> {
        const objGroup =
            levelData.tilesets.find(it=>it.name===nameOfTilesetInEditor)?.
            tiles?.find((it=>(it as ITileCollisionRect).objectgroup!==undefined));
        return (objGroup as ITileCollisionRect)?.objectgroup?.objects?.[0];
    }

    protected readonly _drawInfo = {
        firstTileToDrawByX: NaN,
        firstTileToDrawByY: NaN,
        dirty: false,
    };


    private _numOfTilesInMapByX:number;
    private _numOfTilesInMapByY:number;

    private _numOfTilesInSpriteByX:number = 0;
    private _numOfTilesInSpriteByY:number = 0;

    private _numOfTilesInScreenByX:number = 0;
    private _numOfTilesInScreenByY:number = 0;

    private _cellImage:Image;
    private _drawingSurface:DrawingSurface;

    private _collisionInfo:ICollisionInfo;
    private rigidBodies:IRigidBody[] = [];


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
                let val = source[cnt++];
                if (val!==0) val= val - this._dataOffsetIndex + 1;
                this._data[j][i] = val;
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

    protected findMainTileSetOfTiledJson(map:ITiledJSON, mainTileSetName:string):ITiledJSON['tilesets'][0] {
        const tileSet =
            map.tilesets.length===1?
                map.tilesets[0]:
                map.tilesets.find(it=>it.name===mainTileSetName)!;

        if (DEBUG && !tileSet) {
            throw new DebugError(`cannot find main tileset with name "${mainTileSetName}"`);
        }
        return tileSet;
    }

    public fromTiledJSON(map:ITiledJSON,collisionInfo?:ICollisionInfo,mainTileSetName:string = 'tiles'):void {

        if (DEBUG) {
            if (map===undefined) throw new DebugError(`map can be defined`);
            if (map.layers===undefined) throw new DebugError(`map does not contain layers`);
        }

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

        const tileSet = this.findMainTileSetOfTiledJson(map, mainTileSetName);

        const mapWidth = map.width;
        const mapHeight = map.height;
        const tileWidth = tileSet.tilewidth;
        const tileHeight = tileSet.tileheight;

        this._dataOffsetIndex = tileSet.firstgid;

        // find individual collision rects
        let tileCollisionRects:Record<number, IRectJSON>|undefined = undefined;
        tileSet.tiles?.forEach(t=>{
            const tile = t as ITileCollisionRect;
            if (tile.objectgroup===undefined) return;
            tile.objectgroup.objects.forEach(obj=>{
                if (obj.x!==undefined && obj.y!==undefined && obj.width!==undefined && obj.height!==undefined) {
                    if (tileCollisionRects===undefined) tileCollisionRects = {};
                    tileCollisionRects[tile.id] = {x:obj.x,y:obj.y,width:obj.width,height:obj.height};
                }
            })
        });
        if (collisionInfo) collisionInfo.tileCollisionRects = tileCollisionRects;

        this.fromData(source,mapWidth,mapHeight,tileWidth,tileHeight,collisionInfo);
    }

    private initCollisions(collisionInfo:ICollisionInfo):void {
        this._collisionInfo = collisionInfo;
        this.redefineRigidBodies();

    }

    // use after setValueAtCellXY if needed
    public redefineRigidBodies():void {
        if (!this._collisionInfo) return;
        const collisionInfo = this._collisionInfo;
        const rigidBodies:IRigidBody[] = [];
        for (let y:number=0;y<this._numOfTilesInMapByY;y++) {
            for (let x:number=0;x<this._numOfTilesInMapByX;x++) {
                const tileId = this.getDataValueAtCellXY(x,y);
                if (tileId===undefined) continue;

                let collisionRect:IRectJSON;
                if (collisionInfo?.tileCollisionRects?.[tileId]!==undefined) {
                    collisionRect = collisionInfo.tileCollisionRects[tileId];
                } else {
                    collisionRect = {x:0,y:0,width:this._tileWidth,height:this._tileHeight};
                }


                const rigidBody = this.game.getPhysicsSystem(ArcadePhysicsSystem).createRigidBody({
                    type: ARCADE_RIGID_BODY_TYPE.KINEMATIC,
                    groupNames: collisionInfo.groupNames,
                    ignoreCollisionWithGroupNames: collisionInfo.ignoreCollisionsWithGroupNames,
                    restitution: collisionInfo.restitution,
                    acceptCollisions: TileMap._isTileCollideable(tileId,collisionInfo),
                });
                rigidBody.addInfo = {tile:true,tileId,tileX:x,tileY:y};

                if (collisionInfo.slopes?.floorUp?.includes(tileId)) {
                    rigidBody.addInfo.slopeType = SLOPE_TYPE.FLOOR_UP;
                }
                else if (collisionInfo.slopes?.floorDown?.includes(tileId)) {
                    rigidBody.addInfo.slopeType = SLOPE_TYPE.FLOOR_DOWN;
                }
                else if (collisionInfo.slopes?.ceilUp?.includes(tileId)) {
                    rigidBody.addInfo.slopeType = SLOPE_TYPE.CEIL_UP;
                }
                else if (collisionInfo.slopes?.ceilDown?.includes(tileId)) {
                    rigidBody.addInfo.slopeType = SLOPE_TYPE.CEIL_DOWN;
                }

                rigidBody.setModel(this);
                rigidBody.setBounds(
                    new Point2d(x * this._tileWidth+collisionRect.x, y * this._tileHeight+collisionRect.y),
                    new Size(collisionRect.width,collisionRect.height)
                );

                rigidBodies.push(rigidBody);
                if (collisionInfo.debug) {
                    const debugRect = new Rectangle(this.game);
                    debugRect.lineWidth = 0;
                    debugRect.fillColor.setRGB(0,100,0);
                    debugRect.alpha = 0.4;
                    debugRect.pos.setFrom(rigidBody.pos);
                    debugRect.size.setWH(rigidBody._rect.width,rigidBody._rect.height);
                    this.appendChild(debugRect);
                }
            }
        }
        this.rigidBodies = rigidBodies;
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
        for (let i = 0; i < this.rigidBodies.length; i++) {
            const rigidBody = this.rigidBodies[i];
            rigidBody.nextTick();
        }
        super.update();
    }

    protected beforeDraw():void {
        this._drawingSurface.clear();
    }

    protected resolveTileId(tileId:number):number {
        return tileId;
    }

    public draw(): void {
        this.prepareDrawableInfo();
        if (this._drawInfo.dirty) {
            this._drawingSurface.drawBatch(this.drawBatch);
        }
        this.updateDrawingSurfacePos();
    }

    public drawForced(): void {
        this.prepareDrawableInfo();
        this._drawingSurface.drawBatch(this.drawBatch);
        this.updateDrawingSurfacePos();
    }

    private drawBatch = ()=>{
        this.beforeDraw();
        for (let y:number=0;y<this._numOfTilesInScreenByY;y++) {
            const currTileByY:number = this._drawInfo.firstTileToDrawByY + y;
            if (currTileByY<0) continue;
            if (currTileByY>this._numOfTilesInMapByY-1) continue;
            for (let x:number=0;x<this._numOfTilesInScreenByX;x++) {
                const currTileByX:number = this._drawInfo.firstTileToDrawByX + x;
                if (currTileByX<0) continue;
                if (currTileByX>this._numOfTilesInMapByX-1) continue;

                let tileId = this.getDataValueAtCellXY(currTileByX,currTileByY);
                if (tileId===undefined) continue;
                tileId = this.resolveTileId(tileId);
                this._cellImage.srcRect.setXY(this.getFramePosX(tileId),this.getFramePosY(tileId));
                this._cellImage.pos.setXY(x * this._tileWidth, y * this._tileHeight);
                this._drawingSurface.drawModel(this._cellImage);
            }
        }
    }

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

    // tile index of undefined if tile cell is empty
    protected getDataValueAtCellXY(x:number,y:number):number|undefined {
        const tileId = this._data[y][x];
        if (tileId===0) return undefined;
        return tileId - 1;
    }

    public getDataValueAtPointXY(x:number, y:number):number|undefined {
        x = ~~(x / this._tileWidth);
        y = ~~(y / this._tileHeight);
        return this.getDataValueAtCellXY(x,y);
    }

    public getTilesAtRect(rect:IRectJSON):ITileAtRectInfo[] {
        const result:ITileAtRectInfo[] = [];
        const alreadyCheckedTiles:{[key:string]:boolean} = {};

        let x:number = rect.x,y:number;
        const maxX:number = rect.x+rect.width,
            maxY:number = rect.y+rect.height;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            y = rect.y;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const value = this.getDataValueAtPointXY(x,y);
                const xTile = ~~(x / this._tileWidth);
                const yTile = ~~(y / this._tileHeight);
                const xPos = xTile*this._tileWidth;
                const yPos = yTile*this._tileHeight;
                const key = `${xTile}_${yTile}`;
                if (!alreadyCheckedTiles[key]) {
                    result.push(
                        {
                            xTile,
                            yTile,
                            x:xPos,
                            y:yPos,
                            width:this._tileWidth,
                            height:this._tileHeight,
                            value
                        }
                    );
                    alreadyCheckedTiles[key] = true;
                }
                if (y===maxY) break;
                y+=this._tileHeight;
                if (y>maxY) y = maxY;
            }
            if (x===maxX) break;
            x+=this._tileWidth;
            if (x>maxX) x = maxX;
        }
        return result;
    }

    public setValueAtCellXY(x:number,y:number,value:number|undefined):void {
        if (value===undefined) value = 0;
        this._data[y][x] = value;
    }

    protected prepareDrawableInfo():void{
        const camera:Camera = this.game.getCurrentScene().camera;
        const firstTileToDrawByX:number = ~~((camera.pos.x) / this._tileWidth) - 1;
        const firstTileToDrawByY:number = ~~((camera.pos.y) / this._tileHeight) - 1;

        this._drawInfo.dirty =
            this._drawInfo.firstTileToDrawByX !== firstTileToDrawByX ||
            this._drawInfo.firstTileToDrawByY !== firstTileToDrawByY;

        this._drawInfo.firstTileToDrawByX = firstTileToDrawByX;
        this._drawInfo.firstTileToDrawByY = firstTileToDrawByY;
    }

}
