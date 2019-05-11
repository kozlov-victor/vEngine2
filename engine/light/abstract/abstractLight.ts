import {DebugError} from "@engine/debug/debugError";


import {Game} from "../../game";
import {Color} from "../../renderer/color";
import {IKeyVal} from "@engine/misc/object";
import {UNIFORM_VALUE_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FastMap} from "@engine/misc/fastMap";

export abstract class AbstractLight {

    public color:Color = Color.WHITE.clone();
    public intensity:number = 1.0;

    protected constructor(protected game:Game){
        if (DEBUG && !game) throw new DebugError(`game instanse is not passed to AbstractLight constructor`);
        this.game = game;
    }

    abstract setUniformsToMap(map:FastMap<string,UNIFORM_VALUE_TYPE>, i:number):void;

}