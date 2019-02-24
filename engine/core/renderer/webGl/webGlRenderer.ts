import {DebugError} from "@engine/debugError";
import {AbstractDrawer, TextureInfo} from "./renderPrograms/abstract/abstractDrawer";
import {ShapeDrawer} from "./renderPrograms/impl/base/shapeDrawer";
import {FrameBuffer} from "./base/frameBuffer";
import {MatrixStack} from "./base/matrixStack";
import {Texture} from "./base/texture";
import {AddBlendDrawer} from "./renderPrograms/impl/blend/addBlendDrawer";
import {Rect} from "../../geometry/rect";
import {Game} from "../../game";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../color";
import {UniformsInfo} from "./renderPrograms/interface/uniformsInfo";
import {Size} from "../../geometry/size";
import {ModelDrawer} from "./renderPrograms/impl/base/modelDrawer";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Shape} from "@engine/model/impl/ui/generic/shape";
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {AbstractFilter} from "@engine/core/renderer/webGl/filters/abstract/abstractFilter";
import {mat4} from "@engine/core/geometry/mat4";
import MAT16 = mat4.MAT16;
import {FILL_TYPE, SHAPE_TYPE} from "@engine/core/renderer/webGl/renderPrograms/impl/base/shapeDrawer.shader";
import {SimpleRectDrawer} from "@engine/core/renderer/webGl/renderPrograms/impl/base/simpleRectDrawer";
import {SimpleRectDrawer2} from "@engine/core/renderer/webGl/renderPrograms/impl/base/SimpleRectDrawer2";


const getCtx = (el:HTMLCanvasElement):WebGLRenderingContext=>{
    return (
        el.getContext("webgl",{alpha: false}) ||
        el.getContext('experimental-webgl',{alpha: false}) ||
        el.getContext('webkit-3d',{alpha: false}) ||
        el.getContext('moz-webgl',{alpha: false})
    ) as WebGLRenderingContext;
};
const SCENE_DEPTH:number = 1000;
const matrixStack:MatrixStack = new MatrixStack();

const makePositionMatrix = (rect:Rect,viewSize:Size):MAT16=>{
    // proj * modelView
    let zToWMatrix:MAT16 = mat4.makeZToWMatrix(1);
    let projectionMatrix:MAT16 = mat4.ortho(0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
    let scaleMatrix:MAT16 = mat4.makeScale(rect.width, rect.height, 1);
    let translationMatrix:MAT16 = mat4.makeTranslation(rect.x, rect.y, 0);

    let matrix:MAT16 = mat4.matrixMultiply(scaleMatrix, translationMatrix);
    matrix = mat4.matrixMultiply(matrix, matrixStack.getCurrentMatrix());
    matrix = mat4.matrixMultiply(matrix, projectionMatrix);
    matrix = mat4.matrixMultiply(matrix, zToWMatrix);
    return matrix;
};


//  gl.enable(gl.CULL_FACE);
//  gl.enable(gl.DEPTH_TEST);
export class WebGlRenderer extends AbstractCanvasRenderer {

    private gl:WebGLRenderingContext;
    private matrixStack:MatrixStack;
    private shapeDrawer:ShapeDrawer;
    private simpleRectDrawer:SimpleRectDrawer2;
    private modelDrawer:ModelDrawer;
    private addBlendDrawer:AddBlendDrawer;
    private frameBuffer:FrameBuffer;
    private nullTexture:Texture;
    private flipTextureInfo:TextureInfo[];
    private flipUniformInfo:UniformsInfo;
    private currShapeUniformInfo:UniformsInfo;

    constructor(game:Game){
        super(game);
        this.matrixStack = matrixStack;
        this.registerResize();
        this._init();
    }

    private _init(){
    	let gl:WebGLRenderingContext = getCtx(this.container as HTMLCanvasElement);
    	this.gl = gl;

    	this.nullTexture = new Texture(gl);

        this.shapeDrawer = new ShapeDrawer(gl);
        this.simpleRectDrawer = new SimpleRectDrawer2(gl);
        this.modelDrawer = new ModelDrawer(gl);
        this.addBlendDrawer = new AddBlendDrawer(gl);

        this.frameBuffer = new FrameBuffer(gl,this.game.width,this.game.height);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        this._initFlipTexture();
        this.currShapeUniformInfo = {} as UniformsInfo;
        // gl.depthFunc(gl.LEQUAL);
    }

    private _initFlipTexture(){
        let fullScreen:Size = this.fullScreenSize;
        this.flipTextureInfo = [{texture:null,name:'texture'}];
        let offsetX:number = 0, offsetY:number = 0;
        let rw:number = fullScreen.width, rh:number = fullScreen.height;
        let maxSize:number = Math.max(rw,rh);
        let uniforms:UniformsInfo = this.flipUniformInfo = {} as UniformsInfo;
        let sd:ShapeDrawer = this.shapeDrawer;
        if (maxSize==rw) {
            uniforms[sd.u_width] = 1;
            uniforms[sd.u_height] = rh/rw;
            offsetY = (maxSize - rh)/2;
            uniforms[sd.u_rectOffsetLeft] = 0;
            uniforms[sd.u_rectOffsetTop] = offsetY/maxSize;
        } else {
            uniforms[sd.u_height] = 1;
            uniforms[sd.u_width] = rw/rh;
            offsetX = (maxSize - rw)/2;
            uniforms[sd.u_rectOffsetLeft] = offsetX/maxSize;
            uniforms[sd.u_rectOffsetTop] = 0;
        }

        this.save();
        this.translate(0,this.game.height);
        this.scale(1,-1);

        uniforms[sd.u_vertexMatrix] = makePositionMatrix(
            Rect.fromPool().setXYWH( -offsetX, -offsetY,maxSize,maxSize),
            Size.fromPool().setWH(this.game.width,this.game.height)
        );
        this.restore();
        uniforms[sd.u_lineWidth] = 0;
        uniforms[sd.u_borderRadius] = 0;
        uniforms[sd.u_shapeType] = SHAPE_TYPE.RECT;
        uniforms[sd.u_fillType] = FILL_TYPE.TEXTURE;
        uniforms[sd.u_texRect] = [0,0,1,1];
        uniforms[sd.u_texOffset] = [0,0];
        uniforms[sd.u_alpha] = 1;

    }



    private prepareShapeUniformInfo(shape:Shape):UniformsInfo{
        let uniforms:UniformsInfo = this.currShapeUniformInfo;
        let rw:number = shape.getRect().width;
        let rh:number = shape.getRect().height;
        let maxSize:number = Math.max(rw,rh);
        let offsetX:number = 0,offsetY:number = 0;
        let sd:ShapeDrawer = this.shapeDrawer;
        if (maxSize==rw) {
            uniforms[sd.u_width] = 1;
            uniforms[sd.u_height] = rh/rw;
            offsetY = (maxSize - rh)/2;
            uniforms[sd.u_rectOffsetLeft] = 0;
            uniforms[sd.u_rectOffsetTop] = offsetY/maxSize;
        } else {
            uniforms[sd.u_height] = 1;
            uniforms[sd.u_width] = rw/rh;
            offsetX = (maxSize - rw)/2;
            uniforms[sd.u_rectOffsetLeft] = offsetX/maxSize;
            uniforms[sd.u_rectOffsetTop] = 0;
        }
        uniforms[sd.u_vertexMatrix] = makePositionMatrix(
            Rect.fromPool().setXYWH( -offsetX, -offsetY,maxSize,maxSize),
            Size.fromPool().setWH(this.game.width,this.game.height));
        uniforms[sd.u_lineWidth] = Math.min(shape.lineWidth/maxSize,1);
        uniforms[sd.u_color] = shape.color.asGL();
        uniforms[sd.u_alpha] = shape.alpha;

        if (shape.fillColor.type=='LinearGradient') {
            uniforms[sd.u_fillLinearGradient] = shape.fillColor.asGL();
            uniforms[sd.u_fillType] = FILL_TYPE.LINEAR_GRADIENT;
        } else if (shape.fillColor.type=='Color') {
            uniforms[sd.u_fillColor] = shape.fillColor.asGL();
            uniforms[sd.u_fillType] = FILL_TYPE.COLOR;
        }

        return uniforms;
    }

    drawImage(img:Image){
        if (DEBUG) {
            if (!img.getResourceLink()) throw new DebugError(`image resource link is not set`);
            if (!this.renderableCache[img.getResourceLink().getId()]) throw new DebugError(`can not find texture with resource link id ${img.getResourceLink().getId()}`);
        }
        let texture:Texture = this.renderableCache[img.getResourceLink().getId()].texture;
        texture = texture.applyFilters(img.filters,this.frameBuffer);
        let texInfo:TextureInfo[] = [{texture,name:'texture'}];

        let maxSize:number = Math.max(img.width,img.height);
        let sd:ShapeDrawer = this.shapeDrawer;
        let uniforms:UniformsInfo = this.prepareShapeUniformInfo(img);
        uniforms[sd.u_borderRadius] = Math.min(img.borderRadius/maxSize,1);
        uniforms[sd.u_shapeType] = SHAPE_TYPE.RECT;
        uniforms[sd.u_fillType] = FILL_TYPE.TEXTURE;
        uniforms[sd.u_texRect] =
            [
                img.srcRect.x/texture.getSize().width,
                img.srcRect.y/texture.getSize().height,
                img.srcRect.width/texture.getSize().width,
                img.srcRect.height/texture.getSize().height
            ];
        uniforms[sd.u_texOffset] = [img.offset.x/maxSize,img.offset.y/maxSize];

        this.shapeDrawer.draw(texInfo,uniforms,null);
    }

    drawModel(g3d:GameObject3d){
        this.modelDrawer.bindModel(g3d);
        this.modelDrawer.bind();

        matrixStack.scale(1,-1,1);
        let matrix1 = matrixStack.getCurrentMatrix();

        let zToWMatrix = mat4.makeZToWMatrix(1);
        let projectionMatrix = mat4.ortho(0,this.game.width,0,this.game.height,-SCENE_DEPTH,SCENE_DEPTH);
        let matrix2 = mat4.matrixMultiply(projectionMatrix, zToWMatrix);

        let uniforms:UniformsInfo = {
            u_modelMatrix: matrix1,
            u_projectionMatrix: matrix2,
            u_alpha: 1
        };
        let texInfo:TextureInfo[] = [{texture:g3d.texture,name:'u_texture'}];

        this.gl.enable(this.gl.DEPTH_TEST);
        this.modelDrawer.draw(texInfo,uniforms);
        this.modelDrawer.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
    };



    drawRectangle(rectangle:Rectangle){
        let rw:number = rectangle.width;
        let rh:number = rectangle.height;
        let maxSize:number = Math.max(rw,rh);
        let sd:ShapeDrawer = this.shapeDrawer;

        let uniforms:UniformsInfo = this.prepareShapeUniformInfo(rectangle);
        uniforms[sd.u_borderRadius] = Math.min(rectangle.borderRadius/maxSize,1);
        uniforms[sd.u_shapeType] = SHAPE_TYPE.RECT;
        let texInfo:TextureInfo[] = [{texture:this.nullTexture,name:'texture'}];
        this.shapeDrawer.draw(texInfo,uniforms,null);
    }

    drawLine(x1:number,y1:number,x2:number,y2:number,color:Color){

        let dx = x2-x1,dy = y2-y1;
        let uniforms:UniformsInfo = {};
        uniforms.u_vertexMatrix = makePositionMatrix(
            Rect.fromPool().setXYWH(x1,y1,dx,dy),
            Size.fromPool().setWH(this.game.width,this.game.height)
        );
        uniforms.u_rgba = color.asGL();
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    }


    drawEllipse(ellipse:Ellipse){
        let maxR = Math.max(ellipse.radiusX,ellipse.radiusY);
        let maxR2 = maxR*2;

        let uniforms:UniformsInfo = this.prepareShapeUniformInfo(ellipse);
        let sd:ShapeDrawer = this.shapeDrawer;
        uniforms[sd.u_vertexMatrix] = makePositionMatrix(
            Rect.fromPool().setXYWH(0,0,maxR2,maxR2),
            Size.fromPool().setWH(this.game.width,this.game.height)
        );
        uniforms[sd.u_lineWidth] = Math.min(ellipse.lineWidth/maxR,1);
        if (maxR==ellipse.radiusX) {
            uniforms[sd.u_rx] = 0.5;
            uniforms[sd.u_ry] = ellipse.radiusY/ellipse.radiusX*0.5;
        } else {
            uniforms[sd.u_ry] = 0.5;
            uniforms[sd.u_rx] = ellipse.radiusX/ellipse.radiusY*0.5;
        }
        uniforms[sd.u_shapeType] = SHAPE_TYPE.ELLIPSE;
        uniforms[sd.u_width] = 1;
        uniforms[sd.u_height] = 1;
        uniforms[sd.u_rectOffsetLeft] = 1;
        uniforms[sd.u_rectOffsetTop] = 1;
        let texInfo:TextureInfo[] = [{texture:this.nullTexture,name:'texture'}];
        this.shapeDrawer.draw(texInfo,uniforms,null);
    }

    setAlpha(a:number){
        if (DEBUG) throw new DebugError('not implemented');
    }

    save() {
        this.matrixStack.save();
    }

    scale(x:number,y:number) {
        this.matrixStack.scale(x,y);
    }

    resetTransform(){
        this.matrixStack.resetTransform();
    }

    rotateZ(angleInRadians:number) {
        this.matrixStack.rotateZ(angleInRadians);
    }

    rotateY(angleInRadians:number) {
        this.matrixStack.rotateY(angleInRadians);
    }

    translate(x:number,y:number){
        this.matrixStack.translate(x,y);
    }

    restore(){
        this.matrixStack.restore();
    }

    lockRect(rect:Rect) {
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.scissor(rect.x,rect.y,rect.width,rect.height);
    }

    unlockRect(){
        this.gl.disable(this.gl.SCISSOR_TEST);
    }

    clear(){
        this.gl.clearColor(1,1,1,1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //this.gl.clearDepth(1.);
    }

    clearColor(color:Color){
        let arr:number[] = color.asGL();
        this.gl.clearColor(arr[0],arr[1],arr[2],arr[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    beginFrameBuffer(){
        this.save();
        this.frameBuffer.bind();
    }


    flipFrameBuffer(filters:AbstractFilter[]){
        let texToDraw = this.frameBuffer.getTexture().applyFilters(filters,null);
        this.frameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width,this.fullScreenSize.height);
        //this.flipTextureInfo[0].texture = texToDraw;
        //this.shapeDrawer.draw(this.flipTextureInfo,this.flipUniformInfo,null);


        const u:UniformsInfo = {} as UniformsInfo;

        const makePositionMatrix2 = (dstX:number,dstY:number,dstWidth:number,dstHeight:number):number[] =>{
            let projectionMatrix:MAT16 = mat4.ortho(0,dstWidth,0,dstHeight,-1,1);
            let scaleMatrix:MAT16 = mat4.makeScale(dstWidth, dstHeight, 1);
            return mat4.matrixMultiply(scaleMatrix, projectionMatrix);
        };

        const m:MatrixStack = new MatrixStack();
        m.translate(0,1);
        m.scale(1,-1);

        u[this.simpleRectDrawer.u_textureMatrix] = m.getCurrentMatrix();
        u[this.simpleRectDrawer.u_vertexMatrix] = makePositionMatrix2(0,0,texToDraw.size.width,texToDraw.size.height);
        this.simpleRectDrawer.draw([{texture:texToDraw,name:'texture'}],u,null);



        this.restore();
    };

    getError():number{
        if (!DEBUG) return 0;
        let err = this.gl.getError();
        err=err===this.gl.NO_ERROR?0:err;
        if (err) {
            console.log(AbstractDrawer.currentInstance);
        }
        return err;
    }

    loadTextureInfo(url:string,link:ResourceLink,onLoad:()=>void){
        if (this.renderableCache[link.getId()]) {
            onLoad();
            return;
        }
        let img:HTMLImageElement = new (window as any).Image() as HTMLImageElement;
        img.src = url;
        img.onload = ()=>{
            let texture:Texture = new Texture(this.gl);
            texture.setImage(img);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.frameBuffer.getTexture().getGlTexture()); // to restore texture binding
            const ti:TextureInfo = {texture,size:texture.size,name:undefined};
            this.renderableCache[link.getId()] = ti;
            link.setTarget<TextureInfo>(ti);
            onLoad();
        };
        if (DEBUG) {
            img.onerror = ()=>{
                throw new DebugError(`Resource loading error: can not load resource with url "${url}"`);
            }
        }
    }

    destroy(){
        super.destroy();
        this.frameBuffer.destroy();
        AbstractDrawer.destroyAll();
        Object.keys(this.renderableCache).forEach((key:string)=>{
            let t:Texture = this.renderableCache[key].texture;
            t.destroy();
        });
    }

}
