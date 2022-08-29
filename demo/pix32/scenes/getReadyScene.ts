import {BasePix32Scene} from "./base/basePix32Scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Tween} from "@engine/animation/tween";
import {GameScene} from "./gameScene";

export class GetReadyScene extends BasePix32Scene {

    @Resource.Texture('./pix32/resources/images/flag.png')
    public readonly flagLink:ITexture;

    override onReady():void {
        super.onReady();
        const getReady:Image = new Image(this.game,this.flagLink);
        getReady.pos.setXY(-12);
        this.screen.appendChild(getReady);
        getReady.transformPoint.setToCenter();
        this.addTween(new Tween(this.game,{
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
