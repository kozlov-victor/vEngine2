import {Cloneable, Revalidatable} from "@engine/declarations";
import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {DebugError} from "@engine/debug/debugError";
import {Texture} from "@engine/renderer/webGl/base/texture";

export class CellFrameAnimation extends AbstractFrameAnimation<number> implements Revalidatable, Cloneable<CellFrameAnimation>{

    readonly type:string = 'CellFrameAnimation';

    private _spriteSheet:Image;
    private _numOfFramesH:number = 1;
    private _numOfFramesV:number = 1;

    setSpriteSheet(spr: Image,numOfFramesH:number,numOfFramesV:number):void {
        this._spriteSheet = spr;
        this._numOfFramesH = numOfFramesH;
        this._numOfFramesV = numOfFramesV;
    }

    protected onNextFrame(i:number){
        this.setFrameIndex(this.frames[i]);
    }

    protected setClonedProperties(cloned:CellFrameAnimation):void {
        cloned.setSpriteSheet(this._spriteSheet,this._numOfFramesH,this._numOfFramesV);
        super.setClonedProperties(cloned);
    }

    private getFramePosX(frameIndex:number):number {
        return (frameIndex % this._numOfFramesH) * this._spriteSheet.getSrcRect().size.width;
    }

    private getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._numOfFramesH) * this._spriteSheet.getSrcRect().size.height;
    }

    private setFrameIndex(frameIndex:number):void {
        this._spriteSheet.getSrcRect().setXY(
            this.getFramePosX(frameIndex),
            this.getFramePosY(frameIndex)
        );
    }

    revalidate():void {
        if (DEBUG && !this._spriteSheet) throw new DebugError(`cellFrameAnimation needs spriteSheet! Invoke setSpriteSheet() method`);
        const {width,height} = this._spriteSheet.getResourceLink().getTarget<Texture>().size;
        const frameWidth:number = ~~(width / this._numOfFramesH);
        const frameHeight:number = ~~(height / this._numOfFramesV);
        this._spriteSheet.getSrcRect().setWH(frameWidth,frameHeight);
        this._spriteSheet.size.setWH(frameWidth,frameHeight);
        super.revalidate();
    }

    clone():CellFrameAnimation {
        const cloned:CellFrameAnimation = new CellFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}

