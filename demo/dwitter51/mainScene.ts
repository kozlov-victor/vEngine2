import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Font} from "@engine/renderable/impl/general/font/font";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    private fnt:Font = Font.fromCssDescription(this.game,{fontFamily:'monospace',fontSize:32});

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    // https://www.dwitter.net/d/25359
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
        x.setFont(this.fnt);
        x.setPixelPerfect(true);
        // x.setDrawColor(Color.BLACK.asRGBNumeric());
        // x.setFillColor(Color.BLACK.asRGBNumeric());

        const w =1920,h=1080,r=16;
        let i:number,o:number,X:number,Y:number;
        const F=(t:number)=>Math.abs(~~((X*Y)/t));

        const __ = (col:string)=>{
            if (col.length>7) return col.substr(0,7);
            if (col.length<7) {
                const dif = 7 - col.length;
                const arr = new Array(dif).fill('0').join('');
                col+=arr
            }
            return col;
        }

        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            session.clear();


            for(i=0;i<w;i+=r) {
                for(o=0;o<h;o+=r) {
                    X=i-w/2;
                    Y=o-h/2;
                    x.setFillColor(ColorFactory.fromCSS(__('#'+F(t))));
                    session.drawRect(i,o,r,r);
                }
            }

        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

