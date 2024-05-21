import {DomRootComponent} from "@engine/renderable/tsx/dom/domRootComponent";
import {TexturePackerWidget} from "./widgets/texture-packer.widget";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {TilePackerWidget} from "./widgets/tile-packer.widget";
import {PixelFontWidget} from "./widgets/pixel-font.widget";

export class BaseWidget extends DomRootComponent {

    @Reactive.Property()
    private page:string = 'texturePacker';

    public render(): JSX.Element {
        return (
            <>
                <div>
                    <button onclick={_=>this.page='texturePacker'}>{this.page==='texturePacker'?'+':''}texture packer</button>
                    <button onclick={_=>this.page='tilePacker'}>{this.page==='tilePacker'?'+':''}tile packer</button>
                    <button onclick={_=>this.page='pixelFont'}>{this.page==='pixelFont'?'+':''}pixelFont</button>
                </div>
                {this.page==='texturePacker' && <TexturePackerWidget/>}
                {this.page==='tilePacker' && <TilePackerWidget/>}
                {this.page==='pixelFont' && <PixelFontWidget/>}
            </>
        );
    }

}
