import {AbstractFilter} from "../abstract/abstractFilter";
import {Game} from "@engine/game";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE, UNIFORM_VALUE_TYPE} from "../../base/shaderProgramUtils";
import {fragmentSource} from "@engine/renderer/webGl/filters/light/source/fragment.shader";
import {mainFnSource} from "@engine/renderer/webGl/filters/light/source/mainFn.shader";
import {IKeyVal} from "@engine/misc/object";
import {TextureInfo} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {LightArray} from "@engine/light/lightArray";


export class LightFilter extends AbstractFilter {

    private readonly uniformInfo:IKeyVal<UNIFORM_VALUE_TYPE> = {};


    constructor(game:Game, private lightArray:LightArray) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const gen: ShaderGenerator = this.simpleRectDrawer.gen;
        gen.prependFragmentCodeBlock(fragmentSource);
        // program normal map gen 2 * (color - vec3(0.5))
        gen.addFragmentUniform("PointLight",'u_pointLights[NUM_OF_LIGHT_IN_VIEW]');
        gen.addFragmentUniform("AmbientLight",'u_ambientLight');
        gen.addFragmentUniform("Material",'u_material');
        gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'normalTexture');
        gen.addFragmentUniform(GL_TYPE.BOOL,'u_useNormalMap');
        //language=GLSL
        gen.setFragmentMainFn(mainFnSource);
        this.simpleRectDrawer.initProgram();
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer):void{
        this.lightArray.setUniformsToBatch(this.uniformInfo);
        this.simpleRectDrawer.setUniformsFromBatch(this.uniformInfo);
        super.doFilter(textureInfos,destFrameBuffer);
    }



}