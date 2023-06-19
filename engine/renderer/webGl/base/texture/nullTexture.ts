
import {ShaderProgram} from "@engine/renderer/webGl/base/program/shaderProgram";
import {AbstractTexture} from "@engine/renderer/webGl/base/abstract/abstractTexture";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";

export class NullTexture extends Texture {

    public override bind(name: string, i: number, program: ShaderProgram) {
        if (
            AbstractTexture.currentBindTextureAt[i]!==undefined &&
            AbstractTexture.currentBindTextureAt[i].type==='Texture'
        ) {
            return;
        }
        super.bind(name, i, program);
    }
}
