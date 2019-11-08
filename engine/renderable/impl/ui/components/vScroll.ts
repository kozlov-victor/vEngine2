import {Container} from "../abstract/container";
import {Game} from "@engine/core/game";
import {Rectangle} from "../../geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Shape} from "../../../abstract/shape";

export class VScroll extends Container {

    public readonly type:string = 'VScroll';
    public readonly handler: Shape;

    public maxValue:number = 0;
    public value: number = 0;
    private _enabled: boolean = false;


    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
        this.visible = value;
    }

    constructor(game:Game) {
        super(game);
        const bg:Rectangle = new Rectangle(game);
        bg.size.width = 5;
        bg.fillColor = new Color(50,50,50,10);
        bg.color = Color.NONE.clone();
        const hnd:Rectangle = new Rectangle(game);
        hnd.size.height = 10;
        hnd.color = Color.NONE.clone();
        hnd.fillColor = new Color(10,10,10,100);
        this.background = bg;
        this.handler = hnd;
        this.appendChild(bg);
        this.appendChild(hnd);
    }

    public onGeometryChanged():void {
        this.handler.size.width = this.background.size.width;
        if (this.value>this.maxValue) this.value = this.maxValue;
        if (this.maxValue) this.handler.size.height = this.size.height * this.size.height / this.maxValue;
        if (this.maxValue) this.handler.pos.y =
            this.size.height * this.value / this.maxValue;
        this.background.revalidate();
        this.handler.revalidate();
        this.calcDrawableRect(this.size.width,this.size.height);
    }

    public draw():void{}

}