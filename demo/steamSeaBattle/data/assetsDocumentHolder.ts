
import * as docDesc from './scenes.xml';
import {Document} from "@engine/misc/xmlUtils";

export abstract class AssetsDocumentHolder {

    public static getDocument():Document {
        if (AssetsDocumentHolder.document===undefined) {
            AssetsDocumentHolder.document = Document.create(docDesc);
        }
        return AssetsDocumentHolder.document;
    }

    private static document:Document;

    private constructor(){

    }

}
