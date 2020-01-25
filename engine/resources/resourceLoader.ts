import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "../core/game";
import {Queue, TaskRef} from "./queue";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {ITexture} from "@engine/renderer/common/texture";
import {Base64, URI} from "@engine/core/declarations";
import {ResourceUtil} from "@engine/resources/resourceUtil";
import createImageFromData = ResourceUtil.createImageFromData;


export class ResourceLoader {

    private static createUrlLoader<T extends string|ArrayBuffer>(req: URI|IURLRequest,responseType:'arraybuffer'|'text' = 'text'):UrlLoader<T>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType,method:'GET'};
        } else iReq = req as IURLRequest;
        return new UrlLoader(iReq);
    }

    public readonly q: Queue = new Queue();

    constructor(private game: Game) {
        this.game = game;
    }

    public loadImage(req: string|IURLRequest): ResourceLink<ITexture> {
        const link: ResourceLink<ITexture> = new ResourceLink(req as string);
        const taskRef:TaskRef = this.q.addTask(async () => {
            const img:HTMLImageElement|ImageBitmap = await createImageFromData(req as (URI|Base64|IURLRequest),this.q,taskRef);
            const texture:ITexture = this.game.getRenderer().createTexture(img);
            link.setTarget(texture);
            this.q.resolveTask(taskRef);
        });
        return link;
    }

    public loadText(req: string|IURLRequest): ResourceLink<string> {
        const loader:UrlLoader<string> = ResourceLoader.createUrlLoader<string>(req as (URI|IURLRequest));
        const link: ResourceLink<string> = new ResourceLink(loader.getUrl());
        this._loadText(loader, (data: string) => link.setTarget(data));
        return link;
    }

    public loadJSON<T>(req: string|IURLRequest): ResourceLink<T> {
        const loader:UrlLoader<string> = ResourceLoader.createUrlLoader<string>(req as (URI|IURLRequest));
        const link: ResourceLink<T> = new ResourceLink(loader.getUrl());
        this._loadText(loader, (data: string) => link.setTarget(JSON.parse(data)));
        return link;
    }

    public loadSound(req: string|IURLRequest): ResourceLink<void> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        const link: ResourceLink<void> = new ResourceLink(loader.getUrl());
        if (this.game.getAudioPlayer().isCached(link)) {
            return link;
        }
        const taskRef:TaskRef = this.q.addTask(() =>{
            loader.load();
        });
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        loader.onLoad = (data:ArrayBuffer)=>{
            this.game.getAudioPlayer().loadSound(
                data, link, () => this.q.resolveTask(taskRef),
            );
        };
        return link;
    }

    public loadBinary(req: string|IURLRequest): ResourceLink<ArrayBuffer> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        const link: ResourceLink<ArrayBuffer> = new ResourceLink<ArrayBuffer>(loader.getUrl());
        loader.onLoad = (buff: ArrayBuffer|string)=>{
            link.setTarget(buff as ArrayBuffer);
            this.q.resolveTask(taskRef);
        };
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        const taskRef:TaskRef = this.q.addTask(() => {
            loader.load();
        });
        return link;
    }

    public addNextTask(task: () => void) {
        const taskRef:TaskRef =  this.q.addTask(() => {
            task();
            this.q.resolveTask(taskRef);
        });
    }

    public startLoading(): void {
        this.q.start();
    }

    public isCompleted(): boolean {
        return this.q.isCompleted();
    }

    public getProgress(): number {
        return this.q.calcProgress();
    }

    public onProgress(fn: () => void): void {
        this.q.onProgress = fn;
    }

    public onCompleted(fn: () => void): void {
        this.q.onResolved = fn;
    }

    private _loadText(loader:UrlLoader<string>, callback: (data:string)=>void): void {
        const taskRef:TaskRef = this.q.addTask(() => {
            loader.load();
        });
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        loader.onLoad = (data:string)=>{
            callback(data);
            this.q.resolveTask(taskRef);
        };
    }


}
