import {RenderableModel} from "../../../abstract/renderableModel";
import {IRect, Rect} from "@engine/geometry/rect";
import {Container, LAYOUT_SIZE, OVERFLOW} from "../abstract/container";
import {Game} from "@engine/core/game";
import {ICloneable} from "@engine/core/declarations";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

export class AbsoluteLayout extends Container implements ICloneable<AbsoluteLayout>{

    public readonly type:string = 'AbsoluteLayout';

    constructor(game:Game) {
        super(game);
    }

    public appendChild(c:RenderableModel):void {
        if (c instanceof Container) (c as Container).testLayout();
        super.appendChild(c);
    }

    public onGeometryChanged():void {
        super.onGeometryChanged();

        let maxX:number = 0, maxY:number = 0;
        for (const v of this.children) {
            if (v instanceof Container) (v as Container).onGeometryChanged();
            const r:IRect = v.getDestRect();
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

    public draw():void{
        // const renderer:AbstractRenderer = this.game.getRenderer(); // todo
        // if (this.overflow===OVERFLOW.HIDDEN) {
        //     const r:Rect = Rect.fromPool().setPointAndSize(this.getWorldPosition(),this.size);
        //     r.addXY(-1,-1);
        //     r.setWH(r.width+1,r.height+1);
        //     renderer.setLockRect(r);
        //     r.release();
        // }
        // if (this.background) this.background.draw();
        // renderer.transformTranslate(
        //     this.paddingLeft,
        //     this.paddingTop
        // );
        // if (this.overflow===OVERFLOW.HIDDEN) this.game.getRenderer().unsetLockRect();
    }

    public clone():AbsoluteLayout {
        const cloned:AbsoluteLayout = new AbsoluteLayout(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    protected setClonedProperties(cloned:AbsoluteLayout):void {
        super.setClonedProperties(cloned);
    }

}
