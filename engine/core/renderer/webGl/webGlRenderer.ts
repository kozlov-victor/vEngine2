

import {DebugError} from "../../../debugError";
import {AbstractDrawer, TextureInfo} from "./renderPrograms/abstract/abstractDrawer";
import {LineDrawer} from "./renderPrograms/impl/base/lineDrawer";
import {ShapeDrawer} from "./renderPrograms/impl/base/shapeDrawer";
import {FrameBuffer} from "./base/frameBuffer";
import {MatrixStack} from "./base/matrixStack";
import * as mat4 from "../../geometry/mat4";
import {Texture} from "./base/texture";
import {AddBlendDrawer} from "./renderPrograms/impl/blend/addBlendDrawer";
import {Rect} from "../../geometry/rect";
import {Game} from "../../game";
import {AbstractCanvasRenderer} from "../abstract/abstractCanvasRenderer";
import {Color} from "../color";
import {ShaderMaterial} from "../../light/shaderMaterial";
import {DrawableInfo} from "./renderPrograms/interface/drawableInfo";
import {IDrawer} from "./renderPrograms/interface/iDrawer";
import {UniformsInfo} from "./renderPrograms/interface/uniformsInfo";
import {Size} from "../../geometry/size";
import { ModelDrawer } from './renderPrograms/impl/base/modelDrawer';
import {GameObject3d} from "../../../model/impl/gameObject3d";
import {Ellipse} from "../../../model/impl/ui/drawable/ellipse";
import {Rectangle} from "../../../model/impl/ui/drawable/rectangle";
import {Image} from "../../../model/impl/ui/drawable/image";
import {SHAPE_TYPE, FILL_TYPE} from "./renderPrograms/impl/base/shapeDrawer.frag";
import {Scene} from "../../../model/impl/scene";
import {Shape} from "../../../model/impl/ui/generic/shape";
import {GameObject} from "../../../model/impl/gameObject";
import {ResourceLink} from "@engine/core/resources/resourceLink";





const getCtx = el=>{
    return (
        el.getContext("webgl",{alpha: false}) ||
        el.getContext('experimental-webgl',{alpha: false}) ||
        el.getContext('webkit-3d',{alpha: false}) ||
        el.getContext('moz-webgl',{alpha: false})
    );
};
const SCENE_DEPTH:number = 1000;
const matrixStack:MatrixStack = new MatrixStack();

const makePositionMatrix = function(rect:Rect,viewSize:Size){
    // proj * modelView
    let zToWMatrix = mat4.makeZToWMatrix(1);
    let projectionMatrix = mat4.ortho(0,viewSize.width,0,viewSize.height,-SCENE_DEPTH,SCENE_DEPTH);
    let scaleMatrix = mat4.makeScale(rect.width, rect.height, 1);
    let translationMatrix = mat4.makeTranslation(rect.x, rect.y, 0);

    let matrix = mat4.matrixMultiply(scaleMatrix, translationMatrix);
    matrix = mat4.matrixMultiply(matrix, matrixStack.getCurrentMatrix());
    matrix = mat4.matrixMultiply(matrix, projectionMatrix);
    matrix = mat4.matrixMultiply(matrix, zToWMatrix);
    return matrix;
};

const makeTextureMatrix = function(srcRect:Rect,texSize:Size){

    let texScaleMatrix = mat4.makeScale(srcRect.width / texSize.width, srcRect.height / texSize.height, 1);
    let texTranslationMatrix = mat4.makeTranslation(srcRect.x / texSize.width, srcRect.y / texSize.height, 0);
    return mat4.matrixMultiply(texScaleMatrix, texTranslationMatrix);
};

//  gl.enable(gl.CULL_FACE);
//  gl.enable(gl.DEPTH_TEST);
export class WebGlRenderer extends AbstractCanvasRenderer {

    private gl:WebGLRenderingContext;
    private matrixStack:MatrixStack;
    private shapeDrawer:ShapeDrawer;
    private modelDrawer:ModelDrawer;
    private lineDrawer:LineDrawer;
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
    	let gl = getCtx(this.container);
    	this.gl = gl;

    	this.nullTexture = new Texture(gl);

        this.shapeDrawer = new ShapeDrawer(gl);
        this.lineDrawer = new LineDrawer(gl);
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
        // uniforms[sd.u_fillColor] unused;
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


    // private drawTextureInfo(texInfo:TextureInfo[],
    //                         drawableInfo:DrawableInfo,
    //                         shaderMaterial:ShaderMaterial,
    //                         srcRect:Rect,
    //                         dstRect:Rect){
    //
    //     let scene:Scene = this.game.getCurrScene();
    //
    //     let drawer:IDrawer;
    //     let uniforms:UniformsInfo = {
    //         u_textureMatrix: makeTextureMatrix(srcRect,texInfo[0].texture.getSize()),
    //         u_vertexMatrix: makePositionMatrix(dstRect, Size.fromPool().setWH(this.game.width,this.game.height)), // todo
    //         u_alpha: drawableInfo.alpha
    //     };
    //
    //     // if (drawableInfo.blendMode==='add') drawer = this.addBlendDrawer; // todo extract to separate class method
    //     // else if (drawableInfo.acceptLight || texInfo.length>1) { // todo
    //     //     drawer = this.spriteRectLightDrawer;
    //     //     uniforms['u_useNormalMap'] = texInfo.length>1;
    //     //     scene.ambientLight.setUniforms(uniforms);
    //     //     this.game.lightArray.setUniforms(uniforms);
    //     //     shaderMaterial.setUniforms(uniforms);
    //     // } else {
    //     //     //drawer = this.spriteRectDrawer;
    //     // }
    //     //drawer.draw(texInfo,uniforms,this.frameBuffer); // todo remove uniforms variable
    // }


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
        this.lineDrawer.draw(null,uniforms,null);
    }


    drawEllipse(ellipse:Ellipse){
        let maxR = Math.max(ellipse.radiusX,ellipse.radiusY);
        let maxR2 = maxR*2;

        let uniforms:UniformsInfo = this.prepareShapeUniformInfo(ellipse);
        let sd:ShapeDrawer = this.shapeDrawer;
        uniforms[sd.u_vertexMatrix] = makePositionMatrix(
            Rect.fromPool().setXYWH(ellipse.pos.x,ellipse.pos.y,maxR2,maxR2),
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


    flipFrameBuffer(filters){
        let texToDraw = this.frameBuffer.getTexture().applyFilters(filters,null);
        this.frameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width,this.fullScreenSize.height);
        this.flipTextureInfo[0].texture = texToDraw;
        this.shapeDrawer.draw(this.flipTextureInfo,this.flipUniformInfo,null);
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
