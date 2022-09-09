import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {DebugLayer} from "@engine/scene/debugLayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {BrightnessColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/brightnessColorMatrixFilter";
import {SaturationColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/saturationColorMatrixFilter";
import {ContrastColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/contrastColorMatrixFilter";
import {SepiaColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/sepiaColorMatrixFilter";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    public readonly logoTexture:ITexture;

    public override onReady():void {
        const spr: Image = new Image(this.game, this.logoTexture);
        spr.pos.setFrom({x: 10, y: 10});
        spr.transformPoint.setToCenter();
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);

        const filters = [
            (()=>{
                let b = 1;
                const targetCnt = 0;
                const f = new BrightnessColorMatrixFilter(this.game);
                f.setBrightness(b);
                this.keyboardEventHandler.onKeyHold(KEYBOARD_KEY.ADD, _=>{
                    if (cnt!==targetCnt) return;
                    b+=0.1;
                    f.setBrightness(b);
                });
                this.keyboardEventHandler.onKeyHold(KEYBOARD_KEY.SUBTRACT, _=>{
                    if (cnt!==targetCnt) return;
                    b-=0.1;
                    f.setBrightness(b);
                });
                return f;
            })(),
            (()=>{
                let s = 1;
                const f = new SaturationColorMatrixFilter(this.game);
                const targetCnt = 1;
                f.setSaturation(s);
                this.keyboardEventHandler.onKeyHold(KEYBOARD_KEY.ADD, _=>{
                    if (cnt!==targetCnt) return;
                    s+=0.1;
                    f.setSaturation(s);
                });
                this.keyboardEventHandler.onKeyHold(KEYBOARD_KEY.SUBTRACT, _=>{
                    if (cnt!==targetCnt) return;
                    s-=0.1;
                    f.setSaturation(s);
                });
                return f;
            })(),
            (()=>{
                let c = 1;
                const f = new ContrastColorMatrixFilter(this.game);
                const targetCnt = 2;
                f.setContrast(c);
                this.keyboardEventHandler.onKeyHold(KEYBOARD_KEY.ADD, _=>{
                    if (cnt!==targetCnt) return;
                    c+=0.1;
                    f.setContrast(c);
                });
                this.keyboardEventHandler.onKeyHold(KEYBOARD_KEY.SUBTRACT, _=>{
                    if (cnt!==targetCnt) return;
                    c-=0.1;
                    f.setContrast(c);
                });
                return f;
            })(),
            new SepiaColorMatrixFilter(this.game)
        ];
        let cnt = -1;
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        debugLayer.println('press Right key to set filter,+/- to adjust')
        this.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT,e=>{
            cnt++;
            cnt=cnt%filters.length;
            debugLayer.println(filters[cnt]);
            this.getLayerAtIndex(0).filters = [filters[cnt]];
        });

    }
}
