import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {TweenMovie} from "@engine/animation/tweenMovie";

export class MainScene extends Scene {

    private baseTextureLink:ResourceLink<ITexture>;
    private cubeTextureLink:ResourceLink<ICubeMapTexture>;

    public onPreloading() {

        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
        this.baseTextureLink = this.resourceLoader.loadTexture('./assets/repeat.jpg');
        this.cubeTextureLink = this.resourceLoader.loadCubeTexture(
            './cubeMapTexture/textures/cm_left.jpg',
            './cubeMapTexture/textures/cm_right.jpg',
            './cubeMapTexture/textures/cm_top.jpg',
            './cubeMapTexture/textures/cm_bottom.jpg',
            './cubeMapTexture/textures/cm_front.jpg',
            './cubeMapTexture/textures/cm_back.jpg',
        );
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(12,22,122);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.baseTextureLink.getTarget();
        obj.colorMix = 0.4;
        obj.cubeMapTexture = this.cubeTextureLink.getTarget();
        obj.reflectivity = 0.9;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(obj);
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
        this.game.getCurrScene().addTweenMovie(tm);

    }

}
