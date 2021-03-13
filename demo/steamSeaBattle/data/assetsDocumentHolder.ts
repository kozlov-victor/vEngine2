import * as docDesc from './scenes.xml';
import {XmlDocument} from "@engine/misc/xmlUtils";

export abstract class AssetsDocumentHolder {

    private constructor(){

    }

    private static document:XmlDocument;

    public static getDocument():XmlDocument {
        if (AssetsDocumentHolder.document===undefined) {
            AssetsDocumentHolder.document = docDesc;
        }
        return AssetsDocumentHolder.document;
    }

}
