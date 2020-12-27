import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:(session:IDrawingSession)=>void;

    public onReady():void {
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

        this.surface.setLineWidth(1);

        this.surface.setFillColor(Color.RGB(0,0,122).asRGBNumeric());

        this.renderScene = (session)=>{
            const t = this.game.getElapsedTime() / 1000;

            // https://www.dwitter.net/d/19605
            this.surface.clear();
            for (let j = 4; j--;) {
                for (let i = 96; i--;) {
                    let d:number;
                    const u = (d = (i + ((-1) ** j) * t % 2) / 15) % 1;
                    const k = Math.floor(d);
                    let c:number;
                    x.setFillColor(R(c = i % 2 * 255, c, c));
                    let a,A:number;
                    session.drawArc((2 * k - 1 - C(a = (-1) ** k * u * 3.14)) * (A = 200), 2 * A * (3 - j) + S(a) * A, A, 0, 7);
                }
            }

        };

    }

    // https://www.dwitter.net/d/18108
    protected onRender(): void {

        this.surface.drawBatch(this.renderScene);


    }
}

