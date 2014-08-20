/*
Highscores
Kill jellies for oxygen
bigger jellies and oxygen bubbles
fish? Kill fish?
Annimation - at least learn
*/
// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {

    preload: function() {
        game.stage.backgroundColor = '#260A7A';
        game.load.image('man', 'assets/Man.png');
        game.load.image('jelly', 'assets/Jelly.png');
        game.load.image('bubble', 'assets/Bubble.png');
        game.load.spritesheet('manSpriteSheet', 'assets/manSpriteSheet.png', 25, 50, 4);
        this.highScores = JSON.parse(localStorage.getItem("scuba_highScores"));


    },

    create: function() {
        // This function is called after the preload function
        // Here we set up the game, display sprites, etc.
        this.updateHighScores();
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.man = this.game.add.sprite(400, 0, 'manSpriteSheet');
        this.man.animations.add('stabDown');

        this.jellies = game.add.group(); // Create a group
        this.jellies.enableBody = true;  // Add physics to the group
        this.jellies.createMultiple(20, 'jelly'); // Create 20 jellies

        this.bubbles = game.add.group(); // Create a group
        this.bubbles.enableBody = true;  // Add physics to the group
        this.bubbles.createMultiple(20, 'bubble');
        //this.jellyTime = 3000;
        //this.timer = game.time.events.loop(this.randomTimer(), this.addJelly, this);

        //setTimeout(mainState.addJelly, 3000, this);

        game.physics.enable(this.man);

        this.man.body.gravity.y = 100;

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        var rightArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        var leftArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        this.counter = 0;

        this.bubbleCounter = 0;


        spaceKey.onDown.add(this.stabDown, this);
        rightArrow.onDown.add(this.right, this);
        leftArrow.onDown.add(this.left, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });



        this.labelOxygen = game.add.text(600, 20, "0", { font: "30px Arial", fill: "#ffffff" })
        this.timeScore = 0;
        this.oxygen = 50;


        this.addJelly();

    },

    update: function() {
        // This function is called 60 times per second
        // It contains the game's logic
        if(Math.random() < (1 / 30)) {
            this.changeOxygen(-1);
        }

        this.timeScore++;
        if (this.timeScore % 60 === 0) {
            this.score++;
        };

        if(Math.random() < (1 / 180) || this.counter > 180) {
            this.addJelly();
            this.counter = 0;
        } else {
            this.counter++;
        };

        if(Math.random() < (1 / 360) || this.bubbleCounter > 360) {
            this.addBubble();
            this.bubbleCounter = 0;
        } else {
            this.bubbleCounter++;
        };

        game.physics.arcade.overlap(this.man, this.jellies, this.bounce, null, this);

        game.physics.arcade.overlap(this.man, this.bubbles, this.addOxygen, null, this);




        this.labelOxygen.text = "Oxygen: " + this.oxygen + "%";

        this.labelScore.text = "Score: " + this.score;




        if(this.oxygen === 0) {
            this.restartGame();
        };

        if (this.man.inWorld == false) {
            this.restartGame();
        };

    },

    bounce: function(man, jelly) {

        if(man.body.y + man.body.height <= jelly.body.y + 10) {
            console.log("man hits top of jelly");
            man.body.velocity.y = -200;
            man.body.y = jelly.body.y - man.body.height - 1;
        } else if(man.body.x + man.body.width <= jelly.body.x + 5   && man.body.y <= jelly.body.y + jelly.body.height) {
            console.log("man hits left side of jelly");
            man.body.velocity.x = -100;
            man.body.x = jelly.body.x - man.body.width - 1;
        } else if (man.body.x  >= jelly.body.x + jelly.body.width - 5 && man.body.y <= jelly.body.y + jelly.body.height){
            console.log("man hits right side of jelly");
            man.body.velocity.x = 100;
            man.body.x = jelly.body.x + jelly.body.width + 1;
        } else if (man.body.y <= jelly.body.y) {
            this.restartGame();
        };
    },

    right: function() {
        this.man.body.velocity.x += 25;
    },

    left: function() {
        this.man.body.velocity.x += -25;
    },


    addJelly: function() {
        // Get the first dead jelly of our group
        console.log("Jelly spawn");
        var jelly = this.jellies.getFirstDead();

        var speed = - (Math.random() * 100);

        // Set the new position of the jelly
        var jellyX = Math.random() * 780;
        jelly.reset(jellyX, 580);

        // Add velocity to the jelly to make it move left
        jelly.body.velocity.y = speed;

        // Kill the jelly when it's no longer visible
        jelly.checkWorldBounds = true;
        jelly.outOfBoundsKill = true;

    },

    addBubble: function() {
        // Get the first dead jelly of our group
        console.log("Bubble spawn");
        var bubble = this.bubbles.getFirstDead();



        // Set the new position of the jelly
        var bubbleX = Math.random() * 780;
        bubble.reset(bubbleX, 580);

        // Add velocity to the jelly to make it move left
        bubble.body.velocity.y = -75;

        // Kill the jelly when it's no longer visible
        bubble.checkWorldBounds = true;
        bubble.outOfBoundsKill = true;

    },

    restartGame: function() {
    // Start the 'main' state, which restarts the game
        this.addHighScore({score: this.score});
        game.state.start('main');
    },

    addScore: function(toAdd) {
        this.score += toAdd;
    },

    changeOxygen: function() {
        this.oxygen -= 1;
    },

    addOxygen: function(man, bubble) {
        this.oxygen += 10;
        bubble.body.y = 0 - bubble.body.height;
    },

    stabDown: function() {
        this.man.animations.play('stabDown', 10, false);
        this.stabJelly(this.man);


    },

    stabJelly: function(man) {
        var self = this;
        console.log("stabJelly");
        this.jellies.forEachAlive(function(jelly) {
            if(jelly.body.x - man.body.width < man.body.x && jelly.body.x + jelly.body.width + man.body.width > man.body.x && jelly.body.y > man.body.y && jelly.body.y - 20 - man.body.height < man.body.y) {
                console.log("Resetting jelly");
                jelly.reset(0, 0 - jelly.body.height);
                man.body.velocity.y = -200;
                jelly.body.velocity.y = -200;
                jelly.checkWorldBounds = true;
                jelly.outOfBoundsKill = true;

                self.addScore(5);
            }
        });
    },

    updateHighScores: function() {
        if($.isEmptyObject(this.highScores)) {
            this.highScores = [];
        }
        this.highScores = this.highScores.sort(function(a, b) {
            if(a.score >= b.score) {
                return -1;
            } else {
                return 1;
            }
        });
        $("#highScoreList").html("");
        $.each(this.highScores, function(i, highScore) {
            if(i < 10) {
                $("#highScoreList").append("<li>" + highScore.score + "</li>");
            }
        });
    },

    addHighScore: function(highScore) {
        this.highScores.push(highScore);
        localStorage.setItem("scuba_highScores", JSON.stringify(this.highScores));
        this.updateHighScores();
    }

};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');