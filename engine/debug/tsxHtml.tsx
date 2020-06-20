import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";

const div = document.createElement('div');
document.body.appendChild(div);

class TestComponent extends VEngineTsxComponent<{cnt:number}> {

    render() {
        return (
            <div>test</div>
        );
    }

}
