import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Optional} from "@engine/core/declarations";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export class TrackBall {


    constructor(private scene:Scene,private model:RenderableModel) {
        this.listenTo();
    }

    public setModel(model:RenderableModel) {
        this.model = model;
    }

    private listenTo() {
        let btnPressed = false;

        // wheel
        let lastPoint:Optional<{x:number,y:number}>;
        this.scene.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            btnPressed = true;
        });
        this.scene.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            btnPressed = false;
        });
        this.scene.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, (e)=>{
            if (!e.isMouseDown) return;
            if (btnPressed) return;
            if (lastPoint===undefined) lastPoint = {x:e.sceneX,y:e.screenY};
            const offsetX:number = e.sceneX - lastPoint.x;
            const offsetY:number = e.sceneY - lastPoint.y;
            const factor = 3;
            this.model.angle3d.x-=offsetY/this.scene.getGame().size.width*factor;
            this.model.angle3d.y+=offsetX/this.scene.getGame().size.height*factor*3;
            lastPoint.x = e.sceneX;
            lastPoint.y = e.sceneY;
        });
        this.scene.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, _=>{
            lastPoint = undefined;
        });
        this.scene.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, _=>{
            lastPoint = undefined;
        });

        // scale
        this.scene.mouseEventHandler.on(MOUSE_EVENTS.scroll, e=>{
            let delta = (e.nativeEvent as any).wheelDelta>0?0.1:-0.1;
            if (btnPressed) delta/=100;
            this.model.scale.setXYZ(
                this.model.scale.x+delta*10
            );
            if (this.model.scale.x<=0) this.model.scale.setXYZ(0.01);
        });

        // fast scale
        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.NUMPAD_ADD, e=>{
            this.model.scale.addXYZ(100);
        });
        this.scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.NUMPAD_SUBTRACT, e=>{
            this.model.scale.addXYZ(-100);
            if (this.model.scale.x<=0) this.model.scale.setXYZ(0.01);
        });

        // move by mouse
        this.scene.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, (e)=>{
            if (!e.isMouseDown) return;
            if (!btnPressed) return;
            const movementX = e.nativeEvent.movementX;
            const movementY = e.nativeEvent.movementY;
            this.model.pos.setXY(
                this.model.pos.x+movementX,
                this.model.pos.y+movementY,
            )
        });

    }

}
