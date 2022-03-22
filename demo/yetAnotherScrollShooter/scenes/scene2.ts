import {AssetsHolder} from "../assets/assetsHolder";
import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {MainShip} from "../prefabs/mainShip";
import {MathEx} from "@engine/misc/mathEx";
import {Rocket} from "../prefabs/enemies/rocket";
import {Bomb} from "../prefabs/enemies/bomb";
import {Stone} from "../prefabs/enemies/stone";
import {Ring} from "../prefabs/enemies/ring";
import {Engine} from "../prefabs/enemies/engine";
import {Boss1} from "../prefabs/bosses/boss1";
import {Boss2} from "../prefabs/bosses/boss2";
import {Boss3} from "../prefabs/bosses/boss3";

export class Scene2 extends Scene {

    private r = new AssetsHolder(this);

    public override onReady():void {

        const bg1 = new Image(this.game,this.r.pack1bg1);
        bg1.scale.setXY(2,2);
        this.appendChild(bg1);

        this.setInterval(()=>{
            bg1.offset.x+=0.6;
            // bg2_1.offset.x+=0.4;
            // bg2_2.offset.x+=0.6;
            // bg3.offset.x+=0.9;
        },1);

        const mainShip = new MainShip(this.game,this,this.r);
        mainShip.pos.setXY(200,250);

        const rocket = new Rocket(this.game,this,this.r);
        rocket.pos.setXY(800,100);

        const bomb = new Bomb(this.game,this,this.r);
        bomb.pos.setXY(200,50);

        const stone = new Stone(this.game,this,this.r);
        stone.pos.setXY(200,200);

        const ring = new Ring(this.game,this,this.r);
        ring.pos.setXY(400,200);

        const engine = new Engine(this.game,this,this.r);
        engine.pos.setXY(400,400);

        const boss1 = new Boss1(this.game,this,this.r);
        boss1.pos.setXY(400,200);

        const boss2 = new Boss2(this.game,this,this.r);
        boss2.pos.setXY(400,400);

        const boss3 = new Boss3(this.game,this,this.r);
        boss3.pos.setXY(200,500);

        const clouds:Image[] = [];
        for (let i:number=0;i<30;i++) {
            const cloud = new Image(this.game,this.r.cloud);
            cloud.alpha = 0.6;
            cloud.passMouseEventsThrough = true;
            cloud.depthTest = true;
            cloud.pos.z = i*10;
            cloud.velocity.x = -MathEx.randomInt(50,100);
            this.appendChild(cloud);
            cloud.pos.setXY(MathEx.randomInt(-100,this.game.width+100),MathEx.randomInt(-100,this.game.height+100));
            clouds.push(cloud);
        }

        this.setInterval(()=>{
            for (const cloud of clouds) {
                if (cloud.pos.x<-300) cloud.pos.x = this.game.width + MathEx.randomInt(200,300);
            }
        },1);

    }

}
