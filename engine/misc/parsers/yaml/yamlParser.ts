import {Parser} from "@engine/misc/parsers/yaml/internal/parser";

// based on https://github.com/jeremyfa/yaml.js

export class YamlParser {

    private readonly result:any;

    constructor(str:string) {
        this.result = new Parser().parse(str, true);
    }

    public getResult():any {
        return this.result;
    }

}
