import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Game} from "@engine/core/game";
import {ResourceHolder} from "../resource/resourceHolder";
import {
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {Button} from "./components/button";
import {Calculator} from "../calculator";
import {Color} from "@engine/renderer/common/color";
import {RadioButtonGroup} from "@engine/renderable/impl/ui/toggleButton/radioButton";
import {IChangeNumericSliderEvent} from "@engine/renderable/impl/ui/numericSlider/_intrtnal/abstractNumericSlider";
import {IChangeEditTextFieldEvent} from "@engine/renderable/impl/ui/textField/editTextField/editTextField";
import {IChangeSelectBoxEvent} from "@engine/renderable/impl/ui/selectBox/selectBoxEvents";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";


export class MainWidget extends VEngineRootComponent {

    private calculator:Calculator = new Calculator();

    private refs:Record<string, any> = {};

    private glitches:boolean = true;
    private textColor:IColor = Color.GREY.clone();

    private colors = [
        ColorFactory.fromCSS('#74b55f'),
        ColorFactory.fromCSS('#fff'),
        ColorFactory.fromCSS('#f57171'),
        ColorFactory.fromCSS('#697cee'),
        ColorFactory.fromCSS('#efc8a5'),
    ];
    private colorSelected:number = 0;
    private textAlign:AlignTextContentHorizontal = AlignTextContentHorizontal.RIGHT;
    private horizontalScrollValue:number = 50;
    private editedText:string = 'text';
    private listData:({index:number})[] = [];

    constructor(game:Game, private resourceHolder:ResourceHolder) {
        super(game);
        this.refs.radioGroup = new RadioButtonGroup();

        for (let i=0;i<120;i++) {
            this.listData.push({index:i});
        }

    }

    public render(): JSX.Element {
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
                    alignTextContentHorizontal={this.textAlign}
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
                        changed={e=>this.onGlitchChanged(e)}/>

                    <v_textField pos={{x:50,y:50}} font={this.resourceHolder.fnt} text={'text color'}/>
                    <v_selectBox
                        pos={{x:170,y:50}}
                        padding={[5]}
                        size={{width: 120, height:100}}
                        font={this.resourceHolder.fnt}
                        textColor={this.textColor}
                        data={this.colors}
                        renderItem={(it:Color)=>
                            <v_textField
                                autoSize={true}
                                textColor={it}
                                font={this.resourceHolder.fnt}
                                text={it.asCssHex()}/>
                        }
                        selectedIndex={this.colorSelected}
                        changed={e=>this.onTextColorChanged(e)}
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundSelected={()=>this.resourceHolder.buttonBgActive}/>

                    <v_textField pos={{x:50,y:160}} font={this.resourceHolder.fnt} text={'align'}/>
                    <v_radioButton
                        pos={{x:170,y:160}}
                        ref={e=>this.refs.radio1 = e}
                        checked={this.textAlign===AlignTextContentHorizontal.LEFT}
                        padding={[2]}
                        size={{width:20,height:20}}
                        changed={_=>this.onAlignTextClick(AlignTextContentHorizontal.LEFT)}
                        backgroundChecked={()=>this.resourceHolder.checkBoxCheckedBg}
                        radioGroup={this.refs.radioGroup}/>
                    <v_textField click={_=>this.refs.radio1.toggle()} pos={{x:200,y:160}} font={this.resourceHolder.fnt} text={'left'}/>
                    <v_radioButton
                        pos={{x:170,y:190}}
                        ref={e=>this.refs.radio2 = e}
                        checked={this.textAlign===AlignTextContentHorizontal.CENTER}
                        changed={_=>this.onAlignTextClick(AlignTextContentHorizontal.CENTER)}
                        padding={[2]}
                        size={{width:20,height:20}}
                        backgroundChecked={()=>this.resourceHolder.checkBoxCheckedBg}
                        radioGroup={this.refs.radioGroup}/>
                    <v_textField click={_=>this.refs.radio2.toggle()} pos={{x:200,y:190}} font={this.resourceHolder.fnt} text={'center'}/>
                    <v_radioButton
                        pos={{x:170,y:220}}
                        ref={e=>this.refs.radio3 = e}
                        checked={this.textAlign===AlignTextContentHorizontal.RIGHT}
                        changed={_=>this.onAlignTextClick(AlignTextContentHorizontal.RIGHT)}
                        padding={[2]}
                        size={{width:20,height:20}}
                        backgroundChecked={()=>this.resourceHolder.checkBoxCheckedBg}
                        radioGroup={this.refs.radioGroup}/>
                    <v_textField click={_=>this.refs.radio3.toggle()} pos={{x:200,y:220}} font={this.resourceHolder.fnt} text={'right'}/>

                    <v_progressBar
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundProgress={()=>this.resourceHolder.progressBarPattern}
                        progress={this.horizontalScrollValue}
                        max={100}
                        padding={[5]}
                        size={{width:200,height:30}}
                        pos={{x:50,y:260}}/>

                </v_rectangle>

                <v_rectangle pos={{x:0,y:330}} lineWidth={0} size={{width:540,height:100}} fillColor={{r:12,g:12,b:12,a:10}}>
                    <v_imageButton
                        pos={{x:10,y:10}}
                        size={{width:50,height:50}}
                        scale={{x:0.5,y:0.5}}
                        click={e=>this.refs.imgButtonLabel.setText('1')}
                        imgOn={()=>this.resourceHolder.imgOn}
                        imgOff={()=>this.resourceHolder.imgOff}/>
                    <v_imageButton
                        pos={{x:50,y:10}}
                        size={{width:50,height:50}}
                        scale={{x:0.5,y:0.5}}
                        click={e=>this.refs.imgButtonLabel.setText('2')}
                        imgOn={()=>this.resourceHolder.imgOn}
                        imgOff={()=>this.resourceHolder.imgOff}/>
                    <v_imageButton
                        pos={{x:90,y:10}}
                        size={{width:50,height:50}}
                        scale={{x:0.5,y:0.5}}
                        click={e=>this.refs.imgButtonLabel.setText('3')}
                        imgOn={()=>this.resourceHolder.imgOn}
                        imgOff={()=>this.resourceHolder.imgOff}/>
                    <v_textField
                        ref={e=>this.refs.imgButtonLabel = e}
                        pos={{x:130,y:10}}
                        font={this.resourceHolder.fnt}/>
                    <v_horizontalNumericSlider
                        max={100}
                        value={this.horizontalScrollValue}
                        changed={e=>this.onHorizontalScrollChanged(e)}
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundHandler={()=>this.resourceHolder.checkBoxCheckedBg}
                        size={{width:100,height:20}}
                        pos={{x:10,y:50}}/>
                    <v_textField
                        text={this.horizontalScrollValue.toFixed(2)}
                        pos={{x:10,y:80}}
                        font={this.resourceHolder.fnt}/>

                    <v_verticalNumericSlider
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundHandler={()=>this.resourceHolder.checkBoxCheckedBg}
                        size={{width:20,height:80}}
                        pos={{x:150,y:10}}/>
                    <v_verticalNumericSlider
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundHandler={()=>this.resourceHolder.checkBoxCheckedBg}
                        size={{width:20,height:80}}
                        pos={{x:200,y:10}}/>
                    <v_verticalNumericSlider
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundHandler={()=>this.resourceHolder.checkBoxCheckedBg}
                        size={{width:20,height:80}}
                        pos={{x:250,y:10}}/>
                    <v_verticalNumericSlider
                        background={()=>this.resourceHolder.buttonBg}
                        backgroundHandler={()=>this.resourceHolder.checkBoxCheckedBg}
                        size={{width:20,height:80}}
                        pos={{x:300,y:10}}/>
                    <v_editTextField
                        multiline={false}
                        cursorColor={{r:100,g:10,b:10}}
                        text={this.editedText}
                        changed={e=>this.onEditTextChanged(e)}
                        pos={{x:400,y:10}}
                        background={()=>this.resourceHolder.buttonBg}
                        size={{width:100,height:60}}
                        font={this.resourceHolder.fnt}/>
                    <v_richTextField
                        wordBrake={WordBrake.FIT}
                        size={{width:100,height:20}}
                        background={()=>this.resourceHolder.buttonBgActive}
                        richText={<v_font size={12} color={{r:100,g:0,b:0}}>{this.editedText}</v_font>}
                        pos={{x:400,y:75}}
                        font={this.resourceHolder.fnt}/>
                </v_rectangle>
                <v_verticalList
                    pos={{x:550,y:10}}
                    padding={[10]}
                    size={{width:200,height:200}}
                    background={()=>this.resourceHolder.buttonBgActive}
                    data={this.listData}
                    renderItem={(item:{index:number})=>
                        <v_textField
                            background={()=>this.resourceHolder.textFieldBg}
                            text={'---->'+item.index+'<----'}
                            font={this.resourceHolder.fnt}/>
                    }/>
                <v_horizontalList
                    pos={{x:550,y:225}}
                    padding={[10]}
                    size={{width:200,height:90}}
                    background={()=>this.resourceHolder.buttonBg}
                    data={this.listData}
                    renderItem={(item:{index:number})=>
                        <v_textField
                            margin={[5]}
                            size={{width:100,height:60}}
                            background={()=>this.resourceHolder.textFieldBg}
                            text={'---->'+item.index+'<----'}
                            font={this.resourceHolder.fnt}/>
                    }/>
            </>
        );
    }

    @Reactive.Method()
    private onCalcButtonClick(str:string):void {
        this.calculator.keyPress(str);
    }

    @Reactive.Method()
    private onAlignTextClick(value:AlignTextContentHorizontal):void {
        this.textAlign = value;
    }

    @Reactive.Method()
    private onGlitchChanged(e:{value:boolean}):void {
        this.glitches = e.value;
    }

    @Reactive.Method()
    private onTextColorChanged(e:IChangeSelectBoxEvent):void {
        this.colorSelected = e.selectedIndex;
    }

    @Reactive.Method()
    private onHorizontalScrollChanged(e:IChangeNumericSliderEvent):void {
        this.horizontalScrollValue = e.value;
    }

    @Reactive.Method()
    private onEditTextChanged(e:IChangeEditTextFieldEvent):void {
        this.editedText = e.value;
    }

}
