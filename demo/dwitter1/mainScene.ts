import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";

export class MainScene extends Scene {


    private surface:DrawingSurface;



    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(0);
        this.appendChild(surface);
    }

    protected onRender(): void {

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
        const R = (r:number,g:number,b:number = 0)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            return (r<<16)|(g<<8)|(b);
        };

        const n=20;
        const d=50;
        let k,j,s:number;
        for(let i=20;i<n*n;i++){
            k=i%n+1;j=(i-k)/n;s=.3*(j*k+n*n)+20+100*S(t/10);
            x.drawRect(480+d*j,d*k,d*S(s+t),d*C(s+t));
        }


    }
}
