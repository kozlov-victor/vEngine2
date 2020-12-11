import {BasePix32Scene} from "./base/basePix32Scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {Tween} from "@engine/animation/tween";
import {GameScene} from "./gameScene";

export class GetReadyScene extends BasePix32Scene {

    @Resource.Texture('./pix32/resources/images/flag.png')
    private flagLink:ResourceLink<ITexture>;

    onReady():void {
        super.onReady();
        const getReady:Image = new Image(this.game);
        getReady.setResourceLink(this.flagLink);
        getReady.pos.setXY(-12);
        this.screen.appendChild(getReady);
        getReady.transformPoint.setToCenter();
        this.addTween(new Tween({
            target: getReady.scale,
            from: {x:1,y:1},
            to: {x:0.3,y:0.3},
            time: 2000,
            loop: true,
            numOfLoops: 3,
            yoyo: true,
            complete:()=>{
               this.game.runScene(new GameScene(this.game));
            },
        }));
    }

}
