import {Registry} from "./registry/registry";
import {TestController} from "./controller/test.controller";
import {init} from "./bootstrap";
import {IndexController} from "./controller/index.controller";
import {TexturePackController} from "./controller/texture-pack.controller";
import {TilePackController} from "./controller/tile-pack.controller";

Registry.getInstance().registerController(TestController);
Registry.getInstance().registerController(TexturePackController);
Registry.getInstance().registerController(TilePackController);
Registry.getInstance().registerController(IndexController);
console.log(Registry.getInstance().registry.map(it=>it.url));
init();



