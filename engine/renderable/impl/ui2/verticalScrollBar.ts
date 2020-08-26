import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {Shape} from "@engine/renderable/abstract/shape";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";

export class VerticalScrollBar extends NullGameObject {

    public readonly type:string = 'VerticalScrollBar';

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.refreshScrollPosition();
    }

    get maxValue(): number {
        return this._maxValue;
    }

    set maxValue(value: number) {
        this._maxValue = value;
        this.refreshScrollPosition();
    }

    private _maxValue: number = 0;
    private _value: number = 0;

    private _enabled: boolean = false;
    private readonly handler: Shape;
    private readonly background: Shape;

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
        this.visible = value;
    }

    constructor(game: Game) {
        super(game);
        const bg: Rectangle = new Rectangle(game);
        bg.size.width = 5;
        bg.fillColor = new Color(50, 50, 50, 10);
        bg.color = Color.NONE.clone();
        const hnd: Rectangle = new Rectangle(game);
        hnd.size.height = 10;
        hnd.color = Color.NONE.clone();
        hnd.fillColor = new Color(10, 10, 10, 100);
        this.handler = hnd;
        this.appendChild(bg);
        this.appendChild(hnd);
        this.background = bg;
        this.handler = hnd;
    }

    public revalidate() {
        super.revalidate();
        this.background.size.set(this.size);
        this.handler.size.width = this.size.width;
        this.refreshScrollPosition();
    }

    private refreshScrollPosition(): void {
        if (this.handler===undefined) return;
        if (this._maxValue===0) return;
        if (this._value > this._maxValue) this._value = this._maxValue;
        this.handler.size.height = this.size.height * this.size.height / this._maxValue;
        this.handler.pos.y =
            this.size.height * this._value / this._maxValue;
        if (this.handler.pos.y<0) {
            this.handler.size.height+=this.handler.pos.y;
            this.handler.pos.y=0;
        }
        if (this.handler.pos.y + this.handler.size.height>this.size.height) {
            this.handler.size.height=this.size.height - this.handler.pos.y;
        }
    }
}

