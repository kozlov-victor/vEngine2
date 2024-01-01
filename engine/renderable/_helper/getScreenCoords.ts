import {Vec4} from "@engine/geometry/vec4";
import {Rect} from "@engine/geometry/rect";
import {Mat4} from "@engine/misc/math/mat4";
import {TransformableModel} from "@engine/renderable/abstract/transformableModel";
import Vec4Holder = Vec4.Vec4Holder;

const out:Vec4.VEC4[] = [undefined!,undefined!,undefined!,undefined!];

export const getScreenCoords = (obj:TransformableModel):[Vec4.VEC4,Vec4.VEC4,Vec4.VEC4,Vec4.VEC4]=> {

    const modelRect = Rect.pool.get();

    const pointBottomRight = Vec4Holder.pool.get();
    pointBottomRight.set(obj.size.width,obj.size.height,0,1);
    const pointBottomRightTransformation = Vec4Holder.pool.get();
    Mat4.multVecByMatrix(pointBottomRightTransformation,obj.worldTransformMatrix,pointBottomRight);

    const pointTopRight = Vec4Holder.pool.get();
    pointTopRight.set(obj.size.width,0,0,1);
    const pointTopRightTransformation = Vec4Holder.pool.get();
    Mat4.multVecByMatrix(pointTopRightTransformation,obj.worldTransformMatrix,pointTopRight);

    const pointTopLeft = Vec4Holder.pool.get();
    pointTopLeft.set(0,0,0,1);
    const pointTopLeftTransformation = Vec4Holder.pool.get();
    Mat4.multVecByMatrix(pointTopLeftTransformation,obj.worldTransformMatrix,pointTopLeft);

    const pointBottomLeft = Vec4Holder.pool.get();
    pointBottomLeft.set(0,obj.size.height,0,1);
    const pointBottomLeftTransformation:Vec4Holder = Vec4Holder.pool.get();
    Mat4.multVecByMatrix(pointBottomLeftTransformation,obj.worldTransformMatrix,pointBottomLeft);

    out[0] = pointTopLeftTransformation.vec4 as Vec4.VEC4;
    out[1] = pointTopRightTransformation.vec4 as Vec4.VEC4;
    out[2] = pointBottomRightTransformation.vec4 as Vec4.VEC4;
    out[3] = pointBottomLeftTransformation.vec4 as Vec4.VEC4;

    Rect.pool.recycle(modelRect);

    Vec4Holder.pool.recycle(pointBottomRight);
    Vec4Holder.pool.recycle(pointBottomRightTransformation);
    Vec4Holder.pool.recycle(pointTopRight);
    Vec4Holder.pool.recycle(pointTopRightTransformation);
    Vec4Holder.pool.recycle(pointTopLeft);
    Vec4Holder.pool.recycle(pointTopLeftTransformation);
    Vec4Holder.pool.recycle(pointBottomLeft);
    Vec4Holder.pool.recycle(pointBottomLeftTransformation);

    return out as [Vec4.VEC4,Vec4.VEC4,Vec4.VEC4,Vec4.VEC4];
}
