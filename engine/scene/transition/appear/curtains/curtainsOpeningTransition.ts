import {AbstractCurtainsTransition} from "@engine/scene/transition/appear/curtains/abstractCurtainsTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {CurtainsClosingTransition} from "@engine/scene/transition/appear/curtains/curtainsClosingTransition";
import {Image} from "@engine/renderable/impl/general/image/image";

export class CurtainsOpeningTransition extends AbstractCurtainsTransition {

    protected getFromTo(): { from: number; to: number } {
        return {from: 0, to: -this.game.size.width/2};
    }

    public getOppositeTransition(): ISceneTransition {
        return new CurtainsClosingTransition(this.game,this.time,this.easeFn);
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

}
