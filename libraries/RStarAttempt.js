//Major Change from silly index maping to an R-tree for a smaller memory imprint.
(function (window) {
    'use strict';

    function TwoDCollisonDetection(minchilditems, maxchilditems) {
        var minchilditems = minchilditems;
        var maxchilditems = maxchilditems;
        var tree;

        var insert = function (item) {
            if ("undefined" === typeof tree)
                tree = new RNode(item,null);

            tree.Insert(item, maxchilditems);

        }

        this.Insert = function (item) {
            if (item instanceof Array)
            {
                var length = item.length;
                for (var index = 0; index < length; index++)
                {
                    insert(item[index]);
                }
            }
            else {
                insert(item);
            }
        }

        this.GetTree = function ()
        {
            return tree;
        }
    }

    function RNode(itembounds,creator) {
        var parent = creator;
        var nodes = [];
        var bounds = {
            "minx": itembounds.minx,
            "miny": itembounds.miny,
            "maxy": itembounds.maxy,
            "maxx": itembounds.maxx
        };
        var hasItems = true;
        var adjustbounds = function (inbounds) {
            comparebounds("x", inbounds);
            comparebounds("y", inbounds);
        }

        this.GetNodes = function(){}
        var getdistancefrompoint = function (x, y, checkbounds)
        {
            var distance = 0.0;
            var totaldistance = 0.0;

            distance = (x + checkbounds.minx + checkbounds.maxx) / 2.0;
            totaldistance += distance * distance;

            distance = (y + checkbounds.miny + checkbounds.maxy) / 2.0;
            totaldistance += distance * distance;


            return totaldistance;
        }

        var comparebounds = function (compareproperty, inbounds) {
            if (inbounds["min" + compareproperty] < bounds["min" + compareproperty])
                bounds["min" + compareproperty] = inbounds["min" + compareproperty];

            if (inbounds["max" + compareproperty] > bounds["max" + compareproperty])
                bounds["max" + compareproperty] = inbounds["max" + compareproperty];
        }

        this.Insert = function (item, maxitems) {
            adjustbounds(item);
            if (hasItems) {
                var added = false;
                for (var i = 0; i < nodes.length; i++)
                    if (getdistancefrompoint(bounds.minx, bounds.miny, item) < getdistancefrompoint(bounds.minx, bounds.miny, nodes[i].GetBounds()))
                    {
                        nodes.splice(i, 0, new RNode(item));
                        added = true;
                        break;
                    }

                if (!added)
                    nodes.push(new RNode(item));
            }
            else {
                var selectednode = 0;
                var distance = nodes[0].GetDistance(item);
                for (var i = 1; i < nodes.length; i++) {
                    var testdistance = nodes[i].GetDistance(item);
                    if (testdistance < distance) {
                        distance = testdistance;
                        selectednode = i;
                    }
                }

                nodes[selectednode].Insert(item);
            }

            if (nodes.length > maxitems)
            {
                
                if (parent == null)
                {
                    hasItems = false;
                    

                    var newNodeA = new RNode(nodes[0].GetBounds()); 
                    var newNodeB = new RNode(nodes[nodes.length - 1].GetBounds());

                    nodes.pop();
                    nodes.shift();

                    var front = false;
                    var templength = nodes.length;

                    for (var i = 0; i < templength; i++)
                    {
                        if (front)
                        {
                            newNodeA.Insert(nodes[0].GetBounds());
                            nodes.shift();

                        }
                        else {
                            newNodeB.Insert(nodes[nodes.length - 1].GetBounds());
                            nodes.pop();
                        }

                        front = !front;
                    }
                    nodes = [];
                    nodes.push(newNodeA);
                    nodes.push(newNodeB);

                }
            }
        }

        this.GetDistance = function (checkbounds) {
            var distance = 0.0;
            var totaldistance = 0.0;

            distance = (bounds.minx + bounds.maxx + checkbounds.minx + checkbounds.maxx) / 2.0;
            totaldistance += distance * distance;

            distance = (bounds.miny + bounds.maxy + checkbounds.miny + checkbounds.maxy) / 2.0;
            totaldistance += distance * distance;

             
            return totaldistance;
        }
        this.GetBounds = function () { return bounds; }
    }
    function RLeaf() { }
    function RBindingBox() { }
    function DAxis() { }

    window.TwoDCollisonDetection = TwoDCollisonDetection;
    window.TwoDCollisonDetection.RNode = RNode;
})(window);
