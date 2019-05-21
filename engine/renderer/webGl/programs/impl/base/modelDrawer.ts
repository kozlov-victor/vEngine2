import {ShaderProgram} from "../../../base/shaderProgram";
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, BufferInfoDescription} from "../../../base/bufferInfo";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {DebugError} from "@engine/debug/debugError";
import {fragmentSource, vertexSource} from "@engine/renderer/webGl/programs/impl/base/modelDrawer.shader";
import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;
import {Color} from "@engine/renderer/color";


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
    
    private _initBufferInfo(drawMethod:number= this.gl.TRIANGLES):void{
        const bufferInfo:BufferInfoDescription = {
            posVertexInfo:{
                array:this.g3d.model.vertexArr, type:this.gl.FLOAT,
                size:3, attrName:'a_position'
            },
            texVertexInfo: {
                array: this.g3d.model.texCoordArr, type:this.gl.FLOAT,
                size:2, attrName:'a_texcoord'
            },
            normalInfo: {
                array: this.g3d.model.normalArr, type:this.gl.FLOAT,
                size:3, attrName:'a_normal'
            },
            drawMethod
        };
        if (this.g3d.model.indexArr) {
            bufferInfo.posIndexInfo = {
                array: this.g3d.model.indexArr
            }
        }
        this.g3d.bufferInfo = new BufferInfo(this.gl,bufferInfo);
    }

    bindModel(g3d:GameObject3d):void{
        this.g3d = g3d;
        if (!this.g3d.bufferInfo) this._initBufferInfo(g3d.model.drawMethod);
        this.bufferInfo = this.g3d.bufferInfo;
    }

    setModelMatrix(m:MAT16):void{
        this.setUniform('u_modelMatrix',m);
    }

    setProjectionMatrix(m:MAT16):void{
        this.setUniform('u_projectionMatrix',m);
    }

    setAlfa(a:number):void{
        this.setUniform('u_alpha',1);
    }

    setTextureUsed(used:boolean):void{
        this.setUniform('u_textureUsed',used);
    }

    setColor(c:Color):void{
        this.setUniform('u_color',c.asGL());
    }

    bind():void{
        if (DEBUG && !this.g3d.model) throw new DebugError(`can not bind modelDrawer;bindModel must be invoked firstly`);
        super.bind();
    }

    unbind():void{
        this.g3d = null;
        super.unbind();
    }


}