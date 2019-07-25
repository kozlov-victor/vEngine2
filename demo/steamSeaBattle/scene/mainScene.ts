import {AssetsDocumentHolder, Element} from "../data/assetsDocumentHolder";
import {GameObject} from "@engine/model/impl/general/gameObject";
import {MathEx} from "@engine/misc/mathEx";
import {KEYBOARD_KEY, KeyboardControl} from "@engine/control/keyboardControl";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {BaseScene} from "./baseScene";

const MANOMETER_SCALE:number = MathEx.degToRad(360-111);

export class MainScene extends BaseScene {

    private ship:GameObject;
    private seaContainer:GameObject;
    private gear1:GameObject;
    private gear2:GameObject;
    private manometerArrow:GameObject;

    private readonly PERISCOPES_LIMIT_LEFT:number = 30;
    private readonly PERISCOPES_LIMIT_RIGHT:number = -400;

    public onPreloading() {
        super.onPreloading();
    }

    public onReady() {
        super.onReady();
        this.ship = this.findChildById('shipContainer') as GameObject;
        this.seaContainer = this.findChildById('seaContainer') as GameObject;
        this.gear1 = this.findChildById('gear1') as GameObject;
        this.gear2 = this.findChildById('gear2') as GameObject;
        this.manometerArrow = this.findChildById('manometerArrow') as GameObject;
        this.ship.velocity.setX(-MathEx.random(20,60));
        this.sounds.water.gain = 0.02;
        this.waterWave();
        this.sounds.riff1.play();
        this.listenKeyboard();
    }

    protected onUpdate(): void {
        super.onUpdate();
        if (this.ship.pos.x<-100) {
            this.ship.pos.x = 1500;
            this.ship.velocity.setX(-MathEx.random(20,60));
        }
        this.checkPeriscope();
    }

    protected getSceneElement(): Element {
        return AssetsDocumentHolder.getDocument().getElementById('main');
    }

    private waterWave(){
        this.setTimeout(()=>{
            this.sounds.water.velocity = MathEx.random(0.1,1.5);
            this.sounds.water.play();
            this.waterWave();
        },MathEx.randomInt(2000,5000));
    }

    private movePeriscope(factor:1|-1){
        this.sounds.gear.play();
        this.seaContainer.velocity.x = 120*factor;
        this.gear1.angleVelocity = 5*factor;
        this.gear2.angleVelocity = 3;
    }

    private stopPeriscope(){
        this.sounds.gear.stop();
        this.seaContainer.velocity.x = 0;
        this.gear1.angleVelocity = 0;
        this.gear2.angleVelocity = 0;
    }

    private checkPeriscope(){
        if (this.seaContainer.velocity.x>0 && this.seaContainer.pos.x>this.PERISCOPES_LIMIT_LEFT) {
            this.seaContainer.pos.x=this.PERISCOPES_LIMIT_LEFT;
            this.stopPeriscope();
        }
        if (this.seaContainer.velocity.x<0 && this.seaContainer.pos.x<this.PERISCOPES_LIMIT_RIGHT) {
            this.seaContainer.pos.x=this.PERISCOPES_LIMIT_RIGHT;
            this.stopPeriscope();
        }

        this.manometerArrow.angle =
            (this.seaContainer.pos.x - this.PERISCOPES_LIMIT_LEFT) /
            this.PERISCOPES_LIMIT_RIGHT *
            MANOMETER_SCALE;
    }

    private listenKeyboard(){
        this.game.getControl<KeyboardControl>(KeyboardControl).on(KEYBOARD_EVENTS.KEY_PRESSED,(k:KEYBOARD_KEY)=>{
            switch (k) {
                case KEYBOARD_KEY.LEFT: {
                    this.movePeriscope(1);
                    break;
                }
                case KEYBOARD_KEY.RIGHT: {
                    this.movePeriscope(-1);
                    break;
                }
                case KEYBOARD_KEY.SPACE: {
                    this.sounds.shoot.play();
                    break;
                }
                default:
                    break;
            }
        });
        this.game.getControl<KeyboardControl>(KeyboardControl).on(KEYBOARD_EVENTS.KEY_RELEASED,(k:KEYBOARD_KEY)=>{
            switch (k) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.stopPeriscope();
                    break;
                default:
                    break;
            }
        });
    }

}
