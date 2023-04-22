import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    // https://www.dwitter.net/d/25472
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

        x.setLineWidth(0);
        x.setPixelPerfect(true);
        x.scale.setXY(2,1);

        this.backgroundColor = Color.BLACK;

        const z:number = 400;
        let i:number,Y:number;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            session.clear();

            for(i=0;++i<3e4;) {
                Y=i*i/5e7;
                x.setFillColor(R(Y*5,Y*16, 0));
                session.drawRect(200+(i%z-200)*Y,90+Y*9+C(30/Y+t*3)*S(i%z/9)*Y*7^1,Y,z);
                x.setFillColor(Color.WHITE);
                session.drawRect(i*i%z+T(i+t/50)*9,i-9,S(i+t*9),1);
            }

        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

