import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE, UNIFORM_VALUE_TYPE} from "../../base/shaderProgramUtils";
import {structures} from "@engine/renderer/webGl/filters/light/shader/fragment-structures.shader";
import {functions} from "@engine/renderer/webGl/filters/light/shader/fragment-functions.shader";
import {mainFnSource} from "@engine/renderer/webGl/filters/light/shader/mainFn.shader";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {LightSet} from "@engine/light/lightSet";
import {FastMap} from "@engine/misc/collection/fastMap";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Optional} from "@engine/core/declarations";


export class LightFilter extends AbstractGlFilter {

    private readonly uniformInfo:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();

    private readonly u_useNormalMap:string;
    private readonly normalTexture:string;
    private readonly u_dimension:string;
    //private readonly size:[number,number] = [0,0];

    private normalMap:Optional<Texture>;


    constructor(game:Game, private lightArray:LightSet) {
        super(game);
        const gen: ShaderGenerator = this.simpleRectDrawer.gen;
        gen.prependFragmentCodeBlock(structures);
        gen.appendFragmentCodeBlock(functions);
        gen.addStructFragmentUniform("PointLight",'u_pointLights[MAX_NUM_OF_POINT_LIGHTS]');
        gen.addStructFragmentUniform("AmbientLight",'u_ambientLight');
        gen.addStructFragmentUniform("Material",'u_material');
        this.normalTexture = gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'normalTexture');
        this.u_useNormalMap = gen.addScalarFragmentUniform(GL_TYPE.BOOL,'u_useNormalMap');
        this.u_dimension = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_dimension');
        gen.addScalarFragmentUniform(GL_TYPE.INT,'u_numOfPointLights');
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
        //const size:ISize = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        // this.size[0] = size.width;
        // this.size[1] = size.height;
        //this.simpleRectDrawer.setUniform(this.u_dimension,this.size);
        super.doFilter(destFrameBuffer);
    }



}
