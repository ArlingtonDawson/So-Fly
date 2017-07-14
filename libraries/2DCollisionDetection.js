(function (window) {
    'use strict';
    //TODO:Move to a Spacial Hashing Table.
    function TwoDCollisonDetection() {
        var points = {};
        this._items = points;
    }

    //Insert an object to be tracked.
    //Requires an item with x,y,height,width
    TwoDCollisonDetection.prototype.Insert = function (item) {
        //Loop though the width and height of the object and add it to the key;
        for (var iw = 0; iw < item.width; iw++) {
            for (var ih = 0; ih < item.height; ih++) {
                //create the current key
                var currentkey = "" + (item.x + iw) + ":" + (item.y + ih) + "";
                //check to see if the current key is defind if not create a new property as an array;
                if ("undefined" === typeof this._items[currentkey])
                    this._items[currentkey] = { "items": [] };

                //add the new item to the items that occupie this pixel.
                this._items[currentkey].items.push(item);
            }

        }

    };

    TwoDCollisonDetection.prototype._items = null;

    TwoDCollisonDetection.prototype.GetCollisions = function (item) {

        var keylist = new Array();
        //Loop though the width and height to find they keys that live there.
        for (var iw = 0; iw < item.width; iw++)
            for (var ih = 0; ih < item.height; ih++) {
                //create the current key
                var currentkey = "" + (item.x + iw) + ":" + (item.y + ih) + "";

                //loop though the objects that occupy this pixel
                for (var ikeys = 0; ikeys < this._items[currentkey].items.length; ikeys++) {
                    //check to see if the key already exisit
                    if (keylist.indexOf(this._items[currentkey].items[ikeys]) == -1)
                        keylist.push(this._items[currentkey].items[ikeys]);
                }

            }

        return keylist;
    }

    //Simple clear just redefine the items array
    TwoDCollisonDetection.prototype.Clear = function () {
        this._items = {};
    }

    window.TwoDCollisonDetection = TwoDCollisonDetection;
})(window);