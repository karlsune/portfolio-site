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
    wireframes: true,
    background: "lightblue",
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
  Bodies.rectangle(screenwidth / 2 + 50, 50, 80, 40, { angle: Math.PI / 4 }), // tilted rectangle
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
// Prevent bodies from going out of bounds
