import {Scene} from "@engine/scene/scene";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {BoxBlurKernelFilter} from "@engine/renderer/webGl/filters/kernel/boxBlurKernelFilter";
import {EdgeDetectionKernelFilter} from "@engine/renderer/webGl/filters/kernel/edgeDetectionKernelFilter";
import {EmbossKernelFilter} from "@engine/renderer/webGl/filters/kernel/embossKernelFilter";
import {SharpenKernelFilter} from "@engine/renderer/webGl/filters/kernel/sharpenKernelFilter";
import {DebugLayer} from "@engine/scene/debugLayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Cube} from "@engine/renderer/webGl/primitives/cube";

export class MainScene extends Scene {

    public override async onReady():Promise<void> {
        const video = document.createElement('video');
        video.width = this.game.width;
        video.height = this.game.height;
        video.srcObject = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
        await video.play();

        const texture:Texture = new Texture(this.getGame().getRenderer<WebGlRenderer>().getNativeContext());
        texture.setImage(video);
        this.setInterval(()=>{
            texture.setImage(video);
        },1);


        const obj:Model3d = new Model3d(this.game,new Cube(150));
        obj.material.diffuseColor.setRGB(12,22,122);
        obj.texture = texture;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);

        const filters = [
            new BoxBlurKernelFilter(this.game),
            new EdgeDetectionKernelFilter(this.game),
            new EmbossKernelFilter(this.game),
            new SharpenKernelFilter(this.game),
        ];
        let cnt = -1;
        const debugLayer = new DebugLayer(this.game);
        debugLayer.setSolidBackground();
        this.appendChild(debugLayer);
        debugLayer.println('press Right key to set filter')
        this.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT,e=>{
            cnt++;
            cnt=cnt%filters.length;
            debugLayer.println(filters[cnt]);
            this.getLayerAtIndex(0).filters = [filters[cnt]];
        });

    }
}
