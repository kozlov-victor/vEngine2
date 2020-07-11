import {SceneProgressDescription} from "../../abstract/abstractSceneTransition";
import {AbstractCurtainsTransition} from "@engine/scene/transition/appear/curtains/abstractCurtainsTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {Image} from "@engine/renderable/impl/general/image";

export class CurtainsClosingTransition extends AbstractCurtainsTransition {

    protected describe(): SceneProgressDescription {
        const from:number = -this.game.size.width/2;
        const to:number = 0;
        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }

    public getOppositeTransition(): ISceneTransition {
        return new CurtainsOpeningTransition(this.game,this.time,this.easeFn);
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._prevSceneImage, this._currSceneImage];
    }

}
