import {Scene} from "@engine/scene/scene";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    private img1:Image;
    private img2:Image;

    @Resource.Texture('./assets/repeat.jpg')
    private link:ITexture;

    public override onReady():void {

        this.img1 = new Image(this.game,this.link);
        this.img1.size.setWH(100);
        this.img1.stretchMode = STRETCH_MODE.STRETCH;
        this.img1.borderRadius = 10;


        this.img2 = new Image(this.game,this.link);
        this.img2.pos.setXY(100,0);
        this.img2.size.setWH(600);
        this.img2.stretchMode = STRETCH_MODE.REPEAT;
        this.img2.borderRadius = 15;

        this.appendChild(this.img1);
        this.img1.addBehaviour(new DraggableBehaviour(this.game));

        this.appendChild(this.img2);
        this.img2.addBehaviour(new DraggableBehaviour(this.game));

    }

    public override onUpdate():void {
        this.img1.offset.x+=1;
        this.img1.offset.y+=.5;
    }

}
