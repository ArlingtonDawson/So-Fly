//SO-Fly.js
(function (window) {
    'use strict';

        //Create a new instance of the game.
        //Requires a container to create the canvases.
        //TODO: Add implement a configueration object to allow the user to pass preferances.
    function SoFly(container, config) {
        var _width = 800;
        var _height = 600;

        //Insert Canvas Function
        //Takes a container, name to be give as an id, and Zindex
        var _CreateCanvas = function (container, name, zindex) {
            var canvas = document.createElement('canvas');
            canvas.id = name;
            canvas.width = _width;
            canvas.height = _height;
            canvas.style.zIndex = zindex;
            canvas.style.position = "absolute";

            container.appendChild(canvas);
        }

        //Using four canvasi, one for background, one for Bullets, one for destructables and bad guys and last for the player.
        _CreateCanvas(container, "background", -2);
        _CreateCanvas(container, "projectile", -1);
        _CreateCanvas(container, "destoriables", 0);
        _CreateCanvas(container, "player", 1);

        
    }

    //Todo:Create the run Loop Logic
    SoFly.prototype.Run = function () { };

    //Todo:Create Render Logtic
    SoFly.prototype.Render = function () { };


    window.SoFly = SoFly;
})(window);
