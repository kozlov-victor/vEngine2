import {Optional} from "@engine/core/declarations";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Game} from "@engine/core/game";
import {createFontFromCssDescription} from "@engine/renderable/impl/general/font/createFontMethods/createFontFromCssDescription";
import {DEFAULT_FONT_PARAMS} from "@engine/renderable/impl/general/font/createFontMethods/params/createFontParams";

let _systemFontInstance:Optional<Font>;

export const createSystemFont = async (game:Game):Promise<Font>=> {
    _systemFontInstance =
        _systemFontInstance ||
        await createFontFromCssDescription(game,{fontSize:DEFAULT_FONT_PARAMS.fontSize,fontFamily:DEFAULT_FONT_PARAMS.fontFamily});
    return _systemFontInstance;
};
