import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {httpClient} from "@engine/debug/httpClient";


export class Widget extends VEngineTsxComponent<{}> {

    private loadingInfo:string = '';
    private selectedItem:string;
    private listLoading:boolean = true;
    private items:string[];
    private frameRef:HTMLIFrameElement;
    private scrollableWrapperRef:HTMLDivElement;

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.loadList().then(r =>{});
    }

    private async loadList(){
        this.items = await httpClient.get<string[]>('./index.json',{r:Math.random()},undefined,undefined,xhr => {
            xhr.setRequestHeader('Content-Type','application/json')
        });
        if (!this.items.splice) this.items = JSON.parse(this.items as any as string);
        this.listLoading = false;
        this.triggerRendering();
    }

    private selectItem(e:Event,index:number){
        e.preventDefault();
        if (this.selectedItem===this.items[index]) this.frameRef.contentDocument!.location.reload();
        this.selectedItem = this.items[index];
        this.loadingInfo = 'loading...';
        this.triggerRendering();
    }

    private onFrameLoaded(){
        this.loadingInfo = '';
        this.triggerRendering();
    }

    render() {
        return(
            <div className="layout">
                <div className="up">
                    <div id="frameLoadingInfo">{this.loadingInfo}</div>
                    <iframe
                        ref={(el)=>this.frameRef = el}
                        onload={()=>this.onFrameLoaded()}
                        src={this.selectedItem?'./demo.html?name='+this.selectedItem:undefined}
                        frameBorder="0" id="frame"/>
                </div>
                <div className="down" ref={el=>this.scrollableWrapperRef = el}>
                    {this.listLoading?
                        <div className="loading">loading...</div>:
                        <ul id="list">
                            {
                                this.items.map((it,index)=>
                                    <li className={it===this.selectedItem?'active':undefined}>
                                        <a className="selectItem" onclick={(e)=>this.selectItem(e,index)} href="#">
                                            {(it===this.selectedItem?'<':'') + it + (it===this.selectedItem?'>':'')}
                                        </a>
                                        <a target="_blank" href={'./demo.html?name='+it}> (new window) </a>
                                        <a target="_blank" href={'vengine:out/'+it}> (win app) </a>
                                    </li>
                                )
                            }
                        </ul>
                    }
                </div>
            </div>
        );
    }
}



