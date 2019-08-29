import {AbstractFrameAnimation} from "@engine/animation/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/core/declarations";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/texture";

class CurrSprite extends Image {

    public frameIndex:number = 0;

    constructor(game:Game,private anim:MultiImageFrameAnimation){
        super(game);
    }

    public revalidate(){
        this.setResourceLink(this.anim.frames[this.frameIndex]);
        super.revalidate();
    }

}


export class MultiImageFrameAnimation extends AbstractFrameAnimation<ResourceLink<ITexture>> implements IRevalidatable, ICloneable<MultiImageFrameAnimation> {

    public readonly type:string = 'MultiImageFrameAnimation';

    public readonly currSprite:CurrSprite = new CurrSprite(this.game,this);

    constructor(protected game:Game){
        super(game);
    }


    public clone(): this { // todo
        return this;
    }

    protected onNextFrame(i: number): void {
        this.currSprite.setResourceLink(this.frames[i]);
        this.currSprite.size.setWH(0);
        this.currSprite.getSrcRect().setXYWH(0,0,0,0);
        this.currSprite.frameIndex = i;
        this.currSprite.revalidate();
        this.parent.sprite = this.currSprite;
    }


}