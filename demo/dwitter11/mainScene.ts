import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void;



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

        this.renderScene = ()=>{
            const t = this.game.getCurrentTime() / 1000;

            let j,a,m,q:number;

            x.drawBatch(batch=>{
                for(j=2e3;j--;batch.drawRect(99+9*S(a=j/1250)*S(j)+50*S(m=t*3+a),75+25*(S(-a*5)+1)*C(j),3,7)) {
                    q=(j&128)-C(j)**3*99;
                    x.setFillColor(R(q,q,q));
                }
            });

        };

    }

    // https://www.dwitter.net/d/6331
    protected override onRender(): void {

        this.surface.clear();

        this.renderScene();


    }
}

