import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/texture";
import {DebugError} from "@engine/debug/debugError";


export class MultiImageFrameAnimation extends AbstractFrameAnimation<ResourceLink<ITexture>> implements IRevalidatable, ICloneable<MultiImageFrameAnimation> {

    public readonly type:string = 'MultiImageFrameAnimation';

    constructor(protected game:Game){
        super(game);
    }


    public clone(): this { // todo
        return this;
    }

    public revalidate(): void {
        if (DEBUG && !this.frames.length) {
            throw new DebugError('MultiImageFrameAnimation must have at least one frame');
        }
        if (!this.target.getResourceLink()) this.target.setResourceLink(this.frames[0]);
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this.target.setResourceLink(this.frames[i]);
        const texture:ITexture = this.target.getResourceLink().getTarget();
        this.target.size.set(texture.size);
    }


}