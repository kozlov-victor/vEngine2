import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Font} from "@engine/renderable/impl/general/font/font";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    private fnt:Font = Font.fromCssDescription(this.game,{fontFamily:'monospace',fontSize:32});

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    // https://www.dwitter.net/d/26119
    public override onReady():void {

        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(0);
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
        const R = (r:number,g:number = 0,b:number = 0)=>{
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


        let s:number, h:number,i:number,w:number, m:number, a: number, p: number, v:number, b: number;
        let d:number = 0, Y = 0, X = 0;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;

            for(s=45,h=540,i=w=h*2;i--;) {
                x.setFillColor(ColorFactory.fromCSS(`hsl(${d*2+t*h},99%,${d}%`));
                session.drawRect(X,Y,s,s);
                for(d=0,m=6;m--;) {
                    a=960+S(p=m+t*5)*(v=S(p/9)*h);
                    d+=(5e5)/Math.hypot(a-(X=i%s*s),b-(Y=(i/s|0)*s))**2;
                    b=h+C(p)*v;
                }
            }



        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

