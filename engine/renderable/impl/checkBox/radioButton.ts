import {AbstractCheckBox} from "@engine/renderable/impl/checkBox/_internal/abstractCheckBox";
import {Shape} from "@engine/renderable/abstract/shape";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {ICheckBoxWritable} from "@engine/renderable/impl/checkBox/checkBox";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class RadioButton extends AbstractCheckBox {

    constructor(game:Game) {
        super(game);
        this.on(MOUSE_EVENTS.click, ()=>this.toggle());
    }

    protected getNormalAndCheckedRenderableModel(): [normal: Shape, checked: Shape] {
        const rNormal:Circle = new Circle(this.game);
        const rChecked:Circle = new Circle(this.game);
        rNormal.color = Color.BLACK;
        rNormal.lineWidth = 1;
        rNormal.fillColor = Color.RGB(222);
        rChecked.color = Color.BLACK;
        rChecked.fillColor = Color.BLACK;
        return [rNormal,rChecked];
    }

    public toggle(){
        (this as ICheckBoxWritable).checked = true;
        this.updateChildrenByChecked();
    }

}
