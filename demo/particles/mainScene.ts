import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MathEx} from "@engine/misc/math/mathEx";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


export class MainScene extends Scene {

    public override onPreloading():void {
        console.log('on preloading');
    }

    public override onReady():void {

        const circle:Circle = new Circle(this.game);
        circle.radius = MathEx.random(5,10);
        circle.transformPoint.setToCenter();
        circle.fillColor.setFrom(ColorFactory.fromCSS('#928d4b'));
        circle.blendMode = BLEND_MODE.ADDITIVE;

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(MathEx.random(5,10));
        rect.angleVelocity = 1;
        rect.transformPoint.setToCenter();
        rect.fillColor.setFrom(ColorFactory.fromCSS('#66200c'));
        rect.blendMode = BLEND_MODE.SUBTRACTIVE;

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.addParticlePrefab(rect);
        ps.emissionRadius = 30;
        ps.forceDrawChildrenOnNewSurface = true;


        ps.numOfParticlesToEmit = {from:20,to:60};
        ps.particleLiveTime = {from:500,to:1000};
        ps.particleAngle = {from:MathEx.degToRad(270-30),to:MathEx.degToRad(270+30)};
        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX,e.screenY);
        });

    }
}
