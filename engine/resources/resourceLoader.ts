import {Queue} from "./queue";
import {Game} from "../game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {LoaderUtil} from "@engine/resources/loaderUtil";
import loadRaw = LoaderUtil.loadRaw;
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Incrementer} from "@engine/resources/incrementer";


export class ResourceLoader {

    readonly q:Queue = new Queue();

    constructor(private game: Game) {
        this.game = game;
    }


    loadImage(url:string):ResourceLink<Texture> {
        const link:ResourceLink<Texture> = new ResourceLink(url);
        this.q.addTask(()=>{
            this.game.getRenderer().loadTextureInfo(
                url, link,
                ()=>this.q.resolveTask(url)
            );
        },url);
        return link;
    }

    private _loadText(url:string,callback:Function):void{
        this.q.addTask(()=>{
            loadRaw(url,'text',(data:string)=>{
                callback(data);
                this.q.resolveTask(url);
            });
        },url);
    }

    loadText(url:string):ResourceLink<string> {
        const link:ResourceLink<string> = new ResourceLink(url);
        this._loadText(url,(data:string)=>link.setTarget(data));
        return link;
    }

    loadJSON(url:string):ResourceLink<string> {
        const link:ResourceLink<string> = new ResourceLink(url);
        this._loadText(url,(data:string)=>link.setTarget(JSON.parse(data)));
        return link;
    }

    loadSound(url:string):ResourceLink<void> {
        const link:ResourceLink<void> = new ResourceLink(url);
        this.q.addTask(()=>{
            this.game.getAudioPlayer().loadSound(
                url, link,
                ()=>this.q.resolveTask(url)
            );
        },url);
        return link;
    }

    loadBinary(url:string):ResourceLink<ArrayBuffer> {
        const link:ResourceLink<ArrayBuffer> = new ResourceLink<ArrayBuffer>(url);
        this.q.addTask(()=>{
            loadRaw(url,'arraybuffer',(buff:ArrayBuffer)=>{
                link.setTarget(buff);
                this.q.resolveTask(url);
            });
        },url);
        return link;
    }

    addNextTask(task:Function){
        const id:string = Date.now() + '_' + Incrementer.getValue();
        this.q.addTask(()=>{
            task();
            this.q.resolveTask(id);
        },id);
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