import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Sound} from "@engine/media/sound";
import {AngelCodeParser} from "@engine/misc/xml/angelCodeParser";


export class Assets extends ResourceAutoHolder{

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
        rect.fillColor = Color.fromCssLiteral(`rgba(6, 125, 68, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgActive:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`rgba(255, 98, 0, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgSelected:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`rgba(35, 245, 238, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgCorrect:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`rgba(46, 227, 1, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();
    public buttonBgIncorrect:Rectangle = (()=>{
        const rect = new Rectangle(this.scene.getGame());
        rect.fillColor = Color.fromCssLiteral(`rgba(255, 0, 0, 0.61)`);
        rect.borderRadius = 15;
        return rect;
    })();

    constructor(scene:Scene) {
        super(scene);
        console.log('created');
    }

}
