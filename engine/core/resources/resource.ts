import {ResourceLink} from "./resourceLink";


export abstract class Resource {

    private _resourceLink:ResourceLink;

    setResourceLink(link:ResourceLink){
        this._resourceLink = link;
    }

    getResourceLink(){
        return this._resourceLink;
    }


}