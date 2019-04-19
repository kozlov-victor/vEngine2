import {Game} from "../../game";
import {Image} from "./ui/drawable/image";
import {Cloneable} from "@engine/declarations";
import {FrameAnimation} from "@engine/model/impl/frameAnimation";
import {DebugError} from "@engine/debug/debugError";
import {Texture} from "@engine/renderer/webGl/base/texture";

export class SpriteSheet extends Image implements Cloneable<SpriteSheet>{

    readonly type:string = 'SpriteSheet';
    numOfFramesH:number = 1;
    numOfFramesV:number = 1;

    private _currFrameIndex:number = 0;
    private _numOfFrames:number = 0;
    private _frameAnimations:{[name:string]:FrameAnimation} = {};
    private _currFrameAnimation:FrameAnimation;


    constructor(game:Game) {
        super(game);
    }

    revalidate():void {
        super.revalidate();
        const {width,height} = this.getResourceLink().getTarget<Texture>().size;
        this._srcRect.size.width = ~~(width / this.numOfFramesH);
        this._srcRect.size.height = ~~(height / this.numOfFramesV);
        this._numOfFrames = this.numOfFramesH * this.numOfFramesV;
        this.size.set(this._srcRect.size);
        this.setFrameIndex(0);
    }

    protected setClonedProperties(cloned:SpriteSheet):void {
        cloned.numOfFramesV = this.numOfFramesV;
        cloned.numOfFramesH = this.numOfFramesH;
        super.setClonedProperties(cloned);
    }

    clone():SpriteSheet{ // todo other properties
        const cloned:SpriteSheet = new SpriteSheet(this.game);
        this.setClonedProperties(cloned);
        return cloned;

    }

    getFramePosX(frameIndex:number):number {
        return (frameIndex % this.numOfFramesH) * this._srcRect.size.width;
    }

    getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this.numOfFramesH) * this._srcRect.size.height;
    }

    getNumOfFrames():number{
        return this._numOfFrames;
    }


    getFrameWidth():number {
        return this._srcRect.size.width;
    }

    getFrameHeight():number {
        return this._srcRect.size.height;
    }

    setFrameIndex(frameIndex:number):void {
        this._srcRect.setXY(
            this.getFramePosX(frameIndex),
            this.getFramePosY(frameIndex)
        );
        this._currFrameIndex = frameIndex;
    }

    getFrameIndex():number{
        return this._currFrameIndex;
    }

    addFrameAnimation(name:string,fa:FrameAnimation):void {
        this._frameAnimations[name] = fa;
    }

    playFrameAnimation(fr:FrameAnimation):void;
    playFrameAnimation(fr:string):void;
    playFrameAnimation(fr:string|FrameAnimation){
        let frameAnimation:FrameAnimation;
        if (typeof fr==='string') {
            frameAnimation = this._frameAnimations[fr];
        } else frameAnimation = fr;
        if (DEBUG && !fr) throw new DebugError(`no such frame animation: ${name}`);
        this._currFrameAnimation = frameAnimation;
        frameAnimation.play();
    }

    stopFrameAnimation():void {
        this._currFrameAnimation.stop();
        this._currFrameAnimation = null;
    }

    update():void {
        super.update();
        if (this._currFrameAnimation) this._currFrameAnimation.update();
    }

}