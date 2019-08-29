import {Scene} from "@engine/core/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Element, IElementDescription} from "../../data/assetsDocumentHolder";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/texture";
import {Layer} from "@engine/renderable/impl/general/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {Image} from "@engine/renderable/impl/geometry/image";
import {Sound} from "@engine/media/sound";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {ImageButton} from "@engine/renderable/impl/ui/components/imageButton";
import {DebugError} from "@engine/debug/debugError";


export abstract class AbstractAppScene extends Scene {
    protected sounds:Record<string,Sound> = {};
    private links:Record<string,ResourceLink<ITexture>> = {};

    public onPreloading() {
        const assetsFolder:string = 'data';
        const assetsPostfix:string = '';
        const jsonp:boolean = false;
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        rect.pos.setY(200);
        this.preloadingGameObject = rect;

        this.getSceneElement().getElementsByTagName('gameObject').forEach((el:Element)=>{
            this.links[el.attributes.src] =
                this.resourceLoader.loadImage({
                    url:`./steamSeaBattle/${assetsFolder}/images/${el.attributes.src}${assetsPostfix}`,
                    responseType: 'arraybuffer',
                    jsonp
                });
        });
        this.getSceneElement().getElementsByTagName('imageButton').forEach((el:Element)=>{
            this.links[el.attributes['src-on']] =
                this.resourceLoader.loadImage({
                    url: `./steamSeaBattle/${assetsFolder}/images/${el.attributes['src-on']}${assetsPostfix}`,
                    responseType: 'arraybuffer',
                    jsonp
            });
            this.links[el.attributes['src-off']] =
                this.resourceLoader.loadImage({
                    url: `./steamSeaBattle/${assetsFolder}/images/${el.attributes['src-off']}${assetsPostfix}`,
                    responseType: 'arraybuffer',
                    jsonp
            });
        });

        this.getSceneElement().getElementsByTagName('sound').forEach((el:Element)=>{
            const sound:Sound = new Sound(this.game);
            sound.offset = this.getNumber(el.attributes.offset,0);
            sound.gain = this.getNumber(el.attributes.gain,1);
            sound.setResourceLink(this.resourceLoader.loadSound(
                {
                    url:`./steamSeaBattle/${assetsFolder}/sounds/${el.attributes.src}${assetsPostfix}`,
                    responseType: 'arraybuffer',
                    jsonp
                }
            ));
            this.sounds[el.attributes.src.replace('.js','').split('.')[0]] = sound;
        });

    }

    public onReady(): void {
        const layerElements:Element[] = this.getSceneElement().getElementsByTagName('layer');
        if (!layerElements.length) throw new Error(`no layer provided to scene`);
        layerElements.forEach((lel:Element)=>{
            const layer:Layer = new Layer(this.game);
            this.addLayer(layer);
            this.resolveChildren(layer,lel.children);
        });
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    protected abstract getSceneElement():Element;

    private getNumber(val:string,defaultVal?:number){
        let n:number = +val;
        if (isNaN(n)) {
            if (defaultVal!==undefined) n = defaultVal;
            else throw new Error('can not parse number');
        }
        return n;
    }

    private getBoolean(val:string):boolean{
        return val==='1';
    }

    private require(val:any):typeof val{
        if (val===undefined) throw new Error('value is required');
        return val;
    }

    private afterObjectCreated(root:RenderableModel|Layer,r:RenderableModel,el:IElementDescription){
        r.pos.setXY(this.getNumber(el.attributes.left),this.getNumber(el.attributes.top));
        const rotationPointX:number = this.getNumber(el.attributes.rotationPointX,0);
        const rotationPointY:number = this.getNumber(el.attributes.rotationPointY,0);
        r.rotationPoint.setXY(rotationPointX,rotationPointY);
        r.id = el.attributes.id;
        r.visible = !this.getBoolean(el.attributes.hidden);
        r.passMouseEventsThrough = this.getBoolean(el.attributes.passMouseEventsThrough);
        root.appendChild(r);
        this.resolveChildren(r,el.children);
    }

    private createTweenDesc(root:Layer|RenderableModel,child:IElementDescription):ITweenDescription{
        return {
            target: root,
            from: {[child.attributes.property]:this.getNumber(child.attributes.from)},
            to: {[child.attributes.property]:this.getNumber(child.attributes.to)},
            time: this.getNumber(child.attributes.time),
            loop: this.getBoolean(child.attributes.loop),
        };
    }

    private resolveChildren(root:Layer|RenderableModel,children:IElementDescription[]){
        children.forEach((child:IElementDescription)=>{
            switch (child.tagName) {
                case 'gameObject': {
                    const go:GameObject = new GameObject(this.game);
                    const img:Image = new Image(this.game);
                    img.setResourceLink(this.links[child.attributes.src]);
                    go.sprite = img;
                    this.afterObjectCreated(root,go,child);
                    break;
                }
                case 'rectangle': {
                    const r:Rectangle = new Rectangle(this.game);
                    r.size.setWH(
                        this.getNumber(child.attributes.width),
                        this.getNumber(child.attributes.height)
                    );
                    (r.fillColor as Color).setRGBA(82,54,136,122); // todo
                    this.afterObjectCreated(root,r,child);
                    break;
                }
                case 'animation': {
                    const tween:Tween = new Tween(this.createTweenDesc(root,child));
                    this.game.getCurrScene().addTween(tween);
                    break;
                }
                case 'animationComposition': {
                    const tweenMovie:TweenMovie = new TweenMovie(this.game);
                    child.children.forEach((c:IElementDescription)=>{
                        const tweenDesc:ITweenDescription = this.createTweenDesc(root,c);
                        const startTime:number = this.getNumber(c.attributes.offset);
                        tweenMovie.addTween(startTime,tweenDesc);
                    });
                    tweenMovie.loop(this.getBoolean(child.attributes.loop));
                    this.addTweenMovie(tweenMovie);
                    break;
                }
                case 'nullGameObject': {
                    const go:NullGameObject = new NullGameObject(this.game);
                    go.size.setWH(
                        this.getNumber(child.attributes.width),
                        this.getNumber(child.attributes.height)
                    );
                    this.afterObjectCreated(root,go,child);
                    break;
                }
                case 'imageButton': {
                    const imgOn:Image = new Image(this.game);
                    if (DEBUG) {
                        if (child.attributes['src-on' ]===undefined) throw new DebugError('no src-on  attribute');
                        if (child.attributes['src-off']===undefined) throw new DebugError('no src-off attribute');
                    }
                    imgOn.setResourceLink(this.links[child.attributes['src-on']]);
                    const imgOff:Image = new Image(this.game);
                    imgOff.setResourceLink(this.links[child.attributes['src-off']]);
                    const btn:ImageButton = new ImageButton(this.game,imgOn,imgOff);
                    btn.size.setWH(
                        this.getNumber(child.attributes.width),
                        this.getNumber(child.attributes.height)
                    );
                    this.afterObjectCreated(root,btn,child);
                    break;
                }
                default:
                    throw new Error(`unknown tag: ${child.tagName}`);
            }
        });
    }

}