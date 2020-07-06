import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {httpClient} from "@engine/debug/httpClient";

const style = `

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        #frame {
            width: 320px;
            height: 240px;
            box-shadow: 0 0 2px black;
            margin: 5px;
        }
        #frameLoadingInfo {
            position: absolute;
            top: 20px;
            left: 20px
        }
        .layout {
            display: flex;
            flex-direction: column;
        }
        html,body,.layout {
            height: 100%;
        }
        body  {
            position: fixed;
            overflow: hidden;
            width: 100%;
            height: 100%;
        }
        .up,.down {
            display: flex;
            margin: 0 auto;
            position: relative;
        }
        .up {
            display: block;
            dislpay: flex;
            width: 320px;
        }
        .down {
            flex: 1;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            width: 100%;
        }
        /* hide hosting ads */
        div[style] {
            display: none;
        }
        #list {
            display: block;
            width: 100%;
            text-align: center;
        }
        #list li {
            padding: 10px;
        }
        .active {
            background-color: aqua;
        }


`;


export class Widget extends VEngineTsxComponent<{}> {

    private loadingInfo:string = '';
    private selectedItem:string;
    private listLoading:boolean = true;
    private items:string[];
    private frameRef:HTMLIFrameElement;

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.loadList().then(r =>{});
    }

    private async loadList(){
        this.items = await httpClient.post<string[]>('./index.json');
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
                <div className="down">
                    {this.listLoading?
                        <div className="loading">loading...</div>:
                        <ul id="list">
                            {
                                this.items.map((it,index)=>
                                    <li className={it===this.selectedItem?'active':undefined}>
                                        <a onclick={(e)=>this.selectItem(e,index)} target="_blank" href="#">
                                            {(it===this.selectedItem?'<':'') + it + (it===this.selectedItem?'>':'')}
                                        </a>
                                        <a target="_blank" href={'./demo.html?name='+it}> . </a>
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



