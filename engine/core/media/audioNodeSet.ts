import {AudioNode} from "./audioNode";
import {Sound} from "../../model/impl/sound";
import {Game} from "../game";
import {Clazz} from "../misc/clazz";
import {BasicAudioContext} from "@engine/core/media/context/basicAudioContext";



export class AudioNodeSet {

    readonly nodes:AudioNode[] = [] as AudioNode[];

    constructor(game: Game,context:BasicAudioContext,private numOfNodes:number){
        for (let i = 0;i<numOfNodes;i++) {
            this.nodes.push(new AudioNode(context.clone()));
        }
    }

    getFreeNode():AudioNode|null{
        for (let i = 0;i<this.numOfNodes;i++) {
            if (this.nodes[i].isFree()) return this.nodes[i];
        }
        // getting the oldest
        return this.nodes.sort((a:AudioNode,b:AudioNode)=>{
            return a.context.getLastValueId()>b.context.getLastValueId()?1:-1;
        })[0];
    }

    stopAll(){
        for (let i = 0;i<this.numOfNodes;i++) {
            this.nodes[i].stop();
        }
    }

    pauseAll(){
        for (let i = 0;i<this.numOfNodes;i++) {
            this.nodes[i].pause();
        }
    }

    resumeAll(){
        for (let i = 0;i<this.numOfNodes;i++) {
            this.nodes[i].resume();
        }
    }



    getNodeBySound(sound:Sound):AudioNode|null{
        for (let i = 0;i<this.numOfNodes;i++) {
            if (this.nodes[i].getCurrSound()==sound) return this.nodes[i];
        }
        return null;
    }

}