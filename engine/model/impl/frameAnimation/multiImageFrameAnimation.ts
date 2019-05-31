import {AbstractFrameAnimation} from "@engine/model/impl/frameAnimation/abstract/abstractFrameAnimation";
import {ICloneable, IRevalidatable} from "@engine/declarations";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/game";

class CurrSprite extends Image {

    frameIndex:number = 0;

    constructor(game:Game,private anim:MultiImageFrameAnimation){
        super(game);
    }

    revalidate(){
        this.setResourceLink(this.anim.frames[this.frameIndex]);
        super.revalidate();
    }

}


export class MultiImageFrameAnimation extends AbstractFrameAnimation<ResourceLink<Texture>> implements IRevalidatable, ICloneable<MultiImageFrameAnimation> {

    readonly type:string = 'MultiImageFrameAnimation';

    readonly currSprite:CurrSprite = new CurrSprite(this.game,this);

    constructor(protected game:Game){
        super(game);
    }

    protected onNextFrame(i: number): void {
        this.currSprite.setResourceLink(this.frames[i]);
        this.currSprite.size.setWH(0);
        this.currSprite.getSrcRect().setXYWH(0,0,0,0);
        this.currSprite.frameIndex = i;
        this.currSprite.revalidate();
        this.parent.sprite = this.currSprite;
    }


    // todo
    clone(): MultiImageFrameAnimation {
        return undefined;
    }


}