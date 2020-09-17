import {AbstractToggleButton, ICheckBoxWritable} from "@engine/renderable/impl/ui/toggleButton/_internal/abstractToggleButton";
import {Shape} from "@engine/renderable/abstract/shape";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class RadioButtonGroup {

    private buttons:RadioButton[] = [];

    public add(button:RadioButton):void{
        this.buttons.push(button);
        button.setGroup(this);
    }

    public notifyToggled(button:RadioButton):void{
        this.buttons.forEach(b=>{
            if (b!==button) b.unToggle();
        });
    }

}

export class RadioButton extends AbstractToggleButton {

    private group:RadioButtonGroup;

    constructor(game:Game) {
        super(game);
        this.on(MOUSE_EVENTS.click, ()=>this.toggle());
    }

    protected getNormalAndCheckedRenderableModel(): [normal: Shape, checked: Shape] {
        const rNormal:Circle = new Circle(this.game);
        const rChecked:Circle = new Circle(this.game);
        rNormal.color.set(Color.BLACK);
        rNormal.lineWidth = 1;
        rNormal.fillColor.set(Color.RGB(222));
        rChecked.color.set(Color.BLACK);
        rChecked.fillColor.set(Color.BLACK);
        return [rNormal,rChecked];
    }

    public toggle(){
        (this as ICheckBoxWritable).checked = true;
        this.updateState();
        if (this.group!==undefined) this.group.notifyToggled(this);
    }

    public unToggle(){
        (this as ICheckBoxWritable).checked = false;
        this.updateState();
    }

    public setGroup(group:RadioButtonGroup):void {
        this.group = group;
    }

}
