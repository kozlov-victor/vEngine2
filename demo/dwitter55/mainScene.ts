import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Font} from "@engine/renderable/impl/general/font/font";

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


        const w = 218;
        let m:number, _T:number, d:number, j: number, i: number;
        let Y:number = 0, X:number = 0, r:number;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;

            const _t = t/2;
            session.clear();

            for(m=3e4;m--;_T=S(X/d-_t*16)*C(Y/d)) {
                r=(X=i/w*4-2)*X+(Y=j/w*4-1.1)*Y;
                d=r>1?S(_t*4%3)/5-.4:C(r)/9;
                j=m/w;
                i=m%w;
                const ww = _T**.1;
                if (Number.isNaN(ww)) continue;
                session.drawRect(i,j,ww,2);
            }

        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

