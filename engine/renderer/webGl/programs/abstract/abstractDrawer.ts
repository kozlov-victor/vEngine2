import {isArray, isEqual} from "@engine/misc/object";
import {AbstractPrimitive} from "../../primitives/abstractPrimitive";
import {ShaderProgram} from "../../base/shaderProgram";
import {BufferInfo} from "../../base/bufferInfo";
import {IDrawer} from "../interface/iDrawer";
import {DebugError} from "@engine/debug/debugError";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {FastMap} from "@engine/misc/fastMap";


interface TextureInfo {
    texture:Texture,
    uniformName:string
}

interface TexturesToBind {
    length: number,
    texturesInfo: TextureInfo[]
}

interface UniformValue {
    value:UNIFORM_VALUE_TYPE,
    dirty:boolean
}

export class AbstractDrawer implements IDrawer{

    static currentInstance:AbstractDrawer = null;

    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram = null;
    protected uniformCache:FastMap<string,UniformValue> = new FastMap();
    protected texturesToBind:TexturesToBind = {length: 0, texturesInfo: [] as TextureInfo[]};
    protected primitive:AbstractPrimitive;

    protected bufferInfo:BufferInfo;

    constructor(gl:WebGLRenderingContext){
        this.gl = gl;
    }

    protected bind():void{

        if (DEBUG && !this.program) {
            console.error(this);
            throw new DebugError(`can not init drawer: initProgram method must be invoked!`);
        }

        if (
            AbstractDrawer.currentInstance!==null &&
            AbstractDrawer.currentInstance!==this)
        {
            AbstractDrawer.currentInstance.unbind();
        }
        AbstractDrawer.currentInstance = this;
        this.bufferInfo.bind(this.program);
    }

    protected unbind():void{
        this.bufferInfo.unbind();
    }

    destroy():void{
        if (this.bufferInfo) this.bufferInfo.destroy();
        this.program.destroy();
    }


    setUniform(name:string,value:UNIFORM_VALUE_TYPE){
        if (DEBUG && !name) {
            console.trace();
            throw new DebugError(`can not set uniform with value ${value}: name is not provided`);
        }
        if (DEBUG && value==undefined) {
            console.trace();
            throw new DebugError(`can not set uniform with value ${value}`);
        }
        if (this.uniformCache.has(name) && isEqual(this.uniformCache.get(name).value,value)) return;
        if (isArray(value)) {
            if (!this.uniformCache.has(name)) this.uniformCache.put(name,{value:new Array(value.length),dirty:true});
            const uniformInCache:UniformValue = this.uniformCache.get(name);
            const arr:number[]|boolean[] = uniformInCache.value as number[]|boolean[];
            for (let i:number=0,max:number=value.length;i<max;i++) {
                arr[i] = value[i];
            }
            uniformInCache.dirty = true;
        } else {
            this.uniformCache.put(name,{value,dirty:true});
        }
    }

    attachTexture(uniformName:string,texture:Texture){
        this.texturesToBind.texturesInfo[this.texturesToBind.length++] = {uniformName,texture};
    }

    getAttachedTextureAt(i:number):Texture {
        if (DEBUG && i>this.texturesToBind.length-1) throw new DebugError(`ca not find bound texture: out of range: index:${i}, length:${this.texturesToBind}`);
        return this.texturesToBind.texturesInfo[i].texture;
    }

    setUniformsFromMap(batch:FastMap<string,UNIFORM_VALUE_TYPE>){
        const keys:readonly string[] = batch.getKeys();
        const values:readonly UNIFORM_VALUE_TYPE[] = batch.getValues();
        for (let i:number=0;i<keys.length;i++) {
            this.setUniform(keys[i],values[i]);
        }
    }

    private _setUniform(name:string,value:any){
        this.program.setUniform(name,value);
    }

    protected drawElements(){
        this.bufferInfo.draw();
    }

    draw(){
        this.bind();
        const keys:string[] = this.uniformCache.getKeys();
        const values:{dirty:boolean,value:UNIFORM_VALUE_TYPE}[] = this.uniformCache.getValues();
        for (let i:number=0;i<keys.length;i++) {
            if (!values[i].dirty) continue;
            this._setUniform(keys[i],values[i].value);
            values[i].dirty = false;
        }
        for (let i:number=0,max:number = this.texturesToBind.length;i<max;i++) {
            const t:TextureInfo = this.texturesToBind.texturesInfo[i];
            t.texture.bind(t.uniformName,i,this.program);
        }
        this.texturesToBind.length = 0;
        this.drawElements();
    }

}