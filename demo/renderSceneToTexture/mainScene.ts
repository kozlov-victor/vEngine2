import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvent";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoLink:ITexture;


    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyHold, (e:IKeyBoardEvent)=>{
            switch (e.button) {
                case KEYBOARD_KEY.LEFT:
                    spr.pos.addX(-1);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    spr.pos.addX(1);
                    break;
                case KEYBOARD_KEY.UP:
                    spr.pos.addY(-1);
                    break;
                case KEYBOARD_KEY.DOWN:
                    spr.pos.addY(1);
                    break;
                case KEYBOARD_KEY.R:
                    spr.angle+=0.1;
                    break;
            }
        });


        const renderTarget:IRenderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,this.size);
        const img = new Image(this.game,renderTarget.getTexture());
        img.filters = [new BlackWhiteFilter(this.game),new NoiseHorizontalFilter(this.game)];
        img.lineWidth = 5;
        img.color = Color.RGBA(0,255,0,100);
        img.borderRadius = 5;
        img.visible = false;
        img.visible = true;
        this.appendChild(img);
        img.scale.setXY(0.2);

        this.setInterval(()=>{
            img.visible = false;
            this.renderToTexture(renderTarget);
            img.visible = true;
        },1);

    }

}
