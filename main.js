/*
Jellies spawn double, and collision isn't functional
Jelly spawner is just fucked
Use collide bottom y to kill man
*/
// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

// Create our 'main' state that will contain the game
var mainState = {
    
    preload: function() { 
        game.stage.backgroundColor = '#00FFFF';
        game.load.image('man', 'assets/bird.png');
        game.load.image('jelly', 'assets/pipe.png');
    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.man = this.game.add.sprite(150, 200, 'man');
        

        
        this.timer = game.time.events.loop(3000, this.addJelly(10,20), this);  
        
        game.physics.enable(this.man);
        
        this.man.body.gravity.y = 50;
       
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        var rightArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);    
        
        var leftArrow = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        
                        
        spaceKey.onDown.add(this.jump, this);
        rightArrow.onDown.add(this.right, this);
        leftArrow.onDown.add(this.left, this);
        
        this.pipes = game.add.group(); // Create a group  
        this.pipes.enableBody = true;  // Add physics to the group  
        this.pipes.createMultiple(20, 'jelly'); // Create 20 pipes 
        
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
        //game.physics.arcade.overlap(this.man, this.jellies, this.jump, null, this);  
        
         
    },
    
    jump: function() {  
        this.man.body.velocity.y = -100; 
    },
    
    right: function() {
        this.man.body.velocity.x = 50;
    },
    
    left: function() {
        this.man.body.velocity.x = -50;
    },
    

    addJelly: function(x, y) {
        // Get the first dead pipe of our group
        var pipe = this.pipes.getFirstExists();

    // Set the new position of the pipe
        pipe.reset(x, y);

    // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = -200; 

    // Kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
       /*
        x = (Math.random() * 400);
        y = 450;
        this.jelly = this.game.add.sprite(x, y, 'jelly');
        game.physics.enable(this.jelly);
        speed = - (Math.random() * 150);
        this.jelly.body.velocity.y = speed;
        this.jelly.checkWorldBounds = true;
        this.jelly.outOfBoundsKill = true;
        */
    },
        
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main');  