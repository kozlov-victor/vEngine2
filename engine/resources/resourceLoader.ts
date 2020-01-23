import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "../core/game";
import {Queue, TaskRef} from "./queue";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {ITexture} from "@engine/renderer/common/texture";
import {AbstractCanvasRenderer} from "@engine/renderer/abstract/abstractCanvasRenderer";


export class ResourceLoader {

    private static canLoadResourceViaBLOB():boolean{
        return globalThis.Blob!==undefined && globalThis.URL!==undefined;
    }

    public readonly q: Queue = new Queue();

    constructor(private game: Game) {
        this.game = game;
    }

    public loadImage(req: string|IURLRequest): ResourceLink<ITexture> {
        if (ResourceLoader.canLoadResourceViaBLOB()) return this.loadImageViaBLOB(req);
        else return this.loadImageViaDOM(req);
    }

    public loadText(req: string|IURLRequest): ResourceLink<string> {
        const loader:UrlLoader<string> = this.createUrlLoader<string>(req);
        const link: ResourceLink<string> = new ResourceLink(loader.getUrl());
        this._loadText(loader, (data: string) => link.setTarget(data));
        return link;
    }

    public loadJSON<T>(req: string|IURLRequest): ResourceLink<T> {
        const loader:UrlLoader<string> = this.createUrlLoader<string>(req);
        const link: ResourceLink<T> = new ResourceLink(loader.getUrl());
        this._loadText(loader, (data: string) => link.setTarget(JSON.parse(data)));
        return link;
    }

    public loadSound(req: string|IURLRequest): ResourceLink<void> {
        const loader:UrlLoader<ArrayBuffer> = this.createUrlLoader<ArrayBuffer>(req,'arraybuffer');
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
        const loader:UrlLoader<ArrayBuffer> = this.createUrlLoader<ArrayBuffer>(req,'arraybuffer');
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

    private loadImageViaBLOB(req: string|IURLRequest): ResourceLink<ITexture> {
        const loader:UrlLoader<ArrayBuffer> = this.createUrlLoader<ArrayBuffer>(req,'arraybuffer');
        const link: ResourceLink<ITexture> = new ResourceLink(loader.getUrl());
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        loader.onLoad = (buffer:ArrayBuffer|string)=>{
            this.game.getRenderer().createTexture(
                buffer,link,() => this.q.resolveTask(taskRef)
            );
        };
        const taskRef:TaskRef = this.q.addTask(() => {
            loader.load();
        });
        return link;
    }

    private loadImageViaDOM(req: string|IURLRequest): ResourceLink<ITexture> {
        const url:string = (req as IURLRequest).url || (req as string);
        const link: ResourceLink<ITexture> = new ResourceLink(url);
        const img:HTMLImageElement = new Image();
        img.src = url;
        const taskRef:TaskRef = this.q.addTask(() => {
            this.game.getRenderer().createTexture(
                img,link,() => {
                    this.q.resolveTask(taskRef);
                }
            );
        });
        return link;
    }


    private createUrlLoader<T extends string|ArrayBuffer>(req: string|IURLRequest,responseType:'arraybuffer'|'text' = 'text'):UrlLoader<T>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType,method:'GET'};
        } else iReq = req as IURLRequest;
        return new UrlLoader(iReq);
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
