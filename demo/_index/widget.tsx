import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {HttpClient} from "@engine/debug/httpClient";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";


interface IItem {
    letter: string;
    names: string[];
}

export class Widget extends VEngineTsxComponent {

    private loadingInfo:string = '';
    private selectedItem:string;
    private listLoading:boolean = true;
    private items:IItem[] = [];
    private frameRef:HTMLIFrameElement;
    private scrollableWrapperRef:HTMLDivElement;

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.loadList().then();
    }

    @ReactiveMethod()
    private async loadList():Promise<void>{
        let items = await HttpClient.get<IItem[]>('./index.json',{r:Math.random()},undefined,undefined, xhr => {
            xhr.setRequestHeader('Content-Type','application/json');
        });
        if (!items.splice) items = JSON.parse(items as any as string);

        this.items = items;

        this.listLoading = false;
    }

    @ReactiveMethod()
    private selectItem(e:Event,name:string):void{
        e.preventDefault();
        if (this.selectedItem===name) this.frameRef.contentDocument!.location.reload();
        this.selectedItem = name;
        this.loadingInfo = 'loading...';
    }

    @ReactiveMethod()
    private onFrameLoaded():void{
        this.loadingInfo = '';
    }

    render():VirtualNode {
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
                                this.items.map((item,index)=>
                                    item.names.map((it)=>{
                                        return (
                                            <li className={it === this.selectedItem ? 'active' : undefined}>
                                                <div className={((index % 2 === 0) ? 'even' : 'odd')+' ' + 'even_odd'}>
                                                    <a
                                                        className={'selectItem'}
                                                        onclick={(e) => this.selectItem(e, it)}
                                                        href="#">
                                                        {(it === this.selectedItem ? '<' : '') + it + (it === this.selectedItem ? '>' : '')}
                                                    </a>
                                                    <a target="_blank" href={'./demo.html?name=' + it}> {'>>>>>'} </a>
                                                </div>
                                            </li>
                                        );
                                    })
                                )
                            }
                        </ul>
                    }
                </div>
            </div>
        );
    }
}



