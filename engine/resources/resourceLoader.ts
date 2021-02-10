import {Game} from "../core/game";
import {IURLRequest, UrlLoader} from "@engine/resources/urlLoader";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Base64, Optional, URI} from "@engine/core/declarations";
import {ResourceUtil} from "@engine/resources/resourceUtil";
import {Document} from "@engine/misc/xmlUtils";
import {Font, FontFactory, ICssFontParameters} from "@engine/renderable/impl/general/font";
import createImageFromData = ResourceUtil.createImageFromData;
import {Sound} from "@engine/media/sound";

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

    private static createUrlLoader<T extends string|ArrayBuffer>(req: URI|IURLRequest,responseType:'arraybuffer'|'text' = 'text'):UrlLoader<T>{
        let iReq:IURLRequest;
        if ((req as string).substr!==undefined){
            iReq = {url:req as string,responseType,method:'GET'};
        } else iReq = req as IURLRequest;
        return new UrlLoader(iReq);
    }

    private static async _loadAndProcessText<T>(req: string|IURLRequest, postProcess:(s:string)=>T): Promise<T> {
        const loader:UrlLoader<string> = ResourceLoader.createUrlLoader<string>(req as (URI|IURLRequest));
        const text:string = await loader.load();
        return postProcess(text);
    }

    public async loadTexture(req: string|IURLRequest): Promise<ITexture> {
        const fromCache:Optional<ITexture> = ResourceCache.cache[(req as IURLRequest).url??req];
        if (fromCache!==undefined) {
            return fromCache;
        }
        const img:HTMLImageElement|ImageBitmap = await createImageFromData(req as (URI|Base64|IURLRequest));
        return this.game.getRenderer().createTexture(img);
    }

    public async loadCubeTexture(
        leftSide: string|IURLRequest, rightSide:string|IURLRequest,
        topSide: string|IURLRequest, bottomSide:string|IURLRequest,
        frontSide: string|IURLRequest, backSide:string|IURLRequest,
    ): Promise<ICubeMapTexture> {
        const imgLeft:HTMLImageElement|ImageBitmap =
            await createImageFromData(leftSide as (URI|Base64|IURLRequest));
        const imgRight:HTMLImageElement|ImageBitmap =
            await createImageFromData(rightSide as (URI|Base64|IURLRequest));
        const imgTop:HTMLImageElement|ImageBitmap =
            await createImageFromData(topSide as (URI|Base64|IURLRequest));
        const imgBottom:HTMLImageElement|ImageBitmap =
            await createImageFromData(bottomSide as (URI|Base64|IURLRequest));
        const imgFront:HTMLImageElement|ImageBitmap =
            await createImageFromData(frontSide as (URI|Base64|IURLRequest));
        const imgBack:HTMLImageElement|ImageBitmap =
            await createImageFromData(backSide as (URI|Base64|IURLRequest));
        return this.game.getRenderer().createCubeTexture(imgLeft,imgRight,imgTop,imgBottom,imgFront,imgBack);
    }

    public async loadText(req: string|IURLRequest): Promise<string> {
        return await ResourceLoader._loadAndProcessText(req, t=>t);
    }

    public async loadJSON<T>(req: string|IURLRequest): Promise<T> {
        const postPrecessFn:(t:string)=>T = t=>JSON.parse(t);
        return await ResourceLoader._loadAndProcessText<T>(req,postPrecessFn);
    }

    public async loadSound(req: string|IURLRequest): Promise<Sound> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        const buff:ArrayBuffer = await loader.load();
        const url:string = ((req as string).substr!==undefined)?req as string: (req as IURLRequest).url;
        await this.game.getAudioPlayer().uploadBufferToContext(url,buff);
        return new Sound(this.game,url);
    }

    public async loadBinary(req: string|IURLRequest): Promise<ArrayBuffer> {
        const loader:UrlLoader<ArrayBuffer> = ResourceLoader.createUrlLoader<ArrayBuffer>(req as (URI|IURLRequest),'arraybuffer');
        return await loader.load();
    }

    public async loadFont(params:ICssFontParameters):Promise<Font>{
        return await FontFactory.createFontFromCssDescription(this.game,params);
    }

    public async loadFontFromAtlas(atlasPageUrls:(string|IURLRequest)[],doc:Document):Promise<Font>{
        const texturePages:ITexture[] = [];
        for (const atlasPageUrl of atlasPageUrls) {
            const texturePage:ITexture = await this.loadTexture(atlasPageUrl);
            texturePages.push(texturePage);
        }
        return await FontFactory.createFontFromAtlas(this.game,texturePages,doc);
    }

    public clearCache():void {
        ResourceCache.clear();
    }


}
