import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Size} from "@engine/geometry/size";

export class MainScene extends Scene {


    private surface:DrawingSurface;



    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
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

        // https://www.dwitter.net/d/8876

        let j,h,v = 0,z:number;

        for(j=20,h=96;h--;) {
            for(v=54;v--;) {
                x.setFillColor(R(z=(T(t-h*v)+1)*j,z/2,z*4));
                x.drawRect(h*j,v*j,j,j);
            }
        }




    }
}
