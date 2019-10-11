import {AbstractFilter} from "../abstract/abstractFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE, UNIFORM_VALUE_TYPE} from "../../base/shaderProgramUtils";
import {fragmentSource} from "@engine/renderer/webGl/filters/light/source/fragment.shader";
import {mainFnSource} from "@engine/renderer/webGl/filters/light/source/mainFn.shader";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {LightSet} from "@engine/light/lightSet";
import {FastMap} from "@engine/misc/collection/fastMap";


export class LightFilter extends AbstractFilter {

    private readonly uniformInfo:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();


    constructor(game:Game, private lightArray:LightSet) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const gen: ShaderGenerator = this.simpleRectDrawer.gen;
        gen.prependFragmentCodeBlock(fragmentSource);
        gen.addFragmentUniform("PointLight",'u_pointLights[MAX_NUM_OF_POINT_LIGHTS]');
        gen.addFragmentUniform("AmbientLight",'u_ambientLight');
        gen.addFragmentUniform("Material",'u_material');
        gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'normalTexture');
        gen.addFragmentUniform(GL_TYPE.BOOL,'u_useNormalMap');
        gen.addFragmentUniform(GL_TYPE.INT,'u_numOfPointLights');
        gen.setFragmentMainFn(mainFnSource);
        this.simpleRectDrawer.initProgram();
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        this.lightArray.setUniformsToMap(this.uniformInfo);
        this.simpleRectDrawer.setUniformsFromMap(this.uniformInfo);
        super.doFilter(destFrameBuffer);
    }



}