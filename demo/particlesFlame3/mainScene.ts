import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {TaskQueue} from "@engine/resources/taskQueue";
import {Image} from "@engine/renderable/impl/general/image/image";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {FlameModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/flameModifier";
import {RingModifier} from "@engine/renderable/impl/general/partycleSystem/modifier/ringModifier";


export class MainScene extends Scene {

    @Resource.Texture('./particlesFlame2/fire_particle.png')
    public readonly texture:ITexture;


    public override onPreloading(taskQueue:TaskQueue):void {
        //this.backgroundColor = ColorFactory.fromCSS('#280202');
    }

    public override onReady():void {

        const createParticle = (game:Game)=>{
            const p = new Image(game,this.texture);
            p.scale.setXY(10);
            p.size.setWH(MathEx.random(2,5));
            p.transformPoint.setToCenter();
            p.blendMode = BLEND_MODE.ADDITIVE;
            return p;
        }

        const container = new SimpleGameObjectContainer(this.game);
        container.size.setFrom(this.game.size);
        container.appendTo(this);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(createParticle(this.game));
        ps.addParticlePrefab(createParticle(this.game));
        ps.addParticlePrefab(createParticle(this.game));
        ps.addParticlePrefab(createParticle(this.game));
        ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:10,to:15};
        ps.particleLiveTime = {from:500,to:510};
        ps.particleVelocity = {from:100,to:110};
        ps.emissionPosition.setXY(this.game.width/2,this.game.height/2);
        const modifier = new RingModifier(ps);
        ps.onEmitParticle(p=>modifier.onEmitParticle(p));
        ps.appendTo(container);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            if (!e.isMouseDown) return;
            modifier.radius = Math.sqrt(
                (e.screenX-this.game.width/2)**2
                +
                (e.screenY-this.game.height/2)**2
            )
        });
    }
}
