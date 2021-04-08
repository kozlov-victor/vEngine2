import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {XML} from "../../node_tools/xml";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);


const xml = new XML(
    `
<?xml version="1.0"?>
<root>
    <div
        class="cl1"
        id="div1">
            before span
            <span>in span</span>
            after span
    </div>
    <br/><p/><p></p>
    <div>456</div>
    <script>
        alert(1);
    </script>
</root>
`);
console.log(xml.getTree());
console.log(xml.asString());




