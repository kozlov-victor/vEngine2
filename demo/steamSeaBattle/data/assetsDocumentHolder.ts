import * as docDesc from './scenes.xml';
import {Document} from "@engine/misc/xmlUtils";

export abstract class AssetsDocumentHolder {

    private constructor(){

    }

    private static document:Document;

    public static getDocument():Document {
        if (AssetsDocumentHolder.document===undefined) {
            AssetsDocumentHolder.document = docDesc;
        }
        return AssetsDocumentHolder.document;
    }

}
