import {ResourceLink, ResourceLinkState} from "@engine/resources/resourceLink";
import {Game} from "../core/game";
import {Queue, TaskRef} from "./queue";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Base64, URI} from "@engine/core/declarations";
import {ResourceUtil} from "@engine/resources/resourceUtil";
import createImageFromData = ResourceUtil.createImageFromData;
import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";

namespace resourceCache {

    export const cache:Record<string, ITexture> = {};

    export const clear = ():void=>{
        const keys:string[] = Object.keys(cache);
        keys.forEach(k=>delete cache[k]);
    };

}

export class ResourceLoader {

    private static createUrlLoader<T extends string|ArrayBuffer>(req: URI|IURLRequest,responseType:'arraybuffer'|'text' = 'text'):UrlLoader<T>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType,method:'GET'};
        } else iReq = req as IURLRequest;
        return new UrlLoader(iReq);
    }

    public readonly q: Queue = new Queue();

    public constructor(private game: Game) {
        this.game = game;
    }

    public loadTexture(req: string|IURLRequest): ResourceLink<ITexture> {
        const link: ResourceLink<ITexture> = new ResourceLink(req as string);
        if (resourceCache.cache[(req as IURLRequest).url??req]!==undefined) {
            link.setTarget(resourceCache.cache[(req as IURLRequest).url??req] as ITexture);
            return link;
        }
        const taskRef:TaskRef = this.q.addTask(async () => {
            try {
                link.state = ResourceLinkState.PENDING;
                const img:HTMLImageElement|ImageBitmap = await createImageFromData(req as (URI|Base64|IURLRequest),this.q,taskRef);
                const texture:ITexture = this.game.getRenderer().createTexture(img);
                link.setTarget(texture);
                resourceCache.cache[(req as IURLRequest).url??req] = texture;
                this.q.resolveTask(taskRef);
            } catch (e) {
                link.state = ResourceLinkState.PENDING_ERROR;
                console.error(e);
                throw e;
            }

        });
        return link;
    }

    public loadCubeTexture(
        leftSide: string|IURLRequest, rightSide:string|IURLRequest,
        topSide: string|IURLRequest, bottomSide:string|IURLRequest,
        frontSide: string|IURLRequest, backSide:string|IURLRequest,
    ): ResourceLink<ICubeMapTexture> {
        const link: ResourceLink<ICubeMapTexture> = new ResourceLink('');

        const taskRef:TaskRef = this.q.addTask(async () => {
            link.state = ResourceLinkState.PENDING;
            try {
                const imgLeft:HTMLImageElement|ImageBitmap = await createImageFromData(leftSide as (URI|Base64|IURLRequest),this.q,taskRef);
                const imgRight:HTMLImageElement|ImageBitmap = await createImageFromData(rightSide as (URI|Base64|IURLRequest),this.q,taskRefsAdditionals[0]);
                this.q.resolveTask(taskRefsAdditionals[0]);
                const imgTop:HTMLImageElement|ImageBitmap = await createImageFromData(topSide as (URI|Base64|IURLRequest),this.q,taskRefsAdditionals[1]);
                this.q.resolveTask(taskRefsAdditionals[1]);
                const imgBottom:HTMLImageElement|ImageBitmap = await createImageFromData(bottomSide as (URI|Base64|IURLRequest),this.q,taskRefsAdditionals[2]);
                this.q.resolveTask(taskRefsAdditionals[2]);
                const imgFront:HTMLImageElement|ImageBitmap = await createImageFromData(frontSide as (URI|Base64|IURLRequest),this.q,taskRefsAdditionals[3]);
                this.q.resolveTask(taskRefsAdditionals[3]);
                const imgBack:HTMLImageElement|ImageBitmap = await createImageFromData(backSide as (URI|Base64|IURLRequest),this.q,taskRefsAdditionals[4]);
                this.q.resolveTask(taskRefsAdditionals[4]);
                const texture:ICubeMapTexture = this.game.getRenderer().createCubeTexture(imgLeft,imgRight,imgTop,imgBottom,imgFront,imgBack);
                link.setTarget(texture);
                this.q.resolveTask(taskRef);
            } catch (e) {
                link.state = ResourceLinkState.PENDING_ERROR;
                throw e;
            }
        });

        const taskRefsAdditionals:[TaskRef,TaskRef,TaskRef,TaskRef,TaskRef]
            = new Array(5) as [TaskRef,TaskRef,TaskRef,TaskRef,TaskRef];
        for (let i:number=0;i<taskRefsAdditionals.length;i++) {
            taskRefsAdditionals[i]=(this.q.addTask(()=>{}));
        }

        return link;
    }

    public loadText(req: string|IURLRequest): ResourceLink<string> {
        return this._loadAndProcessText(req,t=>t);
    }

    public loadJSON<T>(req: string|IURLRequest): ResourceLink<T> {
        const postPrecessFn:(t:string)=>T = t=>JSON.parse(t);
        return this._loadAndProcessText<T>(req,postPrecessFn);
    }

    public loadSound(req: string|IURLRequest): ResourceLink<void> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        const link: ResourceLink<void> = new ResourceLink(loader.getUrl());
        const taskRef:TaskRef = this.q.addTask(async () =>{
            try {
                link.state = ResourceLinkState.PENDING;
                const buff:ArrayBuffer = await loader.load();
                await this.game.getAudioPlayer().loadSound(buff,link);
                this.q.resolveTask(taskRef);
                link.setTarget(undefined);
            } catch (e) {
                console.error(e);
                throw e;
            }
        });
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        return link;
    }

    public loadBinary(req: string|IURLRequest): ResourceLink<ArrayBuffer> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        const link: ResourceLink<ArrayBuffer> = new ResourceLink<ArrayBuffer>(loader.getUrl());
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        const taskRef:TaskRef = this.q.addTask(async () => {
            try {
                link.state = ResourceLinkState.PENDING;
                const buff:ArrayBuffer = await loader.load();
                link.setTarget(buff as ArrayBuffer);
                this.q.resolveTask(taskRef);
            } catch (e) {
                console.error(e);
                throw e;
            }

        });
        return link;
    }

    public loadFont(fontFamily:string,fontSize:number,fontColor:[r:byte,g:byte,b:byte,a?:byte]):Font{
        const fnt:Font = new Font(this.game);
        fnt.fontSize = fontSize;
        fnt.fontFamily = fontFamily;
        fnt.fontColor = Color.RGBA(...fontColor);
        fnt.generate();
        return fnt;
    }

    public addNextTask(task: () => void) {
        const taskRef:TaskRef =  this.q.addTask(() => {
            task();
            this.q.resolveTask(taskRef);
        });
    }

    public clearCache():void {
        resourceCache.clear();
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

    private _loadAndProcessText<T>(req: string|IURLRequest,postProcess:(s:string)=>T): ResourceLink<T> {
        const url:string = (req as IURLRequest).url?(req as IURLRequest).url:req as string;
        const link: ResourceLink<T> = new ResourceLink(url);
        const loader:UrlLoader<string> = ResourceLoader.createUrlLoader<string>(req as (URI|IURLRequest));
        loader.onProgress = (n:number)=>this.q.progressTask(taskRef,n);
        const taskRef:TaskRef = this.q.addTask(async () => {
            try {
                const text:string = await loader.load();
                const data:T = postProcess(text);
                link.setTarget(data);
                this.q.resolveTask(taskRef);
            } catch (e) {
                console.error(e);
                throw e;
            }

        });
        return link;
    }


}
