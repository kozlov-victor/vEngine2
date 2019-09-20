import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {DebugError} from "@engine/debug/debugError";
import {AnimatedImage} from "@engine/renderable/impl/geometry/animatedImage";

export class CellFrameAnimation extends AbstractFrameAnimation<number> implements IRevalidatable, ICloneable<CellFrameAnimation>{

    public readonly type:string = 'CellFrameAnimation';

    private _numOfFramesH:number;
    private _numOfFramesV:number;

    public setSpriteSheetSize(numOfFramesH:number, numOfFramesV:number):void {
        this._numOfFramesH = numOfFramesH;
        this._numOfFramesV = numOfFramesV;
    }

    public revalidate():void {
        if (DEBUG) {
            if (!this.target) throw new DebugError(`cellFrameAnimation is not attached to target! Invoke animatedImage.setFrameAnimation() method`);
            if (this._numOfFramesV<=0 || this._numOfFramesH<=0) {
                throw new DebugError(`can not play CellFrameAnimation: cellFrameAnimation.setSpriteSheetSize() not invoked or invoked with wrong parameters`);
            }
        }
        const {width,height} = this.target.getResourceLink().getTarget().size;
        const frameWidth:number = ~~(width / this._numOfFramesH);
        const frameHeight:number = ~~(height / this._numOfFramesV);
        this.target.getSrcRect().setWH(frameWidth,frameHeight);
        this.target.size.setWH(frameWidth,frameHeight);
        super.revalidate();
    }

    public clone():this {
        const cloned:CellFrameAnimation = new CellFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public afterCloned(g: AnimatedImage): void {
        super.afterCloned(g);
        this.setSpriteSheetSize(this._numOfFramesH,this._numOfFramesV);
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
        return (frameIndex % this._numOfFramesH) * this.target.getSrcRect().width;
    }

    private getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._numOfFramesH) * this.target.getSrcRect().height;
    }

    private setFrameIndex(frameIndex:number):void {
        this.target.getSrcRect().setXY(
            this.getFramePosX(frameIndex),
            this.getFramePosY(frameIndex)
        );
    }

}

