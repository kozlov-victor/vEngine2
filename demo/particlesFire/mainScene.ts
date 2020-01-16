import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {AnimatedImage} from "@engine/renderable/impl/geometry/animatedImage";


export class MainScene extends Scene {

    private resourceLink!:ResourceLink<ITexture>;


    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage('./particlesFire/fire-texture-atlas.jpg');
    }


    public onReady() {

        this.colorBG = Color.BLACK;

        const animatedImage:AnimatedImage = new AnimatedImage(this.game);
        animatedImage.setResourceLink(this.resourceLink);
        animatedImage.blendMode = BLEND_MODE.ADDITIVE;
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        anim.isRepeat = true;
        anim.duration = 1400;
        anim.setSpriteSheetSize(4,4);
        animatedImage.addFrameAnimation('animation',anim);
        animatedImage.playFrameAnimation(anim);

        //this.appendChild(animatedImage);


        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(animatedImage);
        ps.emissionRadius = 2;


        const pi:number = Math.PI;
        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:500,to:800};
        ps.particleAngle = {from:-pi/2 - pi/4,to:pi/2 + pi/4};
        ps.onEmitParticle((p:RenderableModel)=>{

            const particle:AnimatedImage = (p as AnimatedImage);
            particle.size.setWH(64,64);
            particle.playFrameAnimation('animation');
            const particleAnim:CellFrameAnimation = new CellFrameAnimation(this.game);
            particleAnim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            particleAnim.duration = 1400;
            particleAnim.isRepeat = true;
            particleAnim.setSpriteSheetSize(4,4);
            particle.addFrameAnimation('animation',particleAnim);
            particle.playFrameAnimation(particleAnim);

        });
        this.appendChild(ps);
        this.on(MOUSE_EVENTS.click,()=>{
            this.game.getRenderer().requestFullScreen();
            if (window.external && (window.external as any).V_ENGINE_NAVIGATOR) (window.external as any).GoFullscreen(true);
        });
        this.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX - animatedImage.size.width/2,e.screenY-animatedImage.size.height/2);
        });


    }
}
