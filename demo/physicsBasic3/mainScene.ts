import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export class MainScene extends Scene {

    public override onReady():void {

        const physicsSystem = this.game.getPhysicsSystem(ArcadePhysicsSystem);

        const rect1 = new Rectangle(this.game);
        rect1.size.setWH(350,350);
        rect1.pos.setXY(321,30);
        rect1.fillColor = ColorFactory.fromCSS(`#202dbe`);
        rect1.setRigidBody(physicsSystem.createRigidBody());
        this.appendChild(rect1);

        const rect2 = new Rectangle(this.game);
        rect2.size.setWH(350,350);
        rect2.pos.setXY(320,50);
        rect2.fillColor = ColorFactory.fromCSS(`#10ad1d`);
        rect2.setRigidBody(physicsSystem.createRigidBody());
        this.appendChild(rect2);

        const rect3 = new Rectangle(this.game);
        rect3.size.setWH(350,350);
        rect3.pos.setXY(320,80);
        rect3.fillColor = ColorFactory.fromCSS(`#f10f97`);
        rect3.setRigidBody(physicsSystem.createRigidBody());
        this.appendChild(rect3);

    }

}
