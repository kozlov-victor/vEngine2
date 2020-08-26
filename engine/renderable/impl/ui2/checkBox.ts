
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Container} from "@engine/renderable/impl/ui2/container";
import {Shape} from "@engine/renderable/abstract/shape";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export interface ICheckBoxWritable {
    checked:boolean;
}

export class CheckBox extends Container implements ICheckBoxWritable {

    public readonly type:string = 'CheckBox';
    public readonly checked: boolean = false;

    private readonly _rNormal:Shape;
    private readonly _rChecked: Shape;

    constructor(game:Game) {
        super(game);
        this.size.setWH(50);
        const rNormal:Rectangle = new Rectangle(game);
        rNormal.fillColor = Color.NONE;
        rNormal.color = Color.NONE;

        const rChecked:Rectangle = new Rectangle(game);
        rChecked.fillColor = Color.NONE;
        rChecked.color = Color.NONE;
        const polyLine:PolyLine = PolyLine.fromSvgPath(this.game,'M14.1 27.2l7.1 7.2 16.7-16.8');
        polyLine.lineWidth = 6;
        polyLine.color = new Color(50,50,50);
        rChecked.appendChild(polyLine);

        this._rNormal = rNormal;
        this._rChecked = rChecked;

        this.appendChild(rNormal);
        this.appendChild(rChecked);

        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 5;
        bg.fillColor = Color.NONE.clone();
        this.setBackground(bg);

        this.updateChildrenByChecked();

        this.on(MOUSE_EVENTS.click,()=>this.toggle());
    }

    public toggle(value?:boolean):void{
        if (value!==undefined) (this as ICheckBoxWritable).checked = value;
        else (this as ICheckBoxWritable).checked = !this.checked;
        this.updateChildrenByChecked();
    }

    public revalidate():void{
        this._rNormal.size.set(this.size);
        this._rChecked.size.set(this.size);
    }

    public draw(){}

    private updateChildrenByChecked(){
        this._rNormal.visible = !this.checked;
        this._rChecked.visible = this.checked;
    }
}
