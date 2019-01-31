import {ShaderProgram} from "../../../base/shaderProgram";
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, BufferInfoDescription} from "../../../base/bufferInfo";
import {GameObject3d} from "../../../../../../model/impl/gameObject3d";
import {DebugError} from "../../../../../../debugError";


const vertexShader:string = `

attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_projectionMatrix;

varying vec2 v_texcoord;
varying vec3 v_normal;

void main() {

  gl_Position = u_projectionMatrix * u_modelMatrix * a_position;
  v_texcoord = a_texcoord;
  v_normal = a_normal;
}
`;

const textureShader:string = `

precision highp float;

varying vec2 v_texcoord;
varying vec3 v_normal;

uniform sampler2D u_texture;
uniform float u_alpha;
uniform mat4 u_modelMatrix;


void main() {

    vec3 lightDirection = normalize(vec3(-1,-1,1));
    vec3 normalized = normalize((u_modelMatrix * vec4(v_normal,0)).xyz);
    float lightFactor = max(0.5,dot(lightDirection,normalized));
    gl_FragColor = texture2D(u_texture, v_texcoord);
    gl_FragColor.rgb *= lightFactor;
    gl_FragColor.a *= u_alpha;
}

`;


export class ModelDrawer extends AbstractDrawer {

    private g3d:GameObject3d;

    constructor(gl:WebGLRenderingContext){
        super(gl);
        this.program = new ShaderProgram(
            gl,
            vertexShader,
            textureShader
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