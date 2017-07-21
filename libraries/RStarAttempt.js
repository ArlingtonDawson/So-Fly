//Major Change from silly index maping to an R-tree for a smaller memory imprint.
(function (window) {
    'use strict';

    //Constant functions used for some calculations to help us determain node placement
     var RHelperCalculations = {
        Area(axis) {
            let outvalue = 1;
            //for each axis in the array minus the max from the min to get its length. Next times it by
            //the previous value, hince the start at 1.
            axis.forEach(a => (a.max - a.min) * outvalue);
            return outvalue;
         },
         //requires two axes
         //TODO:Add checks to avoid assumption that the Axes past are pre sorted and there is an overlap
        Overlap(axis1, axis2) {
            let axes = [];
            for (let index = 0; index < axis1.length; index++)
            {
                axes.push(new Axis(axis2[index].Min, axis1[index].Max));
            }
            return axes;
        },
        //Is this just distance from center to point? Not sure.
        DistanceFromPoint() {

        }
    }

    //Axis class. Used in the majority of the calculations for the algorithms.
    //Min=start of a line
    //Max=End of a line.
    function Axis(min, max) {
        this.Min = min;
        this.Max = max;
    }
    //This is the home of the objects we wish to store.
    //Requires an axis array, used for caculations and the object we are storing
    function Leaf (axis,item){
            this.Axis = axis;
            this.Item = item;
    }

    //This is the base node objec
    function Node (axis, item){
            this.Axis = axis;
            this.Nodes = [];
            this.Leafs = [];
            this.parentcallback = [];

            let hasleaves = false;

            this.Insert = function (item) {
                //Check if this is an end node or node that has leaves. If it does we add.
                //Check to see if there are more items in this node then our maxium if so we have to split the node.
                //I figured this is where the parentcallbacks could come in handy. If there is no more room on this depth we will need to split to a new depth.


                //If not we need to find where we need to go. To do that we will compare the item axes with the child node axes.
                //If the item falls between two nodes we will have to find which one is the best to fill it in. Note:Add these test calcuations to
                //RHelperCalculations
            }
    }

})(window);
