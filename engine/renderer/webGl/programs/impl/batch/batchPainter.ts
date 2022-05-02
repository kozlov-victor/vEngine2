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

    private readonly NUM_OF_QUADS_IN_BATCH = 2;
    private currentModelIndex:number = 0;
    private readonly a_idx: string;
    private readonly a_color: string;
    private readonly a_transform: string;
    private dirty:boolean = false;

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

        const indexArray:number[] = [0,1,3,0,2,3,4,5,7,4,6,7];
        // for (let i=0;i<this.NUM_OF_QUADS_IN_BATCH;i+=4) {
        //     indexArray.push(...
        //         [
        //             i+0,
        //             i+1,
        //             i+3,
        //             i+0,
        //             i+2,
        //             i+3
        //         ]
        //     );
        // }
        console.log(indexArray);

        const vertexIdxArray = new Float32Array(4*1*this.NUM_OF_QUADS_IN_BATCH);
        // for (let i=0;i<4*vertexIdxArray.length;i+=4) {
        //     vertexIdxArray[i + 0] = 0;
        //     vertexIdxArray[i + 1] = 1;
        //     vertexIdxArray[i + 2] = 2;
        //     vertexIdxArray[i + 3] = 3;
        // }
        vertexIdxArray[0] = 0;
        vertexIdxArray[1] = 1;
        vertexIdxArray[2] = 2;
        vertexIdxArray[3] = 3;
        vertexIdxArray[4] = 0;
        vertexIdxArray[5] = 1;
        vertexIdxArray[6] = 2;
        vertexIdxArray[7] = 3;
        console.log(vertexIdxArray);

        const colorArray = new Float32Array(4*4*this.NUM_OF_QUADS_IN_BATCH);

        this.transformArray = new Float32Array(4*16*this.NUM_OF_QUADS_IN_BATCH);

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
        this.transformBuffer = this.bufferInfo.miscVertexBuffers[1];

    }

    public pushNextModel(model:RenderableModel):void {
        if (this.currentModelIndex===this.NUM_OF_QUADS_IN_BATCH) {
            this.flush();
        }
        const offset = this.currentModelIndex*16*4;
        this.transformArray.set(model.modelViewProjectionMatrix.mat16,offset+16*0);
        this.transformArray.set(model.modelViewProjectionMatrix.mat16,offset+16*1);
        this.transformArray.set(model.modelViewProjectionMatrix.mat16,offset+16*2);
        this.transformArray.set(model.modelViewProjectionMatrix.mat16,offset+16*3);
        this.currentModelIndex++;
        this.dirty = true;
    }

    public flush():void {
        if (!this.dirty) return;
        this.transformBuffer.updateDada(this.transformArray);
        this.draw();
        this.reset();
    }

    private reset():void {
        this.currentModelIndex = 0;
        this.dirty = false;
    }


}
