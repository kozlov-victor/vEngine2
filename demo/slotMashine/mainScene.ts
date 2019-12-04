import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {Mashine} from "./entities/mashine";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MathEx} from "@engine/misc/mathEx";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";

interface IWheelCommand {
    a:number;
    b:number;
    c:number;
    command:'spin';
}

export class MainScene extends Scene {
    
    public wheelLink:ResourceLink<ITexture>;
    private overlay!:Image;
    private mashine!:Mashine;


    constructor(protected game:Game){
        super(game);
    }

    public onPreloading() {
        this.overlay = new Image(this.game);
        this.overlay.setResourceLink(this.resourceLoader.loadImage('./slotMashine/resources/overlay.png'));
        this.wheelLink = this.resourceLoader.loadImage(`./slotMashine/resources/wheel.png?1`);

        const rect:Rectangle = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
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
