import {ICloneable, IRevalidatable} from "@engine/declarations";
import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";
import {Image} from "@engine/model/impl/geometry/image";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {GameObject} from "@engine/model/impl/general/gameObject";

export class CellFrameAnimation extends AbstractFrameAnimation<number> implements IRevalidatable, ICloneable<CellFrameAnimation>{

    public readonly type:string = 'CellFrameAnimation';

    private _spriteSheet:Image;
    private _numOfFramesH:number = 1;
    private _numOfFramesV:number = 1;

    public setSpriteSheet(spr: Image,numOfFramesH:number,numOfFramesV:number):void {
        this._spriteSheet = spr;
        this._numOfFramesH = numOfFramesH;
        this._numOfFramesV = numOfFramesV;
    }

    public revalidate():void {
        if (DEBUG && !this._spriteSheet) throw new DebugError(`cellFrameAnimation needs spriteSheet! Invoke setSpriteSheet() method`);
        const {width,height} = this._spriteSheet.getResourceLink().getTarget().size;
        const frameWidth:number = ~~(width / this._numOfFramesH);
        const frameHeight:number = ~~(height / this._numOfFramesV);
        this._spriteSheet.getSrcRect().setWH(frameWidth,frameHeight);
        this._spriteSheet.size.setWH(frameWidth,frameHeight);
        super.revalidate();
    }

    public clone():this {
        const cloned:CellFrameAnimation = new CellFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public afterCloned(g: GameObject): void {
        super.afterCloned(g);
        this.setSpriteSheet(g.sprite as Image,this._numOfFramesH,this._numOfFramesV);
    }

    protected onNextFrame(i:number){
        this.setFrameIndex(this.frames[i]);
    }

    protected setClonedProperties(cloned:CellFrameAnimation):void {
        cloned._numOfFramesH = this._numOfFramesH;
        cloned._numOfFramesV = this._numOfFramesV;
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

}

