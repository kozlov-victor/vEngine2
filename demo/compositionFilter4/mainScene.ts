import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {AlphaMaskFilter} from "@engine/renderer/webGl/filters/texture/alphaMaskFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {FadeAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/fadeAccumulativeFilter";
import {TrianglesMosaicFilter} from "@engine/renderer/webGl/filters/texture/trianglesMosaicFilter";
import {CrtScreenFilter} from "@engine/renderer/webGl/filters/texture/crtScreenFilter";

export class MainScene extends Scene {

    @Resource.Texture('./plasma/Plasma_effect.jpg')
    private plasmaLink:ITexture;

    @Resource.Texture('./plasma/gradient.png')
    private palletLink:ITexture;

    @Resource.Texture('./assets/logo.png')
    private logoTexture:ITexture;

    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS('black');

        const drawingSurface = new DrawingSurface(this.game,this.game.size);
        const circle = new Circle(this.game);
        circle.lineWidth = 0;
        circle.radius = 60;
        circle.fillColor = ColorFactory.fromCSS(`#ffffff`);
        const fadeFilter = new FadeAccumulativeFilter(this.game);
        fadeFilter.setFadeValue(0.01);
        circle.filters = [new SimpleBlurFilter(this.game),fadeFilter,new TrianglesMosaicFilter(this.game)];
        drawingSurface.drawModel(circle);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            circle.center.setXY(e.sceneX,e.sceneY);
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.scroll, e=>{
            const d:number = (e.nativeEvent as any).wheelDelta;
            let r = circle.radius + d / 120;
            if (r<5) r = 5;
            if (r>500) r = 500;
            circle.radius = r;
        });
        this.setInterval(()=>{
            drawingSurface.clear();
            drawingSurface.drawModel(circle);
        },1);

        const spr:Image = new Image(this.game,this.plasmaLink);
        this.appendChild(spr);
        const palletFilter:PalletOffsetFilter = new PalletOffsetFilter(this.game,this.palletLink);
        const maskFilter = new AlphaMaskFilter(this.game,drawingSurface.getTexture(),'a');
        spr.filters = [palletFilter,maskFilter];
        let offset:number = 0;
        this.setInterval(()=>{
            offset++;
            offset = offset % 320;
            palletFilter.setPalletOffset(offset);
        },1);

        const logo: Image = new Image(this.game, this.logoTexture);
        logo.filters = [];
        logo.scale.setXYZ(0.3);
        this.appendChild(logo);

        this.filters = [new CrtScreenFilter(this.game)];

    }

}
