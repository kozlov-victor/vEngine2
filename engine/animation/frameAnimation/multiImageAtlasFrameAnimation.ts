import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ITexture} from "@engine/renderer/common/texture";
import {IRectJSON} from "@engine/geometry/rect";
import {Game} from "@engine/core/game";

export class MultiImageAtlasFrameAnimation extends AbstractFrameAnimation<{resource:ITexture,rect:IRectJSON}> {

    constructor(game:Game){
        super(game);
    }

    public clone(): this {
        const cloned:MultiImageAtlasFrameAnimation = new MultiImageAtlasFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public override revalidate(): void {
        this.target.setTexture(this.frames[0].resource);
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this.target.setTexture(this.frames[i].resource);
        const currRect:IRectJSON = this.frames[i].rect;
        this.target.getSrcRect().set(currRect);

    }

}
