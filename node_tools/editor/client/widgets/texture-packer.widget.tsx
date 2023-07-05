import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {HttpClient} from "@engine/debug/httpClient";
import {Frame} from "../components/frame";
import {StatusBar} from "../components/statusBar";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";

export class TexturePackerWidget extends BaseTsxComponent {

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
        super();
        this.loadInitialData().then();
    }

    @Reactive.Method()
    private async loadInitialData() {
        try {
            await HttpClient.post('/texture-pack/cleanUp');
            const payload:any = await HttpClient.get('/texture-pack/loadParams');
            this.folder = payload.folder;
            this.saveTo = payload.saveTo;
            this.saveLayerImagesTo = payload.saveLayerImagesTo;
            this.saveToFileName = payload.saveToFileName;
            this.operationResult.message = 'Ok';
            this.operationResult.success = true;
        } catch (e:any) {
            console.log(e);
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    @Reactive.Method()
    private async getFiles() {
        if (!this.folder) this.files = [];
        else {
            try {
                this.files = await HttpClient.get('/texture-pack/getFiles',{folder:this.folder});
                this.operationResult.message = 'Loaded';
                this.operationResult.success = true;
            } catch (e:any) {
                this.operationResult.message = e.toString();
                this.operationResult.success = false;
            }
        }
    }

    @Reactive.Method()
    private async convert() {
        try {
            this.convertedImageUUID = await HttpClient.post(
                '/texture-pack/convert',
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

    @Reactive.Method()
    private async save() {
        try {
            await HttpClient.post('/texture-pack/save',
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

    render() {
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
                            <button onclick={this.convert}>convert</button>
                        </div>
                    </Frame>
                }
                {this.convertedImageUUID &&
                    <Frame title={'Conversion'}>
                        <img
                            alt="converted image"
                            src={`/texture-pack/getConvertedImage?uuid=${this.convertedImageUUID}`}
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
                            <button onclick={this.save}>save</button>
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
