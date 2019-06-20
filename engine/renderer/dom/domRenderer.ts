import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Image} from "@engine/model/impl/geometry/image";
import {Game} from "@engine/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {mat4} from "@engine/geometry/mat4";
import {Line} from "@engine/model/impl/geometry/line";
import {Color} from "@engine/renderer/color";
import {ITexture} from "@engine/renderer/texture";
import {Size} from "@engine/geometry/size";
import {MathEx} from "@engine/misc/mathEx";

class Nodes  {
    public properties:{[key:string]:any} = {};

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

    public properties:{[name:string]:any} = {};
    public domEl:HTMLDivElement;

    constructor(){
        this.domEl = document.createElement('div');
        this.domEl.style.cssText = 'position:absolute;';
    }

}


export class DomRenderer extends AbstractRenderer {

    public readonly type:string = 'DomRenderer';

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

    public beforeFrameDraw(color:Color):void{
        if (this.nodes.properties.bg_color!==color.asCSS()) {
            this.container.style.backgroundColor = color.asCSS();
        }
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

    public loadTextureInfo(url:string,link:ResourceLink<ITexture>,onLoaded:()=>void):void {
        const img:HTMLImageElement = new (window as any).Image() as HTMLImageElement;
        img.src = url;
        img.onload = ()=>{
            link.setTarget({
                size: new Size(img.width, img.height)
            });
            onLoaded();
        };
    }

    public save():void {
        this.matrixStack.save();
    }

    public scale(x:number,y:number):void {
        this.matrixStack.scale(x,y);
    }

    public resetTransform():void{
        this.matrixStack.resetTransform();
    }

    public rotateX(angleInRadians:number):void {
        this.matrixStack.rotateX(angleInRadians);
    }

    public rotateY(angleInRadians:number):void {
        this.matrixStack.rotateY(angleInRadians);
    }

    public rotateZ(angleInRadians:number):void {
        this.matrixStack.rotateZ(angleInRadians);
    }

    public translate(x:number,y:number,z:number=0):void{
        this.matrixStack.translate(x,y,z);
    }

    public restore():void{
        this.matrixStack.restore();
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
        if (model.rotationPoint.x!==node.properties.rotation_point_x || model.rotationPoint.y!==node.properties.rotation_point_y) {
            node.properties.rotation_point_x = model.rotationPoint.x;
            node.properties.rotation_point_y = model.rotationPoint.y;
            node.domEl.style.transformOrigin = `${model.rotationPoint.x}px ${model.rotationPoint.y}px`;
            (node.domEl.style as any).msTransformOrigin = `${model.rotationPoint.x}px ${model.rotationPoint.y}px`;
        }
        if (model.angle!==node.properties.angle) {
            node.properties.angle = model.angle;
            node.domEl.style.transform = `rotate(${MathEx.radToDeg(model.angle)}deg)`;
            (node.domEl.style as any).msTransform = `rotate(${MathEx.radToDeg(model.angle)}deg)`;
        }
    }

}