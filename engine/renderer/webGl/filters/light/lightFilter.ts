import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE, UNIFORM_VALUE_TYPE} from "../../base/shaderProgramUtils";
import {fragmentSource} from "@engine/renderer/webGl/filters/light/shader/fragment.shader";
import {mainFnSource} from "@engine/renderer/webGl/filters/light/shader/mainFn.shader";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {LightSet} from "@engine/light/lightSet";
import {FastMap} from "@engine/misc/collection/fastMap";
import {ITexture} from "@engine/renderer/common/texture";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Optional} from "@engine/core/declarations";


export class LightFilter extends AbstractGlFilter {

    private readonly uniformInfo:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();

    private readonly u_useNormalMap:string;
    private readonly normalTexture:string;

    private normalMap:Optional<Texture>;


    constructor(game:Game, private lightArray:LightSet) {
        super(game);
        const gen: ShaderGenerator = this.simpleRectDrawer.gen;
        gen.prependFragmentCodeBlock(fragmentSource);
        gen.addFragmentUniform("PointLight",'u_pointLights[MAX_NUM_OF_POINT_LIGHTS]');
        gen.addFragmentUniform("AmbientLight",'u_ambientLight');
        gen.addFragmentUniform("Material",'u_material');
        this.normalTexture = gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'normalTexture');
        this.u_useNormalMap = gen.addFragmentUniform(GL_TYPE.BOOL,'u_useNormalMap');
        gen.addFragmentUniform(GL_TYPE.INT,'u_numOfPointLights');
        gen.setFragmentMainFn(mainFnSource);
        this.simpleRectDrawer.initProgram();
    }

    public setNormalMap(normalMap:Texture){
        this.normalMap = normalMap;
    }

    public unsetNormalMap(){
        this.normalMap = undefined;
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        this.lightArray.setUniformsToMap(this.uniformInfo);
        this.simpleRectDrawer.setUniformsFromMap(this.uniformInfo);
        const useNormalMap:boolean = this.normalMap!==undefined;
        this.simpleRectDrawer.setUniform(this.u_useNormalMap,useNormalMap);
        if (useNormalMap) {
            this.simpleRectDrawer.attachTexture(this.normalTexture,this.normalMap!);
        }
        super.doFilter(destFrameBuffer);
    }



}