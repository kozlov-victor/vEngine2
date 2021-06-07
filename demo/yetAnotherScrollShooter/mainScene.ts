import {Scene} from "@engine/scene/scene";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {AssetsHolder} from "./assets/assetsHolder";
import {MainShip} from "./prefabs/mainShip";
import {Rocket} from "./prefabs/rocket";


export class MainScene extends Scene {

    private r = new AssetsHolder(this);

    public override onReady():void {

        const bg1 = new Image(this.game,this.r.pack1bg1);
        this.appendChild(bg1);

        const bg2_1 = new Image(this.game,this.r.pack1bg2);
        bg2_1.stretchMode = STRETCH_MODE.REPEAT;
        bg2_1.pos.y = this.game.height - bg2_1.size.height;
        this.appendChild(bg2_1);

        const bg2_2 = new Image(this.game,this.r.pack1bg2);
        bg2_2.stretchMode = STRETCH_MODE.REPEAT;
        bg2_2.pos.y = this.game.height - bg2_2.size.height;
        this.appendChild(bg2_2);

        const bg3 = new Image(this.game,this.r.pack1bg3);
        bg3.stretchMode = STRETCH_MODE.REPEAT;
        bg3.pos.y = this.game.height - bg3.size.height;
        this.appendChild(bg3);

        this.setInterval(()=>{
            bg1.offset.x+=0.1;
            bg2_1.offset.x+=0.4;
            bg2_2.offset.x+=0.6;
            bg3.offset.x+=0.9;
        },1);

        const mainShip = new MainShip(this.game,this,this.r);
        mainShip.pos.setXY(200,250);

        const rocket = new Rocket(this.game,this,this.r);
        rocket.pos.setXY(0,100);

    }

}
