import * as docDesc from './scenes.xml';
import {XmlDocument} from "@engine/misc/parsers/xml/xmlElements";

export abstract class AssetsDocumentHolder {

    private static document:XmlDocument;

    public static getDocument():XmlDocument {
        if (AssetsDocumentHolder.document===undefined) {
            AssetsDocumentHolder.document = docDesc;
        }
        return AssetsDocumentHolder.document;
    }

}
