import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {ShaderProgram} from "@engine/renderer/webGl/base/shaderProgram";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/bufferInfo";

import * as batchVertexSource from "@engine/renderer/webGl/programs/impl/batch/batch.vertex.glsl";
import * as batchFragmentSource from "@engine/renderer/webGl/programs/impl/batch/batch.fragment.glsl";
import {VertexBuffer} from "@engine/renderer/webGl/base/vertexBuffer";
import {Point2d} from "@engine/geometry/point2d";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Size} from "@engine/geometry/size";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {Color} from "@engine/renderer/common/color";

// http://tmtg.nl/glesjs/glesjs-demo/game.js

export class BatchPainter extends AbstractPainter {

    private readonly NUM_OF_QUADS_IN_BATCH = 8000; // max is 65535/4
    private currentModelIndex:number = 0;
    private readonly a_idx: string;
    private readonly a_color: string;
    private readonly a_angle: string;
    private readonly a_pos: string;
    private readonly u_viewPort: string;
    private dirty:boolean = false;

    private readonly colorArray:Float32Array;
    private readonly colorBuffer:VertexBuffer;

    private readonly angleArray:Float32Array;
    private readonly angleBuffer:VertexBuffer;

    private readonly posArray:Float32Array;
    private readonly posBuffer:VertexBuffer;


    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen: ShaderGenerator = new ShaderGenerator();

        this.u_viewPort =gen.addVertexUniform(GL_TYPE.FLOAT_VEC2,'u_viewPort');
        this.a_idx = gen.addAttribute(GL_TYPE.FLOAT,'a_idx');
        this.a_color = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_color');
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
        for (let i=0;i<4*this.NUM_OF_QUADS_IN_BATCH;i+=4) {
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

        const vertexIdxArray = new Float32Array(4*1*this.NUM_OF_QUADS_IN_BATCH);
        for (let i=0;i<vertexIdxArray.length;i+=4) {
            vertexIdxArray[i    ] = 0;
            vertexIdxArray[i + 1] = 1;
            vertexIdxArray[i + 2] = 2;
            vertexIdxArray[i + 3] = 3;
        }

        this.colorArray     = new Float32Array(4*4*this.NUM_OF_QUADS_IN_BATCH);
        this.angleArray     = new Float32Array(4  *this.NUM_OF_QUADS_IN_BATCH);
        this.posArray       = new Float32Array(4*4*this.NUM_OF_QUADS_IN_BATCH);


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
                    array:this.colorArray, type:gl.FLOAT,
                    size:4, attrName:this.a_color,
                },
                {
                    array:this.angleArray, type:gl.FLOAT,
                    size:1, attrName:this.a_angle,
                },
                {
                    array:this.posArray, type:gl.FLOAT,
                    size:4, attrName:this.a_pos,
                },
            ],
            drawMethod:DRAW_METHOD.TRIANGLES
        };
        this.bufferInfo     = new BufferInfo(this.gl,bufferInfoDesc);

        this.colorBuffer    = this.bufferInfo.miscVertexBuffers[0];
        this.angleBuffer    = this.bufferInfo.miscVertexBuffers[1];
        this.posBuffer      = this.bufferInfo.miscVertexBuffers[2];

    }

    private putNextColor(color:Color):void {
        const size = 4;
        let offset = this.currentModelIndex*size*4;
        for (let i=0;i<4;i++) {
            const colorArray = color.asGL();
            this.colorArray[offset  ] = colorArray[0];
            this.colorArray[offset+1] = colorArray[1];
            this.colorArray[offset+2] = colorArray[2];
            this.colorArray[offset+3] = colorArray[3];
            offset+=size;
        }
    }

    private putNextAngle(angle:number):void {
        const size = 1;
        let offset = this.currentModelIndex*size*4;
        for (let i=0;i<4;i++) {
            this.angleArray[offset] = angle;
            this.angleArray[offset+1] = angle;
            offset+=size;
        }
    }

    private putNextPos(modelPos:Point2d,modelSize:Size):void {
        const size = 4;
        let offset = this.currentModelIndex*size*4;
        for (let i=0;i<4;i++) {
            this.posArray[offset  ] = modelPos.x;
            this.posArray[offset+1] = modelPos.y;
            this.posArray[offset+2] = modelSize.width;
            this.posArray[offset+3] = modelSize.height;
            offset+=size;
        }
    }


    public pushNextModel(model:BatchedImage,renderer:WebGlRenderer):void {
        if (this.currentModelIndex===this.NUM_OF_QUADS_IN_BATCH) {
            this.flush(renderer);
        }
        this.putNextColor(model.fillColor);
        this.putNextAngle(model.angle);
        this.putNextPos(model.pos,model.size);
        this.currentModelIndex++;
        this.dirty = true;
    }

    public flush(renderer:WebGlRenderer):void {
        if (!this.dirty) return;
        const viewPortSize =
            (renderer.getRenderTarget().getTexture() as Texture).size.toArray();
        this.setUniform(this.u_viewPort,viewPortSize);
        this.colorBuffer.updateData(this.colorArray);
        this.angleBuffer.updateData(this.angleArray);
        this.posBuffer.updateData(this.posArray);
        this.draw();
        this.reset();
    }

    private reset():void {
        this.currentModelIndex = 0;
        this.colorArray.fill(0);
        this.dirty = false;
    }

}
