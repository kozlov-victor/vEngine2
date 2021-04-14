import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {XmlParser} from "@engine/misc/xml/xmlParser";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);


// const xml = new XmlParser(
//     `<font>
//     <chars count="95">
//         <char id="62" x="1" y="308" width="41" height="46" xoffset="2" yoffset="24" xadvance="38" page="0" chnl="0" letter=">"/>
//     </chars>
// </font>`);
// console.log(xml.getTree());
// console.log(xml.asString());




