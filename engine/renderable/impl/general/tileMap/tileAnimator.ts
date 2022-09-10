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
}


export class TileAnimator {

    private byId:Record<number, ITileAnimationEx> = {};
    private duration:number = 0;
    private readonly animatedTileIdsAdded:number[] = [];

    constructor(animations: ITileAnimation[]) {
        animations.forEach(a=>{
            let timeOffset = 0;
            if (!a.frames.length) return;
            const frames:ITiledAnimationFrameWithRange[] = [];
            a.frames.forEach(f=>{
                this.duration+=f.duration;
                const frame:ITiledAnimationFrameWithRange = {
                    tileId:f.tileId,
                    timeFrom:timeOffset,
                    timeTo:timeOffset+f.duration
                };
                frames.push(frame);
                timeOffset+=f.duration;
            });
            this.byId[a.tileId] = {
                baseTileId: a.tileId,
                currAnimationTileId: a.tileId,
                frames,
            };
        });
        if (!this.duration) {
            console.error(animations);
            throw new DebugError(`wrong duration for frames`);
        }
    }

    public clear():void {
        this.animatedTileIdsAdded.length = 0;
    }

    public isTileAnimated(tileId:number):boolean {
        return this.byId[tileId]!==undefined;
    }

    private getFrameByAnimationTime(baseTileId:number,animationTime:number):ITiledAnimationFrameWithRange {
        const frames = this.byId[baseTileId].frames;
        for (const f of frames) {
            if (animationTime>=f.timeFrom && animationTime<=f.timeTo) return f;
        }
        throw new Error('impossible to reach');
    }

    public getCurrentAnimatedTileId(baseTileId:number,time:number):number {
        const animationTime = time % this.duration;
        return this.getFrameByAnimationTime(baseTileId,animationTime).tileId;
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
