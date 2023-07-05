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
    private psdFileExists = false;

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
                            <input/>
                            number of images in row
                        </div>
                        <button>convert</button>
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
                await HttpClient.post('/tile-pack/checkFile',{pathToPsdFile:this.pathToPsdFile});
            this.psdFileExists = this.operationResult.success;
        } catch (e:any) {
            this.operationResult.message = e.toString();
            this.operationResult.success = false;
        }
    }


}
