import {Scene} from "@engine/scene/scene";
import {Image, STRETCH_MODE} from "@engine/renderable/impl/general/image";
import {AssetsHolder} from "../assets/assetsHolder";
import {MainShip} from "../prefabs/mainShip";
import {Rocket} from "../prefabs/enemies/rocket";
import {Bomb} from "../prefabs/enemies/bomb";
import {Stone} from "../prefabs/enemies/stone";
import {Heart} from "../prefabs/bonuses/heart";
import {Boss3} from "../prefabs/bosses/boss3";
import {Boss4} from "../prefabs/bosses/boss4";
import {Boss5} from "../prefabs/bosses/boss5";
import {Plus} from "../prefabs/bonuses/plus";


export class Scene1 extends Scene {

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
        rocket.pos.setXY(800,100);

        const bomb = new Bomb(this.game,this,this.r);
        bomb.pos.setXY(200,50);

        const stone = new Stone(this.game,this,this.r);
        stone.pos.setXY(200,200);

        const heart = new Heart(this.game,this,this.r);
        heart.pos.setXY(300,400);

        const plus = new Plus(this.game,this,this.r);
        plus.pos.setXY(300,420);

        const boss5 = new Boss5(this.game,this,this.r);
        boss5.pos.setXY(200,500);

    }

}
