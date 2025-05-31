// This is free and open source software licensed under the GNU General Public License v3.0.
// You can redistribute it and/or modify it under the terms of the GPL-3.0 License.
// Copyright (C) Karl Sundström

var respawnTimer = 100; // Time in milliseconds to respawn bodies
// You can change this value to control how often new bodies are spawned
// This code uses the Matter.js physics engine to create a simple game environment
// where bodies are spawned at the top of the screen and fall down, bouncing off the ground and walls.
// The bodies can be clicked and dragged with the mouse.

var deathTimer = 50000; // Time in milliseconds to remove all 'body' objects
const bodySpawnYOffset = 50; // Y offset from the top of the screen where bodies are spawned

const screenheight = window.innerHeight;
const screenwidth = window.innerWidth;

const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  canvas: document.getElementById("gameCanvas"),
  engine: engine,
  options: {
    width: screenwidth,
    height: screenheight,
    wireframes: false,
    background: getRandomColor()
  },
});

Render.run(render);

const runner = Runner.create();
Runner.run(runner, engine);

// Create world
Composite.add(world, []);

// Add some dynamic bodies
Composite.add(world, [
  Bodies.circle(screenwidth / 2, 100, 40, { restitution: 0.8 }), // bouncing ball
]);
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: true,
    },
  },
});

// Make mouse click and drag bodies
Composite.add(world, mouseConstraint);
mouse.element.addEventListener("mousedown", function () {
  if (mouseConstraint.body)
    mouseConstraint.body.render.fillStyle = "orange"; // Change color on press
  else mouseConstraint.mouse.element.style.cursor = "pointer"; // Change cursor on hover
});

engine.world.gravity.y = 0; // Disable gravity for a more controlled environment
engine.world.gravity.x = 0; // Disable horizontal gravity

// Create static boundary walls
const thickness = 50;
const walls = [
  Bodies.rectangle(screenwidth / 2, -thickness / 2, screenwidth, thickness, {
    isStatic: true,
  }), // top
  Bodies.rectangle(
    screenwidth / 2,
    screenheight + thickness / 2,
    screenwidth,
    thickness,
    { isStatic: true },
  ), // bottom
  Bodies.rectangle(-thickness / 2, screenheight / 2, thickness, screenheight, {
    isStatic: true,
  }), // left
  Bodies.rectangle(
    screenwidth + thickness / 2,
    screenheight / 2,
    thickness,
    screenheight,
    { isStatic: true },
  ), // right
];
Composite.add(world, walls);

// Add a ground
const ground = Bodies.rectangle(
  screenwidth / 2,
  screenheight - 25,
  screenwidth,
  50,
  { isStatic: true },
);
Composite.add(world, ground);

// Add dynamic body spawner that shoots at ground
setInterval(() => {
  const x = Math.random() * screenwidth;
  const y = bodySpawnYOffset; // Start from the top
  const radius = 20 + Math.random() * 30; // Random radius between 20 and 50
  
  const body = Bodies.circle(x, y, radius, { 
    restitution: 0.6, 
    friction: 0.1,
    render: {
      fillStyle: getRandomColor(), // Random color for each body
    },
  });
  Composite.add(world, body);
}, respawnTimer); // Spawn a new body every second

// Add death function that removes non-static bodies after 5 seconds
// This is so that the respawn function doesn't cause an overflow of bodies
setInterval(() => {
    const bodies = Composite.allBodies(world);
    bodies.forEach((body) => {
        if (!body.isStatic) {
            console.log(`Removing body (id=${body.id}) at y=${body.position.y}`);
            Composite.remove(world, body); // Remove non-static bodies from the world
        }
    });
}, deathTimer); // Check every 5 seconds




// Remove non-static bodies when they collide with the ground
Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    pairs.forEach((pair) => {
        // Compare by id to ensure correct ground detection
        if ((pair.bodyA.id === ground.id && !pair.bodyB.isStatic)) {
            console.log(`Collision detected between ground and body ${pair.bodyB.id}`);
            Composite.remove(world, pair.bodyB);
        } else if ((pair.bodyB.id === ground.id && !pair.bodyA.isStatic)) {
            console.log(`Collision detected between ground and body ${pair.bodyA.id}`);
            Composite.remove(world, pair.bodyA);
        }
    });
});

// Function getRandomColor()
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}