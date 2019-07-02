import {Scene} from "@engine/model/impl/general/scene";
import {ParticleSystem} from "@engine/model/impl/general/particleSystem";
import {BLEND_MODE, RenderableModel} from "@engine/model/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/texture";
import {Image} from "@engine/model/impl/geometry/image";
import {Color} from "@engine/renderer/color";
import {GameObject} from "@engine/model/impl/general/gameObject";
import {CellFrameAnimation} from "@engine/model/impl/frameAnimation/cellFrameAnimation";
import {Game} from "@engine/game";


export class MainScene extends Scene {

    private ps!:ParticleSystem;
    private resourceLink!:ResourceLink<ITexture>;
    private obj:GameObject;

    private _em:boolean = false;

    public onPreloading() {
        this.resourceLink = this.resourceLoader.loadImage('fire-texture-atlas.jpg');
    }


    public onReady() {

        this.colorBG = Color.BLACK;

        this.obj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.resourceLink);
        spr.blendMode = BLEND_MODE.ADDITIVE;
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
        anim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
        anim.isRepeat = true;
        anim.duration = 1400;
        anim.setSpriteSheet(spr,4,4);
        this.obj.sprite = spr;
        this.obj.addFrameAnimation('animation',anim);
        this.obj.playFrameAnimation(anim);

        //this.appendChild(this.obj);


        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(this.obj);
        ps.emissionRadius = 2;


        const pi:number = Math.PI;
        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:1000,to:2000};
        ps.particleAngle = {from:-0.2-pi/2,to:0.2-pi/2};
        this.ps = ps;
        ps.onEmitParticle((p:RenderableModel)=>{

            const g:GameObject = (p as GameObject);
            g.sprite.size.setWH(64,64);
            g.playFrameAnimation('animation');
            // const anim:CellFrameAnimation = new CellFrameAnimation(this.game);
            // anim.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
            // anim.duration = 1400;
            // anim.isRepeat = true;
            // anim.setSpriteSheet((g.sprite as Image),4,4);
            // g.addFrameAnimation('animation',anim);
            // g.playFrameAnimation(anim);

        });
        this.appendChild(ps);
        this.on(MOUSE_EVENTS.mouseMove,(e:IMousePoint)=>{
            this.ps.emissionPosition.setXY(e.screenX,e.screenY);
        });


    }


    public onUpdate() {

        this.ps.emit();
    }
}
