import {Scene} from "@engine/model/impl/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {TileMap} from "@engine/model/impl/tileMap";
import {Image} from "@engine/model/impl/ui/drawable/image";

export class MainScene extends Scene {

    private tileMap:TileMap;

    public onPreloading() {
        const tileMap:TileMap = new TileMap(this.game);
        const img:Image = new Image(this.game);
        img.setResourceLink(this.resourceLoader.loadImage('tiles.png'));
        tileMap.fromTiledJSON([0,0,2,0],2,2);
        tileMap.spriteSheet = img;
        this.tileMap = tileMap;
    }

    public onReady() {
        this.appendChild(this.tileMap);
    }

}
