import {Scene, SCENE_EVENTS} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {Game} from "@engine/core/game";
import {Hero} from "../entity/actor/impl/hero";
import {Monster1} from "../entity/actor/impl/monster1";
import {IExtraProperties} from "../entity/actor/abstract/abstractCharacter";
import {Wall} from "../entity/object/impl/wall";
import {Optional} from "@engine/core/declarations";
import {Burster} from "../entity/misc/burster";
import {Size} from "@engine/geometry/size";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {Color} from "@engine/renderer/common/color";
import {MathEx} from "@engine/misc/mathEx";
import {Zombie} from "../entity/actor/impl/zombie";
import {Monster2} from "../entity/actor/impl/monster2";
import {BloodDrop} from "../entity/object/impl/bloodDrop";
import {TestTube} from "../entity/object/impl/testTube";
import {Lava} from "../entity/object/impl/lava";
import {Water} from "../entity/object/impl/water";
import {Bullet} from "../entity/object/impl/bullet";
import {Sound} from "@engine/media/sound";
import {InfoPanel} from "../entity/object/impl/infoPanel";
import {Image} from "@engine/renderable/impl/general/image";
import {GenericSprite} from "../entity/sprite/genericSprite";
import {Virus} from "../entity/object/impl/virus";
import {Fan} from "../entity/object/impl/fan";
import {SimpleTouchPad} from "@engine/control/screenTouchPad/simpleTouchPad";

type LEVEL_SCHEMA = typeof import("../level/l1.json");

export class MainScene extends Scene {

    @Resource.Texture('./catGame/res/sprite/cat.png')
    private spriteSheetHero: ITexture;

    @Resource.Texture('./catGame/res/sprite/wall1.png')
    private wall1: ITexture;

    @Resource.Texture('./catGame/res/sprite/wall2.png')
    private wall2: ITexture;

    @Resource.Texture('./catGame/res/sprite/monster1.png')
    private spriteSheetMonster1: ITexture;

    @Resource.Texture('./catGame/res/sprite/lava.png')
    private spriteSheetLava: ITexture;

    @Resource.Texture('./catGame/res/sprite/water.png')
    private spriteSheetWater: ITexture;

    @Resource.Texture('./catGame/res/sprite/monster2.png')
    private spriteSheetMonster2: ITexture;

    @Resource.Texture('./catGame/res/sprite/virus.png')
    private spriteSheetVirus: ITexture;

    @Resource.Texture('./catGame/res/sprite/zombie.png')
    private spriteSheetZombie: ITexture;

    @Resource.Texture('./catGame/res/sprite/fan.png')
    private spriteSheetFan: ITexture;

    @Resource.Texture('./catGame/res/sprite/bloodDrop.png')
    private spriteSheetBloodDrop: ITexture;

    @Resource.Texture('./catGame/res/sprite/cloud.png')
    private spriteSheetCloud: ITexture;

    @Resource.Texture('./catGame/res/sprite/ironCar.png')
    private spriteSheetIronCar: ITexture;

    @Resource.Texture('./catGame/res/sprite/car.png')
    private spriteSheetCar: ITexture;

    @Resource.Texture('./catGame/res/sprite/testTube.png')
    private spriteSheetTestTube: ITexture;

    @Resource.Texture('./catGame/res/sprite/bullet3.png')
    private spriteSheetBullet: ITexture;

    @Resource.Texture('./catGame/res/sprite/tree.png')
    private spriteSheetTree: ITexture;

    @Resource.Texture('./catGame/res/sprite/table.png')
    private spriteSheetTable: ITexture;

    @Resource.Sound('./catGame/res/sound/theme2.mp3')
    private soundTheme: Sound;

    @Resource.Sound('./catGame/res/sound/hurt.mp3')
    private soundHurt: Sound;

    @Resource.Sound('./catGame/res/sound/hurt.mp3')
    private soundHurt2: Sound;

    @Resource.Sound('./catGame/res/sound/shoot.mp3')
    private soundShoot: Sound;

    @Resource.Sound('./catGame/res/sound/jump.mp3')
    private soundJump: Sound;

    @Resource.Sound('./catGame/res/sound/pick.mp3')
    private soundPick: Sound;

    private level: LEVEL_SCHEMA;

    private touchPad:SimpleTouchPad;

    constructor(game: Game, level: LEVEL_SCHEMA, private numOfLives:number){
        super(game);
        this.level = level;
    }

    public override onReady():void {

        this.setBg();
        this.playTheme();
        this.setUpClouds();
        this.loadLevel();
        this.createUI();
        this.createTouchPad();
    }

    public override onInactivated(): void {
        super.onInactivated();
        if (this.touchPad!==undefined) this.touchPad.releaseAllButtons();
    }

    private extractExtraProperties(properties?: ({ name: string, value: any })[]): IExtraProperties {
        if (!properties) return {};
        const obj: Record<string, any> = {};
        properties.forEach(p => obj[p.name] = p.value);
        return obj;
    }

    private playTheme():void {
        const sound:Sound = this.soundTheme;
        sound.loop = true;
        sound.play();
        this.sceneEventHandler.on(SCENE_EVENTS.INACTIVATED, ()=>{
            sound.stop();
        });
    }

    private setBg():void {
        const bgLayer: Layer = new Layer(this.game);
        bgLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        const bgImage: Rectangle = new Rectangle(this.game);
        bgImage.lineWidth = 0;
        bgImage.size.set(this.game.size);
        const grad: LinearGradient = new LinearGradient();
        grad.setColorAtPosition(0, Color.RGB(219, 230, 255));
        grad.setColorAtPosition(1, Color.RGB(208, 202, 202));
        grad.angle = -MathEx.degToRad(90);
        bgImage.fillGradient = grad;
        bgLayer.appendChild(bgImage);
        this.appendChild(bgLayer);
        this.appendChild(new Layer(this.game));
    }

    private setUpClouds():void{
        const numOfClouds:number = 5;
        const clouds:Image[] = [];
        for (let i = 0; i < numOfClouds; i++) {
            const cloud:Image = new Image(this.game,this.spriteSheetCloud);
            cloud.pos.setXY(MathEx.random(-500,500),MathEx.random(0,100));
            cloud.velocity.x = -MathEx.random(10,50);
            cloud.alpha = 0.1;
            clouds.push(cloud);
            this.appendChild(cloud);
        }
        this.setInterval(()=>{
            clouds.forEach(c=>{
                if (c.pos.x<-500) c.pos.x = this.game.getCurrentScene().size.width+ 500;
            });
        },1000);
    }

    private loadLevel():void {

        this.level.layers[0].objects.forEach(obj => {
            let objCreated: Optional<GenericSprite>;
            let needCorrection:boolean = true;
            const extraProperties: IExtraProperties = this.extractExtraProperties(obj.properties);
            switch (obj.type) {
                case Hero.groupName:
                    const hero:Hero = new Hero(this.game, this.spriteSheetHero);
                    hero.injectResources({
                        soundShoot:this.soundShoot,
                        soundHurt:this.soundHurt,
                        soundJump: this.soundJump,
                        soundPick: this.soundPick,
                    });
                    objCreated = hero;
                    break;
                case Monster1.groupName:
                    objCreated = new Monster1(this.game, this.spriteSheetMonster1,this.soundHurt2);
                    break;
                case Monster2.groupName:
                    objCreated = new Monster2(this.game, this.spriteSheetMonster2,this.soundHurt2);
                    break;
                case Zombie.groupName:
                    objCreated = new Zombie(this.game, this.spriteSheetZombie,this.soundHurt2);
                    break;
                case BloodDrop.groupName:
                    objCreated = new BloodDrop(this.game, this.spriteSheetBloodDrop);
                    break;
                case Virus.groupName:
                    objCreated = new Virus(this.game, this.spriteSheetVirus);
                    break;
                case TestTube.groupName:
                    objCreated = new TestTube(this.game, this.spriteSheetTestTube);
                    break;
                case Fan.groupName:
                    objCreated = new Fan(this.game, this.spriteSheetFan);
                    break;
                case Lava.groupName:
                    objCreated = new Lava(this.game, this.spriteSheetLava, new Size(obj.width, obj.height));
                    needCorrection = false;
                    break;
                case Water.groupName:
                    objCreated = new Water(this.game, this.spriteSheetWater, new Size(obj.width, obj.height));
                    needCorrection = false;
                    break;
                case Wall.groupName:
                    if (extraProperties.toX) extraProperties.fromX = obj.x;
                    if (extraProperties.toY) extraProperties.fromY = obj.y;
                    const wallResource: ITexture = (extraProperties.toX || extraProperties.toY) ?
                        this.wall2 : this.wall1;
                    objCreated = new Wall(this.game, new Size(obj.width, obj.height), wallResource, extraProperties);
                    needCorrection = false;
                    break;
                case 'tree':
                    objCreated = new GenericSprite(this.game,this.spriteSheetTree);
                    break;
                case 'table':
                    objCreated = new GenericSprite(this.game,this.spriteSheetTable);
                    break;
                case 'ironCar':
                    objCreated = new GenericSprite(this.game,this.spriteSheetIronCar);
                    break;
                case 'car':
                    objCreated = new GenericSprite(this.game,this.spriteSheetCar);
                    break;
                default:
                    break;
            }
            if (objCreated !== undefined) {
                objCreated.getRenderableModel().pos.setXY(obj.x, obj.y);
                if (needCorrection) objCreated.getRenderableModel().pos.y-=obj.height;
            }
        });
        Burster.instantiate(this.game);
        Bullet.init(this.spriteSheetBullet);
        this.fitSizeToChildren();
    }

    private createUI(): void{
        const uiLayer: Layer = new Layer(this.game);
        uiLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        this.appendChild(uiLayer);
        InfoPanel.instantiate(this.game,this.spriteSheetHero);
        InfoPanel.getCreatedInstance().updateNumOfLives(this.numOfLives);
    }

    private createTouchPad():void {
        const touchPadLayer:Layer = new Layer(this.game);
        touchPadLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        this.appendChild(touchPadLayer);
        this.touchPad  = new SimpleTouchPad(this.game);
        this.touchPad.appendTo(touchPadLayer);
    }

}


