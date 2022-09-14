import {ITileAnimation} from "@engine/renderable/impl/general/tileMap/tileMap";
import {DebugError} from "@engine/debug/debugError";

interface ITiledAnimationFrameWithRange {
    tileId:number;
    timeFrom:number;
    timeTo:number;
}

interface ITileAnimationEx {
    baseTileId: number;
    currAnimationTileId:number;
    frames:ITiledAnimationFrameWithRange[];
    duration: number;
}


export class TileAnimator {

    private byId:Record<number, ITileAnimationEx> = {};
    private readonly animatedTileIdsAdded:number[] = [];

    constructor(animations: ITileAnimation[]) {
        animations.forEach(a=>{
            let timeOffset = 0;
            if (!a.frames.length) return;
            const frames:ITiledAnimationFrameWithRange[] = [];
            let duration = 0;
            a.frames.forEach(f=>{
                duration+=f.duration;
                const frame:ITiledAnimationFrameWithRange = {
                    tileId:f.tileId,
                    timeFrom:timeOffset,
                    timeTo:timeOffset+f.duration
                };
                frames.push(frame);
                timeOffset+=f.duration;
            });
            if (!duration) {
                console.error(animations);
                throw new DebugError(`wrong duration for frames`);
            }
            this.byId[a.tileId] = {
                baseTileId: a.tileId,
                currAnimationTileId: a.tileId,
                frames,
                duration,
            };
        });
    }

    public clear():void {
        this.animatedTileIdsAdded.length = 0;
    }

    public isTileAnimated(tileId:number):boolean {
        return this.byId[tileId]!==undefined;
    }

    private getFrameByAnimationTime(baseTileId:number,time:number):ITiledAnimationFrameWithRange {
        const anim = this.byId[baseTileId];
        const frames = anim.frames;
        const animationTime = time % anim.duration;
        for (const f of frames) {
            if (animationTime>=f.timeFrom && animationTime<=f.timeTo) return f;
        }
        console.error(animationTime,frames);
        if (DEBUG) throw new Error('impossible to reach');
        return undefined!;
    }

    public getCurrentAnimatedTileId(baseTileId:number,time:number):number {
        return this.getFrameByAnimationTime(baseTileId,time).tileId;
    }

    public updateAnimationTileId(baseTileId:number,currAnimationTileId:number):void {
        if (this.animatedTileIdsAdded.indexOf(baseTileId)===-1) this.animatedTileIdsAdded.push(baseTileId);
        this.byId[baseTileId].currAnimationTileId = currAnimationTileId;
    }

    public needUpdate(time:number):boolean {
        for (const id of this.animatedTileIdsAdded) {
            const calculatedTileId = this.getCurrentAnimatedTileId(id,time);
            if (calculatedTileId!==this.byId[id].currAnimationTileId) return true;
        }
        return false;
    }

}
