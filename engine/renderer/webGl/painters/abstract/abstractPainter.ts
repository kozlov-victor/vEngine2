import {isEqualArray, isTypedArray} from "@engine/misc/object";
import {AbstractPrimitive} from "../../primitives/abstractPrimitive";
import {ShaderProgram} from "../../base/program/shaderProgram";
import {IPainter} from "../interface/iPainter";
import {DebugError} from "@engine/debug/debugError";
import {
    UNIFORM_VALUE_ARRAY_TYPE,
    UNIFORM_VALUE_PRIMITIVE_TYPE,
    UNIFORM_VALUE_TYPE
} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {IDestroyable, Optional} from "@engine/core/declarations";
import {FastMap} from "@engine/misc/collection/fastMap";
import {AbstractTexture} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {Incrementer} from "@engine/resources/incrementer";
import {BufferInfo} from "@engine/renderer/webGl/base/buffer/bufferInfo";


interface ITextureInfo {
    texture:AbstractTexture;
    uniformName:string;
}

interface ITexturesToBind {
    length: number;
    texturesInfo: ITextureInfo[];
}

interface IUniformValue {
    value:UNIFORM_VALUE_TYPE;
    dirty:boolean;
}


export class AbstractPainter implements IPainter, IDestroyable{

    constructor(gl:WebGLRenderingContext){
        this.gl = gl;
    }

    public readonly id = Incrementer.getValue();

    private static currentInstance:Optional<AbstractPainter>;

    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram;
    protected uniformCache:FastMap<string,IUniformValue> = new FastMap();
    protected texturesToBind:ITexturesToBind = {length: 0, texturesInfo: [] as ITextureInfo[]};
    protected primitive:AbstractPrimitive;

    protected bufferInfo:BufferInfo;

    private _destroyed:boolean = false;

    public destroy():void{
        if (this.bufferInfo) this.bufferInfo.destroy();
        if (this.program!==undefined) this.program.destroy();
        this._destroyed = true;
    }

    public isDestroyed(): boolean {
        return this._destroyed;
    }

    public setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        if (isTypedArray(value)) {
            this.setUniformVector(name,value as UNIFORM_VALUE_ARRAY_TYPE);
        } else {
            this.setUniformScalar(name,value as UNIFORM_VALUE_PRIMITIVE_TYPE);
        }
    }

    public setUniformScalar(name:string,value:UNIFORM_VALUE_PRIMITIVE_TYPE):void{
        if (DEBUG && !name) {
            console.trace();
            throw new DebugError(`can not set uniform with value ${value}: name is not provided`);
        }
        if (DEBUG && value===null  || value===undefined) {
            console.trace();
            throw new DebugError(`can not set uniform with name ${name} and value ${value}`);
        }
        if (!this.uniformCache.has(name)) {
            this.uniformCache.put(name,{value,dirty:true});
        } else {
            const valueInCache = this.uniformCache.get(name)!;
            if (valueInCache.value!==value) {
                valueInCache.value = value;
                valueInCache.dirty = true;
            }
        }
    }

    public setUniformVector(name:string,value:UNIFORM_VALUE_ARRAY_TYPE,dirtyFlag:boolean = false):void{
        if (DEBUG && !name) {
            console.trace();
            throw new DebugError(`can not set uniform with value ${value}: name is not provided`);
        }
        if (DEBUG && value===null  || value===undefined) {
            console.trace();
            throw new DebugError(`can not set uniform with name ${name} and value ${value}`);
        }
        if (!this.uniformCache.has(name)) {
            // todo how to define Float32Array or Int32Array???
            this.uniformCache.put(name,{value:new Float32Array(value.length),dirty:true});
        }
        const uniformInCache = this.uniformCache.get(name) as IUniformValue;
        const arr = uniformInCache.value as UNIFORM_VALUE_ARRAY_TYPE;

        if (dirtyFlag || !isEqualArray(arr,value)) {
            arr.set(value);
            uniformInCache.dirty = true;
        }
    }

    public attachTexture(uniformName:string,texture:AbstractTexture):void{
        const tx =
            this.texturesToBind.texturesInfo[this.texturesToBind.length] ??=
            {uniformName:undefined!,texture:undefined!};
        tx.uniformName = uniformName;
        tx.texture = texture;
        this.texturesToBind.length++;
    }

    public getAttachedTextureAt(i:number):AbstractTexture {
        if (DEBUG && i>this.texturesToBind.length-1) throw new DebugError(`can not find bound texture: out of range: index:${i}, length:${this.texturesToBind.length}`);
        return this.texturesToBind.texturesInfo[i].texture;
    }

    public setUniformsFromMap(batch:FastMap<string,UNIFORM_VALUE_TYPE>):void{
        const keys:readonly string[] = batch.getKeys();
        const values:readonly UNIFORM_VALUE_TYPE[] = batch.getValues();
        for (let i:number=0;i<keys.length;i++) {
            this.setUniform(keys[i],values[i]);
        }
    }

    public draw():void{
        this.bind();
        const keys:string[] = this.uniformCache.getKeys();
        const values:{dirty:boolean,value:UNIFORM_VALUE_TYPE}[] = this.uniformCache.getValues();
        for (let i:number=0,length:number=keys.length;i<length;i++) {
            const v = values[i];
            if (!v.dirty) continue;
            this._setUniform(keys[i],v.value);
            v.dirty = false;
        }

        for (let i:number=0,max:number = this.texturesToBind.length;i<max;i++) {
            const t:ITextureInfo = this.texturesToBind.texturesInfo[i];
            t.texture.bind(t.uniformName,i,this.program);
        }
        this.texturesToBind.length = 0;
        this.drawElements();
    }

    protected bind():void{

        if (DEBUG && this.program===undefined) {
            console.error(this);
            throw new DebugError(`can not init painter: initProgram method must be invoked!`);
        }

        if (AbstractPainter.currentInstance!==this) {
            AbstractPainter.currentInstance?.unbind();
            AbstractPainter.currentInstance = this;
            this.bufferInfo.bind(this.program);
        }

    }

    protected unbind():void{
        this.bufferInfo.unbind(this.program);
        AbstractPainter.currentInstance = undefined;
    }

    protected drawElements():void{
        this.bufferInfo.draw();
    }

    private _setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        this.program.setUniform(name,value);
    }

}
