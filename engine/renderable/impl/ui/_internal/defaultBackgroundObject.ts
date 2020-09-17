import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";

export const DEFAULT_BACKGROUND_OBJECT_TYPE = 'DefaultBackgroundObject' as const;

export class DefaultBackgroundObject extends NullGameObject {
    type:string = DEFAULT_BACKGROUND_OBJECT_TYPE;
}
