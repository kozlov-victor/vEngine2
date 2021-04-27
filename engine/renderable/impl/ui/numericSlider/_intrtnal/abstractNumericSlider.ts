import {WidgetContainer} from "@engine/renderable/impl/ui/widgetContainer";
import {
    assignPos,
    assignSize,
    Direction,
    getMouseObjectCoordinates,
    getOppositeDirection,
    getPos,
    getSize
} from "@engine/renderable/impl/ui/_internal/sideHelperFunctions";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Size} from "@engine/geometry/size";
import {DraggableBehaviour, IDraggableBehaviourParameters} from "@engine/behaviour/impl/draggable";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DRAG_EVENTS} from "@engine/behaviour/impl/dragEvents";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {TOGGLE_BUTTON_EVENTS} from "@engine/renderable/impl/ui/toggleButton/_internal/toggleButtonEvents";

export interface IChangeNumericSliderEvent<T extends AbstractNumericSlider> {
    target: T;
    value: number;
}

export abstract class AbstractNumericSlider extends WidgetContainer {

    public readonly changeEventHandler:EventEmitterDelegate<TOGGLE_BUTTON_EVENTS, IChangeNumericSliderEvent<this>> = new EventEmitterDelegate();

    protected abstract direction:Direction;
    protected abstract draggableConstrains:IDraggableBehaviourParameters;
    protected handler: RenderableModel = new Rectangle(this.game);

    private _value:number = 0;
    private _max:number = 100;

    private draggableBehaviour:DraggableBehaviour = new DraggableBehaviour(this.game);

    constructor(game:Game) {
        super(game);
        this.appendChild(this.handler);
        this.initUI();
        this.listenToClicks();
    }

    public setValue(value:number):void {
        if (value<0) value = 0;
        if (value>this._max) value = this._max;
        if (this._value===value) return;
        this._value = value;
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {target:this,value:this._value});
        this.calcHandlerPositionByValue();
    }


    public setTo(value:number):void {
        this._max = value;
    }

    public getValue():number {
        return this._value;
    }

    public getMax():number {
        return this._max;
    }

    public setHandler(handler:RenderableModel):void {
        if (DEBUG && handler.parent!==undefined) throw new DebugError(`can not set handler: this object is already in use`);
        this.replaceChild(this.handler,handler);
        this.handler = handler;
    }

    protected onClientRectChanged():void {
        super.onClientRectChanged();
        const clientRect = this.getClientRect();
        const size:Size = Size.fromPool();
        size.set(clientRect);
        assignSize(this.handler.size,getSize(size,getOppositeDirection(this.direction)),getOppositeDirection(this.direction));
        size.release();
        this.draggableBehaviour.updateConstrains(this.draggableConstrains);
    }

    private initUI():void {
        this.handler.addBehaviour(this.draggableBehaviour);
        assignSize(this.size,100,this.direction);
        assignSize(this.size,10,getOppositeDirection(this.direction));
        (this.handler as Rectangle).fillColor = Color.BLACK.clone();
        const bg = new Rectangle(this.game);
        bg.fillColor = Color.GREY.clone();
        this.setBackground(bg);
    }

    private calcValueByHandlerPosition():void {
        const clientRect = this.getClientRect();
        const pos = getPos(this.handler.pos,this.direction) - getPos(clientRect,this.direction);
        let value = pos/(getSize(clientRect,this.direction)-getSize(this.handler.size,this.direction))*this._max;
        if (value<0) value = 0;
        if (value>this._max) value = this._max;
        this._value = value;
        this.changeEventHandler.trigger(TOGGLE_BUTTON_EVENTS.changed, {target:this,value:this._value});
    }

    private calcHandlerPositionByValue():void {
        const clientRect = this.getClientRect();
        const pos =
            getPos(clientRect,this.direction) +
            this._value/this._max * (getSize(clientRect,this.direction) - getSize(this.handler.size,this.direction));
        assignPos(this.handler.pos,pos,this.direction);
    }

    private listenToClicks():void {
        this.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
            if (e.initialTarget!==this.handler) {
                const pos:number = getMouseObjectCoordinates(e,this.direction);
                assignPos(this.handler.pos,pos,this.direction);
                this.draggableBehaviour.updateConstrains(this.draggableConstrains);
                this.calcValueByHandlerPosition();
            }
        });
        this.handler.dragEventHandler.on(DRAG_EVENTS.dragMove, e=>{
            this.calcValueByHandlerPosition();
        });
    }

}
