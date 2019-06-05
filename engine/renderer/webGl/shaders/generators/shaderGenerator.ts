import {normalizeUniformName} from "../../base/shaderProgramUtils";

interface IInfo {
    type: string;
    name: string;
}

export class ShaderGenerator {

    private vertexUniforms:IInfo[] = [];
    private fragmentUniforms:IInfo[] = [];
    private attributes:IInfo[] = [];
    private varyings:IInfo[] = [];
    private appendedFragCodeBlocks:string[] = [];
    private appendedVertexCodeBlocks:string[] = [];
    private prependedVertexCodeBlocks:string[] = [];
    private prependedFragCodeBlocks:string[] = [];
    private vertexMainFn:string = '';
    private fragmentMainFn:string = '';

    constructor(){}

    public addVertexUniform(type:string,name:string):string{
        this.vertexUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    public addFragmentUniform(type:string,name:string,extractArrayName:boolean = false):string{
        this.fragmentUniforms.push({type,name});
        name = normalizeUniformName(name);
        if (extractArrayName) name = name.split('[')[0];
        return name;
    }

    public addAttribute(type:string,name:string):string{
        this.attributes.push({type,name});
        return normalizeUniformName(name);
    }

    public addVarying(type:string,name:string):void{
        this.varyings.push({type,name});
    }

    public appendVertexCodeBlock(code:string):void{
        this.appendedVertexCodeBlocks.push(code);
    }

    public appendFragmentCodeBlock(code:string):void{
        this.appendedFragCodeBlocks.push(code);
    }

    public prependVertexCodeBlock(code:string):void{
        this.prependedVertexCodeBlocks.push(code);
    }

    public prependFragmentCodeBlock(code:string):void{
        this.prependedFragCodeBlocks.push(code);
    }

    public setVertexMainFn(fnCode:string):void{
        this.vertexMainFn = fnCode;
    }

    public setFragmentMainFn(fnCode:string):void{
        this.fragmentMainFn = fnCode;
    }

    public getVertexSource():string{
        return (


`
precision mediump float;

${this.prependedVertexCodeBlocks.map((v)=>`${v}`).join('\n')}

${this.vertexUniforms.map(  (u)=>`uniform   ${u.type} ${u.name};`).join('\n')}
${this.attributes.map(      (u)=>`attribute ${u.type} ${u.name};`).join('\n')}
${this.varyings.map(        (u)=>`varying   ${u.type} ${u.name};`).join('\n')}
${this.appendedVertexCodeBlocks.map((v)=>`${v}`).join('\n')}

${this.vertexMainFn}`);
    }

    public getFragmentSource():string{
        return (
// lowp, mediump, highp
`
precision mediump float;

${this.prependedFragCodeBlocks.map((v)=>`${v}`).join('\n')}

${this.fragmentUniforms.map((u)=>`uniform ${u.type} ${u.name};`).join('\n')}
${this.varyings.map(        (u)=>`varying ${u.type} ${u.name};`).join('\n')}
${this.appendedFragCodeBlocks.map((v)=>`${v}`).join('\n')}

${this.fragmentMainFn}
`);
    }

    public debug():void{
        if (!DEBUG) return;
        console.log('// *** vertex shader source ***');
        console.log(this.getVertexSource());
        console.log('// *** fragment shader source ***');
        console.log(this.getFragmentSource());
    }

}
