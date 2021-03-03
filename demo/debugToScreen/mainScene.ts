import {Scene} from "@engine/scene/scene";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Rect} from "@engine/geometry/rect";

export class MainScene extends Scene {

    public onReady():void {
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        // tslint:disable-next-line:no-null-keyword
        debugLayer.log(null,undefined,{test:42});
        debugLayer.log('test log');
        debugLayer.log(document);
        debugLayer.log(document.body);
        debugLayer.log(this);
        debugLayer.log(this.getDefaultLayer());
        debugLayer.log(Number);
        debugLayer.log(new Rect());

        this.setInterval(()=>{
            debugLayer.log(this.game.getCurrentTime());
        },500);
    }

}
