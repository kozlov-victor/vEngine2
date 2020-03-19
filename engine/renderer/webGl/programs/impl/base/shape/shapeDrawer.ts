import {ShaderProgram} from "../../../../base/shaderProgram";
import {AbstractDrawer} from "../../../abstract/abstractDrawer";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../../base/bufferInfo";
import {Plane} from "../../../../primitives/plane";
import {GL_TYPE} from "../../../../base/shaderProgramUtils";
import {ShaderGenerator} from "../../../../shaders/generators/shaderGenerator";
import * as fragmentSource from "./shape.fragment.glsl";
import {parametrizeString} from "@engine/misc/object";
import {STRETCH_MODE} from "@engine/renderable/impl/general/image";

export const enum SHAPE_TYPE {
    ELLIPSE,RECT
}

export const enum FILL_TYPE {
    COLOR,TEXTURE,LINEAR_GRADIENT
}

export class ShapeDrawer extends AbstractDrawer {

    public readonly u_vertexMatrix:string;
    public readonly a_position:string;
    public readonly u_lineWidth:string;
    public readonly u_rx:string;
    public readonly u_ry:string;
    public readonly u_width:string;
    public readonly u_height:string;
    public readonly u_borderRadius:string;
    public readonly u_color:string;
    public readonly u_alpha:string;
    public readonly u_fillLinearGradient:string;
    public readonly u_fillColor:string;
    public readonly u_shapeType:string;
    public readonly u_fillType:string;
    public readonly u_texRect:string;
    public readonly u_texOffset:string;
    public readonly u_rectOffsetTop: string;
    public readonly u_rectOffsetLeft: string;
    public readonly u_repeatFactor:string;
    public readonly u_stretchMode:string;
    public readonly u_arcAngleFrom:string;
    public readonly u_arcAngleTo:string;
    public readonly u_anticlockwise:string;

    constructor(gl:WebGLRenderingContext){
        super(gl);
        const gen:ShaderGenerator = new ShaderGenerator();
        gen.setVertexMainFn(MACRO_GL_COMPRESS`
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
        this.u_lineWidth = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_lineWidth');
        this.u_rx = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_rx');
        this.u_ry = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_ry');
        this.u_width = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_width');
        this.u_height = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_height');
        this.u_rectOffsetTop = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_rectOffsetTop');
        this.u_rectOffsetLeft = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_rectOffsetLeft');
        this.u_borderRadius = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_borderRadius');
        // color and texture data uniforms
        this.u_color = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_color');
        this.u_alpha = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        this.u_fillColor = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_fillColor');
        this.u_fillLinearGradient = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_fillLinearGradient[3]',true);
        // texture
        this.u_texRect = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_texRect');
        this.u_texOffset = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_texOffset');
        gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        // drawing type uniforms
        this.u_shapeType = gen.addScalarFragmentUniform(GL_TYPE.INT,'u_shapeType');
        this.u_fillType = gen.addScalarFragmentUniform(GL_TYPE.INT,'u_fillType');
        // ellipse arc angles
        this.u_arcAngleFrom = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_arcAngleFrom');
        this.u_arcAngleTo   = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_arcAngleTo');
        // repeat texture (aka tiled image)
        this.u_repeatFactor = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_repeatFactor');
        this.u_stretchMode = gen.addScalarFragmentUniform(GL_TYPE.INT,'u_stretchMode');
        this.u_anticlockwise = gen.addScalarFragmentUniform(GL_TYPE.BOOL,'u_anticlockwise');

        gen.setFragmentMainFn(parametrizeString(fragmentSource,{
            __STRETCH_MODE_STRETCH__:       STRETCH_MODE.STRETCH,
            __STRETCH_MODE_REPEAT__:        STRETCH_MODE.REPEAT,
            __FILL_TYPE_COLOR__:            FILL_TYPE.COLOR,
            __FILL_TYPE_TEXTURE__:          FILL_TYPE.TEXTURE,
            __FILL_TYPE_LINEAR_GRADIENT__:  FILL_TYPE.LINEAR_GRADIENT,
            __SHAPE_TYPE_ELLIPSE__:         SHAPE_TYPE.ELLIPSE,
            __SHAPE_TYPE_RECT__:            SHAPE_TYPE.RECT,
            __PI__:                         Math.PI,
        }));
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.primitive = new Plane();

        this.bufferInfo = new BufferInfo(gl,{
            posVertexInfo:{array: this.primitive.vertexArr,type:gl.FLOAT,size:2,attrName:this.a_position},
            posIndexInfo: {array: this.primitive.indexArr},
            drawMethod: DRAW_METHOD.TRIANGLE_STRIP,
        } as IBufferInfoDescription);
    }



}
