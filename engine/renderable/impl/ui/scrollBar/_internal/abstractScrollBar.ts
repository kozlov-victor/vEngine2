import {Shape} from "@engine/renderable/abstract/shape";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {MarkableGameObjectContainer} from "@engine/renderable/impl/ui/textField/_internal/markableGameObjectContainer";
import {
    assignPos,
    assignSize,
    Direction, getOppositeDirection, getPos,
    getSize
} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";

export abstract class AbstractScrollBar extends MarkableGameObjectContainer{

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.markAsDirty();
    }

    get maxValue(): number {
        return this._maxValue;
    }

    set maxValue(value: number) {
        this._maxValue = value;
        this.markAsDirty();
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
        this.visible = value;
    }

    constructor(game: Game) {
        super(game);
        this.size.setWH(1,1);
        const bg: Rectangle = new Rectangle(game);
        bg.size.setWH(5,1);
        bg.fillColor = new Color(50, 50, 50, 10);
        bg.color = Color.NONE.clone();
        const hnd: Rectangle = new Rectangle(game);
        hnd.size.setWH(10,1);
        hnd.color = Color.NONE.clone();
        hnd.fillColor = new Color(10, 10, 10, 100);
        this.handler = hnd;
        this.appendChild(bg);
        this.appendChild(hnd);
        this.background = bg;
        this.handler = hnd;
        this.size.addOnChangeListener(()=>this.markAsDirty());
    }

    private _maxValue: number = 0;
    private _value: number = 0;

    private _enabled: boolean = true;
    private readonly handler: Shape;
    private readonly background: Shape;

    protected abstract getDirection():Direction;

    public revalidate():void {
        super.revalidate();
        const dOpposite:Direction = getOppositeDirection(this.getDirection());
        this.background.size.set(this.size);
        assignSize(this.handler.size,getSize(this.size,dOpposite),dOpposite);
        this.refreshScrollPosition();
    }

    private refreshScrollPosition(): void {
        if (this._maxValue===0) {
            this.visible = false;
            return;
        }
        const d:Direction = this.getDirection();
        if (this._value > this._maxValue) this._value = this._maxValue;
        assignSize(this.handler.size, getSize(this.size,d) * getSize(this.size,d) / this._maxValue,d);
        this.visible = this._enabled && getSize(this.size,d)>0 && getSize(this.handler.size,d) < getSize(this.size,d);
        if (!this.visible) return;
        assignPos(this.handler.pos, getSize(this.size,d) * this._value / this._maxValue,d);

        if (getPos(this.handler.pos,d)<0) {
            assignSize(this.handler.size, getSize(this.handler.size,d) + getPos(this.handler.pos,d),d);
            assignPos(this.handler.pos,0,d);
        }
        if (getPos(this.handler.pos,d) + getSize(this.handler.size,d)>getSize(this.size,d)) {
            assignSize(this.handler.size,getSize(this.size,d) - getPos(this.handler.pos,d),d);
        }
        if (getSize(this.handler.size,d)===0) {
            assignSize(this.handler.size,1,d);
        }
    }
}
