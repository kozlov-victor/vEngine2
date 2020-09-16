import {Game} from "@engine/core/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {AbstractCheckBox} from "@engine/renderable/impl/checkBox/_internal/abstractCheckBox";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Shape} from "@engine/renderable/abstract/shape";
import {Color} from "@engine/renderer/common/color";

export interface ICheckBoxWritable {
    checked:boolean;
}

export class CheckBox extends AbstractCheckBox implements ICheckBoxWritable {

    public readonly type:string = 'CheckBox';

    constructor(game:Game) {
        super(game);
        this.on(MOUSE_EVENTS.click,()=>this.toggle());
    }

    public toggle(value?:boolean):void{
        if (value!==undefined) (this as ICheckBoxWritable).checked = value;
        else (this as ICheckBoxWritable).checked = !this.checked;
        this.updateChildrenByChecked();
    }

    protected getNormalAndCheckedRenderableModel(): [normal: Shape, checked: Shape] {
        const rNormal:Rectangle = new Rectangle(this.game);
        rNormal.borderRadius = 3;
        rNormal.color = Color.BLACK;
        rNormal.fillColor = Color.NONE;
        const rChecked:Rectangle = new Rectangle(this.game);
        rChecked.color = Color.BLACK;
        rChecked.borderRadius = 3;
        return [rNormal,rChecked];
    }

    draw() {}

}
