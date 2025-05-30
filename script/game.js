const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
    canvas: document.getElementById('gameCanvas'),
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: true,
        background: 'lightblue'
    }
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

Composite.add(world, [
    Bodies.rectangle(400, 580, 810, 60, { isStatic: true }), // ground
    Bodies.rectangle(400, 0, 810, 60, { isStatic: true }), // ceiling
    Bodies.rectangle(0, 300, 60, 600, { isStatic: true }), // left wall
    Bodies.rectangle(800, 300, 60, 600, { isStatic: true }) // right wall

    
]);

// Add some dynamic bodies
Composite.add(world, [
    Bodies.circle(400, 100, 40, { restitution: 0.8 }), // bouncing ball
    Bodies.rectangle(450, 50, 80, 40, { angle: Math.PI / 4 }) // tilted rectangle
]);
/*
To run and program this game at the same time, you can:
1. Open your HTML file (that includes this script and a canvas with id="gameCanvas") in your browser.
2. Edit this JavaScript file in your code editor.
3. Save changes and refresh the browser to see updates.

For a smoother workflow, use a local development server with live reload (like VS Code Live Server, or `npm install -g live-server` and run `live-server` in your project directory). This way, the browser reloads automatically when you save changes.

You can also open the browser's developer console to experiment with Matter.js code live.
*/