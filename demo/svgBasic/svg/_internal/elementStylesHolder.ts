import {FastMap} from "@engine/misc/collection/fastMap";
import {XmlNode} from "@engine/misc/parsers/xml/xmlElements";

export class ElementStylesHolder {

    private map = new FastMap<XmlNode, Record<string, string>>();

    public getStyle(el:XmlNode):Record<string, string> {
        let styleMap = this.map.get(el);
        if (styleMap===undefined) {
            styleMap = this.styleAttrToMap(el.getAttribute('style'));
            this.map.put(el,styleMap);
        }
        return styleMap;
    }

    public mergeStyle(s1:string,s2:string):string {
        const map1 = this.styleAttrToMap(s1);
        const map2 = this.styleAttrToMap(s2);
        Object.keys(map2).forEach(key=>{
            map1[key] = map2[key];
        });
        let result = '';
        Object.keys(map1).forEach(key=>{
            if (!key) return;
            const value = map1[key] ?? '';
            result+=`${key}:${value};`;
        });
        return result;
    }

    private styleAttrToMap(style:string):Record<string, string> {
        const res:Record<string, string> = {};
        if (!style) return res;
        style.split(';').forEach(pair=>{
            const pairArr:string[] = pair.split(':');
            res[pairArr[0].trim()] = pairArr[1]?.trim();
        });
        return res;
    }

}
