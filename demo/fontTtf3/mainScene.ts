import {Scene} from "@engine/scene/scene";
import {FontContextTtfFactory} from "@engine/renderable/impl/general/font/factory/fontContextTtfFactory";
import {EditTextField} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {Color} from "@engine/renderer/common/color";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import * as files from "ls/ls-loader!./fonts?sort=name&asc=0";

export class MainScene extends Scene {


    public override onReady():void {

        let i = -1;
        let lastTf:TextField;
        let text = 'vEngine supports native TTF, 123456, Кирилиця';

        const loadNextFont = async (inc:number)=> {
            i += inc;
            if (i < 0) i = files.length - 1;
            else if (i > files.length - 1) i = 0;
            if (lastTf) {
                text = lastTf.getText();
                lastTf.removeSelf();
            }

            const path = files[i];
            console.log(path);
            const buff = await new ResourceLoader(this.game).loadBinary(path);

            const fontTtfFactory = new FontContextTtfFactory(this.game, buff, 30);
            const font = fontTtfFactory.createFont([], [], '', fontTtfFactory.getFontSize());

            lastTf = new EditTextField(this.game, font);
            lastTf.size.setFrom(this.game.size);
            lastTf.textColor.setFrom(Color.BLACK);
            lastTf.setText(text);
            lastTf.setPixelPerfect(true);
            this.backgroundColor = ColorFactory.fromCSS('#f1f1f1');
            this.appendChild(lastTf);

        };

        loadNextFont(1).then();
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, e=>{
            if (e.button===KEYBOARD_KEY.NUMPAD_PLUS) loadNextFont(1).then();
        });

    }




}
