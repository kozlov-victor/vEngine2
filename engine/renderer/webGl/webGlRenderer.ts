import {DebugError} from "@engine/debug/debugError";
import {AbstractDrawer} from "./programs/abstract/abstractDrawer";
import {ShapeDrawer} from "./programs/impl/base/shapeDrawer";
import {FrameBuffer} from "./base/frameBuffer";
import {MatrixStack} from "./base/matrixStack";
import {Texture} from "./base/texture";
import {Rect} from "../../geometry/rect";
import {Game} from "../../game";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../color";
import {UniformsInfo} from "./programs/interface/uniformsInfo";
import {Size} from "../../geometry/size";
import {ModelDrawer} from "./programs/impl/base/modelDrawer";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Shape} from "@engine/model/impl/ui/generic/shape";
import {ResourceLink} from "@engine/resources/resourceLink";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {mat4} from "@engine/geometry/mat4";
import {FILL_TYPE, SHAPE_TYPE} from "@engine/renderer/webGl/programs/impl/base/shapeDrawer.shader";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/SimpleRectDrawer";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/doubleFrameBuffer";
import {BLEND_MODE} from "@engine/model/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import IDENTITY = mat4.IDENTITY;
import Mat16Holder = mat4.Mat16Holder;


const getCtx = (el:HTMLCanvasElement):WebGLRenderingContext=>{
    const contextAttrs:WebGLContextAttributes = {alpha:false};
    return (
        el.getContext("webgl",contextAttrs) ||
        el.getContext('experimental-webgl',contextAttrs) ||
        el.getContext('webkit-3d',contextAttrs) ||
        el.getContext('moz-webgl',contextAttrs)
    ) as WebGLRenderingContext;
};
const SCENE_DEPTH:number = 1000;
const FLIP_TEXTURE_MATRIX:Mat16Holder = new MatrixStack().translate(0,1).scale(1,-1).getCurrentMatrix();
let FLIP_POSITION_MATRIX:Mat16Holder;

const zToWMatrix:Mat16Holder = mat4.makeZToWMatrix(1);

const makePositionMatrix = (rect:Rect,viewSize:Size,matrixStack:MatrixStack):Mat16Holder=>{
    // proj * modelView
    const projectionMatrix:Mat16Holder = mat4.ortho(0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
    const scaleMatrix:Mat16Holder = mat4.makeScale(rect.size.width, rect.size.height, 1);
    const translationMatrix:Mat16Holder = mat4.makeTranslation(rect.point.x, rect.point.y, 0);

    let matrix:Mat16Holder = mat4.matrixMultiply(scaleMatrix, translationMatrix);
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
    private simpleRectDrawer:SimpleRectDrawer;
    private modelDrawer:ModelDrawer;
    private preprocessFrameBuffer:FrameBuffer;
    private finalFrameBuffer:FrameBuffer;
    private doubleFrameBuffer:DoubleFrameBuffer;
    private blender:Blender;
    private nullTexture:Texture;

    constructor(game:Game){
        super(game);
        this.matrixStack = new MatrixStack();
        this.registerResize();
        this._init();
        FLIP_POSITION_MATRIX = mat4.matrixMultiply(
            mat4.makeScale(this.game.width, this.game.height, 1),
            mat4.ortho(0,this.game.width,0,this.game.height,-1,1)
        );
    }

    private _init():void{
        const gl:WebGLRenderingContext = getCtx(this.container as HTMLCanvasElement);
        if (DEBUG && !gl) throw new DebugError(`WebGLRenderingContext is not supported by this device`);
    	this.gl = gl;

    	this.nullTexture = new Texture(gl);

        this.shapeDrawer = new ShapeDrawer(gl);
        this.simpleRectDrawer = new SimpleRectDrawer(gl);
        this.simpleRectDrawer.prepareShaderGenerator();
        this.simpleRectDrawer.initProgram();
        this.modelDrawer = new ModelDrawer(gl);

        this.preprocessFrameBuffer = new FrameBuffer(gl,this.game.width,this.game.height);
        this.finalFrameBuffer = new FrameBuffer(gl,this.game.width,this.game.height);
        this.doubleFrameBuffer = new DoubleFrameBuffer(gl,this.game.width,this.game.height);

        this.blender = new Blender(this.gl);
        this.blender.enable();
        this.blender.setBlendMode(BLEND_MODE.NORMAL);
        // gl.depthFunc(gl.LEQUAL);
    }


    private prepareShapeUniformInfo(shape:Shape):void{
        const {width:rw,height:rh} = shape.size;
        const maxSize:number = Math.max(rw,rh);
        const sd:ShapeDrawer = this.shapeDrawer;
        let offsetX:number = 0,offsetY:number = 0;
        if (maxSize===rw) {
            sd.setUniform(sd.u_width,1);
            sd.setUniform(sd.u_height,rh/rw);
            offsetY = (maxSize - rh)/2;
            sd.setUniform(sd.u_rectOffsetLeft,0);
            sd.setUniform(sd.u_rectOffsetTop,offsetY/maxSize);
        } else {
            sd.setUniform(sd.u_height,1);
            sd.setUniform(sd.u_width,rw/rh);
            offsetX = (maxSize - rw)/2;
            sd.setUniform(sd.u_rectOffsetLeft,offsetX/maxSize);
            sd.setUniform(sd.u_rectOffsetTop,0);
        }
        const rect:Rect = Rect.fromPool();
        rect.setXYWH( -offsetX, -offsetY,maxSize,maxSize);
        const size:Size = Size.fromPool();
        size.setWH(this.game.width,this.game.height);
        sd.setUniform(sd.u_vertexMatrix,makePositionMatrix(rect,size,this.matrixStack).mat16);
        rect.release();
        size.release();
        sd.setUniform(sd.u_lineWidth,Math.min(shape.lineWidth/maxSize,1));
        sd.setUniform(sd.u_color,shape.color.asGL());
        sd.setUniform(sd.u_alpha,shape.alpha);

        if (shape.fillColor.type=='LinearGradient') {
            sd.setUniform(sd.u_fillLinearGradient,shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.LINEAR_GRADIENT);
        } else if (shape.fillColor.type=='Color') {
            sd.setUniform(sd.u_fillColor,shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.COLOR);
        }
    }

    drawImage(img:Image):void{
        if (DEBUG) {
            if (!img.getResourceLink()) {
                throw new DebugError(`image resource link is not set`);
            }
            if (!img.getResourceLink().getTarget()) {
                console.error(img);
                throw new DebugError(`no target associated with resource link`);
            }
        }

        this.beforeItemDraw(img.filters.length,img.blendMode);

        const texture:Texture = img.getResourceLink().getTarget<Texture>();
        const maxSize:number = Math.max(img.size.width,img.size.height);
        const sd:ShapeDrawer = this.shapeDrawer;
        this.prepareShapeUniformInfo(img);
        sd.setUniform(sd.u_borderRadius,Math.min(img.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.setUniform(sd.u_fillType,FILL_TYPE.TEXTURE);
        const {width: srcWidth,height: srcHeight} = texture.size;
        const {x:srcRectX,y:srcRectY} = img.getSrcRect().point;
        const {width:srcRectWidth,height:srcRectHeight} = img.getSrcRect().size;
        sd.setUniform(sd.u_texRect,
            [
                srcRectX/srcWidth,
                srcRectY/srcHeight,
                srcRectWidth/srcWidth,
                srcRectHeight/srcHeight
            ]
        );
        sd.setUniform(sd.u_texOffset,[img.offset.x/maxSize,img.offset.y/maxSize]);
        sd.attachTexture('texture',texture);
        this.shapeDrawer.draw();

        this.afterItemDraw(img.filters,img.blendMode);


    }

    drawModel(g3d:GameObject3d):void{ // todo
        this.modelDrawer.bindModel(g3d);
        this.modelDrawer.bind();

        this.matrixStack.scale(1,-1,1);
        const matrix1:Mat16Holder = this.matrixStack.getCurrentMatrix();

        const zToWMatrix:Mat16Holder = mat4.makeZToWMatrix(1);
        const projectionMatrix:Mat16Holder = mat4.ortho(0,this.game.width,0,this.game.height,-SCENE_DEPTH,SCENE_DEPTH);
        const matrix2:Mat16Holder = mat4.matrixMultiply(projectionMatrix, zToWMatrix);

        const uniforms:UniformsInfo = {
            u_modelMatrix: matrix1.mat16,
            u_projectionMatrix: matrix2.mat16,
            u_alpha: 1
        };
        //const texInfo:TextureInfo[] = [{texture:g3d.texture,name:'u_texture'}];

        this.gl.enable(this.gl.DEPTH_TEST);
        this.modelDrawer.draw();// todo uniforms, texture info
        this.modelDrawer.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
    };



    drawRectangle(rectangle:Rectangle):void{
        const {width:rw,height:rh} = rectangle.size;
        const maxSize:number = Math.max(rw,rh);
        const sd:ShapeDrawer = this.shapeDrawer;

        this.beforeItemDraw(rectangle.filters.length,rectangle.blendMode);

        this.prepareShapeUniformInfo(rectangle);
        sd.setUniform(sd.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.attachTexture('texture',this.nullTexture);
        sd.draw();

        this.afterItemDraw(rectangle.filters,rectangle.blendMode);
    }

    drawLine(x1:number,y1:number,x2:number,y2:number,color:Color):void{

        this.beforeItemDraw(0,BLEND_MODE.NORMAL);

        const dx:number = x2-x1,dy:number = y2-y1;
        const uniforms:UniformsInfo = {};
        const rect:Rect = Rect.fromPool();
        rect.setXYWH(x1,y1,dx,dy);
        const size:Size = Size.fromPool();
        size.setWH(this.game.width,this.game.height);
        uniforms.u_vertexMatrix = makePositionMatrix(rect,size,this.matrixStack).mat16;
        rect.release();
        size.release();
        uniforms.u_rgba = color.asGL();

        this.afterItemDraw([],BLEND_MODE.NORMAL);

    }


    drawEllipse(ellipse:Ellipse):void{
        let maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
        let maxR2:number = maxR*2;

        this.beforeItemDraw(ellipse.filters.length,ellipse.blendMode);

        this.prepareShapeUniformInfo(ellipse);
        let sd:ShapeDrawer = this.shapeDrawer;
        const rect:Rect = Rect.fromPool();
        rect.setXYWH(0,0,maxR2,maxR2);
        const size:Size = Size.fromPool();
        size.setWH(this.game.width,this.game.height);
        sd.setUniform(sd.u_vertexMatrix,makePositionMatrix(rect,size,this.matrixStack).mat16);
        rect.release();
        size.release();
        sd.setUniform(sd.u_lineWidth,Math.min(ellipse.lineWidth/maxR,1));
        if (maxR===ellipse.radiusX) {
            sd.setUniform(sd.u_rx,0.5);
            sd.setUniform(sd.u_ry,ellipse.radiusY/ellipse.radiusX*0.5);
        } else {
            sd.setUniform(sd.u_ry,0.5);
            sd.setUniform(sd.u_rx,ellipse.radiusX/ellipse.radiusY*0.5);
        }
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.ELLIPSE);
        sd.setUniform(sd.u_width,1);
        sd.setUniform(sd.u_height,1);
        sd.setUniform(sd.u_rectOffsetLeft,1);
        sd.setUniform(sd.u_rectOffsetTop,1);
        sd.attachTexture('texture',this.nullTexture);
        this.shapeDrawer.draw();

        this.afterItemDraw(ellipse.filters,ellipse.blendMode);

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

    rotateZ(angleInRadians:number):void {
        this.matrixStack.rotateZ(angleInRadians);
    }

    rotateY(angleInRadians:number):void {
        this.matrixStack.rotateY(angleInRadians);
    }

    translate(x:number,y:number):void{
        this.matrixStack.translate(x,y);
    }

    restore():void{
        this.matrixStack.restore();
    }

    lockRect(rect:Rect):void {
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.scissor(rect.point.x,rect.point.y,rect.size.width,rect.size.height);
    }

    unlockRect():void{
        this.gl.disable(this.gl.SCISSOR_TEST);
    }

    clear():void{
        this.gl.clearColor(1,1,1,1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //this.gl.clearDepth(1.);
    }

    clearColor(color:Color):void{
        const arr:number[] = color.asGL();
        this.gl.clearColor(arr[0],arr[1],arr[2],arr[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    beginFrameBuffer():void{
        this.save();
        this.finalFrameBuffer.bind();
    }

    flipFrameBuffer(filters:AbstractFilter[]):void{
        const texToDraw:Texture = this.doubleFrameBuffer.applyFilters(this.finalFrameBuffer.getTexture(),filters);
        this.finalFrameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width,this.fullScreenSize.height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture',texToDraw);
        this.simpleRectDrawer.draw();
        this.restore();
    };

    private beforeItemDraw(numOfFilters:number,blendMode:BLEND_MODE):void{
        if (numOfFilters>0 || blendMode!==BLEND_MODE.NORMAL) {
            this.preprocessFrameBuffer.bind();
            this.gl.clearColor(0,0,0,0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.blender.setBlendMode(BLEND_MODE.NORMAL);
        } else {
            this.finalFrameBuffer.bind();
        }
    }

    private afterItemDraw(filters:AbstractFilter[],blendMode:BLEND_MODE):void{
        if (filters.length>0 || blendMode!==BLEND_MODE.NORMAL) {

            this.blender.setBlendMode(BLEND_MODE.NORMAL);
            const filteredTexture:Texture = this.doubleFrameBuffer.applyFilters(this.preprocessFrameBuffer.getTexture(),filters);

            this.blender.setBlendMode(blendMode);

            this.finalFrameBuffer.bind();
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
            this.simpleRectDrawer.attachTexture('texture',filteredTexture);
            this.simpleRectDrawer.draw();

            this.blender.setBlendMode(BLEND_MODE.NORMAL);
        }
    }

    getError():number{
        if (!DEBUG) return 0;
        const err:number = this.gl.getError();
        if (err!==this.gl.NO_ERROR) {
            console.log(AbstractDrawer.currentInstance);
        }
        return err;
    }

    loadTextureInfo(url:string,link:ResourceLink,onLoad:()=>void):void{
        const possibleTargetInCache:Texture = this.renderableCache[link.getUrl()];
        if (possibleTargetInCache) {
            link.setTarget(possibleTargetInCache);
            onLoad();
            return;
        }
        const img:HTMLImageElement = new (window as any).Image() as HTMLImageElement;
        img.src = url;
        img.onload = ()=>{
            const texture:Texture = new Texture(this.gl);
            texture.setImage(img);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.finalFrameBuffer.getTexture().getGlTexture()); // to restore texture binding
            this.renderableCache[link.getUrl()] = texture;
            link.setTarget(texture);
            onLoad();
        };
        if (DEBUG) {
            img.onerror = ()=>{
                throw new DebugError(`Resource loading error: can not load resource with url "${url}"`);
            }
        }
    }

    getNativeContext():WebGLRenderingContext {
        return this.gl;
    }

    destroy():void{
        super.destroy();
        this.finalFrameBuffer.destroy();
        this.preprocessFrameBuffer.destroy();
        this.doubleFrameBuffer.destroy();
        this.nullTexture.destroy();
        this.shapeDrawer.destroy();
        this.simpleRectDrawer.destroy();
        //this.modelDrawer.destroy();
        Object.keys(this.renderableCache).forEach((key:string)=>{
            let t:Texture = this.renderableCache[key];
            t.destroy();
        });
    }

}
