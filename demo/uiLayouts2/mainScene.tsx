import {Scene} from "@engine/scene/scene";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Assets} from "./assets";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {AlignTextContentHorizontal, AlignTextContentVertical} from "@engine/renderable/impl/ui/textField/textAlign";

class SceneUI extends VEngineTsxComponent {

    constructor(private game: Game,private assets:Assets) {
        super(new VEngineTsxDOMRenderer(game));

    }

    public override render(): JSX.Element {
        return(
            <>
                <v_linearLayout
                    padding={[5]}
                    background={()=>this.assets.layoutBg}
                    pos={{x:this.game.width/2,y:this.game.height/2}}
                    anchorPoint={{x:225,y:150}}
                    size={{width:460,height:300}}>
                    <v_textField
                        margin={[10]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.LEFT}
                        size={{width:150,height:50}}
                        text={'Login'}
                        font={this.assets.fnt}/>
                    <v_editTextField
                        margin={[10]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                        background={()=>this.assets.textBg}
                        size={{width:300,height:50}}
                        multiline={false}
                        font={this.assets.fnt}/>
                    <v_textField
                        margin={[10]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.LEFT}
                        size={{width:150,height:50}}
                        text={'Password'}
                        font={this.assets.fnt}/>
                    <v_editTextField
                        margin={[10]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                        background={()=>this.assets.textBg}
                        size={{width:300,height:50}}
                        multiline={false}
                        font={this.assets.fnt}/>
                    <v_textField
                        margin={[10]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.LEFT}
                        size={{width:150,height:50}}
                        text={'Save'}
                        font={this.assets.fnt}/>
                    <v_checkBox
                        margin={[10]}
                        padding={[5]}
                        size={{width:50,height:50}}/>
                    <v_button
                        background={()=>this.assets.buttonBg}
                        backgroundActive={()=>this.assets.buttonBgActive}
                        margin={[10]}
                        size={{width:450,height:50}}
                        font={this.assets.fnt}
                        text={'Submit'}/>
                    <v_textField
                        margin={[10]}
                        alignTextContentVertical={AlignTextContentVertical.CENTER}
                        alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                        size={{width:450,height:50}}
                        text={'Enter Your credentials, Please'}
                        font={this.assets.fnt}/>

                </v_linearLayout>
            </>
        );
    }

    @ReactiveMethod()
    private onSubmit() {

    }

}


export class MainScene extends Scene {

    private assets = new Assets(this);

    public override onReady():void {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);

        const mainSceneUI = new SceneUI(this.game,this.assets);
        mainSceneUI.mountTo(root);
    }

}
