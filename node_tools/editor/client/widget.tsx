import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {HttpClient} from "@engine/debug/httpClient";

export class Widget extends VEngineTsxComponent {

    private folder:string = 'C:\\Users\\VAKozlov\\Desktop\\sd';
    private saveTo:string = 'C:\\Users\\VAKozlov\\Desktop\\sd';
    private saveToFileName:string = 'out';
    private files:string[] = [];
    private convertedImageUUID:string;

    constructor() {
        super(new HtmlTsxDOMRenderer());
    }

    @ReactiveMethod()
    private async getFiles() {
        if (!this.folder) this.files = [];
        else {
            this.files = await HttpClient.get('/main/getFiles',{folder:this.folder});
        }
    }

    @ReactiveMethod()
    private async convert() {
        this.convertedImageUUID = await HttpClient.post('/main/convert',{files:this.files.join(',')});
    }

    @ReactiveMethod()
    private async save() {
        await HttpClient.post('/main/save',
            {
                uuid:this.convertedImageUUID,
                saveTo:this.saveTo,
                saveToFileName:this.saveToFileName
            }
        );
    }

    render(): VirtualNode {
        return (
            <div>
                <input value={this.folder} onchange={e=>this.folder = (e.target as HTMLInputElement).value}/>
                <button onclick={e=>this.getFiles()}>get files</button>
                <div>
                    <ul>
                        {this.files.map(f=>
                            <li>{f}</li>
                        )}
                    </ul>
                </div>
                {this.files.length>0 &&
                    <button onclick={e=>this.convert()}>convert</button>
                }
                <div>
                    {this.convertedImageUUID &&
                        <div>
                            <img
                                alt=""
                                src={`/main/getConvertedImage?uuid=${this.convertedImageUUID}`}
                                style={{
                                    maxWidth: '250px',
                                }}
                            />
                        </div>
                    }
                    {this.convertedImageUUID &&
                        <>
                            <div>
                                <input value={this.saveToFileName} onchange={e=>this.saveToFileName = (e.target as HTMLInputElement).value}/>
                            </div>
                            <div>
                                <input value={this.saveTo} onchange={e=>this.saveTo = (e.target as HTMLInputElement).value}/>
                            </div>
                            <button onclick={e=>this.save()}>save</button>
                        </>
                    }
                </div>
            </div>
        );
    }

}
