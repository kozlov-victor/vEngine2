import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {AbstractParticleEmitter} from "./abstractParticleEmitter";
import {Color} from "@engine/renderer/common/color";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {DI} from "@engine/core/ioc";
import {MainScene} from "../mainScene";
import {Game} from "@engine/core/game";

@DI.Injectable()
export class GroundDustEmitter extends AbstractParticleEmitter {

    @DI.Inject(Game) private game: Game;

    @DI.PostConstruct()
    protected onPostConstruct() {
        this.init(this.game.getCurrentScene());
    }

    private createPrefab(color:Color) {
        const particle = new BatchedImage(this.game);
        particle.fillColor.setFrom(color);
        particle.size.setWH(2);
        return particle;
    }

    protected override createParticlePrefabs() {
        return [
            this.createPrefab(ColorFactory.fromCSS(`#c5c7c5`)),
            this.createPrefab(ColorFactory.fromCSS(`#808080`))
        ];
    }

}
