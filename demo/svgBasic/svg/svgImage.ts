import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ISize} from "@engine/geometry/size";
import {DebugError} from "@engine/debug/debugError";
import {LazyImageCacheSurface} from "@engine/renderable/impl/surface/lazyImageCacheSurface";
import {ITexture} from "@engine/renderer/common/texture";
import {TaskQueue} from "@engine/resources/taskQueue";
import {XmlDocument, XmlNode} from "@engine/misc/parsers/xml/xmlElements";
import {SvgElementRenderer} from "./_internal/svgElementRenderer";
import {SvgUtils} from "./_internal/svgUtils";


export class SvgImage extends SimpleGameObjectContainer {

    private constructor(game:Game, private doc:XmlDocument, private preferredSize?:ISize) {
        super(game);
    }

    private svgElementRenderer:SvgElementRenderer;
    private preloadedTextures:Record<string,ITexture> = {};

    public static async create(game:Game, taskQueue:TaskQueue, doc:XmlDocument, preferredSize?:ISize):Promise<SvgImage> {
        const image:SvgImage = new SvgImage(game, doc, preferredSize);
        await image.preload(taskQueue);
        image.parse();
        return image;
    }

    private parse():void {

        const rootSvgTag:XmlNode = this.doc.querySelector('svg');
        console.log(this.doc, rootSvgTag);

        const viewBox:[number,number,number,number] = SvgUtils.getNumberArray(rootSvgTag.getAttribute('viewBox'),4,0);
        let width:number = SvgUtils.getNumberWithMeasure(rootSvgTag.getAttribute('width'),this.game.size.width,0) || viewBox[2];
        let height:number = SvgUtils.getNumberWithMeasure(rootSvgTag.getAttribute('height'),this.game.size.height,0) || viewBox[3];
        if (width===0) width = 100;
        if (height===0) height = 100;
        if (viewBox[2]===0) viewBox[2] = width;
        if (viewBox[3]===0) viewBox[3] = height;

        const rootView:RenderableModel = new SimpleGameObjectContainer(this.game);
        rootView.pos.setXY(-viewBox[0],-viewBox[1]);
        if (this.preferredSize!==undefined) {
            this.size.setFrom(this.preferredSize);
        } else {
            this.size.setWH(width,height);
        }
        const scaleByViewPort:number = Math.min(this.size.width/viewBox[2],this.size.height/viewBox[3]);
        rootView.scale.setXY(scaleByViewPort);

        this.svgElementRenderer = new SvgElementRenderer(this.game,rootSvgTag,this,this.preloadedTextures);

        this.traverseDocument(rootView,rootSvgTag);
        const drawingSurface = new LazyImageCacheSurface(this.game,this.size);
        drawingSurface.appendChild(rootView);
        drawingSurface.requestRedraw();
        this.appendChild(drawingSurface);

        //this.appendChild(rootView);
    }

    private async preload(taskQueue:TaskQueue):Promise<void> {
        if (DEBUG) {
            if (taskQueue.getLoader().isResolved()) {
                throw new DebugError(`current taskQueue is completed`);
            }
        }
        const elements:XmlNode[] = this.doc.querySelectorAll('image');
        for (const el of elements) {
            const url:string = el.getAttribute('xlink:href');
            if (!url) continue;
            this.preloadedTextures[url] = await taskQueue.getLoader().loadTexture(url);
        }
    }

    private traverseDocument(view:RenderableModel,el:XmlNode):void {
        this.svgElementRenderer.renderTag(view,el);
    }

}
