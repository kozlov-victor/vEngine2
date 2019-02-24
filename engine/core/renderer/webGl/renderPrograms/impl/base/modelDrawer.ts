import {ShaderProgram} from "../../../base/shaderProgram";
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, BufferInfoDescription} from "../../../base/bufferInfo";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {DebugError} from "@engine/debugError";
import {fragmentSource, vertexSource} from "@engine/core/renderer/webGl/renderPrograms/impl/base/modelDrawer.shader";





export class ModelDrawer extends AbstractDrawer {

    private g3d:GameObject3d;

    constructor(gl:WebGLRenderingContext){
        super(gl);
        this.program = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource
        );
    }
    
    private _initBufferInfo(){
        this.g3d.bufferInfo = new BufferInfo(this.gl,{
            posVertexInfo:{
                array:this.g3d.model.vertexArr, type:this.gl.FLOAT,
                size:3, attrName:'a_position'
            },
            posIndexInfo: {
                array: this.g3d.model.indexArr
            },
            texVertexInfo: {
                array: this.g3d.model.texCoordArr, type:this.gl.FLOAT,
                size:2, attrName:'a_texcoord'
            },
            normalInfo: {
                array: this.g3d.model.normalArr, type:this.gl.FLOAT,
                size:3, attrName:'a_normal'
            },
            drawMethod:this.gl.TRIANGLES
        } as BufferInfoDescription);
    }

    bindModel(g3d:GameObject3d){
        this.g3d = g3d;
        if (!this.g3d.bufferInfo) this._initBufferInfo();
        this.bufferInfo = this.g3d.bufferInfo;
    }

    bind(){
        if (DEBUG && !this.g3d.model) throw new DebugError(`can not bind modelDrawer;bindModel must be invoked firstly`);
        super.bind();
    }

    unbind(){
        this.g3d = null;
        super.unbind();
    }


}