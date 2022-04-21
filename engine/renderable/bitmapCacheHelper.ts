import {Image} from "@engine/renderable/impl/general/image/image";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";

export class BitmapCacheHelper {
    public static cacheAsBitmap(game:Game,model:RenderableModel):Image {
        model.revalidate();
        model.update();
        const drawingSurface = new DrawingSurface(game,model.size);
        drawingSurface.drawModel(model);
        const image = new Image(game,drawingSurface.getTexture());
        drawingSurface.destroy();
        return image;
    }
}
