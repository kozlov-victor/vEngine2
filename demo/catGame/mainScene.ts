import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Game} from "@engine/core/game";
import {Hero} from "./entity/actor/impl/hero";
import {Monster1} from "./entity/actor/impl/monster1";
import {IExtraProperties} from "./entity/actor/abstract/abstractCharacter";
import {Wall} from "./entity/object/impl/wall";
import {Optional} from "@engine/core/declarations";
import {Burster} from "./entity/misc/burster";
import {Size} from "@engine/geometry/size";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {Color} from "@engine/renderer/common/color";
import {MathEx} from "@engine/misc/mathEx";
import {Zombie} from "./entity/actor/impl/zombie";
import {Monster2} from "./entity/actor/impl/monster2";
import {AbstractEntity} from "./entity/abstract/abstractEntity";
import {BloodDrop} from "./entity/object/impl/bloodDrop";
import {TestTube} from "./entity/object/impl/testTube";
import {Lava} from "./entity/object/impl/lava";
import {Water} from "./entity/object/impl/water";
import {Bullet} from "./entity/object/impl/bullet";
import {Sound} from "@engine/media/sound";
import {InfoPanel} from "./entity/object/impl/infoPanel";

type LEVEL_SCHEMA = typeof import("./level/l1.json");

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

    @Resource.Texture('./catGame/res/sprite/zombie.png')
    private spriteSheetZombie: ITexture;

    @Resource.Texture('./catGame/res/sprite/bloodDrop.png')
    private spriteSheetBloodDrop: ITexture;

    @Resource.Texture('./catGame/res/sprite/testTube.png')
    private spriteSheetTestTube: ITexture;

    @Resource.Texture('./catGame/res/sprite/bullet3.png')
    private spriteSheetBullet: ITexture;

    @Resource.Sound('./catGame/res/sound/theme2.ogg')
    private soundTheme1: Sound;

    @Resource.Sound('./catGame/res/sound/hurt.ogg')
    private soundHurt: Sound;

    @Resource.Sound('./catGame/res/sound/hurt.ogg')
    private soundHurt2: Sound;

    @Resource.Sound('./catGame/res/sound/shoot.ogg')
    private soundShoot: Sound;

    @Resource.Sound('./catGame/res/sound/jump.ogg')
    private soundJump: Sound;

    @Resource.Sound('./catGame/res/sound/pick.ogg')
    private soundPick: Sound;

    private level: LEVEL_SCHEMA;

    constructor(game: Game, level: LEVEL_SCHEMA) {
        super(game);
        this.level = level;
    }

    public onReady():void {

        this.game.setPhysicsSystem(ArcadePhysicsSystem);
        this.setBg();
        this.playTheme();
        this.loadLevel();
        this.createUI();
        this.game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
    }

    private extractExtraProperties(properties?: ({ name: string, value: any })[]): IExtraProperties {
        if (!properties) return {};
        const obj: Record<string, any> = {};
        properties.forEach(p => obj[p.name] = p.value);
        return obj;
    }

    private playTheme():void {
        const sound:Sound = this.soundTheme1;
        sound.loop = true;
        sound.play();
    }

    private setBg():void {
        const bgLayer: Layer = new Layer(this.game);
        bgLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        const bgImage: Rectangle = new Rectangle(this.game);
        bgImage.lineWidth = 0;
        bgImage.size.set(this.game.size);
        const grad: LinearGradient = new LinearGradient();
        grad.setColorAtPosition(0,Color.RGB(219, 230, 255));
        grad.setColorAtPosition(1,Color.RGB(208, 202, 202));
        grad.angle = -MathEx.degToRad(90);
        bgImage.fillGradient = grad;
        bgLayer.appendChild(bgImage);
        this.appendChild(bgLayer);
        this.appendChild(new Layer(this.game));
    }

    private loadLevel():void {

        this.level.layers[0].objects.forEach(obj => {
            let objCreated: Optional<AbstractEntity>;
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
                case TestTube.groupName:
                    objCreated = new TestTube(this.game, this.spriteSheetTestTube);
                    break;
                case Lava.groupName:
                    objCreated = new Lava(this.game, this.spriteSheetLava, new Size(obj.width, obj.height));
                    break;
                case Water.groupName:
                    objCreated = new Water(this.game, this.spriteSheetWater, new Size(obj.width, obj.height));
                    break;
                case Wall.groupName:
                    if (extraProperties.toX) extraProperties.fromX = obj.x;
                    if (extraProperties.toY) extraProperties.fromY = obj.y;
                    const wallResource: ITexture = (extraProperties.toX || extraProperties.toY) ?
                        this.wall2 : this.wall1;
                    objCreated = new Wall(this.game, new Size(obj.width, obj.height), wallResource, extraProperties);
                    break;
                default:
                    break;
            }
            if (objCreated !== undefined) {
                objCreated.getRenderableModel().pos.setXY(obj.x, obj.y);
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
    }

}


