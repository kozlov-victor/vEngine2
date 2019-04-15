import {Container} from "../generic/container";
import {Rectangle} from "../drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {Shape} from "../generic/shape";
import {Game} from "@engine/game";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class CheckBox extends Container {

    readonly type:string = 'CheckBox';
    private rNormal:Shape;
    private rChecked: Shape;

    checked: boolean = false;

    constructor(game:Game) {
        super(game);
        const rNormal:Rectangle = new Rectangle(game);
        rNormal.setWH(10);
        rNormal.fillColor = new Color(10,10,10,100);

        const rChecked:Rectangle = new Rectangle(game);
        rChecked.setWH(10);
        rChecked.fillColor = new Color(10,50,10,100);

        this.rNormal = rNormal;
        this.rChecked = rChecked;
        this.on(MOUSE_EVENTS.click,()=>this.toggle());
    }

    toggle():void{
        this.checked = !this.checked;
    }

    onGeometryChanged():void{
        this.rNormal.setWH(this.size.width,this.size.height);
        this.rChecked.setWH(this.size.width,this.size.height);
    }

    protected getBgByState():Shape{
        if (this.checked) return this.rChecked;
        return this.rNormal;
    }

    draw():boolean{
        const bg:Shape = this.getBgByState();
        if (bg) bg.draw(); // todo
        return true;
    }
}