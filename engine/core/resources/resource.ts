import {ResourceLink} from "./resourceLink";


export abstract class Resource { // todo gameObject and spriteSheets are resources

    private _resourceLink:ResourceLink;

    setResourceLink(link:ResourceLink){
        this._resourceLink = link;
    }

    getResourceLink(){
        return this._resourceLink;
    }


    protected setClonedProperties(cloned:Resource) {
        cloned.setResourceLink(this.getResourceLink());
    }


}