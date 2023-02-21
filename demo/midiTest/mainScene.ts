import {Scene} from "@engine/scene/scene";
import {DebugLayer} from "@engine/scene/debugLayer";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MidiTracker} from "./midi-player/midiTracker";
import {IMidiJson} from "./midi-player/internal/types";

export class MainScene extends Scene {

    override onReady() {

        const debugLayer = new DebugLayer(this.game);
        this.appendChild(debugLayer);

        const jsonTracks = [
            'drum_demo',
            'jazz1',
            'bach',
            'metallica2',
            'rock2',
            'c',
            'e',
            'jazz2',
            'b',
            'd', 'f',
            'intro',
        ]

        // https://www.midis101.com/search/Jazz
        const midiTracks = [
            'TurnThePage',
            'jazzinterlude50',
            'Seek_and_Destroy',
            'Metallica - Bleeding Me',
            'Dance_Techno_ditsmylife',
            'Dance_Techno_dxfiles',
            'd-beautifullife (1)',
            'Terminator2-JudgmentDay',
            'Accordeon-Polka',
            '07-lacri',
            '08-domin',
            '10-sanct',
            'Beethoven-Moonlight-Sonata',
            'sym40-1',
            'mozart_sonata_2-pianos_375_2_(c)ishenko',
            'piano_sonata_457_1_(c)oguri',
            'Carol-Of-The-Bells-2',
            'Time-After-Time-1',
            'Scott Brown - Pro-To-Plasm',
            'Apocalyptica-Nothing Else Matters(3Cello Experiment)',
            'a_foggy_day_r_gw',
            'lullaby',
            'a_day_in_the_life_of_a_fool_jhall',
            'ALIGATOR',
            'Jazz_Unknown__Jp063',
            'jazzpiano',
            'bethleem2',
            'gonewind',
            'Bach Prelude No 1 (Ave Maria)',
            'AutumnLeaves',
            'Blitzkreig',
            'toccata',
            'kozak03',
            'vchora-bula-divka',
            'oi_marichko_VOICE',
            'get_ready_gr_kar',
            'bad_to_me_gr_kar',
            'duck-tales-title-screen',
            'Wild Gunman_title',
            'Ninja Gaiden 3 act-1-stage-1',
            'mario_phase-1',
            'Excitebike title',
            'bomberman',
            'underwater',
            'terminator-stage-1',
            'Michael_Jackson_-_Billie_Jean',
            'Metallica_-_The_Four_Horsemen',
            'Metallica_-_Phantom_Lord',
            'Battery',
        ]

        const trackType:string = 'midi';
        const tracks = trackType==='json'?jsonTracks:midiTracks;

        let i = -1;

        const tracker = new MidiTracker();

        const loadNextTrack = async (inc:number)=>{
            i+=inc;
            if (i<0) i = tracks.length - 1;
            else if (i>tracks.length-1) i = 0;

            debugLayer.log(`loading track ${i}: ${tracks[i]}...`)

            if (trackType==='json') {
                const json = await new ResourceLoader(this.game).loadJSON<IMidiJson>(`./midiTest/data/tone/${tracks[i]}.json`);
                tracker.setTrackFromJSON(json);
            } else {
                const data = await new ResourceLoader(this.game).loadBinary(`./midiTest/data/midi/${tracks[i]}.mid`);
                tracker.setTrackFromMidiBin(data);
            }

            await tracker.play1();
            debugLayer.log(`${tracks[i]}: Ready`);
            debugLayer.log(`Press "->" to play next track`);
        }

        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, async e=>{
            if (e.button===KEYBOARD_KEY.RIGHT) {
                await loadNextTrack(1);
            }
            if (e.button===KEYBOARD_KEY.LEFT) {
                await loadNextTrack(-1);
            }
        });

        debugLayer.log(`Press "->" to load next track`);
        debugLayer.log(`Press "<-" to load previous track`);
    }

}
