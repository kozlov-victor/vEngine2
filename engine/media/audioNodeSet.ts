import {AudioNode} from "./audioNode";
import {Sound} from "./sound";
import {Game} from "../core/game";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Optional} from "@engine/core/declarations";
import {FREE_AUDIO_NODE_SEARCH_STRATEGY} from "@engine/media/interface/iAudioPlayer";
import {DebugError} from "@engine/debug/debugError";

const nodeComparator = (a:AudioNode,b:AudioNode):1|-1=>{
    return a.context.getLastValueId()>b.context.getLastValueId()?1:-1;
};

export class AudioNodeSet {

    public readonly nodes:AudioNode[] = [] as AudioNode[];

    constructor(game: Game,private context:BasicAudioContext,private numOfNodes:number){
        for (let i = 0;i<numOfNodes;i++) {
            this.nodes.push(new AudioNode(context.clone()));
        }
    }

    public getFreeNode(url:string):Optional<AudioNode>{
        let possibleFreeNode:Optional<AudioNode>;
        for (let i = 0;i<this.numOfNodes;i++) {
            const node:AudioNode = this.nodes[i];
            if (node.isFree()) {
                possibleFreeNode = node;
                if (possibleFreeNode.getLastPlayedUrl()===url) return node;
            }
        }
        if (possibleFreeNode!==undefined) return possibleFreeNode;
        switch (this.context.getAudioPlayer().freeNodeSearchStrategy) {
            case FREE_AUDIO_NODE_SEARCH_STRATEGY.GET_OLDEST:
                return this.nodes.sort(nodeComparator)[0];
            case FREE_AUDIO_NODE_SEARCH_STRATEGY.GET_OLDEST_NOT_LOOP:
                return this.nodes.filter(it=>!it.isLooped()).sort(nodeComparator)[0];
            case FREE_AUDIO_NODE_SEARCH_STRATEGY.SKIP_IF_NOT_FREE:
                return undefined;
            default:
                if (DEBUG) {
                    throw new DebugError(`undefined freeNodeSearchStrategy`);
                }
                return undefined;
        }

    }

    public stopAll():void{
        for (let i:number = 0;i<this.numOfNodes;i++) {
            this.nodes[i].stop();
        }
    }

    public pauseAll():void{
        for (let i:number = 0;i<this.numOfNodes;i++) {
            this.nodes[i].pause();
        }
    }

    public resumeAll():void {
        for (let i:number = 0;i<this.numOfNodes;i++) {
            this.nodes[i].resume();
        }
    }



    public getNodeBySound(sound:Sound):Optional<AudioNode>{
        for (let i:number = 0;i<this.numOfNodes;i++) {
            if (this.nodes[i].getCurrSound()===sound) return this.nodes[i];
        }
        return undefined;
    }

}
