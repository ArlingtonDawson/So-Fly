//As something thing fun to do while learning some of the new ES6 stuff I decided to convert
https://github.com/mikechambers/ExamplesByMesh/tree/master/JavaScript/QuadTree 
//

//ToDo: Make things a little cleaner. Review the code more closesly to find out where we can leverage
//more ES6. Would like to eventally push changes to where it should belong which is at above GitSite

'use strict';

//Use the new constant keyword to set the array indexs for the corners.
const TOP_LEFT = 0
const TOP_RIGHT = 1
const BOTTOM_LEFT = 2
const BOTTOM_RIGHT = 3


//Using the class constucter as well as the default paramater options
class Node {
    constructor(bounds, depth = 0, maxDepth = 4, maxChildren = 4) {
        this.bounds = bounds;
        this.children = [];
        this.nodes = [];
        this.maxChildren = maxChildren;
        this.maxDepth = maxDepth;
        this.depth = depth;
    }
    //Insert, requires an object that has an x and y property
    Insert(item) {
        if (this.nodes.length) {
            //Find which node we need to look in
            let index = this.NodeFindIndex(item);
            //Call the insert again, using the newly founded node.
            this.nodes[index].Insert(item);
            return;
        }

        //Since there were no nodes push the item to this node.
        this.children.push(item);

        let len = this.children.length;
        //If we are over the maxchildren and still have room in our depth. We will need to sub divide the node.
        if (!(this.depth >= this.maxDepth) &&
            len > this.maxChildren) {

            //Get the binding options for the new nodes.
            //I made this a function that returns an list of new parameters to better try and suppor the extends on the
            //bound node
            let newnodes = this.Nodesubdivide();
            //Loop though each of the new options and create a new nodes.
            newnodes.forEach(i => this.nodes[i.corner] = new Node(i.bounds, i.depth, i.maxDepth, i.maxChildren));

            let i;
            for (i = 0; i < len; i++) {
                this.Insert(this.children[i]);
            }

            //remove the children as we are now a node that points to other nodes
            this.children.length = 0;
        }
    }
    Nodesubdivide() {
        let depth = this.depth + 1;
        let newnodessettings = [];
        let bx = this.bounds.x;
        let by = this.bounds.y;

        //We need at least a few numbers to make the subdivide easy
        let b_w_h = (this.bounds.width / 2);
        let b_h_h = (this.bounds.height / 2);
        let bx_b_w_h = bx + b_w_h;
        let by_b_h_h = by + b_h_h;
        //bx,by_____bx_b_w_h,by__________
        //|              |               |
        //|              |               |
        //bx,by_b_h_h__bx_b_w_h,by_b_h_h_|
        //|              |               |
        //|______________|_______________|


        //top left
        newnodessettings.push({
            corner: TOP_LEFT,
            bounds: {
                x: bx,
                y: by,
                width: b_w_h,
                height: b_h_h
            },
            depth: depth,
            maxDepth: this.maxDepth,
            maxChildren: this.maxChildren
        });

        //top right
        newnodessettings.push({
            corner: TOP_RIGHT,
            bounds: {
                x: bx_b_w_h,
                y: by,
                width: b_w_h,
                height: b_h_h
            },
            depth: depth,
            maxDepth: this.maxDepth,
            maxChildren: this.maxChildren
        });

        //bottom left
        newnodessettings.push({
            corner: BOTTOM_LEFT,
            bounds: {
                x: bx,
                y: by_b_h_h,
                width: b_w_h,
                height: b_h_h
            },
            depth: depth,
            maxDepth: this.maxDepth,
            maxChildren: this.maxChildren
        });


        //bottom right
        newnodessettings.push({
            corner: BOTTOM_RIGHT,
            bounds: {
                x: bx_b_w_h,
                y: by_b_h_h,
                width: b_w_h,
                height: b_h_h
            },
            depth: depth,
            maxDepth: this.maxDepth,
            maxChildren: this.maxChildren
        });


        return newnodessettings;
    }
    NodeFindIndex(item) {
        let b = this.bounds;
        //Check the X if X is greater then the mid point right, else left
        let left = !(item.x > b.x + b.width / 2);
        //check the Y if Y is greater then the mid point then bottem else top
        let top = !(item.y > b.y + b.height / 2);

        //Use the checks above to direct our path.
        var index = TOP_LEFT;
        if (left) {
            if (!top) {
                index = BOTTOM_LEFT;
            }
        } else {
            if (top) {
                index = TOP_RIGHT;
            } else {
                index = BOTTOM_RIGHT;
            }
        }

        return index;
    }
    Retrieve(item) {
        if (this.nodes.length) {
            //if there are nodes we need to check to which node we should look in.
            let index = this.NodeFindIndex(item);

            return this.nodes[index].Retrieve(item);
        }

        //return children, if we are a node this will return nothing.
        return this.children;
    }
    Clear() {
        this.children.length = 0;

        let len = this.nodes.length;

        this.nodes.forEach(i => i.Clear());

        this.nodes.length = 0;
    }
}

//BoundNode
class BoundNode extends Node {
    constructor(bounds, depth, maxDepth = 4, maxChildren = 4) {
        super(bounds, depth, maxDepth, maxChildren )
        this.stuckChildren = []
    }
    Insert(item) {
        if (this.nodes.length) {
            let index = super.NodeFindIndex(item);
            let node = this.nodes[index];

            if (item.x >= node.bounds.x &&
                item.x + item.width <= node.bounds.x + node.bounds.width &&
                item.y >= node.bounds.y &&
                item.y + item.height <= node.bounds.y + node.bounds.height) {

                this.nodes[index].Insert(item);

            } else {
                this.stuckChildren.push(item);
            }

            return
        }

        this.children.push(item)

        let len = this.children.length;

        if (!(this.depth >= this.maxDepth) &&
            len > this.maxChildren) {
            let newnodeoptions = super.Nodesubdivide();
            newnodeoptions.forEach(i => this.nodes[i.corner] = new BoundNode(i.bounds, i.depth, i.maxDepth, i.maxChildren));

            this.children.forEach(i => this.Insert(i));

            this.children.length = 0;
        }
    }
    Retrieve(item) {
        let out = [];
        if (this.nodes.length) {
            let index = super.NodeFindIndex(item);
            let node = this.nodes[index];

            if (item.x >= node.bounds.x &&
                item.x + item.width <= node.bounds.x + node.bounds.width &&
                item.y >= node.bounds.y &&
                item.y + item.height <= node.bounds.y + node.bounds.height) {

                out.push.apply(out, this.nodes[index].Retrieve(item));
            } else {

                if (item.x <= this.nodes[TOP_RIGHT].bounds.x) {
                    if (item.y <= this.nodes[BOTTOM_LEFT].bounds.y) {
                        out.push.apply(out,this.nodes[TOP_LEFT].getAllContent());
                    }

                    if (item.y + item.height > this.nodes[BOTTOM_LEFT].bounds.y) {
                        out.push.apply(out,this.nodes[BOTTOM_LEFT].getAllContent());
                    }
                }

                if (item.x + item.width > this.nodes[TOP_RIGHT].bounds.x) {
                    if (item.y <= this.nodes[BOTTOM_RIGHT].bounds.y) {
                        out.push.apply(out,this.nodes[TOP_RIGHT].getAllContent());
                    }

                    if (item.y + item.height > this.nodes[BOTTOM_RIGHT].bounds.y) {
                        out.push.apply(out,this.nodes[BOTTOM_RIGHT].getAllContent());
                    }
                }


            }
        }

        out.push.apply(out, this.stuckChildren);
        out.push.apply(out, this.children);
        return out;
    }
    Clear() {
        this.stuckChildren.length = 0
        this.children.length = 0

        let len = this.nodes.length

        if (!len) {
            return
        }

        this.nodes.forEach(i => i.Clear())

        this.nodes.length = 0
    }
    getAllContent() {
        let out = [];
        if (this.nodes.length) {
            this.nodes.forEach(i => out.push(i.getAllContent()))
        }
        out.push.apply(out, this.stuckChildren)
        out.push.apply(out, this.children)
        return out
    }
}

class QuadTree {
    constructor(bounds, maxDepth = 4, maxChildren = 4) {
        this.root = new BoundNode(bounds, 0, maxDepth, maxChildren)
    }
    Insert(item) {
        if (item instanceof Array)
            item.forEach(i => { this.root.Insert(i) })
        else
            this.root.Insert(item);
    }
    Clear() {
        this.root.Clear();
    }
    GetCollides(item) {
        let items = this.root.Retrieve(item);
        return items;
    }
    getAllContent() { return this.root.getAllContent();}
}

