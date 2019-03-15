
import {normalizeUniformName} from "../../base/shaderProgramUtils";

interface Info {
    type: string,
    name: string
}

export class ShaderGenerator {

    private vertexUniforms:Info[] = [];
    private fragmentUniforms:Info[] = [];
    private attributes:Info[] = [];
    private varyings:Info[] = [];
    private appendedFragCodeBlocks:string[] = [];
    private appendedVertexCodeBlocks:string[] = [];
    private prependedVertexCodeBlocks:string[] = [];
    private prependedFragCodeBlocks:string[] = [];
    private vertexMainFn:string = '';
    private fragmentMainFn:string = '';

    constructor(){}

    addVertexUniform(type:string,name:string){
        this.vertexUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    addFragmentUniform(type:string,name:string){
        this.fragmentUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    addAttribute(type:string,name:string){
        this.attributes.push({type,name});
        return normalizeUniformName(name);
    }

    addVarying(type:string,name:string){
        this.varyings.push({type,name});
    }

    appendVertexCodeBlock(code:string){
        this.appendedVertexCodeBlocks.push(code);
    }

    appendFragmentCodeBlock(code:string){
        this.appendedFragCodeBlocks.push(code);
    }

    prependVertexCodeBlock(code:string){
        this.prependedVertexCodeBlocks.push(code);
    }

    prependFragmentCodeBlock(code:string){
        this.prependedFragCodeBlocks.push(code);
    }

    setVertexMainFn(fnCode:string){
        this.vertexMainFn = fnCode;
        return this;
    }

    setFragmentMainFn(fnCode:string){
        this.fragmentMainFn = fnCode;
        return this;
    }

    getVertexSource():string{
        return (


`
${this.prependedVertexCodeBlocks.map(v=>`${v}`).join('\n')}

${this.vertexUniforms.map(  u=>`uniform   ${u.type} ${u.name};`).join('\n')}
${this.attributes.map(      u=>`attribute ${u.type} ${u.name};`).join('\n')}
${this.varyings.map(        u=>`varying   ${u.type} ${u.name};`).join('\n')}
${this.appendedVertexCodeBlocks.map(v=>`${v}`).join('\n')}

${this.vertexMainFn}`)
    }

    getFragmentSource():string{
        return (
// lowp, mediump, highp
`
precision mediump float;

${this.prependedFragCodeBlocks.map(v=>`${v}`).join('\n')}

${this.fragmentUniforms.map(u=>`uniform ${u.type} ${u.name};`).join('\n')}
${this.varyings.map(        u=>`varying ${u.type} ${u.name};`).join('\n')}
${this.appendedFragCodeBlocks.map(v=>`${v}`).join('\n')}

${this.fragmentMainFn}
`)
    }

    debug(){
        if (!DEBUG) return;
        console.log('// *** vertex shader source ***');
        console.log(this.getVertexSource());
        console.log('// *** fragment shader source ***');
        console.log(this.getFragmentSource());
    }

}
