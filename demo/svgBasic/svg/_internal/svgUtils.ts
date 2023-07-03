import {Color} from "@engine/renderer/common/color";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {DebugError} from "@engine/debug/debugError";
import {BasicStringTokenizer} from "@engine/renderable/impl/geometry/_internal/basicStringTokenizer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Game} from "@engine/core/game";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {BitmapCacheHelper} from "@engine/renderable/bitmapCacheHelper";
import {AlphaMaskFilter} from "@engine/renderer/webGl/filters/texture/alphaMaskFilter";
import {XmlNode} from "@engine/misc/parsers/xml/xmlElements";
import {isNumber} from "@engine/misc/object";

export namespace SvgUtils {

    export const getColor = (literal:string)=>{
        if (literal.indexOf('url')===0) {
            console.log(`urls is not supported for color: ${literal}`);
            return Color.NONE.clone();
        }
        if (!literal) return Color.NONE.clone();
        if (['inherit','none'].indexOf(literal)>-1) return Color.NONE.clone();
        return ColorFactory.fromCSS(literal);
    };

    export const getString = (literal:string,defaultValue:string):string=>{
        if (!literal) return defaultValue;
        else return literal;
    };

    export const getNumber = (literal:string,defaultValue:number):number=>{
        if (!literal) return defaultValue;
        const val:number = parseFloat(literal);
        if (Number.isNaN(val)) return defaultValue;
        else return val;
    };

    // https://oreillymedia.github.io/Using_SVG/guide/units.html
    export const calcNumberWithMeasure = (val:number,measure:string,containerSize:number,):number=>{
        if (!measure) return val;
        switch (measure) {
            case '%':
                return val*containerSize/100;
            case 'px':
                return val;
            case 'mm':
                // 1cm ≅ 37.795px
                return val*0.01*37.795;
            case 'cm':
                return val*37.795;
            case 'in':
                return val*96;
            case 'pc':
                return val*16;
            case 'pt':
                // 1pt ≅ 1.3333px
                return val*1.3333;
            default:
                throw new DebugError(`unknown measure: ` + measure);
        }
    };

    export const resolveFontMeasure = (el:XmlNode,attr:string,rootContainer:RenderableModel,defaultVal:number):number=> {
        const fontSizeAttrVal = el.getAttribute(attr);
        if (!fontSizeAttrVal) return defaultVal;
        const defaultSize = 16;
        if (fontSizeAttrVal.trim().toLowerCase().endsWith('em')) {
            let val = parseInt(fontSizeAttrVal)*defaultSize;
            if (!isNumber(val) || val<=0) val = defaultSize;
            return val;
        }
        switch (fontSizeAttrVal) {
            case 'xx-small': return defaultSize-6;
            case 'x-small': return defaultSize-4;
            case 'small': return defaultSize-2;
            case 'smaller': return defaultSize-1;
            case 'medium': return defaultSize;
            case 'large': return defaultSize+2;
            case 'larger': return defaultSize+3;
            case 'x-large': return defaultSize+4;
            case 'xx-large': return defaultSize+6;
            case 'xxx-large': return defaultSize+8;
            case 'math':
            case 'inherit':
            case 'initial':
            case 'revert':
            case 'revert-layer':
            case 'unset':
                return defaultSize;
        }
        let val = getNumberWithMeasure(fontSizeAttrVal,rootContainer.size.width,defaultVal);
        if (!isNumber(val) || val<=0) val = defaultVal;
        return val;
    }

    export const getNumberWithMeasure = (literal:string,containerSize:number,defaultValue:number):number=>{
        if (!literal) return defaultValue;
        if (literal==='none') return defaultValue;
        const tokenizer = new BasicStringTokenizer(literal);
        const val:number = tokenizer.getNextNumber();
        const measure:string = !tokenizer.isEof()?tokenizer.getNextToken(tokenizer._CHAR+'%'):'';
        return calcNumberWithMeasure(val,measure,containerSize);
    };

    export const getNumberArray = <T>(literal:string,size:number,defaultItemValue:number):T=>{
        let arr:number[];
        if (!literal) {
            arr = Array(size);
            arr.fill(defaultItemValue);
            return arr as unknown as T;
        }
        arr = literal.split(' ').map(it=>parseFloat(it));
        for (let i:number=0;i<size;i++) {
            if (!arr[i]) arr[i] = defaultItemValue;
        }
        return arr as unknown as T;
    };

    const fitContainerToChildren = (model:RenderableModel)=> {
        const maxWidth = Math.max(...[0,...model._children.map(it=>it.pos.x+it.size.width)]);
        const maxHeight = Math.max(...[0,...model._children.map(it=>it.pos.y+it.size.height)]);
        model.size.setWH(maxWidth,maxHeight);
    }

    export const applyFillGradient = (game:Game,model:RenderableModel,gradient:AbstractGradient):RenderableModel=>{
        if (model.getChildrenCount()>0) {
            fitContainerToChildren(model);
        }
        if (model.size.width===0 || model.size.height===0) return model;
        const gradientedRect = new Rectangle(game);
        gradientedRect.size.setFrom(model.size);
        gradientedRect.fillGradient = gradient;
        const cached = BitmapCacheHelper.cacheAsBitmap(game,model);
        gradientedRect.filters = [new AlphaMaskFilter(game,cached.getTexture(),'a')];

        const drawingSurface = new DrawingSurface(game,model.size);
        drawingSurface.drawModel(gradientedRect);

        cached.destroy();
        return drawingSurface;
    }

}
