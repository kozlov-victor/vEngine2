import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";

class Particle extends Rectangle {
    // tslint:disable-next-line:variable-name
    public acc_x:number = 0;
    // tslint:disable-next-line:variable-name
    public acc_y:number = 0;
    // tslint:disable-next-line:variable-name
    public vel_x:number = 0;
    // tslint:disable-next-line:variable-name
    public vel_y:number = 0;
}

export class MainScene extends Scene {

    // https://keyreal-code.github.io/haxecoder-tutorials/61_particle_system_in_openfl_using_tilesheet.html
    protected override onUpdate(): void {

        const newParticle:Particle = new Particle(this.game);
        newParticle.fillColor = Color.fromRGBNumeric(0x0000ff);
        newParticle.pos.setXY(0,0);
        newParticle.acc_x = 0;
        newParticle.acc_y = 0.5;
        newParticle.vel_x = Math.random() * 7 + 3;
        newParticle.vel_y = Math.random() * 5;
        this.appendChild(newParticle);

        for (const particle of (this.getLayers()[0].children  as Particle[])) {
            if (particle.pos.x > this.size.width) {
                this.removeChild(particle);
            } else {
                particle.pos.x += particle.vel_x;
                particle.pos.y += particle.vel_y;
                particle.vel_x += particle.acc_x;
                particle.vel_y += particle.acc_y;
                if (particle.pos.y > this.size.height) {
                    particle.pos.y = this.size.height;
                    particle.vel_y *= -Math.random()*0.7;
                }
            }
        }
    }
}
