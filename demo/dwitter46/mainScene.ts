import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    private fnt:Font = Font.fromCssDescription(this.game,{fontFamily:'monospace',fontSize:32});

    private renderScene:(session:IDrawingSession)=>void = ():void=>{};

    public override onReady():void {

        this.mouseEventHandler.on(MOUSE_EVENTS.click, _=>{
            this.game.getRenderer<WebGlRenderer>().requestFullScreen();
        });

        // https://www.dwitter.net/d/23732
        // https://www.dwitter.net/d/23826

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
        //const T = Math.tan;
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

        this.backgroundColor = Color.fromCssLiteral('#04290e');


        let z:number, w:number, m:number,r: number,a:number,X:number;
        let b:number,Y:number;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            //session.clear();
            z=w=x.size.width;
            for(m=2e4;m--;r=(a=X/45-2)*a+(b=Y/45-1)*b,z=S(b*2*r+t)-C(a*2-t*4)) {
                x.setFillColor(R(z**5,z**6));
                session.drawRect(X=m%w,Y=m/w,z*2,z*2);
            }
        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

