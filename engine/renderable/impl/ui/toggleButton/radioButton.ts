import {
    AbstractToggleButton,
    ICheckBoxWritable
} from "@engine/renderable/impl/ui/toggleButton/_internal/abstractToggleButton";
import {Shape} from "@engine/renderable/abstract/shape";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ContainerState} from "@engine/renderable/impl/ui/widgetContainer";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {IToggleButtonEvent} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvent";

export class RadioButtonGroup {

    public readonly changeEventHandler:EventEmitterDelegate<TOGGLE_BUTTON_EVENTS, IToggleButtonEvent> = new EventEmitterDelegate();

    private buttons:RadioButton[] = [];

    public add(button:RadioButton):void{
        this.buttons.push(button);
        button.setGroup(this);
    }

    public notifyToggled(button:RadioButton):void{
        this.buttons.forEach(b=>{
            if (b!==button) b.unToggle();
        });
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {target:button,value:true});
    }

}

export class RadioButton extends AbstractToggleButton {

    public readonly type:string = 'RadioButton';

    private group:RadioButtonGroup;

    constructor(game:Game) {
        super(game);
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            if (this.state!==ContainerState.DISABLED) this.toggle();
        });
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

    public toggle():void{
        (this as ICheckBoxWritable).checked = true;
        this.updateState();
        if (this.group!==undefined) this.group.notifyToggled(this);
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {value:this.checked,target:this});
    }

    public unToggle():void{
        (this as ICheckBoxWritable).checked = false;
        this.updateState();
    }

    public setGroup(group:RadioButtonGroup):void {
        this.group = group;
    }

}
