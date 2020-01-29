import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {LensDistortionFilter} from "@engine/renderer/webGl/filters/texture/lensDistortionFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private img:Image;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        const img = new Image(this.game);
        img.setResourceLink(this.resourceLoader.loadTexture('./assets/repeat.jpg'));
        this.img = img;

    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);


        const circle:Circle = new Circle(this.game);
        circle.radius = 90;
        circle.center.setXY(120,120);
        circle.color = Color.RGB(30,40,55);
        circle.color = Color.RGB(0,100,12);
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;
        this.appendChild(circle);

        const img = this.img;
        img.pos.setXY(100,0);
        img.size.setWH(200);
        img.stretchMode = STRETCH_MODE.REPEAT;
        img.borderRadius = 15;
        this.appendChild(this.img);


        this.on(KEYBOARD_EVENTS.keyHold, (e:KeyBoardEvent)=>{
            switch (e.key) {
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
            }
        });


        const lensFilter:LensDistortionFilter = new LensDistortionFilter(this.game);
        this.on(MOUSE_EVENTS.mouseMove, e=>{
            lensFilter.setMouseScreenCoordinates(e.screenX,e.screenY);
        });
        this.filters = [lensFilter];


    }

}
