
import {normalizeUniformName} from "../../base/shaderProgramUtils";


export class ShaderGenerator {

    private vertexUniforms:any[] = [];
    private fragmentUniforms:any[] = [];
    private attributes:any[] = [];
    private varyings:any[] = [];
    private appendedFragCodeBlocks:any[] = [];
    private appendedVertexCodeBlocks:any[] = [];
    private prependedVertexCodeBlocks:any[] = [];
    private prependedFragCodeBlocks:any[] = [];
    private vertexMainFn:string = '';
    private fragmentMainFn:string = '';

    constructor(){}

    addVertexUniform(type:string,name:string){
        this.vertexUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    addFragmentUniform(type,name){
        this.fragmentUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    addAttribute(type,name){
        this.attributes.push({type,name});
        return normalizeUniformName(name);
    }

    addVarying(type,name){
        this.varyings.push({type,name});
    }

    appendVertexCodeBlock(code){
        this.appendedVertexCodeBlocks.push(code);
    }

    appendFragmentCodeBlock(code){
        this.appendedFragCodeBlocks.push(code);
    }

    prependVertexCodeBlock(code){
        this.prependedVertexCodeBlocks.push(code);
    }

    prependFragmentCodeBlock(code){
        this.prependedFragCodeBlocks.push(code);
    }

    setVertexMainFn(fnCode){
        this.vertexMainFn = fnCode;
        return this;
    }

    setFragmentMainFn(fnCode){
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
