import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {ShaderProgram} from "@engine/renderer/webGl/base/shaderProgram";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/bufferInfo";

import * as batchVertexSource from "@engine/renderer/webGl/programs/impl/batch/batch.vertex.glsl";
import * as batchFragmentSource from "@engine/renderer/webGl/programs/impl/batch/batch.fragment.glsl";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {VertexBuffer} from "@engine/renderer/webGl/base/vertexBuffer";

// http://tmtg.nl/glesjs/glesjs-demo/game.js

export class BatchPainter extends AbstractPainter {

    private readonly NUM_OF_QUADS_IN_BATCH = 1;
    private readonly a_idx: string;
    private readonly a_color: string;
    private readonly a_transform: string;

    private readonly transformArray:Float32Array;
    private readonly transformBuffer:VertexBuffer;


    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen: ShaderGenerator = new ShaderGenerator();

        this.a_idx = gen.addAttribute(GL_TYPE.FLOAT,'a_idx');
        this.a_color = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_color');
        this.a_transform = gen.addAttribute(GL_TYPE.FLOAT_MAT4,'a_transform');
        //this.u_textureMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        gen.addVarying(GL_TYPE.FLOAT_VEC4,'v_color');
        gen.setVertexMainFn(batchVertexSource);
        gen.setFragmentMainFn(batchFragmentSource);
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );

        const indexArray = [
            // quad
            0, 1, 3, 0, 2, 3,
        ];

        const vertexIdxArray = new Float32Array([
            // quad
            0, 1, 2, 3,
        ]);
        const colorArray = new Float32Array([
            // quad
            0.5,0.6,0.7,1,
            0.5,0.6,0.7,1,
            0.5,0.6,0.7,1,
            0.5,0.6,0.7,1,
        ]);

        this.transformArray = new Float32Array([
            0.38109755516052246, 0., 0., 0., 0., 1.6129032373428345, 0., 0., 0., 0., -0.0010000000474974513, 0., -0.9847561120986938, -1.454838752746582, 0., 1.,
            0.38109755516052246, 0., 0., 0., 0., 1.6129032373428345, 0., 0., 0., 0., -0.0010000000474974513, 0., -0.9847561120986938, -1.454838752746582, 0., 1.,
            0.38109755516052246, 0., 0., 0., 0., 1.6129032373428345, 0., 0., 0., 0., -0.0010000000474974513, 0., -0.9847561120986938, -1.454838752746582, 0., 1.,
            0.38109755516052246, 0., 0., 0., 0., 1.6129032373428345, 0., 0., 0., 0., -0.0010000000474974513, 0., -0.9847561120986938, -1.454838752746582, 0., 1.,
        ]);

        const bufferInfoDesc:IBufferInfoDescription = {
            posIndexInfo: {
                array: indexArray,
            },
            posVertexInfo:{
                array:vertexIdxArray, type:gl.FLOAT,
                size:1, attrName:this.a_idx,
            },
            miscBuffersInfo: [
                {
                    array:colorArray, type:gl.FLOAT,
                    size:4, attrName:this.a_color,
                },
                {
                    array:this.transformArray, type:gl.FLOAT,
                    size:16, attrName:this.a_transform,
                }
            ],
            drawMethod:DRAW_METHOD.TRIANGLES
        };
        this.bufferInfo = new BufferInfo(this.gl,bufferInfoDesc);
        this.transformBuffer = this.bufferInfo.miscVertexBuffers[0];

    }

    public pushNextModel(model:RenderableModel):void {
        this.transformArray.set(model.worldTransformMatrix.mat16);
        this.transformArray.set(model.worldTransformMatrix.mat16,16);
        this.transformArray.set(model.worldTransformMatrix.mat16,16*2);
        this.transformArray.set(model.worldTransformMatrix.mat16,16*3);
    }


    public flush():void {
        this.transformBuffer.updateDada(this.transformArray);
        this.draw();
    }


}
