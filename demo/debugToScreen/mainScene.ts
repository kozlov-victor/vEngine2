import {Scene} from "@engine/scene/scene";
import {Rect} from "@engine/geometry/rect";

export class MainScene extends Scene {

    public onReady() {
        this.game.log(null,undefined,{test:42});
        this.game.log('test log');
        this.game.log(document);
        this.game.log(document.body);
        this.game.log(this);
        this.game.log(this.getDefaultLayer());
        this.game.log(Number);
        this.game.log(new Rect());

        this.setInterval(()=>{
            this.game.log(this.game.getTime());
        },1000);
    }

}
