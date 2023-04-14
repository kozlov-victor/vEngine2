import {BaseScene} from "./baseScene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {AssetsDocumentHolder} from "../data/assetsDocumentHolder";
import {XmlNode} from "@engine/misc/parsers/xml/xmlElements";

export class PreIntroScene extends BaseScene {

    public override onReady(): void {
        super.onReady();
        this.mouseEventHandler.on(MOUSE_EVENTS.click,()=>this.game.runScene(new IntroScene(this.game)));
    }

    protected getSceneElement(): XmlNode {
        return AssetsDocumentHolder.getDocument().getElementById('preIntro')!;
    }
}
