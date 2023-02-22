import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export interface IParticleModifier {
    onEmitParticle(p:RenderableModel):void;
}
