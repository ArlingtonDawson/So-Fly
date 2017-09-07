//Changed to a Balanced Binary Tree. Currently loading the tree, but no look up yet.
//Trying to figure out what is the best way to finding the right nodes to return.
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
        DistanceFromPoint(x,y,x2,y2) {
            return Math.abs(Math.sqrt(Math.pow((x-x2),2) + Math.pow((y-y2),2)));
        }
    }

    //Axis class. Used in the majority of the calculations for the algorithms.
    //Min=start of a line
    //Max=End of a line.
    function Axis(min, max) {
        this.Min = min;
        this.Max = max;
     }

    var RSHelper = 
        {
            TenPower : 5,
            ProduceSortingKey(coords)
            { 
                let key = "";
                let obj = this;
                coords.forEach((i) => {
                    key = obj.LeadingZero(i, obj.TenPower) +  key;
                });

                return Number(key);
            },
            LeadingZero(num, tenpower)
            {
                let newnum = num + "";
                for (let i = newnum.length; i < tenpower; i++) {
                    newnum = "0" + num;
                }
                return newnum;
            }

        }
    //This is the home of the objects we wish to store.
    //Requires an axis array, used for caculations and the object we are storing
    function Leaf(item) {
        //Array of points this is an attempt to pre stucture for multiple dementions
        let centerpoints = [];
        
        this.Axes = [];
        this.Item = item;

        //tempary constucter. Axes should be supplied?
        this.Axes.push(new Axis(item.x, item.x + item.width));
        this.Axes.push(new Axis(item.y, item.y + item.height));
        //SortingKey to convert our corrods into a number
        this.SortingKey = RSHelper.ProduceSortingKey([item.x,item.y]);

        //Get the mid point for each axis for easier caculations
        this.Axes.forEach((a) => {
            let center = a.Max - a.Min;
            centerpoints.push(center);
        });
    }

    //This is the base node objec
    function Node (){
            this.Leafs = [];
            //Node Less Then
            this.Left = null;
            //Node Greater Then
            this.Right = null;
            this.Level = 0;
            this.SortingKey = 0;
    }

    function BinaryCollison() {
        //This is our tree node
        let node = null;
        let balance = function () {
            //Currentnode will be used to hold the current node we are evaulating
            //Blancednode is a temp node that we will preform the balacing rutine on
            //Parent is the node we belong too.
            //Updated is to check to see if there was an update in the tree.
            let currentnode, blancednode, parent, updated, m = 0;
            //Loop backwards though the nodes we used to come here. We need to check to see if we need to update our tree.
            for (let i = path.length - 1; i >= 0; i--)
            {
                //Set our BlancedNode and current node to the last node in the path.
                blancednode = currentnode = path[i];
                //Check to see if either child node has the same level as us. If it does we need to increment our level.
                if (currentnode.Left != null && currentnode.Right != null && currentnode.Level == currentnode.Left.Level && currentnode.Level == currentnode.Right.Level){
                    updated = true;
                    currentnode.Level++;
                }
                else {
                    //Test and return the balanced node
                    blancednode = rotateclockwise(currentnode);
                    blancednode = rotatecounterclockwise(blancednode);
                }

                //Is the balanced node the same as the current? If it is not then it needed to be balanced.
                if (blancednode !== currentnode) {
                    updated = true;
                    //If i!=0 we need to update the parent else the root
                    if (i) {
                        parent = path[i - 1];
                        if (parent.Left === currentnode)
                            parent.Left = blancednode;
                        else
                            parent.Right = blancednode;
                    } else
                        node = blancednode;
                }

                //if we havent updated twice kick out
                if (!updated) {
                    m++;
                    if (m == 2) break;
                }
                
            }
        }
        //Rotate the node clockwise
        let rotateclockwise = function (innode) {
            if (innode.Left != null && innode.Left.Level === innode.Level) {
                var temp = innode;
                innode = innode.Left;
                temp.Left = innode.Right;
                innode.Right = temp;
            }
            return innode;
        }
        //Rotate the node counterclockwise
        let rotatecounterclockwise= function(innode) {
            if (innode.Right != null && innode.Right.Right != null && innode.Right.Right.Level === innode.Level) {
                var temp = innode;
                innode = innode.Right;
                temp.Right = innode.Left;
                innode.Left = temp;
                innode.Level++;
            }
            return innode;
        }
        //This is used for insert and retrival.
        let path = [];
        let getitems = function (leafs)
        {
            let returnitems = [];
            leafs.forEach((i) => returnitems.push(i.Item));
            return returnitems;
        }
        this.Insert = function(items)
        {
            let node = this.node = null;
            //Currently items should be an array
            items.forEach((item) => {
                //Create a new leaf to hold the object. PS SHould rename
                let leaf = new Leaf(item);
                //Where we are at on the path
                let currentnode = node;
                //Need to reset path for each insert
                path = [];

                //If node is null then this is our first tiem
                if (node == null) {
                    let tempNode = new Node();
                    //Get the leafs sortingkey.
                    tempNode.SortingKey = leaf.SortingKey;
                    tempNode.Leafs.push(leaf);
                    node = tempNode;
                    return;
                }

                while (1) {

                    path.push(currentnode);
                    //If the sortingkey is the same as the sorting key to the leaf we will add it to this node.
                    //This is because multiple objects can be held in the same node.
                    if (leaf.SortingKey == currentnode.SortingKey) {
                        currentnode.Leafs.push(leaf);
                        return;
                    }
                    //If the key is less go left
                    else if (leaf.SortingKey < currentnode.SortingKey) {
                        //If Left is null create a new node and add the sorting leaf
                        if (currentnode.Left == null) {
                            let tempNode = new Node();
                            tempNode.SortingKey = leaf.SortingKey;
                            tempNode.Leafs.push(leaf);
                            currentnode.Left = tempNode;
                            break;
                        }


                        currentnode = currentnode.Left;
                    }
                    //If key is greater go right
                    else if (leaf.SortingKey > currentnode.SortingKey) {
                        //If Right is null create a new node and add the sorting leaf
                        if (currentnode.Right == null) {
                            let tempNode = new Node();
                            tempNode.SortingKey = leaf.SortingKey;
                            tempNode.Leafs.push(leaf);

                            currentnode.Right = tempNode;
                            break;
                        }

                        currentnode = currentnode.Right;
                    }
                    else { return;}
                }
                //Balance our tree
                balance();
            })
            this.node = node;
        };
        this.GetItems = function (item) {
            if (this.node == null)
                return;

            let returnItems = [];
            let currentnode = this.node;
            let i = 0;
            //SortingKey to convert our corrods into a number
            let key = RSHelper.ProduceSortingKey([item.x, item.y]);

            path = [];
            while (1) {
                path.push(currentnode);
                //We Found our target
                if (key == currentnode.SortingKey) {
                    returnItems.push.apply(returnItems, getitems(currentnode.Leafs));
                    if (currentnode.Left != null)
                        returnItems.push.apply(returnItems, getitems(currentnode.Left.Leafs));
                    if (currentnode.Right != null)
                        returnItems.push.apply(returnItems, getitems(currentnode.Right.Leafs));

                    if (i) {
                        let parent = path[i - 1];
                        if (parent.Left != null)
                            returnItems.push.apply(returnItems, getitems(parent.Left.Leafs));
                        if (parent.Right != null)
                            returnItems.push.apply(returnItems, getitems(parent.Right.Leafs));
                    }

                    break;
                }
                //If the key is less go left
                else if (key < currentnode.SortingKey) {
                    //If null break
                    if (currentnode.Left == null) {
                        break;
                    }
                    currentnode = currentnode.Left;
                }
                //If key is greater go right
                else if (key > currentnode.SortingKey) {
                    //If null break
                    if (currentnode.Right == null) {
                        break;
                    }

                    currentnode = currentnode.Right;
                }
                i++;
            };
            return returnItems;
        }
    }

    window.BinaryCollison = BinaryCollison;
})(window);
