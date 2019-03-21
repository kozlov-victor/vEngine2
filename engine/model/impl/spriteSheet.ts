
import {Game} from "../../core/game";
import {Image} from "./ui/drawable/image";
import {Cloneable} from "@engine/declarations";
import {Rect} from "@engine/core/geometry/rect";
import {FrameAnimation} from "@engine/model/impl/frameAnimation";
import {DebugError} from "@engine/debugError";

export class SpriteSheet extends Image implements Cloneable<SpriteSheet>{

    readonly type:string = 'SpriteSheet';
    numOfFramesH:number = 1;
    numOfFramesV:number = 1;

    private _currFrameIndex:number = 0;
    private _frameWidth:number = 0;
    private _frameHeight:number = 0;
    private _numOfFrames:number = 0;
    private _frameAnimations:{[name:string]:FrameAnimation} = {};
    private _currFrameAnimation:FrameAnimation;


    constructor(game:Game) {
        super(game);
    }

    revalidate(){
        super.revalidate();
        this._frameWidth = ~~(this.width / this.numOfFramesH);
        this._frameHeight = ~~(this.height / this.numOfFramesV);
        this._numOfFrames = this.numOfFramesH * this.numOfFramesV;
        this.width = this._frameWidth; // todo
        this.height = this._frameHeight; // todo
        this.setFrameIndex(0);
    }

    protected setClonedProperties(cloned:SpriteSheet) {
        cloned.numOfFramesV = this.numOfFramesV;
        cloned.numOfFramesH = this.numOfFramesH;
        cloned.numOfFramesV = this.numOfFramesV;
        cloned.numOfFramesH = this.numOfFramesH;
        super.setClonedProperties(cloned);
    }

    clone():SpriteSheet{
        const cloned:SpriteSheet = new SpriteSheet(this.game);
        this.setClonedProperties(cloned);
        return cloned;

    }

    getFramePosX(frameIndex:number) {
        return (frameIndex % this.numOfFramesH) * this._frameWidth;
    }

    getFramePosY(frameIndex:number) {
        return ~~(frameIndex / this.numOfFramesH) * this._frameHeight;
    }

    getNumOfFrames():number{
        return this._numOfFrames;
    }


    getFrameWidth(): number {
        return this._frameWidth;
    }

    getFrameHeight(): number {
        return this._frameHeight;
    }

    setFrameIndex(frameIndex:number){
        this.srcRect.setXYWH(
            this.getFramePosX(frameIndex),
            this.getFramePosY(frameIndex),
            this._frameWidth,
            this._frameHeight
        );
        this._currFrameIndex = frameIndex;
    }

    getFrameIndex():number{
        return this._currFrameIndex;
    }

    getRect():Rect{
       return this.srcRect;
    }

    addFrameAnimation(name:string,fa:FrameAnimation) {
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

    stopFrameAnimation(){
        this._currFrameAnimation.stop();
        this._currFrameAnimation = null;
    }

    update() {
        super.update();
        if (this._currFrameAnimation) this._currFrameAnimation.update();
    }

}