import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Font} from "@engine/renderable/impl/general/font/font";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    private fnt:Font = Font.fromCssDescription(this.game,{fontFamily:'monospace',fontSize:32});

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    // https://www.dwitter.net/new
    public override onReady():void {

        const surface:DrawingSurface = new DrawingSurface(this.game,{width:300,height:this.game.height});
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
        x.scale.setXY(5);
        // x.setDrawColor(Color.BLACK.asRGBNumeric());
        // x.setFillColor(Color.BLACK.asRGBNumeric());

        let i:number, a: number = 0, z:number, b:number;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            session.clear();

            for(i=z=300;i--;) {
                session.drawRect(140+a*i+C(t*9)*30,90+i*(S(t*9%3.1)/9+.3),i,i/z);
                a=T(z^z/i+t*4);
                x.setFillColor(R(b=a*z,S(b)*z,T(b)*z));
            }

        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

