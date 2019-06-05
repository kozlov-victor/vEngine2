import {ShaderProgram} from "../../../base/shaderProgram";
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, IBufferInfoDescription} from "../../../base/bufferInfo";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {DebugError} from "@engine/debug/debugError";
import {fragmentSource, vertexSource} from "@engine/renderer/webGl/programs/impl/base/modelDrawer.shader";
import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;
import {Color} from "@engine/renderer/color";


export class ModelDrawer extends AbstractDrawer {

    private g3d:GameObject3d;

    private readonly a_position:string = 'a_position';
    private readonly a_normal:string = 'a_normal';
    private readonly a_texcoord:string = 'a_texcoord';
    private readonly u_modelMatrix:string = 'u_modelMatrix';
    private readonly u_projectionMatrix:string = 'u_projectionMatrix';
    private readonly u_color:string = 'u_color';
    private readonly u_alpha:string = 'u_alpha';
    private readonly u_textureUsed:string = 'u_textureUsed';



    constructor(gl:WebGLRenderingContext){
        super(gl);
        this.program = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource
        );
    }
    
    private _initBufferInfo(drawMethod:number= this.gl.TRIANGLES):void{
        const bufferInfo:IBufferInfoDescription = {
            posVertexInfo:{
                array:this.g3d.model.vertexArr, type:this.gl.FLOAT,
                size:3, attrName:this.a_position
            },
            normalInfo: {
                array: this.g3d.model.normalArr, type:this.gl.FLOAT,
                size:3, attrName:this.a_normal
            },
            drawMethod
        };
        if (this.g3d.model.indexArr) {
            bufferInfo.posIndexInfo = {
                array: this.g3d.model.indexArr
            }
        }
        if (this.g3d.model.texCoordArr) {
            bufferInfo.texVertexInfo ={
                array: this.g3d.model.texCoordArr, type:this.gl.FLOAT,
                size:2, attrName:this.a_texcoord
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
        this.setUniform(this.u_modelMatrix,m);
    }

    setProjectionMatrix(m:MAT16):void{
        this.setUniform(this.u_projectionMatrix,m);
    }

    setAlfa(a:number):void{
        this.setUniform(this.u_alpha,1);
    }

    setTextureUsed(used:boolean):void{
        this.setUniform(this.u_textureUsed,used);
    }

    setColor(c:Color):void{
        this.setUniform(this.u_color,c.asGL());
    }

    bind():void{
        if (DEBUG && !this.g3d.model) throw new DebugError(`can not bind modelDrawer;bindModel must be invoked firstly`);
        super.bind();
        if (!this.g3d.model.texCoordArr) this.program.disableAttribute(this.a_texcoord);
    }

    unbind():void{
        this.g3d = null;
        super.unbind();
    }


}