import {MkAbstractScene} from "./mkAbstractScene";
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TEXT_ALIGN, TextField, WORD_BRAKE} from "@engine/renderable/impl/ui/components/textField";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import {createScaleTweenMovie} from "../utils/miscFunctions";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {EasingBounce} from "@engine/misc/easing/functions/bounce";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {HexagonalFilter} from "@engine/renderer/webGl/filters/texture/hexagonalFilter";
import {MathEx} from "@engine/misc/mathEx";
import {BlackWhiteFilter} from "@engine/renderer/webGl/filters/texture/blackWhiteFilter";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {Sound} from "@engine/media/sound";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MkDescribeHeroScene} from "./mkDescribeHeroScene";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {TrianglesMosaicFilter} from "@engine/renderer/webGl/filters/texture/trianglesMosaicFilter";
import {HEROES_DESCRIPTION, IItemDescription} from "../assets/images/heroes/description/heroesDescription";
import {VignetteFilter} from "@engine/renderer/webGl/filters/texture/vignetteFilter";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {GlowFilter} from "@engine/renderer/webGl/filters/texture/glowFilter";


class TabStrip {


    private linkByUrl: Record<string,ResourceLink<ITexture>> = {};

    private root:Rectangle = new Rectangle(this.game);
    private cell1:RenderableModel;
    private cell2:RenderableModel;
    private cell3:RenderableModel;
    private selectedIndex:number = 2;
    private emptyResourceLink:ResourceLink<ITexture>;
    private readonly CELL_WIDTH:number = 340;
    private readonly CELL_HEIGHT:number = 400;

    constructor(private game:Game){
        this.root.pos.setXY(0,250);
        this.root.size.setWH(0,400);
        (this.root.fillColor as Color).setRGB(12,12,12);
    }

    public preload(){
        this.emptyResourceLink = this.game.getCurrScene().resourceLoader.loadTexture('./mk-alfa/assets/images/heroes/empty.jpg');
        HEROES_DESCRIPTION.forEach(it=>{
            this.linkByUrl[it.url] = this.game.getCurrScene().resourceLoader.loadTexture(`./mk-alfa/assets/images/heroes/${it.url}`);
        });
    }

    public onReady(){
        this.cell1 = this.addCell();
        this.cell2 = this.addCell(false);
        this.cell3 = this.addCell();
        this.cell2.moveToFront();
        this.updateImages();
        this.animateSelected();

        const splashContainer = new NullGameObject(this.game);
        this.game.getCurrScene().appendChild(splashContainer);
        const glow = new GlowFilter(this.game,0.01,10);
        splashContainer.filters = [glow];

        this.game.getCurrScene().setInterval(()=>{
            if (MathEx.randomInt(0,10)> 5) {
                const numOfSplashes:number = MathEx.randomInt(1,5);
                for (let i=0;i<numOfSplashes;i++) this.createSplashVertical(splashContainer);
                glow.enabled = MathEx.random(0,5)>3;
                if (glow.enabled) {
                    glow.setGlowColor(Color.RGB(
                        MathEx.randomInt(0,200) as byte,
                        MathEx.randomInt(100,255) as byte,
                        MathEx.randomInt(0,200) as byte,
                    ));
                }

            }
        },200);


        const f = new TrianglesMosaicFilter(this.game);
        this.cell2.children[0].filters = [f];
        this.game.getCurrScene().setInterval(()=>{
            if (MathEx.randomInt(0,10)> 5) {
                f.enabled = true;
                this.game.getCurrScene().setTimeout(()=>{f.enabled = false;},MathEx.randomInt(20,500));
            }
        },1000);
    }


    public getRoot():RenderableModel{
        return this.root;
    }

    public goNext(){
        this.selectedIndex++;
        if (this.selectedIndex>HEROES_DESCRIPTION.length-1) this.selectedIndex=HEROES_DESCRIPTION.length-1;
        else this.updateImages();
    }

    public goPrev(){
        this.selectedIndex--;
        if (this.selectedIndex<0) this.selectedIndex=0;
        else this.updateImages();
    }

    public getSelectedIndex():number{
        return this.selectedIndex;
    }

    private addCell(withFilters:boolean = true):RenderableModel{
        const currSize:number = this.root.size.width;
        this.root.size.setW(currSize+this.CELL_WIDTH);
        const rectWrap:Rectangle = new Rectangle(this.game);
        (rectWrap.fillColor as Color).setRGB(44,44,2);
        rectWrap.color.setRGB(0,0,0);
        rectWrap.size.setWH(this.CELL_WIDTH,this.CELL_HEIGHT);
        rectWrap.pos.setX(currSize);
        this.root.appendChild(rectWrap);
        rectWrap.transformPoint.setToCenter();
        if (withFilters) rectWrap.filters = [new NoiseHorizontalFilter(this.game), new BlackWhiteFilter(this.game)];

        const img:Image = new Image(this.game);
        img.setResourceLink(this.emptyResourceLink);
        img.borderRadius = 20;
        rectWrap.appendChild(img);

        return rectWrap;
    }

    private createSplashVertical(splashContainer:NullGameObject){
        const pl = new PolyLine(this.game);
        pl.lineWidth = MathEx.randomInt(2,7);
        pl.color = Color.RGB(
            MathEx.randomInt(200,222) as byte,
            MathEx.randomInt(200,222) as byte,
            MathEx.randomInt(15,25) as byte,
        );
        let height:number = 0;
        while (height<this.CELL_HEIGHT) {
            const dh:number = MathEx.randomInt(10,100);
            pl.lineBy(MathEx.randomInt(-50,50),dh);
            height+=dh;
        }
        pl.pos.setX(MathEx.randomInt(0,this.game.size.width));
        splashContainer.appendChild(pl);
        this.game.getCurrScene().setTimeout(()=>{
            splashContainer.removeChild(pl);
        },MathEx.randomInt(200,500));
    }

    private animateSelected():void{
        const time = 900;
        const from = 1;
        const to = 1.4;
        const tm:TweenMovie = new TweenMovie(this.game);
        tm.addTween(0,{
            target:{val:from},
            progress:(obj:{val:number})=>{
                this.cell2.scale.setXY(obj.val);
            },
            time,
            from:{val:from},
            to:{val:to},
            ease: EasingBounce.Out
        });
        tm.addTween(time,{
            target:{val:to},
            progress:(obj:{val:number})=>{
                this.cell2.scale.setXY(obj.val);
            },
            time,
            from:{val:to},
            to:{val:from},
        });
        tm.loop(true);
        this.game.getCurrScene().addTweenMovie(tm);
    }

    private updateImage(desc:IItemDescription,img:Image){
        if (desc===undefined) {
            img.setResourceLink(this.emptyResourceLink);
        }
        else {
            img.setResourceLink(this.linkByUrl[desc.url]);
        }
    }

    private updateImages(){
        const prev = HEROES_DESCRIPTION[this.selectedIndex-1];
        const curr = HEROES_DESCRIPTION[this.selectedIndex];
        const next = HEROES_DESCRIPTION[this.selectedIndex+1];
        this.updateImage(prev,this.cell1.children[0] as Image);
        this.updateImage(curr,this.cell2.children[0] as Image);
        this.updateImage(next,this.cell3.children[0] as Image);
    }



}

export class MkSelectHeroScene extends MkAbstractScene {

    private fnt:Font;
    private logoLink:ResourceLink<ITexture>;
    private soundLink1:ResourceLink<void>;
    private soundLink2:ResourceLink<void>;
    private soundLinkTheme:ResourceLink<void>;
    private tabStrip:TabStrip;
    private nextScene:MkDescribeHeroScene;

    public onPreloading(): void {
        super.onPreloading();


        this.tabStrip = new TabStrip(this.game);
        this.tabStrip.preload();
        this.fnt = new Font(this.game);
        this.fnt.fontSize = 80;
        this.fnt.fontFamily = 'MK4';
        this.fnt.fontColor = Color.RGB(255,255,10);

        this.resourceLoader.addNextTask(()=>{
            this.fnt.generate();
        });

        this.logoLink = this.resourceLoader.loadTexture('./mk-alfa/assets/images/mkLogo.png');
        this.soundLink1 = this.resourceLoader.loadSound('./mk-alfa/assets/sounds/btn2.wav');
        this.soundLink2 = this.resourceLoader.loadSound('./mk-alfa/assets/sounds/btn.wav');
        this.soundLinkTheme = this.resourceLoader.loadSound('./mk-alfa/assets/sounds/theme.mp3');
        this.filters = [new VignetteFilter(this.game)];
    }

    public onReady(): void {
        super.onReady();
        this.tabStrip.onReady();

        this.on(MOUSE_EVENTS.doubleClick, ()=>{
            this.game.getRenderer().requestFullScreen();
        });

        const theme:Sound = new Sound(this.game);
        theme.loop = true;
        theme.setResourceLink(this.soundLinkTheme);
        theme.play();

        const img:Image = new Image(this.game);
        img.setResourceLink(this.logoLink);
        this.appendChild(img);
        img.transformPoint.setToCenter();
        img.pos.setXY(70,10);
        img.alpha = 0.2;
        const logoFilter = new HexagonalFilter(this.game);
        img.filters = [logoFilter];
        this.setInterval(()=>{
            img.angle3d.y+=0.1;
            logoFilter.enabled = MathEx.randomInt(0,10)>5;
        },100);

        const nullContainer = new NullGameObject(this.game);
        this.appendChild(nullContainer);
        const nf = new NoiseFilter(this.game);
        nf.setIntensivity(0.3);
        nullContainer.filters = [nf];
        nullContainer.size.setWH(this.game.size.width,100);
        nullContainer.transformPoint.setToCenter();
        createScaleTweenMovie(this.game,0.95,1.05,800,nullContainer);

        const tf:TextField = new TextField(this.game);
        tf.setFont(this.fnt);
        tf.setTextAlign(TEXT_ALIGN.CENTER);
        tf.setWordBreak(WORD_BRAKE.PREDEFINED);
        tf.pos.setXY(160,40);
        tf.setText("Select your Hero");
        nullContainer.appendChild(tf);

        this.appendChild(this.tabStrip.getRoot());

        const sndSelect:Sound = new Sound(this.game);
        sndSelect.setResourceLink(this.soundLink1);
        this.on(GAME_PAD_EVENTS.buttonPressed, e=>{
            if (e.button===GAME_PAD_BUTTON.STICK_L_LEFT || e.button===GAME_PAD_BUTTON.D_PAD_LEFT) {
                this.tabStrip.goPrev();
                sndSelect.play();
            }
            else if (e.button===GAME_PAD_BUTTON.STICK_L_RIGHT  || e.button===GAME_PAD_BUTTON.D_PAD_RIGHT) {
                this.tabStrip.goNext();
                sndSelect.play();
            }
            else if (e.button===GAME_PAD_BUTTON.BTN_A) {
                this.gotoDescriptionScene();
            }
        });
        this.on(KEYBOARD_EVENTS.keyPressed, (e)=>{
            if (e.key===KEYBOARD_KEY.LEFT) {
                this.tabStrip.goPrev();
                sndSelect.play();
            }
            else if (e.key===KEYBOARD_KEY.RIGHT) {
                this.tabStrip.goNext();
                sndSelect.play();
            }
            else if (e.key===KEYBOARD_KEY.ENTER) {
                this.gotoDescriptionScene();
            }
        });

    }

    private gotoDescriptionScene(){
        const sndSelect:Sound = new Sound(this.game);
        sndSelect.setResourceLink(this.soundLink2);
        sndSelect.play();
        if (this.nextScene===undefined) this.nextScene = new MkDescribeHeroScene(this.game);
        this.nextScene.selectedIndex = this.tabStrip.getSelectedIndex();
        this.game.pushScene(this.nextScene,new CurtainsOpeningTransition(this.game));
    }

}