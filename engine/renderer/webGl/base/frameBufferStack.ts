import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {ISize} from "@engine/geometry/size";
import {IDestroyable} from "@engine/core/declarations";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Color} from "@engine/renderer/common/color";
import {DoubleFrameBuffer} from "@engine/renderer/webGl/base/doubleFrameBuffer";
import {BLEND_MODE} from "@engine/renderable/abstract/renderableModel";
import {Blender} from "@engine/renderer/webGl/blender/blender";
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {mat4} from "@engine/geometry/mat4";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {Game} from "@engine/core/game";
import {FLIP_TEXTURE_MATRIX, makeIdentityPositionMatrix} from "@engine/renderer/webGl/webGlRendererHelper";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {ResourceLink} from "@engine/resources/resourceLink";
import {INTERPOLATION_MODE} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import IDENTITY = mat4.IDENTITY;
import Mat16Holder = mat4.Mat16Holder;
import {Device} from "@engine/misc/device";

interface IStackItem {
    frameBuffer:FrameBuffer;
    filters:readonly AbstractGlFilter[];
    pointer:IStateStackPointer;
}

export interface IStateStackPointer {
    ptr:number;
}

let FLIP_POSITION_MATRIX:Mat16Holder;

const NONE_FILTERS:readonly AbstractGlFilter[] = [];


export class FrameBufferStack implements IDestroyable, IRenderTarget{

    private debug:boolean = false; // todo remove this flag

    private _stackPointer:number;
    private readonly _stack:IStackItem[] = [];
    private _interpolationMode:INTERPOLATION_MODE = INTERPOLATION_MODE.LINEAR;

    private _doubleFrameBuffer:DoubleFrameBuffer = new DoubleFrameBuffer(this.gl,this.size);

    private _pixelPerfectMode:boolean = false;
    private simpleRectDrawer:SimpleRectDrawer;
    private blender:Blender = Blender.getSingleton(this.gl);

    private readonly resourceLink:ResourceLink<Texture>;

    constructor(private game:Game,private gl:WebGLRenderingContext, private size:ISize){
        this._stack.push({
            frameBuffer: new FrameBuffer(this.gl,this.size),
            filters:NONE_FILTERS,
            pointer: {ptr:0}
        });
        this._stackPointer = 1;

        this.simpleRectDrawer = new SimpleRectDrawer(gl);
        this.simpleRectDrawer.initProgram();

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

        this.resourceLink = ResourceLink.create(this._getFirst().frameBuffer.getTexture());

    }

    public pushState(filters:AbstractGlFilter[],forceDrawChildrenOnNewSurface:boolean):IStateStackPointer{
        const prevPointer = this._getLast().pointer;
        if (filters.length>0 || forceDrawChildrenOnNewSurface) {
            if (this.debug) console.log('state has been pushed');
            if (this._stack[this._stackPointer]===undefined) {
                this._stack[this._stackPointer] = {
                    frameBuffer: new FrameBuffer(this.gl,this.size),
                    filters:NONE_FILTERS,
                    pointer: {ptr:this._stackPointer}
                };
            }
            this._stack[this._stackPointer].filters = filters;
            this._stack[this._stackPointer].frameBuffer.bind();
            this._stack[this._stackPointer].frameBuffer.clear(Color.NONE);
            this._stackPointer++;
        } else {
            this._getLast().frameBuffer.bind();
        }
        return prevPointer;
    }

    public clear(color:Color,alphaBlend?:number){
        this._getLast().frameBuffer.bind();
        this._getLast().frameBuffer.clear(color,alphaBlend);
    }

    public setInterpolationMode(interpolation:INTERPOLATION_MODE){
        this._getLast().frameBuffer.setInterpolationMode(interpolation);
        this._doubleFrameBuffer.setInterpolationMode(interpolation);
        this._interpolationMode = interpolation;
    }


    public getCurrentTargetSize():ISize{
        return this._getLast().frameBuffer.getTexture().size;
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
        this.simpleRectDrawer.destroy();
    }

    public reduceState(to:IStateStackPointer){
        if (this._stackPointer===1) return;
        if (this.debug) console.log(`reducing state from ${this._stackPointer-1} to ${to.ptr}`);
        for (let i:number = this._stackPointer-1; i>to.ptr; i--) {
            const currItem:IStackItem = this._stack[i];
            const nextItem:IStackItem = this._stack[i-1];

            const filteredTexture:Texture = this._doubleFrameBuffer.applyFilters(currItem.frameBuffer.getTexture(),currItem.filters);
            currItem.filters = NONE_FILTERS;

            nextItem.frameBuffer.bind();
            nextItem.frameBuffer.setInterpolationMode(this._interpolationMode);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,IDENTITY);
            const m16h:Mat16Holder = makeIdentityPositionMatrix(0,0,this._getLast().frameBuffer.getTexture().size);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,m16h.mat16);
            this.simpleRectDrawer.attachTexture('texture',filteredTexture);
            this.blender.setBlendMode(BLEND_MODE.NORMAL);
            this.simpleRectDrawer.draw();
            m16h.release();
        }
        this._stackPointer = to.ptr + 1;
    }

    public renderToScreen():void{
        const needFullScreen:boolean = this._pixelPerfectMode || Device.embeddedEngine;
        const w:number = needFullScreen?this.game.getRenderer().screenSize.width:this.game.size.width;
        const h:number = needFullScreen?this.game.getRenderer().screenSize.height:this.game.size.height;
        this._getLast().frameBuffer.unbind();
        this.gl.viewport(0, 0, w,h);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix,FLIP_TEXTURE_MATRIX.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix,FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture',this._getLast().frameBuffer.getTexture());
        this.simpleRectDrawer.draw();
    }

    public getResourceLink(): ResourceLink<Texture> {
        return this.resourceLink;
    }

    private _getLast():IStackItem{
        return this._stack[this._stackPointer-1];
    }

    private _getFirst():IStackItem{
        return this._stack[0];
    }


}
