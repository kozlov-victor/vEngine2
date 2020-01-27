import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Image} from "@engine/renderable/impl/general/image";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {TaskRef} from "@engine/resources/queue";
import {ITexture} from "@engine/renderer/common/texture";


export const fakeLongLoadingFn = (resourceLoader:ResourceLoader)=>{
    const taskRef:TaskRef = resourceLoader.q.addTask(()=>{
        setTimeout(()=>{
            resourceLoader.q.resolveTask(taskRef);
        },50);
    });
};


export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
        for (let i:number = 0;i<100;i++) { fakeLongLoadingFn(this.resourceLoader); }
        const rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);


        this.on(KEYBOARD_EVENTS.keyHold, (e)=>{
            console.log(e);
        });

    }

}
