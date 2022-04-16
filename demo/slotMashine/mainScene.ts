import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Machine} from "./entities/machine";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MathEx} from "@engine/misc/math/mathEx";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

interface IWheelCommand {
    a:number;
    b:number;
    c:number;
    command:'spin';
}

export class MainScene extends Scene {

    @Resource.Texture('./slotMashine/resources/wheel.png')
    public wheelLink:ITexture;

    @Resource.Texture(`./slotMashine/resources/overlay.png`)
    public overlayLink:ITexture;

    private overlay!:Image;
    private machine!:Machine;


    constructor(game:Game){
        super(game);
    }


    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {

        this.overlay = new Image(this.game,this.overlayLink);

        this.backgroundColor = Color.RGB(100,0,0);
        this.machine = new Machine(this.game,this.wheelLink);
        this.machine.connectToScene(this);

        this.appendChild(this.overlay);

        if (this.game.getRenderer() instanceof WebGlRenderer) {
            const filter:BarrelDistortionFilter = new BarrelDistortionFilter(this.game);
            filter.setDistortion(0.025);
            this.filters = [filter];
        }

        window.addEventListener('message',(e:MessageEvent)=>{
            const commandObj:IWheelCommand = e.data as IWheelCommand;
            if (commandObj.command!=='spin') return;
            this.machine.spin(commandObj.a,commandObj.b,commandObj.c);
        });

        const a:number = ~~MathEx.random(1,5);
        const b:number = ~~MathEx.random(1,5);
        const c:number = ~~MathEx.random(1,5);
        this.machine.spin(a,b,c);

    }

}
