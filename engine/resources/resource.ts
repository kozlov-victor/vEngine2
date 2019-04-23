import {ResourceLink} from "./resourceLink";


export abstract class Resource<T> { // todo gameObject and spriteSheets are resources

    private _resourceLink:ResourceLink<T>;

    setResourceLink(link:ResourceLink<T>):void{
        this._resourceLink = link;
    }

    getResourceLink():ResourceLink<T>{
        return this._resourceLink;
    }

    protected setClonedProperties(cloned:Resource<T>):void {
        cloned.setResourceLink(this.getResourceLink());
    }

}