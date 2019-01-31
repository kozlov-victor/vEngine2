
import {Line} from '../../../primitives/line'
import {ShaderProgram} from '../../../base/shaderProgram'
import {BufferInfo} from "../../../base/bufferInfo";

import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {ColorShaderGenerator} from "../../../shaders/generators/impl/colorShaderGenerator";

export class LineDrawer extends AbstractDrawer { // todo is used???

    constructor(gl:WebGLRenderingContext){
        super(gl);
        let gen = new ColorShaderGenerator();
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.primitive = new Line();

        this.bufferInfo = new BufferInfo(gl,{
            posVertexInfo:{array: this.primitive.vertexArr,type:gl.FLOAT,size:2,attrName:'a_position'},
            drawMethod: this.gl.LINE_STRIP
        });
    }

}