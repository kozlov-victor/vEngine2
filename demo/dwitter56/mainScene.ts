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

        let j:number = 0,w:number,i:number = 0,u:number;
        let X:number,d:number,Y:number,r:number;

        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            session.clear();

            w=160;
            for(j=w;j--;) {
                for(i=w;i--;) {
                    X=i/w*5-2.5;
                    Y=j/w*5-1.4;
                    r=X*X+Y*Y;
                    d=r>t?r/39:C(r)/7;
                    u=(C(X/d+C(t)*9)*S(Y/d-t*9))**.1;
                    if (Number.isNaN(u)) continue;
                    session.drawRect(i,j,u,u);
                }
            }

        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

