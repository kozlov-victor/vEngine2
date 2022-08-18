import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:(session:IDrawingSession)=>void;

    public override onReady():void {
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

        this.surface.setLineWidth(5);
        x.transformTranslate(960,590);

        this.renderScene = ()=>{
            const t = this.game.getElapsedTime() / 1000;

            // https://www.dwitter.net/d/19618

            x.clear();
            x.transformSave();
            for(let q=21;q--;){
                x.transformRotateZ(t/3);
                x.setFillColor(R(0,255-12*q,0));
                let a,b:number;
                x.drawRect(a=20*q,a,b=100*q,b);
            }
            x.transformRestore();

        };

    }

    // https://www.dwitter.net/d/18108
    protected override onRender(): void {

        this.surface.drawBatch(this.renderScene);


    }
}

