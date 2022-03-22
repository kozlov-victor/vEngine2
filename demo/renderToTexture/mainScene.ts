import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {Color} from "@engine/renderer/common/color";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoLink:ITexture;

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        spr.addBehaviour(new DraggableBehaviour(this.game));

        const spr1:Image = new Image(this.game,this.logoLink);
        spr1.pos.fromJSON({x:100,y:100});
        spr1.addBehaviour(new DraggableBehaviour(this.game));

        spr.appendChild(spr1);


        const renderTarget:IRenderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,spr.size);
        const img = new Image(this.game,renderTarget.getTexture());
        img.filters = [new BlackWhiteFilter(this.game),new NoiseHorizontalFilter(this.game)];
        img.lineWidth = 5;
        img.color = Color.RGBA(100,200,11,100);
        img.borderRadius = 5;
        img.visible = false;
        img.visible = true;
        this.appendChild(img);
        img.scale.setXY(0.2);
        img.passMouseEventsThrough = true;

        const clearColor:Color = Color.NONE;
        this.setInterval(()=>{
            img.visible = false;
            spr.renderToTexture(renderTarget,clearColor);
            img.visible = true;
        },1);


    }

}
