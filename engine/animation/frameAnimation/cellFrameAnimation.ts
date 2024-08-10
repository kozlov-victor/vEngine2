import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {
    AbstractFrameAnimation,
    IFrameAnimationBaseParams, tFrameAnimationDuration
} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {createRange, isArray} from "@engine/misc/object";


export interface ICellFrameAnimationParams extends IFrameAnimationBaseParams {
    frames:number[]|{from?:number,to:number};
    numOfFramesHorizontally: number;
    numOfFramesVertically: number;
}

export class CellFrameAnimation extends AbstractFrameAnimation<number> implements IRevalidatable, ICloneable<CellFrameAnimation>{

    public readonly type = 'CellFrameAnimation';

    private readonly _numOfFramesH:number;
    private readonly _numOfFramesV:number;

    constructor(game: Game, params: tFrameAnimationDuration & ICellFrameAnimationParams) {
        super(game,{
           ...params,
            frames: isArray(params.frames)?params.frames:createRange(params.frames)
        });
        this._numOfFramesH = params.numOfFramesHorizontally;
        this._numOfFramesV = params.numOfFramesVertically;
    }

    public override revalidate():void {
        if (DEBUG) {
            if (!this._target) throw new DebugError(`cellFrameAnimation is not attached to target!`);
            if (this._numOfFramesV<=0 || this._numOfFramesH<=0) {
                throw new DebugError(`can not play CellFrameAnimation: cellFrameAnimation.setSpriteSheetSize() not invoked or invoked with wrong parameters`);
            }
        }
        const {width,height} = this._target.getTexture().size;
        const frameWidth = ~~(width / this._numOfFramesH);
        const frameHeight = ~~(height / this._numOfFramesV);
        this._target.srcRect.setWH(frameWidth,frameHeight);
        this._target.size.setWH(frameWidth,frameHeight);
        super.revalidate();
    }

    public clone():this {
        const cloned = new CellFrameAnimation(this.game,{
            frames: [...this._frames],
            duration: this._duration,
            isRepeating: this._isRepeating,
            numOfFramesHorizontally: this._numOfFramesH,
            numOfFramesVertically: this._numOfFramesV,
        });
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    protected onNextFrame(i:number):void{
        this.setFrameIndex(this._frames[i]);
    }

    protected override setClonedProperties(cloned:CellFrameAnimation):void {
        super.setClonedProperties(cloned);
    }

    private getFramePosX(frameIndex:number):number {
        return (frameIndex % this._numOfFramesH) * this._target.srcRect.width;
    }

    private getFramePosY(frameIndex:number):number {
        return ~~(frameIndex / this._numOfFramesH) * this._target.srcRect.height;
    }

    private setFrameIndex(frameIndex:number):void {
        this._target.srcRect.setXY(
            this.getFramePosX(frameIndex),
            this.getFramePosY(frameIndex)
        );
    }

}

