import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";
import {Color} from "@engine/renderer/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {DropShadowFilter} from "@engine/renderer/webGl/filters/texture/dropShadowFilter";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderer/linearGradient";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {ITexture} from "@engine/renderer/texture";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');

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
        polyline.borderRadius = 2;
        polyline.setSvgPath(`
        M49.5,195 C50.5,195 50.690277099609375,194.1184844970703 52.5,191 C53.622344970703125,189.06600952148438 55.1173095703125,186.9238739013672 55.5,186 C57.12359619140625,182.08030700683594 59.439178466796875,178.97525024414062 61.5,174 C64.4144287109375,166.9639434814453 66.64773559570312,162.0565948486328 68.5,157 C69.58767700195312,154.03067016601562 72.5,150 74.5,145 C76.5,140 80.47250366210938,136.35250854492188 81.5,132 C81.95950317382812,130.05349731445312 82.75650024414062,129.2030029296875 83.5,128 C85.16250610351562,125.31001281738281 85.5,123 87.5,121 C89.5,119 90.214111328125,116.788330078125 92.5,114 C94.29318237304688,111.81265258789062 96.11065673828125,109.84072875976562 97.5,107 C99.0841064453125,103.76107788085938 101.84619140625,104.29454040527344 103.5,102 C104.80746459960938,100.18600463867188 105.35272216796875,98.826904296875 106.5,98 C108.31399536132812,96.69255065917969 109.32376098632812,96.51374816894531 111.5,96 C113.44650268554688,95.54049682617188 114.5,95 116.5,95 C118.5,95 120.5,95 121.5,95 C122.5,95 125.24673461914062,95.371337890625 129.5,98 C131.402099609375,99.17556762695312 133.5,101 137.5,103 C139.5,104 142.5,106 145.5,109 C149.5,113 152.22650146484375,116.29362487792969 156.5,120 C160.27728271484375,123.27601623535156 163.17947387695312,125.57110595703125 165.5,130 C166.96762084960938,132.80108642578125 169.77432250976562,136.8849639892578 170.5,139 C172.15481567382812,143.82302856445312 173.48690795898438,145.75711059570312 174.5,152 C174.66018676757812,152.98709106445312 175.99346923828125,154.87855529785156 176.5,158 C176.98056030273438,160.9612579345703 176.5,163 176.5,167 C176.5,170 176.5,178 176.5,183 C176.5,186 176.89306640625,192.8182373046875 173.5,197 C171.22824096679688,199.79983520507812 169.5,202 167.5,204 C164.5,207 160.15542602539062,210.74282836914062 156.5,216 C153.17120361328125,220.78738403320312 148.8076171875,225.41091918945312 145.5,230 C144.19253540039062,231.81399536132812 136.89028930664062,237.55914306640625 128.5,243 C119.86166381835938,248.60171508789062 116.423095703125,248.7314453125 112.5,250 C102.25210571289062,253.31369018554688 95.5924072265625,256.414794921875 87.5,258 C80.56082153320312,259.3592834472656 71.5,259 64.5,259 C61.5,259 57.42156982421875,258.21014404296875 54.5,257 C52.43414306640625,256.144287109375 49.5,255 48.5,254 C45.5,251 43.785888671875,248.788330078125 41.5,246 C38.810211181640625,242.718994140625 37.5,241 36.5,240 C35.5,239 35.5,238 34.5,237 C32.5,235 31.5,233 29.5,231 C28.5,230 27.2030029296875,227.38616943359375 24.5,225 C22.82366943359375,223.52017211914062 20.5,221 19.5,219 C18.5,217 16.5,215 14.5,213 C13.5,212 12.5,212 11.5,211 C9.5,209 7.2012939453125,208.0514678955078 5.5,207 C3.597900390625,205.82443237304688 3.5,205 2.5,204 C2.5,204 2.20709228515625,204.7071075439453 1.5,204 C0.79290771484375,203.2928924560547 1.5,203 1.5,203 C0.5,202 0.5,202 1.5,201 C1.5,201 1.5,200 1.5,200 C2.5,199 3.193450927734375,197.54119873046875 4.5,197 C6.347747802734375,196.23463439941406 8.323760986328125,195.5137481689453 10.5,195 C12.446502685546875,194.54049682617188 14.323760986328125,192.5137481689453 16.5,192 C18.446502685546875,191.54049682617188 19.323760986328125,190.5137481689453 21.5,190 C23.446502685546875,189.54049682617188 25.5,189 27.5,189 C28.5,189 30.5,188 31.5,188 C32.5,188 34.5,188 34.5,188 C36.5,187 37.5,187 37.5,187 C38.5,187 38.5,187 39.5,187 C40.5,187 40.5,186 41.5,186 C41.5,186 41.5,186 41.5,186 C42.5,186 42.95880126953125,185.6934356689453 43.5,187 C43.8826904296875,187.9238739013672 43.5,188 43.5,189 C43.5,190 43.5,190 43.5,190 C43.5,191 43.5,191 43.5,192 C43.5,192 44.5,192 44.5,192 C44.5,193 44.5,193 44.5,193 C45.5,194 45.5,194 46.5,194 C46.5,194 47.5,194 47.5,194 C47.5,194 48.5,194 48.5,194 C48.5,194 49.5,194 49.5,194 C49.5,194 50.5,194 50.5,194 C50.5,194 51.5,194 51.5,193 C51.5,193 51.5,192 52.5,191 C52.5,191 52.5,191 53.5,190 L53.5,190 
        `);

        polyline.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(polyline);

        const polygon:Polygon = new Polygon(this.game);
        polygon.fromPolyline(polyline);
        polygon.fillColor = Color.RGB(100,33,122);
        polyline.appendChild(polygon);

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
        rect.size.setWH(120);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        rect.filters = [dropShadow];
        this.appendChild(rect);

        const tm:TweenMovie = new TweenMovie(this.game);
        tm.addTween(0,{
            target:{val:0},
            progress:(obj:{val:number})=>{
                 glow.setOuterStrength(obj.val);
            },
            time:2000,
            from:{val:0},
            to:{val:5}
        });
        tm.addTween(2000,{
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
