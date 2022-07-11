import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Vec4} from "@engine/geometry/vec4";
import {Rect} from "@engine/geometry/rect";
import {Mat4} from "@engine/misc/math/mat4";
import Vec4Holder = Vec4.Vec4Holder;
import {TransformableModel} from "@engine/renderable/abstract/transformableModel";

const out:Vec4.VEC4[] = [undefined!,undefined!,undefined!,undefined!];

export const getScreenCoords = (obj:TransformableModel):[Vec4.VEC4,Vec4.VEC4,Vec4.VEC4,Vec4.VEC4]=> {

    const modelRect:Rect = Rect.fromPool();

    const pointBottomRight = Vec4Holder.fromPool();
    pointBottomRight.set(obj.size.width,obj.size.height,0,1);
    const pointBottomRightTransformation:Vec4Holder = Vec4Holder.fromPool();
    Mat4.multVecByMatrix(pointBottomRightTransformation,obj.worldTransformMatrix,pointBottomRight);

    const pointTopRight = Vec4Holder.fromPool();
    pointTopRight.set(obj.size.width,0,0,1);
    const pointTopRightTransformation:Vec4Holder = Vec4Holder.fromPool();
    Mat4.multVecByMatrix(pointTopRightTransformation,obj.worldTransformMatrix,pointTopRight);

    const pointTopLeft = Vec4Holder.fromPool();
    pointTopLeft.set(0,0,0,1);
    const pointTopLeftTransformation:Vec4Holder = Vec4Holder.fromPool();
    Mat4.multVecByMatrix(pointTopLeftTransformation,obj.worldTransformMatrix,pointTopLeft);

    const pointBottomLeft = Vec4Holder.fromPool();
    pointBottomLeft.set(0,obj.size.height,0,1);
    const pointBottomLeftTransformation:Vec4Holder = Vec4Holder.fromPool();
    Mat4.multVecByMatrix(pointBottomLeftTransformation,obj.worldTransformMatrix,pointBottomLeft);

    out[0] = pointTopLeftTransformation.vec4 as Vec4.VEC4;
    out[1] = pointTopRightTransformation.vec4 as Vec4.VEC4;
    out[2] = pointBottomRightTransformation.vec4 as Vec4.VEC4;
    out[3] = pointBottomLeftTransformation.vec4 as Vec4.VEC4;

    Rect.toPool(modelRect);

    Vec4Holder.toPool(pointBottomRight);
    Vec4Holder.toPool(pointBottomRightTransformation);
    Vec4Holder.toPool(pointTopRight);
    Vec4Holder.toPool(pointTopRightTransformation);
    Vec4Holder.toPool(pointTopLeft);
    Vec4Holder.toPool(pointTopLeftTransformation);
    Vec4Holder.toPool(pointBottomLeft);
    Vec4Holder.toPool(pointBottomLeftTransformation);

    return out as [Vec4.VEC4,Vec4.VEC4,Vec4.VEC4,Vec4.VEC4];
}
