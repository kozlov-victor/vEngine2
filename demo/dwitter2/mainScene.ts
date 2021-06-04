import {Scene} from "@engine/scene/scene";
import {DrawingSurface, IDrawingSession} from "@engine/renderable/impl/surface/drawingSurface";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Point2d} from "@engine/geometry/point2d";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {


    private surface:DrawingSurface;
    private renderScene:(session:IDrawingSession)=>void;
    private lastPoint:Point2d = new Point2d();

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        const surface:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        surface.setLineWidth(1);
        this.surface = surface;
        surface.setLineWidth(1);
        this.appendChild(surface);
    }

    public override onReady():void {

        this.renderScene = (session)=> {
            session.clear();
            const t = this.game.getCurrentTime() / 1000;
            const S = Math.sin;
            const C = Math.cos;
            const T = Math.tan;
            const c = this.surface;
            const x = this.surface;

            let i,j,v,d,p:number;

            const e = this.lastPoint;

            c.size.width|=0;for(i=0;i<3e3;i+=50)for(j=0;j<2e3;j+=50){v=e.x*3-j;d=e.y*3.4-i;p=2e-3*(d*d+v*v)**.5;session.drawRect(i+d*p,j+v*p,9,9);}
        };

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, (e)=>{
            this.lastPoint.setXY(e.sceneX,e.sceneY);
        });

    }

    protected override onRender(): void {
        this.surface.drawBatch(this.renderScene);
    }

}
