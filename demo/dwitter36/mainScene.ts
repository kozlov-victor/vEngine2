import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    @Resource.FontFromCssDescription({fontFamily:'serif',fontSize:12,chars:['❄']})
    public readonly fnt:Font;

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    public override onReady():void {

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

        this.renderScene = (session)=> {

            const t = this.game.getElapsedTime() / 1000;

            // https://www.dwitter.net/d/19473

            x.clear();
            let w,j,i,q,k,e,p:number;

            for(w=300,j=i=1,q=65537,p=k=255;i++<w;j=j*75%q,k=k*75%q) {
                x.alpha=e=C(t+i*5);
                session.drawText('❄',e*75+w*j/q,(t*k/p+w*k/q)%w);
            }
        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

