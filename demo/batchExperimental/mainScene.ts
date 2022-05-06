import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Layer} from "@engine/scene/layer";


class ExperimentalModel extends RenderableModel {

    constructor(game: Game) {
        super(game);
    }

    override draw() {
        const glRenderer = this.game.getRenderer<WebGlRenderer>();
        glRenderer.drawExperimentalBatch(this);
    }
}

const experimental:boolean = true;

export class MainScene extends Scene {

    private models:RenderableModel[] = [];

    public override onReady():void {

        // this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
        //     experimental = !experimental;
        //     this.game.runScene(new MainScene(this.game));
        // });

        const drawLayer = new Layer(this.game);
        drawLayer.appendTo(this);

        const debugLayer = new DebugLayer(this.game);
        debugLayer.appendTo(this);

        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            for (let i=0;i<1000;i++) {

                let model;

                if (experimental) {
                    model = new ExperimentalModel(this.game);
                } else {
                    model = new Rectangle(this.game);
                    (model as Rectangle).lineWidth = 0;
                }
                model.size.setWH(Math.random()*10,Math.random()*10);
                model.angle = Math.random();
                model.pos.setXY(Math.random()*this.game.width,Math.random()*this.game.height);
                model.transformPoint.setToCenter();
                model.angleVelocity = 0.2;
                //model.addBehaviour(new DraggableBehaviour(this.game));
                model.appendTo(this.getLayerAtIndex(0));
                this.models.push(model);
                //debugLayer.println(`objects: `+this.models.length);
            }
        });


    }
}
