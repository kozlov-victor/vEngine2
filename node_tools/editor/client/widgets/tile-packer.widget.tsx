import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Frame} from "../components/frame";
import {StatusBar} from "../components/statusBar";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {HttpClient} from "@engine/debug/httpClient";

export class TilePackerWidget extends BaseTsxComponent {

    private operationResult = {
        message: '',
        success: true,
    };

    private pathToPsdFile:string;
    private numOfImagesInRow = 3;
    private psdFileExists = false;
    private convertedImageUUID:string;
    private saveToFileName:string = '';
    private saveTo:string = '';

    constructor() {
        super();
        this.loadInitialData().then();
    }

    @Reactive.Method()
    private async loadInitialData() {
        try {
            const payload:any = await HttpClient.get('/tile-pack/loadParams');
            this.saveTo = payload.saveTo;
            this.saveToFileName = payload.saveToFileName;
            this.numOfImagesInRow = payload.numOfImagesInRow || 3;
            this.pathToPsdFile = payload.pathToPsdFile;
            this.operationResult.message = 'Ok';
            this.operationResult.success = true;
        } catch (e:any) {
            console.log(e);
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Frame title={'path to psd file'}>
                    <div>
                        <input value={this.pathToPsdFile} onchange={e=>this.pathToPsdFile = (e.target as HTMLInputElement).value}/>
                        <button onclick={this.checkFile}>load</button>
                    </div>
                </Frame>
                {
                    this.psdFileExists &&
                        <Frame title={'converting to sheet'}>
                            <div>
                                <input value={''+this.numOfImagesInRow} onchange={e=>this.numOfImagesInRow = +((e.target as HTMLInputElement).value || 0)}/>
                                number of images in row
                            </div>
                            <button onclick={this.convert}>convert</button>
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
            </div>
        );
    }

    @Reactive.Method()
    private async checkFile() {
        try {
            this.operationResult =
                await HttpClient.post('/tile-pack/checkFile',
                    {
                        pathToPsdFile:this.pathToPsdFile,
                    }
                );
            this.psdFileExists = this.operationResult.success;
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    @Reactive.Method()
    private async convert() {
        try {
            this.convertedImageUUID =
                await HttpClient.post('/tile-pack/convertFile',
                    {
                        pathToPsdFile:this.pathToPsdFile,
                        numOfImagesInRow: this.numOfImagesInRow,
                    }
                );
            this.operationResult.success = true;
            this.operationResult.message = 'Converted';
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }

    @Reactive.Method()
    private async save() {
        try {
            await HttpClient.post('/tile-pack/save',
                {
                    uuid:this.convertedImageUUID,
                    saveTo:this.saveTo,
                    saveToFileName:this.saveToFileName,
                }
            );
            this.operationResult.message = 'saved!';
            this.operationResult.success = true;
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }


}
