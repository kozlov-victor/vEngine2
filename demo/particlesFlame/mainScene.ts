import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Vec2} from "@engine/geometry/vec2";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    @Resource.Texture('./particlesFlame/fire-color-table.png')
    public readonly palletTexture:ITexture;

    @Resource.Texture('./particlesFire2/fire.png')
    public readonly fireTexture:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        console.log('on preloading');
        this.backgroundColor = ColorFactory.fromCSS('#280202');
    }

    public override onReady():void {

        const createParticle = (game:Game,color:Color)=>{
            const p = new BatchedImage(game);
            //p.radius = MathEx.random(2,5);
            p.size.setWH(MathEx.random(2,5));
            p.transformPoint.setToCenter();
            p.fillColor.setFrom(color);
            return p;
        }

        const container = new SimpleGameObjectContainer(this.game);
        container.size.setFrom(this.game.size);
        const f = new PalletOffsetFilter(this.game,this.palletTexture);
        container.filters = [f];
        container.appendTo(this);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('#d06e50')));
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('rgb(232,0,0)')));
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('rgb(232,0,0)')));
        ps.addParticlePrefab(createParticle(this.game,ColorFactory.fromCSS('rgb(255,241,0)')));
        ps.emissionRadius = 60;
        ps.forceDrawChildrenOnNewSurface = true;

        ps.numOfParticlesToEmit = {from:60,to:100};
        ps.particleLiveTime = {from:500,to:1000};
        ps.particleVelocity = {from:100,to:300};
        ps.onEmitParticle(p=>{
            const flameHeight = 200;
            const topPoint = {x:ps.emissionPosition.x,y:ps.emissionPosition.y - flameHeight};
            const angle = Vec2.angleTo(p.pos,topPoint);
            p.velocity.x = Math.abs(p.velocity.x)*Math.cos(angle);
            p.velocity.y = Math.abs(p.velocity.y)*Math.sin(angle);
        });
        ps.appendTo(container);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
        });
    }
}
