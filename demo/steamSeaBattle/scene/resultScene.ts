import {BaseScene} from "./baseScene";
import {AssetsDocumentHolder, Element} from "../data/assetsDocumentHolder";
import {NixieDisplay} from "./object/nixieDisplay";
import {Timer} from "@engine/misc/timer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";

export class ResultScene extends BaseScene {

    public SCORE_TO_SET:number = 6;

    private nixieDisplay:NixieDisplay;

    public onReady(): void {
        super.onReady();
        this.sounds.gear.play();
        this.nixieDisplay = new NixieDisplay(
            this.findChildById('nixieTube0'),
            this.findChildById('nixieTube1')
        );
        let counter:number = 0;
        this.setTimeout(()=>{
            const timer:Timer = this.setInterval(()=>{
                this.nixieDisplay.setNumber(counter++);
                if (counter>this.SCORE_TO_SET) {
                    timer.kill();
                    this.sounds.win.play();
                    this.on(MOUSE_EVENTS.click,()=>{
                        this.game.runScene(new IntroScene(this.game));
                    });
                }
            },300);
        },5000);

    }

    protected getSceneElement(): Element {
        return AssetsDocumentHolder.getDocument().getElementById('result');
    }


}