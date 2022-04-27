import {DebugError} from "@engine/debug/debugError";
import {FILL_TYPE, SHAPE_TYPE, ShapePainter} from "@engine/renderer/webGl/programs/impl/base/shape/shapePainter";
import {MatrixStack} from "@engine/renderer/webGl/base/matrixStack";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {IRectJSON, Rect} from "@engine/geometry/rect";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {AbstractCanvasRenderer} from "@engine/renderer/abstract/abstractCanvasRenderer";
import {Color} from "@engine/renderer/common/color";
import {ISize, Size} from "@engine/geometry/size";
import {MeshPainter} from "@engine/renderer/webGl/programs/impl/base/mesh/meshPainter";
import type {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import type {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import type {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import type {Image} from "@engine/renderable/impl/general/image/image";
import {Shape} from "@engine/renderable/abstract/shape";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Mat4} from "@engine/misc/math/mat4";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import type {Line} from "@engine/renderable/impl/geometry/line";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {DebugUtil} from "@engine/renderer/webGl/debug/debugUtil";
import {ClazzEx, IDestroyable, Optional} from "@engine/core/declarations";
import {RendererHelper} from "@engine/renderer/abstract/rendererHelper";
import {FLIP_TEXTURE_MATRIX, WebGlRendererHelper} from "@engine/renderer/webGl/renderer/webGlRendererHelper";
import {FrameBufferStack, IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {CubeMapTexture} from "@engine/renderer/webGl/base/cubeMapTexture";
import {SimpleColoredRectPainter} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleColoredRectPainter";
import {Mat4Special} from "@engine/misc/math/mat4Special";
import type {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {BufferInfo} from "@engine/renderer/webGl/base/bufferInfo";
import {GlCachedAccessor} from "@engine/renderer/webGl/blender/glCachedAccessor";
import {LruMap} from "@engine/misc/collection/lruMap";
import Mat16Holder = Mat4.Mat16Holder;
import glEnumToString = DebugUtil.glEnumToString;
import IDENTITY = Mat4.IDENTITY;


const getCtx = (el:HTMLCanvasElement):Optional<WebGLRenderingContext>=>{
    const contextAttrs:WebGLContextAttributes = {alpha:false,premultipliedAlpha:false};
    const possibles:string[] = ['webgl','experimental-webgl','webkit-3d','moz-webgl'];
    for (const p of possibles) {
        const ctx = el.getContext(p,contextAttrs) as WebGLRenderingContext;
        if (ctx) {
            //if (DEBUG) console.log(`using context: ${p}`);
            //ContextDebugWrap.wrap(ctx); // very slow, use for debug only
            return ctx;
        }
    }
    if (DEBUG) throw new DebugError(`webGl is not accessible on this device`);
    return undefined;
};

const SCENE_DEPTH:number = 1000;



const zToWMatrix:Mat16Holder = Mat16Holder.create();
Mat4.makeZToWMatrix(zToWMatrix,1);

const lruCache = new LruMap<string, Mat4.Mat16Holder>();

const makeModelViewProjectionMatrix = (rect:Rect,viewSize:Size,matrixStack:MatrixStack):Mat16Holder=>{
    // proj * modelView

    let projectionMatrix:Mat16Holder;
    const viewSizeStr = `${viewSize.width}_${viewSize.height}`;
    if (lruCache.has(viewSizeStr)) projectionMatrix = lruCache.get(viewSizeStr)!;
    else {
        const m = Mat16Holder.create();
        Mat4.ortho(m,0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
        lruCache.put(viewSizeStr,m);
        projectionMatrix = m;
    }

    const scaleMatrix:Mat16Holder = Mat16Holder.fromPool();
    Mat4.makeScale(scaleMatrix,rect.width, rect.height, 1);

    const translationMatrix:Mat16Holder = Mat16Holder.fromPool();
    Mat4.makeTranslation(translationMatrix,rect.x, rect.y, 0);

    const matrixResult:Mat16Holder = Mat16Holder.fromPool();
    Mat4Special.multiplyScaleByAny(matrixResult,scaleMatrix,translationMatrix);
    Mat4.matrixMultiply(matrixResult,matrixResult, matrixStack.getCurrentValue());
    Mat4Special.multiplyAnyByProjection(matrixResult,matrixResult, projectionMatrix);
    Mat4Special.multiplyAnyByZtoW(matrixResult,matrixResult, zToWMatrix);

    projectionMatrix.release();
    scaleMatrix.release();
    translationMatrix.release();
    return matrixResult;
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
    private readonly _matrixStack = new MatrixStack();

    private _shapePainterHolder = new InstanceHolder(ShapePainter);
    private _coloredRectPainterHolder = new InstanceHolder(SimpleColoredRectPainter);
    private _meshPainterHolder = new InstanceHolder(MeshPainter);

    private _nullTexture:Texture;
    private _nullCubeMapTexture:CubeMapTexture;

    private _origFrameBufferStack:FrameBufferStack;
    private _currFrameBufferStack:FrameBufferStack;

    private _blender:Blender;


    private _lockRect:Optional<IRectJSON>;
    private _glCachedAccessor:GlCachedAccessor;
    private _pixelPerfectMode:boolean = false;

    constructor(game:Game){
        super(game);
        this.registerResize();
        this._init();

    }

    public override setPixelPerfect(mode:boolean):void{
        super.setPixelPerfect(mode);
        const interpolation:INTERPOLATION_MODE = mode?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR;
        this._currFrameBufferStack.setInterpolationMode(interpolation);
        this._currFrameBufferStack.setPixelPerfect(mode);
        this._pixelPerfectMode = mode;
        this.onResize();
    }

    public initBufferInfo(mesh2d:Mesh2d):BufferInfo {
        return this._meshPainterHolder.getInstance(this._gl).initBufferInfo(mesh2d);
    }


    public drawImage(img:Image):void{

        const texture:Texture = img.getTexture() as Texture;
        texture.setInterpolationMode(img.isPixelPerfect()?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR);
        const maxSize:number = Math.max(img.size.width,img.size.height);

        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        this.prepareGeometryUniformInfo(img);

        sp.setUniform(sp.u_lineWidth,Math.min(img.lineWidth/maxSize,1));
        sp.setUniform(sp.u_color,img.color.asGL());

        const repeatFactor:Size = Size.fromPool();
        repeatFactor.setWH(
            img.size.width/img.getSrcRect().width,
            img.size.height/img.getSrcRect().height
        );
        sp.setUniform(sp.u_repeatFactor,repeatFactor.toArray());
        repeatFactor.release();

        sp.setUniform(sp.u_borderRadius,Math.min(img.borderRadius/maxSize,1));
        sp.setUniform(sp.u_shapeType,SHAPE_TYPE.RECT);
        sp.setUniform(sp.u_fillType,FILL_TYPE.TEXTURE);
        const {width: textureWidth,height: textureHeight} = texture.size;
        const {x:srcRectX,y:srcRectY} = img.getSrcRect();
        const {width:destRectWidth,height:destRectHeight} = img.getSrcRect();

        const destArr:Float32Array = Rect.fromPool().setXYWH(
            srcRectX/textureWidth,
            srcRectY/textureHeight,
            destRectWidth/textureWidth,
            destRectHeight/textureHeight).release().toArray();

        sp.setUniform(sp.u_texRect, destArr);

        const offSetArr:Float32Array = Size.fromPool().setWH(img.offset.x/maxSize,img.offset.y/maxSize).release().toArray();
        sp.setUniform(sp.u_texOffset,offSetArr);
        sp.setUniform(sp.u_stretchMode,img.stretchMode);
        sp.attachTexture('texture',texture);
        sp.draw();

    }

    public drawMesh3d(mesh:Mesh3d):void {

        const mp:MeshPainter = this._meshPainterHolder.getInstance(this._gl);

        mp.bindMesh3d(mesh);
        mp.bind();

        const modelMatrix:Mat16Holder = this._matrixStack.getCurrentValue();

        const orthoProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        const currViewSize:ISize = this._currFrameBufferStack.getCurrentTargetSize();
        Mat4.ortho(orthoProjectionMatrix,0,currViewSize.width,0,currViewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
        const zToWProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.matrixMultiply(zToWProjectionMatrix,orthoProjectionMatrix, zToWMatrix);

        const inverseTransposeModelMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.inverse(inverseTransposeModelMatrix,modelMatrix);
        Mat4.transpose(inverseTransposeModelMatrix,inverseTransposeModelMatrix);

        mp.setModelMatrix(modelMatrix.mat16);
        mp.setInverseTransposeModelMatrix(inverseTransposeModelMatrix.mat16);
        mp.setProjectionMatrix(zToWProjectionMatrix.mat16);
        mp.setAlpha(mesh.getChildrenCount()===0?mesh.alpha:1);

        const isTextureUsed:boolean = mesh.texture!==undefined;
        if (DEBUG && isTextureUsed && mesh._modelPrimitive.texCoordArr===undefined) throw new DebugError(`can not apply texture without texture coordinates`);
        mp.setTextureUsed(isTextureUsed);
        if (isTextureUsed) mp.setTextureMatrix(FLIP_TEXTURE_MATRIX.mat16);
        mp.attachTexture('u_texture',isTextureUsed?mesh.texture as Texture:this._nullTexture);

        const isVertexColorUsed:boolean = mesh._modelPrimitive.vertexColorArr!==undefined;
        mp.setVertexColorUsed(isVertexColorUsed);

        const isNormalsTextureUsed:boolean = mesh.normalsTexture!==undefined;
        mp.setNormalsTextureUsed(isNormalsTextureUsed);
        mp.attachTexture('u_normalsTexture',isNormalsTextureUsed?mesh.normalsTexture as Texture:this._nullTexture);

        const isSpecularTextureUsed:boolean = mesh.specularTexture!==undefined;
        mp.setSpecularTextureUsed(isSpecularTextureUsed);
        mp.attachTexture('u_specularTexture',isSpecularTextureUsed?mesh.specularTexture as Texture:this._nullTexture);

        const isCubeMapTextureUsed:boolean = mesh.cubeMapTexture!==undefined;
        if (DEBUG && !isCubeMapTextureUsed && mesh.material.reflectivity!==0) throw new DebugError(`can not apply reflectivity without cubeMapTexture`);
        mp.setCubeMapTextureUsed(isCubeMapTextureUsed);
        mp.setReflectivity(mesh.material.reflectivity);
        mp.attachTexture('u_cubeMapTexture',isCubeMapTextureUsed?mesh.cubeMapTexture as CubeMapTexture:this._nullCubeMapTexture);

        if (DEBUG && mesh.isLightAccepted()) {
            if (!mesh.getBufferInfo().normalBuffer) {
                console.error(mesh);
                throw new DebugError(`can not accept light: normals are not specified`);
            }
        }
        mp.setLightUsed(mesh.isLightAccepted()||false);
        mp.setColor(mesh.material.diffuseColor);
        mp.setColorMix(mesh.material.diffuseColorMix);
        mp.setSpecular(mesh.material.specular);

        //this._gl.enable(this._gl.CULL_FACE);
        this._glCachedAccessor.setDepthTest(mesh.depthTest);
        this._blender.setBlendMode(mesh.blendMode);
        mesh.onUpdatingBuffers();
        mp.draw();
        //this._gl.disable(this._gl.CULL_FACE);
        orthoProjectionMatrix.release();
        zToWProjectionMatrix.release();
        inverseTransposeModelMatrix.release();
    }

    public drawMesh2d(mesh:Mesh2d):void {

        const mp:MeshPainter = this._meshPainterHolder.getInstance(this._gl);

        mp.bindMesh2d(mesh);
        mp.bind();

        const modelMatrix:Mat16Holder = this._matrixStack.getCurrentValue();

        const orthoProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        const currViewSize:ISize = this._currFrameBufferStack.getCurrentTargetSize();
        Mat4.ortho(orthoProjectionMatrix,0,currViewSize.width,0,currViewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
        const zToWProjectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.matrixMultiply(zToWProjectionMatrix,orthoProjectionMatrix, zToWMatrix);

        mp.setModelMatrix(modelMatrix.mat16);
        mp.setInverseTransposeModelMatrix(IDENTITY);
        mp.setProjectionMatrix(zToWProjectionMatrix.mat16);
        mp.setAlpha(mesh.getChildrenCount()===0?mesh.alpha:1);
        mp.setTextureUsed(false);
        mp.attachTexture('u_texture',this._nullTexture);

        mp.setNormalsTextureUsed(false);
        mp.attachTexture('u_normalsTexture',this._nullTexture);

        mp.setSpecularTextureUsed(false);
        mp.attachTexture('u_specularTexture',this._nullTexture);

        mp.setCubeMapTextureUsed(false);
        mp.setReflectivity(0);
        mp.attachTexture('u_cubeMapTexture',this._nullCubeMapTexture);

        mp.setLightUsed(false);
        mp.setColor(mesh.fillColor);
        mp.setColorMix(0);
        mp.setSpecular(0);

        this._glCachedAccessor.setDepthTest(mesh.depthTest);
        this._blender.setBlendMode(mesh.blendMode);
        mp.draw();
        zToWMatrix.release();
        orthoProjectionMatrix.release();
        zToWProjectionMatrix.release();
    }

    public destroyMesh(mesh:Mesh2d):void {
        const mp:MeshPainter = this._meshPainterHolder.getInstance(this._gl);
        mp.bindMesh2d(mesh);
        mp.bind();
        mp.disableAllAttributes();
        mesh.getBufferInfo().destroy();
    }

    public drawRectangle(rectangle:Rectangle):void{

        if (rectangle.lineWidth===0 && rectangle.borderRadius===0 && rectangle.fillGradient===undefined) {
            this.drawSimpleColoredRectangle(rectangle); // optimise drawing of simple rectangle with very simple gl program
        } else {
            const rw:number = rectangle.size.width;
            const rh:number = rectangle.size.height;
            const maxSize:number = Math.max(rw,rh);
            const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
            this.prepareGeometryUniformInfo(rectangle);
            this.prepareShapeUniformInfo(rectangle);
            sp.setUniform(sp.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
            sp.setUniform(sp.u_shapeType,SHAPE_TYPE.RECT);
            sp.attachTexture('texture',this._nullTexture);
            sp.draw();
        }

    }


    public drawLine(line:Line):void{
        const r:Rectangle = line.getRectangleRepresentation();
        this.drawRectangle(r);
    }


    public drawEllipse(ellipse:Ellipse):void{

        this.prepareGeometryUniformInfo(ellipse);
        this.prepareShapeUniformInfo(ellipse);

        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        const maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
        if (maxR===ellipse.radiusX) {
            sp.setUniform(sp.u_rx,0.5);
            sp.setUniform(sp.u_ry,ellipse.radiusY/ellipse.radiusX*0.5);
        } else {
            sp.setUniform(sp.u_ry,0.5);
            sp.setUniform(sp.u_rx,ellipse.radiusX/ellipse.radiusY*0.5);
        }

        sp.setUniform(sp.u_shapeType,SHAPE_TYPE.ELLIPSE);
        sp.setUniform(sp.u_width,1);
        sp.setUniform(sp.u_height,1);
        sp.setUniform(sp.u_rectOffsetLeft,1);
        sp.setUniform(sp.u_rectOffsetTop,1);
        sp.setUniform(sp.u_arcAngleFrom,ellipse.arcAngleFrom % (2*Math.PI));
        sp.setUniform(sp.u_arcAngleTo,ellipse.arcAngleTo % (2*Math.PI));
        sp.setUniform(sp.u_anticlockwise,ellipse.anticlockwise);
        sp.attachTexture('texture',this._nullTexture);
        sp.draw();

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

    public transformSet(val:Readonly<Mat16Holder>): void {
        this._matrixStack.setMatrix(val);
    }

    public transformGet(): Readonly<Mat16Holder> {
        return this._matrixStack.getCurrentValue();
    }

    public setLockRect(rect:IRectJSON):void {
        this._lockRect = rect;
    }

    public unsetLockRect():void{
       this._lockRect = undefined;
    }

    public override beforeItemStackDraw(filters:AbstractGlFilter[],alpha:number,forceDrawChildrenOnNewSurface:boolean):IStateStackPointer {
        return this._currFrameBufferStack.pushState(filters,alpha,forceDrawChildrenOnNewSurface);
    }

    public override afterItemStackDraw(stackPointer:IStateStackPointer):void {
        this._glCachedAccessor.setDepthTest(false);
        this._currFrameBufferStack.reduceState(stackPointer);
    }


    public override beforeFrameDraw():void{
        if (this.clearBeforeRender) {
            this._currFrameBufferStack.clear(this.clearColor, 1);
        }
    }

    public override afterFrameDraw():void{
        if (this._currFrameBufferStack===this._origFrameBufferStack) {
            const hasLockRect = this._lockRect!==undefined;
            if (hasLockRect) {
                const rect = this._lockRect!;
                this._gl.enable(this._gl.SCISSOR_TEST);
                this._gl.scissor(~~rect.x, ~~(this.game.size.height - rect.height - rect.y), ~~rect.width,~~rect.height);
            }
            this._currFrameBufferStack.renderToScreen();
            if (hasLockRect) this._gl.disable(this._gl.SCISSOR_TEST);
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

    public createTexture(bitmap:ImageBitmap|HTMLImageElement|HTMLCanvasElement):ITexture{
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
        this._currFrameBufferStack = fbs;
    }

    public getRenderTarget():FrameBufferStack {
        return this._currFrameBufferStack;
    }

    public override destroy():void{
        super.destroy();
        this._origFrameBufferStack.destroy();
        this._nullTexture.destroy();
        this._nullCubeMapTexture.destroy();
        this._shapePainterHolder.destroy();
        this._meshPainterHolder.destroy();
        Texture.destroyAll();
    }

    protected override onResize(): void {
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

        this._glCachedAccessor = new GlCachedAccessor(this._gl);
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
    }

    // optimised version of rectangle drawing
    private drawSimpleColoredRectangle(rectangle:Rectangle):void{

        const scp:SimpleColoredRectPainter = this._coloredRectPainterHolder.getInstance(this._gl);

        if (rectangle.worldTransformDirty) {
            const rect:Rect = Rect.fromPool();
            rect.setXYWH( 0,0,rectangle.size.width,rectangle.size.height);
            const size:Size = Size.fromPool();
            size.setFrom(this._currFrameBufferStack.getCurrentTargetSize());
            const mvpHolder:Mat16Holder = makeModelViewProjectionMatrix(rect,size,this._matrixStack);
            scp.setUniform(scp.u_vertexMatrix,mvpHolder.mat16);
            rectangle.modelViewProjectionMatrix.fromMat16(mvpHolder);
            mvpHolder.release();
            rect.release();
            size.release();
        } else {
            scp.setUniform(scp.u_vertexMatrix,rectangle.modelViewProjectionMatrix.mat16);
        }

        scp.setUniform(scp.u_alpha,rectangle.getChildrenCount()===0?rectangle.alpha:1);
        scp.setUniform(scp.u_color,((rectangle.fillColor) as Color).asGL());
        scp.draw();
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
        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        let offsetX:number = 0,offsetY:number = 0;
        if (maxSize===rw) {
            sp.setUniform(sp.u_width,1);
            sp.setUniform(sp.u_height,rh/rw);
            offsetY = (maxSize - rh)/2;
            sp.setUniform(sp.u_rectOffsetLeft,0);
            sp.setUniform(sp.u_rectOffsetTop,offsetY/maxSize);
        } else {
            sp.setUniform(sp.u_height,1);
            sp.setUniform(sp.u_width,rw/rh);
            offsetX = (maxSize - rw)/2;
            sp.setUniform(sp.u_rectOffsetLeft,offsetX/maxSize);
            sp.setUniform(sp.u_rectOffsetTop,0);
        }


        if (model.worldTransformDirty) {
            const rect:Rect = Rect.fromPool();
            rect.setXYWH( -offsetX, -offsetY,maxSize,maxSize);
            const size:Size = Size.fromPool();
            size.setFrom(this._currFrameBufferStack.getCurrentTargetSize());
            const mvpHolder:Mat16Holder = makeModelViewProjectionMatrix(rect,size,this._matrixStack);
            model.modelViewProjectionMatrix.fromMat16(mvpHolder);
            sp.setUniform(sp.u_vertexMatrix,mvpHolder.mat16);
            mvpHolder.release();
            rect.release();
            size.release();
        } else {
            sp.setUniform(sp.u_vertexMatrix,model.modelViewProjectionMatrix.mat16);
        }

        sp.setUniform(sp.u_alpha,model.getChildrenCount()===0?model.alpha:1);
        this._blender.setBlendMode(model.blendMode);
        this._glCachedAccessor.setDepthTest(model.depthTest);

    }

    private prepareShapeUniformInfo(model:Shape):void{

        if (DEBUG) {
            if (!model.size.width || !model.size.height) {
                console.error(model);
                throw new DebugError(`Can not render model with zero size`);
            }
        }

        const maxSize:number = Math.max(model.size.width,model.size.height);
        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        sp.setUniform(sp.u_lineWidth,Math.min(model.lineWidth/maxSize,1));
        sp.setUniform(sp.u_color,model.color.asGL());

        if (model.fillGradient!==undefined) {
            model.fillGradient.setUniforms(sp);
            if (model.fillGradient.type==='LinearGradient') {
                sp.setUniform(sp.u_fillType,FILL_TYPE.LINEAR_GRADIENT);
            } else {
                model.fillGradient.setUniforms(sp);
                sp.setUniform(sp.u_fillType,FILL_TYPE.RADIAL_GRADIENT);
            }
        } else {
            sp.setUniform(sp.u_fillColor,model.fillColor.asGL());
            sp.setUniform(sp.u_fillType,FILL_TYPE.COLOR);
        }
    }

}
