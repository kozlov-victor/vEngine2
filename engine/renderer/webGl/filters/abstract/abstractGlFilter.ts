import {SimpleRectPainter} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectPainter";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {Color} from "@engine/renderer/common/color";
import {FastMap} from "@engine/misc/collection/fastMap";
import {IDestroyable} from "@engine/core/declarations";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";

export abstract class AbstractGlFilter implements IFilter,IDestroyable {

    public readonly type:string = 'WebglFilter';
    public readonly kind = 'filter';
    public enabled:boolean = true;

    protected gl:WebGLRenderingContext;
    protected simpleRectPainter:SimpleRectPainter;

    private _uniformCache:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();

    private _destroyed:boolean = false;

    protected constructor(protected game:Game){

        const renderer = game.getRenderer(WebGlRenderer);

        this.gl = renderer.getNativeContext();
        this.simpleRectPainter = new SimpleRectPainter(this.gl);
    }

    protected setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        this._uniformCache.put(name,value);
    }

    public getPainter():AbstractPainter{
        return this.simpleRectPainter;
    }

    public doFilter(destFrameBuffer:FrameBuffer,nextFrameBuffer?:FrameBuffer):void{
        const keys:string[] = this._uniformCache.getKeys();
        for (let i:number = 0; i < keys.length; i++) {
            const name:string = keys[i];
            const value:UNIFORM_VALUE_TYPE = this._uniformCache.get(keys[i])!;
            this.simpleRectPainter.setUniform(name,value);
        }
        this.simpleRectPainter.setUniform(this.simpleRectPainter.u_alpha,1);
        this.simpleRectPainter.setUniform(this.simpleRectPainter.u_flip,false);
        destFrameBuffer.bind();
        destFrameBuffer.clear(Color.NONE);
        this.simpleRectPainter.draw();
    }

    public destroy():void {
        this.simpleRectPainter.destroy();
        this._destroyed = true;
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

}
