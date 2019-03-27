

import {isEqual, isArray, IKeyVal} from "../../../../misc/object";
import {AbstractPrimitive} from "../../primitives/abstractPrimitive";
import {ShaderProgram} from "../../base/shaderProgram";
import {BufferInfo} from "../../base/bufferInfo";
import {FrameBuffer} from "../../base/frameBuffer";
import {IDrawer} from "../interface/iDrawer";
import {UniformsInfo} from "../interface/uniformsInfo";
import {Size} from "../../../../geometry/size";
import {DebugError} from "@engine/debugError";


export interface TextureInfo {
    texture:any,
    size?:Size,
    name:string
}

export class AbstractDrawer implements IDrawer{

    static currentInstance:AbstractDrawer = null;

    protected gl:WebGLRenderingContext;
    protected program:ShaderProgram = null;
    protected uniformCache:IKeyVal = {};
    protected primitive:AbstractPrimitive;

    protected bufferInfo:BufferInfo;

    private static instances:AbstractDrawer[] = [];

    constructor(gl:WebGLRenderingContext){
        this.gl = gl;
        AbstractDrawer.instances.push(this);
    }

    protected bind(){

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

    protected unbind(){
        this.bufferInfo.unbind();
    }

    destroy(){
        if (this.bufferInfo) this.bufferInfo.destroy();
        this.program.destroy();
    }

    static destroyAll(){ // todo remove this method
        AbstractDrawer.instances.forEach((it:AbstractDrawer)=>{
            it.destroy();
        });
    }


    setUniform(name:string,value:any){
        if (DEBUG && !name) {
            console.trace();
            throw new DebugError(`can not set uniform witn value ${value}: name is not provided`);
        }
        if (isEqual(this.uniformCache[name],value)) return;
        if (isArray(value)) {
            if (!this.uniformCache[name]) this.uniformCache[name] = Array(value.length);
            for (let i:number=0,max:number=value.length;i<max;i++) {
                this.uniformCache[name][i] = value[i];
            }
        } else {
            this.uniformCache[name]=value;
        }
    }

    private _setUniform(name:string,value:any){
        this.program.setUniform(name,value);
    }

    protected drawElements(){
        this.bufferInfo.draw();
    }

    draw(textureInfos:TextureInfo[]){
        this.bind();
        Object.keys(this.uniformCache).forEach((name:string)=>this._setUniform(name,this.uniformCache[name]));
        if (textureInfos) {
            textureInfos.forEach((t:TextureInfo,i:number)=>{
                t.texture.bind(t.name,i,this.program);
            });
        }
        this.drawElements();
    }

}