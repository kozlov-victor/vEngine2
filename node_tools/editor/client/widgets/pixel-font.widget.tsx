import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {BdfFontParser, IBdfFont} from "@engine/misc/parsers/bdf/bdfFontParser";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Frame} from "../components/frame";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";

const cellSize = 20;

const CharDataTable = (props:{__id?: number,char:IBdfFont["chars"][0],onCellMouseMove:(e:MouseEvent,row:number,cell:number,mousePressed:boolean)=>void})=>{
    const arr0_8 = Array(8).fill(0).map((e,i)=>i);
    return (
        <>
            <div style={{position:'relative'}}>
                {
                    props.char.data.map((dataRow,i)=>
                        <div>
                            {
                                arr0_8.map(k=>
                                    <div
                                        onmousemove={e=>props.onCellMouseMove(e,i,k,e.buttons===1)}
                                        onmousedown={e=>props.onCellMouseMove(e,i,k,true)}
                                        onpointermove={e=>props.onCellMouseMove(e,i,k,e.pressure>0)}
                                        style={
                                            {
                                                display: 'inline-block',
                                                boxSizing: 'border-box',
                                                border: '1px solid grey',
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                                backgroundColor: BinBuffer.isBitSet(8-k,dataRow)?'#0303c7':'',
                                            }
                                        }
                                    />
                                )
                            }
                        </div>
                    )
                }
                <div
                    style={
                        {
                            position:'absolute',
                            top: '0',
                            left: `${cellSize*props.char.widthExact}px`,
                            width:'3px',
                            height:`${props.char.data.length*cellSize}px`,
                            backgroundColor: '#01a402',
                        }
                    }
                />
                <div
                    style={
                        {
                            position:'absolute',
                            top: `${cellSize*(-props.char.offsetY)}px`,
                            left: `0`,
                            width:`${8*cellSize}px`,
                            height: '3px',
                            backgroundColor: '#01a402',
                        }
                    }
                />
            </div>
        </>
    );
}

export class PixelFontWidget extends BaseTsxComponent {
    private font:IBdfFont;
    private activeCharIndex = -1;
    private chars:(IBdfFont['chars'][0] & {value:string})[] = [];
    private fileName: string;
    private instrument:'pencil'|'eraser' = 'pencil';

    @Reactive.Method()
    public async loadFont(target:HTMLInputElement) {
        const file = target.files?.[0];
        if (!file) return;
        const content = await file.text();
        this.fileName = file.name.split('.').slice(0, -1).join('.');
        if (file.name.endsWith('.bdf')) {
            this.font = new BdfFontParser().parse(content);
        }
        else {
            this.font = JSON.parse(content);
        }
        Object.keys(this.font.chars).forEach(k=>{
            this.chars.push({...this.font.chars[k],value:k})
        });
    }

    @Reactive.Method()
    public async saveFont() {
        const link = document.createElement('a');
        const font = {...this.font};
        font.chars = {};
        this.chars.forEach(c=>{
            font.chars[c.value] = {
                data: c.data,
                width: c.width,
                widthExact: c.widthExact,
                offsetX:c.offsetX,
                offsetY:c.offsetY,
            }
        });
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(font,undefined,4)));
        link.setAttribute('download', `${this.fileName}.json`);
        link.style.position = 'absolute';
        link.style.left = '-1000px';
        link.style.top = '-1000px';
        document.body.appendChild(link);
        link.click();
        setTimeout(()=>{
            link.remove();
        },200);
    }

    override onMounted() {
        super.onMounted();
    }

    @Reactive.Method()
    private onCharClick(i:number) {
        this.activeCharIndex = i;
    }

    @Reactive.Method()
    private delSelectedChar() {
        if (this.activeCharIndex===undefined) return;
        this.chars.splice(this.activeCharIndex,1);
    }

    @Reactive.Method()
    private cloneSelectedChar() {
        const char = this.chars[this.activeCharIndex];
        if (!char) return;
        this.chars.push({...char,data:[...char.data]});
        this.activeCharIndex = this.chars.length -1;
    }

    @Reactive.Method()
    private editSelectedChar(e:Event) {
        const char = this.chars[this.activeCharIndex];
        if (!char) return;
        char.value = (e.target as HTMLInputElement).value;
    }

    @Reactive.Method()
    private editWithExact(e:Event) {
        const char = this.chars[this.activeCharIndex];
        if (!char) return;
        char.widthExact = +(e.target as HTMLInputElement).value;
    }

    @Reactive.Method()
    private onCellMouseMove(e:MouseEvent,row:number,col:number,mousePressed:boolean) {
        if (!mousePressed) return;
        e.preventDefault();
        const char = this.chars[this.activeCharIndex];
        char.data[row] = BinBuffer.setBitValue(8-col,char.data[row],this.instrument==='pencil'?1:0);
    }

    @Reactive.Method()
    private setInstrument(instrument:'pencil'|'eraser') {
        this.instrument = instrument;
    }

    render(): JSX.Element {
        return (
            <>
                <Frame title={'Pixel Font'}>
                    <input
                        oninput={e=>this.loadFont(e.target as HTMLInputElement)}
                        accept={'.bdf,.json'}
                        type={'file'}/>
                    <div>
                        {this.chars.map((c,i)=>
                            <div
                                onclick={e=>this.onCharClick(i)}
                                style={
                                    {
                                        width:`${cellSize}px`,
                                        height:`${cellSize}px`,
                                        display: 'inline-block',
                                        padding: '8px',
                                        border: '1px solid black',
                                        margin: '2px',
                                        whiteSpace: 'pre',
                                        borderColor:i===this.activeCharIndex?'#01a801':undefined,
                                    }
                                }
                            >{c.value || '?'}</div>
                        )}
                    </div>
                    {this.fileName && <button onclick={this.saveFont}>save</button>}
                    {
                        this.font &&
                        <>
                            <button onclick={e=>this.delSelectedChar()}>del selected char</button>
                            <button onclick={e=>this.cloneSelectedChar()}>clone selected char</button>
                        </>
                    }
                </Frame>
                {
                    this.chars[this.activeCharIndex]?.value!==undefined &&
                    <Frame title={`${this.chars[this.activeCharIndex].value} (${this.chars[this.activeCharIndex].value.charCodeAt(0)})`}>
                        <CharDataTable
                            onCellMouseMove={(e,row:number,col:number,mousePressed:boolean)=>this.onCellMouseMove(e,row,col,mousePressed)}
                            char={this.chars[this.activeCharIndex]}
                        />
                        <input
                            value={this.chars[this.activeCharIndex].value}
                            oninput={this.editSelectedChar}
                            style={{minWidth:'auto',width: '30px'}}
                        />
                        <input
                            value={''+this.chars[this.activeCharIndex].widthExact}
                            oninput={this.editWithExact}
                            style={{minWidth:'auto',width: '30px'}}
                        />
                        <span
                            onclick={e=>this.setInstrument('pencil')}
                            style={
                                {
                                    cursor: 'pointer',
                                    padding:'5px',
                                    margin: '5px',
                                    display: 'inline-block',
                                    border: '2px solid black',
                                    borderColor: this.instrument==='pencil'?'green':undefined,
                                }
                            }>pencil</span>
                        <span
                            onclick={e=>this.setInstrument('eraser')}
                            style={
                                {
                                    cursor: 'pointer',
                                    padding:'5px',
                                    margin: '5px',
                                    display: 'inline-block',
                                    border: '2px solid black',
                                    borderColor: this.instrument==='eraser'?'green':undefined,
                                }
                            }>eraser</span>
                    </Frame>
                }
            </>
        );
    }


}
