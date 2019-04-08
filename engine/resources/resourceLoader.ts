import {Queue} from "./queue";
import {Game} from "../game";
import {ResourceLink} from "@engine/resources/resourceLink";


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

    startLoading():void{
        this.q.start();
    }

    isCompleted():boolean{
        return this.q.isCompleted();
    }

    getProgress():number {
        return this.q.calcProgress();
    }

    onProgress(fn:()=>void):void{
        this.q.onProgress = fn;
    }

    onCompleted(fn:()=>void):void{
        this.q.onResolved = fn;
    }

}