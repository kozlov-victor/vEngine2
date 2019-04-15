import {Game} from "@engine/game";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {Shape} from "../generic/shape";
import {Color} from "@engine/renderer/color";
import {Point2d} from "@engine/geometry/point2d";
import {TextureInfo} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {Cloneable} from "@engine/declarations";


export class Image extends Shape implements Cloneable<Image>{

    readonly type:string = 'Image';
    borderRadius:number = 0;
    offset:Point2d = new Point2d();
    // todo stretchMode:'stretch'|'repeat' = 'stretch';

    constructor(game: Game) {
        super(game);
        (this.fillColor as Color).set(Color.NONE);
    }

    revalidate():void {
        if (DEBUG && !this.getResourceLink()) {
            console.error(this);
            throw new DebugError(`can not render Image: resourceLink is not specified`);
        }
        const tex:TextureInfo = this.game.getRenderer().getTextureInfo(this.getResourceLink().getUrl());
        if (this.size.isZero()) {
            this.size.width = tex.size.width;
            this.size.height = tex.size.height;
        }
        if (this._srcRect.size.isZero()) {
            this._srcRect.size.width = tex.size.width;
            this._srcRect.size.height = tex.size.height;
        }
    }

    draw():boolean{
        this.game.getRenderer().drawImage(this);
        return true;
    }

    protected setClonedProperties(cloned:Image):void {
        cloned._srcRect.set(this._srcRect);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);
        super.setClonedProperties(cloned);
    }

    clone():Image {
        const cloned:Image = new Image(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    getSrcRect():Rect{
        return this._srcRect;
    }



}