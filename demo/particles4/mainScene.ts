import {Scene} from "@engine/scene/scene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {EvenOddCompositionFilter} from "@engine/renderer/webGl/filters/composition/evenOddCompositionFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {LightenCompositionFilter} from "@engine/renderer/webGl/filters/composition/lightenCompositionFilter";
import {Image} from "@engine/renderable/impl/general/image";
import {Resource} from "@engine/resources/resourceDecorators";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {DarkenCompositionFilter} from "@engine/renderer/webGl/filters/composition/darkenCompositionFilter";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ScreenCompositionFilter} from "@engine/renderer/webGl/filters/composition/screenCompositionFilter";
import {DebugError} from "@engine/debug/debugError";
import {DebugLayer} from "@engine/scene/debugLayer";
import {Layer} from "@engine/scene/layer";


export class MainScene extends Scene {

    @Resource.Texture('./assets/star.png')
    private img:Texture;

    public override onReady():void {

        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        this.appendChild(new Layer(this.game));

        const root = new SimpleGameObjectContainer(this.game);
        root.forceDrawChildrenOnNewSurface = true;
        this.appendChild(root);

        const particle = new Image(this.game,this.img);

        const filters = [
            new EvenOddCompositionFilter(this.game),
            new LightenCompositionFilter(this.game),
            new DarkenCompositionFilter(this.game),
            new ScreenCompositionFilter(this.game),
        ];
        let i = 0;

        let ps:ParticleSystem;
        const setNextFilter = ():void=>{
            particle.filters[0] = filters[i];
            i++;
            i%=filters.length;
            debugLayer.clearLog();
            debugLayer.log(particle.filters[0]);

            if (ps) {
                ps.removeSelf();
            }
            ps = new ParticleSystem(this.game);
            ps.addParticlePrefab(particle);
            ps.emissionRadius = 5;
            ps.forceDrawChildrenOnNewSurface = true;


            ps.numOfParticlesToEmit = {from:10,to:15};
            ps.particleLiveTime = {from:100,to:500};
            ps.particleAngle = {from:0,to:2*Math.PI};
            root.appendChild(ps);
            this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
                ps.emissionPosition.setXY(e.screenX,e.screenY);
            });

        }

        setNextFilter();

        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            setNextFilter();
        });

    }
}
