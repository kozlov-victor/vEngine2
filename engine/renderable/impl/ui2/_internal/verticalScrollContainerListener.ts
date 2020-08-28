import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MathEx} from "@engine/misc/mathEx";

interface IScrollPointDesc {
    point: IObjectMouseEvent;
    time: number;
}

export class VerticalScrollContainerListener {

    private _lastPoint:IScrollPointDesc;
    private _prevPoint:IScrollPointDesc;
    private _scrollVelocity: number = 0;
    private _deceleration: number = 0;
    private readonly _OVER_SCROLL_RELEASE_VELOCITY:number = 4;
    private readonly _OVER_SCROLL_RELEASE_DECELERATION:number = 0.6;
    private readonly _MOUSE_WHEEL_FACTOR:number = 0.1;
    private _overScrollFactor:number = 0;
    private offset: number = 0;
    private offsetOld: number = 0;
    private _onScroll:()=>void;

    constructor(
        private externalContainer:RenderableModel,
        private internalContainer:RenderableModel
        ) {
        this.listenToMouse();
    }

    public update(delta:number):void{

        if (this._overScrollFactor<0) { //return to top position when overscrolled
            this.offset+=this._overScrollFactor;
            this._overScrollFactor*=this._OVER_SCROLL_RELEASE_DECELERATION;
            if (this.offset<=0) {
                this._overScrollFactor = 0;
                this.offset = 0;
            }
        }
        else if (this._overScrollFactor>0) { //return to bottom position when overscrolled
            this.offset+=this._overScrollFactor;
            this._overScrollFactor*=this._OVER_SCROLL_RELEASE_DECELERATION;
            if (this.offset>=this.externalContainer.size.height - this.internalContainer.size.height) {
                this._overScrollFactor = 0;
                this.offset = this.externalContainer.size.height - this.internalContainer.size.height;
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

    public destroy():void {
         this.externalContainer.off(MOUSE_EVENTS.mouseDown);
         this.externalContainer.off(MOUSE_EVENTS.mouseMove);
         this.externalContainer.off(MOUSE_EVENTS.scroll);
         this.externalContainer.off(MOUSE_EVENTS.mouseUp);

    }

    private listenToMouse():void {
        this.externalContainer.on(MOUSE_EVENTS.mouseDown, (p: IObjectMouseEvent) => {
            this._lastPoint = {
                point: p,
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
        this.externalContainer.on(MOUSE_EVENTS.mouseMove, (p: IObjectMouseEvent) => {
            if (!p.isMouseDown) return;
            const canScroll:boolean = this.internalContainer.size.height > this.externalContainer.size.height;
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
                this._lastPoint.point.screenY - this._prevPoint.point.screenY;
            this._setScrollPos();
        });
        this.externalContainer.on(MOUSE_EVENTS.scroll, (p: IObjectMouseEvent) => {
            const wheelDelta = (p.nativeEvent as WheelEvent&{wheelDelta:number}).wheelDelta;
            const newOffset:number = this.offset + wheelDelta*this._MOUSE_WHEEL_FACTOR;
            const isOverScrolled:boolean =
                newOffset > 0 ||
                newOffset < this.externalContainer.size.height - this.internalContainer.size.height;
            if(isOverScrolled) return;
            this.offset=newOffset;
            this._setScrollPos();
        });
        this.externalContainer.on(MOUSE_EVENTS.mouseUp, (p: IObjectMouseEvent) => {
            if (!this._lastPoint) return;
            if (!this._prevPoint) return;
            if (this._lastPoint.time === this._prevPoint.time) {
                this._scrollVelocity = 0;
            } else if (Date.now() - this._lastPoint.time > 100) {
                this._scrollVelocity = 0;
            }
            else {
                this._scrollVelocity = 1000 *
                    (this._lastPoint.point.screenY - this._prevPoint.point.screenY) /
                    (this._lastPoint.time - this._prevPoint.time);
            }
            this._deceleration = 0;
        });
    }

    private _setScrollPos():void {

        this._manageOverscroll();

        if (this.offsetOld===undefined) this.offsetOld = this.offset;
        if (this.offset!==this.offsetOld) {
            this.internalContainer.pos.y = this.offset;
            if (this._onScroll!==undefined) this._onScroll();
            this.offsetOld = this.offset;
        }
    }

    private _manageOverscroll():void {

        const canOverScroll:boolean =
            this.internalContainer.size.height > this.externalContainer.size.height;
        if (!canOverScroll) return;

        //overscoll top
        if (this.offset > 0) {
            //this.offset = 0;
            this._overScrollFactor = -this._OVER_SCROLL_RELEASE_VELOCITY;
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
        //overscoll bottom
        else if (this.offset < this.externalContainer.size.height - this.internalContainer.size.height) {
            //this.offset = this.externalContainer.size.height - this.internalContainer.size.height;
            this._overScrollFactor = this._OVER_SCROLL_RELEASE_VELOCITY;
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
    }

}
