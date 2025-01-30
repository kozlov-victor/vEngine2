import {Scene} from "@engine/scene/scene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {DebugLayer} from "@engine/scene/debugLayer";
import {MidiTracker} from "../midiTest/midi-player/midiTracker";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


class MainScene extends Scene {

    private tracker: MidiTracker;

    override onReady() {
        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);
        debugLayer.println('click to open a file');
        this.mouseEventHandler.on(MOUSE_EVENTS.click, async _=> {
            const file = await this.openFile();
            if (!file) return;
            const buffer = await file.arrayBuffer();
            debugLayer.log(file.name);
            if (!this.tracker) this.tracker = new MidiTracker();
            this.tracker.setTrackFromMidiBin(buffer);
            this.tracker.loop(true);
            await this.tracker.play();
        });
    }

    private async openFile():Promise<File> {
        return new Promise<File>((res, rej) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = _ => {
                const file = input.files?.[0];
                if (!file) return;
                res(file);
            };
            input.click();
        });
    }

}

const game = new Game({width:1024, height: 600});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.addControl(KeyboardControl);
game.runScene(new MainScene(game));
