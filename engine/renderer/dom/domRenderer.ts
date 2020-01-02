import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {Line} from "@engine/renderable/impl/geometry/line";
import {Color} from "@engine/renderer/common/color";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";
import {MathEx} from "@engine/misc/mathEx";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TileMap} from "@engine/renderable/impl/general/tileMap";
import {Rect} from "@engine/geometry/rect";
import {Optional} from "@engine/core/declarations";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {mat4} from "@engine/geometry/mat4";
import Mat16Holder = mat4.Mat16Holder;
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";


interface ICSSStyleDeclaration extends CSSStyleDeclaration{
    msTransformOrigin:string;
    msTransform:string;
}

class Nodes  {
    public properties:{[key:string]:string} = {};

    private children: {[name:string]:VNode} = {};

    constructor(private container:HTMLElement){}


    public register(id:string):void{
        this.children[id] = new VNode();
        if (DEBUG) this.children[id].domEl.setAttribute('data-id',id);
        this.children[id].domEl.style.overflow = 'visible';
        this.container.appendChild(this.children[id].domEl);
    }

    public has(id:string):boolean{
        return !!this.children[id];
    }

    public kill(id:string){
        const node:VNode = this.children[id];
        if (!node) return;
        delete this.children[id];
        this.container.removeChild(node.domEl);
    }

    public getById(r:RenderableModel,register:boolean = false):VNode{
        if (!this.has(r.id) && register) this.register(r.id);
        if (r.parent && this.has(r.parent.id)) {
            const p:RenderableModel = r.parent;
            const parentEl:VNode =  this.getById(p,register);
            parentEl.domEl.appendChild(this.children[r.id].domEl);
        }
        return this.children[r.id];
    }


}

class VNode {

    public properties:{[name:string]:string|number} = {};
    public domEl:HTMLDivElement;

    constructor(){
        this.domEl = document.createElement('div');
        this.domEl.style.cssText = 'position:absolute;';
    }

}


export class DomRenderer extends AbstractRenderer {

    public readonly type:string = 'DomRenderer';

    protected rendererHelper:RendererHelper = new RendererHelper(this.game);

    private matrixStack:MatrixStack;
    private nodes:Nodes;


    constructor(protected game:Game){
        super(game);
        this.matrixStack = new MatrixStack();
        const container:HTMLDivElement = document.createElement('div');
        container.style.cssText = 'position:relative';
        document.body.appendChild(container);
        this.container = container;
        this.nodes = new Nodes(container);
        this.registerResize();
    }

    public beforeFrameDraw(filters:AbstractGlFilter[]):IStateStackPointer{
        if (this.nodes.properties.bg_color!==this.clearColor.asCSS()) {
            this.container.style.backgroundColor = this.clearColor.asCSS();
        }
        return undefined!;
    }

    public drawImage(img: Image): void {
        const node:VNode = this.nodes.getById(img,true);
        this._drawBasicElement(node,img);
        if (img.offset.x!==node.properties.offset_x) {
            node.properties.offset_x = img.offset.x;
            node.domEl.style.backgroundPositionX = `${img.offset.x}px`;
        }
        if (img.offset.y!==node.properties.offset_y) {
            node.properties.offset_y = img.offset.y;
            node.domEl.style.backgroundPositionY = `${img.offset.y}px`;
        }
        if (img.getResourceLink().url!==node.properties.url) {
            node.properties.url = img.getResourceLink().url;
            node.domEl.style.backgroundImage = `url(${img.getResourceLink().url})`;
        }

    }


    public drawLine(line: Line): void {
        const node:VNode = this.nodes.getById(line,true);
        this._drawBasicElement(node,line.getRectangleRepresentation());
        if (line.color.asCSS()!==node.properties.line_color) {
            node.properties.line_color=line.color.asCSS();
            node.domEl.style.backgroundColor = line.color.asCSS();
        }
    }

    public killObject(r: RenderableModel): void {
        this.nodes.kill(r.id);
    }

    public createTexture(imgData:ArrayBuffer|string|HTMLImageElement, link:ResourceLink<ITexture>, onLoaded:()=>void):void {
        const img:HTMLImageElement = new globalThis.Image();
        img.src = link.getUrl();
        img.onload = ()=>{
            link.setTarget({
                size: new Size(img.width, img.height)
            });
            onLoaded();
        };
    }

    public transformSave():void {
        this.matrixStack.save();
    }

    public transformScale(x:number, y:number):void {
        this.matrixStack.scale(x,y);
    }

    public transformReset():void{
        this.matrixStack.resetTransform();
    }

    public transformRotateX(angleInRadians:number):void {
        this.matrixStack.rotateX(angleInRadians);
    }

    public transformRotateY(angleInRadians:number):void {
        this.matrixStack.rotateY(angleInRadians);
    }

    public transformRotateZ(angleInRadians:number):void {
        this.matrixStack.rotateZ(angleInRadians);
    }

    public transformTranslate(x:number, y:number, z:number=0):void{
        this.matrixStack.translate(x,y,z);
    }

    public transformRestore():void{
        this.matrixStack.restore();
    }

    public transformSet(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number): void {
    }

    public drawEllipse(ellispe: Ellipse): void {
    }

    public drawMesh(m: Mesh): void {
    }


    public drawRectangle(rectangle: Rectangle): void {
    }

    public drawTileMap(tileMap: TileMap): void {
    }


    public getError(): Optional<{code: number; desc: string}> {
        return undefined;
    }

    public setLockRect(rect: Rect): void {
    }

    public transformSkewX(a: number): void {
    }

    public transformSkewY(a: number): void {
    }

    public unsetLockRect(): void {
    }



    private _drawBasicElement(node:VNode,model:RenderableModel){
        if (model.pos.x!==node.properties.pos_x) {
            node.properties.pos_x = model.pos.x;
            node.domEl.style.left = `${model.pos.x}px`;
        }
        if (model.pos.y!==node.properties.pos_y) {
            node.properties.pos_y = model.pos.y;
            node.domEl.style.top = `${model.pos.y}px`;
        }
        if (model.size.width!==node.properties.width) {
            node.properties.width = model.size.width;
            node.domEl.style.width = `${model.size.width}px`;
        }
        if (model.size.height!==node.properties.height) {
            node.properties.height = model.size.height;
            node.domEl.style.height = `${model.size.height}px`;
        }
        if (model.transformPoint.x!==node.properties.rotation_point_x || model.transformPoint.y!==node.properties.rotation_point_y) {
            node.properties.rotation_point_x = model.transformPoint.x;
            node.properties.rotation_point_y = model.transformPoint.y;
            node.domEl.style.transformOrigin = `${model.transformPoint.x}px ${model.transformPoint.y}px`;
            (node.domEl.style as ICSSStyleDeclaration).msTransformOrigin = `${model.transformPoint.x}px ${model.transformPoint.y}px`;
        }
        if (model.angle!==node.properties.angle) {
            node.properties.angle = model.angle;
            node.domEl.style.transform = `rotate(${MathEx.radToDeg(model.angle)}deg)`;
            (node.domEl.style as ICSSStyleDeclaration).msTransform = `rotate(${MathEx.radToDeg(model.angle)}deg)`;
        }
    }

}