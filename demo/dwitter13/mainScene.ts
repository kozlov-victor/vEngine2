import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void;

    public onReady() {
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

        let p,a,i,b,y,z,j:number;
        x.setFillColor(Color.BLACK.asRGBNumeric());
        this.renderScene = ()=>{
            const t = this.game.getElapsedTime() / 1000;

            p=Math.PI*2;
            a=960;
            b=535;
            for(i=0;i<a;i+=10){
                for(j=0;j<b;j+=10) {
                    x.drawRect(a+a/7*S((y=i/a*p)+S(t))*(z=j/b*p),b+b/2*S(z)*C(y+t),9,9);
                }
            }
        };

    }

    // https://www.dwitter.net/d/5689
    protected onRender(): void {

        this.surface.clear();

        this.renderScene();


    }
}

