import {DebugError} from "@engine/debug/debugError";
import {FILL_TYPE, SHAPE_TYPE, ShapeDrawer} from "./programs/impl/base/shape/shapeDrawer";
import {MatrixStack} from "./base/matrixStack";
import {Texture} from "./base/texture";
import {Rect} from "../../geometry/rect";
import {Game, SCALE_STRATEGY} from "../../core/game";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../common/color";
import {ISize, Size} from "../../geometry/size";
import {MeshDrawer} from "./programs/impl/base/mesh/meshDrawer";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {Shape} from "@engine/renderable/abstract/shape";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Mat4} from "@engine/geometry/mat4";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {Line} from "@engine/renderable/impl/geometry/line";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {DebugUtil} from "@engine/renderer/webGl/debug/debugUtil";
import {ClazzEx, IDestroyable, Optional} from "@engine/core/declarations";
import {TileMapDrawer} from "@engine/renderer/webGl/programs/impl/base/tileMap/tileMapDrawer";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {FLIP_TEXTURE_MATRIX, WebGlRendererHelper} from "@engine/renderer/webGl/webGlRendererHelper";
import {FrameBufferStack, IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {CubeMapTexture} from "@engine/renderer/webGl/base/cubeMapTexture";
import {SimpleColoredRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleColoredRectDrawer";
import {AbstractDrawer} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {Mat4Special} from "@engine/geometry/mat4Special";
import Mat16Holder = Mat4.Mat16Holder;
import glEnumToString = DebugUtil.glEnumToString;
import MAT16 = Mat4.MAT16;
import {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";


const getCtx = (el:HTMLCanvasElement):Optional<WebGLRenderingContext>=>{
    const contextAttrs:WebGLContextAttributes = {alpha:false,premultipliedAlpha:false};
    const possibles:string[] = ['webgl','experimental-webgl','webkit-3d','moz-webgl'];
    for (const p of possibles) {
        const ctx:WebGLRenderingContext = el.getContext(p,contextAttrs)  as WebGLRenderingContext;
        //if (DEBUG && ctx) console.log(`context using: ${p}`);
        if (ctx) {
            return ctx;
        }
    }
    if (DEBUG) throw new DebugError(`webGl is not accessible on this device`);
    return undefined;
};

const SCENE_DEPTH:number = 1000;


const zToWMatrix:Mat16Holder = Mat16Holder.create();
Mat4.makeZToWMatrix(zToWMatrix,1);

const makeModelViewProjectionMatrix = (rect:Rect,viewSize:Size,matrixStack:MatrixStack):Mat16Holder=>{
    // proj * modelView
    const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
    Mat4.ortho(projectionMatrix,0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);

    const scaleMatrix:Mat16Holder = Mat16Holder.fromPool();
    Mat4.makeScale(scaleMatrix,rect.width, rect.height, 1);

    const translationMatrix:Mat16Holder = Mat16Holder.fromPool();
    Mat4.makeTranslation(translationMatrix,rect.x, rect.y, 0);

    const matrix1:Mat16Holder = Mat16Holder.fromPool();
    Mat4Special.multiplyScaleByAny(matrix1,scaleMatrix,translationMatrix);

    const matrix2:Mat16Holder = Mat16Holder.fromPool();
    Mat4.matrixMultiply(matrix2,matrix1, matrixStack.getCurrentValue());

    const matrix3:Mat16Holder = Mat16Holder.fromPool();
    Mat4Special.multiplyAnyByProjection(matrix3,matrix2, projectionMatrix);

    const matrix4:Mat16Holder = Mat16Holder.fromPool();
    Mat4Special.multiplyAnyByZtoW(matrix4,matrix3, zToWMatrix);

    projectionMatrix.release();
    scaleMatrix.release();
    translationMatrix.release();
    matrix1.release();
    matrix2.release();

    matrix3.release();
    return matrix4;
};


class InstanceHolder<T extends IDestroyable> {
    private instance:Optional<T>;
    constructor(private clazz:ClazzEx<T,WebGLRenderingContext>){}

    public getInstance(gl:WebGLRenderingContext):T{
        if (this.instance===undefined) this.instance = new this.clazz(gl);
        return this.instance;
    }

    public destroy():void{
        if (this.instance!==undefined) this.instance.destroy();
    }

    public isInvoked():boolean{
        return this.instance!==undefined;
    }
}

export class WebGlRenderer extends AbstractCanvasRenderer {


    public readonly type:string = 'WebGlRenderer';

    protected rendererHelper:RendererHelper = new WebGlRendererHelper(this.game);

    private _gl:WebGLRenderingContext;
    private readonly _matrixStack:MatrixStack = new MatrixStack();
    private _shapeDrawerHolder:InstanceHolder<ShapeDrawer> = new InstanceHolder(ShapeDrawer);
    private _coloredRectDrawer:InstanceHolder<SimpleColoredRectDrawer> = new InstanceHolder(SimpleColoredRectDrawer);
    private _meshDrawerHolder:InstanceHolder<MeshDrawer> = new InstanceHolder(MeshDrawer);
    private _tileMapDrawerHolder:InstanceHolder<TileMapDrawer> = new InstanceHolder(TileMapDrawer);

    private _nullTexture:Texture;
    private _nullCubeMapTexture:CubeMapTexture;

    private _origFrameBufferStack:FrameBufferStack;
    private _currFrameBufferStack:FrameBufferStack;

    private _blender:Blender;


    private _lockRect:Optional<Rect>;
    private _pixelPerfectMode:boolean = false;

    constructor(game:Game){
        super(game);
        this.registerResize();
        this._init();

    }

    public setPixelPerfect(mode:boolean):void{
        super.setPixelPerfect(mode);
        const interpolation:INTERPOLATION_MODE = mode?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR;
        this._currFrameBufferStack.setInterpolationMode(interpolation);
        this._currFrameBufferStack.setPixelPerfect(mode);
        this._pixelPerfectMode = mode;
        this.onResize();
    }


    public drawImage(img:Image):void{

        const texture:Texture = img.getTexture() as Texture;
        texture.setInterpolationMode(img.isPixelPerfect()?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR);
        const maxSize:number = Math.max(img.size.width,img.size.height);

        const sd:ShapeDrawer = this._shapeDrawerHolder.getInstance(this._gl);
        this.prepareGeometryUniformInfo(img);

        sd.setUniform(sd.u_lineWidth,Math.min(img.lineWidth/maxSize,1));
        sd.setUniform(sd.u_color,img.color.asGL());

        const repeatFactor:Size = Size.fromPool();
        repeatFactor.setWH(
            img.size.width/img.getSrcRect().width,
            img.size.height/img.getSrcRect().height
        );
        sd.setUniform(sd.u_repeatFactor,repeatFactor.toArray());
        repeatFactor.release();

        sd.setUniform(sd.u_borderRadius,Math.min(img.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.setUniform(sd.u_fillType,FILL_TYPE.TEXTURE);
        const {width: textureWidth,height: textureHeight} = texture.size;
        const {x:srcRectX,y:srcRectY} = img.getSrcRect();
        const {width:destRectWidth,height:destRectHeight} = img.getSrcRect();

        const destArr:Float32Array = Rect.fromPool().setXYWH(
            srcRectX/textureWidth,
            srcRectY/textureHeight,
            destRectWidth/textureWidth,
            destRectHeight/textureHeight).release().toArray();

        sd.setUniform(sd.u_texRect, destArr);

        const offSetArr:Float32Array = Size.fromPool().setWH(img.offset.x/maxSize,img.offset.y/maxSize).release().toArray();
        sd.setUniform(sd.u_texOffset,offSetArr);
        sd.setUniform(sd.u_stretchMode,img.stretchMode);
        sd.attachTexture('texture',texture);
        sd.draw();

    }

    public drawMesh3d(mesh:Mesh3d):void {

        const md:MeshDrawer = this._meshDrawerHolder.getInstance(this._gl);

        md.bindMesh3d(mesh);
        md.bind();

        const modelMatrix:Mat16Holder = this._matrixStack.getCurrentValue();

        const orthoProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        const currViewSize:ISize = this._currFrameBufferStack.getCurrentTargetSize();
        Mat4.ortho(orthoProjectionMatrix,0,currViewSize.width,0,currViewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
        const zToWProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.matrixMultiply(zToWProjectionMatrix,orthoProjectionMatrix, zToWMatrix);

        const inverseTransposeModelMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.inverse(inverseTransposeModelMatrix,modelMatrix);
        Mat4.transpose(inverseTransposeModelMatrix,inverseTransposeModelMatrix);

        md.setModelMatrix(modelMatrix.mat16);
        md.setInverseTransposeModelMatrix(inverseTransposeModelMatrix.mat16);
        md.setProjectionMatrix(zToWProjectionMatrix.mat16);
        md.setAlfa(this.getAlphaBlend());

        const isTextureUsed:boolean = mesh.texture!==undefined;
        if (DEBUG && isTextureUsed && mesh.modelPrimitive.texCoordArr===undefined) throw new DebugError(`can not apply texture without texture coordinates`);
        md.setTextureUsed(isTextureUsed);
        if (isTextureUsed) md.setTextureMatrix(FLIP_TEXTURE_MATRIX.mat16);
        md.attachTexture('u_texture',isTextureUsed?mesh.texture as Texture:this._nullTexture);

        const isVertexColorUsed:boolean = mesh.modelPrimitive.vertexColorArr!==undefined;
        md.setVertexColorUsed(isVertexColorUsed);

        const isNormalsTextureUsed:boolean = mesh.normalsTexture!==undefined;
        md.setNormalsTextureUsed(isNormalsTextureUsed);
        md.attachTexture('u_normalsTexture',isNormalsTextureUsed?mesh.normalsTexture as Texture:this._nullTexture);

        const isCubeMapTextureUsed:boolean = mesh.cubeMapTexture!==undefined;
        if (DEBUG && !isCubeMapTextureUsed && mesh.reflectivity!==0) throw new DebugError(`can not apply reflectivity without cubeMapTexture`);
        md.setCubeMapTextureUsed(isCubeMapTextureUsed);
        md.setReflectivity(mesh.reflectivity);
        md.attachTexture('u_cubeMapTexture',isCubeMapTextureUsed?mesh.cubeMapTexture as CubeMapTexture:this._nullCubeMapTexture);

        if (DEBUG && mesh.isLightAccepted()) {
            if (!mesh.bufferInfo.normalBuffer) {
                throw new DebugError(`can not accept light: normals are not specified`);
            }
        }
        md.setLightUsed(mesh.isLightAccepted()||false);
        md.setColor(mesh.fillColor);
        md.setColorMix(mesh.colorMix);
        md.setSpecular(mesh.specular);

        //this.gl.enable(this.gl.CULL_FACE);
        if (mesh.depthTest) this._gl.enable(this._gl.DEPTH_TEST);
        else this._gl.disable(this._gl.DEPTH_TEST);
        this._blender.setBlendMode(mesh.blendMode);
        md.draw();
        //this.gl.disable(this.gl.CULL_FACE);
        zToWMatrix.release();
        orthoProjectionMatrix.release();
        zToWProjectionMatrix.release();
        inverseTransposeModelMatrix.release();
    }

    public drawMesh2d(mesh:Mesh2d):void {

        const md:MeshDrawer = this._meshDrawerHolder.getInstance(this._gl);

        md.bindMesh2d(mesh);
        md.bind();

        const modelMatrix:Mat16Holder = this._matrixStack.getCurrentValue();

        const orthoProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        const currViewSize:ISize = this._currFrameBufferStack.getCurrentTargetSize();
        Mat4.ortho(orthoProjectionMatrix,0,currViewSize.width,0,currViewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
        const zToWProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.matrixMultiply(zToWProjectionMatrix,orthoProjectionMatrix, zToWMatrix);

        const inverseTransposeModelMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.inverse(inverseTransposeModelMatrix,modelMatrix);
        Mat4.transpose(inverseTransposeModelMatrix,inverseTransposeModelMatrix);

        md.setModelMatrix(modelMatrix.mat16);
        md.setInverseTransposeModelMatrix(inverseTransposeModelMatrix.mat16);
        md.setProjectionMatrix(zToWProjectionMatrix.mat16);
        md.setAlfa(this.getAlphaBlend());
        md.setTextureUsed(false);
        md.attachTexture('u_texture',this._nullTexture);


        md.setNormalsTextureUsed(false);
        md.attachTexture('u_normalsTexture',this._nullTexture);

        md.setCubeMapTextureUsed(false);
        md.setReflectivity(0);
        md.attachTexture('u_cubeMapTexture',this._nullCubeMapTexture);

        md.setLightUsed(false);
        md.setColor(mesh.fillColor);
        md.setColorMix(0);
        md.setSpecular(0);

        if (mesh.depthTest) this._gl.enable(this._gl.DEPTH_TEST);
        else this._gl.disable(this._gl.DEPTH_TEST);
        this._blender.setBlendMode(mesh.blendMode);
        md.draw();
        zToWMatrix.release();
        orthoProjectionMatrix.release();
        zToWProjectionMatrix.release();
        inverseTransposeModelMatrix.release();
    }

    public drawRectangle(rectangle:Rectangle):void{

        if (rectangle.lineWidth===0 && rectangle.borderRadius===0 && rectangle.fillGradient===undefined) {
            this.drawSimpleColoredRectangle(rectangle); // optimise drawing of simple rectangle with very simple gl program
        } else {
            const rw:number = rectangle.size.width;
            const rh:number = rectangle.size.height;
            const maxSize:number = Math.max(rw,rh);
            const sd:ShapeDrawer = this._shapeDrawerHolder.getInstance(this._gl);
            this.prepareGeometryUniformInfo(rectangle);
            this.prepareShapeUniformInfo(rectangle);
            sd.setUniform(sd.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
            sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
            sd.attachTexture('texture',this._nullTexture);
            sd.draw();
        }

    }


    public drawLine(line:Line):void{
        const r:Rectangle = line.getRectangleRepresentation();
        this.drawRectangle(r);
    }


    public drawEllipse(ellipse:Ellipse):void{

        this.prepareGeometryUniformInfo(ellipse);
        this.prepareShapeUniformInfo(ellipse);

        const sd:ShapeDrawer = this._shapeDrawerHolder.getInstance(this._gl);
        const maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
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
        sd.setUniform(sd.u_arcAngleFrom,ellipse.arcAngleFrom % (2*Math.PI));
        sd.setUniform(sd.u_arcAngleTo,ellipse.arcAngleTo % (2*Math.PI));
        sd.setUniform(sd.u_anticlockwise,ellipse.anticlockwise);
        sd.attachTexture('texture',this._nullTexture);
        sd.draw();

    }

    public transformSave():void {
        this._matrixStack.save();
    }

    public transformScale(x:number, y:number, z: number = 1):void {
        if (x===1 && y===1 && z===1) return;
        this._matrixStack.scale(x,y,z);
    }

    public transformReset():void{
        this._matrixStack.resetTransform();
    }

    public transformRotateX(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this._matrixStack.rotateX(angleInRadians);
    }

    public transformRotateY(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this._matrixStack.rotateY(angleInRadians);
    }

    public transformRotateZ(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this._matrixStack.rotateZ(angleInRadians);
    }

    public transformTranslate(x:number, y:number, z:number=0):void{
        if (x===0 && y===0 && z===0) return;
        this._matrixStack.translate(x,y,z);
    }

    public transformRotationReset():void{
        this._matrixStack.rotationReset();
    }

    public transformSkewX(angle:number):void{
        if (angle===0) return;
        this._matrixStack.skewX(angle);
    }

    public transformSkewY(angle:number):void{
        if (angle===0) return;
        this._matrixStack.skewY(angle);
    }

    public transformRestore():void{
        this._matrixStack.restore();
    }

    public transformSet(val:Readonly<MAT16>): void {
        this._matrixStack.setMatrix(val);
    }

    public transformGet(): Readonly<MAT16> {
        return this._matrixStack.getCurrentValue().mat16;
    }

    public setLockRect(rect:Rect):void {
        this._lockRect = rect;
    }

    public unsetLockRect():void{
       this._lockRect = undefined;
    }

    public beforeItemStackDraw(filters:AbstractGlFilter[],forceDrawChildrenOnNewSurface:boolean):IStateStackPointer {
        return this._currFrameBufferStack.pushState(filters,forceDrawChildrenOnNewSurface);
    }

    public afterItemStackDraw(stackPointer:IStateStackPointer):void {
        this._gl.disable(this._gl.DEPTH_TEST);
        this._currFrameBufferStack.reduceState(stackPointer);
    }


    public beforeFrameDraw(filters:AbstractGlFilter[]):IStateStackPointer{
        const ptr:IStateStackPointer = this._currFrameBufferStack.pushState(filters,false);
        if (this.clearBeforeRender) {
            this._currFrameBufferStack.clear(this.clearColor,this.getAlphaBlend());
        }
        return ptr;
    }

    public afterFrameDraw(stackPointer:IStateStackPointer):void{
        this._currFrameBufferStack.reduceState(stackPointer);
        if (this._currFrameBufferStack===this._origFrameBufferStack) {
            if (this._lockRect!==undefined) {
                const rect = this._lockRect;
                this._gl.enable(this._gl.SCISSOR_TEST);
                this._gl.scissor(~~rect.x, ~~(this.game.size.height - rect.height - rect.y), ~~rect.width,~~rect.height);
            }
            this._currFrameBufferStack.renderToScreen();
            this._gl.disable(this._gl.SCISSOR_TEST);
        }
    }

    public getError():Optional<{code:number,desc:string}>{
        if (!DEBUG) return undefined;
        const err:number = this._gl.getError();
        if (err!==this._gl.NO_ERROR) {
            return {code:err,desc:glEnumToString(this._gl,err)};
        }
        return undefined;
    }


    public createTexture(bitmap:ImageBitmap|HTMLImageElement):ITexture{
        const texture:Texture = new Texture(this._gl);
        texture.setImage(bitmap);
        return texture;
    }

    public createCubeTexture(
        imgLeft:ImageBitmap|HTMLImageElement,
        imgRight:ImageBitmap|HTMLImageElement,
        imgTop:ImageBitmap|HTMLImageElement,
        imgBottom:ImageBitmap|HTMLImageElement,
        imgFront:ImageBitmap|HTMLImageElement,
        imgBack:ImageBitmap|HTMLImageElement
    ): ICubeMapTexture {

        const cubeTexture:CubeMapTexture = new CubeMapTexture(this._gl);
        cubeTexture.setImages(imgLeft,imgRight,imgTop,imgBottom,imgFront,imgBack);
        return cubeTexture;
    }


    public getNativeContext():WebGLRenderingContext {
        return this._gl;
    }

    public setRenderTarget(fbs:FrameBufferStack):void{

        if (DEBUG && fbs===undefined) throw new DebugError('undefined parameter: setRenderTarget(undefined)');

        if (this._currFrameBufferStack!==fbs) {
            AbstractDrawer.unbindLastInstance();
        }
        this._currFrameBufferStack = fbs;
    }

    public getRenderTarget():FrameBufferStack {
        return this._currFrameBufferStack;
    }

    public destroy():void{
        super.destroy();
        this._origFrameBufferStack.destroy();
        this._nullTexture.destroy();
        this._nullCubeMapTexture.destroy();
        this._shapeDrawerHolder.destroy();
        this._meshDrawerHolder.destroy();
        this._tileMapDrawerHolder.destroy();
        Texture.destroyAll();
    }

    protected onResize(): void {
        super.onResize();
        if (this._pixelPerfectMode && (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH || this.game.scaleStrategy===SCALE_STRATEGY.FIT)) {
            this.container.width = this.viewPortSize.width;
            this.container.height = this.viewPortSize.height;
        } else {
            this.container.width = this.game.size.width;
            this.container.height = this.game.size.height;
        }
    }

    private _init():void{
        const gl:WebGLRenderingContext = getCtx(this.container as HTMLCanvasElement)!;
        if (DEBUG && gl===undefined) throw new DebugError(`WebGLRenderingContext is not supported by this device`);
        this._gl = gl;

        this._nullTexture = new Texture(gl);
        this._nullCubeMapTexture = new CubeMapTexture(gl);
        this._nullCubeMapTexture.setAsZero();
        this._blender = Blender.getSingleton(gl);
        this._blender.enable();
        this._blender.setBlendMode(BLEND_MODE.NORMAL);

        this._origFrameBufferStack = new FrameBufferStack(this.game,this.getNativeContext(),this.game.size);
        this._currFrameBufferStack = this._origFrameBufferStack;

        // gl.depthFunc(gl.LEQUAL);
        //gl.enable(gl.CULL_FACE);
        //gl.enable(gl.DEPTH_TEST);
    }

    // optimised version of rectangle drawing
    private drawSimpleColoredRectangle(rectangle:Rectangle):void{

        const scd:SimpleColoredRectDrawer = this._coloredRectDrawer.getInstance(this._gl);

        if (rectangle.worldTransformDirty) {
            const rect:Rect = Rect.fromPool();
            rect.setXYWH( 0,0,rectangle.size.width,rectangle.size.height);
            const size:Size = Size.fromPool();
            size.set(this._currFrameBufferStack.getCurrentTargetSize());
            const mvpHolder:Mat16Holder = makeModelViewProjectionMatrix(rect,size,this._matrixStack);
            scd.setUniform(scd.u_vertexMatrix,mvpHolder.mat16);
            rectangle.modelViewProjectionMatrix.fromMat16(mvpHolder.mat16);
            mvpHolder.release();
            rect.release();
            size.release();
        } else {
            scd.setUniform(scd.u_vertexMatrix,rectangle.modelViewProjectionMatrix.mat16);
        }


        scd.setUniform(scd.u_alpha,this.getAlphaBlend());
        scd.setUniform(scd.u_color,((rectangle.fillColor) as Color).asGL());
        scd.draw();
    }

    private prepareGeometryUniformInfo(model:RenderableModel):void{

        if (DEBUG) {
            if (!model.size.width || !model.size.height) {
                console.error(model);
                throw new DebugError(`Can not render model with zero size`);
            }
        }

        const {width:rw,height:rh} = model.size;
        const maxSize:number = Math.max(rw,rh);
        const sd:ShapeDrawer = this._shapeDrawerHolder.getInstance(this._gl);
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


        if (model.worldTransformDirty) {
            const rect:Rect = Rect.fromPool();
            rect.setXYWH( -offsetX, -offsetY,maxSize,maxSize);
            const size:Size = Size.fromPool();
            size.set(this._currFrameBufferStack.getCurrentTargetSize());
            const mvpHolder:Mat16Holder = makeModelViewProjectionMatrix(rect,size,this._matrixStack);
            model.modelViewProjectionMatrix.fromMat16(mvpHolder.mat16);
            sd.setUniform(sd.u_vertexMatrix,mvpHolder.mat16);
            mvpHolder.release();
            rect.release();
            size.release();
        } else {
            sd.setUniform(sd.u_vertexMatrix,model.modelViewProjectionMatrix.mat16);
        }




        sd.setUniform(sd.u_alpha,this.getAlphaBlend());
        sd.setUniform(sd.u_stretchMode,STRETCH_MODE.STRETCH);
        this._blender.setBlendMode(model.blendMode);
        if (model.depthTest) this._gl.enable(this._gl.DEPTH_TEST);
        else this._gl.disable(this._gl.DEPTH_TEST);

    }

    private prepareShapeUniformInfo(model:Shape):void{

        if (DEBUG) {
            if (!model.size.width || !model.size.height) {
                console.error(model);
                throw new DebugError(`Can not render model with zero size`);
            }
        }

        const maxSize:number = Math.max(model.size.width,model.size.height);
        const sd:ShapeDrawer = this._shapeDrawerHolder.getInstance(this._gl);
        sd.setUniform(sd.u_lineWidth,Math.min(model.lineWidth/maxSize,1));
        sd.setUniform(sd.u_color,model.color.asGL());

        if (model.fillGradient!==undefined) {
            model.fillGradient.setUniforms(sd);
            if (model.fillGradient.type==='LinearGradient') {
                sd.setUniform(sd.u_fillType,FILL_TYPE.LINEAR_GRADIENT);
            } else {
                model.fillGradient.setUniforms(sd);
                sd.setUniform(sd.u_fillType,FILL_TYPE.RADIAL_GRADIENT);
            }
        } else {
            sd.setUniform(sd.u_fillColor,model.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.COLOR);
        }
    }

}
