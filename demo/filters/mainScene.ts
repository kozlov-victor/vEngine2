import {Scene} from "@engine/scene/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Color} from "@engine/renderer/color";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/geometry/image";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {ColorizeFilter} from "@engine/renderer/webGl/filters/texture/colorizeFilter";
import {PixelFilter} from "@engine/renderer/webGl/filters/texture/pixelFilter";
import {PosterizeFilter} from "@engine/renderer/webGl/filters/texture/posterizeFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {LowResolutionFilter} from "@engine/renderer/webGl/filters/texture/lowResolutionFilter";
import {MotionBlurFilter} from "@engine/renderer/webGl/filters/texture/motionBlurFilter";
import {HexagonalFilter} from "@engine/renderer/webGl/filters/texture/hexagonalFilter";
import {SwirlFilter} from "@engine/renderer/webGl/filters/texture/swirlFilter";
import {TriangleBlurFilter} from "@engine/renderer/webGl/filters/texture/triangleBlurFilter";
import {ITexture} from "@engine/renderer/texture";


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
    }



    public onReady() {
        console.log('ready');
        this.logoObj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);
        this.logoObj.addBehaviour(new DraggableBehaviour(this.game));

        const bw:BlackWhiteFilter = new BlackWhiteFilter(this.game);

        const cl:ColorizeFilter = new ColorizeFilter(this.game);
        cl.setColor(Color.RGB(0,200,23,122));

        const pf:PixelFilter = new PixelFilter(this.game);

        const ps:PosterizeFilter = new PosterizeFilter(this.game);

        const sb:SimpleBlurFilter = new SimpleBlurFilter(this.game);
        sb.setSize(2);

        const barrel:BarrelDistortionFilter = new BarrelDistortionFilter(this.game);
        const noise:NoiseFilter = new NoiseFilter(this.game);
        const noiseHoriz:NoiseHorizontalFilter = new NoiseHorizontalFilter(this.game);

        const lowResolution:LowResolutionFilter = new LowResolutionFilter(this.game);

        const circle:Circle = new Circle(this.game);
        circle.radius = 40;
        circle.center.setXY(50,50);
        circle.color = Color.RGB(30,40,55);
        circle.lineWidth = 2;
        circle.color = Color.RGB(0,100,12);
        this.appendChild(circle);
        circle.filters = [
            ps,sb, lowResolution
        ];
        circle.addBehaviour(new DraggableBehaviour(this.game));


        const circle2:Circle = new Circle(this.game);
        circle2.radius = 40;
        circle2.center.setXY(80,120);
        circle2.color = Color.RGB(240,120,55);
        circle2.lineWidth = 6;
        this.appendChild(circle2);
        const motionBlur = new MotionBlurFilter(this.game);
        circle2.filters = [
            pf, motionBlur
        ];
        circle2.addBehaviour(new DraggableBehaviour(this.game));


        this.logoObj.sprite.filters = [
            ps,bw
        ];

        const ellipse:Ellipse = new Ellipse(this.game);
        ellipse.radiusX = 60;
        ellipse.radiusY = 40;
        ellipse.color = Color.BLACK;
        ellipse.lineWidth = 5;
        ellipse.center.setXY(150,50);
        ellipse.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(ellipse);

        const hex = new HexagonalFilter(this.game);
        const swirl = new SwirlFilter(this.game);

        ellipse.filters = [
            hex,swirl
        ];
        hex.setSize(8);

        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.colorFrom = Color.RGB(100,0,20);
        gradient.colorTo = Color.RGB(200,111,1);
        rect.fillColor = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(40);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        rect.pos.setXY(120,120);
        this.appendChild(rect);
        const triangleBlur = new TriangleBlurFilter(this.game);
        rect.filters = [triangleBlur];

        const tm:TweenMovie = new TweenMovie(this.game);
        tm.addTween(0,{
            target:{val:0},
            progress:(obj:{val:number})=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val+0.1);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });
        tm.addTween(2000,{
            target:{val:5},
            progress:(obj:{val:number})=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val+0.1);
            },
            time:2000,
            from:{val:5},
            to:{val:0}
        });
        tm.loop(true);
        this.addTweenMovie(tm);


        this.filters.push(noise,noiseHoriz,barrel);
    }

}
