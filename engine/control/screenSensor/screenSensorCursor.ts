import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Consts} from "./consts";
import dummyEvent = Consts.dummyEvent;

const PI = Math.PI;
const THRESHOLD = 5;

export class ScreenSensorCursor extends SimpleGameObjectContainer {

    public static readonly DIRECTION = {
        UP: 0,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 3,
    } as const;

    private externalRing:Circle;
    private internalRing:Circle;

    private reflectKey:{
        control: KeyboardControl;
        map: Record<number, number>;
    } = {
        control: undefined!,
        map: {},
    }

    private lastDirection:number;

    constructor(game:Game,scene:Scene,radius: number) {
        super(game);
        this.createUi(radius);
        this.listenToMouse(scene);
    }

    private createUi(radius:number):void {
        const externalRing = new Circle(this.game);
        externalRing.fillColor = Consts.color1;
        externalRing.radius = radius;
        externalRing.alpha = 0.4;
        externalRing.appendTo(this);
        this.externalRing = externalRing;

        const internalRing = new Circle(this.game);
        internalRing.fillColor = Consts.color2;
        internalRing.appendTo(externalRing);
        internalRing.radius = externalRing.radius/3;
        this.internalRing = internalRing;
        this.resetInternalRing();
        this.size.setFrom(externalRing.size);
    }

    private listenToMouse(scene:Scene):void {
        scene.mouseEventHandler.on(MOUSE_EVENTS.mouseDown, e=>{
            const x = e.screenX;
            const y = e.screenY;
            this.moveInternalRing(x,y);
        });
        scene.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            if (!e.isMouseDown) return;
            const x = e.screenX;
            const y = e.screenY;
            this.moveInternalRing(x,y);
        });
        scene.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            this.resetInternalRing();
        });
    }

    private resetInternalRing():void {
        this.internalRing.center.setXY(this.externalRing.radius);
        this.internalRing.alpha = Consts.alphaNormal;
        this.doReflectToControl(undefined);
    }

    private moveInternalRing(screenX:number,screenY:number):void {
        const dx = screenX - this.externalRing.center.x;
        const dy = screenY - this.externalRing.center.y;
        let r = Math.sqrt(dx*dx+dy*dy);
        const maxRadius = this.externalRing.radius*3;
        if (r<THRESHOLD) return;
        if (r>maxRadius) return;
        r = Math.min(r, this.externalRing.radius);
        let angle = Math.atan2(dy,dx);
        if (angle<0) angle = 2*PI + angle;
        const newX = r*Math.cos(angle);
        const newY = r*Math.sin(angle);
        this.internalRing.center.setXY(this.externalRing.radius+newX,this.externalRing.radius+newY);
        this.internalRing.alpha = Consts.alphaPressed;
        const direction = ScreenSensorCursor.getDirectionByAngle(angle);
        this.doReflectToControl(direction);
    }

    private static getDirectionByAngle(angle:number):number {
        if (angle<=PI/3 || angle>=5/3*PI) return ScreenSensorCursor.DIRECTION.RIGHT;
        if (angle<2/3*PI) return ScreenSensorCursor.DIRECTION.DOWN;
        if (angle<4/3*PI) return ScreenSensorCursor.DIRECTION.LEFT;
        return ScreenSensorCursor.DIRECTION.UP;
    }

    private doReflectToControl(direction:number|undefined):void {
        if (!this.reflectKey.control) return;
        if (this.lastDirection!==undefined && this.lastDirection!==direction) {
            const reflected = this.reflectKey.map[this.lastDirection];
            this.reflectKey.control.release(reflected,dummyEvent);
        }
        if (direction!==undefined) {
            const reflected = this.reflectKey.map[direction];
            this.reflectKey.control.press(reflected,dummyEvent);
            this.lastDirection = direction;
        }
    }

    public getExternalRing():Circle {
        return this.externalRing;
    }

    public reflectToKeyboardControl(control: KeyboardControl, map: Record<0|1|2|3|number, number>): void {
        this.reflectKey.control = control;
        Object.keys(map).forEach(key=>{
            this.reflectKey.map[+key] = map[+key];
        });
    }



}
