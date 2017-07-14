//As something thing fun to do while learning some of the new ES6 stuff I decided to convert
https://github.com/mikechambers/ExamplesByMesh/tree/master/JavaScript/QuadTree 
//

//ToDo: Make things a little cleaner. Review the code more closesly to find out where we can leverage
//more ES6. Would like to eventally push changes to where it should belong which is at above GitSite

'use strict';

const TOP_LEFT = 0
const TOP_RIGHT = 1
const BOTTOM_LEFT = 2
const BOTTOM_RIGHT = 3


class Node {
    constructor(bounds, depth = 0, maxDepth = 4, maxChildren = 4) {
        this.bounds = bounds
        this.children = []
        this.nodes = []
        this.maxChildren = maxChildren
        this.maxDepth = maxDepth
        this.depth = depth
    }
    Insert(item) {
        if (this.nodes.length) {
            let index = this.NodeFindIndex(item);
            this.nodes[index].Insert(item);
            return;
        }

        this.children.push(item);

        let len = this.children.length;
        if (!(this.depth >= this.maxDepth) &&
            len > this.maxChildren) {

            this.Nodesubdivide();

            let i;
            for (i = 0; i < len; i++) {
                this.Insert(this.children[i]);
            }

            this.children.length = 0;
        }
    }
    Nodesubdivide() {
        let depth = this._depth + 1;

        let bx = this.bounds.x;
        let by = this.bounds.y;

        //floor the values
        let b_w_h = (this.bounds.width / 2); //todo: Math.floor?
        let b_h_h = (this.bounds.height / 2);
        let bx_b_w_h = bx + b_w_h;
        let by_b_h_h = by + b_h_h;

        //top left
        this.nodes[TOP_LEFT] = new Node({
            x: bx,
            y: by,
            width: b_w_h,
            height: b_h_h
        },
            depth, this._maxDepth, this._maxChildren);

        //top right
        this.nodes[TOP_RIGHT] = new Node({
            x: bx_b_w_h,
            y: by,
            width: b_w_h,
            height: b_h_h
        },
            depth, this._maxDepth, this._maxChildren);

        //bottom left
        this.nodes[BOTTOM_LEFT] = new Node({
            x: bx,
            y: by_b_h_h,
            width: b_w_h,
            height: b_h_h
        },
            depth, this._maxDepth, this._maxChildren);


        //bottom right
        this.nodes[BOTTOM_RIGHT] = new Node({
            x: bx_b_w_h,
            y: by_b_h_h,
            width: b_w_h,
            height: b_h_h
        },
            depth, this._maxDepth, this._maxChildren);
    }
    NodeFindIndex(item) {
        let b = this.bounds;
        let left = (item.x > b.x + b.width / 2) ? false : true;
        let top = (item.y > b.y + b.height / 2) ? false : true;

        //top left
        var index = TOP_LEFT;
        if (left) {
            //left side
            if (!top) {
                //bottom left
                index = BOTTOM_LEFT;
            }
        } else {
            //right side
            if (top) {
                //top right
                index = TOP_RIGHT;
            } else {
                //bottom right
                index = BOTTOM_RIGHT;
            }
        }

        return index;
    }
    Retrieve(item) {
        if (this.nodes.length) {
            let index = this.NodeFindIndex(item);

            return this.nodes[index].Retrieve(item);
        }

        return this.children;
    }
    Clear() {
        this.children.length = 0;

        let len = this.nodes.length;

        this.nodes.forEach(i => i.Clear());

        this.nodes.length = 0;
    }
}

class BoundNode extends Node {
    constructor(bounds, depth, maxDepth = 4, maxChildren = 4) {
        super(bounds, depth, maxChildren, maxDepth)
        this.stuckChildren = []
    }
    Insert(item) {
        if (this.nodes.length) {
            let index = super.NodeFindIndex(item)
            let node = this.nodes[index]

            if (item.x >= node.bounds.x &&
                item.x + item.width <= node.bounds.x + node.bounds.width &&
                item.y >= node.bounds.y &&
                item.y + item.height <= node.bounds.y + node.bounds.height) {

                this.nodes[index].Insert(item)

            } else {
                this.stuckChildren.push(item)
            }

            return
        }

        this.children.push(item)

        let len = this.children.length

        if (!(this.depth >= this.maxDepth) &&
            len > this.maxChildren) {
            super.Nodesubdivide()

            this.children.forEach(i => this.Insert(i))

            this.children.length = 0
        }
    }
    Retrieve(item) { return super.Retrieve(item) }
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
            nodes.forEach(i => i.getAllContent())
        }
        out.push.apply(out, this._stuckChildren)
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
            this.root.Insert(item)
    }
    Clear() {
        this.root.Clear()
    }
    GetCollides(item) {
        let items = this.root.Retrieve(item)
        return items
    }
}

