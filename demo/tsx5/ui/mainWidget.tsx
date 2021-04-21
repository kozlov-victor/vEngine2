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
import {Color} from "@engine/renderer/common/color";
import {IChangeSelectBoxEvent} from "@engine/renderable/impl/ui/selectBox/selectBox";


export class MainWidget extends VEngineTsxComponent<{}> {

    private calculator:Calculator = new Calculator();

    private refs:Record<string, any> = {};

    private glitches:boolean = true;
    private textColor:IColor = Color.GREY.clone();

    private colors = [
        Color.fromCssLiteral('#74b55f'),
        Color.fromCssLiteral('#fff'),
        Color.fromCssLiteral('#f57171'),
        Color.fromCssLiteral('#697cee'),
        Color.fromCssLiteral('#efc8a5'),
    ];
    private colorLabels = this.colors.map(it=>it.asCssHex());
    private colorSelected:number = 0;

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
                    textColor={this.colors[this.colorSelected]}
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
                        textColor={this.textColor}
                        onClick={()=>this.onCalcButtonClick(it)}
                    />
                )}

                {['4','5','6','-'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:155}}
                        r={this.resourceHolder}
                        text={it}
                        textColor={this.textColor}
                        onClick={()=>this.onCalcButtonClick(it)}
                    />
                )}

                {['1','2','3','*'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:210}}
                        r={this.resourceHolder}
                        text={it}
                        textColor={this.textColor}
                        onClick={()=>this.onCalcButtonClick(it)}
                    />
                )}

                {['=','0','.','/'].map((it,index)=>
                    <Button
                        pos={{x:index*55,y:265}}
                        r={this.resourceHolder}
                        text={it}
                        textColor={this.textColor}
                        onClick={()=>this.onCalcButtonClick(it)}
                    />
                )}

                <v_rectangle pos={{x:240,y:10}} lineWidth={0} size={{width:300,height:308}} fillColor={{r:12,g:12,b:12,a:10}}>
                    <v_textField click={_=>this.refs.glitchesCheckBox.toggle()} pos={{x:50,y:20}} font={this.resourceHolder.fnt} text={'glitches'}/>
                    <v_checkBox
                        ref={e=>this.refs.glitchesCheckBox = e}
                        pos={{x:170,y:20}}
                        size={{width:20,height:20}}
                        padding={[2]}
                        checked={this.glitches}
                        changed={this.onGlitchChanged}/>

                    <v_textField pos={{x:50,y:50}} font={this.resourceHolder.fnt} text={'text color'}/>
                    <v_selectBox
                        pos={{x:170,y:50}}
                        padding={[5]}
                        size={{width: 120, height:100}}
                        font={this.resourceHolder.fnt}
                        textColor={this.textColor}
                        options={this.colorLabels}
                        selectedIndex={this.colorSelected}
                        changed={this.onTextColorChanged}
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundSelected={()=>this.resourceHolder.buttonBgActive}/>

                </v_rectangle>

            </>
        );
    }


    private onCalcButtonClick(str:string):void {
        this.calculator.keyPress(str);
        this.triggerRendering();
    }

    private onGlitchChanged = (e:{value:boolean}):void=> {
        this.glitches = e.value;
        this.triggerRendering();
    }

    private onTextColorChanged = (e:IChangeSelectBoxEvent):void=> {
        this.colorSelected = e.selectedIndex;
        this.triggerRendering();
    }

}
