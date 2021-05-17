import {Game} from "../core/game";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Base64, Optional, URI} from "@engine/core/declarations";
import {ResourceUtil} from "@engine/resources/resourceUtil";
import {XmlDocument, XmlNode} from "@engine/misc/xml/xmlELements";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Sound} from "@engine/media/sound";
import {ITask, Queue} from "@engine/resources/queue";
import {UploadedSoundLink} from "@engine/media/interface/iAudioPlayer";
import {DebugError} from "@engine/debug/debugError";
import {isString} from "@engine/misc/object";
import createImageFromData = ResourceUtil.createImageFromData;
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import ICssFontParameters = FontTypes.ICssFontParameters;
import ITextureWithId = FontTypes.ITextureWithId;
import {FontFactory} from "@engine/renderable/impl/general/font/fontFactory";
import {Image} from "@engine/renderable/impl/general/image";

namespace ResourceCache {

    export const cache:Record<string, ITexture> = {};

    export const clear = ():void=>{
        const keys:string[] = Object.keys(cache);
        keys.forEach(k=>delete cache[k]);
    };

}

export class ResourceLoader {


    public constructor(private readonly game: Game) {
        this.game = game;
    }

    private readonly q:Queue = new Queue();

    private static createUrlLoader<T extends string|ArrayBuffer>(req: URI|IURLRequest,responseType:'arraybuffer'|'text' = 'text'):UrlLoader<T>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType,method:'GET'};
        } else iReq = req as IURLRequest;
        return new UrlLoader(iReq);
    }

    private static async _loadAndProcessText<T>(req: string|IURLRequest, postProcess:(s:string)=>T,progressFn?:(n:number)=>void): Promise<T> {
        const loader:UrlLoader<string> = ResourceLoader.createUrlLoader<string>(req as (URI|IURLRequest));
        if (progressFn!==undefined) loader.onProgress = progressFn;
        const text:string = await loader.load();
        return postProcess(text);
    }

    private static mergeUrl(pageFile:string, baseUrl:string):string {
        if (!baseUrl) return pageFile;
        if (baseUrl[baseUrl.length-1]==='/') baseUrl = baseUrl.substr(0,baseUrl.length-1);
        if (pageFile.indexOf('/')===0) pageFile = pageFile.substr(1);
        return `${baseUrl}/${pageFile}`;
    }

    public async loadTexture(req: string|IURLRequest,progress?:(n:number)=>void): Promise<ITexture> {
        const fromCache:Optional<ITexture> = ResourceCache.cache[(req as IURLRequest).url??req];
        if (fromCache!==undefined) {
            return fromCache;
        }
        const img:HTMLImageElement|ImageBitmap = await createImageFromData(req as (URI|Base64|IURLRequest),progress);
        return this.game.getRenderer().createTexture(img);
    }

    public async loadImage(req: string|IURLRequest,progress?:(n:number)=>void): Promise<Image> {
        const texture:ITexture = await this.loadTexture(req,progress);
        return new Image(this.game,texture);
    }

    public async loadCubeTexture(
        leftSide:   string|IURLRequest, rightSide:  string|IURLRequest,
        topSide:    string|IURLRequest, bottomSide: string|IURLRequest,
        frontSide:  string|IURLRequest, backSide:   string|IURLRequest,
        progress?:(n:number)=>void
    ): Promise<ICubeMapTexture> {

        let currProgress:number = 0;
        const progressCallBack = (n:number)=>{
            currProgress+=n;
            if (progress!==undefined) progress(n/6);
        };

        const imgLeft:HTMLImageElement|ImageBitmap =
            await createImageFromData(leftSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgRight:HTMLImageElement|ImageBitmap =
            await createImageFromData(rightSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgTop:HTMLImageElement|ImageBitmap =
            await createImageFromData(topSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgBottom:HTMLImageElement|ImageBitmap =
            await createImageFromData(bottomSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgFront:HTMLImageElement|ImageBitmap =
            await createImageFromData(frontSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgBack:HTMLImageElement|ImageBitmap =
            await createImageFromData(backSide as (URI|Base64|IURLRequest),progressCallBack);
        return this.game.getRenderer().createCubeTexture(imgLeft,imgRight,imgTop,imgBottom,imgFront,imgBack);
    }

    public async loadText(req: string|IURLRequest,progress?:(n:number)=>void): Promise<string> {
        return await ResourceLoader._loadAndProcessText(req, t=>t,progress);
    }

    public async loadJSON<T>(req: string|IURLRequest,progress?:(n:number)=>void): Promise<T> {
        const postPrecessFn:(t:string)=>T = t=>JSON.parse(t);
        return await ResourceLoader._loadAndProcessText<T>(req,postPrecessFn,progress);
    }

    public async loadSound(req: string|IURLRequest,progress?:(n:number)=>void): Promise<Sound> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        if (progress!==undefined) loader.onProgress = progress;
        const buff:ArrayBuffer = await loader.load();
        const url:string = ((req as string).substr!==undefined)?req as string: (req as IURLRequest).url;
        const ref:UploadedSoundLink = await this.game.getAudioPlayer().uploadBufferToContext(url,buff);
        return new Sound(this.game,ref);
    }

    public async loadBinary(req: string|IURLRequest,progress?:(n:number)=>void): Promise<ArrayBuffer> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        if (progress!==undefined) loader.onProgress = progress;
        return await loader.load();
    }

    public async loadFontFromCssDescription(params:ICssFontParameters,progress?:(n:number)=>void):Promise<Font>{
        return await FontFactory.createFontFromCssDescription(this.game,params,progress);
    }

    public async loadFontFromAtlas(baseUrl:string|IURLRequest, doc:XmlDocument, progress?:(n:number)=>void):Promise<Font>{
        const texturePages:ITextureWithId[] = [];
        const pages:XmlNode[] = doc.querySelectorAll('page');
        if (DEBUG && !pages.length) throw new DebugError(`no 'page' node`);
        for (const page of pages) {
            let baseUrlCopy:string|IURLRequest = baseUrl;
            const pageFile:string = page.getAttribute('file');
            if (DEBUG && !pageFile) throw new DebugError(`no 'file' attribute for 'page' node`);
            if (isString(baseUrlCopy)) {
                baseUrlCopy = ResourceLoader.mergeUrl(pageFile,baseUrlCopy);
            } else {
                baseUrlCopy = {...baseUrlCopy};
                baseUrlCopy.url = ResourceLoader.mergeUrl(pageFile,baseUrlCopy.url);
            }
            const texturePage:ITexture =
                await this.loadTexture(baseUrlCopy,n=>{
                    if (progress!==undefined) progress(n/pages.length);
                });
            const pageId:number = +page.getAttribute('id');
            if (DEBUG && Number.isNaN(pageId)) throw new DebugError(`wrong page id: ${page.getAttribute('id')}`);
            texturePages.push({texture:texturePage,id:pageId});
        }
        return await FontFactory.createFontFromAtlas(this.game,texturePages,doc);
    }

    public addNextTask(task:ITask["fn"]):void {
        this.q.addTask(task);
    }

    public onProgress(fn:(n:number)=>void):void{
        this.q.onProgress = fn;
    }

    public onResolved(fn:()=>void):void{
        this.q.onResolved.push(fn);
    }

    public async start():Promise<void>{
        return this.q.start();
    }

    public clearCache():void {
        ResourceCache.clear();
    }

    public isResolved():boolean {
        return this.q.isResolved();
    }


}
