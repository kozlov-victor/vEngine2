import {Scene} from "@engine/scene/scene";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {BitmapScene} from "./bitmapScene";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {DebugLayer} from "@engine/scene/debugLayer";
import {BitmapCacheHelper} from "@engine/renderable/bitmapCacheHelper";

export class MainScene extends Scene {

    @Resource.Texture('./assets/repeat.jpg')
    private baseTexture:ITexture;

    @Resource.CubeTexture(
        './cubeMapTexture/textures/cm_left.jpg',
        './cubeMapTexture/textures/cm_right.jpg',
        './cubeMapTexture/textures/cm_top.jpg',
        './cubeMapTexture/textures/cm_bottom.jpg',
        './cubeMapTexture/textures/cm_front.jpg',
        './cubeMapTexture/textures/cm_back.jpg'
    )
    private cubeTexture:ICubeMapTexture;


    public override onReady():void {

        const rootContainer = new SimpleGameObjectContainer(this.game);
        rootContainer.appendTo(this);
        rootContainer.size.setFrom(this.game.size);

        const obj:Model3d = new Model3d(this.game,new Cube(150));
        obj.material.diffuseColor.setRGB(12,22,122);
        obj.texture = this.baseTexture;
        obj.material.diffuseColorMix = 0.4;
        obj.cubeMapTexture = this.cubeTexture;
        obj.material.reflectivity = 0.9;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        obj.appendTo(rootContainer);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);
        const filter = new SimpleBlurFilter(this.game);
        obj.filters = [filter];

        const tm:TweenMovie = new TweenMovie(this.game);
        const from:number = 0;
        const to:number = 0.009;
        const time:number = 1000;

        tm.addTween(0,{
            target:{val:from},
            progress:(curr:{val:number})=>{
                filter.setSize(curr.val);
            },
            time,
            from:{val:from},
            to:{val:to},
        });
        tm.addTween(time,{
            target:{val:to},
            progress:(curr:{val:number})=>{
                filter.setSize(curr.val);
            },
            time,
            from:{val:to},
            to:{val:from},
        });
        tm.loop(true);
        this.game.getCurrentScene().addTweenMovie(tm);

        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        debugLayer.println("click to cache model as bitmap");

        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            const cached = BitmapCacheHelper.cacheAsBitmap(this.game,rootContainer);
            this.game.runScene(new BitmapScene(this.game,cached));
        });

    }

}
