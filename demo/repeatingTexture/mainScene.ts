import {Scene} from "@engine/core/scene";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/geometry/image";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";


export class MainScene extends Scene {

    private img1:Image;
    private img2:Image;


    public onPreloading() {
        this.img1 = new Image(this.game);
        this.img1.setResourceLink(this.resourceLoader.loadImage('./assets/repeat.jpg'));
        this.img1.size.setWH(100);
        this.img1.stretchMode = STRETCH_MODE.STRETCH;
        this.img1.borderRadius = 10;


        this.img2 = new Image(this.game);
        this.img2.pos.setXY(100,0);
        this.img2.setResourceLink(this.resourceLoader.loadImage('./assets/repeat.jpg'));
        this.img2.size.setWH(600);
        this.img2.stretchMode = STRETCH_MODE.REPEAT;
        this.img2.borderRadius = 15;

    }

    public onReady() {
        this.appendChild(this.img1);
        this.img1.addBehaviour(new DraggableBehaviour(this.game));

        this.appendChild(this.img2);
        this.img2.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onUpdate() {
        this.img1.offset.x+=1;
        this.img1.offset.y+=.5;
    }

}
