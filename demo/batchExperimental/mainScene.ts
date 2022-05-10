import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Layer} from "@engine/scene/layer";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {MathEx} from "@engine/misc/math/mathEx";


const batch:boolean = true;

export class MainScene extends Scene {

    private models:RenderableModel[] = [];

    public override onReady():void {

        const drawLayer = new Layer(this.game);
        drawLayer.appendTo(this);

        const debugLayer = new DebugLayer(this.game);
        debugLayer.setSolidBackground();
        debugLayer.appendTo(this);
        debugLayer.println('click to add objects')

        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            for (let i=0;i<10_000;i++) {

                let model;

                if (batch) {
                    model = new BatchedImage(this.game);
                } else {
                    model = new Rectangle(this.game);
                    (model as Rectangle).lineWidth = 0;
                }
                model.fillColor.setRGBA(MathEx.randomUint8(),MathEx.randomUint8(),MathEx.randomUint8(),MathEx.randomUint8());
                model.size.setWH(MathEx.randomInt(10,50),MathEx.randomInt(10,50));
                model.angle = Math.random();
                model.pos.setXY(Math.random()*this.game.width,Math.random()*this.game.height);
                model.transformPoint.setToCenter();
                model.angleVelocity = 0.4;
                //model.addBehaviour(new DraggableBehaviour(this.game));
                model.appendTo(this.getLayerAtIndex(0));
                this.models.push(model);
            }
            debugLayer.println(`objects: `+this.models.length);
        });


    }
}
