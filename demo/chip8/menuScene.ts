import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {
    LIST_VIEW_EVENTS,
    ListViewItem,
    VerticalListView
} from "@engine/renderable/impl/ui/scrollViews/verticalListView";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {MainScene} from "./mainScene";

const roms:string[] = [
    'chip8/roms/game Animal Race.ch8',
    'chip8/roms/BRIX',
    'chip8/roms/15PUZZLE',
    'chip8/roms/BLINKY',
    'chip8/roms/BLITZ',
    'chip8/roms/CONNECT4',
    'chip8/roms/GUESS',
    'chip8/roms/HIDDEN',
    'chip8/roms/KALEID',
    'chip8/roms/MAZE',
    'chip8/roms/MERLIN',
    'chip8/roms/MISSILE',
    'chip8/roms/PONG2',
    'chip8/roms/PUZZLE',
    'chip8/roms/SYZYGY',
    'chip8/roms/TANK',
    'chip8/roms/TETRIS',
    'chip8/roms/TICTAC',
    'chip8/roms/UFO',
    'chip8/roms/VBRIX',
    'chip8/roms/VERS',
    'chip8/roms/WIPEOFF',
    'chip8/roms/Chip8 Picture.ch8',
    'chip8/roms/Delay Timer Test.ch8',
    'chip8/roms/Fish.ch8',
    'chip8/roms/Hello.ch8',
    'chip8/roms/octojam1title.ch8',
    'chip8/roms/Particle_Demo.ch8',
    'chip8/roms/PONG.ch8',
    'chip8/roms/test.ch8',
    'chip8/roms/test_opcode.ch8',
    'chip8/roms/br8kout.ch8',
    'chip8/roms/INVADERS',
];

export class MenuScene extends Scene {

    @Resource.FontFromCssDescription({fontSize: 25,fontFamily:'monospace'})
    private fnt:Font;

    private listView:VerticalListView;

    public onReady():void {
        this.listView = new VerticalListView(this.game);
        this.listView.size.set(this.game.size);
        this.listView.setPadding(10);
        this.listView.setMargin(10);
        this.appendChild(this.listView);
        roms.forEach(it=>this.createListItem(it));
    }

    private createListItem(text:string):void{
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.textColor.setRGB(10);
        tf.size.setWH(this.game.width,40);
        tf.setText(text);
        tf.setFont(this.fnt);

        const listVIewItem:ListViewItem = new ListViewItem(tf);
        listVIewItem.on(LIST_VIEW_EVENTS.itemClick, ()=>{
            this.game.pushScene(new MainScene(this.game,text));
        });

        this.listView.addView(listVIewItem);
    }

}
