import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MathEx} from "@engine/misc/mathEx";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {
    assignPos,
    Direction,
    getMouse,
    getSize
} from "@engine/renderable/impl/ui/scrollBar/_internal/sideHelperFunctions";

interface IScrollPointDesc {
    point: {sceneX:number,sceneY:number};
    time: number;
}

export abstract class AbstractScrollContainerListener {

    private _lastPoint:IScrollPointDesc;
    private _prevPoint:IScrollPointDesc;
    private _scrollVelocity: number = 0;
    private _deceleration: number = 0;
    private readonly _OVER_SCROLL_RELEASE_VELOCITY:number = 24;
    private readonly _MOUSE_WHEEL_FACTOR:number = 0.2;
    private _overScrollFactor:number = 0;
    private offset: number = 0;
    private offsetOld: number = 0;
    private _onScroll:()=>void;
    private _mouseScroll:boolean = true;
    private _isConstrainContainerCapturedByMouse:boolean = false;

    constructor(
        private constrainContainer:RenderableModel,
        private scrollableContainer:RenderableModel
    ) {
        this.listenToMouse();
    }

    public setMouseScroll(val:boolean):void {
        this._mouseScroll = val;
    }

    public update(delta:number):void{
        const dir:Direction = this.getDirection();

        if (!this._isConstrainContainerCapturedByMouse) {
            if (this._overScrollFactor<0) { //return to initial position when overscrolled
                this.offset+=this._overScrollFactor;
                if (this.offset<=0) {
                    this._overScrollFactor = 0;
                    this.offset = 0;
                }
            }
            else if (this._overScrollFactor>0) { //return to last position when overscrolled
                this.offset+=this._overScrollFactor;
                if (this.offset>=getSize(this.constrainContainer.size,dir) - getSize(this.scrollableContainer.size,dir)) {
                    this._overScrollFactor = 0;
                    this.offset = getSize(this.constrainContainer.size,dir) - getSize(this.scrollableContainer.size,dir);
                }
            }
        }

        if (this._scrollVelocity) {
            this.offset += this._scrollVelocity * delta /1000;
        }
        this._deceleration = this._deceleration + 0.5 / delta;

        if (delta>1000) {
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }

        if (this._scrollVelocity > 0) this._scrollVelocity -= this._deceleration;
        else if (this._scrollVelocity < 0) this._scrollVelocity += this._deceleration;

        if (MathEx.closeTo(this._scrollVelocity, 0, 3)) {
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
        this._setScrollPos();
    }

    public getScrollPosition():number{
        return this.offset;
    }

    public onScroll(listener:()=>void):void {
        this._onScroll = listener;
    }

    public getCurrentOffset():number {
        return this.offset;
    }

    public setCurrentOffset(val:number):void {
        this.offset = val;
        this._setScrollPos();
    }

    public destroy():void {
        this.constrainContainer.off(MOUSE_EVENTS.mouseDown);
        this.constrainContainer.off(MOUSE_EVENTS.mouseMove);
        this.constrainContainer.off(MOUSE_EVENTS.scroll);
        this.constrainContainer.off(MOUSE_EVENTS.mouseUp);
        this.constrainContainer.off(MOUSE_EVENTS.mouseLeave);

    }

    protected abstract getDirection():Direction;

    private listenToMouse():void {
        const dir:Direction = this.getDirection();
        this.constrainContainer.on(MOUSE_EVENTS.mouseDown, (p: IObjectMouseEvent) => {
            this._isConstrainContainerCapturedByMouse = true;
            this._lastPoint = {
                point: {sceneX: p.sceneX,sceneY: p.sceneY},
                time: Date.now()
            };
            this._prevPoint = {
                point: this._lastPoint.point,
                time: this._lastPoint.time
            };
            this._scrollVelocity = 0;
            this._deceleration = 0;
            this._overScrollFactor = 0;
        });
        this.constrainContainer.on(MOUSE_EVENTS.mouseMove, (p: IObjectMouseEvent) => {
            if (!p.isMouseDown) return;
            const canScroll:boolean = getSize(this.scrollableContainer.size,dir) > getSize(this.constrainContainer.size,dir);
            if (!canScroll) return;
            const lastPoint:IScrollPointDesc = this._lastPoint;
            if (lastPoint===undefined) return;

            this._lastPoint = {
                point: p,
                time: Date.now()
            };
            this._prevPoint = {
                point: lastPoint.point,
                time: lastPoint.time,
            };

            this.offset +=
                getMouse(this._lastPoint.point,dir) - getMouse(this._prevPoint.point,dir);
            this._setScrollPos();
        });
        this.constrainContainer.on(MOUSE_EVENTS.scroll, (p: IObjectMouseEvent) => {
            if (!this._mouseScroll) return;
            const wheelDelta:number = (p.nativeEvent as WheelEvent&{wheelDelta:number}).wheelDelta;
            const newOffset:number = this.offset + wheelDelta*this._MOUSE_WHEEL_FACTOR;
            const isOverScrolled:boolean =
                newOffset > 0 ||
                newOffset < getSize(this.constrainContainer.size,dir) - getSize(this.scrollableContainer.size,dir);
            if(isOverScrolled) return;
            this.offset=newOffset;
            this._setScrollPos();
        });
        this.constrainContainer.on(MOUSE_EVENTS.mouseUp, (p: IObjectMouseEvent) => {
            this._isConstrainContainerCapturedByMouse = false;
            if (!this._lastPoint) return;
            if (!this._prevPoint) return;
            if (this._lastPoint.time === this._prevPoint.time) {
                this._scrollVelocity = 0;
            } else if (Date.now() - this._lastPoint.time > 100) {
                this._scrollVelocity = 0;
            }
            else {
                this._scrollVelocity = 1000 *
                    (getMouse(this._lastPoint.point,dir) - getMouse(this._prevPoint.point,dir)) /
                    (this._lastPoint.time - this._prevPoint.time);
            }
            this._deceleration = 0;
        });
        this.constrainContainer.on(MOUSE_EVENTS.mouseLeave, _=>{
            this._isConstrainContainerCapturedByMouse = false;
        });
    }

    private _setScrollPos():void {
        this._manageOverscroll();

        const offsetTruncated:number = ~~this.offset;

        if (this.offsetOld===undefined) this.offsetOld = offsetTruncated;
        if (offsetTruncated!==this.offsetOld) {
            assignPos(this.scrollableContainer.pos,this.offset,this.getDirection());
            if (this._onScroll!==undefined) {
                this._onScroll();
            }
            this.offsetOld = offsetTruncated;
        }
    }

    private _manageOverscroll():void {

        const dir:Direction = this.getDirection();

        const canOverScroll:boolean =
            getSize(this.scrollableContainer.size,dir) > getSize(this.constrainContainer.size,dir);
        if (!canOverScroll) return;

        //overscoll top
        if (this.offset > 0) {
            this._overScrollFactor = -this._OVER_SCROLL_RELEASE_VELOCITY;
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
        //overscoll bottom
        else if (this.offset < getSize(this.constrainContainer.size,dir) - getSize(this.scrollableContainer.size,dir)) {
            this._overScrollFactor = this._OVER_SCROLL_RELEASE_VELOCITY;
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
    }

}
