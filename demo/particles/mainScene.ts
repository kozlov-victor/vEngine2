import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/core/renderer/color";
import {ParticleSystem} from "@engine/model/impl/particleSystem";


export class MainScene extends Scene {

    private ps:ParticleSystem;

    onPreloading() {
        let rect:Rectangle = new Rectangle(this.game);
        rect.width = 10;
        rect.height = 10;
        rect.pos.setXY(20,20);
        (rect.fillColor as Color).setRGBA(0,200,0);
        // let ps: ParticleSystem = new ParticleSystem(this.game,rect); // todo constructor
        // this.ps = ps;
        console.log('on onPreloading');
        this.appendChild(rect);
    }

    // onProgress(val: number) {
    //
    // }
    //
    // onReady() { // not invoked
    //     console.log('on ready');
    // }


    // onUpdate() {
    //     super.onUpdate();
    //     // this.ps.pos.setXY(20,20);
    //     // this.ps.emit();
    //     // this.ps.update(this.game.getTime(),this.game.getDeltaTime());
    // }
}
