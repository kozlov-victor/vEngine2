import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {Shape} from "@engine/renderable/abstract/shape";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DefaultBackgroundObject} from "@engine/renderable/impl/ui/_internal/defaultBackgroundObject";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";
import {IToggleButtonEvent} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvent";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export interface ICheckBoxWritable {
    checked:boolean;
}

export abstract class AbstractToggleButton extends WidgetContainer {

    public readonly checked: boolean = false;

    public readonly changeEventHandler:EventEmitterDelegate<TOGGLE_BUTTON_EVENTS, IToggleButtonEvent> = new EventEmitterDelegate(this.game);

    private backgroundChecked: RenderableModel = new DefaultBackgroundObject(this.game);

    protected abstract getDefaultNormalAndCheckedRenderableModel():[normal:Shape,checked:Shape];

    protected constructor(game:Game) {
        super(game);
        this.appendChild(this.backgroundChecked);

        this.size.setWH(50);
        this.setPadding(5);

        const [rNormal,rChecked] = this.getDefaultNormalAndCheckedRenderableModel();
        this.setBackground(rNormal);
        this.setBackgroundChecked(rChecked);
        this.updateState();
    }

    public setBackgroundChecked(backgroundChecked: RenderableModel):void {
        this.replaceChild(this.backgroundChecked,backgroundChecked);
        this.backgroundChecked = backgroundChecked;
        this.updateState();
    }

    public override revalidate():void{
        super.revalidate();
        const clientRect = this.getClientRect();
        this.backgroundChecked.pos.setFrom(clientRect);
        this.backgroundChecked.size.setFrom(clientRect);
    }

    public override setProps(props: IToggleButtonProps,parent:IRealNode):void {
        super.setProps(props,parent);
        if (props.backgroundChecked!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.backgroundChecked);
            if (memoized!==this.backgroundChecked) this.setBackgroundChecked(memoized);
        }
    }

    protected updateState():void{
        this.backgroundChecked.visible=this.checked;
    }

}
