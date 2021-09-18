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
        // x.setDrawColor(Color.BLACK.asRGBNumeric());
        // x.setFillColor(Color.BLACK.asRGBNumeric());

        this.backgroundColor = Color.fromCssLiteral('#04290e');

        const a = Math.abs;
        let y:number,i:number,n:number,m:number,k:number;
        const f = (t:number,i:number)=>{
            return S(t+y/255*C(t)+i*1.57)*120;
        }
        const size = x.size.width;
        this.renderScene = (session)=> {
            const t = this.game.getElapsedTime() / 1000;
            session.clear();
            for(y=size;y>0;y-=25) {
                for(i=4;i--;) {
                    n=f(t,i);
                    m=f(t,i+1);
                    let color = ~~(i%2?k:99-k) as byte;
                    if (color>255 - 40) color = (255 - 40) as byte;
                    x.setFillColor(Color.from({r:color,g:(color+40) as byte,b:color}));
                    n-m<5&&x.drawRect(n+f(t,y/255)+940,y,k=m-n,24);
                }
            }
        };
    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }


}

