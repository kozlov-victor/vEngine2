import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

export class TileMapDrawer extends SimpleRectDrawer {

    private readonly u_tileSize:string;
    private readonly tileSize:[number,number] = [0,0];

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen:ShaderGenerator = this.gen;
        this.u_tileSize = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'u_tileSize');
        //language=GLSL
        gen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec2 tileCoord = mod(v_texCoord,u_tileSize);
                gl_FragColor = texture2D(texture, tileCoord);
            }
        `);
    }

    public setTileSize(width:number,height:number):void{
        this.tileSize[0] = width;
        this.tileSize[1] = height;
        this.setUniform(this.u_tileSize,this.tileSize);
    }



}
