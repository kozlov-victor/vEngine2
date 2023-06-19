import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE, UNIFORM_VALUE_TYPE} from "../../base/program/shaderProgramUtils";
import {LightSet} from "@engine/lighting/lightSet";
import {FastMap} from "@engine/misc/collection/fastMap";
import {Optional} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {light2dShader} from "@engine/renderer/webGl/filters/light/shader/light2dShader";
import {Light2dShaderFunctions} from "@engine/renderer/webGl/filters/light/shader/light2dShaderFunctions";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";


export class LightFilter extends AbstractGlFilter {

    private readonly _uniformInfo:FastMap<string,UNIFORM_VALUE_TYPE> = new FastMap();

    private readonly _u_useNormalMap:string;
    private readonly _normalTexture:string;
    private readonly _u_dimension:string;

    private normalMap:Optional<ITexture>;
    private _dimension = new Float32Array([0,0]);


    constructor(game:Game, private lightSet:LightSet) {
        super(game);
        const gen: ShaderGenerator = this.simpleRectPainter.gen;
        gen.addStructFragmentUniform("PointLight",`u_pointLights[${lightSet.getSize()}]`);
        gen.addStructFragmentUniform("AmbientLight",'u_ambientLight');
        this._normalTexture = gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'normalTexture');
        this._u_useNormalMap = gen.addScalarFragmentUniform(GL_TYPE.BOOL,'u_useNormalMap');
        this._u_dimension = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_dimension');
        gen.prependFragmentCodeBlock(Light2dShaderFunctions);
        gen.setFragmentMainFn(light2dShader(lightSet.getSize()));
        this.simpleRectPainter.initProgram();
    }

    public setNormalMap(normalMap:ITexture):void{
        this.normalMap = normalMap;
    }

    public unsetNormalMap():void{
        this.normalMap = undefined;
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        this._dimension[0] = destFrameBuffer.getTexture().size.width;
        this._dimension[1] = destFrameBuffer.getTexture().size.height;
        this.setUniform(this._u_dimension,this._dimension);

        this.lightSet.setUniformsToMap(this._uniformInfo);
        this.simpleRectPainter.setUniformsFromMap(this._uniformInfo);
        const useNormalMap:boolean = this.normalMap!==undefined;
        this.simpleRectPainter.setUniform(this._u_useNormalMap,useNormalMap);
        if (useNormalMap) {
            this.simpleRectPainter.attachTexture(this._normalTexture,this.normalMap! as Texture);
        }
        super.doFilter(destFrameBuffer);
    }



}
