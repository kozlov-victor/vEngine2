import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Source} from "@engine/resources/resourceDecorators";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
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
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {Color} from "@engine/renderer/common/color";
import {MathEx} from "@engine/misc/mathEx";
import {Zombie} from "./entity/actor/impl/zombie";
import {Monster2} from "./entity/actor/impl/monster2";
import {AbstractEntity} from "./entity/abstract/abstractEntity";
import {BloodDrop} from "./entity/object/impl/bloodDrop";
import {TestTube} from "./entity/object/impl/testTube";

type LEVEL_SCHEMA = typeof import("./level/l1.json");

export class MainScene extends Scene {

    @Source.Texture('./catGame/res/sprite/cat.png')
    private spriteSheetHero:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/wall1.png')
    private wall1:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/wall2.png')
    private wall2:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/monster1.png')
    private spriteSheetMonster1:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/monster2.png')
    private spriteSheetMonster2:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/zombie.png')
    private spriteSheetZombie:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/bloodDrop.png')
    private spriteSheetBloodDrop:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/testTube.png')
    private spriteSheetTestTube:ResourceLink<ITexture>;

    private level:LEVEL_SCHEMA;

    constructor(game: Game,level:LEVEL_SCHEMA) {
        super(game);
        this.level = level;
    }

    public onReady() {
        this.game.setPhysicsSystem(ArcadePhysicsSystem);
        this.loadLevel();
        this.size.setWH(650, 480);
        this.game.getRenderer<WebGlRenderer>().setPixelPerfectMode(true);
    }

    private extractExtraProperties(properties?:({name:string,value:any})[]):IExtraProperties {
        if (!properties) return {};
        const obj:Record<string, any> = {};
        properties.forEach(p=>obj[p.name]=p.value);
        const possible = properties.find(it=>it.name===name);
        return obj;
    }

    private loadLevel(){

        const bgLayer:Layer = new Layer(this.game);
        bgLayer.transformType = LayerTransformType.STICK_TO_CAMERA;
        const bgImage:Rectangle = new Rectangle(this.game);
        bgImage.lineWidth = 0;
        bgImage.size.set(this.game.size);
        const grad:LinearGradient = new LinearGradient();
        grad.colorFrom = Color.RGB(219,230,255);
        grad.colorTo = Color.RGB(208,202,202);
        grad.angle = -MathEx.degToRad(90);
        bgImage.fillColor = grad;
        bgLayer.appendChild(bgImage);
        this.addLayer(bgLayer);
        this.addLayer(new Layer(this.game));

        this.level.layers[0].objects.forEach(obj=>{
            let objCreated:Optional<AbstractEntity>;
            const extraProperties:IExtraProperties = this.extractExtraProperties(obj.properties);
            switch (obj.type) {
                case Hero.groupName:
                    objCreated = new Hero(this.game,this.spriteSheetHero);
                    break;
                case Monster1.groupName:
                    objCreated = new Monster1(this.game,this.spriteSheetMonster1);
                    break;
                case Monster2.groupName:
                    objCreated = new Monster2(this.game,this.spriteSheetMonster2);
                    break;
                case Zombie.groupName:
                    objCreated = new Zombie(this.game,this.spriteSheetZombie);
                    break;
                case BloodDrop.groupName:
                    objCreated = new BloodDrop(this.game,this.spriteSheetBloodDrop);
                    break;
                case TestTube.groupName:
                    objCreated = new TestTube(this.game,this.spriteSheetTestTube);
                    break;
                case Wall.groupName:
                    if (extraProperties.toX) extraProperties.fromX = obj.x;
                    if (extraProperties.toY) extraProperties.fromY = obj.y;
                    const wallResource:ResourceLink<ITexture> = (extraProperties.toX || extraProperties.toY)?
                        this.wall2:this.wall1;
                    objCreated = new Wall(this.game,new Size(obj.width,obj.height),wallResource,extraProperties);
                    break;
                default:
                    break;
            }
            if (objCreated!==undefined) {
                objCreated.getRenderableModel().pos.setXY(obj.x,obj.y);
            }
        });
        Burster.instantiate(this.game);
    }

}
