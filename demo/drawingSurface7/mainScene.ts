import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Font} from "@engine/renderable/impl/general/font/font";

export class MainScene extends Scene {

    private fnt:Font = Font.fromCssDescription(this.game,{fontFamily:'monospace',fontSize:20});

    public override onReady():void {

        this.backgroundColor.set(Color.BLACK);

        const graphics:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(graphics);
        graphics.addBehaviour(new DraggableBehaviour(this.game));
        graphics.setFont(this.fnt);
        graphics.setDrawColor(0xe74c3c);


        this.setInterval(()=>{
            graphics.clear();
            graphics.transformRotateZ(0.01);
            graphics.drawText("test 123",40,20);
        },10);



    }
}
