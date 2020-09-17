import {Container, ContainerState} from "@engine/renderable/impl/ui/container";
import {Shape} from "@engine/renderable/abstract/shape";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";

export interface ICheckBoxWritable {
    checked:boolean;
}

export abstract class AbstractToggleButton extends Container {

    public readonly checked: boolean = false;

    private readonly _rNormal:Shape;
    private readonly _rChecked: Shape;

    protected abstract getNormalAndCheckedRenderableModel():[normal:Shape,checked:Shape]

    protected constructor(game:Game) {
        super(game);

        this.size.setWH(50);
        this.setPadding(5);

        const [rNormal,rChecked] = this.getNormalAndCheckedRenderableModel();

        this._rNormal = rNormal;
        this._rChecked = rChecked;

        this.setBackground(this._rNormal);
        this.setBackgroundActive(this._rChecked);
        this.updateState();
    }

    public revalidate():void{
        super.revalidate();
        const clientRect = this.getClientRect();
        this._rChecked.pos.set(clientRect);
        this._rChecked.size.set(clientRect);
    }


    protected updateState(){
        if (this.checked) {
            this.setState(ContainerState.ACTIVE);
        } else {
            this.setState(ContainerState.NORMAL);
        }
    }

}
