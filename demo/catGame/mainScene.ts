import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Source} from "@engine/resources/resourceDecorators";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Game} from "@engine/core/game";
import {Hero} from "./actor/hero";
import {Monster1} from "./actor/monster1";
import {AbstractEntity, IExtraProperties} from "./actor/abstract/abstract";
import {Wall} from "./actor/wall";
import {Optional} from "@engine/core/declarations";
import {Burster} from "./actor/burster";

type LEVEL_SCHEMA = typeof import("./level/l1.json");

export class MainScene extends Scene {

    @Source.Texture('./catGame/res/sprite/cat.png')
    private spriteSheetHero:ResourceLink<ITexture>;

    @Source.Texture('./catGame/res/sprite/monster1.png')
    private spriteSheetMonster1:ResourceLink<ITexture>;

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
        this.level.layers[0].objects.forEach(obj=>{
            let objCreated:Optional<AbstractEntity>;
            const extraProperties:IExtraProperties = this.extractExtraProperties(obj.properties);
            switch (obj.type) {
                case 'hero':
                    objCreated = new Hero(this.game,this.spriteSheetHero);
                    break;
                case 'monster1':
                    objCreated = new Monster1(this.game,this.spriteSheetMonster1);
                    break;
                case 'wall':
                    objCreated = new Wall(this.game,obj.width,obj.height,extraProperties);
                    break;
                default:
                    break;

            }
            if (objCreated!==undefined) {
                objCreated.getRenderableModel().pos.setXY(obj.x,obj.y);
            }
        });
        const burster = new Burster(this.game);
    }

}
