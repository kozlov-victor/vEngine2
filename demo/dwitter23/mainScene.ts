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

        this.surface.setLineWidth(10);

        this.surface.setFillColor(Color.RGB(0,0,122).asRGBNumeric());

        let Y:number;
        const X = Y = 200;
        const Q:any[] = [];
        for (let i = 999; i--;) Q.push({x: i * 2, y: S(i * i) * 500 + 540});

        this.renderScene = (session)=>{
            const t = this.game.getElapsedTime() / 1000;

            // https://www.dwitter.net/d/19582

            let a:number;
            for (const o of Q) {
                session.drawArc(o.x, o.y, 2, 0, t);
                a = Math.atan2(960 - o.x, 540 - o.y);
                o.x += S(a * 2);
                o.y += C(a * 2);
            }

        };

    }

    // https://www.dwitter.net/d/18108
    protected onRender(): void {

        this.surface.drawBatch(this.renderScene);


    }
}

