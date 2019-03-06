

import {Plane} from '../../../primitives/plane'
import {ShaderProgram} from '../../../base/shaderProgram'
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, BufferInfoDescription} from "../../../base/bufferInfo";
import {TexShaderGenerator} from "../../../shaders/generators/impl/texShaderGenerator";

export class SimpleRectDrawer extends AbstractDrawer { // todo is used????

    constructor(gl:WebGLRenderingContext,program?:ShaderProgram) {
        super(gl);
        let gen = new TexShaderGenerator();
        this.primitive = new Plane();
        this.program = program || new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.bufferInfo = new BufferInfo(gl, {
            posVertexInfo: {array: this.primitive.vertexArr, type: gl.FLOAT, size: 2, attrName: 'a_position'},
            posIndexInfo: {array: this.primitive.indexArr},
            texVertexInfo: {array: this.primitive.texCoordArr, type: gl.FLOAT, size: 2, attrName: 'a_texCoord'},
            drawMethod: this.gl.TRIANGLE_STRIP
        } as BufferInfoDescription);
    }


}