import {Scene} from "@engine/scene/scene";
import {AssetsHolder} from "../assets/assetsHolder";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {MathEx} from "@engine/misc/mathEx";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {MainShip} from "../prefabs/mainShip";

export class Scene5 extends Scene {

    private r = new AssetsHolder(this);

    public override onReady():void {

        const bg1 = new Image(this.game,this.r.pack4bg1);
        bg1.scale.setXY(2);
        this.appendChild(bg1);

        const bg2 = new Image(this.game,this.r.pack4bg2);
        bg2.stretchMode = STRETCH_MODE.REPEAT;
        bg2.size.setWH(this.game.size.width,200);
        bg2.pos.y = this.game.height - bg2.size.height;
        this.appendChild(bg2);

        const mainShip = new MainShip(this.game,this,this.r);
        mainShip.pos.setXY(200,250);

        this.setInterval(()=>{
            bg1.offset.x+=0.1;
            bg2.offset.x+=1.2;
        },1);


    }


}
