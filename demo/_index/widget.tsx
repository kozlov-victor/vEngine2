import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HttpClient} from "@engine/debug/httpClient";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {DomRootComponent} from "@engine/renderable/tsx/dom/domRootComponent";


interface IItem {
    letter: string;
    names: string[];
}

export class Widget extends DomRootComponent {

    private loadingInfo:string = '';
    private selectedIndex: number;
    private listLoading:boolean = true;
    private items:IItem[] = [];
    private frameRef:HTMLIFrameElement;
    private scrollableWrapperRef:HTMLDivElement;

    private allItemNames:string[] = [];

    constructor() {
        super();
        this.loadList().then(_=>{
            this.items.forEach(item=>{
                item.names.forEach(name=>{
                    this.allItemNames.push(name);
                });
                this.triggerRendering();
            })
        });

        document.addEventListener('keydown',e=>{
            if (e.key==='ArrowRight') {
                this.selectedIndex++;
                if (this.selectedIndex>this.allItemNames.length-1) this.selectedIndex = 0;
                this.triggerRendering();
                document.querySelector('.active')?.scrollIntoView();
            }
            else if (e.key==='ArrowLeft') {
                this.selectedIndex--;
                if (this.selectedIndex<0) this.selectedIndex = this.allItemNames.length-1;
                this.triggerRendering();
                document.querySelector('.active')?.scrollIntoView();
            }
        });
    }

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
        const index = this.allItemNames.indexOf(name);
        if (this.selectedIndex===index) this.frameRef.contentDocument!.location.reload();
        this.selectedIndex = index;
        this.loadingInfo = 'loading...';
    }

    @ReactiveMethod()
    private onFrameLoaded():void{
        this.loadingInfo = '';
    }

    render(): JSX.Element {
        return(
            <div className="layout">
                <div className="up">
                    <div id="frameLoadingInfo">{this.loadingInfo}</div>
                    <iframe
                        ref={(el)=>this.frameRef = el}
                        onload={()=>this.onFrameLoaded()}
                        src={this.selectedIndex!==undefined?'./demo.html?name='+this.allItemNames[this.selectedIndex]:''}
                        frameBorder="0" id="frame"/>
                </div>
                <div className="down" ref={el=>this.scrollableWrapperRef = el}>
                    {this.listLoading?
                        <div className="loading">loading...</div>:
                        <ul id="list">
                            {
                                (()=>{
                                    let ind = -1;
                                    return this.items.map((item,index)=>
                                        item.names.map((name)=>{
                                            ind++;
                                            return (
                                                <li className={ind===this.selectedIndex ? 'active' : ''}>
                                                    <div className={((index % 2 === 0) ? 'even' : 'odd')+' ' + 'even_odd'}>
                                                        <a
                                                            className={'selectItem'}
                                                            onclick={(e) => this.selectItem(e, name)}
                                                            href="#">
                                                            {(ind===this.selectedIndex ? '<' : '') + name + (ind===this.selectedIndex ? '>' : '')}
                                                        </a>
                                                        <a target="_blank" href={'./demo.html?name=' + name}> {'>>>>>'} </a>
                                                    </div>
                                                </li>
                                            );
                                        })
                                    )
                                })()
                            }
                        </ul>
                    }
                </div>
            </div>
        );
    }
}



