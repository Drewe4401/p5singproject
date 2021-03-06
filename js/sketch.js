//Andrew Ellender
let imagebug, score, walking, squished, time, gameState, bugGroup, sequence2,
timerIsDone, startTime, speed, soundsquish, sequence1, synth, miss, bugwalk, menutheme;
let walls = [];
let bugimages = [];
let dir = [0, 90, 180, 270];
let sequence = ['A5', 'C5' , 'D5',  'A5',  'C5' , 'Eb5' , 'D5' , 'A5' , 'C5' , 'D5' , 'C5' , 'A5'];




function preload(){
for(let i = 1; i < 10; i++){
  bugimages[i] = loadImage("media/spiderfinal" + i + ".png");
}
}

function setup() {
  createCanvas(800, 800);
  score = 0;
  startTime = 30;
  speed = 2;
  timerIsDone = false;
  gameState = "start";
  bugGroup = new Group();
  walls = new Group();
  rectMode(CENTER);
  textAlign(CENTER);
  borders();

  soundsquish = new Tone.Player("media/squishsound.mp3").toDestination();
miss = new Tone.Player("media/miss.mp3").toDestination();
bugwalk = new Tone.Player("media/bugwalk.mp3").toDestination();


soundsquish.volume.value = -15;
bugwalk.volume.value = -13;

synth = new Tone.Synth().toDestination();
synth.volume.value = -15;
  sequence1 = new Tone.Sequence(function(time, note) { 
    synth.triggerAttackRelease(note, 0.5);
  }, sequence, '4n');



  Tone.Transport.bpm.value = 135; 
  Tone.Transport.bpm.rampTo(1000, 30);
  Tone.Transport.loop = true; 
  Tone.Transport.loopStart = 0; 
  Tone.Transport.loopEnd = '2:0:0';
  

}
function draw(){

background(255,255,255);

if(gameState === "start"){
 
push();
fill("blue");
rect(width / 2, height / 2, 200, 150);
fill(0);
text("Squish the bugs\n Click all the bugs as fast as possible\n click to start", width/2, height/2);
pop();
if(mouseIsPressed){
  makeBugs(10);
  gameState = "play";
  bugwalk.start();

}

}
else if(gameState === "play"){
  Tone.Transport.start();
  sequence1.start();
push();
fill(0);
text("Time Left: " + (startTime - timer() % startTime) + "\nScore: " + score, 50 , 20);
pop();
if(bugGroup.length < 1){
  makeBugs(10);
}
timer();
bugGroup.collide(walls, teleport);
bugGroup.displace(bugGroup);
drawSprites();
if(timerIsDone === true){
  gameState = "end";
  sequence1.stop();
  Tone.Transport.stop();
  bugwalk.stop();
}
}
else if(gameState === "end"){
 
push();
fill("grey");
rect(width / 2, height /2, 200 ,150);
fill(0);
text("Game Over!\nYou Squished\n" + score + "\n Bugs!\n Pressed spacebar to play again", width /2, height/2);
pop();
if(keyIsPressed){
  if(keyCode === 32){
   
    setup();
      }
    }
  }
}


function timer() {
  time = int((millis() - startTime) / 1000);
  if (time % startTime === 0) {
    timerIsDone = true;
  }
  return time;
}

function makeBugs(num) {
  for (let i = 0; i < num; i++) {

    imagebug = createSprite(random(100, width - 100), random(100, height - 100), 50, 50);
    imagebug.isDead = false;
    imagebug.rotation = random(dir);
  
    if (imagebug.rotation === 0) {
      imagebug.setSpeed(speed, 0);
    } else if (imagebug.rotation === 90) {
      imagebug.setSpeed(speed, 90);
    } else if (imagebug.rotation === 180) {
      imagebug.setSpeed(speed, 180);
    } else if (imagebug.rotation === 270) {
      imagebug.setSpeed(speed, 270);
    }

    walking = imagebug.addAnimation("walk", bugimages[1], bugimages[2], bugimages[3], bugimages[4], bugimages[5], bugimages[6], bugimages[7], bugimages[8]);
    walking.frameDelay = 8;
    squished = imagebug.addAnimation("squish", bugimages[9]);

    

    imagebug.onMouseReleased = function() {

      

      if (this.isDead === false) {
        soundsquish.start();
        this.changeAnimation("squish");
        this.setSpeed(0, 0);
        this.life = 100;
        score++;
        speed = speed + (score * 0.004);
        bugGroup.remove(this);
        this.isDead = true;
       
      }
    };


    bugGroup.add(imagebug);
  }
}

function borders() {
  for (let i = 0; i < 4; i++) {
    let wall;
    if (i === 0) {
       wall = createSprite(width / 2, -100, 2000, 10);
    } else if (i === 1) {
     wall = createSprite(width / 2, height + 100, 2000, 10);
    } else if (i === 2) {
     wall = createSprite(-100, height / 2, 10, 2000);
    } else if (i === 3) {
     wall = createSprite(height + 100, height / 2, 10, 2000);
    }
    wall.immovable = true;
    walls.add(wall);
  }
}


function teleport() {
  if (this.rotation === 0) {
    this.position.x = -50;
    this.position.y = random(20, height - 20);
  } else if (this.rotation === 180) {
    this.position.x = width + 50;
    this.position.y = random(20, height - 20);
  } else if (this.rotation === 90) {
    this.position.y = -50;
    this.position.x = random(20, width - 20);
  } else if (this.rotation === 270) {
    this.position.y = height + 50;
    this.position.x = random(20, width - 20);
  }
}