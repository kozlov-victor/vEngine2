import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {Optional} from "@engine/core/declarations";

interface IDebugInfo {
    file:string,
    colNum:number,
    lineNum:number
}

interface IErrorInfo {
    filename?:string,
    runtimeInfo:string,
    debugInfo?:IDebugInfo,
}

interface IState {
    errors:IErrorInfo[];
}

const css:string = `
    .errorHeader {text-align: center;}
    .errorText {
        color: #ff8882;
        white-space: pre-wrap;
    }
    .errorCol {color: #f30000;text-decoration: underline;}
    .errorRow {
        color: #bf1313;
        font-weight: bold;
    }
    .errorBlockHolder {
        background: #615f5fb8;
        height: 100%;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        position: absolute;
    }
    ::selection {
            color: #efff00;
            background-color: #127315;
    }
    .errorBlock {
        border: 1px solid grey;
        background-color: rgba(21, 15, 121, 0.88);
        font-family: monospace;
        -webkit-touch-callout: default;
        color: #fffef8;
    }
    .errorBlock, .errorBlock * {
        user-select: text;
    }
    .errorBlockInternal {
        position: relative;
        padding: 5px;
        margin: 5px;
        border: 1px solid #8f9624;
        user-select: text;
    }
    .errorClose {
        position: absolute;
        top: 15px;
        right: 5px;
        content: 'x';
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: white;
    }
`;




const prettifyDebugInfo = (debugInfo?:IDebugInfo):Optional<VirtualNode>=>{
    if (!debugInfo) return undefined;
    const strings:string[] = debugInfo.file.split('\n');
    const linesAfter:number = 5;
    const linesBefore:number = 5;
    const errorLine:string = strings[debugInfo.lineNum - 1] || '';
    const stringsBefore = strings.slice(
        Math.max(debugInfo.lineNum - 1 - linesBefore,0),
        debugInfo.lineNum - 1
    );
    const stringsAfter = strings.slice(debugInfo.lineNum, debugInfo.lineNum + linesAfter);
    return (
        <div>
            {stringsBefore.map(s=><div>{s}</div>)}
            <div className="errorRow">
                <span>{errorLine.substr(0,debugInfo.colNum-1)}</span>
                <span className="errorCol">{errorLine[debugInfo.colNum-1]}</span>
                <span>{errorLine.substr(debugInfo.colNum)}</span>
            </div>
            {stringsAfter.map(s=><div>{s}</div>)}
        </div>
    );
};

export class ErrorWidget extends VEngineTsxComponent<IState> {

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.state = {
            errors: []
        }
    }

    public addError(err:IErrorInfo){
        this.state.errors.push(err);
        this.setState({...this.state});
    }

    private removeItem(i:number){
        this.state.errors.splice(i,1);
        this.setState({...this.state});
    }

    render() {
        return (
            <div>
                <style>{css}</style>
                <div className={this.state.errors.length>0?'errorBlockHolder':''}>
                    {
                        this.state.errors.map((err,i)=>
                            <div className="errorBlock">
                                <div className="errorBlockInternal">
                                    <div className="errorClose" onclick={()=>this.removeItem(i)}>x</div>
                                    <h3 className="errorText">{err.runtimeInfo}</h3>
                                    <div>{err.filename}</div>
                                    <div>-------------------</div>
                                    <pre>{prettifyDebugInfo(err.debugInfo)}</pre>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

}

let errorWidget:ErrorWidget;

export const renderError = (error:IErrorInfo):void=>{
    if (errorWidget===undefined) {
        errorWidget = new ErrorWidget();
        const errDiv:HTMLElement = document.createElement('div');
        document.body.appendChild(errDiv);
        errorWidget.mountTo(new HTMLElementWrap(errDiv));
    }
    errorWidget.addError(error);
};
