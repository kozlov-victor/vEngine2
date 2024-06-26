import {Scene} from "@engine/scene/scene";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {PrayResourcesHolder} from "./prayResourcesHolder";
import {MotionBlurFilter} from "@engine/renderer/webGl/filters/texture/motionBlurFilter";
import {Tween} from "@engine/animation/tween";
import {EasingSine} from "@engine/misc/easing/functions/sine";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {CellFrameAnimation} from "@engine/animation/frameAnimation/cellFrameAnimation";
import {ParticleSystem} from "@engine/renderable/impl/general/partycleSystem/particleSystem";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {InsetBorder} from "@engine/renderable/impl/geometry/insetBorder";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Image} from "@engine/renderable/impl/general/image/image";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.ResourceHolder()
    public readonly r:PrayResourcesHolder;


    public override onReady():void {

        this.backgroundColor.setRGB(12,12,12);
        this.game.addControl(KeyboardControl);
        const tf:TextField = new TextField(this.game,this.r.themeFont);
        tf.size.setWH(615,500);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setWordBrake(WordBrake.FIT);
        tf.setPadding(10);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.pos.setXY(90,23);
        tf.textColor.setRGBA(255,255,255,0);
        tf.setText(this.r.text);
        this.appendChild(tf);

        const f = new MotionBlurFilter(this.game);
        this.filters = [f];
        const strength = {val:0.5};
        this.addTween(new Tween(this.game,{
            target: strength,
            to: {val:0},
            time: 3000,
            progress: e=>f.setStrength(e.val),
            ease: EasingSine.Out,
        }));


        const btn = new Button(this.game,this.r.buttonFont);
        btn.textColor.setRGB(255,0,0);
        btn.setText("Отримати благословєння");
        btn.size.setWH(300,100);
        btn.pos.setXY(240,430);
        btn.textColor.setRGBA(255,255,255,0);

        const bgNormal:Rectangle = new Rectangle(this.game);
        bgNormal.fillColor = ColorFactory.fromCSS('#5b5656');
        const insetBorder:InsetBorder = new InsetBorder(this.game);
        insetBorder.setColor1(ColorFactory.fromCSS('#a7a5a5'));
        insetBorder.setColor2(ColorFactory.fromCSS('#6d6c6c'));
        insetBorder.setBorderWidth(5);
        bgNormal.appendChild(insetBorder);

        const bgActive:Rectangle = new Rectangle(this.game);
        bgActive.fillColor = ColorFactory.fromCSS('#8d8a8a');
        const outsetBorder:InsetBorder = new InsetBorder(this.game);
        outsetBorder.setColor1(ColorFactory.fromCSS('#6d6c6c'));
        outsetBorder.setColor2(ColorFactory.fromCSS('#a7a5a5'));
        outsetBorder.setBorderWidth(5);
        bgActive.appendChild(outsetBorder);

        btn.setBackground(bgNormal);
        btn.setBackgroundActive(bgActive);
        btn.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, e=>{
            btn.visible = false;
            tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
            tf.setAlignText(AlignText.CENTER);
            tf.setText('Йдіть з миром та благословенні будьте у Господі');
        });
        this.appendChild(btn);


        const animatedImage:AnimatedImage = new AnimatedImage(this.game,this.r.fireTexture);
        animatedImage.blendMode = BLEND_MODE.ADDITIVE;
        const anim:CellFrameAnimation = new CellFrameAnimation(this.game,{
            frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
            isRepeating: true,
            duration: 1200,
            numOfFramesHorizontally: 4,
            numOfFramesVertically: 4,
        });
        animatedImage.addFrameAnimation(anim);
        anim.play();
        animatedImage.scale.setXY(0.5);
        animatedImage.transformPoint.setToCenter();

        const ps: ParticleSystem = new ParticleSystem(this.game);
        ps.addParticlePrefab(animatedImage);
        ps.emissionRadius = 2;

        const pi:number = Math.PI;
        ps.numOfParticlesToEmit = {from:1,to:1};
        ps.particleLiveTime = {from:300,to:500};
        ps.particleAngle = {from:-pi/2 - pi/16,to:pi/2 + pi/16};
        ps.particleVelocity = {from:10,to:20};

        this.appendChild(ps);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e)=>{
            ps.emissionPosition.setXY(e.screenX - animatedImage.size.width/2,e.screenY-animatedImage.size.height/2);
        });

        const bg = new Image(this.game,this.r.bgTexture);
        this.appendChild(bg);


    }

}

