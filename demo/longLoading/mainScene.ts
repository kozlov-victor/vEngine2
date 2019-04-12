import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {KEYBOARD_EVENT} from "@engine/control/abstract/abstractKeypad";
import {KeyboardControl, KEYBOARD_KEY} from "@engine/control/keyboardControl";
import {GamePadControl} from "@engine/control/gamePadControl";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Queue} from "@engine/resources/queue";


const fakeLongLoadingFn = (resourceLoader:ResourceLoader,time:number)=>{
    const q:Queue = ((resourceLoader as any)['q'] as Queue);
    const id:string = Math.random()+'_'+Math.random();
    q.addTask(()=>{
        setTimeout(()=>{
            q.resolveTask(id);
        },time);
    },id);
};


export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
        for (let i:number = 0;i<100;i++) fakeLongLoadingFn(this.resourceLoader,i*200);
        let rect = new Rectangle(this.game);
        rect.borderRadius = 5;
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.pos.y = 50;
        rect.size.height = 20;
        this.preloadingGameObject = rect;
    }

    onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
        console.log('progress',val);
    }

    onReady() {
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        this.game.getControl<KeyboardControl>(KeyboardControl).on(KEYBOARD_EVENT.KEY_HOLD, (e:KEYBOARD_KEY)=>{
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

        this.game.getControl<GamePadControl>(GamePadControl).on(KEYBOARD_EVENT.KEY_HOLD, (e)=>{
            console.log(e);
        });

        (window as any).logoObj = this.logoObj;

    }

}
