import {Scene} from "@engine/model/impl/scene";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


export class MainScene extends Scene {

    private bg:Image;


    onPreloading() {
        this.bg = new Image(this.game);
        this.bg.setResourceLink(this.resourceLoader.loadImage('../assets/repeat.jpg'));
        this.bg.size.setWH(100);
        this.bg.borderRadius = 15;
        (window as any).bg = this.bg;
    }

    onReady() {
        this.appendChild(this.bg);
        this.bg.addBehaviour(new DraggableBehaviour(this.game));
    }

    onUpdate() {
        this.bg.offset.x+=1;
        this.bg.offset.y+=.5;
    }

}
