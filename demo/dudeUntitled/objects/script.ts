import {Key} from "./key";
import {DiContainer, Injectable} from "../ioc";
import {MainScene} from "../mainScene";
import {IRectJSON} from "@engine/geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {WallDustEmitter} from "../particles/wallDustEmitter";
import {AnimatedTileMap} from "@engine/renderable/impl/general/tileMap/animatedTileMap";
import {Sausage} from "./sausage";
import {Candy} from "./candy";
import {BonusParticleEmitter} from "../particles/bonusParticleEmitter";
import {Character} from "./character";
import Inject = DiContainer.Inject;

export const waitFor = (root:RenderableModel,time:number):Promise<void>=> {
    return new Promise(resolve=>{
        root.setTimeout(()=>resolve(),time);
    });
}

export class Script implements Injectable {

    @Inject(AnimatedTileMap) private readonly tileMap:AnimatedTileMap;
    @Inject(WallDustEmitter) public readonly wallDust:WallDustEmitter;
    @Inject(BonusParticleEmitter) public readonly bonusParticles:BonusParticleEmitter;

    constructor(private scene:MainScene) {
    }

    public postConstruct(): void {
    }

    public onHeroCollectedSausage(sausage:Sausage):void {
        const host = sausage.getRenderable();
        this.wallDust.emit(
            host.pos.x+host.size.width/2,
            host.pos.y+host.size.height/2
        );
    }

    public onHeroCollectedCandy(candy:Candy):void {
        const host = candy.getRenderable();
        this.bonusParticles.emit(
            host.pos.x+host.size.width/2,
            host.pos.y+host.size.height/2
        );
    }

    public onHeroCollidedWithFile(hero:Character) {

    }

    public async onHeroCollidedWithKey(key:Key):Promise<void> {
        const targetRect =
            this.scene.assets.levelData.layers.find(it=>it.type==='objectgroup')?.
                objects?.find(it=>{
                    return it.class==='OverlapRect' &&
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
            this.wallDust.emit(
                tile.x+tile.width/2,
                tile.y+tile.height/2,
            );
        }
    }

}
