import {Registry} from "./registry/registry";
import {TestController} from "./controller/test.controller";
import {init} from "./bootstrap";

Registry.getInstance().registerController(TestController);
init();



