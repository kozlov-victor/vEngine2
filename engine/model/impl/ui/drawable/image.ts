import {Game} from "@engine/core/game";
import {Rect} from "@engine/core/geometry/rect";
import {DebugError} from "@engine/debugError";
import {Shape} from "../generic/shape";
import {Color} from "@engine/core/renderer/color";
import {Point2d} from "@engine/core/geometry/point2d";
import {TextureInfo} from "@engine/core/renderer/webGl/renderPrograms/abstract/abstractDrawer";



export class Image extends Shape {

    srcRect:Rect = new Rect();
    borderRadius:number = 0;
    offset:Point2d = new Point2d();

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
        if (this.width===0) this.width = tex.size.width;
        if (this.height===0) this.height = tex.size.height;
        if (this.srcRect.width===0) this.srcRect.width = tex.size.width;
        if (this.srcRect.height===0) this.srcRect.height = tex.size.height;
    }

    draw():boolean{
        this.game.getRenderer().drawImage(this);
        return true;
    }



}