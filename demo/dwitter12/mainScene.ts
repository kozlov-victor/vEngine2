import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void;



    // https://www.dwitter.net/d/9060
    public override onReady():void {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
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

        let j,y,b;
        x.setFillColor(Color.BLACK.asRGBNumeric());
        x.setLineWidth(0);
        this.renderScene = ()=>{
            const t = this.game.getElapsedTime() / 1000;

            x.drawBatch(batch=>{
                for(j=100;j--;)for(y=100;y--;) {
                    x.setFillColor(R(b=(t*99+(S(t)*(j-51)+C(t)*(y-50)^S(t)*(y-51)-C(t)*(j-50)))%99*2,b,b));
                    batch.drawRect(j*9+510,y*9,9,9);
                }
            });


        };

    }

    // https://www.dwitter.net/d/6331
    protected override onRender(): void {

        //this.surface.clear();

        this.renderScene();


    }
}

