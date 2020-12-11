import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {Color} from "@engine/renderer/common/color";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";


export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading():void {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
    }


    public onReady():void {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        spr.addBehaviour(new DraggableBehaviour(this.game));

        const spr1:Image = new Image(this.game);
        spr1.setResourceLink(this.logoLink);
        spr1.pos.fromJSON({x:100,y:100});
        spr1.addBehaviour(new DraggableBehaviour(this.game));

        spr.appendChild(spr1);


        const renderTarget:IRenderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,spr.size);
        const img = new Image(this.game);
        img.filters = [new BlackWhiteFilter(this.game),new NoiseHorizontalFilter(this.game)];
        img.lineWidth = 5;
        img.color = Color.RGBA(100,200,11,100);
        img.borderRadius = 5;
        img.visible = false;
        img.setResourceLink(renderTarget.getResourceLink());
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
