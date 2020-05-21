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

    // https://codepen.io/8Observer8/pen/qxmboV
    public onReady() {

        this.colorBG.set(Color.BLACK);

        const graphics:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        this.appendChild(graphics);
        graphics.addBehaviour(new DraggableBehaviour(this.game));

        // Set the fill color
        graphics.setFillColor(0xe74c3c); // Red

        // Draw a circle
        graphics.drawCircle(60, 185, 40); // drawCircle(x, y, radius)


        // Set a new fill color
        graphics.setFillColor(0x3498db); // Blue

        // Draw an ellipse
        graphics.drawEllipse(170, 185, 45, 25); // drawEllipse(x, y, width, height)

        graphics.setFillColor(0x9b59b6); // Purple

        // Draw a rectangle
        graphics.drawRect(240, 150, 75, 75); // drawRect(x, y, width, height)

        graphics.setFillColor(0x2c3e50); // Dark blue gray 'ish

        // Draw a rectangle with rounded corners
        graphics.drawRoundedRect(350, 160, 75, 50, 10); // drawRoundedRect(x, y, width, height, radius)

        graphics.setFillColor(0xf1c40f); // Yellow

        // Draw a polygon to look like a star
        graphics.drawPolygon([
            550, 100, // Starting x, y coordinates for the star
            570, 150, // Star is drawn in a clockwork motion
            630, 155,
            585, 195,
            600, 250,
            550, 220,
            500, 250,
            515, 195,
            470, 155,
            530, 150
        ]);


    }
}
