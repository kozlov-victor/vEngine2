import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";


export class Widget extends VEngineTsxComponent {

    private lines:string[] = [];
    private isInputMode:boolean = false;
    private valueFromInput:string = '';
    private resolveInputPromise:(str:string)=>void;
    private nativeInput:HTMLInputElement|undefined;
    private error:any;

    constructor() {
        super(new HtmlTsxDOMRenderer());

    }

    @ReactiveMethod()
    public print(...args:string[]|number[]):void {
        if (this.lines.length>1000) this.lines.shift();
        this.lines.push(args.join(''));
    }

    @ReactiveMethod()
    public clearScreen():void {
        this.lines.length = 0;
    }

    @ReactiveMethod()
    public input(prompt:string):Promise<string> {
        this.isInputMode = true;
        if (prompt) this.print(prompt);
        return new Promise<string>(resolve => {
            this.resolveInputPromise = resolve;
        });
    }

    @ReactiveMethod()
    public catchError(e:any):void {
        console.log('error!!!!!',e);
        console.log(e.name);
        console.log(e.message);
        this.isInputMode = false;
        this.error = e;
    }

    @ReactiveMethod()
    private onInputFormSubmitted(e:Event):void {
        e.stopPropagation();
        e.preventDefault();
        this.isInputMode = false;
        this.print(this.valueFromInput);
        this.resolveInputPromise(this.valueFromInput);
        this.valueFromInput = '';
    }

    render():VirtualNode {
        this.nativeInput = undefined;
        const node =  (
            <>
                {
                    this.lines.map(it=>
                        <div>{it}</div>
                    )
                }
                {
                    this.isInputMode &&
                    <form onsubmit={(e: SubmitEvent)=>this.onInputFormSubmitted(e)}>
                            <input
                                ref={e=>this.nativeInput = e as HTMLInputElement}
                                onblur={()=>{
                                    setTimeout(()=>{
                                        this.nativeInput?.focus();
                                    },1000);
                                }}
                                onchange={(e)=>this.valueFromInput = (e.target as HTMLInputElement).value}/>
                    </form>
                }
                {
                    this.error &&
                    <div style="color:red;white-space: pre;">
                        ERROR: {this.error.message}
                    </div>
                }
            </>
        );
        setTimeout(()=>{
            if (this.nativeInput) this.nativeInput.focus();
        },1);
        return node;
    }
}



