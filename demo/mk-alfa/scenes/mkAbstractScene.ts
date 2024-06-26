import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {fontLoader} from "../../fontTtf/FontLoader";
import {TaskQueue} from "@engine/resources/taskQueue";
import loadFont = fontLoader.loadFont;

export abstract class MkAbstractScene extends Scene {

    public override onPreloading(taskQueue:TaskQueue): void {
        this.backgroundColor.setFrom(Color.BLACK);
        loadFont(this.game,taskQueue,'./mk-alfa/assets/fonts/MK4.TTF','MK4');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(22,222,12);
        rect.size.height = 50;
        rect.pos.setY(this.game.size.height - rect.size.height);
        this.preloadingGameObject = rect;
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady(): void {

    }

}
