import {DebugError} from "@engine/debug/debugError";
import {AbstractDrawer} from "./programs/abstract/abstractDrawer";
import {FILL_TYPE, SHAPE_TYPE, ShapeDrawer} from "./programs/impl/base/shape/shapeDrawer";
import {FrameBuffer} from "./base/frameBuffer";
import {MatrixStack} from "./base/matrixStack";
import {INTERPOLATION_MODE, Texture} from "./base/texture";
import {Rect} from "../../geometry/rect";
import {Game, SCALE_STRATEGY} from "../../core/game";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../common/color";
import {Size} from "../../geometry/size";
import {MeshDrawer} from "./programs/impl/base/mesh/meshDrawer";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/geometry/image";
import {Shape} from "@engine/renderable/abstract/shape";
import {ResourceLink} from "@engine/resources/resourceLink";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/doubleFrameBuffer";
import {BLEND_MODE, RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {Line} from "@engine/renderable/impl/geometry/line";
import {ITexture} from "@engine/renderer/common/texture";
import {debugUtil} from "@engine/renderer/webGl/debug/debugUtil";
import {ClazzEx, IDestroyable, IFilterable, Optional} from "@engine/core/declarations";
import {TileMap} from "@engine/renderable/impl/general/tileMap";
import {TileMapDrawer} from "@engine/renderer/webGl/programs/impl/base/tileMap/tileMapDrawer";
import IDENTITY = mat4.IDENTITY;
import Mat16Holder = mat4.Mat16Holder;
import glEnumToString = debugUtil.glEnumToString;


const getCtx = (el:HTMLCanvasElement):Optional<WebGLRenderingContext>=>{
    const contextAttrs:WebGLContextAttributes = {alpha:false,premultipliedAlpha:false};
    const possibles:string[] = ['webgl2','webgl','experimental-webgl','webkit-3d','moz-webgl'];
    for (const p of possibles) {
        const ctx:WebGLRenderingContext = el.getContext(p,contextAttrs)  as WebGLRenderingContext;
        //if (DEBUG && ctx) console.log(`context using: ${p}`);
        if (ctx) return ctx;
    }
    if (DEBUG) throw new DebugError(`webGl is not accessible on this device`);
    return undefined;
};

const SCENE_DEPTH:number = 1000;
const FLIP_TEXTURE_MATRIX:Mat16Holder = new MatrixStack().translate(0,1).scale(1,-1).release().getCurrentValue().clone();
let FLIP_POSITION_MATRIX:Mat16Holder;

const zToWMatrix:Mat16Holder = Mat16Holder.create();
mat4.makeZToWMatrix(zToWMatrix,1);

const BLACK:Color = Color.RGB(0,0,0,0).freeze();

const makePositionMatrix = (rect:Rect,viewSize:Size,matrixStack:MatrixStack):Mat16Holder=>{
    // proj * modelView
    const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.ortho(projectionMatrix,0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);

    const scaleMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.makeScale(scaleMatrix,rect.width, rect.height, 1);

    const translationMatrix:Mat16Holder = Mat16Holder.fromPool();
    mat4.makeTranslation(translationMatrix,rect.x, rect.y, 0);

    const matrix1:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(matrix1,scaleMatrix, translationMatrix);

    const matrix2:Mat16Holder = Mat16Holder.fromPool();
    mat4.matrixMultiply(matrix2,matrix1, matrixStack.getCurrentValue());

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

    private gl:WebGLRenderingContext;
    private readonly matrixStack:MatrixStack = new MatrixStack();
    private shapeDrawerHolder:InstanceHolder<ShapeDrawer> = new InstanceHolder(ShapeDrawer);
    private simpleRectDrawer:SimpleRectDrawer;
    private meshDrawerHolder:InstanceHolder<MeshDrawer> = new InstanceHolder(MeshDrawer);
    private tileMapDrawerHolder:InstanceHolder<TileMapDrawer> = new InstanceHolder(TileMapDrawer);
    private preprocessFrameBuffer:FrameBuffer;
    private finalFrameBuffer:FrameBuffer;
    private doubleFrameBuffer:DoubleFrameBuffer;
    private blender:Blender;
    private nullTexture:Texture;
    private pixelPerfectMode:boolean = false;

    private _isRectLocked:boolean = false;

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

    public setPixelPerfectMode(mode:boolean):void{
        this.pixelPerfectMode = mode;
        this.finalFrameBuffer.getTexture().setInterpolationMode(mode?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR);
        this.onResize();
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

        (img.getResourceLink().getTarget() as Texture).
            setInterpolationMode(img.pixelPerfect?INTERPOLATION_MODE.NEAREST:INTERPOLATION_MODE.LINEAR);
        this.beforeItemDraw(img);


        const texture:Texture = (img.getResourceLink() as ResourceLink<Texture>).getTarget();
        const maxSize:number = Math.max(img.size.width,img.size.height);

        const sd:ShapeDrawer = this.shapeDrawerHolder.getInstance(this.gl);
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

        const destArr:[number,number,number,number] = Rect.fromPool().setXYWH(
            srcRectX/textureWidth,
            srcRectY/textureHeight,
            destRectWidth/textureWidth,
            destRectHeight/textureHeight).release().toArray();

        sd.setUniform(sd.u_texRect, destArr);

        const offSetArr:[number,number] = Size.fromPool().setWH(img.offset.x/maxSize,img.offset.y/maxSize).release().toArray();
        sd.setUniform(sd.u_texOffset,offSetArr);
        sd.setUniform(sd.u_stretchMode,img.stretchMode);
        sd.attachTexture('texture',texture);
        sd.draw();

        this.afterItemDraw(img.filters as AbstractFilter[],img.blendMode);


    }

    public drawMesh(mesh:Mesh):void {

        const md:MeshDrawer = this.meshDrawerHolder.getInstance(this.gl);

        md.bindModel(mesh);
        md.bind();

        if (mesh.invertY) this.matrixStack.scale(1,-1,1);
        const matrix1:Mat16Holder = this.matrixStack.getCurrentValue();

        const projectionMatrix:Mat16Holder = Mat16Holder.fromPool();
        mat4.ortho(projectionMatrix,0,this.game.width,0,this.game.height,-SCENE_DEPTH,SCENE_DEPTH);
        const matrix2:Mat16Holder = Mat16Holder.fromPool();
        mat4.matrixMultiply(matrix2,projectionMatrix, zToWMatrix);

        md.setModelMatrix(matrix1.mat16);
        md.setProjectionMatrix(matrix2.mat16);
        md.setAlfa(mesh.alpha);
        const isTextureUsed:boolean = mesh.texture!==undefined;
        md.setTextureUsed(isTextureUsed);
        if (isTextureUsed) md.setTextureMatrix(FLIP_TEXTURE_MATRIX.mat16);
        md.attachTexture('u_texture',isTextureUsed?mesh.texture as Texture:this.nullTexture);

        const isNormalsTextureUsed:boolean = mesh.normalsTexture!==undefined;
        md.setNormalsTextureUsed(isNormalsTextureUsed);
        md.attachTexture('u_normalsTexture',isNormalsTextureUsed?mesh.normalsTexture as Texture:this.nullTexture);

        const isHeightMapTextureUsed:boolean = mesh.heightMapTexture!==undefined;
        md.setHeightMapTextureUsed(isHeightMapTextureUsed);
        md.attachTexture('u_heightMapTexture',isHeightMapTextureUsed?mesh.heightMapTexture as Texture:this.nullTexture);
        md.setHeightMapFactor(mesh.heightMapFactor);

        md.setLightUsed(mesh.isLightAccepted()||false);
        md.setColor(mesh.fillColor);
        md.setColorMix(mesh.colorMix);


        if (mesh.depthTest) this.gl.enable(this.gl.DEPTH_TEST);
        //this.gl.enable(this.gl.CULL_FACE);
        md.draw();

        md.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
        //this.gl.disable(this.gl.CULL_FACE);
        zToWMatrix.release();
        projectionMatrix.release();
        matrix2.release();
    }


    public drawRectangle(rectangle:Rectangle):void{
        const {width:rw,height:rh} = rectangle.size;
        const maxSize:number = Math.max(rw,rh);
        const sd:ShapeDrawer = this.shapeDrawerHolder.getInstance(this.gl);

        this.beforeItemDraw(rectangle);

        this.prepareGeometryUniformInfo(rectangle);
        this.prepareShapeUniformInfo(rectangle);
        sd.setUniform(sd.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.attachTexture('texture',this.nullTexture);
        sd.draw();

        this.afterItemDraw(rectangle.filters as AbstractFilter[],rectangle.blendMode);
    }

    public drawTileMap(tileMap: TileMap): void {
        const justCreated:boolean = !this.tileMapDrawerHolder.isInvoked();
        const tileMapDrawer:TileMapDrawer = this.tileMapDrawerHolder.getInstance(this.gl);
        if (justCreated) {
            tileMapDrawer.prepareShaderGenerator();
            tileMapDrawer.initProgram();
        }

        const rect:Rect = Rect.fromPool();
        rect.setXYWH(
            0,
            0,
            tileMap.drawInfo.numOfTilesInWidth*tileMap.tileWidth,
            tileMap.drawInfo.numOfTilesInHeight*tileMap.tileHeight
        );

        const size:Size = Size.fromPool();
        size.setWH(this.game.width,this.game.height);
        const pos16h:Mat16Holder = makePositionMatrix(rect,size,this.matrixStack);
        tileMapDrawer.setUniform(tileMapDrawer.u_vertexMatrix,pos16h.mat16);
        pos16h.release();
        rect.release();
        size.release();

        tileMapDrawer.setUniform(tileMapDrawer.u_textureMatrix,IDENTITY);
        const texture:Texture = tileMap.getResourceLink().getTarget() as Texture;
        tileMapDrawer.attachTexture('texture',texture);
        tileMapDrawer.setTileSize(
            tileMap.tileWidth / texture.size.width,
            tileMap.tileHeight / texture.size.height,
        );
        tileMapDrawer.draw();
    }


    public drawLine(line:Line):void{
        const r:Rectangle = line.getRectangleRepresentation();
        this.drawRectangle(r);
    }


    public drawEllipse(ellipse:Ellipse):void{
        const maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
        const maxR2:number = maxR*2;

        this.beforeItemDraw(ellipse);

        this.prepareGeometryUniformInfo(ellipse);
        this.prepareShapeUniformInfo(ellipse);
        const sd:ShapeDrawer = this.shapeDrawerHolder.getInstance(this.gl);
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
        sd.draw();

        this.afterItemDraw(ellipse.filters as AbstractFilter[],ellipse.blendMode);

    }

    public setAlpha(a:number):void{
        if (DEBUG) throw new DebugError('not implemented');
    }

    public save():void {
        this.matrixStack.save();
    }

    public scale(x:number,y:number):void {
        if (x===1 && y===1) return;
        this.matrixStack.scale(x,y);
    }

    public resetTransform():void{
        this.matrixStack.resetTransform();
    }

    public rotateX(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this.matrixStack.rotateX(angleInRadians);
    }

    public rotateY(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this.matrixStack.rotateY(angleInRadians);
    }

    public rotateZ(angleInRadians:number):void {
        if (angleInRadians===0) return;
        this.matrixStack.rotateZ(angleInRadians);
    }

    public translate(x:number,y:number,z:number=0):void{
        if (x===0 && y===0 && z===0) return;
        this.matrixStack.translate(x,y,z);
    }

    public skewX(angle:number):void{
        if (angle===0) return;
        this.matrixStack.skewX(angle);
    }

    public skewY(angle:number):void{
        if (angle===0) return;
        this.matrixStack.skewY(angle);
    }

    public restore():void{
        this.matrixStack.restore();
    }

    public lockRect(rect:Rect):void {
        this._isRectLocked = true;
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.scissor(rect.x,rect.y,rect.width,rect.height);
    }

    public unlockRect():void{
        if (!this._isRectLocked) return;
        this._isRectLocked = false;
        this.gl.disable(this.gl.SCISSOR_TEST);
    }

    public beforeFrameDraw(color:Color):void{
        this.save();
        this.finalFrameBuffer.bind();
        this.finalFrameBuffer.clear(color);
    }

    public afterFrameDraw(filters: AbstractFilter[]):void{
        const texToDraw:Texture = this.doubleFrameBuffer.applyFilters(this.finalFrameBuffer.getTexture(),filters);
        this.finalFrameBuffer.unbind();
        if (this.pixelPerfectMode) this.gl.viewport(0, 0, this.game.screenSize.x,this.game.screenSize.y);
        else this.gl.viewport(0, 0, this.game.width,this.game.height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture',texToDraw);
        this.simpleRectDrawer.draw();
        this.restore();
    }
    public getError():Optional<{code:number,desc:string}>{
        if (!DEBUG) return undefined;
        const err:number = this.gl.getError();
        if (err!==this.gl.NO_ERROR) {
            console.log(AbstractDrawer.currentInstance);
            return {code:err,desc:glEnumToString(this.gl,err)};
        }
        return undefined;
    }

    public putToCache(l:ResourceLink<ITexture>,t:Texture) {
        const url:string = l.getUrl();
        if (DEBUG && !url) throw new DebugError(`no url is associated with resource link`);
        this.renderableCache[url] = t;
    }

    public getCachedTarget(l:ResourceLink<ITexture>):Optional<ITexture> {
        return this.renderableCache[l.getUrl()];
    }

    public createTexture(imgData:ArrayBuffer|string, link:ResourceLink<ITexture>, onLoad:()=>void):void{
        const possibleTargetInCache:ITexture = this.renderableCache[link.getUrl()];
        if (possibleTargetInCache!==undefined) {
            link.setTarget(possibleTargetInCache);
            onLoad();
            return;
        }

        this.createImageFromData(imgData,(bitmap:ImageBitmap|HTMLImageElement)=>{
            const texture:Texture = new Texture(this.gl);
            texture.setImage(bitmap);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.finalFrameBuffer.getTexture().getGlTexture()); // to restore texture binding
            this.putToCache(link,texture);
            link.setTarget(texture);
            onLoad();
        });

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
        this.shapeDrawerHolder.destroy();
        this.meshDrawerHolder.destroy();
        this.simpleRectDrawer.destroy();
        this.tileMapDrawerHolder.destroy();
        //this.modelDrawer.destroy();
        Object.keys(this.renderableCache).forEach((key:string)=>{
            const t:Texture = this.renderableCache[key] as Texture;
            t.destroy();
        });
    }


    protected onResize(): void {
        super.onResize();
        if (this.pixelPerfectMode && (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH || this.game.scaleStrategy===SCALE_STRATEGY.FIT)) {
            this.container.width = this.game.screenSize.x;
            this.container.height = this.game.screenSize.y;
        } else {
            this.container.width = this.game.width;
            this.container.height = this.game.height;
        }
    }

    private _init():void{
        const gl:WebGLRenderingContext = getCtx(this.container as HTMLCanvasElement)!;
        if (DEBUG && gl===undefined) throw new DebugError(`WebGLRenderingContext is not supported by this device`);
        this.gl = gl;

        this.nullTexture = new Texture(gl);

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


    private prepareGeometryUniformInfo(model:RenderableModel):void{
        const {width:rw,height:rh} = model.size;
        const maxSize:number = Math.max(rw,rh);
        const sd:ShapeDrawer = this.shapeDrawerHolder.getInstance(this.gl);
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

        sd.setUniform(sd.u_alpha,model.alpha);
        sd.setUniform(sd.u_stretchMode,STRETCH_MODE.STRETCH);


    }

    private prepareShapeUniformInfo(model:Shape){
        const maxSize:number = Math.max(model.size.width,model.size.height);
        const sd:ShapeDrawer = this.shapeDrawerHolder.getInstance(this.gl);
        sd.setUniform(sd.u_lineWidth,Math.min(model.lineWidth/maxSize,1));
        sd.setUniform(sd.u_color,model.color.asGL());

        if (model.fillColor.type==='LinearGradient') {
            sd.setUniform(sd.u_fillLinearGradient,model.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.LINEAR_GRADIENT);
        } else if (model.fillColor.type==='Color') {
            sd.setUniform(sd.u_fillColor,model.fillColor.asGL());
            sd.setUniform(sd.u_fillType,FILL_TYPE.COLOR);
        }
    }

    private beforeItemDraw(sp:RenderableModel & IFilterable):void{
        if (sp.filters.length>0 || sp.blendMode!==BLEND_MODE.NORMAL) {
            this.preprocessFrameBuffer.bind();
            this.preprocessFrameBuffer.clear(BLACK);
            this.blender.setBlendMode(BLEND_MODE.NORMAL);
        } else {
            this.finalFrameBuffer.bind();
        }
    }

    private afterItemDraw(filters: AbstractFilter[],blendMode:BLEND_MODE):void{
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
