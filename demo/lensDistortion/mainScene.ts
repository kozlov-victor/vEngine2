import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {LensDistortionFilter} from "@engine/renderer/webGl/filters/texture/lensDistortionFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {TaskQueue} from "@engine/resources/taskQueue";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";

export class MainScene extends Scene {

    private logoLink:ITexture;
    private imgRepeatLink:ITexture;


    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        taskQueue.addNextTask(async process=>{
            this.logoLink = await taskQueue.getLoader().loadTexture('./assets/logo.png',process);
        });
        taskQueue.addNextTask(async process=>{
            this.imgRepeatLink = await taskQueue.getLoader().loadTexture('./assets/repeat.jpg',process);
        });
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {

        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.setFrom({x:10,y:10});
        this.appendChild(spr);

        const circle:Circle = new Circle(this.game);
        circle.radius = 90;
        circle.center.setXY(120,120);
        circle.color = Color.RGB(30,40,55);
        circle.color = Color.RGB(0,100,12);
        circle.arcAngleFrom = -2;
        circle.arcAngleTo = 2;
        this.appendChild(circle);

        const img = new Image(this.game,this.imgRepeatLink);
        img.pos.setXY(100,0);
        img.size.setWH(200);
        img.stretchMode = STRETCH_MODE.REPEAT;
        img.borderRadius = 15;
        this.appendChild(img);


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
            }
        });


        const lensFilter:LensDistortionFilter = new LensDistortionFilter(this.game);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            lensFilter.setMouseScreenCoordinates(e.screenX,e.screenY);
        });
        this.filters = [lensFilter];


    }

}
