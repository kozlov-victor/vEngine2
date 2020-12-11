import {AssetsDocumentHolder} from "../data/assetsDocumentHolder";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MainScene} from "./mainScene";
import {BaseScene} from "./baseScene";
import {Element} from "@engine/misc/xmlUtils";

export class IntroScene extends BaseScene {


    public onPreloading():void {
        super.onPreloading();
    }

    public onReady():void {
        super.onReady();
        this.sounds.intro.play();
        this.sounds.gear.loop = true;
        this.sounds.gear.play();
        this.findChildById('coin_acceptor')!.on(MOUSE_EVENTS.click,(e:any)=>{
            this.findChildById('coin')!.visible = true;
            this.sounds.start.play();
            this.sounds.gear.stop();
            this.setTimeout(()=>{
                this.game.runScene(new MainScene(this.game));
            },1000);
        });
    }

    protected getSceneElement(): Element {
        return AssetsDocumentHolder.getDocument().getElementById('intro')!;
    }

}
