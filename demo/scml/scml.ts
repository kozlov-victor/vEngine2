import {MathEx} from "@engine/misc/mathEx";
import {IReleasealable, ObjectPool} from "@engine/misc/objectPool";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ResourceLink} from "@engine/resources/resourceLink";
import {IURLRequest} from "@engine/resources/urlLoader";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";
import {Optional} from "@engine/core/declarations";
import {EasingQuart} from "@engine/misc/easing/functions/quart";
import {EasingQuint} from "@engine/misc/easing/functions/quint";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";

const POOL_SIZE:number = 128;

export interface IScon {
    entity: ISconEntity[];
    folder: ISconFolder[];
    generator: string;
    generator_version: string;
    scon_version: "1.0";
}

interface ISconEntity {
    animation:ISconAnimation[];
    id: number;
    name: string;
    character_map: [];
    obj_info: {
        h: number,
        name: string,
        type: "bone",
        w: number,
    }[];
}


interface ISconAnimationTimeline {
    id:number;
    name:string;
    obj?: number;
    object_type?: string; //  type="sprite" in xml
    key:ISconTimelineKey[];
}

interface ISconAnimation {
    id: number;
    interval: number;
    length: number;
    name:string;
    looping?:string;
    mainline: {
        key:ISconMainlineKey[]
    };
    timeline:ISconAnimationTimeline[];
}

interface ISconBoneRef {
    id: number;
    key: number;
    parent?:number;
    timeline: number;
}

interface ISconObjectRef {
    id: number;
    key: number;
    parent?: number;
    timeline: string;
    z_index: string;
}

interface ISconMainlineKey {
    id:number;
    time?:number;
    bone_ref?:ISconBoneRef[];
    object_ref?:ISconObjectRef[];
}

interface ISconSpriteTimeLineKey {
    angle?: number;
    file: number;
    folder: number;
    x?: number;
    y?: number;
    scale_x?:number;
    scale_y?:number;
    pivot_x?:number;
    pivot_y?:number;
    a?:number;
    curve_type?:number;
}

interface ISconBoneTimelineKey {
    angle?: number;
    x?: number;
    y?: number;
    scale_x?:number;
    scale_y?:number;
    a?:number;
}

interface ISconTimelineKey {
    id: number;
    object?: ISconSpriteTimeLineKey;
    bone?: ISconBoneTimelineKey;
    time?:number;
    spin?: number;
    curve_type?:string;
    c1?:number;
    c2?:number;
    c3?:number;
    c4?:number;
}

interface ISconFolder {
    name?:string;
    file: ISconFile[];
    id:number;
}

interface ISconFile {
    height: number;
    id: number;
    name: string;
    pivot_x: number;
    pivot_y: number;
    width: number;
}


interface  ISconCharacterMap {
    name:string;
    maps:[];
}

class PoolHolder {
    public spatialInfoPool:ObjectPool<SpatialInfo> = new ObjectPool(SpatialInfo,POOL_SIZE);
    public boneTimeLineObjectPool:ObjectPool<BoneTimelineKey> = new ObjectPool(BoneTimelineKey,POOL_SIZE);
    public spriteTimeLineObjectPool:ObjectPool<SpriteTimelineKey> = new ObjectPool(SpriteTimelineKey,POOL_SIZE);
}

export class ScmlObject {

    public static fromDescription(desc:IScon):ScmlObject{
        const obj = new ScmlObject();
        obj.folders = [];
        for (const folderDesc of desc.folder) {
            obj.folders.push(Folder.fromDescription(folderDesc));
        }
        obj.entities = [];
        for (const entityDesc of desc.entity) {
            obj.entities.push(Entity.fromDescription(obj,entityDesc));
        }
        obj.activeCharacterMap = obj.folders; // only default character map is supported
        return obj;
    }

    public poolHolder:PoolHolder = new PoolHolder();

    public root:SpriterObject;


    public folders:Folder[]; // <folder> tags
    public entities:Entity[]; // <entity> tags
    public activeCharacterMap:Folder[];

    public currentEntity:number;
    public currentAnimation:number;

    private startTime:number;

    // public characterInfo:SpatialInfo = new SpatialInfo();

    public constructor() {}

    public characherInfo():SpatialInfo{
        const identity:SpatialInfo = SpatialInfo.objectPool.getFreeObject()!;
        identity.x = 0;
        identity.y = 0;
        identity.a = 1;
        identity.spin = 1;
        identity.scaleX = 1;
        identity.scaleY = 1;
        identity.angle = 0;
        return identity;
    }

    public applyCharacterMap(charMap:CharacterMap, reset:boolean):void {
        if(reset) {
            this.activeCharacterMap=this.folders;
        }
        for(const m of charMap.maps) {
            const currentMap:MapInstruction=m;
            if(currentMap.tarFolder>-1&&currentMap.tarFile>-1) {
                const targetFolder:Folder=this.activeCharacterMap[currentMap.tarFolder];
                const targetFile:File=targetFolder.files[currentMap.tarFile];
                this.activeCharacterMap[m.folder].files[m.file]=targetFile;
            }
        }
    }

    public update(){
        if (this.currentEntity===undefined) return;
        if (this.currentAnimation===undefined) return;
        const entity:Entity = this.entities[this.currentEntity];
        const animation:Animation = entity.animations[this.currentAnimation];
        const time:number = new Date().getTime();
        if (!this.startTime) this.startTime = time;
        animation.setCurrentTime(time - this.startTime);

        SpatialInfo.objectPool.releaseAll();
        SpriteTimelineKey.objectPool.releaseAll();
        BoneTimelineKey.objectPool.releaseAll();


    }

    public nextAnimation(){
        this.startTime = 0;
        this.currentAnimation++;
        if (this.currentAnimation>this.entities[this.currentEntity].animations.length-1) {
            this.currentAnimation = 0;
        }
    }

}

class Folder {

    public static fromDescription(folderDesc:ISconFolder):Folder{
        const folder:Folder = new Folder();
        if (folderDesc.name!==undefined) folder.name = folderDesc.name;
        folder.files = [];
        for (const fileDesc of folderDesc.file) {
            const file:File = File.fromDescription(fileDesc);
            folder.files.push(file);
        }
        return folder;
    }


    public name:string = '';
    public files:File[]; // <file> tags

    private constructor() {}

}

class File {

    public static fromDescription(fileDesc:ISconFile):File{
        const file:File = new File();
        file.name = fileDesc.name;
        if (fileDesc.pivot_x!==undefined) file.pivotX = fileDesc.pivot_x;
        if (fileDesc.pivot_y) file.pivotY = fileDesc.pivot_y;
        file.width = fileDesc.width;
        file.height = fileDesc.height;
        return file;
    }


    public name:string;
    public pivotX:number=0;
    public pivotY:number=1;
    public width:number;
    public height:number;

    private constructor() {}

}

class Entity {

    public static fromDescription(scmlObject:ScmlObject,entityDesc:ISconEntity):Entity {
        const entity = new Entity();
        entity.name = entityDesc.name;
        entity.characterMaps = [];
        for (const charMapDesc of entityDesc.character_map) { // not implemented
            entity.characterMaps.push(CharacterMap.fromDescription(charMapDesc));
        }
        entity.animations = [];
        for (const animDesc of entityDesc.animation) {
            entity.animations.push(Animation.fromDescription(scmlObject,animDesc));
        }
        return entity;
    }

    public name:string;
    public characterMaps:CharacterMap[]; // <character_map> tags
    public animations:Animation[]; // <animation> tags

    private constructor() {}

}

// not implemented
class CharacterMap {

    public static fromDescription(charMapDesc:{name:string,maps?:[]}):CharacterMap{
        const c:CharacterMap = new CharacterMap();
        c.name = charMapDesc.name;
        c.maps = [];
        if (charMapDesc.maps) {
            for (const mapDesc of charMapDesc.maps) {
                //c.maps.push(MapInstruction.fromDescription(mapDesc));
            }
        }
        return c;
    }

    public name:string;
    public maps:MapInstruction[]; // <map> tags

    private constructor() {}
}

// not implemented
class MapInstruction {

    // public static fromDescription(mapDesc:{}):MapInstruction{
    //     const m:MapInstruction = new MapInstruction();
    //     m.folder = mapDesc.folder;
    //     m.file = mapDesc.file;
    //     if (mapDesc.tarFolder!==undefined) m.tarFolder = mapDesc.tarFolder;
    //     if (mapDesc.tarFile) m.tarFile = mapDesc.tarFile;
    //     return m;
    // }

    public folder:number;
    public file:number;
    public tarFolder:number=-1;
    public tarFile:number=-1;

    private constructor() {}

}

class Animation {

    public static fromDescription(scmlObject:ScmlObject,animationDesc:ISconAnimation):Animation{
        const a:Animation = new Animation(scmlObject);
        a.name = animationDesc.name;
        a.length = animationDesc.length;
        if (animationDesc.looping!==undefined) a.loopType = animationDesc.looping==='true'?'LOOPING':'NO_LOOPING';
        a.mainlineKeys = [];
        for (const mainLineKeyDesc of animationDesc.mainline.key) {
            a.mainlineKeys.push(MainlineKey.fromDescription(mainLineKeyDesc));
        }
        a.timelines = [];
        for (const timeLineDesc of animationDesc.timeline) {
            a.timelines.push(Timeline.fromDescription(scmlObject,timeLineDesc));
        }
        return a;
    }

    public name:string;
    public length:number;
    public loopType:'NO_LOOPING'|'LOOPING'='LOOPING'; // enum : NO_LOOPING,LOOPING
    public mainlineKeys:MainlineKey[]; // <key> tags within a single <mainline> tag
    public timelines:Timeline[]; // <timeline> tags


    private transformBoneKeys:BoneTimelineKey[] = [];
    private objectKeys:SpriteTimelineKey[] = [];


    constructor(private scmlObject: ScmlObject) {
        this.scmlObject = scmlObject;
    }

    public setCurrentTime(newTime:number):void {
        if(this.loopType==='NO_LOOPING') {
            newTime=Math.min(newTime,this.length);
        }
        else if (this.loopType==='LOOPING') {
            newTime=newTime%this.length;
        }
        this.updateCharacter(this.mainlineKeyFromTime(newTime),newTime);
    }

    public keyFromRef(ref:Ref,newTime:number):TimelineKey {
        const timeline:Timeline=this.timelines[ref.timeline];
        const keyA:TimelineKey=timeline.keys[ref.key];

        if(timeline.keys.length===1) {
            return keyA;
        }

        let nextKeyIndex:number=ref.key+1;

        if(nextKeyIndex>=timeline.keys.length) {
            if(this.loopType==='LOOPING') {
                nextKeyIndex=0;
            }
            else {
                return keyA;
            }
        }

        const keyB:TimelineKey=timeline.keys[nextKeyIndex];
        let keyBTime:number=keyB.time;

        if(keyBTime<keyA.time) {
            keyBTime=keyBTime+this.length;
        }

        return keyA.interpolate(keyB,keyBTime,newTime);
    }

    private updateCharacter(mainKey:MainlineKey,newTime:number) {
        const transformBoneKeys = this.transformBoneKeys;
        transformBoneKeys.length = 0;
        for(const b of mainKey.boneRefs) {
            let parentInfo:SpatialInfo;
            const currentRef:Ref=b;
            if(currentRef.parent>=0) {
                parentInfo=transformBoneKeys[currentRef.parent].info;
            }
            else {
                parentInfo=this.scmlObject.characherInfo();
            }

            const currentKey:BoneTimelineKey=(this.keyFromRef(currentRef,newTime) as BoneTimelineKey).clone();
            currentKey.info=currentKey.info.unmapFromParent(parentInfo);
            transformBoneKeys.push(currentKey);
        }

        const objectKeys = this.objectKeys;
        objectKeys.length = 0;
        for(const o of mainKey.objectRefs) {
            const timeLine:Timeline = this.timelines[o.timeline];
            if (timeLine.objectType!=="SPRITE") continue; // only sprite object are supported
            let parentInfo:SpatialInfo;
            const currentRef:Ref=o;

            if(currentRef.parent>=0) {
                parentInfo=transformBoneKeys[currentRef.parent].info;
            }
            else {
                parentInfo=this.scmlObject.characherInfo();
            }

            const currentKey:SpriteTimelineKey=(this.keyFromRef(currentRef,newTime) as SpriteTimelineKey).clone();
            currentKey.info=currentKey.info.unmapFromParent(parentInfo);
            objectKeys.push(currentKey);
        }

        this.scmlObject.root.clear();

        for(const k of objectKeys) {
            k.paint();
        }

        for(const k of transformBoneKeys) {
            k.paint();
        }


    }

    private mainlineKeyFromTime(time:number):MainlineKey {
        let currentMainKey:MainlineKey;
        for(const m of this.mainlineKeys) {
            if(m.time<=time) {
                currentMainKey=m;
            }
            if(m.time>=time) {
                break;
            }
        }
        return currentMainKey!;
    }

}

class Ref {

    public static fromDescription(refDesc:ISconBoneRef|ISconObjectRef):Ref {
        const ref:Ref = new Ref();
        if (refDesc.parent!==undefined) ref.parent = refDesc.parent;
        ref.timeline = +refDesc.timeline; // todo check for NaN
        ref.key = refDesc.key;
        return ref;
    }

    public parent:number=-1; // -1==no parent - uses ScmlObject spatialInfo as parentInfo
    public timeline:number;
    public key:number;

    private constructor() {}
}

class MainlineKey {

    public static fromDescription(desc:ISconMainlineKey):MainlineKey{
        const m:MainlineKey = new MainlineKey();
        m.boneRefs = [];
        if (desc.time!==undefined) m.time = desc.time;
        if (desc.bone_ref!==undefined) {
            for (const boneRefDesc of desc.bone_ref) {
                m.boneRefs.push(Ref.fromDescription(boneRefDesc));
            }
        }
        m.objectRefs = [];
        if (desc.object_ref!==undefined) {
            for (const objRefDesc of desc.object_ref) {
                m.objectRefs.push(Ref.fromDescription(objRefDesc));
            }
        }
        return m;
    }

    public time: number = 0;
    public boneRefs: Ref[]; // <bone_ref> tags
    public objectRefs: Ref[]; // <object_ref> tags

    private constructor() {}

}

// edittime features
class Timeline {

    public static fromDescription(scmlObject:ScmlObject,timeLineDesc:ISconAnimationTimeline):Timeline{
        const t:Timeline = new Timeline();
        t.name = timeLineDesc.name;
        t.id = timeLineDesc.id;
        if (timeLineDesc.object_type!==undefined) {
           t.objectType = timeLineDesc.object_type.toUpperCase() as OBJECT_TYPE;
        }
        t.keys = [];
        for (const keyDesc of timeLineDesc.key) {
            const timeLineKey:Optional<TimelineKey> = TimelineKey.fromDescription(scmlObject,keyDesc);
            if (timeLineKey!==undefined) {
                t.keys.push(timeLineKey);
                timeLineKey.timeLine = t;
            }
        }
        return t;
    }

    public name:string;
    public id:number;
    public objectType:OBJECT_TYPE = 'SPRITE'; // enum : SPRITE,BONE,BOX,POINT,SOUND,ENTITY,VARIABLE
    public keys:TimelineKey[]; // <key> tags within <timeline> tags

    private constructor() {}
}

type OBJECT_TYPE = 'SPRITE'|'BONE'|'BOX'|'POINT'|'SOUND'|'ENTITY'|'VARIABLE';
type CURVE_TYPE = 'INSTANT' | 'LINEAR' | 'QUADRATIC' | 'CUBIC'|'QUARTIC'|'QUINTIC'|'BEZIER';

abstract class TimelineKey {

    public static fromDescription(scmlObject:ScmlObject,timeLineKeyDesc:ISconTimelineKey):Optional<TimelineKey>{
        const objectTimeLineKeyDesc:Optional<ISconSpriteTimeLineKey> = timeLineKeyDesc.object;
        const boneTimeLineKeyDesc:Optional<ISconBoneTimelineKey> = timeLineKeyDesc.bone;
        if (objectTimeLineKeyDesc!==undefined) return SpriteTimelineKey.fromDescriptionSub(scmlObject,timeLineKeyDesc,objectTimeLineKeyDesc);
        else if (boneTimeLineKeyDesc!==undefined) return BoneTimelineKey.fromDescriptionSub(scmlObject,timeLineKeyDesc,boneTimeLineKeyDesc);
        else return undefined;
    }



    public id:number;
    public time: number = 0;
    public curveType: CURVE_TYPE = 'LINEAR'; // enum : INSTANT,LINEAR,QUADRATIC,CUBIC
    public c1: number;
    public c2: number;
    public c3: number;
    public c4: number;

    public timeLine:Timeline;

    public interpolate(nextKey: TimelineKey, nextKeyTime: number, currentTime: number): TimelineKey {
        return this.linear(nextKey, this.getTWithNextKey(nextKey, nextKeyTime, currentTime));
    }

    public getTWithNextKey(nextKey: TimelineKey, nextKeyTime: number, currentTime: number): number {
        if (this.curveType === 'INSTANT' || this.time === nextKey.time) {
            return 0;
        }

        const t: number = (currentTime - this.time) / (nextKeyTime - this.time);

        if (this.curveType === 'LINEAR') {
            return t;
        } else if (this.curveType === 'QUADRATIC') {
            return (quadratic(0.0, this.c1, 1.0, t));
        } else if (this.curveType === 'CUBIC') {
            return (cubic(0.0, this.c1, this.c2, 1.0, t));
        } else if (this.curveType === 'QUARTIC') {
            return (EasingQuart.InOut(t, this.c1, this.c2, 1.0));
        } else if (this.curveType === 'QUINTIC') {
            return (EasingQuint.InOut(t, this.c1, this.c2, this.c3));
        } else if (this.curveType === 'BEZIER') { // todo
            return (cubic(0.0, this.c1, this.c2, 1.0, t));
        } else throw new DebugError(`unsupported curve type: ${this.curveType}`);

    }

    public abstract clone():TimelineKey;
    public abstract paint():void;
    public abstract linear(keyB:TimelineKey,t:number):TimelineKey;

}

abstract class SpatialTimelineKey extends TimelineKey implements IReleasealable{

    public info:SpatialInfo;

    private _captured:boolean = false;

    public capture(): this {
        this._captured = true;
        return this;
    }

    public isCaptured(): boolean {
        return this._captured;
    }

    public release(): this {
        this._captured = false;
        return this;
    }
}

class SpatialInfo implements IReleasealable {

    public static objectPool:ObjectPool<SpatialInfo> = new ObjectPool(SpatialInfo,POOL_SIZE);

    public static fromDescription(commonKeyDesc:ISconTimelineKey,desc:ISconSpriteTimeLineKey|ISconBoneTimelineKey):SpatialInfo{
        const s:SpatialInfo = new SpatialInfo();
        if (desc.x!==undefined) s.x = desc.x;
        if (desc.y!==undefined) s.y = desc.y;
        if (desc.angle!==undefined) s.angle = desc.angle;
        if (desc.scale_x!==undefined) s.scaleX = desc.scale_x;
        if (desc.scale_y!==undefined) s.scaleY = desc.scale_y;
        if (desc.a!==undefined) s.a = desc.a;
        if (commonKeyDesc.spin!==undefined) s.spin = commonKeyDesc.spin;
        return s;
    }


    public x:number=0;
    public y:number=0;
    public angle:number=0;
    public scaleX:number=1;
    public scaleY:number=1;
    public a:number=1;
    public spin:number=1;

    private _captured:boolean = false;

    public constructor() {}

    public capture(): this {
        this._captured = true;
        return this;
    }

    public isCaptured(): boolean {
        return this._captured;
    }

    public release(): this {
        this._captured = false;
        return this;
    }

    public clone():SpatialInfo{
        const s:SpatialInfo = SpatialInfo.objectPool.getFreeObject()!;
        s.x = this.x;
        s.y = this.y;
        s.angle = this.angle;
        s.scaleX = this.scaleX;
        s.scaleY = this.scaleY;
        s.a = this.a;
        s.spin = this.spin;
        return s;
    }

    public unmapFromParent(parentInfo:SpatialInfo):SpatialInfo {
        const unmappedObj:SpatialInfo=this.clone();
        unmappedObj.angle+=parentInfo.angle;
        unmappedObj.scaleX*=parentInfo.scaleX;
        unmappedObj.scaleY*=parentInfo.scaleY;
        unmappedObj.a*=parentInfo.a;
        if(this.x!==0||this.y!==0) {
            const preMultX:number=this.x*parentInfo.scaleX;
            const preMultY:number=this.y*parentInfo.scaleY;
            const s:number = Math.sin(MathEx.degToRad(parentInfo.angle));
            const c:number = Math.cos(MathEx.degToRad(parentInfo.angle));
            unmappedObj.x = (preMultX * c) - (preMultY * s);
            unmappedObj.y = (preMultX * s) + (preMultY * c);
            unmappedObj.x+=parentInfo.x;
            unmappedObj.y+=parentInfo.y;
        }
        else {
            // Mandatory optimization for future features
            unmappedObj.x=parentInfo.x;
            unmappedObj.y=parentInfo.y;
        }
        return unmappedObj;
    }

}

class BoneTimelineKey extends SpatialTimelineKey {

    public static objectPool:ObjectPool<BoneTimelineKey> = new ObjectPool(BoneTimelineKey,POOL_SIZE);


    public static fromDescriptionSub(scmlObject:ScmlObject,commonKeyDesc:ISconTimelineKey,boneKeyDesc:ISconBoneTimelineKey):BoneTimelineKey{
        const b:BoneTimelineKey = new BoneTimelineKey();
        b.scmlObject = scmlObject;
        b.id = commonKeyDesc.id;
        if (commonKeyDesc.time!==undefined) b.time = commonKeyDesc.time;
        if (commonKeyDesc.curve_type!==undefined) b.curveType = commonKeyDesc.curve_type.toUpperCase() as CURVE_TYPE;
        if (commonKeyDesc.c1!==undefined) b.c1 = commonKeyDesc.c1;
        if (commonKeyDesc.c2!==undefined) b.c2 = commonKeyDesc.c2;
        if (commonKeyDesc.c3!==undefined) b.c3 = commonKeyDesc.c3;
        if (commonKeyDesc.c4!==undefined) b.c4 = commonKeyDesc.c4;

        b.info = SpatialInfo.fromDescription(commonKeyDesc,boneKeyDesc);
        return b;
    }

    // unimplemented in Spriter
    public length:number=200;
    public height:number=10;
    public paintDebugBones:boolean = false;

    public scmlObject:ScmlObject;


    public constructor() {
        super();
    }


    public clone():BoneTimelineKey{
        const b:BoneTimelineKey = BoneTimelineKey.objectPool.getFreeObject()!;
        b.scmlObject = this.scmlObject;
        b.timeLine = this.timeLine;
        b.time = this.time;
        b.curveType = this.curveType;
        b.c1 = this.c1;
        b.c2 = this.c2;
        b.info = this.info.clone();
        b.id = this.id;
        return b;
    }

    // override paintSprite if you want debug visuals for bones
    public paint():void {
        if(this.paintDebugBones) {
            const drawLength:number=this.length*this.info.scaleX;
            const drawHeight:number =this.height*this.info.scaleY;
            const paintId:string = this.timeLine.id + '_' + this.id;
            this.scmlObject.root.paintBone(this.info,drawLength,drawHeight,paintId);
        }
    }

    public linear(keyB:BoneTimelineKey,t:number):TimelineKey {
        // keyB must be BoneTimelineKeys{
        const returnKey:BoneTimelineKey=this.clone();
        returnKey.info=linearSpatial(this.info,keyB.info,this.info.spin,t);

        if(this.paintDebugBones) {
            returnKey.length=linear(this.length,keyB.length,t);
            returnKey.height=linear(this.height,keyB.height,t);
        }

        return returnKey;
    }

}

class SpriteTimelineKey extends SpatialTimelineKey {

    public static objectPool:ObjectPool<SpriteTimelineKey> = new ObjectPool(SpriteTimelineKey,POOL_SIZE);

    public static fromDescriptionSub(scmlObject:ScmlObject,commonKeyDesc:ISconTimelineKey,spriteKeyDesc:ISconSpriteTimeLineKey):SpriteTimelineKey {
        const s:SpriteTimelineKey = new SpriteTimelineKey();
        s.scmlObject = scmlObject;
        s.id = commonKeyDesc.id;
        s.info = SpatialInfo.fromDescription(commonKeyDesc,spriteKeyDesc);
        s.folder = spriteKeyDesc.folder;
        s.file = spriteKeyDesc.file;
        if (commonKeyDesc.time!==undefined) s.time = commonKeyDesc.time;
        if (commonKeyDesc.curve_type!==undefined) s.curveType = commonKeyDesc.curve_type.toUpperCase() as CURVE_TYPE;
        if (commonKeyDesc.c1!==undefined) s.c1 = +commonKeyDesc.c1;
        if (commonKeyDesc.c2!==undefined) s.c2 = +commonKeyDesc.c2;
        if (commonKeyDesc.c3!==undefined) s.c3 = commonKeyDesc.c3;
        if (commonKeyDesc.c4!==undefined) s.c4 = commonKeyDesc.c4;

        if (spriteKeyDesc.pivot_x!==undefined) {
            s.pivot_x = spriteKeyDesc.pivot_x;
            s.useDefaultPivot = false;
        }
        if (spriteKeyDesc.pivot_y!==undefined) {
            s.pivot_y = spriteKeyDesc.pivot_y;
            s.useDefaultPivot = false;
        }
        return s;
    }


    public folder:number = 0; // index of the folder within the ScmlObject
    public file:number = 0;
    public pivot_x:number=0;
    public pivot_y:number=1;


    public scmlObject:ScmlObject;

    private useDefaultPivot:boolean = true; // true if missing pivot_x and pivot_y in object tag


    public constructor(){
        super();
    }


    public clone():SpriteTimelineKey{
        const s:SpriteTimelineKey = SpriteTimelineKey.objectPool.getFreeObject()!;
        s.time = this.time;
        s.curveType = this.curveType;
        s.c1 = this.c1;
        s.c2 = this.c2;
        s.info = this.info.clone();
        s.folder = this.folder;
        s.file = this.file;
        s.pivot_x = this.pivot_x;
        s.pivot_y = this.pivot_y;
        s.scmlObject = this.scmlObject;
        s.timeLine = this.timeLine;
        s.id = this.id;
        s.useDefaultPivot = this.useDefaultPivot;
        return s;
    }

    public paint():void {

        if (this.folder===undefined || this.file===undefined) return; // if image is missed


        let paintPivotX:number;
        let paintPivotY:number;
        if(this.useDefaultPivot) {
            paintPivotX=this.scmlObject.activeCharacterMap[this.folder].files[this.file].pivotX;
            paintPivotY=this.scmlObject.activeCharacterMap[this.folder].files[this.file].pivotY;
        }
        else {
            paintPivotX=this.pivot_x;
            paintPivotY=this.pivot_y;
        }

        // paintSprite image represented by
        // ScmlObject.activeCharacterMap[folder].files[file],fileReference
        // at x,y,angle (counter-clockwise), offset by paintPivotX,paintPivotY
        const url:string = this.scmlObject.activeCharacterMap[this.folder].files[this.file].name;
        //debugPaint(url,this.scmlObject.activeCharacterMap[this.folder].files[this.file],this.info,paintPivotX,paintPivotY,this.index);
        const paintId:string = url+'_' +this.timeLine.id + '_' + this.id;
        this.scmlObject.root.paintSprite(url,this.scmlObject.activeCharacterMap[this.folder].files[this.file],this.info,paintPivotX,paintPivotY,paintId);
    }

    public linear(keyB:SpriteTimelineKey,t:number):TimelineKey {
        // keyB must be SpriteTimelineKey
        const returnKey:SpriteTimelineKey=this.clone();
        returnKey.info=linearSpatial(this.info,keyB.info,this.info.spin,t);
        if(!this.useDefaultPivot) {
            //returnKey.pivot_x=linear(this.pivot_x,keyB.pivot_x,t); // todo is this really needed?
            //returnKey.pivot_y=linear(this.pivot_y,keyB.pivot_y,t);
        }
        return returnKey;
    }

}
const linear = (a:number,b:number,t:number) =>{
    return ((b-a)*t)+a;
};

const linearSpatial = (infoA:SpatialInfo,infoB:SpatialInfo,spin:number,t:number):SpatialInfo=> {
    const resultInfo:SpatialInfo = new SpatialInfo(); // todo
    resultInfo.x=linear(infoA.x,infoB.x,t);
    resultInfo.y=linear(infoA.y,infoB.y,t);
    resultInfo.angle=angleLinear(infoA.angle,infoB.angle,spin,t);
    resultInfo.scaleX=linear(infoA.scaleX,infoB.scaleX,t);
    resultInfo.scaleY=linear(infoA.scaleY,infoB.scaleY,t);
    resultInfo.a=linear(infoA.a,infoB.a,t);
    return resultInfo;
};

const angleLinear = (angleA:number,angleB:number,spin:number,t:number):number=> {
    if(spin===0) {
        return angleA;
    }
    if(spin>0) {
        if((angleB-angleA)<0) {
            angleB+=360;
        }
    }
    else if(spin<0) {
        if((angleB-angleA)>0) {
            angleB-=360;
        }
    }
    return linear(angleA,angleB,t);
};

const quadratic = (a:number,b:number,c:number,t:number):number=> {
    return linear(linear(a,b,t),linear(b,c,t),t);
};

const cubic = (a:number,b:number,c:number,d:number,t:number):number=>{
    return linear(quadratic(a,b,c,t),quadratic(b,c,d,t),t);
};


export class SpriterObject extends RenderableModel {


    private scmlObject:ScmlObject;
    private resourceLinks:Record<string,ResourceLink<ITexture>> = {};
    private readonly rootNode:RenderableModel = new NullGameObject(this.game);

    constructor(protected game:Game) {
        super(game);
        this.rootNode.scale.setXY(1,-1);
        this.appendChild(this.rootNode);
    }

    public preload(sconUrl:string|IURLRequest){
        let baseUrl:string;
        let urlRequest:IURLRequest;
        if ((sconUrl as IURLRequest).url!==undefined) {
            baseUrl = (sconUrl as IURLRequest).url;
            urlRequest = (sconUrl as IURLRequest);
        } else {
            baseUrl = sconUrl as string;
            urlRequest = {url:baseUrl,responseType:'arraybuffer'};
        }
        baseUrl = baseUrl.split('/').filter((it,index,arr)=>index<arr.length-1).join('/');
        const resourceLoader:ResourceLoader = this.game.getCurrScene().resourceLoader;
        const sconResourceLink:ResourceLink<IScon> = resourceLoader.loadJSON(sconUrl);
        resourceLoader.addNextTask(()=>{
            const scon:IScon = sconResourceLink.getTarget();
            this.scmlObject = ScmlObject.fromDescription(scon);
            this.scmlObject.root = this;
            this.scmlObject.currentEntity = 0;
            this.scmlObject.currentAnimation = 0;
            for (const folder of this.scmlObject.folders) {
                for (const file of folder.files) {
                    urlRequest.url = `${baseUrl}/${file.name}`;
                    urlRequest.responseType = 'arraybuffer';
                    this.resourceLinks[file.name] = resourceLoader.loadImage({...urlRequest});
                }
            }
        });

    }

    public update(): void {
        super.update();
        this.scmlObject.update();
    }

    public clear():void {
        for (const child of this.rootNode.children) {
            child.visible = false;
        }
    }

    public paintSprite(url:string, file:File, info:SpatialInfo, pivotX:number, pivotY:number, id:string):void {
        const link:ResourceLink<ITexture> = this.resourceLinks[file.name];
        let child:Image = this.rootNode.findChildById(id)! as Image;
        if (child===undefined) {
            child = new Image(this.game);
            child.setResourceLink(link);
            child.id = id;
            this.rootNode.appendChild(child);
        }
        child.pos.setXY(info.x-pivotX*file.width,info.y-(1-pivotY)*file.height);
        child.scale.setXY(info.scaleX,-info.scaleY);
        child.angle = MathEx.degToRad(360-info.angle);
        child.alpha = info.a;
        child.visible = true;
        child.transformPoint.setXY(pivotX*file.width,(1-pivotY)*file.height);
        child.moveToFront();
    }

    public paintBone(info:SpatialInfo,drawLength:number,drawHeight:number,id:string):void {
        let child:Rectangle = this.rootNode.findChildById(id)! as Rectangle;
        if (child===undefined) {
            child = new Rectangle(this.game);
            child.id = id;
            child.color = Color.WHITE;
            child.fillColor =  Color.BLACK;
            this.rootNode.appendChild(child);
        }
        child.size.setWH(drawLength,drawHeight);
        child.transformPoint.setXY(0,drawHeight/2);
        child.pos.setXY(info.x,info.y);
        child.angle = MathEx.degToRad(360-info.angle);
        child.scale.setXY(info.scaleX,-info.scaleY);
        child.alpha = 1;
    }

    public nextAnimation(){
        this.scmlObject.nextAnimation();
    }

    public draw(): void {}



}