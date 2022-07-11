import {FrameBuffer} from "../../base/frameBuffer";
import {DebugError} from "@engine/debug/debugError";
import {Mat4} from "@engine/misc/math/mat4";
import {SimpleRectPainter} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectPainter";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {Color} from "@engine/renderer/common/color";
import {FastMap} from "@engine/misc/collection/fastMap";
import {IDestroyable} from "@engine/core/declarations";

export abstract class AbstractGlFilter implements IFilter,IDestroyable {

    public readonly type:string = 'WebglFilter';
    public readonly kind = 'filter';
    public enabled:boolean = true;

    protected gl:WebGLRenderingContext;
    protected simpleRectPainter:SimpleRectPainter;

    private _uniformCache:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();

    private _destroyed:boolean = false;

    protected constructor(protected game:Game){

        const renderer:AbstractRenderer = game.getRenderer();
        if (DEBUG && !(renderer instanceof WebGlRenderer)) {
            throw new DebugError(`can not apply filter: filters available only for WebGlRenderer`);
        }

        this.gl = (game.getRenderer() as any as WebGlRenderer).getNativeContext();
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
