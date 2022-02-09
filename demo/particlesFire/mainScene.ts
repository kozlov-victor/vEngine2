import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./particlesFire/fire-texture-atlas.jpg')
    private resourceLink:ITexture;

    public override onReady():void {

        this.backgroundColor = Color.BLACK;

        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.resourceLink);
        animatedImage.blendMode = BLEND_MODE.ADDITIVE;
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game,{
            name: 'animation',
            frames: {to:14},
            isRepeating: true,
            duration: 1400,
            numOfFramesHorizontally: 4,
            numOfFramesVertically: 4,
        });
        animatedImage.addFrameAnimation(anim);
        animatedImage.playFrameAnimation(anim);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(animatedImage);
        ps.emissionRadius = 2;


        const pi:number = Math.PI;
        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:500,to:800};
        ps.particleAngle = {from:-pi/2 - pi/4,to:pi/2 + pi/4};
        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.click,()=>{
            this.game.getRenderer().requestFullScreen();
            if (window.external && (window.external as any).V_ENGINE_NAVIGATOR) (window.external as any).GoFullscreen(true);
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX - animatedImage.size.width/2,e.screenY-animatedImage.size.height/2);
        });


    }
}
