import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";

export const DEFAULT_BACKGROUND_OBJECT_TYPE = 'DefaultBackgroundObject' as const;

export class DefaultBackgroundObject extends SimpleGameObjectContainer {
    type:string = DEFAULT_BACKGROUND_OBJECT_TYPE;
}
