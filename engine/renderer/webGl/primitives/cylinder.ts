import {Cone} from "@engine/renderer/webGl/primitives/cone";

export class Cylinder extends Cone{


    constructor(radius:number,
                height:number,
                radialSubdivisions:number = 20,
                verticalSubdivisions:number = 20,
                topCap:boolean = true,
                bottomCap:boolean = true)
    {
        super(
            radius,
            radius,
            height,
            radialSubdivisions,
            verticalSubdivisions,
            topCap,bottomCap
        );
    }
}

