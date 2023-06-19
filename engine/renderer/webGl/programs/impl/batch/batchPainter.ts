import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {ShaderProgram} from "@engine/renderer/webGl/base/program/shaderProgram";

import * as batchVertexSource from "@engine/renderer/webGl/programs/impl/batch/shaders/batch.vertex.glsl";
import * as batchFragmentSource from "@engine/renderer/webGl/programs/impl/batch/shaders/batch.fragment.glsl";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {ColorBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/colorBatchArray";
import {AngleBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/angleBatchArray";
import {PosBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/posBatchArray";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/buffer/bufferInfo";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";

// http://tmtg.nl/glesjs/glesjs-demo/game.js

export class BatchPainter extends AbstractPainter {

    public static readonly NUM_OF_QUADS_IN_BATCH = 8000;
    private currentModelIndex:number = 0;
    private readonly a_idx: string;
    private readonly a_color: string;
    private readonly a_angle: string;
    private readonly a_pos: string;
    private readonly u_viewPort: string;
    private dirty:boolean = false;

    private readonly colorBatchArray:ColorBatchArray;
    private readonly angleBatchArray:AngleBatchArray;
    private readonly posBatchArray:PosBatchArray;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen: ShaderGenerator = new ShaderGenerator();

        this.u_viewPort =gen.addVertexUniform(GL_TYPE.FLOAT_VEC2,'u_viewPort');
        this.a_idx = gen.addAttribute(GL_TYPE.FLOAT,'a_idx');
        this.a_color = gen.addAttribute(GL_TYPE.FLOAT_VEC2,'a_color');
        this.a_angle = gen.addAttribute(GL_TYPE.FLOAT,'a_angle');
        this.a_pos = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_pos');
        gen.addVarying(GL_TYPE.FLOAT_VEC4,'v_color');
        gen.setVertexMainFn(batchVertexSource);
        gen.setFragmentMainFn(batchFragmentSource);
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );

        const indexArray:number[] = [];
        for (let i=0;i<4*BatchPainter.NUM_OF_QUADS_IN_BATCH;i+=4) {
            indexArray.push(...
                [
                    i  ,
                    i+1,
                    i+3,
                    i  ,
                    i+2,
                    i+3
                ]
            );
        }

        const vertexIdxArray = new Float32Array(4*1*BatchPainter.NUM_OF_QUADS_IN_BATCH);
        for (let i=0;i<vertexIdxArray.length;i+=4) {
            vertexIdxArray[i    ] = 0;
            vertexIdxArray[i + 1] = 1;
            vertexIdxArray[i + 2] = 2;
            vertexIdxArray[i + 3] = 3;
        }

        this.colorBatchArray = new ColorBatchArray();
        this.angleBatchArray = new AngleBatchArray();
        this.posBatchArray = new PosBatchArray();

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
                    array:this.colorBatchArray.getArray(), type:gl.FLOAT,
                    size:2, attrName:this.a_color,
                },
                {
                    array:this.angleBatchArray.getArray(), type:gl.FLOAT,
                    size:1, attrName:this.a_angle,
                },
                {
                    array:this.posBatchArray.getArray(), type:gl.FLOAT,
                    size:4, attrName:this.a_pos,
                },
            ],
            drawMethod:DRAW_METHOD.TRIANGLES
        };
        this.bufferInfo = new BufferInfo(this.gl,bufferInfoDesc);

        this.colorBatchArray.setVertexBuffer(this.bufferInfo.miscVertexBuffers[0]);
        this.angleBatchArray.setVertexBuffer(this.bufferInfo.miscVertexBuffers[1]);
        this.posBatchArray.setVertexBuffer(this.bufferInfo.miscVertexBuffers[2]);

    }

    public putNextModel(model:BatchedImage, renderer:WebGlRenderer):void {
        if (this.currentModelIndex===BatchPainter.NUM_OF_QUADS_IN_BATCH) {
            this.flush(renderer);
        }
        const index = this.currentModelIndex;
        this.colorBatchArray.putNextChunk(model.fillColor,index);
        this.angleBatchArray.putNextChunk(model.angle,index);
        this.posBatchArray.putNextChunk(model,index);
        ++this.currentModelIndex;
        this.dirty = true;
    }

    public flush(renderer:WebGlRenderer):void {
        if (!this.dirty) return;
        const viewPortSize =
            (renderer.getRenderTarget().getTexture() as Texture).size.toArray();
        this.setUniform(this.u_viewPort,viewPortSize);
        this.colorBatchArray.uploadToVertexBuffer();
        this.colorBatchArray.clearUnused();
        this.angleBatchArray.uploadToVertexBuffer();
        this.posBatchArray.uploadToVertexBuffer();
        this.draw();
        this.currentModelIndex = 0;
        this.dirty = false;
    }

    public isDirty():boolean {
        return this.dirty;
    }

}
