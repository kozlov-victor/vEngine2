import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Consts} from "./consts";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import dummyEvent = Consts.dummyEvent;
import alphaNormal = Consts.alphaNormal;
import alphaPressed = Consts.alphaPressed;

export class ScreenSensorButton extends SimpleGameObjectContainer {

    private btn:Circle;
    private reflectKey:{
        control: KeyboardControl;
        keyBoardButton: number;
    } = {
        control: undefined!,
        keyBoardButton: undefined!,
    }

    constructor(game:Game,radius:number) {
        super(game);
        this.createUi(radius);
        this.listenToMouse();
    }

    private createUi(radius:number):void {
        const btn = new Circle(this.game);
        btn.radius = radius;
        btn.fillColor = Consts.color2;
        btn.alpha = Consts.alphaNormal;
        btn.appendTo(this);
        this.btn = btn;
        this.size.setFrom(btn.size);
    }

    private listenToMouse():void {
        this.btn.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, e=>{
            e.transclude = false;
            this.press();
        });
        this.btn.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            e.transclude = false;
            this.release();
        });
        this.btn.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, e=>{
            e.transclude = false;
            this.release();
        });
    }

    public reflectToKeyboardControl(control: KeyboardControl, keyBoardButton:number): void {
        this.reflectKey.control = control;
        this.reflectKey.keyBoardButton = keyBoardButton;
        if (control.isPressed(keyBoardButton)) control.release(keyBoardButton,dummyEvent);
    }

    private press():void {
        if (!this.reflectKey.control) return;
        this.btn.alpha = alphaPressed;
        this.reflectKey.control.press(this.reflectKey.keyBoardButton,dummyEvent);
    }

    private release():void {
        if (!this.reflectKey.control) return;
        this.btn.alpha = alphaNormal;
        this.reflectKey.control.release(this.reflectKey.keyBoardButton,dummyEvent);
    }

}
