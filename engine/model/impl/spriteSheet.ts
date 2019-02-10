
import {Game} from "../../core/game";
import {Image} from "./ui/drawable/image";
import {Cloneable} from "@engine/declarations";

export class SpriteSheet extends Image implements Cloneable<SpriteSheet>{

    type:string = 'SpriteSheet';
    numOfFramesH:number = 1;
    numOfFramesV:number = 1;

    private _currFrameIndex:number = 0;
    private _frameWidth:number = 0;
    private _frameHeight:number = 0;
    private _numOfFrames:number = 0;


    constructor(game:Game) {
        super(game);
    }

    revalidate(){
        super.revalidate();
        this._frameWidth = ~~(this.width / this.numOfFramesH);
        this._frameHeight = ~~(this.height / this.numOfFramesV);
        this._numOfFrames = this.numOfFramesH * this.numOfFramesV;
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

}