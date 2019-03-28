import {RenderableModel} from "../../../renderableModel";


import {Rect} from "@engine/geometry/rect";
import {Container, LAYOUT_SIZE, OVERFLOW} from "../generic/container";
import {Game} from "@engine/game";
import {Cloneable} from "@engine/declarations";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

export class AbsoluteLayout extends Container implements Cloneable<AbsoluteLayout>{

    readonly type:string = 'AbsoluteLayout';

    constructor(game:Game) {
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
           this.size.width = maxX;
        }
        if (this.layoutHeight===LAYOUT_SIZE.WRAP_CONTENT) {
            this.size.height = maxY;
        }
        this.calcDrawableRect(this.size.width,this.size.height);
    }

    draw():boolean{
        let renderer:AbstractRenderer = this.game.getRenderer();
        if (this.overflow===OVERFLOW.HIDDEN) {
            let r:Rect = Rect.fromPool().set(this.getScreenRect());
            r.addXY(-1,-1);
            r.setWH(r.size.width+1,r.size.height+1);
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

    protected setClonedProperties(cloned:AbsoluteLayout) {
        super.setClonedProperties(cloned);
    }

    clone():AbsoluteLayout {
        const cloned:AbsoluteLayout = new AbsoluteLayout(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

}