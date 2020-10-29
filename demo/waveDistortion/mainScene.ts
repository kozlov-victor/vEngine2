import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Color} from "@engine/renderer/common/color";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoLink:ResourceLink<ITexture>;

    @Resource.Texture('./assets/repeat.jpg')
    private repeatLink:ResourceLink<ITexture>;

    private img:Image;


    public onReady() {

        this.img = new Image(this.game);
        this.img.setResourceLink(this.repeatLink);

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        const nf = new NoiseFilter(this.game);
        nf.setIntensivity(0.5);
        spr.filters = [nf];
        spr.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(spr);

        const spr2:Image = new Image(this.game);
        spr2.setResourceLink(this.logoLink);
        spr2.pos.setXY(30,30);
        spr2.filters = [new BlackWhiteFilter(this.game)];
        spr.appendChild(spr2);

        const spr3:Image = new Image(this.game);
        spr3.setResourceLink(this.logoLink);
        spr3.pos.setXY(30,30);
        spr3.filters = [new Barrel2DistortionFilter(this.game)];
        spr2.appendChild(spr3);


        const circle:Circle = new Circle(this.game);
        circle.radius = 90;
        circle.center.setXY(120,120);
        circle.color = Color.RGB(30,40,55);
        circle.color = Color.RGB(0,100,12);
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;
        circle.addBehaviour(new DraggableBehaviour(this.game));
        const waveFilter:WaveFilter = new WaveFilter(this.game);
        circle.filters = [waveFilter];
        this.appendChild(circle);

        const img = this.img;
        img.pos.setXY(100,0);
        img.size.setWH(200);
        img.stretchMode = STRETCH_MODE.REPEAT;
        img.borderRadius = 15;
        img.addBehaviour(new DraggableBehaviour(this.game));
        circle.appendChild(img);


        //this.filters = [new MotionBlurFilter(this.game)];


    }

}
