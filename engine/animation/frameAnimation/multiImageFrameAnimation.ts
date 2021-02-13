import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";


export class MultiImageFrameAnimation extends AbstractFrameAnimation<ITexture> implements IRevalidatable, ICloneable<MultiImageFrameAnimation> {

    public readonly type:string = 'MultiImageFrameAnimation';

    constructor(protected game:Game){
        super(game);
    }

    public clone(): this {
        const cloned:MultiImageFrameAnimation = new MultiImageFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public revalidate(): void {
        if (DEBUG && !this.frames.length) {
            throw new DebugError('MultiImageFrameAnimation must have at least one frame');
        }
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this.target.setTexture(this.frames[i]);
        const texture:ITexture = this.target.getTexture();
        this.target.size.set(texture.size);
        this.target.getSrcRect().setSize(texture.size);
    }


}
