// This is free and open source software licensed under the GNU General Public License v3.0.
// You can redistribute it and/or modify it under the terms of the GPL-3.0 License.
// Copyright (C) Karl Sundström

var updatetimer = 100; // Time in milliseconds to update the game state

var difficultyfactor = 1.0; // Factor to increase difficulty over time

var respawnTimer = updatetimer * 10; // Time in milliseconds to respawn bodies

var gameoveracknowledged = false; // Flag to check if game over has been acknowledged by the player


// You can change this value to control how often new bodies are spawned
// This code uses the Matter.js physics engine to create a simple game environment
// where bodies are spawned at the top of the screen and fall down, bouncing off the ground and walls.
// The bodies can be clicked and dragged with the mouse.

var deathTimer = updatetimer * 5000; // Time in milliseconds to remove all 'body' objects
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

engine.world.gravity.y = 0; // Disable vertical gravity
engine.world.gravity.x = 0; // Disable horizontal gravity

// No boundary walls are added here.
// To keep the game playable, you may want to handle out-of-bounds bodies manually.
// For example, remove any body that falls off the screen:

Matter.Events.on(engine, "afterUpdate", () => {
    const bodies = Composite.allBodies(world);
    bodies.forEach((body) => {
        if (
            !body.isStatic &&
            (
                body.position.x < -100 ||
                body.position.x > screenwidth + 100 ||
                body.position.y > screenheight + 100
            )
        ) {
            Composite.remove(world, body);
        }
    });
});

// Define thickness for paddle/ground placement
const thickness = 50;

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

    if (isPaused) return; // If the game is paused, do not spawn new bodies
  const x = Math.random() * screenwidth;
  const y = bodySpawnYOffset * (5 * Math.random()); // Start from the top in range to avoid overlap
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

            playerlives--; // Decrease player lives when a body collides with the ground
            window.hurtSound.currentTime = 0;
            window.hurtSound.play();            

        } else if ((pair.bodyB.id === ground.id && !pair.bodyA.isStatic)) {
            console.log(`Collision detected between ground and body ${pair.bodyA.id}`);
            Composite.remove(world, pair.bodyA);

            playerlives--; // Decrease player lives when a body collides with the ground
            window.hurtSound.currentTime = 0;
            window.hurtSound.play();
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

// Add touch responsive paddle at bottom of screen
const paddlewidth = screenwidth / 5;
const paddleheight = screenheight / 20;

const paddle = Bodies.rectangle(
    screenwidth / 2,
    screenheight - thickness - paddleheight / 2 - 10, // Place paddle just above the ground
    paddlewidth,
    paddleheight,
    {
        isStatic: true, // Make paddle static so it doesn't fall
        render: {
            fillStyle: "blue",
        },
    }
);
Composite.add(world, paddle);

paddle.friction = 0;
paddle.frictionAir = 0.2;
paddle.frictionStatic = 0;

// Constrain paddle to only move horizontally (like on rails)
Matter.Events.on(engine, "beforeUpdate", function () {
    // Lock paddle's y position and angle
    Matter.Body.setPosition(paddle, {
        x: paddle.position.x,
        y: screenheight - thickness - paddleheight / 2 - 10
    });
    Matter.Body.setAngle(paddle, 0);
    // Zero out vertical velocity and angular velocity
    paddle.velocity.y = 0;
    paddle.angularVelocity = 0;
});

// Optional: allow paddle to be moved by mouse/touch horizontally
render.canvas.addEventListener("mousemove", function (e) {
    if (isPaused) return; // If the game is paused, do not move the paddle
    const rect = render.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    Matter.Body.setPosition(paddle, {
        x: Math.max(
            paddlewidth / 2,
            Math.min(mouseX, screenwidth - paddlewidth / 2)
        ),
        y: paddle.position.y
    });
});

engine.world.gravity.y = 1; // Enable downward gravity so balls fall

let score = 0;

// Listen for collisions between balls and paddle
Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((pair) => {
        // Check if paddle is involved in the collision
        if ((pair.bodyA.id === paddle.id && !pair.bodyB.isStatic)) {
            Composite.remove(world, pair.bodyB);
            score++;
            if (window.pickupSound) {
                window.pickupSound.currentTime = 0;
                window.pickupSound.play();
            }
            console.log("Score:", score);
        } else if ((pair.bodyB.id === paddle.id && !pair.bodyA.isStatic)) {
            Composite.remove(world, pair.bodyA);
            score++;
            if (window.pickupSound) {
                window.pickupSound.currentTime = 0;
                window.pickupSound.play();
            }
            console.log("Score:", score);
        }
    });
});

// Display score on web page top centered font jetbrains mono bold
const scoreDisplay = document.createElement("div");
const fontsize = 24;
const fontcolor = getRandomColor();
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.left = "50%";
scoreDisplay.style.transform = "translateX(-50%)";
scoreDisplay.style.fontFamily = "JetBrains Mono, monospace";
scoreDisplay.style.fontSize = fontsize + "px";
scoreDisplay.style.color = fontcolor;
scoreDisplay.style.textAlign = "center";
scoreDisplay.textContent = "Score: " + score;
document.body.appendChild(scoreDisplay);
// Update score display
setInterval(() => {
    scoreDisplay.textContent = "Score: " + score;
}, updatetimer); // Update every 100 milliseconds

// Implement pause functionality
let isPaused = false;
document.addEventListener("keydown", (event) => {
    if (event.key === "p" || event.key === "P") {
        isPaused = !isPaused;
        if (isPaused) {
            Runner.stop(runner);
            scoreDisplay.textContent = "Paused - Score: " + score;
        } else {
            Runner.start(runner, engine);
            scoreDisplay.textContent = "Score: " + score;
        }
    }
});

// Implement lives system and rendering
let playerlives = 5;
const livesDisplay = document.createElement("div");
livesDisplay.style.position = "absolute";
livesDisplay.style.top = "10px";
livesDisplay.style.right = "10px";
livesDisplay.style.fontFamily = "JetBrains Mono, monospace";
livesDisplay.style.fontSize = fontsize + "px";
livesDisplay.style.color = fontcolor;
livesDisplay.style.textAlign = "right";
livesDisplay.textContent = "Lives: " + playerlives;
document.body.appendChild(livesDisplay);
// Update lives display
setInterval(() => {
    livesDisplay.textContent = "Lives: " + playerlives;
}, updatetimer); // Update every 100 milliseconds

// If lives = 0, return to start menu and set respawn timer to updateTimer / 4
function goToStartMenu() {
    // Stop the game loop and rendering
    isPaused = true;
    // Optionally, hide the canvas and show a start menu UI
    render.canvas.style.display = "none";
    scoreDisplay.textContent = "Game Over - Score: " + score;
    livesDisplay.textContent = "Lives: 0";
    // Show alert and reload page on OK
    alert("Game Over!\nYour score: " + score);
    window.location.reload();
    gameoveracknowledged = true; // Set flag to true to indicate game over has been acknowledged
}

// Watch for lives reaching zero
setInterval(() => {
    if (playerlives <= 0 && !gameoveracknowledged) {
        window.gameOverSound.currentTime = 0;
        window.gameOverSound.play();
        goToStartMenu();
        respawnTimer = updatetimer / 4;
    }
}, updatetimer);

// Add audio for sound effects
// Initialize all sound effects at startup

defineSoundEffects();

function defineSoundEffects() {
    window.pickupSound = new Audio("./audio/pickup.wav");
    window.pickupSound.volume = 0.5; // Adjust volume as needed
    window.hurtSound = new Audio("./audio/hurt.wav");
    window.hurtSound.volume = 0.5; // Adjust volume as needed
    window.gameOverSound = new Audio("./audio/gameover.wav");
    window.gameOverSound.volume = 0.5; // Adjust volume as needed
}

