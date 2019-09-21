import {AudioNode} from "./audioNode";
import {Sound} from "./sound";
import {Game} from "../core/game";
import {BasicAudioContext} from "@engine/media/context/basicAudioContext";
import {Optional} from "@engine/core/declarations";


export class AudioNodeSet {

    public readonly nodes:AudioNode[] = [] as AudioNode[];

    constructor(game: Game,context:BasicAudioContext,private numOfNodes:number){
        for (let i = 0;i<numOfNodes;i++) {
            this.nodes.push(new AudioNode(context.clone()));
        }
    }

    public getFreeNode():Optional<AudioNode>{
        for (let i = 0;i<this.numOfNodes;i++) {
            if (this.nodes[i].isFree()) return this.nodes[i];
        }
        // getting the oldest
        return this.nodes.sort((a:AudioNode,b:AudioNode)=>{
            return a.context.getLastValueId()>b.context.getLastValueId()?1:-1;
        })[0];
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



    public getNodeBySound(sound:Sound):AudioNode|null{
        for (let i:number = 0;i<this.numOfNodes;i++) {
            if (this.nodes[i].getCurrSound()===sound) return this.nodes[i];
        }
        return null;
    }

}