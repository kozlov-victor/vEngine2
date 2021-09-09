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

    // https://www.dwitter.net/d/10062
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
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            return (r<<16)|(g<<8)|(b);
        };

        x.setLineWidth(15);

        x.drawBatch(batch=>{
            for(let i=0;i<1920;i++) {
                if (i===0) batch.moveTo(i,400+S(t+i/127)*200);
                batch.lineTo(i,400+S(t+i/127)*200);
            }
            batch.completePolyline();
        });


    }
}
