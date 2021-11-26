import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import * as fntXML from "xml/angelcode-loader!./resource/main.fnt";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";


export class Assets extends ResourceAutoHolder{

    @Resource.FontFromAtlas('./mathQuiz/asset/resource/',fntXML)
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

    constructor(scene:Scene) {
        super(scene);
        console.log('created');
    }

}
