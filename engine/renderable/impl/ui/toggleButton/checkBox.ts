import {Game} from "@engine/core/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {
    AbstractToggleButton,
    ICheckBoxWritable
} from "@engine/renderable/impl/ui/toggleButton/_internal/abstractToggleButton";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Shape} from "@engine/renderable/abstract/shape";
import {Color} from "@engine/renderer/common/color";
import {ContainerState} from "@engine/renderable/impl/ui/widgetContainer";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";
import {IToggleButtonEvent} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvent";


export class CheckBox extends AbstractToggleButton implements ICheckBoxWritable {

    public override readonly type:string = 'CheckBox';

    private _tsxChanged:(e:IToggleButtonEvent)=>void;

    constructor(game:Game) {
        super(game);
        this.mouseEventHandler.on(MOUSE_EVENTS.click,()=>{
            if (this.state!==ContainerState.DISABLED) {
                this.toggle();
            }
        });
    }

    public toggle(value?:boolean):void{
        if (this.checked===value) return;
        if (value!==undefined) (this as ICheckBoxWritable).checked = value;
        else (this as ICheckBoxWritable).checked = !this.checked;
        this.updateState();
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {value:this.checked,target:this});
    }

    public override setProps(props:ICheckBoxProps):void {
        super.setProps(props);
        if (props.changed!==undefined && props.changed!==this._tsxChanged) {
            if (this._tsxChanged!==undefined) this.changeEventHandler.off(TOGGLE_BUTTON_EVENTS.changed,this._tsxChanged);
            this.changeEventHandler.on(TOGGLE_BUTTON_EVENTS.changed, props.changed);
            this._tsxChanged = props.changed;
        }
        (this as ICheckBoxWritable).checked = props.checked ?? false;
        this.updateState();
    }

    protected getDefaultNormalAndCheckedRenderableModel(): [normal: Shape, checked: Shape] {
        const rNormal:Rectangle = new Rectangle(this.game);
        rNormal.borderRadius = 3;
        rNormal.color.setFrom(Color.BLACK);
        rNormal.fillColor.setFrom(Color.NONE);
        const rChecked:Rectangle = new Rectangle(this.game);
        rChecked.color.setFrom(Color.BLACK);
        rChecked.borderRadius = 3;
        return [rNormal,rChecked];
    }

    public override draw():void {}

}
