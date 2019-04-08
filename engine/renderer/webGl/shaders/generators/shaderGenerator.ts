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

    addVertexUniform(type:string,name:string):string{
        this.vertexUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    addFragmentUniform(type:string,name:string):string{
        this.fragmentUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    addAttribute(type:string,name:string):string{
        this.attributes.push({type,name});
        return normalizeUniformName(name);
    }

    addVarying(type:string,name:string):void{
        this.varyings.push({type,name});
    }

    appendVertexCodeBlock(code:string):void{
        this.appendedVertexCodeBlocks.push(code);
    }

    appendFragmentCodeBlock(code:string):void{
        this.appendedFragCodeBlocks.push(code);
    }

    prependVertexCodeBlock(code:string):void{
        this.prependedVertexCodeBlocks.push(code);
    }

    prependFragmentCodeBlock(code:string):void{
        this.prependedFragCodeBlocks.push(code);
    }

    setVertexMainFn(fnCode:string):void{
        this.vertexMainFn = fnCode;
    }

    setFragmentMainFn(fnCode:string):void{
        this.fragmentMainFn = fnCode;
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

    debug():void{
        if (!DEBUG) return;
        console.log('// *** vertex shader source ***');
        console.log(this.getVertexSource());
        console.log('// *** fragment shader source ***');
        console.log(this.getFragmentSource());
    }

}
