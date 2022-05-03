import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


class ExperimentalModel extends RenderableModel {

    constructor(game: Game) {
        super(game);
    }

    override draw() {
        const glRenderer = this.game.getRenderer<WebGlRenderer>();
        glRenderer.drawExperimentalBatch(this);
    }
}

let experimental:boolean = true;

export class MainScene extends Scene {

    private models:RenderableModel[] = [];

    public override onReady():void {

        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            experimental = !experimental;
            this.game.runScene(new MainScene(this.game));
        });

        for (let i=0;i<30000;i++) {

            let model;

            if (experimental) {
                model = new ExperimentalModel(this.game);
            } else {
                model = new Rectangle(this.game);
                (model as Rectangle).lineWidth = 0;
            }

            model.passMouseEventsThrough = true;
            model.size.setWH(Math.random()*10,Math.random()*10);
            model.angle = Math.random();
            model.pos.setXY(Math.random()*this.game.width,Math.random()*this.game.height);
            model.transformPoint.setToCenter();
            //model.addBehaviour(new DraggableBehaviour(this.game));
            model.appendTo(this);
            this.models.push(model);
        }

        this.setInterval(()=>{
            for (const m of this.models) {
                m.angle+=0.1;
            }
        },100);

    }
}
