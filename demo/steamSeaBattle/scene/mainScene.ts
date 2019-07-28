import {AssetsDocumentHolder, Element} from "../data/assetsDocumentHolder";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {MathEx} from "@engine/misc/mathEx";
import {KEYBOARD_KEY, KeyboardControl} from "@engine/control/keyboardControl";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {BaseScene} from "./baseScene";
import {ImageButton} from "@engine/renderable/impl/ui/components/imageButton";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {NixieDisplay} from "./object/nixieDisplay";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {ResultScene} from "./resultScene";

const MANOMETER_SCALE:number = MathEx.degToRad(360-111);
const MAX_NUM_OF_SHOOTS:number = 10;

export class MainScene extends BaseScene {

    private ship:GameObject;
    private seaContainer:GameObject;
    private gear1:GameObject;
    private gear2:GameObject;
    private manometerArrow:GameObject;
    private btnLeft:ImageButton;
    private btnShoot:ImageButton;
    private btnRight:ImageButton;
    private nixieDisplay:NixieDisplay;

    private readonly PERISCOPES_LIMIT_LEFT:number = 30;
    private readonly PERISCOPES_LIMIT_RIGHT:number = -400;

    private numOfShoots:number = MAX_NUM_OF_SHOOTS;

    public onPreloading() {
        super.onPreloading();
    }

    public onReady() {
        super.onReady();
        this.filters.push(new BarrelDistortionFilter(this.game));
        this.ship = this.findChildById('shipContainer') as GameObject;
        this.seaContainer = this.findChildById('seaContainer') as GameObject;
        this.gear1 = this.findChildById('gear1') as GameObject;
        this.gear2 = this.findChildById('gear2') as GameObject;
        this.btnLeft = this.findChildById('btnLeft') as ImageButton;
        this.btnShoot = this.findChildById('btnShoot') as ImageButton;
        this.btnRight = this.findChildById('btnRight') as ImageButton;
        this.nixieDisplay = new NixieDisplay(
            this.findChildById('nixieTube0'),
            this.findChildById('nixieTube1')
        );
        this.manometerArrow = this.findChildById('manometerArrow') as GameObject;
        this.ship.velocity.setX(-MathEx.random(20,60));
        this.sounds.water.gain = 0.02;
        this.waterWave();
        this.sounds.riff1.play();
        this.listenControls();
        this.nixieDisplay.setNumber(this.numOfShoots);
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

    private shoot(){
        this.sounds.shoot.play();
        this.game.camera.shake(5,300);
        this.numOfShoots--;
        this.nixieDisplay.setNumber(this.numOfShoots);
        if (this.numOfShoots<=0) {
            const resultScene:ResultScene = new ResultScene(this.game);
            resultScene.SCORE_TO_SET = 10;
            this.game.runScene(resultScene);
        }
    }



    private listenControls(){
        this.on(KEYBOARD_EVENTS.keyPressed,(k:KEYBOARD_KEY)=>{
            switch (k) {
                case KEYBOARD_KEY.LEFT: {
                    this.movePeriscope(1);
                    this.btnLeft.triggerOn();
                    break;
                }
                case KEYBOARD_KEY.RIGHT: {
                    this.movePeriscope(-1);
                    this.btnRight.triggerOn();
                    break;
                }
                case KEYBOARD_KEY.SPACE: {
                    this.shoot();
                    this.btnShoot.triggerOn();
                    break;
                }
                default:
                    break;
            }
        });
        this.on(KEYBOARD_EVENTS.keyReleased,(k:KEYBOARD_KEY)=>{
            switch (k) {
                case KEYBOARD_KEY.LEFT:
                case KEYBOARD_KEY.RIGHT:
                    this.stopPeriscope();
                    this.btnLeft.triggerOff();
                    this.btnRight.triggerOff();
                    break;
                case KEYBOARD_KEY.SPACE:
                    this.btnShoot.triggerOff();
                    break;
                default:
                    break;
            }
        });
        this.btnLeft.on(MOUSE_EVENTS.click,()=>this.movePeriscope(1));
        this.btnLeft.on(MOUSE_EVENTS.mouseUp,()=>this.stopPeriscope());
        this.btnRight.on(MOUSE_EVENTS.click,()=>this.movePeriscope(-1));
        this.btnRight.on(MOUSE_EVENTS.mouseUp,()=>this.stopPeriscope());
        this.btnShoot.on(MOUSE_EVENTS.click,()=>this.shoot());
    }

}
