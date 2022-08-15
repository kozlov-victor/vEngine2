npm i -production

- 1 tile map, tile map collisions
- 2 filtering for parent/child (also filtering for polilines, poligones)
- 3 arcade object collisions
- 4 3d texture for 3d mesh, shader material
- 5 ui components
- 6 scml support (http://www.brashmonkey.com/ScmlDocs/ScmlReference.html http://sbcgamesdev.blogspot.com/2015/09/phaser-tutorial-phaser-and-spriter.html) 
    or spine (https://pixijs.io/examples/#/filters-advanced/pixie-shadow-filter.js )
- 7 bump lighting, composition filters
- 8 volumetric displacement https://tympanus.net/codrops/2019/02/20/how-to-create-a-fake-3d-image-effect-with-webgl/
- 9 move object by polyline
- 10 ui (hud) layer

**investigate**

- clearBeforeRender
- cacheAsBitmap
- filterArea
- hitArea
- localTransform
- worldTransform
- gotoAndPlay
- gotoAndStop (frameNumber)
- rendering with fog
- sprite batch
- ui lib
- Graphics drawing
- global alpha composition
**todo**

- https://pixijs.download/dev/docs/PIXI.BitmapText.html
- https://github.com/pixijs/pixi-filters


- Линейный градиент с многими точками
- Круговой градиент
- Заливка спрайтом (repeat | clip)

- filters with accumulation
- physics body maxVelocity
- debug panel with embedded fonts


window.document.addEventListener("touchmove", disableSwipeFn, false);
var disableSwipeFn = function disableSwipeFn(e) {
 e.preventDefault();

 if (typeof window.scroll === "function") {
   window.scroll(0, 0);
 }

 return false;
};


api.getMaxShaderPrecision = function (gl) {
 if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision > 0 && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision > 0) {
   return "highp";
 }

 if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision > 0 && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision > 0) {
   return "mediump";
 }

 return "lowp";
};



api.mergeGroup = true;
       /**
        * Specify the property to be used when sorting entities.
        * Accepted values : "x", "y", "z"
        * @public
        * @type {string}
        * @default "z"
        * @name sortOn
        * @memberOf me.game
        */
        
        
mergeGroup 
renderer.flush();

/**
        * Specify whether to pause the game when losing focus.<br>
        * @type {Boolean}
        * @default true
        * @memberOf me.sys
        */
       pauseOnBlur: true,
       
       
       
       
/**
       * Specify the rendering method for layers <br>
       * if false, visible part of the layers are rendered dynamically<br>
       * if true, the entire layers are first rendered into an offscreen
       * canvas<br>
       * the "best" rendering method depends of your game<br>
       * (amount of layer, layer size, amount of tiles per layer, etc.)<br>
       * note : rendering method is also configurable per layer by adding this
       * property to your layer (in Tiled)<br>
       * @type {Boolean}
       * @default false
       * @memberOf me.sys
       */
preRender: false 




RotateTransition, TranslateTransition,
setFrom, setTo, setBy
ReflectionFilter, scaleTransition,
SetNode, setReverse, setNode, fadeTransition
FillTransition, StrokeTransition, SequentialTransition





/**
* Convert this vector into isometric coordinate space
* @name toIso
* @memberOf me.Vector2d
* @function
* @return {me.Vector2d} Reference to this object for method chaining
*/
toIso: function toIso() {
 return this._set(this.x - this.y, (this.x + this.y) * 0.5);
},
        
        

