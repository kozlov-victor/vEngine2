import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Source} from "@engine/resources/resourceDecorators";
import {Hero} from "./actor/hero";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ARCADE_RIGID_BODY_TYPE, ArcadeRigidBody} from "@engine/physics/arcade/arcadeRigidBody";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Document} from "@engine/misc/xmlUtils";
import * as docDesc from "../physicsBasic2/level.xml";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";

export class MainScene extends Scene {

    @Source.Texture('./catGame/res/sprite/hero.png')
    private spriteSheetHero:ResourceLink<ITexture>;

    public onReady() {

        this.game.setPhysicsSystem(ArcadePhysicsSystem);

        const hero:Hero = new Hero(this.game,this.spriteSheetHero);

        const rect2:Rectangle = new Rectangle(this.game);
        rect2.size.setWH(500,15);
        rect2.pos.setXY(10,200);
        rect2.setRigidBody(this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC}));
        this.appendChild(rect2);

        const document:Document = Document.create(docDesc);
        document.getElementsByTagName('rect').forEach(c=>{
            const rect: Rectangle = new Rectangle(this.game);
            rect.pos.setXY(+c.attributes.x, +c.attributes.y);
            rect.size.setWH(+c.attributes.width, +c.attributes.height);
            rect.fillColor = Color.fromRGBNumeric(parseInt(c.attributes.fill.replace('#', ''), 16));
            rect.addBehaviour(new DraggableBehaviour(this.game));
            const rigidBody: ArcadeRigidBody = this.game.getPhysicsSystem<ArcadePhysicsSystem>().createRigidBody({type:ARCADE_RIGID_BODY_TYPE.KINEMATIC});
            rect.setRigidBody(rigidBody);
            this.appendChild(rect);
        });

        this.size.setWH(800, 600);
        this.game.getRenderer<WebGlRenderer>().setPixelPerfectMode(true);
    }

}
