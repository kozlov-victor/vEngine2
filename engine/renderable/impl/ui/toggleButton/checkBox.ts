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


export class CheckBox extends AbstractToggleButton implements ICheckBoxWritable {

    public readonly type:string = 'CheckBox';

    private _tsxChanged:(e:boolean)=>void;

    constructor(game:Game) {
        super(game);
        this.on(MOUSE_EVENTS.click,()=>{
            if (this.state!==ContainerState.DISABLED) this.toggle();
        });
    }

    declare public on:(eventName:string,callBack:(e:any)=>void)=>()=>void;

    public toggle(value?:boolean):void{
        if (this.checked===value) return;
        if (value!==undefined) (this as ICheckBoxWritable).checked = value;
        else (this as ICheckBoxWritable).checked = !this.checked;
        this.updateState();
        this.trigger('changed',this.checked);
    }

    public setProps(props:ICheckBoxProps):void {
        super.setProps(props);
        if (props.changed!==undefined) {
            if (this._tsxChanged!==undefined) this.off('changed',this._tsxChanged);
            this.on('changed', props.changed);
            this._tsxChanged = props.changed;
        }
        (this as ICheckBoxWritable).checked = props.checked ?? false;
        this.updateState();
    }

    protected getNormalAndCheckedRenderableModel(): [normal: Shape, checked: Shape] {
        const rNormal:Rectangle = new Rectangle(this.game);
        rNormal.borderRadius = 3;
        rNormal.color.set(Color.BLACK);
        rNormal.fillColor.set(Color.NONE);
        const rChecked:Rectangle = new Rectangle(this.game);
        rChecked.color.set(Color.BLACK);
        rChecked.borderRadius = 3;
        return [rNormal,rChecked];
    }

    draw():void {}

}
