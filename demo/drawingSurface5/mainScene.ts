import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    public onPreloading() {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    // http://scottmcdonnell.github.io/pixi-examples/index.html?s=basics&f=graphics.js&title=Graphics
    public onReady() {

        this.colorBG.set(Color.BLACK);

        const graphics:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(graphics);
        graphics.addBehaviour(new DraggableBehaviour(this.game));

        // set a fill and line style
        graphics.setFillColor(0xFF3300);
        graphics.setLineWidth(4);
        graphics.setDrawColor(0xffd900);

        // draw a shape
        graphics.drawPolygon([50,50,250, 50,100, 100,50, 50]);

        // set a fill and a line style again and draw a rectangle
        graphics.setDrawColor(0x0000FF);
        graphics.setFillColor(0xFF700B);
        graphics.drawRect(50, 250, 120, 120);

        // draw a rounded rectangle
        graphics.setDrawColor( 0xFF00FF);
        graphics.setFillColor(0xFF00BB, 63);
        graphics.drawRoundedRect(150, 450, 300, 100, 15);

        // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphics.setLineWidth(0);
        graphics.setFillColor(0xFFFF0B,127);
        graphics.drawCircle(470, 90,60);




        // const rect:Rectangle = new Rectangle(this.game);
        // rect.size.setWH(300,300);
        // rect.fillColor = Color.RGB(222,122,2,20);
        // graphics.drawModel(rect);


    }
}
