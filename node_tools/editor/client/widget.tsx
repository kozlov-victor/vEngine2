import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {HttpClient} from "@engine/debug/httpClient";

export class Widget extends VEngineTsxComponent {

    private folder:string = '';
    private padding = 2;
    private saveTo:string = '';
    private saveLayerImagesTo:string = '';
    private saveToFileName:string = '';
    private files:string[] = [];
    private convertedImageUUID:string;
    private message:string;

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.loadInitialData().catch(e=>console.error(e))
    }

    @ReactiveMethod()
    private async loadInitialData() {
        const payload:any = await HttpClient.get('/main/loadParams');
        this.folder = payload.folder;
        this.saveTo = payload.saveTo;
        this.saveLayerImagesTo = payload.saveLayerImagesTo;
        this.saveToFileName = payload.saveToFileName;
    }

    @ReactiveMethod()
    private async getFiles() {
        if (!this.folder) this.files = [];
        else {
            this.files = await HttpClient.get('/main/getFiles',{folder:this.folder});
            this.message = 'loaded';
        }
    }

    @ReactiveMethod()
    private async convert() {
        this.convertedImageUUID = await HttpClient.post(
            '/main/convert',
            {
                files:this.files.join(','),
                padding: this.padding,
                saveLayerImagesTo:this.saveLayerImagesTo,
            });
        this.message = 'converted';
    }

    @ReactiveMethod()
    private async save() {
        await HttpClient.post('/main/save',
            {
                uuid:this.convertedImageUUID,
                saveTo:this.saveTo,
                folder: this.folder,
                saveToFileName:this.saveToFileName,
                saveLayerImagesTo: this.saveLayerImagesTo,
            }
        );
        this.message = 'saved!';
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
                    <>
                        <div>
                            <input value={this.saveLayerImagesTo} onchange={e=>this.saveLayerImagesTo = (e.target as HTMLInputElement).value}/>
                            save layer images to
                        </div>
                        <input value={''+this.padding} onchange={e=>this.padding = +((e.target as HTMLInputElement).value || 0)}/>
                        padding
                        <div>
                            <button onclick={e=>this.convert()}>convert</button>
                        </div>
                    </>
                }
                <div>
                    {this.convertedImageUUID &&
                        <div>
                            <img
                                alt=""
                                src={`/main/getConvertedImage?uuid=${this.convertedImageUUID}`}
                                style={{
                                    maxWidth: '250px',
                                    border: '1px solid black',
                                }}
                            />
                        </div>
                    }
                    {this.convertedImageUUID &&
                        <>
                            <div>
                                <input value={this.saveToFileName} onchange={e=>this.saveToFileName = (e.target as HTMLInputElement).value}/>
                                file name
                            </div>
                            <div>
                                <input value={this.saveTo} onchange={e=>this.saveTo = (e.target as HTMLInputElement).value}/>
                                <button onclick={e=>this.save()}>save</button>
                            </div>
                        </>
                    }
                </div>
                <hr/>
                <div>{this.message}</div>
            </div>
        );
    }

}
