import {DebugError} from "@engine/debug/debugError";
import {FILL_TYPE, SHAPE_TYPE, ShapePainter} from "@engine/renderer/webGl/programs/impl/base/shape/shapePainter";
import {MatrixStack} from "@engine/misc/math/matrixStack";
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
import {STRETCH_MODE} from "@engine/renderable/impl/general/image/image";
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
import {WebGlRendererHelper} from "@engine/renderer/webGl/renderer/webGlRendererHelper";
import {FrameBufferStack, IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {CubeMapTexture} from "@engine/renderer/webGl/base/cubeMapTexture";
import {SimpleColoredRectPainter} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleColoredRectPainter";
import {Mat4Special} from "@engine/misc/math/mat4Special";
import type {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import {CullFace} from "@engine/renderable/impl/3d/mesh3d";
import {BufferInfo} from "@engine/renderer/webGl/base/bufferInfo";
import {GlCachedAccessor} from "@engine/renderer/webGl/blender/glCachedAccessor";
import {LruMap} from "@engine/misc/collection/lruMap";
import {BatchPainter} from "@engine/renderer/webGl/programs/impl/batch/batchPainter";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {SimpleImagePainter} from "@engine/renderer/webGl/programs/impl/base/simpleImage/simpleImagePainter";
import {SkyBox} from "@engine/renderable/impl/skyBox";
import {SkyBoxPainter} from "@engine/renderer/webGl/programs/impl/base/skyBox/skyBoxPainter";
import {MathEx} from "@engine/misc/math/mathEx";
import {Point3d} from "@engine/geometry/point3d";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import Mat16Holder = Mat4.Mat16Holder;
import glEnumToString = DebugUtil.glEnumToString;
import IDENTITY = Mat4.IDENTITY;
import MAT16 = Mat4.MAT16;


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

const lruCache = new LruMap<number, Mat4.Mat16Holder>();

const getProjectionMatrix = (id:number,viewSize:ISize):Mat16Holder=>{
    let projectionMatrix:Mat16Holder;
    if (lruCache.has(id)) {
        projectionMatrix = lruCache.get(id)!
    }
    else {
        const m = Mat16Holder.create();
        Mat4.ortho(m,0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
        lruCache.put(id,m);
        projectionMatrix = m;
    }
    return projectionMatrix;
}

const hlpMatrix1:Mat16Holder = Mat16Holder.create();
Mat4.makeIdentity(hlpMatrix1);
const hlpMatrix2:Mat16Holder = Mat16Holder.create();

const makeModelViewMatrix = (rect:Rect,matrixStack:MatrixStack):Mat16Holder=>{

    const m = hlpMatrix1.mat16 as MAT16;
    // fast makeScale * makeTranslation
    m[ 0] = rect.width;
    m[ 5] = rect.height;

    m[12] = rect.x;
    m[13] = rect.y;

    Mat4Special.multiplyScaleTranslateByAny(hlpMatrix2,hlpMatrix1, matrixStack.getCurrentValue());

    return hlpMatrix2;
};


class InstanceHolder<T extends IDestroyable> {
    private instance:Optional<T>;
    constructor(private clazz:ClazzEx<T,WebGLRenderingContext>,private afterCreated?:(instance:T)=>void){}

    public getInstance(gl:WebGLRenderingContext):T{
        if (this.instance===undefined) {
            this.instance = new this.clazz(gl);
            if (this.afterCreated!==undefined) this.afterCreated(this.instance);
        }
        return this.instance;
    }

    public destroy():void{
        if (this.instance!==undefined) this.instance.destroy();
    }

    public isInvoked():boolean{
        return this.instance!==undefined;
    }
}

const rect = new Rect();
const size = new Size();

export class WebGlRenderer extends AbstractCanvasRenderer {

    public readonly type:string = 'WebGlRenderer';

    protected rendererHelper:RendererHelper = new WebGlRendererHelper(this.game);

    private _gl:WebGLRenderingContext;

    private _shapePainterHolder = new InstanceHolder(ShapePainter);
    private _simpleImagePainterHolder = new InstanceHolder(SimpleImagePainter);
    private _coloredRectPainterHolder = new InstanceHolder(SimpleColoredRectPainter);
    private _meshPainterHolder = new InstanceHolder(MeshPainter);
    private _skyBoxPainterHolder = new InstanceHolder(SkyBoxPainter);
    private _batchPainterHolder = new InstanceHolder(BatchPainter);

    private _nullTextureHolder = new  InstanceHolder(Texture);
    private _nullCubeMapTextureHolder = new InstanceHolder(CubeMapTexture,(it)=>it.setAsZero());

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

        this.flush();

        if (
            img.stretchMode===STRETCH_MODE.STRETCH &&
            img.offset.equals(0) &&
            img.borderRadius===0 &&
            img.lineWidth===0
        ) {
            this._drawSimpleImage(img);
        } else {
            this._drawImage(img);
        }

    }

    public drawBatchedImage(model:BatchedImage):void{
        const bp = this._batchPainterHolder.getInstance(this._gl);
        bp.putNextModel(model,this);
    }

    public drawMesh3d(mesh:Mesh3d):void {

        this.flush();

        const mp:MeshPainter = this._meshPainterHolder.getInstance(this._gl);

        mp.bindMesh3d(mesh);
        mp.bind();

        const modelMatrix:Mat16Holder = this._matrixStack.getCurrentValue();

        const inverseTransposeModelMatrix:Mat16Holder = Mat16Holder.fromPool();
        Mat4.inverse(inverseTransposeModelMatrix,modelMatrix);
        Mat4.transpose(inverseTransposeModelMatrix,inverseTransposeModelMatrix);

        mp.setModelMatrix(modelMatrix.mat16);
        mp.setInverseTransposeModelMatrix(inverseTransposeModelMatrix.mat16);
        mp.setProjectionMatrix(getProjectionMatrix(this._currFrameBufferStack.id,this._currFrameBufferStack.getCurrentTargetSize()).mat16);
        mp.setAlpha(mesh.getChildrenCount()===0?mesh.alpha:1);

        const isTextureUsed:boolean = mesh.texture!==undefined;
        if (DEBUG && isTextureUsed && mesh._modelPrimitive.texCoordArr===undefined) throw new DebugError(`can not apply texture without texture coordinates`);
        mp.setTextureUsed(isTextureUsed);
        mp.attachTexture(
            'u_texture',
            isTextureUsed?mesh.texture as Texture:this._nullTextureHolder.getInstance(this._gl)
        );

        const isVertexColorUsed:boolean = mesh._modelPrimitive.vertexColorArr!==undefined;
        mp.setVertexColorUsed(isVertexColorUsed);

        const isNormalsTextureUsed:boolean = mesh.normalsTexture!==undefined;
        mp.setNormalsTextureUsed(isNormalsTextureUsed);
        mp.attachTexture(
            'u_normalsTexture',
            isNormalsTextureUsed?mesh.normalsTexture as Texture:this._nullTextureHolder.getInstance(this._gl)
        );

        const isSpecularTextureUsed:boolean = mesh.specularTexture!==undefined;
        mp.setSpecularTextureUsed(isSpecularTextureUsed);
        mp.attachTexture(
            'u_specularTexture',
            isSpecularTextureUsed?mesh.specularTexture as Texture:this._nullTextureHolder.getInstance(this._gl)
        );

        const isCubeMapTextureUsed:boolean = mesh.cubeMapTexture!==undefined;
        if (DEBUG && !isCubeMapTextureUsed && mesh.material.reflectivity!==0) throw new DebugError(`can not apply reflectivity without cubeMapTexture`);
        mp.setCubeMapTextureUsed(isCubeMapTextureUsed);
        mp.setReflectivity(mesh.material.reflectivity);
        mp.attachTexture(
            'u_cubeMapTexture',
            isCubeMapTextureUsed?mesh.cubeMapTexture as CubeMapTexture:this._nullCubeMapTextureHolder.getInstance(this._gl));

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

        this._glCachedAccessor.setCullFace(mesh.cullFace);
        this._glCachedAccessor.setDepthTest(mesh.depthTest);
        this._blender.setBlendMode(mesh.blendMode);
        mesh.onUpdatingBuffers();

        if (mesh.alpha!==1) {
            this._glCachedAccessor.setCulling(true);
            this._glCachedAccessor.setCullFace(CullFace.back);
            mp.draw();
            this._glCachedAccessor.setCullFace(CullFace.front);
            mp.draw();
            this._glCachedAccessor.setCulling(false);
            this._glCachedAccessor.setCullFace(CullFace.none);
        } else {
            this._glCachedAccessor.setCullFace(mesh.cullFace);
            mp.draw();
        }
        inverseTransposeModelMatrix.release();
    }

    public drawSkyBox(model:SkyBox):void {
        this.flush();

        const sbp = this._skyBoxPainterHolder.getInstance(this._gl);

        const projectionMatrix = Mat16Holder.fromPool();
        Mat4.perspective(
            projectionMatrix,
            MathEx.degToRad(60),
            this._currFrameBufferStack.getTexture().size.width/this._currFrameBufferStack.getTexture().size.height,
            1,2000);

        const cameraMatrix = Mat16Holder.fromPool();
        const fi = model.angle3d.x;
        const theta = model.angle3d.y;
        const x = Math.cos(fi)*Math.sin(theta);
        const y = Math.sin(fi)*Math.sin(theta);
        const z = Math.cos(theta);
        const cameraPosition = Point3d.fromPool().setXYZ(x,y,z);
        const target = Point3d.fromPool().setXYZ(0,0,0);
        const up = Point3d.fromPool().setXYZ(0,1,0);
        Mat4.lookAt(cameraMatrix,cameraPosition, target, up);

        const viewMatrix = Mat16Holder.fromPool();
        Mat4.inverse(viewMatrix,cameraMatrix);
        (viewMatrix.mat16 as Float32Array)[12] = 0;
        (viewMatrix.mat16 as Float32Array)[13] = 0;
        (viewMatrix.mat16 as Float32Array)[14] = 0;

        const viewDirectionProjectionMatrix  = Mat16Holder.fromPool();
        Mat4.matrixMultiply(viewDirectionProjectionMatrix ,projectionMatrix,viewMatrix);
        Mat4.inverse(viewDirectionProjectionMatrix, viewDirectionProjectionMatrix);

        sbp.setUniformVector(sbp.u_viewDirectionProjectionInverse,viewDirectionProjectionMatrix.mat16);

        sbp.attachTexture(sbp.u_skybox,model.texture);
        this._glCachedAccessor.setDepthTest(false);
        this._glCachedAccessor.setCullFace(CullFace.none);
        sbp.draw();
        this._glCachedAccessor.setDepthTest(true);

        projectionMatrix.release();
        cameraMatrix.release();
        cameraPosition.release();
        target.release();
        up.release();
        viewMatrix.release();
        viewDirectionProjectionMatrix.release();
    }

    public drawMesh2d(mesh:Mesh2d):void {

        this.flush();

        const mp:MeshPainter = this._meshPainterHolder.getInstance(this._gl);

        mp.bindMesh2d(mesh);
        mp.bind();

        const modelMatrix:Mat16Holder = this._matrixStack.getCurrentValue();

        mp.setModelMatrix(modelMatrix.mat16);
        mp.setInverseTransposeModelMatrix(IDENTITY);
        mp.setProjectionMatrix(getProjectionMatrix(this._currFrameBufferStack.id,this._currFrameBufferStack.getCurrentTargetSize()).mat16);
        mp.setAlpha(mesh.getChildrenCount()===0?mesh.alpha:1);
        mp.setTextureUsed(false);
        mp.attachTexture('u_texture',this._nullTextureHolder.getInstance(this._gl));

        mp.setNormalsTextureUsed(false);
        mp.attachTexture('u_normalsTexture',this._nullTextureHolder.getInstance(this._gl));

        mp.setSpecularTextureUsed(false);
        mp.attachTexture('u_specularTexture',this._nullTextureHolder.getInstance(this._gl));

        mp.setCubeMapTextureUsed(false);
        mp.setReflectivity(0);
        mp.attachTexture('u_cubeMapTexture',this._nullCubeMapTextureHolder.getInstance(this._gl));

        mp.setLightUsed(false);
        mp.setColor(mesh.fillColor);
        mp.setColorMix(0);
        mp.setSpecular(0);

        this._glCachedAccessor.setDepthTest(mesh.depthTest);
        this._blender.setBlendMode(mesh.blendMode);
        this._glCachedAccessor.setCullFace(CullFace.none);
        mp.draw();
    }

    public destroyMesh(mesh:Mesh2d):void {
        const mp:MeshPainter = this._meshPainterHolder.getInstance(this._gl);
        mp.bindMesh2d(mesh);
        mp.bind();
        mp.disableAllAttributes();
        mesh.getBufferInfo().destroy();
    }

    public drawRectangle(rectangle:Rectangle):void{

        this.flush();

        if (rectangle.lineWidth===0 && rectangle.borderRadius===0 && rectangle.fillGradient===undefined) {
            this._drawSimpleColoredRectangle(rectangle); // optimise drawing of simple rectangle with very simple gl program
        } else {
            this._drawRectangle(rectangle);
        }

    }


    public drawLine(line:Line):void{

        this.flush();

        const r:Rectangle = line.getRectangleRepresentation();
        this.drawRectangle(r);
    }


    public drawEllipse(ellipse:Ellipse):void{

        this.flush();

        this.prepareGeometryUniformInfo(ellipse);
        this.prepareShapeUniformInfo(ellipse);
        this.prepareShapeFillUniformInfo(ellipse);

        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        const maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
        if (maxR===ellipse.radiusX) {
            sp.setUniformScalar(sp.u_rx,0.5);
            sp.setUniformScalar(sp.u_ry,ellipse.radiusY/ellipse.radiusX*0.5);
        } else {
            sp.setUniformScalar(sp.u_ry,0.5);
            sp.setUniformScalar(sp.u_rx,ellipse.radiusX/ellipse.radiusY*0.5);
        }

        sp.setUniformScalar(sp.u_shapeType,SHAPE_TYPE.ELLIPSE);
        sp.setUniformScalar(sp.u_width,1);
        sp.setUniformScalar(sp.u_height,1);
        sp.setUniformScalar(sp.u_rectOffsetLeft,1);
        sp.setUniformScalar(sp.u_rectOffsetTop,1);
        sp.setUniformScalar(sp.u_arcAngleFrom,ellipse.arcAngleFrom % (2*Math.PI));
        sp.setUniformScalar(sp.u_arcAngleTo,ellipse.arcAngleTo % (2*Math.PI));
        sp.setUniformScalar(sp.u_anticlockwise,ellipse.anticlockwise);
        sp.attachTexture('texture',this._nullTextureHolder.getInstance(this._gl));
        this._glCachedAccessor.setCullFace(CullFace.none);
        sp.draw();

    }

    public flush() {
        if (!this._batchPainterHolder.isInvoked()) return;
        const bp = this._batchPainterHolder.getInstance(this._gl);
        if (!bp.isDirty()) return;
        this._glCachedAccessor.setDepthTest(false);
        this._glCachedAccessor.setCullFace(CullFace.none);
        bp.flush(this);
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
        this.flush();
        this._glCachedAccessor.setDepthTest(false);
        this._currFrameBufferStack.reduceState(stackPointer);
    }

    public override beforeFrameDraw():void{
        if (this.clearBeforeRender) {
            this._currFrameBufferStack.clear(this.clearColor, true,1);
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
            this.flush();
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

    public setRenderTarget(fbs:IRenderTarget):void{
        if (DEBUG && fbs===undefined) throw new DebugError('undefined parameter: setRenderTarget(undefined)');
        if (this._currFrameBufferStack!==fbs) this.flush();
        this._currFrameBufferStack = fbs as FrameBufferStack;
    }

    public getRenderTarget():FrameBufferStack {
        return this._currFrameBufferStack;
    }

    public override destroy():void{
        super.destroy();
        this._origFrameBufferStack.destroy();
        this._nullTextureHolder.destroy();
        this._nullCubeMapTextureHolder.destroy();
        this._shapePainterHolder.destroy();
        this._meshPainterHolder.destroy();
        Texture.destroyAll();
    }

    protected override onResize(): void {
        super.onResize();
        if (this._pixelPerfectMode && (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH_CANVAS_TO_SCREEN || this.game.scaleStrategy===SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN)) {
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

        this._glCachedAccessor = new GlCachedAccessor(gl);
        this._blender = Blender.getSingleton(gl);
        this._blender.enable();
        this._blender.setBlendMode(BLEND_MODE.NORMAL);

        this._origFrameBufferStack = new FrameBufferStack(this.game,this.getNativeContext(),this.game.size);
        this._currFrameBufferStack = this._origFrameBufferStack;

        // gl.depthFunc(gl.LEQUAL);
        //gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
    }

    // optimised version of rectangle drawing
    private _drawSimpleColoredRectangle(rectangle:Rectangle):void{

        const scp:SimpleColoredRectPainter = this._coloredRectPainterHolder.getInstance(this._gl);
        if (rectangle._lastProgramId!==undefined && rectangle._lastProgramId!==scp.id) rectangle.worldTransformDirty = true;
        rectangle._lastProgramId = scp.id;

        if (rectangle.worldTransformDirty) {
            rect.setXYWH( 0,0,rectangle.size.width,rectangle.size.height);
            size.setFrom(this._currFrameBufferStack.getCurrentTargetSize());
            const mvpHolder = makeModelViewMatrix(rect,this._matrixStack);
            scp.setUniformVector(scp.u_vertexMatrix,mvpHolder.mat16, true);
            rectangle.modelViewMatrix.fromMat16(mvpHolder);
        } else {
            scp.setUniformVector(scp.u_vertexMatrix,rectangle.modelViewMatrix.mat16);
        }

        scp.setUniformVector(
            scp.u_projectionMatrix,
            getProjectionMatrix(this._currFrameBufferStack.id,this._currFrameBufferStack.getCurrentTargetSize()).mat16
        );
        scp.setUniformScalar(scp.u_alpha,rectangle.getChildrenCount()===0?rectangle.alpha:1);
        scp.setUniformVector(scp.u_color,rectangle.fillColor.asGL());
        this._glCachedAccessor.setCullFace(CullFace.none);
        scp.draw();
    }

    private _drawRectangle(rectangle:Rectangle):void {
        const rw:number = rectangle.size.width;
        const rh:number = rectangle.size.height;
        const maxSize:number = Math.max(rw,rh);
        const sp = this._shapePainterHolder.getInstance(this._gl);
        if (rectangle._lastProgramId!==undefined && rectangle._lastProgramId!==sp.id) rectangle.worldTransformDirty = true;
        rectangle._lastProgramId = sp.id;

        this.prepareGeometryUniformInfo(rectangle);
        this.prepareShapeUniformInfo(rectangle);
        this.prepareShapeFillUniformInfo(rectangle);
        sp.setUniformScalar(sp.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
        sp.setUniformScalar(sp.u_shapeType,SHAPE_TYPE.RECT);
        sp.attachTexture('texture',this._nullTextureHolder.getInstance(this._gl));
        this._glCachedAccessor.setCullFace(CullFace.none);
        sp.draw();
    }

    private _drawImage(img:Image):void {
        const texture:Texture = img.getTexture() as Texture;
        texture.setInterpolationMode(img.isPixelPerfect()?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR);
        const maxSize:number = Math.max(img.size.width,img.size.height);

        const sp = this._shapePainterHolder.getInstance(this._gl);
        if (img._lastProgramId!==undefined && img._lastProgramId!==sp.id) img.worldTransformDirty = true;
        img._lastProgramId = sp.id;
        this.prepareGeometryUniformInfo(img);

        sp.setUniformScalar(sp.u_lineWidth,Math.min(img.lineWidth/maxSize,1));
        sp.setUniformVector(sp.u_color,img.color.asGL());

        size.setWH(
            img.size.width/img.srcRect.width,
            img.size.height/img.srcRect.height
        );
        sp.setUniformVector(sp.u_repeatFactor,size.toArray());

        sp.setUniformScalar(sp.u_borderRadius,Math.min(img.borderRadius/maxSize,1));
        sp.setUniformScalar(sp.u_shapeType,SHAPE_TYPE.RECT);
        sp.setUniformScalar(sp.u_fillType,FILL_TYPE.TEXTURE);
        const {width: textureWidth,height: textureHeight} = texture.size;
        const {x:srcRectX,y:srcRectY,width:destRectWidth,height:destRectHeight} = img.srcRect;

        const destArr:Float32Array = rect.setXYWH(
            srcRectX/textureWidth,
            srcRectY/textureHeight,
            destRectWidth/textureWidth,
            destRectHeight/textureHeight).toArray();

        sp.setUniformVector(sp.u_texRect, destArr);

        const offSetArr:Float32Array = size.setWH(img.offset.x/maxSize,img.offset.y/maxSize).toArray();
        sp.setUniformVector(sp.u_texOffset,offSetArr);
        sp.setUniformScalar(sp.u_stretchMode,img.stretchMode);
        sp.attachTexture('texture',texture);
        this._glCachedAccessor.setCullFace(CullFace.none);
        sp.draw();
    }

    // optimised version of image drawing
    private _drawSimpleImage(img:Image):void{

        const sip = this._simpleImagePainterHolder.getInstance(this._gl);
        if (img._lastProgramId!==undefined && img._lastProgramId!==sip.id) img.worldTransformDirty = true;
        img._lastProgramId = sip.id;

        const texture:Texture = img.getTexture() as Texture;
        texture.setInterpolationMode(img.isPixelPerfect()?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR);

        if (img.worldTransformDirty) {
            rect.setXYWH( 0,0,img.size.width,img.size.height);
            size.setFrom(this._currFrameBufferStack.getCurrentTargetSize());
            const mvpHolder = makeModelViewMatrix(rect,this._matrixStack);
            sip.setUniformVector(sip.u_vertexMatrix,mvpHolder.mat16, true);
            img.modelViewMatrix.fromMat16(mvpHolder);
        } else {
            sip.setUniformVector(sip.u_vertexMatrix,img.modelViewMatrix.mat16);
        }
        sip.setUniformVector(
            sip.u_projectionMatrix,
            getProjectionMatrix(this._currFrameBufferStack.id,this._currFrameBufferStack.getCurrentTargetSize()).mat16
        );
        sip.setUniformScalar(sip.u_alpha,img.getChildrenCount()===0?img.alpha:1);
        sip.setUniformVector(sip.u_color,img.color.asGL());
        const {width: srcRectWidth,height: srcRectHeight} =texture.size;
        const {x:srcRectX,y:srcRectY,width:destRectWidth,height:destRectHeight} = img.srcRect;

        const destArr:Float32Array = rect.setXYWH(
            srcRectX/srcRectWidth,
            srcRectY/srcRectHeight,
            destRectWidth/srcRectWidth,
            destRectHeight/srcRectHeight).toArray();

        sip.setUniformVector(sip.u_texRect, destArr);

        sip.setUniformScalar(sip.u_width,destRectWidth);
        sip.setUniformScalar(sip.u_height,destRectHeight);
        sip.attachTexture('texture',texture);

        this._blender.setBlendMode(img.blendMode);
        this._glCachedAccessor.setDepthTest(img.depthTest);
        this._glCachedAccessor.setCullFace(CullFace.none);
        sip.draw();
    }

    private prepareGeometryUniformInfo(model:RenderableModel):void{

        if (DEBUG) {
            if (!model.size.width || !model.size.height) {
                console.error(model);
                throw new DebugError(`Can not render model with zero size`);
            }
        }

        const rw = model.size.width;
        const rh = model.size.height;
        const maxSize:number = Math.max(rw,rh);
        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        let offsetX:number = 0,offsetY:number = 0;
        if (maxSize===rw) {
            sp.setUniformScalar(sp.u_width,1);
            sp.setUniformScalar(sp.u_height,rh/rw);
            offsetY = (maxSize - rh)/2;
            sp.setUniformScalar(sp.u_rectOffsetLeft,0);
            sp.setUniformScalar(sp.u_rectOffsetTop,offsetY/maxSize);
        } else {
            sp.setUniformScalar(sp.u_height,1);
            sp.setUniformScalar(sp.u_width,rw/rh);
            offsetX = (maxSize - rw)/2;
            sp.setUniformScalar(sp.u_rectOffsetLeft,offsetX/maxSize);
            sp.setUniformScalar(sp.u_rectOffsetTop,0);
        }

        if (model.worldTransformDirty) {
            rect.setXYWH( -offsetX, -offsetY,maxSize,maxSize);
            const mvpHolder:Mat16Holder = makeModelViewMatrix(rect,this._matrixStack);
            model.modelViewMatrix.fromMat16(mvpHolder);
            sp.setUniformVector(sp.u_vertexMatrix,mvpHolder.mat16,true);
        } else {
            sp.setUniformVector(sp.u_vertexMatrix,model.modelViewMatrix.mat16);
        }

        sp.setUniformVector(
            sp.u_projectionMatrix,
            getProjectionMatrix(this._currFrameBufferStack.id,this._currFrameBufferStack.getCurrentTargetSize()).mat16
        );
        sp.setUniformScalar(sp.u_alpha,model.getChildrenCount()===0?model.alpha:1);
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
        sp.setUniformScalar(sp.u_lineWidth,Math.min(model.lineWidth/maxSize,1));
        sp.setUniformVector(sp.u_color,model.color.asGL());
    }

    private prepareShapeFillUniformInfo(model:{fillGradient:Optional<AbstractGradient>,fillColor:Color}) {
        const sp:ShapePainter = this._shapePainterHolder.getInstance(this._gl);
        if (model.fillGradient!==undefined) {
            model.fillGradient.setUniforms(sp);
            if (model.fillGradient.type==='LinearGradient') {
                sp.setUniformScalar(sp.u_fillType,FILL_TYPE.LINEAR_GRADIENT);
            } else {
                model.fillGradient.setUniforms(sp);
                sp.setUniformScalar(sp.u_fillType,FILL_TYPE.RADIAL_GRADIENT);
            }
        } else {
            sp.setUniformVector(sp.u_fillColor,model.fillColor.asGL());
            sp.setUniformScalar(sp.u_fillType,FILL_TYPE.COLOR);
        }
    }

}
