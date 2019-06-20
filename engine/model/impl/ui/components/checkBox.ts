import {Container} from "../abstract/container";
import {Rectangle} from "../../geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Shape} from "../../geometry/abstract/shape";
import {Game} from "@engine/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class CheckBox extends Container {

    public readonly type:string = 'CheckBox';

    public checked: boolean = false;
    private readonly rNormal:Shape;
    private readonly rChecked: Shape;

    constructor(game:Game) {
        super(game);
        this.size.setWH(10);
        const rNormal:Rectangle = new Rectangle(game);
        rNormal.size.set(this.size);
        rNormal.fillColor = new Color(100,100,100,100);

        const rChecked:Rectangle = new Rectangle(game);
        rChecked.size.set(this.size);
        rChecked.fillColor = new Color(50,50,50);

        this.rNormal = rNormal;
        this.rChecked = rChecked;
        this.on(MOUSE_EVENTS.click,()=>this.toggle());
    }

    public toggle():void{
        this.checked = !this.checked;
    }

    public onGeometryChanged():void{
        this.rNormal.setWH(this.size.width,this.size.height);
        this.rChecked.setWH(this.size.width,this.size.height);
    }

    public draw():boolean{
        const bg:Shape = this.getBgByState();
        if (bg) bg.draw(); // todo
        return true;
    }

    protected getBgByState():Shape{
        if (this.checked) return this.rChecked;
        return this.rNormal;
    }
}