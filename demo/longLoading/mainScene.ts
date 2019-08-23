import {Scene} from "@engine/core/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Image} from "@engine/renderable/impl/geometry/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {TaskRef} from "@engine/resources/queue";
import {ITexture} from "@engine/renderer/texture";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";


const fakeLongLoadingFn = (resourceLoader:ResourceLoader)=>{
    const taskRef:TaskRef = resourceLoader.q.addTask(()=>{
        setTimeout(()=>{
            resourceLoader.q.resolveTask(taskRef);
        },200);
    });
};


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
        for (let i:number = 0;i<100;i++) { fakeLongLoadingFn(this.resourceLoader); }
        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
        console.log('progress',val);
    }

    public onReady() {
        this.logoObj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        this.on(KEYBOARD_EVENTS.keyHold, (e:KEYBOARD_KEY)=>{
            switch (e) {
                case KEYBOARD_KEY.LEFT:
                    this.logoObj.pos.addX(-1);
                    break;
                case KEYBOARD_KEY.RIGHT:
                    this.logoObj.pos.addX(1);
                    break;
                case KEYBOARD_KEY.UP:
                    this.logoObj.pos.addY(-1);
                    break;
                case KEYBOARD_KEY.DOWN:
                    this.logoObj.pos.addY(1);
                    break;
                case KEYBOARD_KEY.R:
                    this.logoObj.angle+=0.1;
            }
        });

        this.on(KEYBOARD_EVENTS.keyHold, (e:KEYBOARD_KEY)=>{

        });

        this.on(KEYBOARD_EVENTS.keyHold, (e)=>{
            console.log(e);
        });

        (window as any).logoObj = this.logoObj;

    }

}
