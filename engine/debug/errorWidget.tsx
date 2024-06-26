import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {DomRootComponent} from "@engine/renderable/tsx/dom/domRootComponent";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";

interface IDebugInfo {
    file:string;
    colNum:number;
    lineNum:number;
}

interface IErrorInfo {
    filename?:string;
    runtimeInfo:string;
    debugInfo?:IDebugInfo;
}

//language=css
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
        z-index: 100;
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




const prettifyDebugInfo = (debugInfo?:IDebugInfo)=>{
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

class ErrorWidget extends DomRootComponent {

    private errors:IErrorInfo[] = [];


    @Reactive.Method()
    public addError(err:IErrorInfo):void{
        this.errors.push(err);
    }

    @Reactive.Method()
    private removeItem(i:number):void{
        this.errors.splice(i,1);
    }

    render(): JSX.Element {
        return (
            <>
                <style>{css}</style>
                <div className={this.errors.length>0?'errorBlockHolder':''}>
                    {
                        this.errors.map((err,i)=>
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
            </>
        );
    }

}

let errorWidget:ErrorWidget;

export const renderError = (error:IErrorInfo):void=>{

    if (!document.body && window.alert!==undefined) {
        alert(error.runtimeInfo);
        return;
    }

    if (errorWidget===undefined) {
        errorWidget = new ErrorWidget();
        const errDiv = document.createElement('div');
        document.body.appendChild(errDiv);
        errorWidget.mountTo(new HTMLElementWrap(errDiv));
    }
    errorWidget.addError(error);
};
