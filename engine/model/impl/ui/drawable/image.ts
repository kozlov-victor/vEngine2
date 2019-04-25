import {Game} from "@engine/game";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {Shape} from "../generic/shape";
import {Color} from "@engine/renderer/color";
import {Point2d} from "@engine/geometry/point2d";
import {Cloneable} from "@engine/declarations";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {STRETCH_MODE} from "@engine/renderer/webGl/programs/impl/base/shapeDrawer.shader";


export class Image extends Shape implements Cloneable<Image>{

    readonly type:string = 'Image';
    borderRadius:number = 0;
    offset:Point2d = new Point2d();
    stretchMode:STRETCH_MODE = STRETCH_MODE.STRETCH;

    constructor(game: Game) {
        super(game);
        (this.fillColor as Color).set(Color.NONE);
    }

    revalidate():void {
        if (DEBUG && !this.getResourceLink()) {
            console.error(this);
            throw new DebugError(`can not render Image: resourceLink is not specified`);
        }
        if (DEBUG && !this.getResourceLink().getTarget()) {
            console.error(this);
            throw new DebugError(`can not render Image: can not find texture by resource link`);
        }
        const tex:Texture = this.getResourceLink().getTarget();
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
        cloned.stretchMode = this.stretchMode;
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