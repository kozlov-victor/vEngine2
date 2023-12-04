import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {ICloneable} from "@engine/core/declarations";


export class BatchedImage extends RenderableModel implements ICloneable<BatchedImage> {

    public readonly fillColor = new Color();
    public declare blendMode:never;

    constructor(game: Game) {
        super(game);
        this.size.setWH(16);
        this.fillColor.fromJSON(Color.GREY.toJSON());
    }

    public override _transform() {}
    public override _translate() {}


    public override update() {}

    public override render() {
        if (!this.visible) return;
        if (this.fillColor.a===0) return;
        const delta = this.game.getDeltaTime();
        const dSeconds = delta / 1000;
        if (this.velocity.x!==0) this.pos.x += this.velocity.x * dSeconds;
        if (this.velocity.y!==0) this.pos.y += this.velocity.y * dSeconds;
        if (this._angleVelocity3d.z!==0) this.angle3d.z += this._angleVelocity3d.z * dSeconds;
        this.draw();
    }

    protected override setClonedProperties(cloned: BatchedImage) {
        cloned.fillColor.fromJSON(this.fillColor.toJSON());
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
