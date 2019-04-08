import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Color} from "@engine/renderer/color";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/textureFilters/blackWhiteFilter";
import {ColorizeFilter} from "@engine/renderer/webGl/filters/textureFilters/colorizeFilter";
import {PixelFilter} from "@engine/renderer/webGl/filters/textureFilters/pixelFilter";
import {PosterizeFilter} from "@engine/renderer/webGl/filters/textureFilters/posterizeFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/textureFilters/simpleBlurFilter";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/textureFilters/barrelDistortionFilter";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {NoiseFilter} from "@engine/renderer/webGl/filters/textureFilters/noiseFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/textureFilters/noiseHorizontalFilter";
import {LowResolutionFilter} from "@engine/renderer/webGl/filters/textureFilters/lowResolutionFilter";
import {HexagonalFilter} from "@engine/renderer/webGl/filters/textureFilters/hexagonalFilter";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {SwirlFilter} from "@engine/renderer/webGl/filters/textureFilters/swirlFilter";
import {MotionBlurFilter} from "@engine/renderer/webGl/filters/textureFilters/motionBlurFilter";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {TriangleBlurFilter} from "@engine/renderer/webGl/filters/textureFilters/triangleBlurFilter";


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
    }



    onReady() {
        console.log('ready');
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
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
        (window as any).swirl = swirl;

        ellipse.filters = [
            hex,swirl
        ];
        hex.setSize(8);

        const rect:Rectangle = new Rectangle(this.game);
        let gradient:LinearGradient  = new LinearGradient();
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
        tm.tween(0,{
            target:{val:0},
            progress:(obj:{val:number})=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val+0.1);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });
        tm.tween(2000,{
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
