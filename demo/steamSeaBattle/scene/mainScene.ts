import {AssetsDocumentHolder} from "../data/assetsDocumentHolder";
import {MathEx} from "@engine/misc/mathEx";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvent";
import {BaseScene} from "./baseScene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {NixieDisplay} from "./object/nixieDisplay";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/texture/barrelDistortionFilter";
import {ResultScene} from "./resultScene";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IKeyBoardEvent} from "@engine/control/keyboard/iKeyBoardEvent";
import {ImageButton} from "@engine/renderable/impl/ui/button/imageButton";
import {XmlNode} from "@engine/misc/parsers/xml/xmlELements";

const MANOMETER_SCALE:number = MathEx.degToRad(360-111);
const MAX_NUM_OF_SHOOTS:number = 10;

export class MainScene extends BaseScene {

    private ship:RenderableModel;
    private seaContainer:RenderableModel;
    private gear1:RenderableModel;
    private gear2:RenderableModel;
    private bulletContainer:SimpleGameObjectContainer;
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

    public override onReady():void {
        super.onReady();
        this.filters.push(new BarrelDistortionFilter(this.game));
        this.ship = this.findChildById('shipContainer') as RenderableModel;
        this.seaContainer = this.findChildById('seaContainer') as RenderableModel;
        this.gear1 = this.findChildById('gear1') as RenderableModel;
        this.gear2 = this.findChildById('gear2') as RenderableModel;
        this.bulletContainer = this.findChildById('bulletContainer') as SimpleGameObjectContainer;
        this.bullet = this.findChildById('bullet') as RenderableModel;
        this.BULLET_INITIAL_POSITION = this.bulletContainer.pos.y;
        this.btnLeft = this.findChildById<ImageButton>('btnLeft')!;
        this.btnShoot = this.findChildById<ImageButton>('btnShoot')!;
        this.btnRight = this.findChildById<ImageButton>('btnRight')!;
        this.nixieDisplayFired = new NixieDisplay(
            this.findChildById('nixieTubeFired0')!,
            this.findChildById('nixieTubeFired1')!
        );
        this.nixieDisplayShoot = new NixieDisplay(
            this.findChildById('nixieTubeShoot0')!,
            this.findChildById('nixieTubeShoot1')!
        );
        this.hitOn = this.findChildById('hitOn')!;
        this.hitOff = this.findChildById('hitOff')!;
        this.missedOn = this.findChildById('missedOn')!;
        this.missedOff = this.findChildById('missedOff')!;
        this.manometerArrow = this.findChildById('manometerArrow')!;
        this.ship.velocity.setX(-MathEx.random(20,60));
        this.sounds.water.gain = 0.02;
        this.waterWave();
        this.sounds.riff1.play();
        this.listenControls();
        this.nixieDisplayFired.setNumber(this.numOfShoots);

        this.psBullet = new ParticleSystem(this.game);
        const particle:Circle = new Circle(this.game);
        particle.radius = 2;
        this.psBullet.emissionPosition.setXY(28/2,53/2);
        this.psBullet.numOfParticlesToEmit = {from:0,to:1};
        this.psBullet.particleVelocity = {from:1,to:10};
        this.psBullet.particleLiveTime = {from:1000,to:5000};
        this.psBullet.emissionRadius = 10;
        this.psBullet.particleAngle = {from:MathEx.degToRad(90-10),to:MathEx.degToRad(90+10)};
        this.psBullet.emitAuto = false;
        this.psBullet.addParticlePrefab(particle);

        this.bulletContainer.appendChild(this.psBullet);
    }

    protected override onUpdate(): void {
        super.onUpdate();
        if (this.ship.pos.x<-100) {
            this.resetShip();
        }
        this.checkPeriscope();
        this.checkBullet();
    }

    protected getSceneElement(): XmlNode {
        return AssetsDocumentHolder.getDocument().getElementById('main')!;
    }

    private waterWave():void{
        this.setTimeout(()=>{
            this.sounds.water.velocity = MathEx.random(0.1,1.5);
            this.sounds.water.play();
            this.waterWave();
        },MathEx.randomInt(2000,5000));
    }

    private resetShip():void{
        this.ship.pos.x = 1000 + MathEx.random(0,300);
        this.ship.velocity.setX(-MathEx.random(20,60));
    }

    private movePeriscope(factor:1|-1):void{
        this.sounds.gear.play();
        this.seaContainer.velocity.x = 120*factor;
        this.gear1.angleVelocity = 5*factor;
        this.gear2.angleVelocity = 3;
    }

    private stopPeriscope():void{
        this.sounds.gear.stop();
        this.seaContainer.velocity.x = 0;
        this.gear1.angleVelocity = 0;
        this.gear2.angleVelocity = 0;
    }

    private checkPeriscope():void{
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

    private checkLevelCompleted():void{
        if (this.numOfShoots===0) {
            const resultScene:ResultScene = new ResultScene(this.game);
            resultScene.SCORE_TO_SET = this.score;
            this.setTimeout(()=>this.game.runScene(resultScene),3000);
        }
    }

    private checkBullet():void {
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
        if (this.bulletContainer.pos.y>this.BULLET_INITIAL_POSITION - 20) {
            this.psBullet.emit();
        }
    }


    private shoot():void{
        if (this.numOfShoots===0) return;
        if (this.bullet.visible) return;
        this.sounds.shoot.play();
        this.camera.shake(5,300);
        this.bulletContainer.pos.x = -this.seaContainer.pos.x + 400;
        this.bulletContainer.pos.y = this.BULLET_INITIAL_POSITION;
        this.bullet.visible = true;
        this.bulletContainer.velocity.y = -50;
        this.numOfShoots--;
        this.nixieDisplayFired.setNumber(this.numOfShoots);
    }


    private listenControls():void{
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed,(e:IKeyBoardEvent)=>{
            switch (e.button) {
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
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyReleased,(e:IKeyBoardEvent)=>{
            switch (e.button) {
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
        this.btnLeft.mouseEventHandler.on(MOUSE_EVENTS.click,()=>this.movePeriscope(1));
        this.btnLeft.mouseEventHandler.on(MOUSE_EVENTS.mouseUp,()=>this.stopPeriscope());
        this.btnRight.mouseEventHandler.on(MOUSE_EVENTS.click,()=>this.movePeriscope(-1));
        this.btnRight.mouseEventHandler.on(MOUSE_EVENTS.mouseUp,()=>this.stopPeriscope());
        this.btnShoot.mouseEventHandler.on(MOUSE_EVENTS.click,()=>this.shoot());
    }

}
