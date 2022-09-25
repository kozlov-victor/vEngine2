import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Character} from "./objects/character";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";
import {Game} from "@engine/core/game";


export class MainScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game: Game) {
        super(game);
        this.backgroundColor = ColorFactory.fromCSS(`#041f03`);
    }

    public override onReady():void {

        const tileMap = new AnimatedTileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
            exceptCollisionTiles: [3,4],
            debug: false,
            restitution: 0.1,
        });
        tileMap.appendTo(this);

        this.assets.levelData.layers.find(it=>it.type==='objectgroup')!.objects.forEach(obj=>{
            const typeProp = obj.properties.find(it=>it.name==='class');
            const cl = typeProp!.value;
            switch (cl) {
                case 'character':
                    new Character(this.game, this, tileMap, this.assets,obj);
                    break;
            }
        });
    }
}
