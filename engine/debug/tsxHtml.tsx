import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";

const div = document.createElement('div');
document.body.appendChild(div);

class TestComponent extends VEngineTsxComponent<{cnt:number}> {

    render() {
        return (
            <div>test</div>
        );
    }

}
