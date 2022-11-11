import {Key} from "./key";
import {DiContainer, Injectable} from "../ioc";
import {MainScene} from "../mainScene";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import Inject = DiContainer.Inject;
import {IRect, IRectJSON} from "@engine/geometry/rect";

export class Script implements Injectable {

    @Inject(TileMap.name) private readonly tileMap:TileMap;

    constructor(private scene:MainScene) {
    }

    public postConstruct(): void {
    }

    public onHeroCollidedWithKey(key:Key):void {
        const targetRect =
            this.scene.assets.levelData.layers.find(it=>it.type==='objectgroup')?.
                objects?.find(it=>{
                    return it.properties.find(it => it.name === 'type' && it.value === 'overlapRect') &&
                        it.properties.find(it => it.name === 'id' && key.rectId);
                });
        if (!targetRect) throw Error();
        const rect:IRectJSON = {
            x:targetRect.x, // - targetRect.height
            y:targetRect.y,
            width:targetRect.width,
            height:targetRect.height
        };
        const tiles = this.tileMap.getTilesAtRect(rect);
        for (const tile of tiles) {
            this.tileMap.setValueAtCellXY(tile.xTile,tile.yTile,undefined);
        }
        this.tileMap.redefineRigidBodies();
        this.tileMap.draw();
    }

}
