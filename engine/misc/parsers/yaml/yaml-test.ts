import {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";

// test cases https://yaml-online-parser.appspot.com/
export const yamlTest = ()=>{
    console.log(new YamlParser(
`- Mark McGwire
- Sammy Sosa
- Ken Griffey`).getResult());

console.log(new YamlParser(
`hr:  65    # Home runs
avg: 0.278 # Batting average
rbi: 147   # Runs Batted In`).getResult());

console.log(new YamlParser(
`american:
  - Boston Red Sox
  - Detroit Tigers
  - New York Yankees
national:
  - New York Mets
  - Chicago Cubs
  - Atlanta Braves`
).getResult());

console.log(new YamlParser(
`-
  name: Mark McGwire
  hr:   65
  avg:  0.278
-
  name: Sammy Sosa
  hr:   63
  avg:  0.288
`
).getResult());

console.log(new YamlParser(
`- [name        , hr, avg  ]
- [Mark McGwire, 65, 0.278]
- [Sammy Sosa  , 63, 0.288]`
).getResult());

// console.log(new YamlParser(
// `Mark McGwire: {hr: 65, avg: 0.278}
// Sammy Sosa: {
//     hr: 63,
//     avg: 0.288
//   }
// `
// ).getResult()); // 6

console.log(new YamlParser(
`---
hr: # 1998 hr ranking
  - Mark McGwire
  - Sammy Sosa
rbi:
  # 1998 rbi ranking
  - Sammy Sosa
  - Ken Griffey`
).getResult()); // 9

console.log(new YamlParser(
`---
hr:
  - Mark McGwire
  # Following node labeled SS
  - &SS Sammy Sosa
rbi:
  - *SS # Subsequent occurrence
  - Ken Griffey`
).getResult());

console.log(new YamlParser(
`---
# Products purchased
- item    : Super Hoop
  quantity: 1
- item    : Basketball
  quantity: 4
- item    : Big Shoes
  quantity: 1`
).getResult()); // 12

// console.log(new YamlParser(
// `# ASCII Art
// --- |
//   \\//||\\/||
//   // ||  ||__`
// ).getResult());

// console.log(new YamlParser(
// `--- >
//   Mark McGwire's
//   year was crippled
//   by a knee injury.`
// ).getResult());


// console.log(new YamlParser(
// `plain:
//   This unquoted scalar
//   spans many lines.
//
// quoted: "So does this
//   quoted scalar."`
// ).getResult());

console.log(new YamlParser(
`canonical: 12345
decimal: +12345
octal: 0o14
hexadecimal: 0xC
`
).getResult());

console.log(new YamlParser(
`canonical: 1.23015e+3
exponential: 12.3015e+02
fixed: 1230.15
negative infinity: -.inf
not a number: .NaN`
).getResult());

console.log(new YamlParser(
`null:
booleans: [ true, false ]
string: '012345'`
).getResult()); // 21

console.log(new YamlParser(
`canonical: 2001-12-15T02:59:43.1Z
iso8601: 2001-12-14t21:59:43.10-05:00
spaced: 2001-12-14 21:59:43.10 -5
date: 2002-12-14
`
).getResult());

console.log(new YamlParser(
`# Ordered maps are represented as
# A sequence of mappings, with
# each mapping having one key
--- !!omap
- Mark McGwire: 65
- Sammy Sosa: 63
- Ken Griffy: 58`
).getResult());

console.log(new YamlParser(
`fileFormatVersion: 2
guid: b1f24b3bc2e2f1d4b858657ad5c115a0
TextureImporter:
  internalIDToNameTable:
  - first:
      213: -5728686177044832811
    second: Bananas_0
  - first:
      213: -5786164333596270976
    second: Bananas_1
  - first:
      213: 5546440197654754675
    second: Bananas_2
  - first:
      213: -716424211456008518
    second: Bananas_3
  - first:
      213: -5292413800997781641
    second: Bananas_4
  - first:
      213: -7253148436187668049
    second: Bananas_5
  - first:
      213: 8575041284972176386
    second: Bananas_6
  - first:
      213: 3604655966176598788
    second: Bananas_7
  - first:
      213: -6630629338061711003
    second: Bananas_8
  - first:
      213: -8491821694155768140
    second: Bananas_9
  - first:
      213: 8303107455315256833
    second: Bananas_10
  - first:
      213: -7266015010218627371
    second: Bananas_11
  - first:
      213: -5455066603935629110
    second: Bananas_12
  - first:
      213: -1347183766120132532
    second: Bananas_13
  - first:
      213: 3310116166248368309
    second: Bananas_14
  - first:
      213: 7601917565207802943
    second: Bananas_15
  - first:
      213: -8288679156529735154
    second: Bananas_16
  externalObjects: {}
  serializedVersion: 10
  mipmaps:
    mipMapMode: 0
    enableMipMap: 0
    sRGBTexture: 1
    linearTexture: 0
    fadeOut: 0
    borderMipMap: 0
    mipMapsPreserveCoverage: 0
    alphaTestReferenceValue: 0.5
    mipMapFadeDistanceStart: 1
    mipMapFadeDistanceEnd: 3
  bumpmap:
    convertToNormalMap: 0
    externalNormalMap: 0
    heightScale: 0.25
    normalMapFilter: 0
  isReadable: 0
  streamingMipmaps: 0
  streamingMipmapsPriority: 0
  grayScaleToAlpha: 0
  generateCubemap: 6
  cubemapConvolution: 0
  seamlessCubemap: 0
  textureFormat: 1
  maxTextureSize: 2048
  textureSettings:
    serializedVersion: 2
    filterMode: 0
    aniso: -1
    mipBias: -100
    wrapU: 1
    wrapV: 1
    wrapW: 1
  nPOTScale: 0
  lightmap: 0
  compressionQuality: 50
  spriteMode: 2
  spriteExtrude: 1
  spriteMeshType: 1
  alignment: 0
  spritePivot: {x: 0.5, y: 0.5}
  spritePixelsToUnits: 100
  spriteBorder: {x: 0, y: 0, z: 0, w: 0}
  spriteGenerateFallbackPhysicsShape: 1
  alphaUsage: 1
  alphaIsTransparency: 1
  spriteTessellationDetail: -1
  textureType: 8
  textureShape: 1
  singleChannelComponent: 0
  maxTextureSizeSet: 0
  compressionQualitySet: 0
  textureFormatSet: 0
  platformSettings:
  - serializedVersion: 3
    buildTarget: DefaultTexturePlatform
    maxTextureSize: 2048
    resizeAlgorithm: 0
    textureFormat: -1
    textureCompression: 0
    compressionQuality: 50
    crunchedCompression: 0
    allowsAlphaSplitting: 0
    overridden: 0
    androidETC2FallbackOverride: 0
    forceMaximumCompressionQuality_BC6H_BC7: 0
  - serializedVersion: 3
    buildTarget: Standalone
    maxTextureSize: 2048
    resizeAlgorithm: 0
    textureFormat: -1
    textureCompression: 0
    compressionQuality: 50
    crunchedCompression: 0
    allowsAlphaSplitting: 0
    overridden: 0
    androidETC2FallbackOverride: 0
    forceMaximumCompressionQuality_BC6H_BC7: 0
  spriteSheet:
    serializedVersion: 2
    sprites:
    - serializedVersion: 2
      name: Bananas_0
      rect:
        serializedVersion: 2
        x: 0
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 6ca23518b492cf744a336833121ee22c
      internalID: -5728686177044832811
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_1
      rect:
        serializedVersion: 2
        x: 32
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 73680ae4d6de91448999314e00c6798d
      internalID: -5786164333596270976
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_2
      rect:
        serializedVersion: 2
        x: 64
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 96ca4fcac6d13b34fb8a70f1bb5f1041
      internalID: 5546440197654754675
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_3
      rect:
        serializedVersion: 2
        x: 96
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: a8cdb555fdf0bbc419fddd3d4777ef98
      internalID: -716424211456008518
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_4
      rect:
        serializedVersion: 2
        x: 128
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 0b429e257e0c0bf44b14a4748639d562
      internalID: -5292413800997781641
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_5
      rect:
        serializedVersion: 2
        x: 160
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: c22e41c025853bf48ae24fc1797dd514
      internalID: -7253148436187668049
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_6
      rect:
        serializedVersion: 2
        x: 192
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: f504a9a73fc426a439f26a4dc407e100
      internalID: 8575041284972176386
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_7
      rect:
        serializedVersion: 2
        x: 224
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: b0144ab7eab88db4e887af2a9a82dacd
      internalID: 3604655966176598788
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_8
      rect:
        serializedVersion: 2
        x: 256
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 9a29bdd66638a744b8967d48a8664a72
      internalID: -6630629338061711003
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_9
      rect:
        serializedVersion: 2
        x: 288
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 5768a9950ba56094f86a82b4bd38823a
      internalID: -8491821694155768140
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_10
      rect:
        serializedVersion: 2
        x: 320
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 0a64a01fc99b4384d9119ed9cc2e56d9
      internalID: 8303107455315256833
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_11
      rect:
        serializedVersion: 2
        x: 352
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: d6631b85380068847b5b047b88fc1a8b
      internalID: -7266015010218627371
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_12
      rect:
        serializedVersion: 2
        x: 384
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 715f91e4dbbbcac4c8496a1396459f29
      internalID: -5455066603935629110
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_13
      rect:
        serializedVersion: 2
        x: 416
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 9b7664d443bb64e46bc62bcd30e9b676
      internalID: -1347183766120132532
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_14
      rect:
        serializedVersion: 2
        x: 448
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 1d0a1ee67e2604b4ca338f03579ae268
      internalID: 3310116166248368309
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_15
      rect:
        serializedVersion: 2
        x: 480
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 171254829e51aaa4695b59b6df9a4085
      internalID: 7601917565207802943
      vertices: []
      indices:
      edges: []
      weights: []
    - serializedVersion: 2
      name: Bananas_16
      rect:
        serializedVersion: 2
        x: 512
        y: 0
        width: 32
        height: 32
      alignment: 0
      pivot: {x: 0, y: 0}
      border: {x: 0, y: 0, z: 0, w: 0}
      outline: []
      physicsShape: []
      tessellationDetail: 0
      bones: []
      spriteID: 52e1f03f353d6d047985661e75ee9479
      internalID: -8288679156529735154
      vertices: []
      indices:
      edges: []
      weights: []
    outline: []
    physicsShape: []
    bones: []
    spriteID: 5e97eb03825dee720800000000000000
    internalID: 0
    vertices: []
    indices:
    edges: []
    weights: []
    secondaryTextures: []
  spritePackingTag:
  pSDRemoveMatte: 0
  pSDShowRemoveMatteOption: 0
  userData:
  assetBundleName:
  assetBundleVariant:
`
).getResult());

console.log(new YamlParser(
``
).getResult());



}