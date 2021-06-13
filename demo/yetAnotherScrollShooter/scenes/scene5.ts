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

        // const starts:Circle[] = [];
        // for (let i:number=0;i<30;i++) {
        //     const star = new Circle(this.game);
        //     star.radius = MathEx.randomInt(1,3);
        //     star.passMouseEventsThrough = true;
        //     star.depthTest = true;
        //     star.pos.z = i*10;
        //     star.velocity.x = -MathEx.randomInt(50,100);
        //     this.appendChild(star);
        //     star.pos.setXY(MathEx.randomInt(-100,this.game.width+100),MathEx.randomInt(-100,this.game.height+100));
        //     starts.push(star);
        // }
        //
        // this.setInterval(()=>{
        //     for (const start of starts) {
        //         if (start.pos.x<-300) start.pos.x = this.game.width + MathEx.randomInt(200,300);
        //     }
        // },1);

        this.setInterval(()=>{
            bg1.offset.x+=0.1;
            bg2.offset.x+=1.2;
        },1);


    }


}
