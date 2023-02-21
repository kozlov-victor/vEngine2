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


export class MainScene extends Scene {

    @Resource.Texture('./particlesFlame2/fire_particle.png')
    public readonly texture:ITexture;


    public override onPreloading(taskQueue:TaskQueue):void {
        //this.backgroundColor = ColorFactory.fromCSS('#280202');
    }

    public override onReady():void {

        const createParticle = (game:Game,color:Color)=>{
            const p = new Image(game,this.texture);
            p.scale.setXY(15);
            //p.radius = MathEx.random(2,5);
            p.size.setWH(MathEx.random(2,5));
            p.transformPoint.setToCenter();
            p.blendMode = BLEND_MODE.ADDITIVE;
            p.color.setFrom(color);
            return p;
        }

        const container = new SimpleGameObjectContainer(this.game);
        container.size.setFrom(this.game.size);
        container.appendTo(this);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('#d06e50')));
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('rgb(232,0,0)')));
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('rgb(232,0,0)')));
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('rgb(255,241,0)')));
        ps.emissionRadius = 10;
        ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:10,to:10};
        ps.particleLiveTime = {from:500,to:600};
        ps.particleVelocity = {from:100,to:300};
        ps.emissionPosition.setXY(this.game.width/2,this.game.height/2);
        const modifier = new FlameModifier(ps);
        modifier.flameDirection.y = 200;
        ps.onEmitParticle(p=>modifier.onEmitParticle(p));
        ps.appendTo(container);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            modifier.flameDirection.setXY(
                e.screenX - this.game.width/2,
                e.screenY - this.game.height/2
            );
        });
    }
}
