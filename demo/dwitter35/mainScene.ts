import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void = ():void=>{};

    @Resource.Font('serif',120)
    private fnt:Font;

    public onReady() {

        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        surface.setLineWidth(1);
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
        //const c = this.surface;
        const x = this.surface;
        // tslint:disable-next-line:no-shadowed-variable
        const R = (r:number,g:number = r,b:number = g)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            return (r<<16)|(g<<8)|(b);
        };

        x.setLineWidth(1);
        x.setFont(this.fnt);

        this.renderScene = ()=> {
            const t = this.game.getElapsedTime() / 1000;
            // https://www.dwitter.net/d/19557

            const h=560
            const w=h*4
            const a=T(t+2)*99
            const P=T(t)*10+h
            x.setDrawColor(R(a,a/3,a),100);
            x.drawText(w,P,P);
            x.setDrawColor(R(h,h,h),3/h);
            x.drawText(0,0,w);
        }
    }

    protected onRender(): void {
        this.renderScene();
    }


}
