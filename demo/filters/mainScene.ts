import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {Color} from "@engine/core/renderer/color";
import {BlackWhiteFilter} from "@engine/core/renderer/webGl/filters/textureFilters/blackWhiteFilter";
import {WebGlRenderer} from "@engine/core/renderer/webGl/webGlRenderer";
import {ColorizeFilter} from "@engine/core/renderer/webGl/filters/textureFilters/colorizeFilter";
import {PixelFilter} from "@engine/core/renderer/webGl/filters/textureFilters/pixelFilter";
import {PosterizeFilter} from "@engine/core/renderer/webGl/filters/textureFilters/posterizeFilter";
import {SimpleBlurFilter} from "@engine/core/renderer/webGl/filters/textureFilters/simpleBlurFilter";
import {Circle} from "@engine/model/impl/ui/drawable/circle";
import {Tween} from "@engine/core/tween";
import {TweenMovie} from "@engine/core/tweenMovie";


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
        this.logoObj.spriteSheet = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        const bw:BlackWhiteFilter = new BlackWhiteFilter((this.game.getRenderer() as WebGlRenderer)['gl']);

        const cl:ColorizeFilter = new ColorizeFilter((this.game.getRenderer() as WebGlRenderer)['gl']);
        cl.setColor(Color.RGB(0,200,23,122));

        const pf:PixelFilter = new PixelFilter((this.game.getRenderer() as WebGlRenderer)['gl']);

        const ps:PosterizeFilter = new PosterizeFilter((this.game.getRenderer() as WebGlRenderer)['gl']);

        const sb:SimpleBlurFilter = new SimpleBlurFilter((this.game.getRenderer() as WebGlRenderer)['gl']);
        sb.setSize(2);

        const circle:Circle = new Circle(this.game);
        circle.radius = 40;
        circle.center.setXY(50,50);
        circle.color = Color.RGB(30,40,55);
        circle.lineWidth = 2;
        circle.color = Color.RGB(0,100,12);
        this.appendChild(circle);
        circle.filters = [
            ps,sb
        ];

        const circle2:Circle = new Circle(this.game);
        circle2.radius = 40;
        circle2.center.setXY(80,120);
        circle2.color = Color.RGB(30,120,55);
        circle2.lineWidth = 2;
        circle2.color = Color.RGB(120,10,12);
        this.appendChild(circle2);
        circle2.filters = [
            pf
        ];


        this.logoObj.spriteSheet.filters = [
            ps,bw
        ];





        const t1:Tween = new Tween({
            target:{val:0},
            progress:(obj)=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });

        const t2:Tween = new Tween({
            target:{val:5},
            progress:(obj)=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val);
            },
            time:2000,
            from:{val:5},
            to:{val:0}
        });

        const tm:TweenMovie = this.tweenMovie();
        tm.tween(0,{
            target:{val:0},
            progress:(obj)=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val+0.1);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });
        tm.tween(2000,{
            target:{val:5},
            progress:(obj)=>{
                sb.setSize(obj.val);
                pf.setPixelSize(obj.val+0.1);
            },
            time:2000,
            from:{val:5},
            to:{val:0}
        });
        tm.loop(true);


        this.filters.push(pf);
    }

}
