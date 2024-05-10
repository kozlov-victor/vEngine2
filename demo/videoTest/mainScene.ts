import {Scene} from "@engine/scene/scene";
import {Video} from "@engine/renderable/impl/general/image/video";

export class MainScene extends Scene {

    public override async onReady():Promise<void> {
        const video = new Video(this.game);
        await video.setSource('movie.mp4');
        video.anchorPoint.setToCenter();
        video.pos.setXY(this.game.width/2,this.game.height/2);
        video.appendTo(this);
    }
}
