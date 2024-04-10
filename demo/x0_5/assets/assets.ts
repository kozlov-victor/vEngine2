import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {ITextureAtlasJSON} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AngelCodeParser} from "@engine/misc/parsers/angelCode/angelCodeParser";
import {Font} from "@engine/renderable/impl/general/font/font";
import {DI} from "@engine/core/ioc";
import {TaskQueue} from "@engine/resources/taskQueue";
import {BdfFontParser} from "@engine/misc/parsers/bdf/bdfFontParser";
import {FontContextBdfFactory} from "@engine/renderable/impl/general/font/factory/fontContextBdfFactory";

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
    @Resource.Text('fonts/font.txt') private readonly fontSrc:string;

    public fontBDF:Font;


    protected override onPreloading(taskQueue: TaskQueue) {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async progress => {
            const bdfFont = new BdfFontParser().parse(this.fontSrc);
            const fontBdfFactory = new FontContextBdfFactory(this.scene.getGame(), bdfFont);
            this.fontBDF = fontBdfFactory.createFont([], [], '', 12);
        });
    }

}
