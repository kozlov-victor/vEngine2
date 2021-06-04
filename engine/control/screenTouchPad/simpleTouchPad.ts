import {AbstractScreenTouchPad} from "@engine/control/screenTouchPad/abstract/abstractScreenTouchPad";
import {Game} from "@engine/core/game";
import {AbstractScreenTouchButton} from "@engine/control/screenTouchPad/abstract/abstractScreenTouchButton";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";


class TouchButton extends AbstractScreenTouchButton{

    public renderableModel: RenderableModel;

    constructor(game: Game, public keyCode:number) {
        super(game);
        const c:Circle = new Circle(game);
        c.radius = 30;
        c.alpha = 0.5;
        this.renderableModel = c;
    }

}

export class SimpleTouchPad extends AbstractScreenTouchPad {

    constructor(game:Game) {
        super(game);
        const btnLeft = new TouchButton(game,KEYBOARD_KEY.LEFT);
        btnLeft.renderableModel.pos.setXY(30,game.size.height - 130);
        this.addButton(btnLeft);

        const btnRight = new TouchButton(game,KEYBOARD_KEY.RIGHT);
        btnRight.renderableModel.pos.setXY(110,game.size.height - 130);
        this.addButton(btnRight);

        const btnFire = new TouchButton(game,KEYBOARD_KEY.Z);
        btnFire.renderableModel.pos.setXY(game.size.width - 110 - 40,game.size.height - 130);
        this.addButton(btnFire);

        const btnJump = new TouchButton(game,KEYBOARD_KEY.SPACE);
        btnJump.renderableModel.pos.setXY(game.size.width - 30 - 40,game.size.height - 130);
        this.addButton(btnJump);
    }

}
