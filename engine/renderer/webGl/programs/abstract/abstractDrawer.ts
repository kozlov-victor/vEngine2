import {isEqualArray, isTypedArray} from "@engine/misc/object";
import {AbstractPrimitive} from "../../primitives/abstractPrimitive";
import {ShaderProgram} from "../../base/shaderProgram";
import {BufferInfo} from "../../base/bufferInfo";
import {IDrawer} from "../interface/iDrawer";
import {DebugError} from "@engine/debug/debugError";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {IDestroyable, Optional} from "@engine/core/declarations";
import {FastMap} from "@engine/misc/collection/fastMap";
import {AbstractTexture} from "@engine/renderer/webGl/base/abstract/abstractTexture";


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


export class AbstractDrawer implements IDrawer, IDestroyable{

    constructor(gl:WebGLRenderingContext){
        this.gl = gl;
    }

    private static currentInstance:Optional<AbstractDrawer>;

    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram;
    protected uniformCache:FastMap<string,IUniformValue> = new FastMap();
    protected texturesToBind:ITexturesToBind = {length: 0, texturesInfo: [] as ITextureInfo[]};
    protected primitive:AbstractPrimitive;

    protected bufferInfo:BufferInfo;

    public static unbindLastInstance():void {
        if (this.currentInstance!==undefined) this.currentInstance.unbind();
    }

    public destroy():void{
        if (this.bufferInfo) this.bufferInfo.destroy();
        if (this.program!==undefined) this.program.destroy();
    }

    public setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        if (DEBUG && !name) {
            console.trace();
            throw new DebugError(`can not set uniform with value ${value}: name is not provided`);
        }
        if (DEBUG && value===null  || value===undefined) {
            console.trace();
            throw new DebugError(`can not set uniform with name ${name} and value ${value}`);
        }
        if (isTypedArray(value)) {
            if (!this.uniformCache.has(name)) {
                // todo how to define Float32Array or Int32Array???
                this.uniformCache.put(name,{value:new Float32Array(value.length),dirty:true});
            }
            const uniformInCache:IUniformValue = this.uniformCache.get(name) as IUniformValue;
            const arr:Float32Array = uniformInCache.value as Float32Array;

            if (!isEqualArray(arr,value)) {
                arr.set(value);
                uniformInCache.dirty = true;
            }
        } else {
            if (!this.uniformCache.has(name)) {
                this.uniformCache.put(name,{value,dirty:true});
            } else {
                const valueInCache:IUniformValue = this.uniformCache.get(name)!;
                if (valueInCache.value!==value) {
                    valueInCache.value = value;
                    valueInCache.dirty = true;
                }
            }
        }
    }

    public attachTexture(uniformName:string,texture:AbstractTexture):void{
        this.texturesToBind.texturesInfo[this.texturesToBind.length] =
            this.texturesToBind.texturesInfo[this.texturesToBind.length] || {uniformName:undefined,texture:undefined};
        this.texturesToBind.texturesInfo[this.texturesToBind.length].uniformName = uniformName;
        this.texturesToBind.texturesInfo[this.texturesToBind.length].texture = texture;
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
            t.texture.bind(t.uniformName,i,this.program as ShaderProgram);
        }
        this.texturesToBind.length = 0;
        this.drawElements();
    }

    protected bind():void{

        if (DEBUG && this.program===undefined) {
            console.error(this);
            throw new DebugError(`can not init drawer: initProgram method must be invoked!`);
        }

        if (AbstractDrawer.currentInstance===this) return;

        AbstractDrawer.currentInstance?.unbind();

        AbstractDrawer.currentInstance = this;
        this.bufferInfo.bind(this.program);
    }

    protected unbind():void{
        this.bufferInfo.unbind(this.program);
        AbstractDrawer.currentInstance = undefined;
    }

    protected drawElements():void{
        this.bufferInfo.draw();
    }

    private _setUniform(name:string,value:UNIFORM_VALUE_TYPE):void{
        this.program.setUniform(name,value);
    }

}
