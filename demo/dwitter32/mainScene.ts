import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font";

export class MainScene extends Scene {


    private surface:DrawingSurface;

    @Resource.Font({fontFamily:'monospace',fontSize:10})
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
        const R = (r:number,g:number,b:number)=>{
            if (r>255) r = 255;
            if (g>255) g = 255;
            if (b>255) b = 255;
            if (r<0) r = 0;
            if (g<0) g = 0;
            if (b<0) b = 0;
            return (r<<16)|(g<<8)|(b);
        };

        x.setLineWidth(6);
        x.setFont(this.fnt);

        const a=[68,87,73,84,84,69,82];
        this.renderScene = ()=> {
            const t = this.game.getElapsedTime() / 1000;
            // https://www.dwitter.net/d/19692
            x.clear();
            for(let i:number=7;i--;){
                x.drawText(String.fromCharCode(a[i]+19**S(t-i/9)),20+9*i,30);
            }
        };
    }

    protected onRender(): void {
        this.renderScene();
    }


}

