import {Font} from "@engine/renderable/impl/general/font/font";
import {Color} from "@engine/renderer/common/color";
import {ITexture} from "@engine/renderer/common/texture";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MathEx} from "@engine/misc/math/mathEx";
import {MkAbstractScene} from "./mkAbstractScene";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";
import {SwirlFilter} from "@engine/renderer/webGl/filters/texture/swirlFilter";
import {HEROES_DESCRIPTION, IItemDescription} from "../assets/images/heroes/description/heroesDescription";
import {Sound} from "@engine/media/sound";
import {MoveByCircleAnimation} from "@engine/animation/propertyAnimation/moveByCircleAnimation";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {AlignText, AlignTextContentHorizontal, WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {Point2d} from "@engine/geometry/point2d";
import {TaskQueue} from "@engine/resources/taskQueue";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";


export class MkDescribeHeroScene extends MkAbstractScene {

    public selectedIndex:number = 0;


    @Resource.FontFromCssDescription({fontSize: 80, fontFamily: 'MK4'})
    public readonly fnt:Font;

    private logoLink:ITexture;

    @Resource.Sound('./mk-alfa/assets/sounds/btn3.mp3')
    public readonly sndBtn:Sound;

    private lightContainer:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
    private tfInfo:TextField;

    public override onPreloading(taskQueue:TaskQueue): void {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async progress => {
            this.logoLink = await taskQueue.getLoader().loadTexture('./mk-alfa/assets/images/mkLogo.png',progress);
        });
    }

    public override onReady(): void {
        super.onReady();
        this.appendChild(this.lightContainer);
        const lightFilter = new WaveFilter(this.game);
        lightFilter.setAmplitude(0.1);
        this.lightContainer.filters = [lightFilter];

        const circle:Circle = new Circle(this.game);
        circle.radius = 2;
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        circle.fillColor.setRGBA(122,200,0);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(circle);
        ps.emissionRadius = 5;

        ps.onEmitParticle((r:RenderableModel)=>{
            r.blendMode = BLEND_MODE.ADDITIVE;
        });
        ps.onUpdateParticle((r:RenderableModel)=>r.angle+=0.1);
        ps.emissionPosition.setXY(this.game.size.width/2,this.game.size.height/2);
        this.setInterval(()=>{
            ps.emit();
        },100);
        this.setInterval(()=>{
            ps.emissionPosition.setXY(
                MathEx.randomInt(0,this.game.size.width),
                MathEx.randomInt(0,this.game.size.height)
            );
        },100);

        ps.numOfParticlesToEmit = {from:4,to:10};
        ps.particleLiveTime = {from:500,to:1000};
        ps.particleAngle = {from:0,to:2*Math.PI};
        ps.emitAuto = false;
        this.appendChild(ps);
        const particlesFilter1 = new GlowFilter(this.game);
        particlesFilter1.setGlowColor(Color.RGB(2,200,2));
        const particlesFilter2 = new SwirlFilter(this.game);
        particlesFilter2.setCenter(this.game.size.width/2,this.game.size.height);
        particlesFilter2.setRadius(1000);
        ps.filters = [particlesFilter1, particlesFilter2];
        const circleAnim = new MoveByCircleAnimation(this.game);
        circleAnim.radius = 300;
        this.addPropertyAnimation(circleAnim);
        circleAnim.onProgress((p)=>{
            particlesFilter2.setCenter(p.x,p.y);
        });

        const tf:TextField = new TextField(this.game,this.fnt);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setWordBrake(WordBrake.FIT);
        tf.pos.setY(100);
        tf.textColor.setRGB(233,233,60);
        tf.size.setWH(this.game.width,this.game.height);
        this.tfInfo = tf;
        this.appendChild(tf);

        this.gamepadEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            this.goBack();
        });
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, (e)=>{
            this.goBack();
        });

        const sceneFilter = new NoiseHorizontalFilter(this.game);
        this.filters = [sceneFilter];

        this.setInterval(()=>{
            if (MathEx.randomInt(0,50)<25) {
                this.camera.shake(5,200);
                const splashes:number = MathEx.randomInt(0,8);
                const vertical:boolean = MathEx.randomInt(0,10)>5;
                for (let i=0;i<splashes;i++) {
                    if (vertical) this.createSplashVertical();
                    else this.createSplashHorizontal();
                }
            }
        },1000);
    }


    public override onContinue(): void {
        super.onContinue();
        const hero:IItemDescription = HEROES_DESCRIPTION[this.selectedIndex];
        this.tfInfo.setText(
            `Our hero is ${hero.name}. Take the prize with number ${hero.priceNumber}`
        );
    }

    private goBack():void{
        this.sndBtn.play();
        this.game.popScene();
    }

    private createSplashVertical():void{
        let height:number = 0;
        let x:number = 0;
        const points:Point2d[] = [];
        while (height<this.game.size.height) {
            points.push(new Point2d(x,height));
            x+=MathEx.randomInt(-50,50);
            height+=MathEx.randomInt(10,100);
        }
        const pl = PolyLine.fromPoints(this.game,points,{lineWidth:MathEx.randomInt(2,7)});
        pl.color.setFrom(Color.RGB(
            MathEx.randomInt(100,122) as Uint8,
            MathEx.randomInt(100,122) as Uint8,
            MathEx.randomInt(150,255) as Uint8,
        ));
        pl.pos.setX(MathEx.randomInt(0,this.game.size.width));
        this.lightContainer.appendChild(pl);
        this.setTimeout(()=>{
            this.lightContainer.removeChild(pl);
        },MathEx.randomInt(200,2000));
    }

    private  createSplashHorizontal():void{
        let width:number = 0;
        let y:number = 0;
        const points:Point2d[] = [];
        while (width<this.game.size.width) {
            points.push(new Point2d(width,y));
            y+=MathEx.randomInt(-50,50);
            width+=MathEx.randomInt(10,100);
        }
        const pl = PolyLine.fromPoints(this.game,points,{lineWidth:MathEx.randomInt(2,7)});
        pl.color.setFrom(Color.RGB(
            MathEx.randomInt(100,122) as Uint8,
            MathEx.randomInt(100,122) as Uint8,
            MathEx.randomInt(150,255) as Uint8,
        ));
        pl.pos.setY(MathEx.randomInt(0,this.game.size.height));
        this.lightContainer.appendChild(pl);
        this.setTimeout(()=>{
            this.lightContainer.removeChild(pl);
        },MathEx.randomInt(200,2000));
    }


}
