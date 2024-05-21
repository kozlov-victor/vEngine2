import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {IBdfFont} from "@engine/misc/parsers/bdf/bdfFontParser";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {Frame} from "../components/frame";


export class PixelFontWidget extends BaseTsxComponent {
    private font:IBdfFont;

    public loadBfdFont() {

    }

    render(): JSX.Element {
        return (
            <Frame title={'Pixel Font'}>
                <input accept={'.bdf'} type={'file'}>load BDF font</input>
            </Frame>
        );
    }


}
