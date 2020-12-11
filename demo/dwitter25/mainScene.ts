import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void;

    public onReady():void {
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
        const R = (r:number,g:number,b:number)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            return (r<<16)|(g<<8)|(b);
        };

        this.surface.setLineWidth(0);

        x.transformTranslate(960,540);

        this.renderScene = ()=>{
            const t = this.game.getElapsedTime() / 1000;

            //https://www.dwitter.net/d/16971

            //x.transformSave();

            let V,s:number;
            x.setFillColor(R(V=C(t*9)*99+99,C(V)*99,99-V),100);
            x.drawRect(s=59*t%6e2,s,s,s);
            x.transformRotateZ(S(t*2)/s*3);
            x.drawRect(s,s,s,s);

            //x.transformRestore();

        };

    }

    // https://www.dwitter.net/d/18108
    protected onRender(): void {

        //this.surface.clear();

        this.renderScene();


    }
}

