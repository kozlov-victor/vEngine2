import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Font} from "@engine/renderable/impl/general/font/font";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    private fnt:Font = Font.fromCssDescription(this.game,{fontFamily:'monospace',fontSize:32});

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    // https://www.dwitter.net/d/25302
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

        x.setLineWidth(0);
        x.setFont(this.fnt);
        x.setPixelPerfect(true);
        // x.setDrawColor(Color.BLACK.asRGBNumeric());
        // x.setFillColor(Color.BLACK.asRGBNumeric());

        let i:number, w:number,m:number,z:number;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            x.clear();

            for(i=x.size.width|=w=128;i--;) {
                x.setFillColor(R(w+w*S(m=i+t*2),w+w*C(m),w+w*C(t*5+i)));
                session.drawRect(i,540+S(m)*(200-i/9.5)+S(i/200-t*3)*w,z=9+C(m)*9,z);
            }

        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

