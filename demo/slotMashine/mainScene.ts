import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mashine} from "./entities/mashine";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/textureFilters/barrelDistortionFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MathEx} from "@engine/misc/mathEx";

interface IWheelCommand {
    a:number;
    b:number;
    c:number;
    command:'spin';
}

export class MainScene extends Scene {
    
    public wheelLink:ResourceLink<Texture>;
    private overlay:Image;
    private mashine:Mashine;


    public onPreloading() {
        this.overlay = new Image(this.game);
        this.overlay.setResourceLink(this.resourceLoader.loadImage('../slotMashine/resources/overlay.png'));
        this.wheelLink = this.resourceLoader.loadImage(`../slotMashine/resources/wheel.png?1`);

        const rect:Rectangle = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {

        this.colorBG = Color.RGB(100,0,0);
        this.mashine = new Mashine(this.game,this.wheelLink);
        this.mashine.connectToScene(this);

        this.appendChild(this.overlay);

        if (this.game.getRenderer() instanceof WebGlRenderer) {
            const filter:BarrelDistortionFilter = new BarrelDistortionFilter(this.game);
            filter.setDistortion(0.025);
            this.filters = [filter];
        }

        window.addEventListener('message',(e:MessageEvent)=>{
            const commandObj:IWheelCommand = e.data as IWheelCommand;
            if (commandObj.command!=='spin') return;
            this.mashine.spin(commandObj.a,commandObj.b,commandObj.c);
        });

        if (window.top===window) this.on(MOUSE_EVENTS.click,()=>{
            const a:number = ~~MathEx.random(1,5);
            const b:number = ~~MathEx.random(1,5);
            const c:number = ~~MathEx.random(1,5);
            this.mashine.spin(1,1,1);
        });

    }

}
