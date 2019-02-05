import {RenderableModel} from "../../../renderableModel";




import {Rect} from "@engine/core/geometry/rect";
import {Container,LAYOUT_SIZE, OVERFLOW} from "../generic/container";

export class AbsoluteLayout extends Container {

    constructor(game) {
        super(game);
    }

    appendChild(c:RenderableModel){
        if (c instanceof Container) (c as Container).testLayout();
        super.appendChild(c);
    }

    onGeometryChanged(){
        super.onGeometryChanged();

        let maxX = 0, maxY = 0;
        for (let v of this.children) {
            if (v instanceof Container) (v as Container).onGeometryChanged();
            v.setDirty();
            let r:Rect = v.getRect();
            if (r.right>maxX) maxX = r.right;
            if (r.bottom>maxY) maxY = r.bottom;
        }
        if (this.layoutWidth===LAYOUT_SIZE.WRAP_CONTENT) {
           this.width = maxX;
        }
        if (this.layoutHeight===LAYOUT_SIZE.WRAP_CONTENT) {
            this.height = maxY;
        }
        this.calcDrawableRect(this.width,this.height);
    }

    draw():boolean{
        let renderer = this.game.getRenderer();
        if (this.overflow===OVERFLOW.HIDDEN) {
            let r:Rect = Rect.fromPool().set(this.getScreenRect());
            r.addXY(-1,-1);
            r.setWH(r.width+1,r.height+1);
            renderer.lockRect(r);
        }
        if (this.background) this.background.draw();
        renderer.translate(
            this.paddingLeft,
            this.paddingTop
        );
        if (this.overflow===OVERFLOW.HIDDEN) this.game.getRenderer().unlockRect();
        return true;
    }

}