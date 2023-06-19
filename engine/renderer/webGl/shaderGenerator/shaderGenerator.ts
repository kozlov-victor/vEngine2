import {GL_TYPE, normalizeUniformName} from "../base/program/shaderProgramUtils";

interface IInfo {
    type: string;
    name: string;
}

export class ShaderGenerator {

    private _vertexUniforms:IInfo[] = [];
    private _fragmentUniforms:IInfo[] = [];
    private _attributes:IInfo[] = [];
    private _varyings:IInfo[] = [];
    private _appendedFragCodeBlocks:string[] = [];
    private _appendedVertexCodeBlocks:string[] = [];
    private _prependedVertexCodeBlocks:string[] = [];
    private _prependedFragCodeBlocks:string[] = [];
    private _vertexMainFn:string = '';
    private _fragmentMainFn:string = '';

    constructor(){}

    public addVertexUniform(type:string,name:string):string{
        this._vertexUniforms.push({type,name});
        return normalizeUniformName(name);
    }

    public addScalarFragmentUniform(type:GL_TYPE, name:string, extractArrayName:boolean = false):string{
        return this._addFragmentUniform(type,name,extractArrayName);
    }

    public addStructFragmentUniform(strucName:string,uniformName:string, extractArrayName:boolean = false):string{
        return this._addFragmentUniform(strucName,uniformName,extractArrayName);
    }

    public addAttribute(type:string,name:string):string{
        this._attributes.push({type,name});
        return normalizeUniformName(name);
    }

    public addVarying(type:string,name:string):void{
        this._varyings.push({type,name});
    }

    public appendVertexCodeBlock(code:string):void{
        this._appendedVertexCodeBlocks.push(code);
    }

    public appendFragmentCodeBlock(code:string):void{
        this._appendedFragCodeBlocks.push(code);
    }

    public prependVertexCodeBlock(code:string):void{
        this._prependedVertexCodeBlocks.push(code);
    }

    public prependFragmentCodeBlock(code:string):void{
        this._prependedFragCodeBlocks.push(code);
    }

    public setVertexMainFn(fnCode:string):void{
        this._vertexMainFn = fnCode;
    }

    public setFragmentMainFn(fnCode:string):void{
        this._fragmentMainFn = fnCode;
    }

    public getVertexSource():string{
        return (


`
precision mediump float;

${this._prependedVertexCodeBlocks.map((v)=>`${v}`).join('\n')}

${this._vertexUniforms.map(  (u)=>`uniform   ${u.type} ${u.name};`).join('\n')}
${this._attributes.map(      (u)=>`attribute ${u.type} ${u.name};`).join('\n')}
${this._varyings.map(        (u)=>`varying   ${u.type} ${u.name};`).join('\n')}
${this._appendedVertexCodeBlocks.map((v)=>`${v}`).join('\n')}

${this._vertexMainFn}`);
    }

    public getFragmentSource():string{
        return (
// lowp, mediump, highp
`
precision mediump float;

${this._prependedFragCodeBlocks.map((v)=>`${v}`).join('\n')}

${this._fragmentUniforms.map((u)=>`uniform ${u.type} ${u.name};`).join('\n')}
${this._varyings.map(        (u)=>`varying ${u.type} ${u.name};`).join('\n')}
${this._appendedFragCodeBlocks.map((v)=>`${v}`).join('\n')}

${this._fragmentMainFn}
`);
    }

    public debug():void{
        if (!DEBUG) return;
        console.log('// *** vertex shader source ***');
        console.log(this.getVertexSource());
        console.log('// *** fragment shader source ***');
        console.log(this.getFragmentSource());
    }

    private _addFragmentUniform(type:string,name:string, extractArrayName:boolean = false):string{
        this._fragmentUniforms.push({type,name});
        name = normalizeUniformName(name);
        if (extractArrayName) name = name.split('[')[0];
        return name;
    }



}
