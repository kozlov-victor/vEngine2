import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {Resource} from "@engine/resources/resourceDecorators";
import {Image} from "@engine/renderable/impl/general/image/image";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";


export class MainScene extends Scene {

    @Resource.Texture('./particlesFire2/fire.png')
    public readonly fireTexture:ITexture;

    public override onReady():void {

        this.backgroundColor = Color.BLACK;

        const image = new Image(this.game,this.fireTexture);
        image.blendMode = BLEND_MODE.ADDITIVE;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(image);
        ps.emissionRadius = 2;


        const pi:number = Math.PI;
        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:500,to:800};
        ps.particleAngle = {from:-pi/2 - pi/4,to:pi/2 + pi/4};
        ps.particleAlpha = {start:{from:0.1,to:0},end:{from:1,to:0.8}};
        ps.particleScale = {start:{from:1,to:0.8},end:{from:0.1,to:0}};
        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.click,()=>{
            this.game.getRenderer(WebGlRenderer).requestFullScreen();
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX - image.size.width/2,e.screenY-image.size.height/2);
        });


    }
}
