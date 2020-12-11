import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {DebugError} from "@engine/debug/debugError";
import {ISize} from "@engine/geometry/size";

export class CellFrameAnimation extends AbstractFrameAnimation<number> implements IRevalidatable, ICloneable<CellFrameAnimation>{

    public readonly type:string = 'CellFrameAnimation';

    private _numOfFramesH:number;
    private _numOfFramesV:number;

    public setSpriteSheetSize(size:ISize):void;
    public setSpriteSheetSize(numOfFramesH:number, numOfFramesV:number):void;
    public setSpriteSheetSize(sizeOrNumOfFramesH:number|ISize, numOfFramesV?:number):void {
        if ((sizeOrNumOfFramesH as number).toFixed!==undefined) {
            this._numOfFramesH = sizeOrNumOfFramesH as number;
            this._numOfFramesV = numOfFramesV!;
        } else {
            this._numOfFramesH = (sizeOrNumOfFramesH as ISize).width;
            this._numOfFramesV = (sizeOrNumOfFramesH as ISize).height;
        }
    }

    public revalidate():void {
        if (DEBUG) {
            if (!this.target) throw new DebugError(`cellFrameAnimation is not attached to target!`);
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

    protected onNextFrame(i:number):void{
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

