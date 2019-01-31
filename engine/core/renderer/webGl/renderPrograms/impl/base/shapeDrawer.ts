
import {ShaderProgram} from "../../../base/shaderProgram"
import {AbstractDrawer} from "../../abstract/abstractDrawer"
import {BufferInfo, BufferInfoDescription} from "../../../base/bufferInfo";
import {Plane} from "../../../primitives/plane";
import {GL_TYPE} from "../../../base/shaderProgramUtils";
import {fragmentSource} from './shapeDrawer.frag';
import {ShaderGenerator} from "../../../shaders/generators/shaderGenerator";


export class ShapeDrawer extends AbstractDrawer {

    u_vertexMatrix:string;
    a_position:string;
    u_lineWidth:string;
    u_rx:string;
    u_ry:string;
    u_width:string;
    u_height:string;
    u_borderRadius:string;
    u_color:string;
    u_alpha:string;
    u_fillLinearGradient:string;
    u_fillColor:string;
    u_shapeType:string;
    u_fillType:string;
    u_texRect:string;
    u_texOffset:string;
    u_rectOffsetTop: string;
    u_rectOffsetLeft: string;


    constructor(gl:WebGLRenderingContext){
        super(gl);
        let gen = new ShaderGenerator();
        gen.setVertexMainFn(`
            void main(){
                v_position = a_position;
                gl_Position = u_vertexMatrix * a_position;   
            }
        `);
        // base uniforms and attrs
        this.u_vertexMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        gen.addVarying(GL_TYPE.FLOAT_VEC4,'v_position');
        // rect uniforms
        this.u_lineWidth = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_lineWidth');
        this.u_rx = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_rx');
        this.u_ry = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_ry');
        this.u_width = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_width');
        this.u_height = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_height');
        this.u_rectOffsetTop = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_rectOffsetTop');
        this.u_rectOffsetLeft = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_rectOffsetLeft');
        this.u_borderRadius = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_borderRadius');
        // color and texture data uniforms
        this.u_color = gen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_color');
        this.u_alpha = gen.addFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        this.u_fillColor = gen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_fillColor');
        this.u_fillLinearGradient = gen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_fillLinearGradient[3]');
        // texture
        this.u_texRect = gen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_texRect');
        this.u_texOffset = gen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_texOffset');
        gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        // drawing type uniforms
        this.u_shapeType = gen.addFragmentUniform(GL_TYPE.INT,'u_shapeType');
        this.u_fillType = gen.addFragmentUniform(GL_TYPE.INT,'u_fillType');


        gen.setFragmentMainFn(fragmentSource);
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.primitive = new Plane();

        this.bufferInfo = new BufferInfo(gl,{
            posVertexInfo:{array: this.primitive.vertexArr,type:gl.FLOAT,size:2,attrName:this.a_position},
            posIndexInfo: {array: this.primitive.indexArr},
            //texVertexInfo: {array: this.primitive.texCoordArr, type: gl.FLOAT, size: 2, attrName: 'a_texCoord'},
            drawMethod: this.gl.TRIANGLE_STRIP
        } as BufferInfoDescription);
    }



}
