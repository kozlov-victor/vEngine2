import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    @Resource.FontFromCssDescription({fontFamily:'monospace',fontSize:32})
    public readonly fnt:Font;

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    public override onReady():void {

        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(1);
        this.appendChild(surface);


        // u(t) is called 60 times per second.
        // t: Elapsed time in seconds.
        // S: Shorthand for Math.sin.
        // C: Shorthand for Math.cos.
        // T: Shorthand for Math.tan.
        // R: Function that generates rgba-strings, usage ex.: R(255, 255, 255, 0.5)
        // c: A 1920x1080 canvas.
        // x: A 2D context for that canvas.
        const S = Math.sin;
        const C = Math.cos;
        const T = Math.tan;
        //const c = this.surface;
        const x = this.surface;
        // tslint:disable-next-line:no-shadowed-variable
        const R = (r:number,g:number = r,b:number = g)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            return (r<<16)|(g<<8)|(b);
        };

        x.setLineWidth(1);
        x.setFont(this.fnt);
        x.setDrawColor(Color.BLACK.asRGBNumeric());
        x.setFillColor(Color.BLACK.asRGBNumeric());


        let w:number, i:number, e:number;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            session.clear();
            for(i=w=960;i>0;i--) {
                e=C(T(i)*3-S(t*6-C(t+i*9)-t)-t)-8;
                if (i===960) x.moveTo(w/2+w*C(i)/3,300-(C(i)*S(i)*3)/e*w);
                session.lineTo(w/2+w*C(i)/3,300-(C(i)*S(i)*3)/e*w);
            }
            session.completePolyline();
        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

