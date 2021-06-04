import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextureQuad} from "@engine/renderable/impl/geometry/textureQuad";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    public override onReady():void {
        const quad = new TextureQuad(this.game,this.logoTexture);
        quad.pos.setXY(10,10);

        const topLeft = new Circle(this.game);
        topLeft.pos.setXY(0,0);
        quad.appendChild(topLeft);
        topLeft.addBehaviour(new DraggableBehaviour(this.game));
        topLeft.pos.observe(()=>{
            quad.topLeft.setXY(topLeft.pos.x-quad.pos.x,topLeft.pos.y-quad.pos.y);
        });

        const bottomLeft = new Circle(this.game);
        bottomLeft.pos.setXY(0,quad.size.height);
        quad.appendChild(bottomLeft);
        bottomLeft.addBehaviour(new DraggableBehaviour(this.game));
        bottomLeft.pos.observe(()=>{
            quad.bottomLeft.setXY(bottomLeft.pos.x-quad.pos.x,bottomLeft.pos.y-quad.pos.y);
        });

        const topRight = new Circle(this.game);
        topRight.pos.setXY(quad.size.width,0);
        quad.appendChild(topRight);
        topRight.addBehaviour(new DraggableBehaviour(this.game));
        topRight.pos.observe(()=>{
            quad.topRight.setXY(topRight.pos.x-quad.pos.x,topRight.pos.y-quad.pos.y);
        });

        const bottomRight = new Circle(this.game);
        bottomRight.pos.setXY(quad.size.width,quad.size.height);
        quad.appendChild(bottomRight);
        bottomRight.addBehaviour(new DraggableBehaviour(this.game));
        bottomRight.pos.observe(()=>{
            quad.bottomRight.setXY(bottomRight.pos.x-quad.pos.x,bottomRight.pos.y-quad.pos.y);
        });

        this.appendChild(quad);
    }

}
