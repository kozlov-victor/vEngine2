import {Scene} from "@engine/scene/scene";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";
import {Game} from "@engine/core/game";
import {Assets} from "../assets/assets";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Resource} from "@engine/resources/resourceDecorators";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {IObjectMouseEvent} from "@engine/control/mouse/mousePoint";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {TexturePackerAtlas} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {AtlasFrameAnimation} from "@engine/animation/frameAnimation/atlas/atlasFrameAnimation";
import {AlertService} from "./alert";
import {Board, Cell, SIZE, SYMBOL, wait} from "../game/game";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Color} from "@engine/renderer/common/color";
import {MenuScene} from "./menuScene";
import {DI} from "@engine/core/ioc";

const BOX_SIZE = 20;
const winCellColor = ColorFactory.fromCSS('red');
const commonCellColor = new Color(200,220,200);

@DI.Injectable()
class T extends BaseTsxComponent {

    private container:RenderableModel;
    @DI.Inject(Assets) private assets: Assets;

    constructor(private props:{symbol:SYMBOL,__id?:number,trackBy:string,game:Game}) {
        super();
    }

    override render(): JSX.Element {
        return <v_null_game_object ref={el=>this.container = el as RenderableModel}/> ;
    }

    override onMounted() {
        super.onMounted();
        const image = new AnimatedImage(this.props.game,this.assets.xo);
        image.appendTo(this.container);
        const atlas = new TexturePackerAtlas(this.assets.xoAtlas);
        const animation = new AtlasFrameAnimation(this.props.game,{
            frames: [
                atlas.getFrameByKey(`x_${this.props.symbol}_1`),
                atlas.getFrameByKey(`x_${this.props.symbol}_2`),
                atlas.getFrameByKey(`x_${this.props.symbol}_3`),
                atlas.getFrameByKey(`x_${this.props.symbol}_4`),
            ],
            durationOfOneFrame: 120,
            isRepeating: false,
        });
        image.addFrameAnimation(animation);
        animation.play();
    }
}

@DI.Injectable()
class GameSceneUi extends VEngineRootComponent {

    @DI.Inject(Assets) private assets: Assets;

    private board = new Board(this.aiLevel);
    private readonly BOARD_ANCHOR_POINT = {x:SIZE*BOX_SIZE/2,y:SIZE*BOX_SIZE/2};
    private currentSelection = {x:-1,y:-1};
    private rowToAnimate: Cell[] = [];

    constructor(game: Game, private aiLevel: number) {
        super(game);
        const scene = game.getCurrentScene();
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.RIGHT, _=>this.moveSelectionByKeys(1,0));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.LEFT, _=>this.moveSelectionByKeys(-1,0));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.UP, _=>this.moveSelectionByKeys(0,-1));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.DOWN, _=>this.moveSelectionByKeys(0,1));
        scene.keyboardEventHandler.onKeyPressed(KEYBOARD_KEY.ENTER, _=>
            this.onCellClicked(this.currentSelection.y,this.currentSelection.x)
        );

    }

    @Reactive.Method()
    private onBoardMouseMove(e:IObjectMouseEvent) {
        this.currentSelection.x = (e.objectX / BOX_SIZE)|0;
        this.currentSelection.y = (e.objectY / BOX_SIZE)|0;
    }

    @Reactive.Method()
    private moveSelectionByKeys(dx:number,dy:number) {
        if (this.currentSelection.x===-1 && this.currentSelection.y===-1) {
            this.currentSelection.x = 0;
            this.currentSelection.y = 0;
            return;
        }
        this.currentSelection.x +=dx;
        this.currentSelection.y +=dy;
        if (this.currentSelection.x<0) this.currentSelection.x = SIZE + this.currentSelection.x;
        if (this.currentSelection.y<0) this.currentSelection.y = SIZE + this.currentSelection.y;
        this.currentSelection.x %=SIZE;
        this.currentSelection.y %=SIZE;
    }

    @Reactive.Method()
    private async onCellClicked(j:number,i:number) {
        const result = await this.board.actByUser(j,i);
        switch (result.result) {
            case 'keep':
                return;
            case 'loose':
            case 'win':
                for (const c of result.cells!) {
                    this.rowToAnimate.push(c);
                    await wait(300);
                }
                await wait(300);
                await AlertService.show(this.game,result.result==='win'?'Ви виграли :)':'Ви програли :(');
                await wait(1000);
                this.game.runScene(new MenuScene(this.game));
                break;
            case 'tie':
                await AlertService.show(this.game,"Ніч'я");
                this.game.runScene(new MenuScene(this.game));
                break;

        }
    }

    private getCellBoarderColor(cell:Cell) {
        if (this.rowToAnimate.includes(cell)) {
            return winCellColor;
        }
        return commonCellColor;
    }

    public render(): JSX.Element {
        return (
            <>
                <v_image texture={this.assets.bg}/>
                <v_linearLayout
                    mouseMove={this.onBoardMouseMove}
                    pos={{x:this.game.getCenterX(),y:this.game.getCenterY()}}
                    anchorPoint={this.BOARD_ANCHOR_POINT}
                    size={{width:SIZE*BOX_SIZE,height:SIZE*BOX_SIZE}}
                >
                    {this.board.field.map((cells,j)=>
                        <v_horizontalLayout size={{width:SIZE*BOX_SIZE,height:BOX_SIZE}}>
                            {cells.map((cell,i)=>
                                <v_rectangle
                                    click={_=>this.onCellClicked(j,i)}
                                    size={{width:BOX_SIZE,height:BOX_SIZE}} lineWidth={1}
                                    fillColor={{r:100,g:200,b:100,a:this.currentSelection.y===j && this.currentSelection.x===i?200:0}}
                                    color={this.getCellBoarderColor(cell)}
                                >
                                    {cell.value!==undefined?
                                        <T
                                            game={this.game}
                                            symbol={cell.value}
                                            trackBy={`_${j}_${i}`}/>
                                        :undefined
                                    }
                                </v_rectangle>
                            )}
                        </v_horizontalLayout>
                    )}
                </v_linearLayout>
                {AlertService.getElement()}
            </>
        )
    }

}

@DI.Injectable()
export class GameScene extends Scene {

    @Resource.ResourceHolder() private assets: Assets;

    constructor(game: Game, private aiLevel: number) {
        super(game);
    }

    override onReady() {

        const root = new SimpleGameObjectContainer(this.game);
        root.appendTo(this);

        const ui = new GameSceneUi(this.game,this.aiLevel);
        ui.mountTo(root);
    }

}
