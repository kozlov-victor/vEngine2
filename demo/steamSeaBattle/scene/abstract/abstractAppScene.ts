import {Scene} from "@engine/model/impl/general/scene";
import {Rectangle} from "@engine/model/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Element, IElement} from "../../data/assetsDocumentHolder";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/texture";
import {Layer} from "@engine/model/impl/general/layer";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {GameObject} from "@engine/model/impl/general/gameObject";
import {Image} from "@engine/model/impl/geometry/image";
import {Sound} from "@engine/model/impl/general/sound";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {NullGameObject} from "@engine/model/impl/general/nullGameObject";


export abstract class AbstractAppScene extends Scene {
    protected sounds:Record<string,Sound> = {};
    private links:Record<string,ResourceLink<ITexture>> = {};

    public onPreloading() {
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        rect.pos.setY(200);
        this.preloadingGameObject = rect;

        this.getSceneElement().getElementsByTagName('gameObject').forEach((el:Element)=>{
            this.links[el.attributes.src] = this.resourceLoader.loadImage(`./steamSeaBattle/data/images/${el.attributes.src}`);
        });

        this.getSceneElement().getElementsByTagName('sound').forEach((el:Element)=>{
            const sound:Sound = new Sound(this.game);
            sound.setResourceLink(this.resourceLoader.loadSound(`./steamSeaBattle/data/sounds/${el.attributes.src}`));
            this.sounds[el.attributes.src.split('.')[0]] = sound;
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

    private getNumber(val:string){
        const n:number = +val;
        return n;
    }

    private getBoolean(val:string):boolean{
        return val==='1';
    }

    private afterObjectCreated(root:RenderableModel|Layer,r:RenderableModel,el:IElement){
        r.pos.setXY(this.getNumber(el.attributes.left),this.getNumber(el.attributes.top));
        const rotationPointX:number = this.getNumber(el.attributes.rotationPointX)||0;
        const rotationPointY:number = this.getNumber(el.attributes.rotationPointY)||0;
        r.rotationPoint.setXY(rotationPointX,rotationPointY);
        r.id = el.attributes.id;
        r.visible = !this.getBoolean(el.attributes.hidden);
        r.passMouseEventsThrough = this.getBoolean(el.attributes.passMouseEventsThrough);
        root.appendChild(r);
        this.resolveChildren(r,el.children);
    }

    private createTweenDesc(root:Layer|RenderableModel,child:IElement):ITweenDescription{
        return {
            target: root,
            from: {[child.attributes.property]:this.getNumber(child.attributes.from)},
            to: {[child.attributes.property]:this.getNumber(child.attributes.to)},
            time: this.getNumber(child.attributes.time),
            loop: this.getBoolean(child.attributes.loop),
        };
    }

    private resolveChildren(root:Layer|RenderableModel,children:IElement[]){
        children.forEach((child:IElement)=>{
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
                    (r.fillColor as Color).setRGBA(82,54,136,122);
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
                    child.children.forEach((c:IElement)=>{
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
                    this.afterObjectCreated(root,go,child);
                    break;
                }
                default:
                    console.log(`unknown tag: ${child.tagName}`);
                    //throw new Error(`unknown tag: ${child.tagName}`);
            }
        });
    }

}