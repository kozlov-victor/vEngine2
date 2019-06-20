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
import {IUniformsInfo} from "./programs/interface/IUniformsInfo";
import {Size} from "../../geometry/size";
import {ModelDrawer} from "./programs/impl/base/modelDrawer";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {Ellipse} from "@engine/model/impl/ui/drawable/ellipse";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Image, STRETCH_MODE} from "@engine/model/impl/ui/drawable/image";
import {Shape} from "@engine/model/impl/ui/generic/shape";
import {ResourceLink} from "@engine/resources/resourceLink";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {mat4} from "@engine/geometry/mat4";
import {FILL_TYPE, SHAPE_TYPE} from "@engine/renderer/webGl/programs/impl/base/shapeDrawer.shader";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRectDrawer";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/doubleFrameBuffer";
import {BLEND_MODE} from "@engine/model/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import IDENTITY = mat4.IDENTITY;
import Mat16Holder = mat4.Mat16Holder;
import {Line} from "@engine/model/impl/ui/drawable/line";
import {ITexture} from "@engine/renderer/texture";


const getCtx = (el:HTMLCanvasElement):WebGLRenderingContext=>{
    const contextAttrs:WebGLContextAttributes = {alpha:false,premultipliedAlpha:false};
    const possibles:string[] = ['webgl2','webgl','experimental-webgl','webkit-3d','moz-webgl'];
    for (const p of possibles) {
        const ctx:WebGLRenderingContext = el.getContext(p,contextAttrs)  as WebGLRenderingContext;
        //if (DEBUG && ctx) console.log(`context using: ${p}`);
        if (ctx) return ctx;
    }
    if (DEBUG) throw new DebugError(`webGl is not accessible on this device`);
    return null;
};

const SCENE_DEPTH:number = 1000;
const FLIP_TEXTURE_MATRIX:Mat16Holder = new MatrixStack().translate(0,1).scale(1,-1).release().getCurrentMatrix().clone();
let FLIP_POSITION_MATRIX:Mat16Holder;

const zToWMatrix:Mat16Holder = Mat16Holder.create();
mat4.makeZToWMatrix(zToWMatrix,1);

const BLACK:Color = Color.RGB(0,0,0,0);

const makePositionMatrix = (rect:Rect,viewSize:Size,matrixStack:MatrixStack):Mat16Holder=>{
    // proj * modelView
    const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.ortho(projectionMatrix,0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);

    const scaleMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.makeScale(scaleMatrix,rect.size.width, rect.size.height, 1);

    const translationMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.makeTranslation(translationMatrix,rect.point.x, rect.point.y, 0);

    const matrix1:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(matrix1,scaleMatrix, translationMatrix);

    const matrix2:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(matrix2,matrix1, matrixStack.getCurrentMatrix());

    const matrix3:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(matrix3,matrix2, projectionMatrix);

    const matrix4:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(matrix4,matrix3, zToWMatrix);

    projectionMatrix.release();
    scaleMatrix.release();
    translationMatrix.release();
    matrix1.release();
    matrix2.release();
    matrix3.release();

    return matrix4;
};



export class WebGlRenderer extends AbstractCanvasRenderer {


    private gl:WebGLRenderingContext;
    private readonly matrixStack:MatrixStack = new MatrixStack();
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
        this.registerResize();
        this._init();
        const m16hResult:Mat16Holder = Mat16Holder.fromPool();
        const m16Scale:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeScale(m16Scale,this.game.width, this.game.height, 1);
        const m16Ortho:Mat16Holder = Mat16Holder.fromPool();
        mat4.ortho(m16Ortho,0,this.game.width,0,this.game.height,-1,1);

        mat4.matrixMultiply(m16hResult, m16Scale, m16Ortho);
        FLIP_POSITION_MATRIX = m16hResult.clone();

        m16hResult.release();
        m16Scale.release();
        m16Ortho.release();
    }

    public drawImage(img:Image):void{
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

        const texture:Texture = (img.getResourceLink() as ResourceLink<Texture>).getTarget();
        const maxSize:number = Math.max(img.size.width,img.size.height);
        const sd:ShapeDrawer = this.shapeDrawer;
        this.prepareShapeUniformInfo(img);
        sd.setUniform(sd.u_borderRadius,Math.min(img.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.setUniform(sd.u_fillType,FILL_TYPE.TEXTURE);
        const {width: srcWidth,height: srcHeight} = texture.size;
        const {x:srcRectX,y:srcRectY} = img.getSrcRect().point;
        const {width:srcRectWidth,height:srcRectHeight} = img.getSrcRect().size;

        const srcArr:[number,number,number,number] = Rect.fromPool().setXYWH(
            srcRectX/srcWidth,
            srcRectY/srcHeight,
            srcRectWidth/srcWidth,
            srcRectHeight/srcHeight).release().toArray();
        sd.setUniform(sd.u_texRect, srcArr);

        const offSetArr:[number,number] = Size.fromPool().setWH(img.offset.x/maxSize,img.offset.y/maxSize).release().toArray();
        sd.setUniform(sd.u_texOffset,offSetArr);
        sd.setUniform(sd.u_stretchMode,img.stretchMode);
        sd.attachTexture('texture',texture);
        this.shapeDrawer.draw();

        this.afterItemDraw(img.filters as AbstractFilter[],img.blendMode);


    }

    public drawModel(g3d:GameObject3d):void {
        if (!this.modelDrawer) this.modelDrawer = new ModelDrawer(this.gl);
        this.modelDrawer.bindModel(g3d);
        this.modelDrawer.bind();

        this.matrixStack.scale(1,-1,1);
        const matrix1:Mat16Holder = this.matrixStack.getCurrentMatrix();

        const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        mat4.ortho(projectionMatrix,0,this.game.width,0,this.game.height,-SCENE_DEPTH,SCENE_DEPTH);
        const matrix2:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(matrix2,projectionMatrix, zToWMatrix);

        this.modelDrawer.setModelMatrix(matrix1.mat16);
        this.modelDrawer.setProjectionMatrix(matrix2.mat16);
        this.modelDrawer.setAlfa(g3d.alpha);
        const isTextureUsed:boolean = !!g3d.texture;
        this.modelDrawer.setTextureUsed(isTextureUsed);
        this.modelDrawer.setColor(g3d.color);
        this.modelDrawer.attachTexture('u_texture',g3d.texture?g3d.texture:this.nullTexture);


        this.gl.enable(this.gl.DEPTH_TEST);
        //this.gl.enable(this.gl.CULL_FACE);
        this.modelDrawer.draw();

        this.modelDrawer.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
        //this.gl.disable(this.gl.CULL_FACE);
        zToWMatrix.release();
        projectionMatrix.release();
        matrix2.release();
    }


    public drawRectangle(rectangle:Rectangle):void{
        const {width:rw,height:rh} = rectangle.size;
        const maxSize:number = Math.max(rw,rh);
        const sd:ShapeDrawer = this.shapeDrawer;

        this.beforeItemDraw(rectangle.filters.length,rectangle.blendMode);

        this.prepareShapeUniformInfo(rectangle);
        sd.setUniform(sd.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.attachTexture('texture',this.nullTexture);
        sd.draw();

        this.afterItemDraw(rectangle.filters as AbstractFilter[],rectangle.blendMode);
    }


    public drawLine(line:Line):void{
        const r:Rectangle = line.getRectangleRepresentation();
        this.drawRectangle(r);
    }


    public drawEllipse(ellipse:Ellipse):void{
        const maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
        const maxR2:number = maxR*2;

        this.beforeItemDraw(ellipse.filters.length,ellipse.blendMode);

        this.prepareShapeUniformInfo(ellipse);
        const sd:ShapeDrawer = this.shapeDrawer;
        const rect:Rect = Rect.fromPool();
        rect.setXYWH(0,0,maxR2,maxR2);
        const size:Size = Size.fromPool();
        size.setWH(this.game.width,this.game.height);
        const pos16h:Mat16Holder = makePositionMatrix(rect,size,this.matrixStack);
        sd.setUniform(sd.u_vertexMatrix,pos16h.mat16);
        pos16h.release();
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
        sd.setUniform(sd.u_arcAngleFrom,ellipse.arcAngleFrom);
        sd.setUniform(sd.u_arcAngleTo,ellipse.arcAngleTo);
        sd.attachTexture('texture',this.nullTexture);
        this.shapeDrawer.draw();

        this.afterItemDraw(ellipse.filters as AbstractFilter[],ellipse.blendMode);

    }

    public setAlpha(a:number):void{
        if (DEBUG) throw new DebugError('not implemented');
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

    public lockRect(rect:Rect):void {
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.scissor(rect.point.x,rect.point.y,rect.size.width,rect.size.height);
    }

    public unlockRect():void{
        this.gl.disable(this.gl.SCISSOR_TEST);
    }

    public beforeFrameDraw(color:Color):void{
        this.save();
        this.finalFrameBuffer.bind();
        this.finalFrameBuffer.clear(color);
    }

    public afterFrameDraw(filters:AbstractFilter[]):void{
        const texToDraw:Texture = this.doubleFrameBuffer.applyFilters(this.finalFrameBuffer.getTexture(),filters);
        this.finalFrameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width,this.fullScreenSize.height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture',texToDraw);
        this.simpleRectDrawer.draw();
        this.restore();
    }
    public getError():number{
        if (!DEBUG) return 0;
        const err:number = this.gl.getError();
        if (err!==this.gl.NO_ERROR) {
            console.log(AbstractDrawer.currentInstance);
            return err;
        }
        return this.gl.NO_ERROR;
    }

    public putToCache(l:ResourceLink<ITexture>,t:Texture) {
        const url:string = l.getUrl();
        if (DEBUG && !url) throw new DebugError(`no url is associated with resource link`);
        this.renderableCache[url] = t;
    }

    public loadTextureInfo(url:string,link:ResourceLink<ITexture>,onLoad:()=>void):void{
        const possibleTargetInCache:ITexture = this.renderableCache[link.getUrl()];
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
            this.putToCache(link,texture);
            link.setTarget(texture);
            onLoad();
        };
        if (DEBUG) {
            img.onerror = ()=>{
                throw new DebugError(`Resource loading error: can not load resource with url "${url}"`);
            };
        }
    }

    public getNativeContext():WebGLRenderingContext {
        return this.gl;
    }

    public destroy():void{
        super.destroy();
        this.finalFrameBuffer.destroy();
        this.preprocessFrameBuffer.destroy();
        this.doubleFrameBuffer.destroy();
        this.nullTexture.destroy();
        this.shapeDrawer.destroy();
        this.simpleRectDrawer.destroy();
        //this.modelDrawer.destroy();
        Object.keys(this.renderableCache).forEach((key:string)=>{
            const t:Texture = this.renderableCache[key] as Texture;
            t.destroy();
        });
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

        this.preprocessFrameBuffer = new FrameBuffer(gl,this.game.width,this.game.height);
        this.finalFrameBuffer = new FrameBuffer(gl,this.game.width,this.game.height);
        this.doubleFrameBuffer = new DoubleFrameBuffer(gl,this.game.width,this.game.height);

        this.blender = new Blender(this.gl);
        this.blender.enable();
        this.blender.setBlendMode(BLEND_MODE.NORMAL);
        // gl.depthFunc(gl.LEQUAL);
        //gl.enable(gl.CULL_FACE);
        //gl.enable(gl.DEPTH_TEST);
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
        const pos16h:Mat16Holder = makePositionMatrix(rect,size,this.matrixStack);
        sd.setUniform(sd.u_vertexMatrix,pos16h.mat16);

        pos16h.release();
        rect.release();
        size.release();
        sd.setUniform(sd.u_lineWidth,Math.min(shape.lineWidth/maxSize,1));
        sd.setUniform(sd.u_color,shape.color.asGL());
        sd.setUniform(sd.u_alpha,shape.alpha);

        const repeatFactor:Size = Size.fromPool();
        repeatFactor.setWH(
            shape.size.width/shape.getSrcRect().size.width,
            shape.size.height/shape.getSrcRect().size.height
        );
        sd.setUniform(sd.u_repeatFactor,repeatFactor.toArray());
        repeatFactor.release();
        sd.setUniform(sd.u_stretchMode,STRETCH_MODE.STRETCH);

        if (shape.fillColor.type==='LinearGradient') {
            sd.setUniform(sd.u_fillLinearGradient,shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.LINEAR_GRADIENT);
        } else if (shape.fillColor.type==='Color') {
            sd.setUniform(sd.u_fillColor,shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.COLOR);
        }
    }

    private beforeItemDraw(numOfFilters:number,blendMode:BLEND_MODE):void{
        if (numOfFilters>0 || blendMode!==BLEND_MODE.NORMAL) {
            this.preprocessFrameBuffer.bind();
            this.preprocessFrameBuffer.clear(BLACK);
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

}
