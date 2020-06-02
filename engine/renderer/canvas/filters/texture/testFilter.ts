import {AbstractCanvasFilter} from "@engine/renderer/canvas/filters/abstract/abstractCanvasFilter";

export class TestFilter extends AbstractCanvasFilter {

    public processPixel(arr: Uint8ClampedArray, i: number): void {
        arr[0] = 100;
    }
}
