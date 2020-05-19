
import {VEngineReact} from '@engine/renderable/jsx/jsxFactory.h';
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export const createUI = ():RenderableModel=> {
    return (
        <v_circle y={2} x={2} radius={20} color={{r:255,g:200,b:122}}>
            <v_circle x={20} y={22} radius={25} color={{r:200,g:200,b:100}}/>
        </v_circle>
    );
};

