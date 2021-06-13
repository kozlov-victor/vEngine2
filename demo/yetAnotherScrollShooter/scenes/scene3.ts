import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {AssetsHolder} from "../assets/assetsHolder";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {Submarine} from "../prefabs/enemies/submarine";
import {Submarine2} from "../prefabs/enemies/submarine2";
import {Spinner} from "../prefabs/enemies/spinner";

export class Scene3 extends Scene {

    private r = new AssetsHolder(this);

    public override onReady():void {

        const bg1 = new Image(this.game,this.r.pack1bg1);
        bg1.scale.setXY(1.3);
        this.appendChild(bg1);

        const bg2_1 = new Image(this.game,this.r.pack3bg2);
        bg2_1.scale.setXY(2);
        bg2_1.size.height = 120;
        bg2_1.pos.setXY(0,300);
        bg2_1.filters = [new WaveFilter(this.game)];
        this.appendChild(bg2_1);

        const submarine = new Submarine(this.game,this,this.r);
        submarine.pos.setXY(100,200);

        const spinner = new Spinner(this.game,this,this.r);
        spinner.pos.setXY(100,100);

        const bg2_2 = new Image(this.game,this.r.pack3bg2);
        bg2_2.scale.setXY(2);
        bg2_2.pos.setXY(0,400);
        bg2_2.filters = [new WaveFilter(this.game)];
        this.appendChild(bg2_2);

        const submarine2 = new Submarine2(this.game,this,this.r);
        submarine2.pos.setXY(100,300);

        const bg2_3 = new Image(this.game,this.r.pack3bg2);
        bg2_3.scale.setXY(2);
        bg2_3.pos.setXY(0,500);
        bg2_3.filters = [new WaveFilter(this.game)];
        this.appendChild(bg2_3);

        this.setInterval(()=>{
            bg1.offset.x+=0.2;
            bg2_1.offset.x+=0.3;
            bg2_2.offset.x+=0.6;
            bg2_3.offset.x+=0.9;
        },1);

    }

}
