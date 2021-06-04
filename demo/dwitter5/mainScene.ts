import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";

export class MainScene extends Scene {


    private surface:DrawingSurface;



    public override onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(0);
        this.appendChild(surface);
    }

    // https://www.dwitter.net/d/1420
    protected override onRender(): void {

        this.surface.clear();

        // u(t) is called 60 times per second.
        // t: Elapsed time in seconds.
        // S: Shorthand for Math.sin.
        // C: Shorthand for Math.cos.
        // T: Shorthand for Math.tan.
        // R: Function that generates rgba-strings, usage ex.: R(255, 255, 255, 0.5)
        // c: A 1920x1080 canvas.
        // x: A 2D context for that canvas.
        const t = this.game.getCurrentTime() / 1000;
        const S = Math.sin;
        const C = Math.cos;
        const T = Math.tan;
        const c = this.surface;
        const x = this.surface;
        const R = (r:number,g:number,b:number)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            return (r<<16)|(g<<8)|(b);
        };

        let i,d,p:number;
        c.size.width^=0;

        x.drawBatch(batch=>{
            for(i=5e3;p=3*t+T(t/2)*i/2e3+i%4*2,i-=5;x.setFillColor(0xFF0000)) {
                d=C(p)-S(p);
                // tslint:disable-next-line:no-unused-expression
                d>0&&batch.drawRect(960+199*S(p)+249*C(t+i/9e4),i/4,99*d,9);
            }
        });

    }
}
