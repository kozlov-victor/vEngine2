import {Scene} from "@engine/scene/scene";
import {DebugLayer} from "@engine/scene/debugLayer";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {IMidiJson, Tracker} from "./midi";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

export class MainScene extends Scene {

    override onReady() {

        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);

        const audio = document.createElement('audio');
        document.body.appendChild(audio);
        let ready = false;

        const tracks = [
            'metallica2',
            'rock2',
            'c',
            'e',
            'jazz1',
            'jazz2',
            'b',
            'd', 'f',
            'intro',
        ]
        let i = 0;

        const loadNextTrack = async ()=>{
            ready = false;
            audio.pause();
            i = i % tracks.length;
            debugLayer.log(`loading track: ${tracks[i]}...`)
            const json = await new ResourceLoader(this.game).loadJSON<IMidiJson>(`./midiTest/data/tone/${tracks[i]}.json`);
            const tracker = new Tracker();
            tracker.setTrack(json);
            audio.src = await tracker.toURL(n=>debugLayer.println(`${~~(n*100)}%`));
            debugLayer.log(`Ready`);
            debugLayer.log(`Press "ENTER" to play track`);
            debugLayer.log(`Press "->" to load next track`);
            ready = true;
            i++;
        }

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, async e=>{
            if (e.button===KEYBOARD_KEY.ENTER) {
                if (ready) audio.play().then();
            } else if (e.button===KEYBOARD_KEY.RIGHT) {
                loadNextTrack().then();
            }
        });


        loadNextTrack().then();

    }

}
