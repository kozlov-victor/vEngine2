import {ResourceLink, ResourceLinkState} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export abstract class RenderableModelWithTexture extends RenderableModel {

    private _texture:ITexture;

    public setTexture(texture:ITexture):void{
        if (DEBUG) {
            if (!texture) {
                throw new DebugError(`can not set texture: texture passed is undefined`);
            }
            if (!texture.size || texture.size.width===0 || texture.size.height===0) {
                throw new DebugError(`can not set resource texture: wrong texture size: (width: ${texture.size.width}, height: ${texture.size.height})`);
            }
        }
        this._texture = texture;
    }

    public getTexture():ITexture{
        return this._texture;
    }

}
