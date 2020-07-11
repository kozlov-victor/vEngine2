import {SceneProgressDescription} from "../../abstract/abstractSceneTransition";
import {AbstractCurtainsTransition} from "@engine/scene/transition/appear/curtains/abstractCurtainsTransition";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {CurtainsClosingTransition} from "@engine/scene/transition/appear/curtains/curtainsClosingTransition";
import {Image} from "@engine/renderable/impl/general/image";

export class CurtainsOpeningTransition extends AbstractCurtainsTransition {


    protected describe(): SceneProgressDescription {
        const from:number = 0;
        const to:number = -this.game.size.width/2;
        return {
            target: {val: from},
            from: {val: from},
            to: {val: to},
            time: this.time,
            ease: this.easeFn
        };
    }

    public getOppositeTransition(): ISceneTransition {
        return new CurtainsClosingTransition(this.game,this.time,this.easeFn);
    }

    protected getBottomAndTopImages(): [Image, Image] {
        return [this._currSceneImage,this._prevSceneImage];
    }

}
