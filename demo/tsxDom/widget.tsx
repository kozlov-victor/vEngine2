import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {Reactive} from "@engine/renderable/tsx/genetic/reactive";
import {BaseTsxComponent} from "@engine/renderable/tsx/genetic/baseTsxComponent";
import {DomRootComponent} from "@engine/renderable/tsx/dom/domRootComponent";

class Component1 extends BaseTsxComponent {

    private cnt:number = 0;

    constructor(private props:{name:string,__id?:number}) {
        super();
    }

    private inc():void {
        this.cnt++;
        console.log(this);
    }

    override render(): JSX.Element {
        return(
            <div>
                <div>
                    <button onclick={()=>this.inc()}>inc</button>
                </div>
                component: {this.props.name} {this.cnt}
            </div>
        );
    }
}

const Button = (props:{onclick:()=>void,children?:VirtualNode[],__id?:number})=>{
    return (
        <>
            <button style={{color:'green'}} onclick={_=>props.onclick()}>{props.children}</button>
        </>
    );
};

export class Widget extends DomRootComponent {

    private items:{number:number}[] = [];
    private selected:string = '1';

    constructor() {
        super();
        this.add();
        this.add();
        this.add();
    }

    @Reactive.Method()
    add():void{
        console.log(this);
        this.items.push({number:this.items.length-1});
    }

    @Reactive.Method()
    remove():void{
        this.items.splice(-1);
    }

    @Reactive.Method()
    removeAt(i:number):void{
        this.items.splice(i,1);
    }

    @Reactive.Method()
    onSelected(val:string):void {
        this.selected = val;
    }

    render(): JSX.Element {

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
                <Component1 name={'name 1'}/>
                <Component1 name={'name 2'}/>
            </>

        );
    }
}



