import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Sound} from "@engine/media/sound";
import {AngelCodeParser} from "@engine/misc/parsers/angelCode/angelCodeParser";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {ISingleton, staticImplements} from "@engine/resources/singleton";

@staticImplements<ISingleton<Assets>>()
export class Assets extends ResourceAutoHolder{

    public static getInstance():Assets {
        return undefined!;
    }

    @Resource.Sound('./mathQuiz/asset/sound/btn1.wav') public btn1Sound:Sound;
    @Resource.Sound('./mathQuiz/asset/sound/completed.wav') public completedSound:Sound;
    @Resource.Sound('./mathQuiz/asset/sound/fail.wav') public failSound:Sound;
    @Resource.Sound('./mathQuiz/asset/sound/selected.wav') public selectedSound:Sound;
    @Resource.Sound('./mathQuiz/asset/sound/start.wav') public startSound:Sound;
    @Resource.Sound('./mathQuiz/asset/sound/success.wav') public successSound:Sound;

    @Resource.FontFromAtlasUrl('./mathQuiz/asset/resource/','main.fnt',AngelCodeParser)
    public font:Font;

    public buttonBg:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(6, 125, 68, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgActive:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(255, 98, 0, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgSelected:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(35, 245, 238, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgCorrect:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(46, 227, 1, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgIncorrect:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = ColorFactory.fromCSS(`rgba(255, 0, 0, 0.61)`);
        rect.borderRadius = 15;
        return rect;
    })();

    constructor(scene:Scene) {
        super(scene);
    }

}
