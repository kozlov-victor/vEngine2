
import {FBXData, FBXNode, FBXProperty} from "@engine/renderable/impl/3d/fbxParser/_internal/types";
import {BinBuffer} from "@engine/misc/parsers/bin/binBuffer";

// based on https://github.com/picode7/fbx-parser/

const MAGIC = Uint8Array.from('Kaydara FBX Binary\x20\x20\x00\x1a\x00'.split(''), (v) => v.charCodeAt(0))

// For debug purposes:
// const IND = '  '
// let ind = ''

/**
 * Returns a list of FBXNodes
 * @param binary the FBX binary file content
 */
export function parseBinary(binary: ArrayBuffer): FBXData {
    if (binary.byteLength < MAGIC.length) throw 'Not a binary FBX file'
    const data = new BinBuffer(binary)
    const magic = data.readUints8(MAGIC.length).every((v, i) => v === MAGIC[i])
    if (!magic) throw 'Not a binary FBX file'
    const fbxVersion = data.readUInt32(true)

    //console.log(`FBX Version: ${fbxVersion}`)
    const header64 = fbxVersion >= 7500

    const fbx: FBXData = []

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const subnode = readNode(data, header64)
        if (subnode === null) break
        fbx.push(subnode)
    }

    return fbx
}

function readNode(data: BinBuffer, header64: boolean) {
    const endOffset = header64 ? Number(data.readUInt64(true)) : data.readUInt32(true)
    if (endOffset === 0) return null
    const numProperties = header64 ? Number(data.readUInt64(true)) : data.readUInt32(true)
    const propertyListLen = header64 ? Number(data.readUInt64(true)) : data.readUInt32(true)
    const nameLen = data.readUInt8()
    const name = data.readString(nameLen)

    const node: FBXNode = {
        name,
        props: [],
        nodes: [],
    }


    // Properties
    for (let i = 0; i < numProperties; ++i) {
        node.props.push(readProperty(data))
    }

    // Node List
    while (endOffset - data.getPointer() > 13) {
        const subnode = readNode(data, header64)
        if (subnode !== null) node.nodes.push(subnode)
    }
    data.setPointer(endOffset);

    return node
}

function readProperty(data: BinBuffer) {
    const typeCode = data.readString(1);

    const read: { [index: string]: () => any } = {
        Y: () => data.readInt16(true),
        C: () => data.readUInt8() > 0,
        I: () => data.readInt32(true),
        F: () => data.readFloat32(true),
        D: () => data.readFloat64(true),
        L: () => data.readInt64(true),
        f: () => readPropertyArray(data, (r) => r.readFloat32(true)),
        d: () => readPropertyArray(data, (r) => r.readFloat64(true)),
        l: () => readPropertyArray(data, (r) => r.readInt64(true)),
        i: () => readPropertyArray(data, (r) => r.readInt32(true)),
        b: () => readPropertyArray(data, (r) => r.readUInt8() > 0),
        S: () => data.readString(data.readUInt32(true)),
        R: () => data.readUints8(data.readUInt32(true)),
    }

    if (typeof read[typeCode] === 'undefined') {
        throw `Unknown Property Type ${typeCode.charCodeAt(0)}`
    }

    let value = read[typeCode]()

    // convert BigInt when ever possible
    const convertBigInt = (v: number) => {
        if (value < Number.MIN_SAFE_INTEGER || v > Number.MAX_SAFE_INTEGER) return v
        return Number(v)
    }
    if (typeCode === 'L') {
        value = convertBigInt(value)
    } else if (typeCode === 'l') {
        for (let i = 0; i < value.length; ++i) {
            value[i] = convertBigInt(value[i])
        }
    }

    // replace '\x00\x01' by '::' and flip like in the text files
    if (typeCode === 'S' && value.indexOf('\x00\x01') !== -1) {
        value = (value as string).split('\x00\x01').reverse().join('::')
    }

    return value
}

function readPropertyArray(data: BinBuffer, reader: (r: BinBuffer) => FBXProperty) {
    const arrayLength = data.readUInt32(true)
    const encoding = data.readUInt32(true)
    const compressedLength = data.readUInt32(true)
    let arrayData:BinBuffer;

    if (encoding === 1) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const f = require('pako');
        try {
            const decompressed:Uint8Array = f.inflate(data.readUints8(compressedLength));
            arrayData = new BinBuffer(decompressed.buffer);
        } catch (e) {
            console.warn('parsing data error');
            return undefined;
        }
    } else {
        arrayData = new BinBuffer(data.readUints8(compressedLength))
    }

    const value:any[] = []
    for (let i = 0; i < arrayLength; ++i) {
        value.push(reader(arrayData))
    }
    return value;


}
