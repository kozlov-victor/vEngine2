import {IKeyVal, isArray, isEqual} from "@engine/misc/object";
import {AbstractPrimitive} from "../../primitives/abstractPrimitive";
import {ShaderProgram} from "../../base/shaderProgram";
import {BufferInfo} from "../../base/bufferInfo";
import {IDrawer} from "../interface/iDrawer";
import {Size} from "@engine/geometry/size";
import {DebugError} from "@engine/debug/debugError";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Texture} from "@engine/renderer/webGl/base/texture";


interface TextureInfo {
    texture:Texture,
    uniformName:string
}

interface TexturesToBind {
    length: number,
    texturesInfo: TextureInfo[]
}

export class AbstractDrawer implements IDrawer{

    static currentInstance:AbstractDrawer = null;

    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram = null;
    protected uniformCache:IKeyVal<UNIFORM_VALUE_TYPE> = {};
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
            throw new DebugError(`can not set uniform witn value ${value}: name is not provided`);
        }
        if (DEBUG && value==undefined) {
            console.trace();
            throw new DebugError(`can not set uniform with value ${value}`);
        }
        if (isEqual(this.uniformCache[name],value)) return;
        if (isArray(value)) {
            if (!this.uniformCache[name]) this.uniformCache[name] = Array(value.length);
            for (let i:number=0,max:number=value.length;i<max;i++) {
                (this.uniformCache[name]  as any[])[i] = value[i];
            }
        } else {
            this.uniformCache[name]=value;
        }
    }

    attachTexture(uniformName:string,texture:Texture){
        this.texturesToBind.texturesInfo[this.texturesToBind.length++] = {uniformName,texture};
    }

    getAttachedTextureAt(i:number):Texture {
        if (DEBUG && i>this.texturesToBind.length-1) throw new DebugError(`ca not find bound texture: out of range: index:${i}, length:${this.texturesToBind}`);
        return this.texturesToBind.texturesInfo[i].texture;
    }

    setUniformsFromMap(batch:IKeyVal<UNIFORM_VALUE_TYPE>){
        Object.keys(batch).forEach((name:string)=>this.setUniform(name,batch[name]));
    }

    private _setUniform(name:string,value:any){
        this.program.setUniform(name,value);
    }

    protected drawElements(){
        this.bufferInfo.draw();
    }

    draw(){
        this.bind();
        Object.keys(this.uniformCache).forEach((name:string)=>this._setUniform(name,this.uniformCache[name]));
        for (let i:number=0,max:number = this.texturesToBind.length;i<max;i++) {
            const t:TextureInfo = this.texturesToBind.texturesInfo[i];
            t.texture.bind(t.uniformName,i,this.program);
        }
        this.texturesToBind.length = 0;
        this.drawElements();
    }

}