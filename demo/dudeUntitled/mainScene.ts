import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Character} from "./objects/character";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";

export class MainScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    public override onReady():void {
        document.body.style.backgroundColor = 'black';

        this.backgroundColor = ColorFactory.fromCSS(`#130000`);

        const tileMap = new AnimatedTileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
            exceptCollisionTiles: [3],
            debug: false,
            restitution: 0.1,
        });
        tileMap.appendTo(this);

        this.assets.levelData.layers.find(it=>it.type==='objectgroup')!.objects.forEach(obj=>{
            const typeProp = obj.properties.find(it=>it.name==='class');
            const cl = typeProp!.value;
            switch (cl) {
                case 'character':
                    new Character(this.game, this,this.assets,obj);
                    break;
            }
        });

    }
}
