import {ShaderProgram} from "../../../../base/shaderProgram";
import {AbstractDrawer} from "../../../abstract/abstractDrawer";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../../base/bufferInfo";
import type {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {DebugError} from "@engine/debug/debugError";
import * as fragmentSource from "./mesh.fragment.glsl";
import * as vertexSource from "./mesh.vertex.glsl";
import {Mat4} from "@engine/geometry/mat4";
import {Color} from "@engine/renderer/common/color";
import type {Mesh3d} from "@engine/renderable/impl/3d/mesh3d";
import MAT16 = Mat4.MAT16;


export class MeshDrawer extends AbstractDrawer {

    private mesh:Mesh2d;

    private readonly a_position:string = 'a_position';
    private readonly a_normal:string = 'a_normal';
    private readonly a_texCoord:string = 'a_texCoord';
    private readonly a_vertexColor:string = 'a_vertexColor';
    private readonly u_modelMatrix:string = 'u_modelMatrix';
    private readonly u_inverseTransposeModelMatrix:string = 'u_inverseTransposeModelMatrix';
    private readonly u_textureMatrix:string = 'u_textureMatrix';
    private readonly u_projectionMatrix:string = 'u_projectionMatrix';
    private readonly u_color:string = 'u_color';
    private readonly u_color_mix:string = 'u_color_mix';
    private readonly u_alpha:string = 'u_alpha';
    private readonly u_reflectivity:string = 'u_reflectivity';
    private readonly u_specular:string = 'u_specular';
    private readonly u_textureUsed:string = 'u_textureUsed';
    private readonly u_vertexColorUsed:string = 'u_vertexColorUsed';
    private readonly u_normalsTextureUsed:string = 'u_normalsTextureUsed';
    private readonly u_lightUsed:string = 'u_lightUsed';
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

    public bindMesh3d(mesh:Mesh3d):void{
        this.mesh = mesh;
        if (!this.mesh.bufferInfo) this._initBufferInfo(mesh.modelPrimitive.drawMethod,mesh.vertexItemSize);
        if (mesh.isLightAccepted()===undefined) {
            mesh.acceptLight(!!this.mesh.bufferInfo.normalBuffer);
        }
        this.bufferInfo = this.mesh.bufferInfo;
    }

    public bindMesh2d(mesh:Mesh2d):void{
        this.mesh = mesh;
        if (!this.mesh.bufferInfo) this._initBufferInfo(mesh.modelPrimitive.drawMethod,mesh.vertexItemSize);
        this.bufferInfo = this.mesh.bufferInfo;
    }

    public setModelMatrix(m:Readonly<MAT16>):void{
        this.setUniform(this.u_modelMatrix,m);
    }

    public setInverseTransposeModelMatrix(m:Readonly<MAT16>):void{
        this.setUniform(this.u_inverseTransposeModelMatrix,m);
    }

    public setProjectionMatrix(m:Readonly<MAT16>):void{
        this.setUniform(this.u_projectionMatrix,m);
    }

    public setTextureMatrix(m:Readonly<MAT16>):void{
        this.setUniform(this.u_textureMatrix,m);
    }

    public setAlfa(a:number):void{
        this.setUniform(this.u_alpha,a);
    }

    public setSpecular(s:number):void{
        this.setUniform(this.u_specular,s);
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

    public setVertexColorUsed(used:boolean):void{
        this.setUniform(this.u_vertexColorUsed,used);
    }

    public setCubeMapTextureUsed(used:boolean):void{
        this.setUniform(this.u_cubeMapTextureUsed,used);
    }

    public setHeightMapFactor(val:number):void{
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

    public override bind():void{
        if (DEBUG && this.mesh===undefined) throw new DebugError(`can not bind modelDrawer;bindModel must be invoked firstly`);
        super.bind();
        this.bufferInfo.bind(this.program);
        if (!this.mesh.modelPrimitive.texCoordArr) {
            this.program.disableAttribute(this.a_texCoord);
        } else {
            this.program.enableAttribute(this.a_texCoord);
        }
        if (!this.mesh.modelPrimitive.normalArr) {
            this.program.disableAttribute(this.a_normal);
        } else {
            this.program.enableAttribute(this.a_normal);
        }
        if (!this.mesh.modelPrimitive.vertexColorArr) {
            this.program.disableAttribute(this.a_vertexColor);
        } else {
            this.program.enableAttribute(this.a_vertexColor);
        }
    }

    private _initBufferInfo(drawMethod:number= DRAW_METHOD.TRIANGLES,vertexSize:2|3=3):void{
        const bufferInfo:IBufferInfoDescription = {
            posVertexInfo:{
                array:new Float32Array(this.mesh.modelPrimitive.vertexArr), type:this.gl.FLOAT,
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
                array: new Float32Array(this.mesh.modelPrimitive.normalArr),
                type:this.gl.FLOAT,
                size:3,
                attrName:this.a_normal
            };
        }
        if (this.mesh.modelPrimitive.texCoordArr) {
            bufferInfo.texVertexInfo = {
                array: new Float32Array(this.mesh.modelPrimitive.texCoordArr),
                type:this.gl.FLOAT,
                size:2,
                attrName:this.a_texCoord
            };
        }
        if (this.mesh.modelPrimitive.vertexColorArr) {
            bufferInfo.colorVertexInfo = {
                array: new Float32Array(this.mesh.modelPrimitive.vertexColorArr),
                type:this.gl.FLOAT,
                size:4,
                attrName:this.a_vertexColor
            };
        }
        this.mesh.bufferInfo = new BufferInfo(this.gl,bufferInfo);
    }


}
