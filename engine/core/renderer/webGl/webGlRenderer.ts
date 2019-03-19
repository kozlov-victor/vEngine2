import {DebugError} from "@engine/debugError";
import {AbstractDrawer, TextureInfo} from "./programs/abstract/abstractDrawer";
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
import {ResourceLink} from "@engine/core/resources/resourceLink";
import {AbstractFilter} from "@engine/core/renderer/webGl/filters/abstract/abstractFilter";
import {mat4} from "@engine/core/geometry/mat4";
import {FILL_TYPE, SHAPE_TYPE} from "@engine/core/renderer/webGl/programs/impl/base/shapeDrawer.shader";
import {SimpleRectDrawer} from "@engine/core/renderer/webGl/programs/impl/base/SimpleRectDrawer";
import MAT16 = mat4.MAT16;
import {DoubleFrameBuffer} from "@engine/core/renderer/webGl/base/doubleFrameBuffer";
import IDENTITY = mat4.IDENTITY;


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
const FLIP_TEXTURE_MATRIX:MAT16 = new MatrixStack().translate(0,1).scale(1,-1).getCurrentMatrix();
let FLIP_POSITION_MATRIX:MAT16;


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
    private simpleRectDrawer:SimpleRectDrawer;
    private modelDrawer:ModelDrawer;
    private preprocessFrameBuffer:FrameBuffer;
    private finalFrameBuffer:FrameBuffer;
    private doubleFrameBuffer:DoubleFrameBuffer;
    private nullTexture:Texture;

    constructor(game:Game){
        super(game);
        this.matrixStack = matrixStack;
        this.registerResize();
        this._init();
        FLIP_POSITION_MATRIX = mat4.matrixMultiply(
            mat4.makeScale(this.game.width, this.game.height, 1),
            mat4.ortho(0,this.game.width,0,this.game.height,-1,1));
    }

    private _init(){
    	let gl:WebGLRenderingContext = getCtx(this.container as HTMLCanvasElement);
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

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        // gl.depthFunc(gl.LEQUAL);
    }



    private prepareShapeUniformInfo(shape:Shape):void{
        let rw:number = shape.getRect().width;
        let rh:number = shape.getRect().height;
        let maxSize:number = Math.max(rw,rh);
        let offsetX:number = 0,offsetY:number = 0;
        let sd:ShapeDrawer = this.shapeDrawer;
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
        const size:Size = Size.fromPool();
        sd.setUniform(sd.u_vertexMatrix,makePositionMatrix(
            rect.setXYWH( -offsetX, -offsetY,maxSize,maxSize),
            size.setWH(this.game.width,this.game.height)));
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

    drawImage(img:Image){
        if (DEBUG) {
            if (!img.getResourceLink()) throw new DebugError(`image resource link is not set`);
            if (!this.renderableCache[img.getResourceLink().getId()]) throw new DebugError(`can not find texture with resource link id ${img.getResourceLink().getId()}`);
        }

        this.beforeItemDraw();

        let texture:Texture = this.renderableCache[img.getResourceLink().getId()].texture;
        let texInfo:TextureInfo[] = [{texture,name:'texture'}];
        let maxSize:number = Math.max(img.width,img.height);
        let sd:ShapeDrawer = this.shapeDrawer;
        this.prepareShapeUniformInfo(img);
        sd.setUniform(sd.u_borderRadius,Math.min(img.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        sd.setUniform(sd.u_fillType,FILL_TYPE.TEXTURE);
        const {width: texWidth,height: texHeight} = texture.getSize();
        const {x:srcRectX,y:srcRectY,width:srcRectWidth,height:srcRectHeight} = img.srcRect;
        sd.setUniform(sd.u_texRect,
            [
                srcRectX/texWidth,
                srcRectY/texHeight,
                srcRectWidth/texWidth,
                srcRectHeight/texHeight
            ]
        );
        sd.setUniform(sd.u_texOffset,[img.offset.x/maxSize,img.offset.y/maxSize]);
        this.shapeDrawer.draw(texInfo);

        this.afterItemDraw(img.filters);


    }

    drawModel(g3d:GameObject3d){ // todo
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
        this.modelDrawer.draw(texInfo);// todo uniforms
        this.modelDrawer.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
    };



    drawRectangle(rectangle:Rectangle){
        let rw:number = rectangle.width;
        let rh:number = rectangle.height;
        let maxSize:number = Math.max(rw,rh);
        let sd:ShapeDrawer = this.shapeDrawer;

        this.beforeItemDraw();

        this.prepareShapeUniformInfo(rectangle);
        sd.setUniform(sd.u_borderRadius,Math.min(rectangle.borderRadius/maxSize,1));
        sd.setUniform(sd.u_shapeType,SHAPE_TYPE.RECT);
        let texInfo:TextureInfo[] = [{texture:this.nullTexture,name:'texture'}];
        sd.draw(texInfo);

        this.afterItemDraw(rectangle.filters);
    }

    drawLine(x1:number,y1:number,x2:number,y2:number,color:Color){

        this.beforeItemDraw();

        let dx:number = x2-x1,dy:number = y2-y1;
        let uniforms:UniformsInfo = {};
        const rect:Rect = Rect.fromPool();
        const size:Size = Size.fromPool();
        uniforms.u_vertexMatrix = makePositionMatrix(
            rect.setXYWH(x1,y1,dx,dy),
            size.setWH(this.game.width,this.game.height)
        );
        rect.release();
        size.release();
        uniforms.u_rgba = color.asGL();
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this.afterItemDraw([]);

    }


    drawEllipse(ellipse:Ellipse){
        let maxR:number = Math.max(ellipse.radiusX,ellipse.radiusY);
        let maxR2:number = maxR*2;

        this.beforeItemDraw();

        this.prepareShapeUniformInfo(ellipse);
        let sd:ShapeDrawer = this.shapeDrawer;
        const rect:Rect = Rect.fromPool();
        const size:Size = Size.fromPool();
        sd.setUniform(sd.u_vertexMatrix,makePositionMatrix(
            rect.setXYWH(0,0,maxR2,maxR2),
            size.setWH(this.game.width,this.game.height)
        ));
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
        let texInfo:TextureInfo[] = [{texture:this.nullTexture,name:'texture'}];
        this.shapeDrawer.draw(texInfo);

        this.afterItemDraw(ellipse.filters);

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
        this.finalFrameBuffer.bind();
    }

    flipFrameBuffer(filters:AbstractFilter[]){
        let texToDraw:Texture = this.doubleFrameBuffer.applyFilters(this.finalFrameBuffer.getTexture(),filters);
        this.finalFrameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width,this.fullScreenSize.height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX);
        this.simpleRectDrawer.draw([{texture:texToDraw,name:'texture'}]); // todo

        this.restore();
    };

    private beforeItemDraw(){
        this.preprocessFrameBuffer.bind();
        this.gl.clearColor(1,1,1,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    private afterItemDraw(filters:AbstractFilter[]){
        const filteredTexture:Texture = this.doubleFrameBuffer.applyFilters(this.preprocessFrameBuffer.getTexture(),filters);
        this.finalFrameBuffer.bind();
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX);
        this.simpleRectDrawer.draw([{texture:filteredTexture,name:'texture'}]);
    }

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
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.finalFrameBuffer.getTexture().getGlTexture()); // to restore texture binding
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
        this.finalFrameBuffer.destroy();
        AbstractDrawer.destroyAll();
        Object.keys(this.renderableCache).forEach((key:string)=>{
            let t:Texture = this.renderableCache[key].texture;
            t.destroy();
        });
    }

}
