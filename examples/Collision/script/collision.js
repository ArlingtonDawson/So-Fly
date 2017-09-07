'use strict';
let maxSize = 20;
let minSize = 1;
let maxV = 10;
let CollisonDetect = new BinaryCollison();

//CollisionShape OBJECT
function CollisionShape(x,y,height,width,xv,xy) {
    createjs.Shape.call(this);
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.deltax = xv;
    this.deltay = xy;

    this.IsCollided = ()=>{
        let results = CollisonDetect.GetItems(this);
        let collid = false;
        if (results == null)
            return collid;

        results.forEach((i) => {
            if (i !== this){
                if (i.x < this.x + this.width && i.x + i.width > this.x &&
                    i.y < this.y + this.height && i.y + i.height > this.y)
                {
                    collid = true;
                }
                    
            }
        });

        return collid;
    }
    

    this.Draw = function ()
    {
        let g = this.graphics;
        g.clear();

        if (this.IsCollided())
            g.beginFill("#ff0000").drawRect(this.x, this.y, height, width);
        else
            g.beginFill("#00ff00").drawRect(this.x, this.y, height, width);
    }
    this.Update = function(bounds)
    {
        //We need to check to make sure that they are with in the bounds of the canvas. If they are not we need to change the velocities.
        if (this.x + this.deltax > bounds.width || this.x + this.deltax < 0)
            this.deltax = this.deltax * -1;
        if (this.y + this.deltay > bounds.height || this.y + this.deltay < 0)
            this.deltay = this.deltay * -1;

        this.x = this.x + this.deltax;
        this.y = this.y + this.deltay;
    }
}

//We want to take on the object of the Easel shape
CollisionShape.prototype = new createjs.Shape();

function CollisionDemo(canvas)
{
    
    let pause = false;
    let shapes = [];
    let bounds = {
        x: 0,
        y: 0,
        height: canvas.height,
        width: canvas.width
    }
    //Create the objects to floot around. Probley will break it down some more once I add some window events.
    this.CreateShape = (count)=>{
        for (let icount = 0; icount < count; icount++)
        {
            let whichway = -1;
            let squaresize = Math.floor((Math.random() * maxSize) + minSize);
            let newShape = new CollisionShape(
                Math.floor((Math.random() * bounds.width) + 1),
                Math.floor((Math.random() * bounds.height) + 1),
                squaresize,
                squaresize,
                Math.floor((Math.random() * maxV) + 1) * whichway,
                Math.floor((Math.random() * maxV) + 1) * whichway
            );
            newShape.Draw();
            stage.addChild(newShape);
            shapes.push(newShape);
            whichway = whichway * -1;
        }
    }
    //Pause the canvas.
    this.Pause=()=>{
        pause = !pause;
        Ticker.setPaused(pause);
    }
    //This is the loop, we need to update each shape then render to the canvas.
    let update = () => {
        shapes.forEach(i => i.Update(bounds));
        CollisonDetect.Insert(shapes);
        shapes.forEach(i => i.Draw());
        stage.update();
    }


    //Set the stage to our canvas
    let stage = new createjs.Stage(canvas);
    //Create some shapes
    this.CreateShape(500);
    stage.update();
    //Set the FPS to 24 frames. Make this an option in the future.
    createjs.Ticker.setFPS(24);
    createjs.Ticker.addEventListener("tick", update);
}