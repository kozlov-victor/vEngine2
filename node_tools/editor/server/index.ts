import {Registry} from "./registry/registry";
import {TestController} from "./controller/test.controller";
import {init} from "./bootstrap";
import {MainController} from "./controller/main.controller";
import {IndexController} from "./controller/index.controller";

Registry.getInstance().registerController(TestController);
Registry.getInstance().registerController(MainController);
Registry.getInstance().registerController(IndexController);
init();



