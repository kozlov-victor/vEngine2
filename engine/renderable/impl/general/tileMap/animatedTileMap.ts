import {
    ICollisionInfo,
    ITileAnimation,
    ITileAnimationInfo,
    ITiledJSON,
    TileMap
} from "@engine/renderable/impl/general/tileMap/tileMap";
import {TileAnimator} from "@engine/renderable/impl/general/tileMap/tileAnimator";
import {Optional} from "@engine/core/declarations";

export class AnimatedTileMap extends TileMap {

    private _tileAnimator:Optional<TileAnimator>;

    public override fromTiledJSON(map:ITiledJSON,collisionInfo?:ICollisionInfo,mainTileSetName:string = 'tiles'):void {
        super.fromTiledJSON(map, collisionInfo, mainTileSetName);
        const tileSet = this.findMainTileSetOfTiledJson(map, mainTileSetName);
        if (tileSet.tiles) {
            const animations:ITileAnimation[] = [];
            tileSet.tiles.forEach(t=>{
                const tile = t as ITileAnimationInfo;
                if (tile?.animation===undefined) return;
                const animation:ITileAnimation = {
                    tileId: tile.id,
                    frames: tile.animation!.map(it=>({tileId:it.tileid,duration:it.duration}))
                };
                animations.push(animation);
            });
            this.setTileAnimations(animations);
        }
    }

    public setTileAnimations(animations:ITileAnimation[]) {
        this._tileAnimator = new TileAnimator(animations);
    }

    protected override beforeDraw() {
        super.beforeDraw();
        this._tileAnimator?.clear();
    }


    protected override resolveTileId(tileId: number): number {
        if (this._tileAnimator===undefined) return tileId;
        if (this._tileAnimator.isTileAnimated(tileId)) {
            const time = this.game.getElapsedTime();
            const baseTileId = tileId;
            tileId = this._tileAnimator.getCurrentAnimatedTileId(tileId,time);
            this._tileAnimator.updateAnimationTileId(baseTileId,tileId);
        }
        return tileId;
    }


    protected override prepareDrawableInfo() {
        super.prepareDrawableInfo();
        if (this._tileAnimator===undefined) return;
        if (this._tileAnimator.needUpdate(this.game.getElapsedTime())) {
            this._drawInfo.dirty = true;
        }
    }
}
