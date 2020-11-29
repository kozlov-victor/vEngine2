import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {


    private surface:DrawingSurface;



    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.surface = surface;
        this.appendChild(surface);

        this.on(MOUSE_EVENTS.mouseMove, (e)=>{
            this.surface.clear();
            const t = this.game.getCurrentTime() / 1000;
            const S = Math.sin;
            const C = Math.cos;
            const T = Math.tan;
            const c = this.surface;
            const x = this.surface;

            let i,j,v,d,p:number;

            c.size.width|=0;for(i=0;i<3e3;i+=50)for(j=0;j<2e3;j+=50){v=e.screenY*3-j;d=e.screenX*3.4-i;p=2e-3*(d*d+v*v)**.5;x.drawRect(i+d*p,j+v*p,9,9);}

        });

    }

}
