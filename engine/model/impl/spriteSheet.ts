
import {Game} from "../../core/game";
import {Image} from "./ui/drawable/image";
import {Cloneable} from "@engine/declarations";

export class SpriteSheet extends Image implements Cloneable<SpriteSheet>{

    type:string = 'SpriteSheet';
    numOfFramesH:number = 1;
    numOfFramesV:number = 1;

    _frameWidth:number = 0;
    _frameHeight:number = 0;
    _numOfFrames:number = 0;


    constructor(game:Game) {
        super(game);
    }

    revalidate(){
        super.revalidate();
        if (!(this.numOfFramesH && this.numOfFramesV)) return;
        this._frameWidth = ~~(this.width / this.numOfFramesH);
        this._frameHeight = ~~(this.height / this.numOfFramesV);
        this._numOfFrames = this.numOfFramesH * this.numOfFramesV;
        this.setWH(this._frameWidth,this._frameHeight);
    }

    clone():SpriteSheet{
        const cloned:SpriteSheet = new SpriteSheet(this.game);
        cloned.numOfFramesV = this.numOfFramesV;
        cloned.numOfFramesH = this.numOfFramesH;
        cloned.srcRect.set(this.srcRect);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);

        cloned.width = this.width;
        cloned.height = this.height;
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);

        cloned.setResourceLink(this.getResourceLink());

        return cloned;

    }

    getFramePosX(frameIndex:number) {
        return (frameIndex % this.numOfFramesH) * this._frameWidth;
    }

    getFramePosY(frameIndex:number) {
        return ~~(frameIndex / this.numOfFramesH) * this._frameHeight;
    }

    setFrameIndex(frameIndex:number){
        this.srcRect.setXYWH(
            this.getFramePosX(frameIndex),
            this.getFramePosY(frameIndex),
            this._frameWidth,
            this._frameHeight
        );
    }

}