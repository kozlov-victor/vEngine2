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

        const tracks = [
            'drum_demo',
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

        const tracker = new Tracker();

        const loadNextTrack = async ()=>{
            i = i % tracks.length;
            debugLayer.log(`loading track: ${tracks[i]}...`)
            const json = await new ResourceLoader(this.game).loadJSON<IMidiJson>(`./midiTest/data/tone/${tracks[i]}.json`);
            tracker.setTrack(json);
            await tracker.play1();
            //audio.src = await tracker.toURL(n=>debugLayer.println(`${~~(n*100)}%`));
            debugLayer.log(`${tracks[i]}: Ready`);
            debugLayer.log(`Press "->" to play next track`);
            i++;
        }

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, async e=>{
            if (e.button===KEYBOARD_KEY.RIGHT) {
                loadNextTrack().then();
            }
        });

        debugLayer.log(`Press "->" to load next track`);


    }

}
