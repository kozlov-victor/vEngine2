import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";

export abstract class AbstractEntity extends SimpleGameObjectContainer {

    constructor(game:Game, protected scene:Scene) {
        super(game);
        this.setInterval(()=>this.fire(),300);
    }

    protected fire():void {
        const bullet = new Rectangle(this.game);
        bullet.pos.set(this.pos);
        bullet.size.setWH(40,5);
        bullet.fillColor = Color.fromCssLiteral(`#ffe406`);
        bullet.velocity.x = 150;
        this.scene.appendChild(bullet);
    }

}
