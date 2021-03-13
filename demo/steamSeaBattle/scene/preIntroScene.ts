import {BaseScene} from "./baseScene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {AssetsDocumentHolder} from "../data/assetsDocumentHolder";
import {XmlElement} from "@engine/misc/xmlUtils";

export class PreIntroScene extends BaseScene {

    public onReady(): void {
        super.onReady();
        this.on(MOUSE_EVENTS.click,()=>this.game.runScene(new IntroScene(this.game)));
    }

    protected getSceneElement(): XmlElement {
        return AssetsDocumentHolder.getDocument().getElementById('preIntro')!;
    }
}
