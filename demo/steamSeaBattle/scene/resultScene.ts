import {BaseScene} from "./baseScene";
import {AssetsDocumentHolder} from "../data/assetsDocumentHolder";
import {NixieDisplay} from "./object/nixieDisplay";
import {Timer} from "@engine/misc/timer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {XmlElement} from "@engine/misc/xmlUtils";

export class ResultScene extends BaseScene {

    public SCORE_TO_SET:number = 6;

    private nixieDisplay:NixieDisplay;

    public onReady(): void {
        super.onReady();
        this.sounds.gear.play();
        this.nixieDisplay = new NixieDisplay(
            this.findChildById('nixieTube0')!,
            this.findChildById('nixieTube1')!
        );
        let counter:number = 0;
        this.setTimeout(()=>{
            const timer:Timer = this.setInterval(()=>{
                this.nixieDisplay.setNumber(counter++);
                this.sounds.click.play();
                if (counter>this.SCORE_TO_SET) {
                    timer.kill();
                    if (this.SCORE_TO_SET>=5) this.sounds.win.play();
                    else this.sounds.life_lost.play();
                    this.on(MOUSE_EVENTS.click,()=>{
                        this.game.runScene(new IntroScene(this.game));
                    });
                }
            },420);
        },5000);

    }

    protected getSceneElement(): XmlElement {
        return AssetsDocumentHolder.getDocument().getElementById('result')!;
    }


}
