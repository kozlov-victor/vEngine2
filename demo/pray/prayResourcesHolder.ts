import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import * as themeFntXML from "xml/angelcode-loader!./font/theme/font.fnt";
import * as btnFntXML from "xml/angelcode-loader!./font/button/button.fnt";
import {Font} from "@engine/renderable/impl/general/font/font";
import {ITexture} from "@engine/renderer/common/texture";

export class PrayResourcesHolder extends ResourceAutoHolder{

    @Resource.FontFromAtlas('./pray/font/theme/',themeFntXML)
    public themeFont:Font;

    @Resource.FontFromAtlas('./pray/font/button/',btnFntXML)
    public buttonFont:Font;

    @Resource.FontFromCssDescription({fontSize: 35})
    public buttonFont2:Font;

    @Resource.Text('./pray/text.txt')
    public text:string;

    @Resource.Texture('./pray/texture/fire-texture-atlas.jpg')
    public fireTexture:ITexture;

    @Resource.Texture('./pray/texture/bg.png')
    public bgTexture:ITexture;

}
