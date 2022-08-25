import {Game} from "../core/game";
import {addUrlParameter, IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Base64, Optional, URI} from "@engine/core/declarations";
import type {IXmlNode, XmlDocument, XmlNode} from "@engine/misc/parsers/xml/xmlELements";
import type {Font} from "@engine/renderable/impl/general/font/font";
import {Sound} from "@engine/media/sound";
import {ITask, Queue} from "@engine/resources/queue";
import {UploadedSoundLink} from "@engine/media/interface/iAudioPlayer";
import {DebugError} from "@engine/debug/debugError";
import {isString} from "@engine/misc/object";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import {Image} from "@engine/renderable/impl/general/image/image";
import type {XmlParser} from "@engine/misc/parsers/xml/xmlParser";
import {createFontFromAtlas} from "@engine/renderable/impl/general/font/createFontMethods/createFontFromAtlas";
import {
    createFontFromCssDescription
} from "@engine/renderable/impl/general/font/createFontMethods/createFontFromCssDescription";
import {IParser} from "@engine/misc/parsers/iParser";
import type {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";
import {path} from "@engine/resources/path";
import ICssFontParameters = FontTypes.ICssFontParameters;
import ITextureWithId = FontTypes.ITextureWithId;

export class ResourceLoader {

    public static BASE_URL = '';

    public constructor(private readonly game: Game) {
        this.game = game;
    }

    private readonly q:Queue = new Queue();

    private static _loadHtmlImage = (imgUrl:URI|IURLRequest|Base64,progress?:(n:number)=>void):Promise<HTMLImageElement>=>{
        let url:string = (imgUrl as IURLRequest).url?(imgUrl as IURLRequest).url:(imgUrl as string);
        if (url.indexOf('data:')!==0) url = addUrlParameter(url,'modified',BUILD_AT);
        return new Promise<HTMLImageElement>((resolve,reject)=>{
            const img = new window.Image();
            img.src = url;
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (e:string|Event) => {
                console.error(e);
                const msg:string = DEBUG?`can not load image with url: ${url}`:url;
                reject(msg);
            };
            img.onprogress = (e:ProgressEvent)=>{
                if (progress!==undefined && e.total) progress(e.loaded/e.total);
            };
        });
    };

    // private static async _loadHtmlImage(imgUrl:URI|IURLRequest|Base64,progress?:(n:number)=>void) {
    //     const loadArrayBuffer = async (req: string|IURLRequest,progress?:(n:number)=>void):Promise<ArrayBuffer>=>{
    //         let iReq:IURLRequest;
    //         if ((req as string).substr!==undefined){
    //             iReq = {url:req as string,responseType:'arraybuffer',method:'GET'};
    //         } else iReq = req as IURLRequest;
    //         const loader:UrlLoader<ArrayBuffer> = new UrlLoader(iReq);
    //         if (progress!==undefined) loader.onProgress = progress;
    //         return await loader.load();
    //     };
    //
    //     const arrayBuff = await loadArrayBuffer(imgUrl,progress);
    //     log('loaded array buffer ' + arrayBuff.byteLength);
    //     const arrayBufferView = new Uint8Array(arrayBuff);
    //     const imgBlob = new Blob([arrayBufferView]);
    //     log('created blob ' + imgBlob);
    //     try {
    //         const bitmap = await createImageBitmap(imgBlob,0,0,100,100,{
    //             imageOrientation: 'none',
    //             premultiplyAlpha: 'none',
    //             resizeWidth: 10,
    //             resizeHeight: 10,
    //             resizeQuality: 'high'
    //         });
    //         log('created bitmap ' + bitmap);
    //         return bitmap;
    //     } catch (e) {
    //         log('error creating bitmap: ' + e);
    //         return Promise.reject(e);
    //     }
    // }

    private static _createUrlLoader<T extends string|ArrayBuffer>(req: URI|IURLRequest,responseType:'arraybuffer'|'text' = 'text'):UrlLoader<T>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType,method:'GET'};
        } else iReq = req as IURLRequest;
        return new UrlLoader(iReq);
    }

    private static async _loadAndProcessText<T>(req: string|IURLRequest, postProcess:(s:string)=>T,progressFn?:(n:number)=>void): Promise<T> {
        const loader:UrlLoader<string> = ResourceLoader._createUrlLoader<string>(req as (URI|IURLRequest));
        if (progressFn!==undefined) loader.onProgress = progressFn;
        const text:string = await loader.load();
        return postProcess(text);
    }

    private static _pathJoin(prefix:string|'',req:string | IURLRequest):string | IURLRequest {
        if ((req as IURLRequest).url) {
            const segment = (req as IURLRequest).url;
            if (!segment.startsWith('data:')) (req as IURLRequest).url = path.join(this.BASE_URL,prefix,segment);
            return req;
        } else {
            const segment = req as string;
            if (!segment.startsWith('data:')) return path.join(this.BASE_URL,prefix,segment);
            else return req;
        }
    }

    public async loadTexture(req: string|IURLRequest,progress?:(n:number)=>void): Promise<ITexture> {
        req = ResourceLoader._pathJoin('',req);
        const img:HTMLImageElement|ImageBitmap = await ResourceLoader._loadHtmlImage(req as (URI|Base64|IURLRequest),progress);
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

        leftSide    = ResourceLoader._pathJoin('',leftSide);
        rightSide   = ResourceLoader._pathJoin('',rightSide);
        topSide     = ResourceLoader._pathJoin('',topSide);
        bottomSide  = ResourceLoader._pathJoin('',bottomSide);
        frontSide   = ResourceLoader._pathJoin('',frontSide);
        backSide    = ResourceLoader._pathJoin('',backSide);

        let currProgress:number = 0;
        const progressCallBack = (n:number)=>{
            currProgress+=n;
            if (progress!==undefined) progress(n/6);
        };

        const imgLeft:HTMLImageElement|ImageBitmap =
            await ResourceLoader._loadHtmlImage(leftSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgRight:HTMLImageElement|ImageBitmap =
            await ResourceLoader._loadHtmlImage(rightSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgTop:HTMLImageElement|ImageBitmap =
            await ResourceLoader._loadHtmlImage(topSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgBottom:HTMLImageElement|ImageBitmap =
            await ResourceLoader._loadHtmlImage(bottomSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgFront:HTMLImageElement|ImageBitmap =
            await ResourceLoader._loadHtmlImage(frontSide as (URI|Base64|IURLRequest),progressCallBack);
        const imgBack:HTMLImageElement|ImageBitmap =
            await ResourceLoader._loadHtmlImage(backSide as (URI|Base64|IURLRequest),progressCallBack);
        return this.game.getRenderer().createCubeTexture(imgLeft,imgRight,imgTop,imgBottom,imgFront,imgBack);
    }

    public async loadText(req: string|IURLRequest,progress?:(n:number)=>void): Promise<string> {
        req = ResourceLoader._pathJoin('',req);
        return await ResourceLoader._loadAndProcessText(req, t=>t,progress);
    }

    public async loadXML(xmlParserClass: typeof XmlParser,req: string|IURLRequest,progress?:(n:number)=>void): Promise<XmlDocument> {
        const text = await this.loadText(req,progress);
        const xmlParser = new xmlParserClass(text);
        return xmlParser.getTree();
    }

    public async loadYAML(yamlParserClass: typeof YamlParser,req: string|IURLRequest,progress?:(n:number)=>void): Promise<XmlDocument> {
        const text = await this.loadText(req,progress);
        const yamlParser = new yamlParserClass(text);
        return yamlParser.getResult();
    }

    public async loadJSON<T>(req: string|IURLRequest,progress?:(n:number)=>void): Promise<T> {
        req = ResourceLoader._pathJoin('',req);
        const postPrecessFn:(t:string)=>T = t=>JSON.parse(t);
        return await ResourceLoader._loadAndProcessText<T>(req,postPrecessFn,progress);
    }

    public async loadSound(req: string|IURLRequest,progress?:(n:number)=>void): Promise<Sound> {
        req = ResourceLoader._pathJoin('',req);
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader._createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        if (progress!==undefined) loader.onProgress = progress;
        const buff:ArrayBuffer = await loader.load();
        const url:string = ((req as string).substr!==undefined)?req as string: (req as IURLRequest).url;
        const ref:UploadedSoundLink = await this.game.getAudioPlayer().uploadBufferToContext(url,buff);
        return new Sound(this.game,ref);
    }

    public async loadBinary(req: string|IURLRequest,progress?:(n:number)=>void): Promise<ArrayBuffer> {
        req = ResourceLoader._pathJoin('',req);
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader._createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        if (progress!==undefined) loader.onProgress = progress;
        return await loader.load();
    }

    public async loadFontFromCssDescription(params:ICssFontParameters,progress?:(n:number)=>void):Promise<Font>{
        return createFontFromCssDescription(this.game, params);
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
                baseUrlCopy = path.join(ResourceLoader.BASE_URL,baseUrlCopy,pageFile);
            } else {
                baseUrlCopy = {...baseUrlCopy};
                baseUrlCopy.url = path.join(ResourceLoader.BASE_URL,baseUrlCopy.url,pageFile);
            }
            const texturePage:ITexture =
                await this.loadTexture(baseUrlCopy,n=>{
                    if (progress!==undefined) progress(n/pages.length);
                });
            const pageId:number = +page.getAttribute('id');
            if (DEBUG && Number.isNaN(pageId)) throw new DebugError(`wrong page id: ${page.getAttribute('id')}`);
            texturePages.push({texture:texturePage,id:pageId});
        }
        return await createFontFromAtlas(this.game,texturePages,doc);
    }

    public async loadFontFromAtlasUrl(baseUrl:string|IURLRequest,docFileName:string,docParser:{new(str:string):IParser<IXmlNode>}, progress?:(n:number)=>void):Promise<Font>{
        let docUrl = baseUrl;
        if (isString(docUrl)) {
            docUrl = path.join(ResourceLoader.BASE_URL,docUrl,docFileName);
        } else {
            docUrl = {
                ...docUrl,
                url:path.join(ResourceLoader.BASE_URL,docUrl.url,docFileName)
            }
        }
        const plainText = await this.loadText(docUrl,n=>progress && progress(n/2));
        const parser = new docParser(plainText);
        const doc = parser.getTree() as XmlNode;
        return this.loadFontFromAtlas(baseUrl,doc,n=>progress && progress(n/2));
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

    public isResolved():boolean {
        return this.q.isResolved();
    }


}
