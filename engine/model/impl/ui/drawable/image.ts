import {Game} from "@engine/core/game";
import {Rect} from "@engine/core/geometry/rect";
import {DebugError} from "@engine/debugError";
import {Shape} from "../generic/shape";
import {Color} from "@engine/core/renderer/color";
import {Point2d} from "@engine/core/geometry/point2d";
import {TextureInfo} from "@engine/core/renderer/webGl/programs/abstract/abstractDrawer";
import {Cloneable} from "@engine/declarations";



export class Image extends Shape implements Cloneable<Image>{

    readonly type:string = 'Image';
    srcRect:Rect = new Rect();
    borderRadius:number = 0;
    offset:Point2d = new Point2d();
    // todo stretchMode:'stretch'|'repeat' = 'stretch';

    constructor(game: Game) {
        super(game);
        (this.fillColor as Color).set(Color.NONE);
    }

    revalidate(){
        if (DEBUG && !this.getResourceLink()) {
            console.error(this);
            throw new DebugError(`can not render Image: resourceLink is not specified`);
        }
        let tex:TextureInfo = this.game.getRenderer().getTextureInfo(this.getResourceLink().getId());
        if (this.size.width===0) this.size.width = tex.size.width;
        if (this.size.height===0) this.size.height = tex.size.height;
        if (this.srcRect.size.width===0) this.srcRect.size.width = tex.size.width;
        if (this.srcRect.size.height===0) this.srcRect.size.height = tex.size.height;
    }

    draw():boolean{
        this.game.getRenderer().drawImage(this);
        return true;
    }

    protected setClonedProperties(cloned:Image){
        cloned.srcRect.set(this.srcRect);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);
        super.setClonedProperties(cloned);
    }

    clone():Image {
        const cloned:Image = new Image(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }



}