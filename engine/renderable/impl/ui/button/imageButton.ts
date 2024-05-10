import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image/image";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {DebugError} from "@engine/debug/debugError";
import {IRealNode} from "@engine/renderable/tsx/_genetic/realNode";

export class ImageButton extends SimpleGameObjectContainer {

    public override readonly type:string = 'ImageButton';

    constructor(
        game:Game,
        private _imgOn:Image,
        private _imgOff:Image)
    {
        super(game);
        if (DEBUG && !_imgOn) {
            throw new DebugError(`no imageOn is passed to the ImageButton constructor`);
        }
        if (DEBUG && !_imgOff) {
            throw new DebugError(`no imageOff is passed to the ImageButton constructor`);
        }
        this.appendChild(this._imgOn);
        this.appendChild(this._imgOff);
        this.triggerOff();
        this.manageEvents();
    }

    public triggerOn():void {
        this._imgOff.visible = false;
    }

    public triggerOff():void {
        this._imgOff.visible = true;
    }

    public override setProps(props:IImageButtonProps,parent:IRealNode):void {
        super.setProps(props,parent);
        if (props.imgOn!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.imgOn);
            if (memoized!==this._imgOn) {
                this.replaceChild(this._imgOn,memoized);
                this._imgOn = memoized as Image;
            }
        }
        if (props.imgOff!==undefined) {
            const memoized:RenderableModel = this.getMemoizedView(props.imgOff);
            if (memoized!==this._imgOff) {
                this.replaceChild(this._imgOff,memoized);
                this._imgOff = memoized as Image;
            }
        }
    }

    private manageEvents():void{
        this.mouseEventHandler.on(MOUSE_EVENTS.click,_=>{
            this.triggerOn();
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseUp,_=>{
            this.triggerOff();
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave,_=>{
            this.triggerOff();
        });
    }


}
