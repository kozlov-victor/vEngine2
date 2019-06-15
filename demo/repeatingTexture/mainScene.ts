import {Scene} from "@engine/model/impl/general/scene";
import {Image} from "@engine/model/impl/geometry/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


export class MainScene extends Scene {

    private bg:Image;


    public onPreloading() {
        this.bg = new Image(this.game);
        this.bg.setResourceLink(this.resourceLoader.loadImage('../assets/repeat.jpg'));
        this.bg.size.setWH(100);
        this.bg.borderRadius = 15;
        (window as any).bg = this.bg;
    }

    public onReady() {
        this.appendChild(this.bg);
        this.bg.addBehaviour(new DraggableBehaviour(this.game));
    }

    public onUpdate() {
        this.bg.offset.x+=1;
        this.bg.offset.y+=.5;
    }

}
