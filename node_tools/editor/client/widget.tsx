import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {HttpClient} from "@engine/debug/httpClient";
import {Frame} from "./components/frame";
import {StatusBar} from "./components/statusBar";

export class Widget extends VEngineTsxComponent {

    private folder:string = '';
    private padding = 2;
    private saveTo:string = '';
    private saveLayerImagesTo:string = '';
    private saveToFileName:string = '';
    private files:string[] = [];
    private convertedImageUUID:string;
    private operationResult = {
        message: '',
        success: true,
    };

    constructor() {
        super(new HtmlTsxDOMRenderer());
        this.loadInitialData().
        then(()=>{
            return HttpClient.post('/main/cleanUp')
        }).
        then(()=>{
            this.operationResult.message = 'Ok';
            this.operationResult.success = true;
        }).
        catch(e=>{
            console.error(e);
            this.operationResult.message = e;
            this.operationResult.success = false;
            this.triggerRendering();
        });
    }

    @ReactiveMethod()
    private async loadInitialData() {
        try {
            const payload:any = await HttpClient.get('/main/loadParams');
            this.folder = payload.folder;
            this.saveTo = payload.saveTo;
            this.saveLayerImagesTo = payload.saveLayerImagesTo;
            this.saveToFileName = payload.saveToFileName;
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    @ReactiveMethod()
    private async getFiles() {
        if (!this.folder) this.files = [];
        else {
            try {
                this.files = await HttpClient.get('/main/getFiles',{folder:this.folder});
                this.operationResult.message = 'Loaded';
                this.operationResult.success = true;
            } catch (e:any) {
                this.operationResult.message = e.toString();
                this.operationResult.success = false;
            }
        }
    }

    @ReactiveMethod()
    private async convert() {
        try {
            this.convertedImageUUID = await HttpClient.post(
                '/main/convert',
                {
                    files:this.files.join(','),
                    padding: this.padding,
                    saveLayerImagesTo:this.saveLayerImagesTo,
                });
            this.operationResult.message = 'converted';
            this.operationResult.success = true;
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    @ReactiveMethod()
    private async save() {
        try {
            await HttpClient.post('/main/save',
                {
                    uuid:this.convertedImageUUID,
                    saveTo:this.saveTo,
                    folder: this.folder,
                    saveToFileName:this.saveToFileName,
                    saveLayerImagesTo: this.saveLayerImagesTo,
                }
            );
            this.operationResult.message = 'saved!';
            this.operationResult.success = true;
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    render(): VirtualNode {
        return (
            <>
                <Frame title='Files'>
                    <input value={this.folder} onchange={e=>this.folder = (e.target as HTMLInputElement).value}/>
                    <button onclick={e=>this.getFiles()}>get files</button>
                    <div>
                        <ul>
                            {this.files.map(f=>
                                <li>{f}</li>
                            )}
                        </ul>
                    </div>
                </Frame>
                {this.files.length>0 &&
                    <Frame title={'Save layer images'}>
                        <div>
                            <input value={this.saveLayerImagesTo} onchange={e=>this.saveLayerImagesTo = (e.target as HTMLInputElement).value}/>
                            save layer images to
                        </div>
                        <input value={''+this.padding} onchange={e=>this.padding = +((e.target as HTMLInputElement).value || 0)}/>
                        padding
                        <div>
                            <button onclick={e=>this.convert()}>convert</button>
                        </div>
                    </Frame>
                }
                {this.convertedImageUUID &&
                    <Frame title={'Conversion'}>
                        <img
                            alt=""
                            src={`/main/getConvertedImage?uuid=${this.convertedImageUUID}`}
                            style={{
                                maxWidth: '250px',
                                border: '1px solid black',
                            }}
                        />
                    </Frame>
                }
                {this.convertedImageUUID &&
                    <Frame title={'Saving'}>
                        <div>
                            <input value={this.saveToFileName} onchange={e=>this.saveToFileName = (e.target as HTMLInputElement).value}/>
                            file name
                        </div>
                        <div>
                            <input value={this.saveTo} onchange={e=>this.saveTo = (e.target as HTMLInputElement).value}/>
                            <button onclick={e=>this.save()}>save</button>
                        </div>
                    </Frame>
                }
                <StatusBar
                    text={this.operationResult.message}
                    success={this.operationResult.success}/>
            </>
        );
    }

}
