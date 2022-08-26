import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Assets} from "./assets/assets";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {Character} from "./objects/character";

export class MainScene extends Scene {

    @Resource.ResourceHolder() private assets:Assets;

    public override onReady():void {
        document.body.style.backgroundColor = 'black';

        this.backgroundColor = ColorFactory.fromCSS(`#130000`);

        const tileMap = new TileMap(this.game,this.assets.tilesTexture);
        tileMap.fromTiledJSON(this.assets.levelData,{
            useCollision:true,
            collideWithTiles:'all',
            groupNames:['tileMap'],
            exceptCollisionTiles: [],
            debug: false,
            restitution: 0.1,
        });
        tileMap.appendTo(this);

        new Character(this.game, this,this.assets);

    }
}
