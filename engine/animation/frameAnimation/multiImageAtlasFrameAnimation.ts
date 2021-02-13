import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {IRectJSON} from "@engine/geometry/rect";
import {Game} from "@engine/core/game";

export class MultiImageAtlasFrameAnimation extends AbstractFrameAnimation<{resource:ITexture,rect:IRectJSON}> {

    constructor(protected game:Game){
        super(game);
    }

    public clone(): this {
        const cloned:MultiImageAtlasFrameAnimation = new MultiImageAtlasFrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned as this;
    }

    public revalidate(): void {
        this.target.setTexture(this.frames[0].resource);
        super.revalidate();
    }

    protected onNextFrame(i: number): void {
        this.target.setTexture(this.frames[i].resource);
        const currRect:IRectJSON = this.frames[i].rect;
        this.target.getSrcRect().set(currRect);

    }

}
