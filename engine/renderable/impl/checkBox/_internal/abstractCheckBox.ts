import {Container} from "@engine/renderable/impl/ui/container";
import {Shape} from "@engine/renderable/abstract/shape";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";

export abstract class AbstractCheckBox extends Container {

    public readonly checked: boolean = false;

    private readonly _rNormal:Shape;
    private readonly _rChecked: Shape;

    private readonly highLightColor:Color = Color.RGB(122,122,122);

    protected abstract getNormalAndCheckedRenderableModel():[normal:Shape,checked:Shape]

    protected constructor(game:Game) {
        super(game);

        this.size.setWH(50);
        this.setPadding(5);

        const [rNormal,rChecked] = this.getNormalAndCheckedRenderableModel();

        this._rNormal = rNormal;
        this._rChecked = rChecked;

        this.setBackground(this._rNormal);
        this.appendChild(rChecked);
        this.updateChildrenByChecked();
    }

    public revalidate():void{
        super.revalidate();
        const clientRect = this.getClientRect();
        this._rChecked.pos.set(clientRect);
        this._rChecked.size.set(clientRect);
    }



    protected updateChildrenByChecked(){
        if (this.checked) {
            this._rChecked.fillColor = this.highLightColor;
        } else {
            this._rChecked.fillColor = Color.NONE;
        }
    }

}
