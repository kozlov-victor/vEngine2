import {AbstractCurtainsTransition} from "@engine/scene/transition/appear/curtains/abstractCurtainsTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {Image} from "@engine/renderable/impl/general/image/image";

export class CurtainsClosingTransition extends AbstractCurtainsTransition {

    protected getFromTo(): { from: number; to: number } {
        return {from: -this.game.size.width/2, to: 0};
    }

    public getOppositeTransition(): ISceneTransition {
        return new CurtainsOpeningTransition(this.game,this.time,this.easeFn);
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage, this._currSceneImage];
    }

}
