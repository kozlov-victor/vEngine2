import {Key} from "./key";
import {DiContainer, Injectable} from "../ioc";
import {MainScene} from "../mainScene";
import {TileMap} from "@engine/renderable/impl/general/tileMap/tileMap";
import {IRectJSON} from "@engine/geometry/rect";
import Inject = DiContainer.Inject;
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export const waitFor = (root:RenderableModel,time:number):Promise<void>=> {
    return new Promise(resolve=>{
        root.setTimeout(()=>resolve(),time);
    });
}

export class Script implements Injectable {

    @Inject(TileMap.name) private readonly tileMap:TileMap;

    constructor(private scene:MainScene) {
    }

    public postConstruct(): void {
    }

    public async onHeroCollidedWithKey(key:Key):Promise<void> {
        const targetRect =
            this.scene.assets.levelData.layers.find(it=>it.type==='objectgroup')?.
                objects?.find(it=>{
                    return it.properties.find(it => it.name === 'type' && it.value === 'overlapRect') &&
                        it.properties.find(it => it.name === 'id' && it.value===key.rectId);
                });
        if (!targetRect) throw Error('no target rect');
        const rect:IRectJSON = {
            x:targetRect.x, // - targetRect.height
            y:targetRect.y,
            width:targetRect.width,
            height:targetRect.height
        };
        const tiles = this.tileMap.getTilesAtRect(rect);
        for (const tile of tiles) {
            await waitFor(this.tileMap,300);
            this.tileMap.setValueAtCellXY(tile.xTile,tile.yTile,undefined);
            this.tileMap.redefineRigidBodies();
            this.tileMap.drawForced();
        }
    }

}
