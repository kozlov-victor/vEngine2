import {ShaderProgram} from "../../../../base/shaderProgram";
import {AbstractDrawer} from "../../../abstract/abstractDrawer";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../../base/bufferInfo";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {DebugError} from "@engine/debug/debugError";
import * as fragmentSource from "./mesh.fragment.glsl";
import * as vertexSource from "./mesh.vertex.glsl";
import {mat4} from "@engine/geometry/mat4";
import MAT16 = mat4.MAT16;
import {Color} from "@engine/renderer/common/color";
import {Optional} from "@engine/core/declarations";


export class MeshDrawer extends AbstractDrawer {

    private mesh:Optional<Mesh>;

    private readonly a_position:string = 'a_position';
    private readonly a_normal:string = 'a_normal';
    private readonly a_texCoord:string = 'a_texCoord';
    private readonly u_modelMatrix:string = 'u_modelMatrix';
    private readonly u_inverseTransposeModelMatrix:string = 'u_inverseTransposeModelMatrix';
    private readonly u_textureMatrix:string = 'u_textureMatrix';
    private readonly u_projectionMatrix:string = 'u_projectionMatrix';
    private readonly u_color:string = 'u_color';
    private readonly u_color_mix:string = 'u_color_mix';
    private readonly u_alpha:string = 'u_alpha';
    private readonly u_reflectivity:string = 'u_reflectivity';
    private readonly u_textureUsed:string = 'u_textureUsed';
    private readonly u_normalsTextureUsed:string = 'u_normalsTextureUsed';
    private readonly u_lightUsed:string = 'u_lightUsed';
    private readonly u_heightMapTextureUsed:string = 'u_heightMapTextureUsed';
    private readonly u_cubeMapTextureUsed:string = 'u_cubeMapTextureUsed';
    private readonly u_heightMapFactor:string = 'u_heightMapFactor';

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

    public setInverseTransposeModelMatrix(m:MAT16):void{
        this.setUniform(this.u_inverseTransposeModelMatrix,m);
    }

    public setProjectionMatrix(m:MAT16):void{
        this.setUniform(this.u_projectionMatrix,m);
    }

    public setTextureMatrix(m:MAT16):void{
        this.setUniform(this.u_textureMatrix,m);
    }

    public setAlfa(a:number):void{
        this.setUniform(this.u_alpha,a);
    }

    public setReflectivity(r:number):void{
        this.setUniform(this.u_reflectivity,r);
    }

    public setTextureUsed(used:boolean):void{
        this.setUniform(this.u_textureUsed,used);
    }

    public setNormalsTextureUsed(used:boolean):void{
        this.setUniform(this.u_normalsTextureUsed,used);
    }

    public setHeightMapTextureUsed(used:boolean):void{
        this.setUniform(this.u_heightMapTextureUsed,used);
    }

    public setCubeMapTextureUsed(used:boolean):void{
        this.setUniform(this.u_cubeMapTextureUsed,used);
    }

    public setHeightMapFactor(val:number){
        this.setUniform(this.u_heightMapFactor,val);
    }

    public setLightUsed(used:boolean):void{
        this.setUniform(this.u_lightUsed,used);
    }

    public setColor(c:Color):void{
        this.setUniform(this.u_color,c.asGL());
    }

    public setColorMix(val:number):void{
        this.setUniform(this.u_color_mix,val);
    }

    public bind():void{
        if (DEBUG && this.mesh===undefined) throw new DebugError(`can not bind modelDrawer;bindModel must be invoked firstly`);
        super.bind();
        if (!this.mesh!.modelPrimitive.texCoordArr) {
            this.program!.disableAttribute(this.a_texCoord);
        } else {
            this.program!.enableAttribute(this.a_texCoord);
        }
        if (!this.mesh!.modelPrimitive.normalArr) {
            this.program!.disableAttribute(this.a_normal);
        } else {
            this.program!.enableAttribute(this.a_normal);
        }
    }

    public unbind():void{
        this.mesh = undefined;
        super.unbind();
    }

    private _initBufferInfo(drawMethod:number= DRAW_METHOD.TRIANGLES,vertexSize:2|3=3):void{
        const bufferInfo:IBufferInfoDescription = {
            posVertexInfo:{
                array:this.mesh!.modelPrimitive.vertexArr, type:this.gl.FLOAT,
                size:vertexSize, attrName:this.a_position
            },
            drawMethod
        };
        if (this.mesh!.modelPrimitive.indexArr) {
            bufferInfo.posIndexInfo = {
                array: this.mesh!.modelPrimitive.indexArr
            };
        }
        if (this.mesh!.modelPrimitive.normalArr) {
            bufferInfo.normalInfo = {
                array: this.mesh!.modelPrimitive.normalArr,
                type:this.gl.FLOAT,
                size:3,
                attrName:this.a_normal
            };
        }
        if (this.mesh!.modelPrimitive.texCoordArr) {
            bufferInfo.texVertexInfo = {
                array: this.mesh!.modelPrimitive.texCoordArr, type:this.gl.FLOAT,
                size:2, attrName:this.a_texCoord
            };
        }
        this.mesh!.bufferInfo = new BufferInfo(this.gl,bufferInfo);
    }


}
