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
import IDENTITY = mat4.IDENTITY;
import Mat16Holder = mat4.Mat16Holder;
import {FLIP_TEXTURE_MATRIX, makeIdentityPositionMatrix} from "@engine/renderer/webGl/webGlRendererHelper";

interface IStackItem {
    frameBuffer:FrameBuffer;
    filters:AbstractGlFilter[];
    blendMode:BLEND_MODE;
    pointer:IStateStackPointer;
}

export interface IStateStackPointer {
    ptr:number;
}

let FLIP_POSITION_MATRIX:Mat16Holder;



export class FrameBufferStack implements IDestroyable{

    private debug:boolean = false;

    private _stackPointer:number;
    private readonly _stack:IStackItem[] = [];
    private _interpolationMode:INTERPOLATION_MODE = INTERPOLATION_MODE.LINEAR;

    private readonly _origFinalFrameBuffer:FrameBuffer;
    private _finalFrameBuffer:FrameBuffer;
    private _doubleFrameBuffer:DoubleFrameBuffer = new DoubleFrameBuffer(this.gl,this.size);

    private _pixelPerfectMode:boolean = false;
    private blender:Blender = new Blender(this.gl);

    constructor(private game:Game,private gl:WebGLRenderingContext, private size:ISize, private simpleRectDrawer: SimpleRectDrawer){
        this._stack.push({
            frameBuffer: new FrameBuffer(this.gl,this.size),
            filters:[],
            blendMode:BLEND_MODE.NORMAL,
            pointer: {ptr:0}
        });
        this._stackPointer = 1;
        this._origFinalFrameBuffer = this._finalFrameBuffer = this._getFirst().frameBuffer;
        this.blender.enable();
        this.blender.setBlendMode(BLEND_MODE.NORMAL);

        const m16hResult:Mat16Holder = Mat16Holder.fromPool();
        const m16Scale:Mat16Holder = Mat16Holder.fromPool();
        mat4.makeScale(m16Scale,this.game.size.width, this.game.size.height, 1);
        const m16Ortho:Mat16Holder = Mat16Holder.fromPool();
        mat4.ortho(m16Ortho,0,this.game.size.width,0,this.game.size.height,-1,1);

        mat4.matrixMultiply(m16hResult, m16Scale, m16Ortho);
        FLIP_POSITION_MATRIX = m16hResult.clone();

        m16hResult.release();
        m16Scale.release();
        m16Ortho.release();

    }

    public pushState(filters:AbstractGlFilter[],blendMode:BLEND_MODE):IStateStackPointer{
        const prevPointer = this._getLast().pointer;
        if (filters.length>0 || blendMode!==BLEND_MODE.NORMAL) {
            if (this.debug) console.log('state has been pushed');
            if (this._stack[this._stackPointer]===undefined) {
                this._stack[this._stackPointer] = {
                    frameBuffer: new FrameBuffer(this.gl,this.size),
                    filters:undefined!,
                    blendMode: undefined!,
                    pointer: {ptr:NaN}
                };
            }
            this._stack[this._stackPointer].filters = filters;
            this._stack[this._stackPointer].blendMode = blendMode;
            this._stack[this._stackPointer].frameBuffer.bind();
            this._stack[this._stackPointer].frameBuffer.clear(Color.NONE);
            this._stack[this._stackPointer].pointer.ptr = this._stackPointer;
            this._stackPointer++;
        } else {
            this._getLast().frameBuffer.bind();
        }
        return prevPointer;
    }

    public clear(color:Color,alphaBlend?:number){
        this._getLast().frameBuffer.clear(color,alphaBlend);
    }

    public setInterpolationMode(interpolation:INTERPOLATION_MODE){
        this._getLast().frameBuffer.setInterpolationMode(interpolation);
        this._doubleFrameBuffer.setInterpolationMode(interpolation);
        this._interpolationMode = interpolation;
    }

    public setRenderTarget(fb:FrameBuffer){
        this._finalFrameBuffer = fb;
        this._finalFrameBuffer.bind();
    }

    public unsetRenderTarget(){
        this._finalFrameBuffer = this._origFinalFrameBuffer;
        this._finalFrameBuffer.bind();
    }

    public getCurrentTargetSize():ISize{
        return this._finalFrameBuffer.getTexture().size;
    }

    public setPixelPerfectMode(mode:boolean):void {
        this._pixelPerfectMode = mode;
    }

    public getStackSize():number {
        return this._stackPointer;
    }

    public destroy(){
        this._stack.forEach(f=>f.frameBuffer.destroy());
        this._doubleFrameBuffer.destroy();
    }

    public reduceState(to:IStateStackPointer){
        if (this._stackPointer===1) return;
        if (this.debug) console.log(`reducing state from ${this._stackPointer-1} to ${to.ptr}`);
        for (let i:number = this._stackPointer-1; i>to.ptr; i--) {
            const currItem:IStackItem = this._stack[i];
            const nextItem:IStackItem = this._stack[i-1];

            const filteredTexture:Texture = this._doubleFrameBuffer.applyFilters(currItem.frameBuffer.getTexture(),currItem.filters);

            this.blender.setBlendMode(currItem.blendMode);
            nextItem.frameBuffer.bind();
            nextItem.frameBuffer.setInterpolationMode(this._interpolationMode);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY);
            const m16h:Mat16Holder = makeIdentityPositionMatrix(0,0,this._finalFrameBuffer.getTexture().size);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,m16h.mat16);
            this.simpleRectDrawer.attachTexture('texture',filteredTexture);
            this.simpleRectDrawer.draw();
            m16h.release();
        }
        this.blender.setBlendMode(BLEND_MODE.NORMAL);
        this._stackPointer = to.ptr + 1;
        //if (this._stackPointer===0) this._stackPointer = 1; todo ???
        if (this.debug) console.log(`stack pointer after reducing ${this._stackPointer}`);
    }

    public isRenderingToScreen():boolean{
        return this._finalFrameBuffer===this._origFinalFrameBuffer;
    }

    public renderToScreen():void{
        const w:number = this._pixelPerfectMode?this.game.screenSize.x:this.game.size.width;
        const h:number = this._pixelPerfectMode?this.game.screenSize.y:this.game.size.height;
        this._getLast().frameBuffer.unbind();
        this.gl.viewport(0, 0, w,h);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16); // todo identity
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture',this._getLast().frameBuffer.getTexture());
        this.simpleRectDrawer.draw();
        console.log(this._stack.length);
    }

    private _getLast():IStackItem{
        return this._stack[this._stackPointer-1];
    }

    private _getFirst():IStackItem{
        return this._stack[0];
    }


}