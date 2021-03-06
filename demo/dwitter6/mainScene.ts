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
        const R = (r:number,g:number,b:number)=>{
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            return (r<<16)|(g<<8)|(b);
        };

        let d,X,h,a,g1:number;

        this.renderScene = ()=>{

            const t = this.game.getElapsedTime() / 1000;

            x.drawBatch(batch=>{
                for(d=256;--d;)for(X=-32;++X<32;batch.drawRect(960+X*8e3/d,100+7e4/d-h,120,9))x.setFillColor(R(h=(C(a=d/9+t*6)+C(X/9+a/3))*35,g1=h+C(X^d)*6+90,g1/.8));
            });
        };
    }

    // https://www.dwitter.net/d/1978
    protected override onRender(): void {

        //this.surface.clear();

        this.renderScene();

    }
}
