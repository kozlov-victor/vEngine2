import {ShaderProgram} from "../../../base/shaderProgram";
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../base/bufferInfo";
import {Mesh} from "@engine/model/abstract/mesh";
import {DebugError} from "@engine/debug/debugError";
import {fragmentSource, vertexSource} from "@engine/renderer/webGl/programs/impl/base/meshDrawer.shader";
import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;
import {Color} from "@engine/renderer/color";


export class MeshDrawer extends AbstractDrawer {

    private mesh:Mesh;

    private readonly a_position:string = 'a_position';
    private readonly a_normal:string = 'a_normal';
    private readonly a_texcoord:string = 'a_texcoord';
    private readonly u_modelMatrix:string = 'u_modelMatrix';
    private readonly u_projectionMatrix:string = 'u_projectionMatrix';
    private readonly u_color:string = 'u_color';
    private readonly u_alpha:string = 'u_alpha';
    private readonly u_textureUsed:string = 'u_textureUsed';
    private readonly u_lightUsed:string = 'u_lightUsed';


    constructor(gl:WebGLRenderingContext){
        super(gl);
        this.program = new ShaderProgram(
            gl,
            vertexSource,
            fragmentSource
        );
    }

    public bindModel(mesh:Mesh):void{
        this.mesh = mesh;
        if (!this.mesh.bufferInfo) this._initBufferInfo(mesh.modelPrimitive.drawMethod,mesh.vertexItemSize);
        if (mesh.isLightAccepted()===undefined) {
            mesh.acceptLight(!!this.mesh.bufferInfo.normalBuffer);
        }
        this.bufferInfo = this.mesh.bufferInfo;
    }

    public setModelMatrix(m:MAT16):void{
        this.setUniform(this.u_modelMatrix,m);
    }

    public setProjectionMatrix(m:MAT16):void{
        this.setUniform(this.u_projectionMatrix,m);
    }

    public setAlfa(a:number):void{
        this.setUniform(this.u_alpha,1);
    }

    public setTextureUsed(used:boolean):void{
        this.setUniform(this.u_textureUsed,used);
    }

    public setLightUsed(used:boolean):void{
        this.setUniform(this.u_lightUsed,used);
    }

    public setColor(c:Color):void{
        this.setUniform(this.u_color,c.asGL());
    }

    public bind():void{
        if (DEBUG && !this.mesh.modelPrimitive) throw new DebugError(`can not bind modelDrawer;bindModel must be invoked firstly`);
        super.bind();
        if (!this.mesh.modelPrimitive.texCoordArr) {
            this.program.disableAttribute(this.a_texcoord);
        } else {
            this.program.enableAttribute(this.a_texcoord);
        }
        if (!this.mesh.modelPrimitive.normalArr) {
            this.program.disableAttribute(this.a_normal);
        } else {
            this.program.enableAttribute(this.a_normal);
        }
    }

    public unbind():void{
        this.mesh = null;
        super.unbind();
    }
    
    private _initBufferInfo(drawMethod:number= DRAW_METHOD.TRIANGLES,vertexSize:2|3=3):void{
        const bufferInfo:IBufferInfoDescription = {
            posVertexInfo:{
                array:this.mesh.modelPrimitive.vertexArr, type:this.gl.FLOAT,
                size:vertexSize, attrName:this.a_position
            },
            drawMethod
        };
        if (this.mesh.modelPrimitive.indexArr) {
            bufferInfo.posIndexInfo = {
                array: this.mesh.modelPrimitive.indexArr
            };
        }
        if (this.mesh.modelPrimitive.normalArr) {
            bufferInfo.normalInfo = {
                array: this.mesh.modelPrimitive.normalArr,
                type:this.gl.FLOAT,
                size:3,
                attrName:this.a_normal
            };
        }
        if (this.mesh.modelPrimitive.texCoordArr) {
            bufferInfo.texVertexInfo ={
                array: this.mesh.modelPrimitive.texCoordArr, type:this.gl.FLOAT,
                size:2, attrName:this.a_texcoord
            };
        }
        this.mesh.bufferInfo = new BufferInfo(this.gl,bufferInfo);
    }


}