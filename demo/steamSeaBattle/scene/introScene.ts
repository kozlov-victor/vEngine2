import {AssetsDocumentHolder} from "../data/assetsDocumentHolder";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MainScene} from "./mainScene";
import {BaseScene} from "./baseScene";
import {XmlNode} from "@engine/misc/parsers/xml/xmlELements";

export class IntroScene extends BaseScene {

    public override onReady():void {
        super.onReady();
        this.sounds.intro.play();
        this.sounds.gear.loop = true;
        this.sounds.gear.play();
        console.log(this.findChildById('coin_acceptor'));
        this.findChildById('coin_acceptor')!.mouseEventHandler.on(MOUSE_EVENTS.click,(e:any)=>{
            this.findChildById('coin')!.visible = true;
            this.sounds.start.play();
            this.sounds.gear.stop();
            this.setTimeout(()=>{
                this.game.runScene(new MainScene(this.game));
            },1000);
        });
    }

    protected getSceneElement(): XmlNode {
        return AssetsDocumentHolder.getDocument().getElementById('intro')!;
    }

}
