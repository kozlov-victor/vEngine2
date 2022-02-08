import {Scene} from "@engine/scene/scene";
import {Layer} from "@engine/scene/layer";
import {DebugLayer} from "@engine/scene/debugLayer";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {


    public override async onReady() {
        this.backgroundColor = ColorFactory.fromCSS(`#e5e5e5`);
        const workLayer = new Layer(this.game);
        this.appendChild(workLayer);
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);

        await require('./mainScene.script').default(this.game);
    }
}
