import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TEXT_ALIGN, TextField, WORD_BRAKE} from "@engine/renderable/impl/ui/components/textField";
import {Image} from "@engine/renderable/impl/general/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {createGlowTweenFilter, createScaleTweenMovie} from "../utils/miscFunctions";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {MotionBlurFilter} from "@engine/renderer/webGl/filters/texture/motionBlurFilter";
import {MathEx} from "@engine/misc/mathEx";
import {GAME_PAD_EVENTS, GamePadEvent} from "@engine/control/gamepad/gamePadEvents";
import {MkSelectHeroScene} from "./mkSelectHeroScene";
import {Sound} from "@engine/media/sound";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MkAbstractScene} from "./mkAbstractScene";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {PixelFilter} from "@engine/renderer/webGl/filters/texture/pixelFilter";
import {LowResolutionFilter} from "@engine/renderer/webGl/filters/texture/lowResolutionFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ParticleSystem} from "@engine/renderable/impl/general/particleSystem";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Shape} from "@engine/renderable/abstract/shape";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";

export class MkDescribeHeroScene extends MkAbstractScene {

    public selectedIndex:number = 0;

    private fnt:Font;
    private logoLink:ResourceLink<ITexture>;
    private lightContainer:NullGameObject = new NullGameObject(this.game);

    public onPreloading(): void {
        super.onPreloading();

        this.fnt = new Font(this.game);
        this.fnt.fontSize = 80;
        this.fnt.fontFamily = 'MK4';
        this.fnt.fontColor = Color.RGB(233,233,60);

        this.resourceLoader.addNextTask(()=>{
            this.fnt.generate();
        });

        this.logoLink = this.resourceLoader.loadImage('./mk-alfa/assets/images/mkLogo.png');

    }

    public onReady(): void {

        super.onReady();

        this.appendChild(this.lightContainer);
        const lightFilter = new WaveFilter(this.game);
        lightFilter.setAmplitude(0.1);
        this.lightContainer.filters = [lightFilter];

        const circle:Circle = new Circle(this.game);
        circle.radius = MathEx.random(1,4);
        circle.transformPoint.setXY(circle.radius/2,circle.radius/2);
        (circle.fillColor as Color).setRGBA(122,200,0);

        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setWH(MathEx.random(1,3));
        rect.transformPoint.setXY(rect.size.width/2,rect.size.height/2);
        (rect.fillColor as Color).setRGBA(0,200,0);

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticle(circle);
        ps.addParticle(rect);
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
        },500);

        ps.numOfParticlesToEmit = {from:50,to:100};
        ps.particleLiveTime = {from:100,to:500};
        ps.particleAngle = {from:0,to:2*Math.PI};
        this.appendChild(ps);


        const tf:TextField = new TextField(this.game);
        tf.setFont(this.fnt);
        tf.setTextAlign(TEXT_ALIGN.CENTER);
        tf.setWordBreak(WORD_BRAKE.FIT);
        tf.pos.setY(100);
        tf.layoutWidth = this.game.size.width;
        tf.setText(
            "Our hero is\n" + this.selectedIndex + ". (Long name test string 123456). Take the price with number 8"
        );
        tf.layoutWidth = this.game.size.width;
        tf.maxWidth = this.game.size.width;
        this.appendChild(tf);

        this.on(GAME_PAD_EVENTS.buttonPressed, e=>{
            this.game.popScene();
        });
        this.on(KEYBOARD_EVENTS.keyPressed, (e)=>{
            this.game.popScene();
        });

        const sceneFilter = new NoiseHorizontalFilter(this.game);
        this.filters = [sceneFilter];

        this.setInterval(()=>{
            if (MathEx.randomInt(0,50)<25) {
                this.game.camera.shake(5,200);
                const splashes:number = MathEx.randomInt(2,8);
                for (let i=0;i<splashes;i++) this.createSplash();
            }
        },1000);

    }

    private  createSplash(){
        const pl = new PolyLine(this.game);
        pl.lineWidth = MathEx.randomInt(2,7);
        pl.color = Color.RGB(
            MathEx.randomInt(100,122) as byte,
            MathEx.randomInt(100,122) as byte,
            MathEx.randomInt(150,255) as byte,
        );
        let height:number = 0;
        while (height<this.game.size.height) {
            const dh:number = MathEx.randomInt(10,100);
            pl.lineBy(MathEx.randomInt(-50,50),dh);
            height+=dh;
        }
        pl.pos.setX(MathEx.randomInt(0,this.game.size.width));
        this.lightContainer.appendChild(pl);
        this.setTimeout(()=>{
            this.lightContainer.removeChild(pl);
        },MathEx.randomInt(200,2000));
    }


}