import {ResourceLink} from "./resourceLink";


export abstract class Resource { // todo gameObject and spriteSheets are resources

    private _resourceLink:ResourceLink;

    setResourceLink(link:ResourceLink):void{
        this._resourceLink = link;
    }

    getResourceLink():ResourceLink{
        return this._resourceLink;
    }

    protected setClonedProperties(cloned:Resource):void {
        cloned.setResourceLink(this.getResourceLink());
    }

}