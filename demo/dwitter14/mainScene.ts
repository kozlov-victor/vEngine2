import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:()=>void;

    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        surface.addBehaviour(new DraggableBehaviour(this.game));
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

            for(let i=9;i--;){
                x.drawArc(1e3+C(i/2)*t**3,500+S(i*3)*t**3,1e3-t*t,0,Math.PI*2)
            }

        };

    }

    // https://www.dwitter.net/d/18108
    protected onRender(): void {

        //this.surface.clear();

        this.renderScene();


    }
}

