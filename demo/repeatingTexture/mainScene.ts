import {Scene} from "@engine/model/impl/scene";
import {Image} from "@engine/model/impl/ui/drawable/image";


export class MainScene extends Scene {

    private bg:Image;
    private imgResourceLink;



    onPreloading() {
        this.bg = new Image(this.game);
        this.bg.setResourceLink(this.resourceLoader.loadImage('../assets/repeat.jpg'));
        this.bg.width = 100;
        this.bg.height = 100;
        this.bg.borderRadius = 15;
    }

    onReady() {
        this.appendChild(this.bg);
    }

    onUpdate() {
        this.bg.offset.x+=1;
        this.bg.offset.y+=.5;
    }

}
