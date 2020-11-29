import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    private surface:DrawingSurface;



    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(0);
        this.appendChild(surface);
        const c = new Color();
        c.setHSL(12,22,44);
        console.log(c.toJSON());
    }

    // https://www.dwitter.net/d/6318
    protected onRender(): void {

        //this.surface.clear();

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
        // tslint:disable-next-line:no-shadowed-variable
        const R = (r:number,g:number,b:number)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            return (r<<16)|(g<<8)|(b);
        };

        const v=32;
        let l,d,r:number;
        for(l=0;l<572;l++){
            d=l%v*v;
            x.setFillColor(Color.HSL((t*150-d%360),99,65).asRGBNumeric());
            x.drawRect(960+S(r=S(t-d/333)+l/v*.35)*d,540+C(r)*d,v,24);
        }



    }
}

