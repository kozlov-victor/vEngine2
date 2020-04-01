import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Color} from "@engine/renderer/common/color";
import {BrightessContrastFilter} from "@engine/renderer/webGl/filters/texture/brightessContrastFilter";
import {TriangleBlurFilter} from "@engine/renderer/webGl/filters/texture/triangleBlurFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void;

    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(15);
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
        const c = this.surface;
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


        this.renderScene = ()=>{
            const t = this.game.getElapsedTime() / 1000;

            let i:number, r: number;

            for(i=99;i--;) {
                x.setDrawColor(Color.HSL(i/.275,59,40).asRGBNumeric());
                x.drawArc(960+C(r=i/99*6.28+(t&1?t:-t))*t*99,540+S(r)*t*99,t*5,0,7);
            }

        };

        const bcf = new BrightessContrastFilter(this.game);
        bcf.setContrast(10);
        this.filters = [bcf, new TriangleBlurFilter(this.game)];

    }

    // https://www.dwitter.net/d/18108
    protected onRender(): void {

        //this.surface.clear();

        this.renderScene();


    }
}

