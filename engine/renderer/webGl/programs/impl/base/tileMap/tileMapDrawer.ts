import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {SimpleRectDrawer} from "@engine/renderer/webGl/programs/impl/base/simpleRect/simpleRectDrawer";

export class TileMapDrawer extends SimpleRectDrawer {


    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen:ShaderGenerator = new ShaderGenerator();
        //language=GLSL
        gen.setFragmentMainFn(MACRO_GL_COMPRESS`            
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
            }
        `);

    }



}