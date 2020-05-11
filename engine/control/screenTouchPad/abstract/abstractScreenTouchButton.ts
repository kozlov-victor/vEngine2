import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export abstract class AbstractScreenTouchButton {

    public abstract keyCode:number;
    public abstract renderableModel: RenderableModel;

    protected constructor(protected game: Game) {

    }

}
