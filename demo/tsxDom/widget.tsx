import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";


const Button = (props:{onclick:()=>void,children?:VirtualNode[]})=>{
    return (
        <>
            <button style={{color:'green'}} onclick={_=>props.onclick()}>{props.children}</button>
        </>
    );
};

export class Widget extends VEngineTsxComponent {

    private items:{number:number}[] = [];
    private selected:string = '1';

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.add();
        this.add();
        this.add();
    }

    @ReactiveMethod()
    add():void{
        console.log(this);
        this.items.push({number:this.items.length-1});
    }

    @ReactiveMethod()
    remove():void{
        this.items.splice(-1);
    }

    @ReactiveMethod()
    removeAt(i:number):void{
        this.items.splice(i,1);
    }

    @ReactiveMethod()
    onSelected(val:string):void {
        this.selected = val;
    }

    render():VirtualNode {

        const style = 'button {margin: 10px}';
        if (this.selected==='1') {
            return (
                <div>
                    <div>
                        selected {this.selected}
                    </div>
                    <select onchange={e=>this.onSelected((e.target as HTMLSelectElement).value)}>
                        <option value="1" selected={this.selected==='1'}>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
            );
        } else return(
            <>
                <style>{style}</style>
                <Button onclick={()=>this.add()}>add</Button>
                <Button onclick={()=>this.remove()}>remove</Button>
                <ul style={{color:'red'}}>
                    {
                        this.items.map((it,i)=>
                            <li style={{backgroundColor:'#fbfbfb'}}><Button onclick={()=>this.removeAt(i)}>-</Button>the number is !!<b>{it.number}</b>!!</li>
                        )
                    }
                </ul>
                {/*test comment*/}
                <div>
                    selected {this.selected}
                </div>
                <select onchange={e=>this.onSelected((e.target as HTMLSelectElement).value)}>
                    <option value="1" selected={this.selected==='1'}>1</option>
                    <option value="2" selected={this.selected==='2'}>2</option>
                    <option value="3" selected={this.selected==='3'}>3</option>
                </select>
            </>

        );
    }
}



