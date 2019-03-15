import {Queue} from "./queue";
import {Game} from "../game";
import {Scene} from "../../model/impl/scene";
import {DebugError} from "@engine/debugError";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {TextureInfo} from "@engine/core/renderer/webGl/programs/abstract/abstractDrawer";



export class ResourceLoader {

    private q:Queue;
    private readonly game:Game;

    constructor(game: Game) {
        this.game = game;
        this.q = new Queue();
    }


    loadImage(url:string):ResourceLink {
        const link:ResourceLink = ResourceLink.create();
        this.q.addTask(()=>{
            this.game.getRenderer().loadTextureInfo(
                url, link,
                ()=>this.q.resolveTask(url)
            );
        },url);
        return link;
    }

    loadSound(url:string):ResourceLink {
        const link:ResourceLink = ResourceLink.create();
        this.q.addTask(()=>{
            this.game.getAudioPlayer().loadSound(
                url, link,
                ()=>this.q.resolveTask(url)
            );
        },url);
        return link;
    }

    startLoading(){
        this.q.start();
    }

    isCompleted(){
        return this.q.isCompleted();
    }

    getProgress():number {
        return this.q.calcProgress();
    }

    onProgress(fn:()=>void){
        this.q.onProgress = fn;
    }

    onCompleted(fn:()=>void){
        this.q.onResolved = fn;
    }

}