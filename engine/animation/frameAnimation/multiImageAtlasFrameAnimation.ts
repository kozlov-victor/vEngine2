import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {IRectJSON} from "@engine/geometry/rect";
import {Game} from "@engine/core/game";
import {DebugError} from "@engine/debug/debugError";

export class MultiImageAtlasFrameAnimation extends AbstractFrameAnimation<{resource:ResourceLink<ITexture>,rect:IRectJSON}> {

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
        this.target.setResourceLink(this.frames[0].resource);
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this.target.setResourceLink(this.frames[i].resource);
        const currRect:IRectJSON = this.frames[i].rect;
        this.target.getSrcRect().set(currRect);

    }

}