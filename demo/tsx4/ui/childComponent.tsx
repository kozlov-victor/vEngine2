import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";


export const ChildComponent = ({radius}:{radius:number})=>{
    return (
        <>
            <v_rectangle
                size={{width:60,height:80}}
            >
                <v_circle
                    center={{x:0,y:50}}
                    fillColor={{r:32,g:233,b:53}}
                    lineWidth={3}
                    radius={radius}
                />
            </v_rectangle>
        </>
    );
};
