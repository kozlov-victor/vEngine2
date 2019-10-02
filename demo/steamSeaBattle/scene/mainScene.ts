import {AssetsDocumentHolder, Element} from "../data/assetsDocumentHolder";
import {MathEx} from "@engine/misc/mathEx";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {BaseScene} from "./baseScene";
import {ImageButton} from "@engine/renderable/impl/ui/components/imageButton";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {NixieDisplay} from "./object/nixieDisplay";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {ResultScene} from "./resultScene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

const MANOMETER_SCALE:number = MathEx.degToRad(360-111);
const MAX_NUM_OF_SHOOTS:number = 10;

export class MainScene extends BaseScene {

    private ship:RenderableModel;
    private seaContainer:RenderableModel;
    private gear1:RenderableModel;
    private gear2:RenderableModel;
    private bulletContainer:NullGameObject;
    private bullet:RenderableModel;
    private manometerArrow:RenderableModel;
    private btnLeft:ImageButton;
    private btnShoot:ImageButton;
    private btnRight:ImageButton;
    private nixieDisplayFired:NixieDisplay;
    private nixieDisplayShoot:NixieDisplay;
    private hitOn:RenderableModel;
    private hitOff:RenderableModel;
    private missedOn:RenderableModel;
    private missedOff:RenderableModel;

    private readonly PERISCOPES_LIMIT_LEFT:number = 30;
    private readonly PERISCOPES_LIMIT_RIGHT:number = -400;
    private BULLET_INITIAL_POSITION:number;
    private score:number = 0;

    private numOfShoots:number = MAX_NUM_OF_SHOOTS;


    private psBullet:ParticleSystem;

    public onPreloading() {
        super.onPreloading();
    }

    public onReady() {
        super.onReady();
        this.filters.push(new BarrelDistortionFilter(this.game));
        this.ship = this.findChildById('shipContainer') as RenderableModel;
        this.seaContainer = this.findChildById('seaContainer') as RenderableModel;
        this.gear1 = this.findChildById('gear1') as RenderableModel;
        this.gear2 = this.findChildById('gear2') as RenderableModel;
        this.bulletContainer = this.findChildById('bulletContainer') as NullGameObject;
        this.bullet = this.findChildById('bullet') as RenderableModel;
        this.BULLET_INITIAL_POSITION = this.bulletContainer.pos.y;
        this.btnLeft = this.findChildById('btnLeft') as ImageButton;
        this.btnShoot = this.findChildById('btnShoot') as ImageButton;
        this.btnRight = this.findChildById('btnRight') as ImageButton;
        this.nixieDisplayFired = new NixieDisplay(
            this.findChildById('nixieTubeFired0')!,
            this.findChildById('nixieTubeFired1')!
        );
        this.nixieDisplayShoot = new NixieDisplay(
            this.findChildById('nixieTubeShoot0')!,
            this.findChildById('nixieTubeShoot1')!
        );
        this.hitOn = this.findChildById('hitOn') as RenderableModel;
        this.hitOff = this.findChildById('hitOff') as RenderableModel;
        this.missedOn = this.findChildById('missedOn') as RenderableModel;
        this.missedOff = this.findChildById('missedOff') as RenderableModel;
        this.manometerArrow = this.findChildById('manometerArrow') as RenderableModel;
        this.ship.velocity.setX(-MathEx.random(20,60));
        this.sounds.water.gain = 0.02;
        this.waterWave();
        this.sounds.riff1.play();
        this.listenControls();
        this.nixieDisplayFired.setNumber(this.numOfShoots);

        this.psBullet = new ParticleSystem(this.game);
        const particle:Circle = new Circle(this.game);
        particle.radius = 2;
        this.psBullet.pos.setXY(28/2,53/2);
        this.psBullet.numOfParticlesToEmit = {from:0,to:1};
        this.psBullet.particleVelocity = {from:1,to:10};
        this.psBullet.particleLiveTime = {from:1000,to:5000};
        this.psBullet.emissionRadius = 10;
        this.psBullet.particleAngle = {from:MathEx.degToRad(90-10),to:MathEx.degToRad(90+10)};
        this.psBullet.addParticle(particle);
        this.bulletContainer.appendChild(this.psBullet);
    }

    protected onUpdate(): void {
        super.onUpdate();
        if (this.ship.pos.x<-100) {
            this.resetShip();
        }
        this.checkPeriscope();
        this.checkBullet();
    }

    protected getSceneElement(): Element {
        return AssetsDocumentHolder.getDocument().getElementById('main')!;
    }

    private waterWave(){
        this.setTimeout(()=>{
            this.sounds.water.velocity = MathEx.random(0.1,1.5);
            this.sounds.water.play();
            this.waterWave();
        },MathEx.randomInt(2000,5000));
    }

    private resetShip(){
        this.ship.pos.x = 1000 + MathEx.random(0,300);
        this.ship.velocity.setX(-MathEx.random(20,60));
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

    private checkLevelCompleted(){
        if (this.numOfShoots===0) {
            const resultScene:ResultScene = new ResultScene(this.game);
            resultScene.SCORE_TO_SET = this.score;
            this.setTimeout(()=>this.game.runScene(resultScene),3000);
        }
    }

    private checkBullet() {
        if (!this.bullet.visible) return;
        if (this.bulletContainer.pos.y<270) {
            this.bulletContainer.velocity.y = 0;
            this.bullet.visible = false;
            this.checkLevelCompleted();
            if (MathEx.overlapTest(this.bulletContainer.getDestRect(),this.ship.getDestRect())) {
                this.resetShip();
                this.score++;
                this.nixieDisplayShoot.setNumber(this.score);
                this.hitOff.visible = false;
                this.hitOn.visible = true;
                this.setTimeout(()=>{
                    this.hitOff.visible = true;
                    this.hitOn.visible = false;
                },3000);
                this.sounds.hit.play();

            } else {
                this.missedOff.visible = false;
                this.missedOn.visible = true;
                this.setTimeout(()=>{
                    this.missedOff.visible = true;
                    this.missedOn.visible = false;
                },3000);
                this.sounds.missed.play();
            }
        }
        if (this.bulletContainer.pos.y>this.BULLET_INITIAL_POSITION - 20)
            this.psBullet.emit();

    }


    private shoot(){
        if (this.numOfShoots===0) return;
        if (this.bullet.visible) return;
        this.sounds.shoot.play();
        this.game.camera.shake(5,300);
        this.bulletContainer.pos.x = -this.seaContainer.pos.x + 400;
        this.bulletContainer.pos.y = this.BULLET_INITIAL_POSITION;
        this.bullet.visible = true;
        this.bulletContainer.velocity.y = -50;
        this.numOfShoots--;
        this.nixieDisplayFired.setNumber(this.numOfShoots);
    }


    private listenControls(){
        this.on(KEYBOARD_EVENTS.keyPressed,(e:KeyBoardEvent)=>{
            switch (e.key) {
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
        this.on(KEYBOARD_EVENTS.keyReleased,(e:KeyBoardEvent)=>{
            switch (e.key) {
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