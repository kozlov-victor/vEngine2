import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Image} from "@engine/renderable/impl/general/image";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {Line} from "@engine/renderable/impl/geometry/line";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {MathEx} from "@engine/misc/mathEx";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TileMap} from "@engine/renderable/impl/general/tileMap";
import {Rect} from "@engine/geometry/rect";
import {Optional} from "@engine/core/declarations";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {DebugError} from "@engine/debug/debugError";
import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;


interface ICSSStyleDeclaration extends CSSStyleDeclaration{
    msTransformOrigin:string;
    msTransform:string;
}

class Nodes  {
    public properties:{[key:string]:string} = {};

    private _children: {[name:string]:VNode} = {};

    constructor(private container:HTMLElement){}


    public register(id:string):void{
        this._children[id] = new VNode();
        if (DEBUG) this._children[id].domEl.setAttribute('data-id',id);
        this._children[id].domEl.style.overflow = 'visible';
        this.container.appendChild(this._children[id].domEl);
    }

    public has(id:string):boolean{
        return !!this._children[id];
    }

    public kill(id:string){
        const node:VNode = this._children[id];
        if (!node) return;
        delete this._children[id];
        this.container.removeChild(node.domEl);
    }

    public getById(r:RenderableModel,register:boolean = false):VNode{
        if (!this.has(r.id) && register) this.register(r.id);
        if (r.parent && this.has(r.parent.id)) {
            const p:RenderableModel = r.parent;
            const parentEl:VNode =  this.getById(p,register);
            parentEl.domEl.appendChild(this._children[r.id].domEl);
        }
        return this._children[r.id];
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

    private _matrixStack:MatrixStack;
    private _nodes:Nodes;


    constructor(protected game:Game){
        super(game);
        this._matrixStack = new MatrixStack();
        const container:HTMLDivElement = document.createElement('div');
        container.style.cssText = 'position:relative';
        document.body.appendChild(container);
        this.container = container;
        this._nodes = new Nodes(container);
        this.registerResize();
    }

    public beforeFrameDraw(filters:AbstractGlFilter[]):IStateStackPointer{
        if (this._nodes.properties.bg_color!==this.clearColor.asCSS()) {
            this.container.style.backgroundColor = this.clearColor.asCSS();
        }
        return undefined!;
    }

    public drawImage(img: Image): void {
        const node:VNode = this._nodes.getById(img,true);
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
        const node:VNode = this._nodes.getById(line,true);
        this._drawBasicElement(node,line.getRectangleRepresentation());
        if (line.color.asCSS()!==node.properties.line_color) {
            node.properties.line_color=line.color.asCSS();
            node.domEl.style.backgroundColor = line.color.asCSS();
        }
    }

    public killObject(r: RenderableModel): void {
        this._nodes.kill(r.id);
    }

    public createTexture(bitmap:ImageBitmap|HTMLImageElement):ITexture {
        return undefined!;
    }

    public createCubeTexture(
        imgLeft:ImageBitmap|HTMLImageElement,
        imgRight:ImageBitmap|HTMLImageElement,
        imgTop:ImageBitmap|HTMLImageElement,
        imgBottom:ImageBitmap|HTMLImageElement,
        imgFront:ImageBitmap|HTMLImageElement,
        imgBack:ImageBitmap|HTMLImageElement
    ): ICubeMapTexture {
        if (DEBUG) throw new DebugError(`Cube texture is not supported by this renderer`);
        return undefined!;
    }

    public transformSave():void {
        this._matrixStack.save();
    }

    public transformScale(x:number, y:number):void {
        this._matrixStack.scale(x,y);
    }

    public transformReset():void{
        this._matrixStack.resetTransform();
    }

    public transformRotateX(angleInRadians:number):void {
        this._matrixStack.rotateX(angleInRadians);
    }

    public transformRotateY(angleInRadians:number):void {
        this._matrixStack.rotateY(angleInRadians);
    }

    public transformRotateZ(angleInRadians:number):void {
        this._matrixStack.rotateZ(angleInRadians);
    }

    public transformTranslate(x:number, y:number, z:number=0):void{
        this._matrixStack.translate(x,y,z);
    }

    public transformRotationReset(): void {
    }

    public transformRestore():void{
        this._matrixStack.restore();
    }

    public transformSet(
        v0: number, v1: number, v2: number, v3: number,
        v4: number, v5: number, v6: number, v7: number,
        v8: number, v9: number, v10: number, v11: number,
        v12: number, v13: number, v14: number, v15: number
    ): void {
    }

    transformTranslateByMatrixValues(v0: number, v1: number, v2: number, v3: number, v4: number, v5: number, v6: number, v7: number, v8: number, v9: number, v10: number, v11: number, v12: number, v13: number, v14: number, v15: number): void {
    }

    public transformGet(): Readonly<MAT16> {
        return undefined!;
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
