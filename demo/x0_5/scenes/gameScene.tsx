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
    @DI.Inject(AlertService) private alertService: AlertService;

    private board = new Board(this.aiLevel);
    private currentSelection = {x:-1,y:-1};
    private rowToAnimate: Cell[] = [];

    constructor(game: Game, private aiLevel: number) {
        super(game);
    }

    @Reactive.OnKeyPressed(KEYBOARD_KEY.UP)
    private onKeyUp() {
        this.moveSelectionByKeys(0,-1);
    }

    @Reactive.OnKeyPressed(KEYBOARD_KEY.DOWN)
    private onKeyDown() {
        this.moveSelectionByKeys(0,1);
    }

    @Reactive.OnKeyPressed(KEYBOARD_KEY.LEFT)
    private onKeyLeft() {
        this.moveSelectionByKeys(-1,0);
    }

    @Reactive.OnKeyPressed(KEYBOARD_KEY.RIGHT)
    private onKeyRight() {
        this.moveSelectionByKeys(1,0);
    }

    @Reactive.OnKeyPressed(KEYBOARD_KEY.ENTER)
    private onKeyEnter() {
        this.onCellClicked(this.currentSelection.y,this.currentSelection.x);
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
        //await this.alertService.show('test check hello',AlertService.successColor);
        const result = await this.board.actByUser(j,i);
        switch (result.result) {
            case 'keep':
                return;
            case 'loose':
            case 'win':
                await wait(600);
                for (const c of result.cells!) {
                    this.rowToAnimate.push(c);
                    await wait(300);
                }
                await wait(300);
                if (result.result==='win') {
                    await this.alertService.show('Ви виграли :)',AlertService.successColor);
                }
                else {
                    await this.alertService.show('Ви програли :(',AlertService.errorColor);
                }
                await wait(1000);
                this.game.runScene(new MenuScene(this.game));
                break;
            case 'tie':
                await this.alertService.show("Ніч'я",AlertService.neutralColor);
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
                <v_verticalLayout
                    mouseMove={this.onBoardMouseMove}
                    layoutPos={{vertical:'center',horizontal:'center'}}
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
                </v_verticalLayout>
                {this.alertService.getElement()}
            </>
        )
    }

}

@DI.Injectable()
export class GameScene extends Scene {

    @Resource.ResourceHolder() private assets: Assets;
    public override backgroundColor = ColorFactory.fromCSS('green');

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
