import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {ResourceHolder} from "../resource/resourceHolder";
import {
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {Button} from "./components/button";


export class MainWidget extends VEngineTsxComponent<{}> {

    private text:string = '';

    constructor(private game:Game, private resourceHolder:ResourceHolder) {
        super(new VEngineTsxDOMRenderer(game));

    }

    public render():VirtualNode {
        return (
            <>
                <v_textField
                    pos={{x:0,y:10}}
                    padding={[5]}
                    font={this.resourceHolder.fnt}
                    size={{width:215,height:75}}
                    background={()=>this.resourceHolder.textFieldBg}
                    pixelPerfect={true}
                    alignTextContentHorizontal={AlignTextContentHorizontal.RIGHT}
                    wordBrake={WordBrake.PREDEFINED}
                    alignTextContentVertical={AlignTextContentVertical.CENTER}
                    text={this.text}/>

                {['7','8','9','+'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:100}}
                        r={this.resourceHolder}
                        text={it}
                        onClick={()=>this.onClick(it)}
                    />
                )}

                {['4','5','6','-'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:155}}
                        r={this.resourceHolder}
                        text={it}
                        onClick={()=>this.onClick(it)}
                    />
                )}

                {['1','2','3','*'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:210}}
                        r={this.resourceHolder}
                        text={it}
                        onClick={()=>this.onClick(it)}
                    />
                )}

                {['=','0','.','/'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:265}}
                        r={this.resourceHolder}
                        text={it}
                        onClick={()=>this.onClick(it)}
                    />
                )}

            </>
        );
    }


    private onClick(str:string):void {
        this.text +=str;
        this.triggerRendering();
    }


}
