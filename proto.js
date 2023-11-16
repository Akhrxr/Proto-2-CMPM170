title = "Rocket Slide";

description = `
[Hold] Stop
`;

characters = [
  `
  l
 lll
l111l
  `,
  `
  l
 l1l
 1l1
  `,
  `
 l000l 
  l0l
 l0l0l
  l0l
 l000l 
  `,
];

options = {
  theme: "dark",
  isReplayEnabled: true,
  isPlayingBgm: true,
  seed: 697,
};

let isGameOver = false;
let moving = true;
let pos;
let hi = 0;
let Apos = vec(50, 90);
let cArray = [];
let bArray = [];
let on = true;

function update() {
  if (!ticks) {
    pos = vec(50, 90);
  }
  Move();
  color("red");
  char("a", Apos);
  if (bArray.length < 4 && on) { // Spawn up to 2 coins
    if (rnd(200) < 10) { // Chance to spawn a new coins
      const newB = {
        pos: vec(rnd(5,100), rnd(0,10)), // Random X position within boundaries
        speed: rnd(0.6, 1.2), // Random speed towards the left
        active: true
      };
      bArray.push(newB);
    }
  }

  color("yellow");
  bArray.forEach((coin,i) => {
    coin.pos.y += coin.speed; // Move downwards at random speed
    if (coin.active) {
      char("b", coin.pos);
      if (char("a", Apos).isColliding.char.b) {
        bArray.splice(i, 1);
        play("coin");
        score += 1;
      }
      if (coin.pos.y > 105) {
        bArray.splice(i, 1);
      }
    }
  });


  //Spawns in the aliens
  color("green");
  if (cArray.length < 4 && on) { // Spawn up to 4 aliens
    if (rnd(200) < 10) { // Chance to spawn a new alien
      const newC = {
        pos: vec(rnd(5,100), -10), // Random X position within boundaries
        speed: rnd(0.3, 0.8), // Random speed towards the left
        active: true
      };
      cArray.push(newC);
    }
  }

  cArray.forEach((c, i) => {
    if (c.active) {
      c.pos.y += c.speed;
      char("c", c.pos);

      if (c.pos.y > 105) {
        cArray.splice(i, 1);
      }
    }
  });
  if (!isGameOver) {
    if (score > hi) {
      hi = score;
    }
    cArray.forEach((c, i) => {
      if (c.active) {
        char("c", c.pos); // Display the aliens
        // Check for collision with player
        color("red");
        if (char("a", Apos).isColliding.char.c) {
          isGameOver = true;
          play("explosion"); // Play a sound effect for the collision
        }
        color("green")
        if (c.pos.y > 105) {
          cArray.splice(i, 1); // Remove the spaceship character if it goes off-screen
        }
      }
    });
  } else {
    on = false;
    color("white");
    rect(0, 0, 1000, 1000); 
    color("red");
    text("Game Over", 25, 30);
    text(`Score:${score}`, 27, 50);
    text(`High Score:${hi}`, 15, 60);
    color("black");
    text("Restart?", 26 , 80);
    if (input.isJustPressed) {
      isGameOver = false; 
      score = 0; 
      pos = vec(50, 90); 
      Apos = vec(50, 90);
      bArray = [];
      cArray = [];
      play("select"); 
      on = true;
    }
  }
}

function Move() {
  if (Apos.x > 0 && moving && !input.isPressed) {
    Apos.x -= 1;
  }
  if (Apos.x < 3) {
    moving = false;
  }
   if (Apos.x < 100 && !moving && !input.isPressed) {
    Apos.x += 1;
  }
  if (Apos.x >= 97) {
    moving = true;
  }
}

addEventListener("load", onLoad);
