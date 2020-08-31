import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {DebugError} from "@engine/debug/debugError";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IResource} from "@engine/core/declarations";

export abstract class RenderableModelWithResourceLink extends RenderableModel implements IResource<ITexture>{

    // resource
    private _resourceLink:ResourceLink<ITexture>;

    public setResourceLink(link:ResourceLink<ITexture>):void{
        if (DEBUG) {
            if (!link) {
                throw new DebugError(`can not set resource link: link passed is ${link}`);
            }
        }
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

}