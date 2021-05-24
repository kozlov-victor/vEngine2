import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ITexture} from "@engine/renderer/common/texture";
import {Layer} from "@engine/scene/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Image} from "@engine/renderable/impl/general/image";
import {Sound} from "@engine/media/sound";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {DebugError} from "@engine/debug/debugError";
import {ImageButton} from "@engine/renderable/impl/ui/button/imageButton";
import {TaskQueue} from "@engine/resources/taskQueue";
import {XmlNode} from "@engine/misc/xml/xmlELements";


export abstract class AbstractAppScene extends Scene {
    protected sounds:Record<string,Sound> = {};
    private links:Record<string,ITexture> = {};

    public onPreloading(taskQueue:TaskQueue):void {
        const assetsFolder:string = 'data';
        const assetsPostfix:string = '';
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        rect.pos.setY(200);
        this.preloadingGameObject = rect;

        this.getSceneElement().getElementsByTagName('image').forEach((el:XmlNode)=>{
            taskQueue.addNextTask(async progress=>{
                this.links[el.getAttribute('src')] =
                    await taskQueue.getLoader().loadTexture({
                        url:`./steamSeaBattle/${assetsFolder}/images/${el.getAttribute('src')}${assetsPostfix}`,
                        responseType: 'arraybuffer',
                    },progress);
            });
        });
        this.getSceneElement().getElementsByTagName('imageButton').forEach((el:XmlNode)=>{
            taskQueue.addNextTask(async progress=>{
                this.links[el.getAttribute('src-on')] =
                    await taskQueue.getLoader().loadTexture({
                        url: `./steamSeaBattle/${assetsFolder}/images/${el.getAttribute('src-on')}${assetsPostfix}`,
                        responseType: 'arraybuffer'
                    },progress);
            });
            taskQueue.addNextTask(async progress=>{
                this.links[el.getAttribute('src-off')] =
                    await taskQueue.getLoader().loadTexture({
                        url: `./steamSeaBattle/${assetsFolder}/images/${el.getAttribute('src-off')}${assetsPostfix}`,
                        responseType: 'arraybuffer'
                    },progress);
            });
        });

        this.getSceneElement().getElementsByTagName('sound').forEach((el:XmlNode)=>{
            taskQueue.addNextTask(async progress=>{
                const sound =
                    await taskQueue.getLoader().loadSound(
                        {
                            url:`./steamSeaBattle/${assetsFolder}/sounds/${el.getAttribute('src')}${assetsPostfix}`,
                            responseType: 'arraybuffer'
                        },
                        progress
                    );
                sound.offset = this.getNumber(el.getAttribute('offset'),0);
                sound.gain = this.getNumber(el.getAttribute('gain'),1);
                this.sounds[el.getAttribute('src').replace('.js','').split('.')[0]] = sound;
            });
        });

    }

    public onReady(): void {
        const layerElements:XmlNode[] = this.getSceneElement().getElementsByTagName('layer');
        if (!layerElements.length) throw new Error(`no layer provided to scene`);
        console.log(layerElements);
        layerElements.forEach((el:XmlNode)=>{
            const layer:Layer = new Layer(this.game);
            this.appendChild(layer);
            this.resolveChildren(layer,el.getChildNodes());
        });
    }


    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    protected abstract getSceneElement():XmlNode;

    private getNumber(val:string,defaultVal?:number):number{
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

    private require(val:string|number):typeof val{
        if (val===undefined) throw new Error('value is required');
        return val;
    }

    private afterObjectCreated(root:RenderableModel|Layer,r:RenderableModel,el:XmlNode):void{
        r.pos.setXY(this.getNumber(el.getAttribute('left')),this.getNumber(el.getAttribute('top')));
        const rotationPointX:number = this.getNumber(el.getAttribute('rotationPointX'),0);
        const rotationPointY:number = this.getNumber(el.getAttribute('rotationPointY'),0);
        r.transformPoint.setXY(rotationPointX,rotationPointY);
        r.id = el.getAttribute('id');
        r.visible = !this.getBoolean(el.getAttribute('hidden'));
        r.passMouseEventsThrough = this.getBoolean(el.getAttribute('passMouseEventsThrough'));
        root.appendChild(r);
        this.resolveChildren(r,el.getChildNodes());
    }


    private getObjectByPath(path:string,obj:Record<string,unknown>):Record<string,unknown> {
        if (!path) return obj;
        let result = obj;
        path.split('.').forEach(pathSegment=>{
            result = result[pathSegment] as Record<string,unknown>;
        });
        return result;
    }

    private createTweenDesc(target:Layer|RenderableModel,path:string,child:XmlNode):ITweenDescription<unknown>{
        return {
            target: this.getObjectByPath(path,target as unknown as Record<string,unknown>),
            from: {[child.getAttribute('property')]:this.getNumber(child.getAttribute('from'))},
            to: {[child.getAttribute('property')]:this.getNumber(child.getAttribute('to'))},
            time: this.getNumber(child.getAttribute('time')),
            loop: this.getBoolean(child.getAttribute('loop')),
        };
    }

    private resolveChildren(root:Layer|RenderableModel,children:XmlNode[]):void{
        children.forEach((child:XmlNode)=>{
            switch (child.tagName) {
                case 'image': {
                    const img:Image = new Image(this.game,this.links[child.getAttribute('src')]);
                    this.afterObjectCreated(root,img,child);
                    break;
                }
                case 'rectangle': {
                    const r:Rectangle = new Rectangle(this.game);
                    r.size.setWH(
                        this.getNumber(child.getAttribute('width')),
                        this.getNumber(child.getAttribute('height'))
                    );
                    r.fillColor.setRGBA(82,54,136,122);
                    this.afterObjectCreated(root,r,child);
                    break;
                }
                case 'animation': {
                    const targetPath:string = child.getAttribute('target');
                    const tween = new Tween(this.createTweenDesc(root,targetPath,child));
                    this.game.getCurrentScene().addTween(tween);
                    break;
                }
                case 'animationComposition': {
                    const tweenMovie:TweenMovie = new TweenMovie(this.game);
                    child.getChildNodes().forEach((c:XmlNode)=>{
                        const targetPath:string = c.getAttribute('target');
                        const tweenDesc = this.createTweenDesc(root,targetPath,c);
                        const startTime:number = this.getNumber(c.getAttribute('offset'));
                        tweenMovie.addTween(startTime,tweenDesc);
                    });
                    tweenMovie.loop(this.getBoolean(child.getAttribute('loop')));
                    this.addTweenMovie(tweenMovie);
                    break;
                }
                case 'nullGameObject': {
                    const go:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
                    go.size.setWH(
                        this.getNumber(child.getAttribute('width')),
                        this.getNumber(child.getAttribute('height'))
                    );
                    this.afterObjectCreated(root,go,child);
                    break;
                }
                case 'imageButton': {
                    const imgOn:Image = new Image(this.game,this.links[child.getAttribute('src-on')]);
                    if (DEBUG) {
                        if (child.getAttribute('src-on' )===undefined) throw new DebugError('no src-on  attribute');
                        if (child.getAttribute('src-off')===undefined) throw new DebugError('no src-off attribute');
                    }
                    const imgOff:Image = new Image(this.game,this.links[child.getAttribute('src-off')]);
                    const btn:ImageButton = new ImageButton(this.game,imgOn,imgOff);
                    btn.size.setWH(
                        this.getNumber(child.getAttribute('width')),
                        this.getNumber(child.getAttribute('height'))
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
