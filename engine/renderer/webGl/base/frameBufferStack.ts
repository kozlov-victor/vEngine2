import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {ISize} from "@engine/geometry/size";
import {IDestroyable} from "@engine/core/declarations";
import {INTERPOLATION_MODE, Texture} from "@engine/renderer/webGl/base/texture";
import {Color} from "@engine/renderer/common/color";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/doubleFrameBuffer";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {Game} from "@engine/core/game";
import {FLIP_TEXTURE_MATRIX} from "@engine/renderer/webGl/webGlRenderer";
import IDENTITY = mat4.IDENTITY;
import Mat16Holder = mat4.Mat16Holder;

interface IStackItem {
    frameBuffer:FrameBuffer;
    filters:AbstractGlFilter[];
    blendMode:BLEND_MODE;
    pointer:IStateStackPointer;
}

export interface IStateStackPointer {
    ptr:number;
}

export class FrameBufferStack implements IDestroyable{

    private _stackPoint:number = 0;
    private _stack:IStackItem[] = [];
    private _interpolationMode:INTERPOLATION_MODE;

    private readonly _origFinalFrameBuffer:FrameBuffer;
    private _finalFrameBuffer:FrameBuffer;
    private _doubleFrameBuffer:DoubleFrameBuffer = new DoubleFrameBuffer(this.gl,this.size);

    private _pixelPerfectMode:boolean = false;
    private blender:Blender;

    constructor(private game:Game,private gl:WebGLRenderingContext, private size:ISize, private simpleRectDrawer: SimpleRectDrawer,private FLIP_POSITION_MATRIX:Mat16Holder){
        this.pushState([],BLEND_MODE.NORMAL);
        this._origFinalFrameBuffer = this._finalFrameBuffer = this._getFirst().frameBuffer;
        this.blender = new Blender(this.gl);
        this.blender.enable();
        this.blender.setBlendMode(BLEND_MODE.NORMAL);
    }

    public pushState(filters:AbstractGlFilter[],blendMode:BLEND_MODE):IStateStackPointer{
        if (filters.length>0 && blendMode!==BLEND_MODE.NORMAL) {
            if (this._stack[this._stackPoint]===undefined) {
                this._stack.push({
                    frameBuffer: new FrameBuffer(this.gl,this.size),
                    filters,
                    blendMode,
                    pointer: {ptr:this._stack.length-1}
                });
                this._stackPoint++;
            }
        }
        return this._getLast().pointer;
    }

    public bind(){
        this._getLast().frameBuffer.bind();
    }

    public unbind(){
        this._getLast().frameBuffer.unbind();
    }

    public clear(color:Color,alphaBlend:number){
        this._getLast().frameBuffer.clear(color,alphaBlend);
    }

    public setInterpolationMode(interpolation:INTERPOLATION_MODE){
        this._getLast().frameBuffer.setInterpolationMode(interpolation);
        this._doubleFrameBuffer.setInterpolationMode(interpolation);
        this._interpolationMode = interpolation;
    }

    public setRenderTarget(fb:FrameBuffer){
        this._finalFrameBuffer = fb;
    }

    public unsetRenderTarget(){
        this._finalFrameBuffer = this._origFinalFrameBuffer;
    }

    public getCurrentTargetSize():ISize{
        return this._finalFrameBuffer.getTexture().size;
    }

    public setPixelPerfectMode(mode:boolean):void {
        this._pixelPerfectMode = mode;
    }

    public destroy(){
        this._stack.forEach(f=>f.frameBuffer.destroy());
        this._doubleFrameBuffer.destroy();
    }

    public reduceState(to:IStateStackPointer){
        for (let i = this._stackPoint-1; i <=to.ptr; i++) {
            const currItem:IStackItem = this._stack[i];
            const nextItem:IStackItem = this._stack[i-1];
            const filteredTexture:Texture = this._doubleFrameBuffer.applyFilters(currItem.frameBuffer.getTexture(),currItem.filters);

            this.blender.setBlendMode(currItem.blendMode);
            nextItem.frameBuffer.bind();
            nextItem.frameBuffer.setInterpolationMode(this._interpolationMode);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,this.FLIP_POSITION_MATRIX.mat16);
            this.simpleRectDrawer.attachTexture('texture',filteredTexture);
            this.simpleRectDrawer.draw();
        }
        this.blender.setBlendMode(BLEND_MODE.NORMAL);
        this._stackPoint = to.ptr;
    }

    public isRenderingToScreen():boolean{
        return this._finalFrameBuffer===this._origFinalFrameBuffer;
    }

    public renderToScreen():void{
        const w:number = this._pixelPerfectMode?this.game.screenSize.x:this.game.size.width;
        const h:number = this._pixelPerfectMode?this.game.screenSize.y:this.game.size.height;
        this.gl.viewport(0, 0, w,h);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,this.FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture',this._getFirst().frameBuffer.getTexture());
        this.simpleRectDrawer.draw();
    }

    private _getLast():IStackItem{
        return this._stack[this._stackPoint-1];
    }

    private _getFirst():IStackItem{
        return this._stack[0];
    }


}