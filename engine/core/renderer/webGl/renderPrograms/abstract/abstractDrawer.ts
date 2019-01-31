

import {isEqual, isArray} from "../../../../misc/object";
import {AbstractPrimitive} from "../../primitives/abstractPrimitive";
import {ShaderProgram} from "../../base/shaderProgram";
import {BufferInfo} from "../../base/bufferInfo";
import {FrameBuffer} from "../../base/frameBuffer";
import {IDrawer} from "../interface/iDrawer";
import {UniformsInfo} from "../interface/uniformsInfo";
import {Size} from "../../../../geometry/size";




export interface TextureInfo {
    texture:any,
    size?:Size,
    name:string
}

export class AbstractDrawer implements IDrawer{

    static currentInstance:AbstractDrawer = null;

    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram = null;
    protected uniformCache:any = {};
    protected primitive:AbstractPrimitive;

    protected bufferInfo:BufferInfo;

    private static instances:Array<AbstractDrawer> = [];

    constructor(gl:WebGLRenderingContext){
        this.gl = gl;
        AbstractDrawer.instances.push(this);
    }

    bind(){
        if (
            AbstractDrawer.currentInstance!==null &&
            AbstractDrawer.currentInstance!==this)
        {
            AbstractDrawer.currentInstance.unbind();
        }
        AbstractDrawer.currentInstance = this;
        this.bufferInfo.bind(this.program);
    }

    unbind(){
        this.bufferInfo.unbind();
    }

    destroy(){
        if (this.bufferInfo) this.bufferInfo.destroy();
        this.program.destroy();
    }
    static destroyAll(){
        AbstractDrawer.instances.forEach((it:AbstractDrawer)=>{
            it.destroy();
        });
    }

    setUniform(name:string,value:any){
        if (isEqual(this.uniformCache[name],value)) return;
        if (isArray(value)) {
            if (!this.uniformCache[name]) this.uniformCache[name] = Array(value.length);
            for (let i:number=0,max:number=value.length;i<max;i++) {
                this.uniformCache[name][i] = value[i];
            }
        } else {
            this.uniformCache[name]=value;
        }
        this.program.setUniform(name,this.uniformCache[name]);
    }

    drawElements(){
        this.bufferInfo.draw();
    }

    draw(textureInfos:TextureInfo[],uniforms:UniformsInfo,unused:FrameBuffer = null){
        this.bind();
        Object.keys(uniforms).forEach((name:string)=>this.setUniform(name,uniforms[name]));
        if (textureInfos) {
            textureInfos.forEach((t:TextureInfo,i:number)=>{
                t.texture.bind(t.name,i,this.program);
            });
        }
        this.drawElements();
    }

}