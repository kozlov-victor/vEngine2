// according to
// https://github.com/carter-thaxton/midi-file/blob/master/lib/midi-parser.js
// https://github.com/Tonejs/Midi/blob/master/src/Midi.ts


import {BinBuffer} from "../../../../pix32/ym-player/internal/binBuffer";

interface IHeader {
    format: number;
    numTracks: number;
    framesPerSecond?: number;
    ticksPerFrame?: number;
    ticksPerBeat?: number;
}

interface IEvent {
    deltaTimeTicks: number;
    absoluteTimeTicks: number;
    absoluteTime: number;
    meta?: boolean;
    type?: string;
    number?: number;
    text?: string;
    channel?: number;
    port?: number;
    frameRate?: number;
    hour?: number;
    min?: number;
    sec?: number;
    frame?: number;
    subFrame?: number;
    microsecondsPerBeat?: number;
    numerator?: number;
    denominator?: number;
    metronome?: number;
    thirtyseconds?: number;
    key?: number;
    scale?: number;
    data?: number[];
    metatypeByte?: number;
    running?: boolean;
    noteNumber?: number;
    velocity?: number;
    amount?: number;
    value?: number;
    controllerType?: number;
    programNumber?: number;
    byte9?: boolean;
}

interface ITrack {
    percussion: boolean;
    channel: number;
    name: string;
    events: IEvent[];
}

const readVarInt = (p:BinBuffer)=> {
    let result = 0;
    while (!p.isEOF()) {
        const b = p.readUInt8();
        if (b & 0x80) {
            result += (b & 0x7f)
            result <<= 7;
        } else {
            // b is last byte
            return result + b;
        }
    }
    // premature eof
    return result;
}

const readUInt24 =(p:BinBuffer):number=> {
    const b0 = p.readUInt8(),
        b1 = p.readUInt8(),
        b2 = p.readUInt8();
    return (b0 << 16) + (b1 << 8) + b2
}

const readChunk = (p:BinBuffer)=> {
    const id = p.readString(4);
    const length = p.readUInt32();
    const data = p.readInts8(length);
    return {
        id,
        length,
        data,
    }
}

const parseHeader =(data:Int8[]):IHeader=> {
    const p = new BinBuffer(data);

    const format = p.readUInt16();
    const numTracks = p.readUInt16();

    const result:IHeader = {
        format: format,
        numTracks: numTracks,
    }

    const timeDivision = p.readUInt16();
    if (timeDivision & 0x8000) {
        result.framesPerSecond = 0x100 - (timeDivision >> 8)
        result.ticksPerFrame = timeDivision & 0xFF;
    } else {
        result.ticksPerBeat = timeDivision;
    }

    return result;
}

let lastEventTypeByte:number|undefined = undefined;

const readEvent =(header:IHeader,p:BinBuffer)=> {
    const deltaTimeTicks = readVarInt(p)
    const event:IEvent = {
        deltaTimeTicks,
        absoluteTimeTicks: 0,
        absoluteTime: 0,
    }

    let eventTypeByte = p.readUInt8();

    if ((eventTypeByte & 0xf0) === 0xf0) {
        // system / meta event
        if (eventTypeByte === 0xff) {
            // meta event
            event.meta = true;
            const metatypeByte = p.readUInt8() as number;
            const length = readVarInt(p);
            switch (metatypeByte) {
                case 0x00:
                    event.type = 'sequenceNumber';
                    if (length !== 2) throw "Expected length for sequenceNumber event is 2, got " + length
                    event.number = p.readUInt16();
                    return event;
                case 0x01:
                    event.type = 'text';
                    event.text = p.readString(length);
                    return event;
                case 0x02:
                    event.type = 'copyrightNotice';
                    event.text = p.readString(length);
                    return event;
                case 0x03:
                    event.type = 'trackName';
                    event.text = p.readString(length);
                    return event;
                case 0x04:
                    event.type = 'instrumentName';
                    event.text = p.readString(length);
                    return event;
                case 0x05:
                    event.type = 'lyrics';
                    event.text = p.readString(length);
                    return event;
                case 0x06:
                    event.type = 'marker';
                    event.text = p.readString(length);
                    return event;
                case 0x07:
                    event.type = 'cuePoint';
                    event.text = p.readString(length);
                    return event;
                case 0x20:
                    event.type = 'channelPrefix';
                    if (length != 1) throw "Expected length for channelPrefix event is 1, got " + length;
                    event.channel = p.readUInt8();
                    return event;
                case 0x21:
                    event.type = 'portPrefix'
                    if (length != 1) throw "Expected length for portPrefix event is 1, got " + length;
                    event.port = p.readUInt8();
                    return event;
                case 0x2f:
                    event.type = 'endOfTrack'
                    if (length != 0) throw "Expected length for endOfTrack event is 0, got " + length;
                    return event;
                case 0x51:
                    event.type = 'setTempo';
                    if (length != 3) throw "Expected length for setTempo event is 3, got " + length;
                    event.microsecondsPerBeat = readUInt24(p);
                    return event;
                case 0x54:
                    event.type = 'smpteOffset';
                    if (length != 5) throw "Expected length for smpteOffset event is 5, got " + length;
                    const hourByte = p.readUInt8();
                    const FRAME_RATES:Record<number, number> = { 0x00: 24, 0x20: 25, 0x40: 29, 0x60: 30 }
                    event.frameRate = FRAME_RATES[hourByte & 0x60];
                    event.hour = hourByte & 0x1f;
                    event.min = p.readUInt8();
                    event.sec = p.readUInt8();
                    event.frame = p.readUInt8();
                    event.subFrame = p.readUInt8();
                    return event;
                case 0x58:
                    event.type = 'timeSignature';
                    if (length != 2 && length != 4) throw "Expected length for timeSignature event is 4 or 2, got " + length
                    event.numerator = p.readUInt8();
                    event.denominator = (1 << p.readUInt8());
                    if (length === 4) {
                        event.metronome = p.readUInt8();
                        event.thirtyseconds = p.readUInt8();
                    } else {
                        event.metronome = 0x24;
                        event.thirtyseconds = 0x08;
                    }
                    return event;
                case 0x59:
                    event.type = 'keySignature';
                    if (length != 2) throw "Expected length for keySignature event is 2, got " + length
                    event.key = p.readInt8();
                    event.scale = p.readUInt8();
                    return event;
                case 0x7f:
                    event.type = 'sequencerSpecific';
                    event.data = p.readInts8(length);
                    return event;
                default:
                    event.type = 'unknownMeta';
                    event.data = p.readInts8(length);
                    event.metatypeByte = metatypeByte;
                    console.log('unknown meta',event);
                    return event;
            }
        } else if (eventTypeByte == 0xf0) {
            event.type = 'sysEx';
            const length = readVarInt(p);
            event.data = p.readInts8(length);
            return event
        } else if (eventTypeByte == 0xf7) {
            event.type = 'endSysEx';
            const length = readVarInt(p);
            event.data = p.readInts8(length);
            return event;
        } else {
            throw "Unrecognised MIDI event type byte: " + eventTypeByte;
        }
    } else {
        // channel event
        let param1: number;
        if ((eventTypeByte & 0x80) === 0) {
            // running status - reuse lastEventTypeByte as the event type.
            // eventTypeByte is actually the first parameter
            if (lastEventTypeByte === undefined)
                throw "Running status byte encountered before status byte"
            param1 = eventTypeByte
            eventTypeByte = lastEventTypeByte as Uint8;
            event.running = true;
        } else {
            param1 = p.readUInt8();
            lastEventTypeByte = eventTypeByte;
        }
        const eventType = (eventTypeByte >> 4) as number;
        event.channel = eventTypeByte & 0x0f;
        switch (eventType) {
            case 0x08:
                event.type = 'noteOff';
                event.noteNumber = param1;
                event.velocity = p.readUInt8();
                return event;
            case 0x09:
                const velocity = p.readUInt8();
                event.type = velocity === 0 ? 'noteOff' : 'noteOn'
                event.noteNumber = param1;
                event.velocity = velocity;
                if (velocity === 0) event.byte9 = true;
                return event;
            case 0x0a:
                event.type = 'noteAftertouch';
                event.noteNumber = param1;
                event.amount = p.readUInt8();
                console.log(`noteAftertouch: ${event.amount}`);
                return event;
            case 0x0b:
                event.type = 'controller';
                event.controllerType = param1;
                event.value = p.readUInt8();
                return event;
            case 0x0c:
                event.type = 'programChange';
                event.programNumber = param1 + 1;
                return event;
            case 0x0d:
                event.type = 'channelAftertouch';
                event.amount = param1;
                console.log(`channelAftertouch: ${event.amount}`);
                return event;
            case 0x0e:
                event.type = 'pitchBend';
                event.value = (param1 + (p.readUInt8() << 7)) - 0x2000;
                return event;
            default:
                throw "Unrecognised MIDI event type: " + eventType;
        }
    }
}

const parseTrack =(header:IHeader,data:Int8[]):IEvent[]=> {
    const p = new BinBuffer(data);

    const events:IEvent[] = [];
    let currentInstrumentNumber = 1;
    let absoluteTimeTicks = 0;
    let microSecondsPerBeat = 500_000;
    while (!p.isEOF()) {
        const event = readEvent(header,p);
        if (event.type==='setTempo') microSecondsPerBeat = event.microsecondsPerBeat!;
        if (event.type==='programChange') {
            currentInstrumentNumber = event.programNumber!;
        }
        if (event.type==='noteOn') event.programNumber = currentInstrumentNumber;
        absoluteTimeTicks+=event.deltaTimeTicks;
        event.absoluteTimeTicks = absoluteTimeTicks;
        events.push(event);
    }
    return events;
}

const parseMidi = (data:ArrayBuffer)=> {
    const p = new BinBuffer(data);

    const headerChunk = readChunk(p);
    if (headerChunk.id != 'MThd')
        throw "Bad MIDI file.  Expected 'MHdr', got: '" + headerChunk.id + "'"
    const header = parseHeader(headerChunk.data)

    const trackEvents:IEvent[][] = [];
    for (let i=0; !p.isEOF() && i < header.numTracks; i++) {
        const trackChunk = readChunk(p);
        if (trackChunk.id != 'MTrk')
            throw "Bad MIDI file.  Expected 'MTrk', got: '" + trackChunk.id + "'"
        const track = parseTrack(header,trackChunk.data)
        trackEvents.push(track);
    }

    return {
        header,
        trackEvents,
    }
}

const setEventsAbsoluteTime = (header:IHeader,tracks:ITrack[]):void=>{
    // Add the absolute times to each of the tracks.
    const map:Record<number, IEvent[]> = {};
    let maxTicks = 0;
    const setTempoEvents:IEvent[] = [];
    tracks.forEach(track=>{
        track.events.forEach(event=>{
           if (event.type==='setTempo') setTempoEvents.push(event);
        });
    });
    tracks.forEach(track=>{
        track.events.forEach(event=>{
            if (event.type==='setTempo') return;
            if (!map[event.absoluteTimeTicks]) map[event.absoluteTimeTicks] = [];
            map[event.absoluteTimeTicks].push(event);
            if (event.absoluteTimeTicks>maxTicks) maxTicks = event.absoluteTimeTicks;
        });
    });
    for (const event of setTempoEvents) {
        if (!map[event.absoluteTimeTicks]) map[event.absoluteTimeTicks] = [];
        map[event.absoluteTimeTicks].push(event);
    }

    let microsecondsPerBeat = 500_000;
    let absoluteTimeTicks:number = undefined!;
    let absoluteTime = 0;
    for (let i=0;i<maxTicks;i++) {
        if (!map[i]) continue;
        map[i].forEach(event=>{
            if (event.type==='setTempo') {
                microsecondsPerBeat = event.microsecondsPerBeat!;
                return;
            }
            if (absoluteTimeTicks===undefined) absoluteTimeTicks = event.absoluteTimeTicks;
            const deltaTicks = event.absoluteTimeTicks - absoluteTimeTicks;
            const deltaTime = ticksToSeconds(deltaTicks,microsecondsPerBeat,header);
            absoluteTime+=deltaTime;
            event.absoluteTime = absoluteTime;
            absoluteTimeTicks = event.absoluteTimeTicks;
        });
    }
}

export const parse_midi = (data:ArrayBuffer):ITrack[]=>{
    const midiData = parseMidi(data);
    console.log({midiData});

    const mappedTracks:ITrack[] = [];

    midiData.trackEvents.forEach(events => {

        let currentTimeTicks = 0;
        events.forEach((event) => {
            currentTimeTicks += event.deltaTimeTicks;
            event.absoluteTimeTicks = currentTimeTicks;
        });

        const track:ITrack = {
            percussion: false,
            channel: 0,
            name: undefined! as string,
            events: events,
        }

        track.channel = events.find(e=>e.type==='noteOn')?.channel ?? 0;
        track.percussion = track.channel===9;
        track.name = events.find(e=>e.type==='trackName')?.text ?? undefined!;

        mappedTracks.push(track);

    });
    setEventsAbsoluteTime(midiData.header,mappedTracks);
    console.log({mappedTracks});
    return mappedTracks;
}

const ticksToSeconds = (ticks:number,microsecondsPerBeat:number|undefined,header:IHeader):number=>{
    const {framesPerSecond,ticksPerFrame,ticksPerBeat} = header;
    if (framesPerSecond!==undefined && ticksPerFrame!==undefined) {
        return ticks / ticksPerFrame * framesPerSecond;
    } else {
        if (ticksPerBeat===undefined) throw `ticksPerBeat is undefined`;
        if (microsecondsPerBeat===undefined) throw `microsecondsPerBeat is undefined`;
        return microsecondsPerBeat / ticksPerBeat * ticks / 1_000_000;
    }
}
