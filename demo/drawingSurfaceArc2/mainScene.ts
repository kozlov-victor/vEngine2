import {Scene} from "@engine/scene/scene";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Size} from "@engine/geometry/size";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    protected renderScene:()=>void;

    // https://stackoverflow.com/questions/33622680/javascript-canvas-animated-arc
    public onReady() {
        const surface:DrawingSurface = new DrawingSurface(this.game,new Size(300,300));
        surface.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(surface);
        surface.setLineWidth(1);
        surface.setFillColor(0,0,0,255);
        surface.setDrawColor(0,0,0,255);

        const PI=Math.PI;
        const cx=surface.size.width/2;
        const cy=surface.size.height/2;
        const radius=surface.size.width/2-30;
        let angle=0;
        let direction=1;

        this.renderScene = ()=>{
            surface.clear();
            angle+=PI/40;
            if(angle<0 || angle>PI*2){
                angle=0;
                direction*=-1;
            }
            const counterclockwise=(direction>0)?false:true;
            const s=-Math.PI/2;
            const e=angle-Math.PI/2;
            console.log({s,e,counterclockwise});
            surface.drawArc(cx,cy,radius,s,e,counterclockwise);
        };

        this.on(MOUSE_EVENTS.click, e=>{
            this.renderScene();
        });

    }


    protected onRender(): void {
        //this.renderScene();
    }
}
