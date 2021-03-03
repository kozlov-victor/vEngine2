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
import {ITexture} from "@engine/renderer/common/texture";


export class LightFilter extends AbstractGlFilter {

    private readonly _uniformInfo:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();

    private readonly _u_useNormalMap:string;
    private readonly _normalTexture:string;
    private readonly _u_dimension:string;

    private normalMap:Optional<ITexture>;


    constructor(game:Game, private lightArray:LightSet) {
        super(game);
        const gen: ShaderGenerator = this.simpleRectDrawer.gen;
        gen.prependFragmentCodeBlock(structures);
        gen.appendFragmentCodeBlock(functions);
        gen.addStructFragmentUniform("PointLight",'u_pointLights[MAX_NUM_OF_POINT_LIGHTS]');
        gen.addStructFragmentUniform("AmbientLight",'u_ambientLight');
        gen.addStructFragmentUniform("Material",'u_material');
        this._normalTexture = gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'normalTexture');
        this._u_useNormalMap = gen.addScalarFragmentUniform(GL_TYPE.BOOL,'u_useNormalMap');
        this._u_dimension = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_dimension');
        gen.addScalarFragmentUniform(GL_TYPE.INT,'u_numOfPointLights');
        gen.setFragmentMainFn(mainFnSource);
        this.simpleRectDrawer.initProgram();
    }

    public setNormalMap(normalMap:ITexture):void{
        this.normalMap = normalMap;
    }

    public unsetNormalMap():void{
        this.normalMap = undefined;
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        this.lightArray.setUniformsToMap(this._uniformInfo);
        this.simpleRectDrawer.setUniformsFromMap(this._uniformInfo);
        const useNormalMap:boolean = this.normalMap!==undefined;
        this.simpleRectDrawer.setUniform(this._u_useNormalMap,useNormalMap);
        if (useNormalMap) {
            this.simpleRectDrawer.attachTexture(this._normalTexture,this.normalMap! as Texture);
        }
        super.doFilter(destFrameBuffer);
    }



}
