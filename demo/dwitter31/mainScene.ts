import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:(session:IDrawingSession)=>void;

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
        const R = (r:number,g:number,b:number)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            return (r<<16)|(g<<8)|(b);
        };

        x.setLineWidth(6);

        this.renderScene = ()=> {
            const t = this.game.getElapsedTime() / 1000 + 0.001;
            // https://www.dwitter.net/d/19794
            x.clear();
            let i,r,a:number;
            for(i=0;i<7;i+=.01){
                x.setLineWidth(8);
                r=(.5*S(5+i))*(.5*C(i-6))*2e3;
                a=i+S(r/99+t);
                if (i===0) x.moveTo(960+r*C(a),540+r*S(a));
                x.lineTo(960+r*C(a),540+r*S(a));
            }
        };
    }

    protected override onRender(): void {

        this.surface.drawBatch(this.renderScene);


    }
}

