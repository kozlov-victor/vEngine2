import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Game} from "@engine/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {RenderableModel} from "@engine/model/renderableModel";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {mat4} from "@engine/geometry/mat4";
import {Line} from "@engine/model/impl/ui/drawable/line";
import {Color} from "@engine/renderer/color";
import {ITexture} from "@engine/renderer/texture";
import {Size} from "@engine/geometry/size";

class Nodes  {

    private children: {[name:string]:VNode} = {};
    public properties:{[key:string]:any} = {};

    constructor(private container:HTMLElement){}


    register(id:string):void{
        this.children[id] = new VNode();
        this.container.appendChild(this.children[id].domEl);
    }

    has(id:string):boolean{
        return !!this.children[id];
    }

    kill(id:string){
        const node:VNode = this.children[id];
        if (!node) return;
        delete this.children[id];
        this.container.removeChild(node.domEl);
    }

    getById(r:RenderableModel,register:boolean = false):VNode{
        if (!this.has(r.id) && register) this.register(r.id);
        if (r.parent) {
            const p:RenderableModel = r.parent;
            const parentEl:VNode =  this.getById(p);
            parentEl.domEl.appendChild(this.children[r.id].domEl);
        }
        return this.children[r.id];
    }


}

class VNode {

    properties:{[name:string]:any} = {};
    domEl:HTMLDivElement;

    constructor(){
        this.domEl = document.createElement('div');
        this.domEl.style.cssText = 'position:absolute;';
    }

}


export class DomRenderer extends AbstractRenderer {

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

    beforeFrameDraw(color:Color):void{
        if (this.nodes.properties['bg_color']!==color.asCSS()) {
            this.container.style.backgroundColor = color.asCSS();
        }
    }

    drawImage(img: Image): void {
        const node:VNode = this.nodes.getById(img,true);
        if (img.pos.x!==node.properties['pos_x']) {
            node.properties['pos_x'] = img.pos.x;
            node.domEl.style.left = `${img.pos.x}px`;
        }
        if (img.pos.y!==node.properties['pos_y']) {
            node.properties['pos_y'] = img.pos.y;
            node.domEl.style.top = `${img.pos.y}px`;
        }
        if (img.size.width!==node.properties['width']) {
            node.properties['width'] = img.size.width;
            node.domEl.style.width = `${img.size.width}px`;
        }
        if (img.offset.x!==node.properties['offset_x']) {
            node.properties['offset_x'] = img.offset.x;
            node.domEl.style.backgroundPositionX = `${img.offset.x}px`;
        }
        if (img.offset.y!==node.properties['offset_y']) {
            node.properties['offset_y'] = img.offset.y;
            node.domEl.style.backgroundPositionY = `${img.offset.y}px`;
        }
        if (img.size.height!==node.properties['height']) {
            node.properties['height'] = img.size.height;
            node.domEl.style.height = `${img.size.height}px`;
        }
        if (img.getResourceLink().url!==node.properties['url']) {
            node.properties['url'] = img.getResourceLink().url;
            node.domEl.style.backgroundImage = `url(${img.getResourceLink().url})`;
        }

    }




    drawLine(line: Line): void {
        // linear-gradient(to top right, #fff calc(50% - 1px), #aaa, #fff calc(50% + 1px) );
    }

    killObject(r: RenderableModel): void {
        this.nodes.kill(r.id);
    }

    loadTextureInfo(url:string,link:ResourceLink<ITexture>,onLoaded:()=>void):void {
        const img:HTMLImageElement = new (window as any).Image() as HTMLImageElement;
        img.src = url;
        img.onload = ()=>{
            link.setTarget({
                size: new Size(img.width, img.height)
            });
            onLoaded()
        };
    }

    save():void {
        this.matrixStack.save();
    }

    scale(x:number,y:number):void {
        this.matrixStack.scale(x,y);
    }

    resetTransform():void{
        this.matrixStack.resetTransform();
    }

    rotateX(angleInRadians:number):void {
        this.matrixStack.rotateX(angleInRadians);
    }

    rotateY(angleInRadians:number):void {
        this.matrixStack.rotateY(angleInRadians);
    }

    rotateZ(angleInRadians:number):void {
        this.matrixStack.rotateZ(angleInRadians);
    }

    translate(x:number,y:number,z:number=0):void{
        this.matrixStack.translate(x,y,z);
    }

    restore():void{
        this.matrixStack.restore();
    }

}