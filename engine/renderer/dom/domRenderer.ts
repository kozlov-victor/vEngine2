import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Game} from "@engine/game";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {RenderableModel} from "@engine/model/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;
import {Line} from "@engine/model/impl/ui/drawable/line";

class Nodes  {

    private children: {[name:string]:VNode} = {};

    register(id:string):void{
        this.children[id] = new VNode();
    }

    has(id:string):boolean{
        return !!this.children[id];
    }

    kill(id:string){
        const node:VNode = this.children[id];
        delete this.children[id];
        document.removeChild(node.domEl);
    }

    getById(id:string):VNode{
        if (!this.has(id)) this.register(id);
        return this.children[id];
    }

}

class VNode {

    properties:{[name:string]:any} = {};
    domEl:HTMLDivElement;

    constructor(){
        this.domEl = document.createElement('div');
    }

}


export class DomRenderer extends AbstractRenderer {

    private matrixStack:MatrixStack;
    private nodes:Nodes = new Nodes();


    constructor(protected game:Game){
        super(game);
        this.matrixStack = new MatrixStack();
        const container:HTMLDivElement = document.createElement('div');
        document.body.appendChild(container);
    }

    drawImage(img: Image): void {
        const node:VNode = this.nodes.getById(img.id);
        if (img.pos.x!==node.properties['pos_x'] || img.pos.y!==node.properties['pos_y']) {
            node.properties['pos_x'] = img.pos.x;
            node.properties['pos_y'] = img.pos.y;
            const currMatrix:MAT16 = this.matrixStack.getCurrentMatrix().mat16;
            const m16s:string = `
                ${currMatrix[0]} ${currMatrix[1]} ${currMatrix[2]}
                ${currMatrix[4]} ${currMatrix[5]} ${currMatrix[6]}
                ${currMatrix[8]} ${currMatrix[9]} ${currMatrix[10]}
                ${currMatrix[12]} ${currMatrix[13]} ${currMatrix[14]}
            `;
        }
    }


    drawLine(line: Line): void {
        // linear-gradient(to top right, #fff calc(50% - 1px), #aaa, #fff calc(50% + 1px) );
    }

    killObject(r: RenderableModel): void {
        this.nodes.kill(r.id);
    }

    loadTextureInfo(url:string,link:ResourceLink<Texture>,onLoaded:()=>void):void {
        const img:HTMLImageElement = new (window as any).Image() as HTMLImageElement;
        img.onload = ()=>onLoaded();
    }

    setAlpha(a:number):void{
        if (DEBUG) throw new DebugError('not implemented');
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