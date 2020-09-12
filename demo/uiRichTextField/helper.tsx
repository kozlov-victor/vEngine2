import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";


export const createRichText = ()=>{
    return (
        <div>
            <b>Lorem ipsum <i>dolor sit amet,</i>
                <font color={{r:255,g:100,b:100}}>consectetur 🥰 adipiscing elit,</font>
            </b>
            sed 🥰 do 🥰 eiusmod tempor incididunt ut labore et dolore magna aliqua.  eur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            2Lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit,
            <i>sed do eiusmod tempor</i> incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
            <font color={{r:122,g:244,b:133}}>
                Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur.
                <font color={{r:244,g:244,b:233}}>Excepteur sint occaecat cupidatat non proident,</font>
                sunt in culpa qui officia deserunt
                mollit anim id est laborum.
            </font>
        </div>
    );
}
