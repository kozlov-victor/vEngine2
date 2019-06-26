import {Scene} from "@engine/model/impl/general/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";
import {Color} from "@engine/renderer/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Circle} from "@engine/model/impl/geometry/circle";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {DropShadowFilter} from "@engine/renderer/webGl/filters/texture/dropShadowFilter";
import {PolyLine} from "@engine/model/impl/geometry/polyLine";
import {Rectangle} from "@engine/model/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/linearGradient";

export class MainScene extends Scene {

    private logoLink:ResourceLink<Texture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');

    }


    public onReady() {
        const circle:Circle = new Circle(this.game);
        circle.radius = 90;
        circle.center.setXY(120,120);
        circle.color = Color.RGB(30,40,55);
        circle.addBehaviour(new DraggableBehaviour(this.game));
        circle.color = Color.RGB(0,100,12);
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;

        const glow:GlowFilter = new GlowFilter(this.game);
        glow.setGlowColor(Color.RGB(12,100,12));
        circle.filters = [glow];

        this.appendChild(circle);


        // created with https://editor.method.ac/
        const polyline:PolyLine = new PolyLine(this.game);
        polyline.pos.setXY(100,100);
        polyline.lineWidth = 3;
        polyline.color = Color.RGB(200,52,12);
        polyline.borderRadius = 1;
        polyline.setSvgPath(`
        M 403 184 C 410 153 479 149 479 149 C 479 149 549 175 526 196 C 503 217 528 250 477 246 z`);
        polyline.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyline);
        const dropShadow:DropShadowFilter = new DropShadowFilter(this.game,0.1,5);
        dropShadow.setColor(Color.RGB(0,12,0,122));
        dropShadow.setShift(8,8);
        polyline.filters = [dropShadow];


        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0.2;
        gradient.colorFrom = Color.RGB(100,0,20,122);
        gradient.colorTo = Color.RGB(200,111,1,254);
        rect.fillColor = gradient;
        rect.borderRadius = 5;
        rect.color = Color.RGB(0,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(40);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        rect.filters = [dropShadow];
        this.appendChild(rect);

        const tm:TweenMovie = new TweenMovie(this.game);
        tm.tween(0,{
            target:{val:0},
            progress:(obj:{val:number})=>{
                 glow.setOuterStrength(obj.val);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });
        tm.tween(2000,{
            target:{val:5},
            progress:(obj:{val:number})=>{
                glow.setOuterStrength(obj.val);
            },
            time:2000,
            from:{val:5},
            to:{val:0}
        });
        tm.loop(true);
        this.addTweenMovie(tm);
    }

}
