import {Container} from "@engine/renderable/impl/ui/container";
import {Shape} from "@engine/renderable/abstract/shape";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DefaultBackgroundObject} from "@engine/renderable/impl/ui/_internal/defaultBackgroundObject";

export interface ICheckBoxWritable {
    checked:boolean;
}

export abstract class AbstractToggleButton extends Container {

    public readonly checked: boolean = false;

    private backgroundChecked: RenderableModel = new DefaultBackgroundObject(this.game);

    protected abstract getNormalAndCheckedRenderableModel():[normal:Shape,checked:Shape]

    protected constructor(game:Game) {
        super(game);
        this.appendChild(this.backgroundChecked);

        this.size.setWH(50);
        this.setPadding(5);

        const [rNormal,rChecked] = this.getNormalAndCheckedRenderableModel();
        this.setBackground(rNormal);
        this.setBackgroundChecked(rChecked);
        this.updateState();
    }

    public setBackgroundChecked(backgroundChecked: RenderableModel):void {
        this.replaceChild(this.backgroundChecked,backgroundChecked);
        this.backgroundChecked = backgroundChecked;
    }

    public revalidate():void{
        super.revalidate();
        const clientRect = this.getClientRect();
        this.backgroundChecked.pos.set(clientRect);
        this.backgroundChecked.size.set(clientRect);
    }

    protected updateState(){
        this.backgroundChecked.visible=this.checked;
    }

}