import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    @Resource.Font({fontFamily:'monospace',fontSize:25,extraChars:['🐦']})
    private fnt:Font;

    private renderScene:()=>void = ():void=>{};

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
            // https://www.dwitter.net/d/19573
            x.clear();

            for(let i:number=40;i--;) {
                x.drawText(i%2?`🐦 @Celebrity${String.fromCharCode(65+i)}`:"Send BTC here & get 2x back!",20,(i+t*t/9)*20%800);
            }
        };
    }

    protected onRender(): void {
        this.renderScene();
    }


}

