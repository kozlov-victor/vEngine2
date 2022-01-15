import {Scene} from "@engine/scene/scene";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {Resource} from "@engine/resources/resourceDecorators";
import {FbxBinaryParser} from "@engine/renderable/impl/3d/fbxParser/fbxBinaryParser";
import {Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    @Resource.Binary('./model3dFromFbx/models/generator.fbx') // generator Lp Can spitfire tequila BUTCHER binary
    private dataBuff:ArrayBuffer;

    public override onReady():void {

        const model = new FbxBinaryParser(this.game,this.dataBuff).getModel();
        this.appendChild(model);
        model.pos.setXY(300,300);
        model.size.setWH(400,400);
        model.scale.setXYZ(100);
        //model.scale.y=-model.scale.y;

        let btnPressed = false;

        // wheel
        let lastPoint:Optional<{x:number,y:number}>;
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            btnPressed = true;
        });
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased, e=>{
            btnPressed = false;
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, (e)=>{
            if (!e.isMouseDown) return;
            if (btnPressed) return;
            if (lastPoint===undefined) lastPoint = {x:e.sceneX,y:e.screenY};
            const offsetX:number = e.sceneX - lastPoint.x;
            const offsetY:number = e.sceneY - lastPoint.y;
            const factor = 1.4;
            model.angle3d.x-=offsetY/this.game.size.width*factor;
            model.angle3d.y+=offsetX/this.game.size.height*factor;
            lastPoint.x = e.sceneX;
            lastPoint.y = e.sceneY;
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, _=>{
            lastPoint = undefined;
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, _=>{
            lastPoint = undefined;
        });

        // scale
        this.mouseEventHandler.on(MOUSE_EVENTS.scroll, e=>{
            const delta = (e.nativeEvent as any).wheelDelta>0?1:-1;
            model.scale.setXYZ(
                model.scale.x+delta
            );
            if (model.scale.x<=0) model.scale.setXYZ(0.01);
        });

        // move by mouse
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, (e)=>{
            if (!e.isMouseDown) return;
            if (!btnPressed) return;
            const movementX = e.nativeEvent.movementX;
            const movementY = e.nativeEvent.movementY;
            model.pos.setXY(
                model.pos.x+movementX,
                model.pos.y+movementY,
            )
        });
    }

}
