import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Color} from "@engine/renderer/common/color";
import {ICloneable} from "@engine/core/declarations";

export class BatchedImage extends RenderableModel implements ICloneable<BatchedImage> {

    public fillColor: Color = Color.GREY.clone();

    constructor(game: Game) {
        super(game);
        this.size.setWH(16);
    }

    public override _transform() {}
    public override _translate() {}


    public override update() {}

    public override render() {
        if (this.fillColor.a===0) return;
        const delta: number = this.game.getDeltaTime();
        const dSeconds = delta / 1000;
        if (this.velocity.x!==0) this.pos.x += this.velocity.x * dSeconds;
        if (this.velocity.y!==0) this.pos.y += this.velocity.y * dSeconds;
        if (this._angleVelocity3d.z!==0) this.angle3d.z += this._angleVelocity3d.z * dSeconds;
        this.draw();
    }

    protected override setClonedProperties(cloned: BatchedImage) {
        cloned.fillColor = this.fillColor.clone();
        super.setClonedProperties(cloned);
    }

    public clone(): BatchedImage {
        const cloned = new BatchedImage(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    public override draw() {
        this.game.getRenderer().drawBatchedImage(this);
    }
}
