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
import {Calculator} from "../calculator";


export class MainWidget extends VEngineTsxComponent<{}> {

    private calculator:Calculator = new Calculator();

    private glitches:boolean = true;
    private refs:Record<string, any> = {};

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
                    filters={this.glitches?[this.resourceHolder.textFieldFilter1]:[]}
                    text={this.calculator.getDisplayNumber()}/>

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

                <v_rectangle pos={{x:240,y:10}} lineWidth={0} size={{width:300,height:308}} fillColor={{r:12,g:12,b:12,a:10}}>
                    <v_textField click={_=>this.refs.glitchesCheckBox.toggle()} pos={{x:50,y:20}} font={this.resourceHolder.fnt} text={'glitches'}/>
                    <v_checkBox
                        ref={e=>this.refs.glitchesCheckBox = e}
                        pos={{x:150,y:20}}
                        size={{width:20,height:20}}
                        padding={[2]}
                        checked={this.glitches}
                        changed={e=>this.onGlitchChanged(e.value)}/>
                </v_rectangle>

            </>
        );
    }


    private onClick(str:string):void {
        this.calculator.keyPress(str);
        this.triggerRendering();
    }

    private onGlitchChanged(val:boolean):void {
        this.glitches = val;
        this.triggerRendering();
    }

}
