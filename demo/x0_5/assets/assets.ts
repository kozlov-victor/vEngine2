import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {ITextureAtlasJSON} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AngelCodeParser} from "@engine/misc/parsers/angelCode/angelCodeParser";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {DI} from "@engine/core/ioc";

@DI.Injectable()
export class Assets extends ResourceAutoHolder {

    @Resource.Texture('images/bg.png') public readonly bg: ITexture;
    @Resource.Texture('images/arrow.png') public readonly arrow: ITexture;
    @Resource.Texture('images/logo.png') public readonly logo: ITexture;
    @Resource.Texture('images/x.png') public readonly x: ITexture;
    @Resource.Texture('images/o.png') public readonly o: ITexture;
    @Resource.Texture('sprites/x0.png') public readonly xo: ITexture;
    @Resource.JSON('sprites/x0.json') public readonly xoAtlas: ITextureAtlasJSON;
    @Resource.FontFromAtlasUrl('fonts/','font.fnt',AngelCodeParser) public font:Font;

    public textFieldBg = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`#130083`);
        rect.color = ColorFactory.fromCSS(`#363636`);
        rect.lineWidth = 1;
        return rect;
    })();

}
