
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Container} from "@engine/renderable/impl/ui2/container";
import {Shape} from "@engine/renderable/abstract/shape";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Rect} from "@engine/geometry/rect";

export interface ICheckBoxWritable {
    checked:boolean;
}

export class CheckBox extends Container implements ICheckBoxWritable {

    public readonly type:string = 'CheckBox';
    public readonly checked: boolean = false;

    private readonly _rNormal:Shape;
    private readonly _rChecked: Shape;

    private readonly highLightColor:Color = Color.RGB(122,122,122);

    constructor(game:Game) {
        super(game);
        this.size.setWH(50);
        this.setPadding(5);
        const rNormal:Rectangle = new Rectangle(game);
        rNormal.borderRadius = 3;
        rNormal.color = Color.BLACK;
        rNormal.fillColor = Color.NONE;

        const rChecked:Rectangle = new Rectangle(game);
        rChecked.borderRadius = 3;
        rChecked.color = Color.BLACK;

        this._rNormal = rNormal;
        this._rChecked = rChecked;

        this.setBackground(this._rNormal);
        this.appendChild(rChecked);
        this.updateChildrenByChecked();
        this.on(MOUSE_EVENTS.click,()=>this.toggle());
    }


    public toggle(value?:boolean):void{
        if (value!==undefined) (this as ICheckBoxWritable).checked = value;
        else (this as ICheckBoxWritable).checked = !this.checked;
        this.updateChildrenByChecked();
    }

    public revalidate():void{
        super.revalidate();
        const clientRect = this.getClientRect();
        this._rChecked.pos.set(clientRect);
        this._rChecked.size.set(clientRect);
    }

    public draw(){}

    private updateChildrenByChecked(){
        if (this.checked) {
            this._rChecked.fillColor = this.highLightColor;
        } else {
            this._rChecked.fillColor = Color.NONE;
        }
    }
}
