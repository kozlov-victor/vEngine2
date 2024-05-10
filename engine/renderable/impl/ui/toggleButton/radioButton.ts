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
import {IToggleButtonEvent} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvent";
import {DebugError} from "@engine/debug/debugError";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export class RadioButtonGroup {

    public type:'RadioButtonGroup';

    private buttons:RadioButton[] = [];

    public _add(button:RadioButton):void{
        this.buttons.push(button);
    }

    public _notifyToggled(button:RadioButton):void{
        this.buttons.forEach(b=>{
            if (b!==button) b.unToggle();
        });
    }

}

export class RadioButton extends AbstractToggleButton {

    public override readonly type:string = 'RadioButton';

    private tsxChanged: (e:IToggleButtonEvent)=>void;

    constructor(game:Game,private group:RadioButtonGroup) {
        super(game);
        if (DEBUG && !group) {
            throw new DebugError(`group is not passed to the RadioButton constructor`);
        }
        group._add(this);
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            if (this.state!==ContainerState.DISABLED) {
                this.toggle();
                this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {value:true,target:this});
            }
        });
    }

    protected getDefaultNormalAndCheckedRenderableModel(): [normal: Shape, checked: Shape] {
        const rNormal:Circle = new Circle(this.game);
        const rChecked:Circle = new Circle(this.game);
        rNormal.color.setFrom(Color.BLACK);
        rNormal.lineWidth = 1;
        rNormal.fillColor.setFrom(Color.RGB(222));
        rChecked.color.setFrom(Color.BLACK);
        rChecked.fillColor.setFrom(Color.BLACK);
        return [rNormal,rChecked];
    }

    public toggle():void{
        if (this.checked) return;
        (this as ICheckBoxWritable).checked = true;
        this.updateState();
        if (this.group!==undefined) this.group._notifyToggled(this);
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {value:this.checked,target:this});
    }

    public unToggle():void{
        (this as ICheckBoxWritable).checked = false;
        this.updateState();
    }

    public override setProps(props:IRadioButtonProps,parent:IRealNode):void {
        super.setProps(props,parent);
        if (props.checked && !this.checked) this.toggle();
        if (props.changed!==undefined && this.tsxChanged!==props.changed) {
            if (this.tsxChanged!==undefined) this.changeEventHandler.off(TOGGLE_BUTTON_EVENTS.changed,this.tsxChanged);
            this.changeEventHandler.on(TOGGLE_BUTTON_EVENTS.changed, props.changed);
            this.tsxChanged = props.changed;
        }

    }

}
