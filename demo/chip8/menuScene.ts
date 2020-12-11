import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font";
import {LIST_VIEW_EVENTS, ListView, ListViewItem} from "@engine/renderable/impl/ui/scrollViews/listView";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MainScene} from "./mainScene";

const roms:string[] = [
    'chip8/roms/BRIX',
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

    @Resource.Font({fontSize: 25,fontFamily:'monospace'})
    private fnt:Font;

    private listView:ListView;

    public onReady():void {

        this.listView = new ListView(this.game);
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
