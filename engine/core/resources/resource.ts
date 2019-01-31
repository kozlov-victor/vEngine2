
import {BaseModel} from '../../model/baseModel'
import {TextureInfo} from "../renderer/webGl/renderPrograms/abstract/abstractDrawer";
import {ResourceLink} from "./resourceLink";


export abstract class Resource extends BaseModel {

    private _resourceLink:ResourceLink;

    setResourceLink(link:ResourceLink){
        this._resourceLink = link;
    }

    getResourceLink(){
        return this._resourceLink;
    }


}