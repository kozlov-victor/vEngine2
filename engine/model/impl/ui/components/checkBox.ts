import {Container} from "../abstract/container";
import {Rectangle} from "../../geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Shape} from "../../geometry/abstract/shape";
import {Game} from "@engine/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {PolyLine} from "@engine/model/impl/geometry/polyLine";

export class CheckBox extends Container {

    public readonly type:string = 'CheckBox';

    public checked: boolean = false;
    private readonly rNormal:Shape;
    private readonly rChecked: Shape;

    constructor(game:Game) {
        super(game);
        this.size.setWH(50);
        const rNormal:Rectangle = new Rectangle(game);
        rNormal.fillColor = Color.NONE;
        rNormal.color = Color.NONE;

        const rChecked:Rectangle = new Rectangle(game);
        rChecked.fillColor = Color.NONE;
        rChecked.color = Color.NONE;
        const polyLine:PolyLine = new PolyLine(this.game);
        polyLine.lineWidth = 6;
        polyLine.color = new Color(50,50,50);
        polyLine.setSvgPath('M14.1 27.2l7.1 7.2 16.7-16.8');
        rChecked.appendChild(polyLine);

        this.rNormal = rNormal;
        this.rChecked = rChecked;

        this.appendChild(rNormal);
        this.appendChild(rChecked);

        const bg:Rectangle = new Rectangle(this.game);
        bg.borderRadius = 5;
        bg.fillColor = Color.NONE.clone();
        this.background = bg;
        this.appendChild(this.background);

        this.updateChildrenByChecked();

        this.on(MOUSE_EVENTS.click,()=>this.toggle());
    }

    public toggle():void{
        this.checked = !this.checked;
        this.updateChildrenByChecked();
    }

    public onGeometryChanged():void{
        this.rNormal.size.set(this.size);
        this.rChecked.size.set(this.size);
        this.background.size.set(this.size);
    }

    public draw():boolean{
        return true;
    }

    private updateChildrenByChecked(){
        this.rNormal.visible = !this.checked;
        this.rChecked.visible = this.checked;
    }
}