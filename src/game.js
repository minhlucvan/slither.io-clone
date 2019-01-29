var LOG = console.log;
Game = function (game) {
    game.controller = this;
 }


Game.prototype = {
    preload: function () {

        //load assets
        this.game.load.image('circle', 'asset/circle.png');
        this.game.load.image('circle-0', 'asset/circle-skin-00.png');
        this.game.load.image('circle-1', 'asset/circle-skin-01.png');
        this.game.load.image('circle-2', 'asset/circle-skin-02.png');
        this.game.load.image('circle-3', 'asset/circle-skin-03.png');
        this.game.load.image('circle-4', 'asset/circle-skin-04.png');
        this.game.load.image('circle-5', 'asset/circle-skin-05.png');
        this.game.load.image('circle-6', 'asset/circle-skin-06.png');
        this.game.load.image('circle-7', 'asset/circle-skin-07.png');
        this.game.load.image('circle-8', 'asset/circle-skin-08.png');
        this.game.load.image('circle-9', 'asset/circle-skin-09.png');

        this.game.load.image('shadow', 'asset/white-shadow.png');
        this.game.load.image('background', 'asset/bg54.jpg');

        this.game.load.image('eye-white', 'asset/eye-white.png');
        this.game.load.image('eye-black', 'asset/eye-black.png');

        this.game.load.image('food', 'asset/hex.png');
    },
    create: function () {
        var width = this.game.width * 3;
        var height = this.game.height * 3;

        this.game.world.setBounds(-width, -height, width * 2, height * 2);
        this.game.stage.backgroundColor = '#444';

        //add tilesprite background
        var background = this.game.add.tileSprite(-width, -height,
            this.game.world.width, this.game.world.height, 'background');

        //initialize physics and groups
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.foodGroup = this.game.add.group();
        this.snakeHeadCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.foodCollisionGroup = this.game.physics.p2.createCollisionGroup();

        var minimapScale = 0.15;
        var minimapX = this.game.width - this.game.width*minimapScale/4 - 50;
        var minimapY = this.game.camera.height -this.game.camera.height*minimapScale/2 - 40;
        this.minimap = new Minimap(this.game, minimapX, minimapY, minimapScale);

        var infoPanelX = 0;
        var infoPanelY = this.game.camera.height - 60;
        this.infoPanel = new InfoPanel(this.game, infoPanelX, infoPanelY); 

        //add food randomly
        for (var i = 0; i < 1500; i++) {
            this.initFood(Util.randomInt(-width, width), Util.randomInt(-height, height));
        }

        this.game.snakes = [];

        this.spawnPlayer();

        for (var i = 0; i < 6; i++) {
            this.spawnBot();
        }

    },
    /**
     * Main update loop
     */
    update: function () {
        //update game components
        for (var i = this.game.snakes.length - 1; i >= 0; i--) {
            this.game.snakes[i].update();
        }
        for (var i = this.foodGroup.children.length - 1; i >= 0; i--) {
            var f = this.foodGroup.children[i];
            f.food.update();
        }

        this.minimap.update();

        this.infoPanel.update();
    },
    /**
     * Create a piece of food at a point
     * @param  {number} x x-coordinate
     * @param  {number} y y-coordinate
     * @return {Food}   food object created
     */
    initFood: function (x, y, value) {
        var f = new Food(this.game, x, y, value);
        f.sprite.body.setCollisionGroup(this.foodCollisionGroup);
        this.foodGroup.add(f.sprite);
        f.sprite.body.collides([this.snakeHeadCollisionGroup]);
        f.addDestroyedCallback(this.destroyMiniSprite.bind(this, f), this);
        this.minimap.addFood(f); 

        return f;
    },
    snakeDestroyed: function (snake) {
        //place food where snake was destroyed
        var value = snake.sections.length; 
        for (var i = 0; i < snake.headPath.length;
            i += Math.round(snake.headPath.length / snake.snakeLength) * 2) {
                this.initFood(
                    snake.headPath[i].x + Util.randomInt(-10, 10),
                    snake.headPath[i].y + Util.randomInt(-10, 10),
                    (Math.random() * (1 - 0.3) + 0.3) * value*0.015
                );
        }

        if (snake.type == 'bot') {
            this.spawnBot();
        }
    },

    spawnBot: function () {
        var x = Util.randomInt(-this.game.width / 2, this.game.width / 2),
            y = Util.randomInt(-this.game.width / 2, this.game.width / 2);
        var skin = Util.randomInt(0, 9);

        var snake = new BotSnake(this.game, 'circle-' + skin, x, y);
        snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
        snake.head.body.collides([this.foodCollisionGroup]);
        //callback for when a snake is destroyed
        snake.addDestroyedCallback(this.snakeDestroyed, this);

    },
    spawnPlayer: function () {
        var skin = Util.randomInt(0, 9);

        var snake = new PlayerSnake(this.game, 'circle-' + skin, 0, 0);
        snake.head.body.setCollisionGroup(this.snakeHeadCollisionGroup);
        snake.head.body.collides([this.foodCollisionGroup]);
        //callback for when a snake is destroyed
        snake.addDestroyedCallback(this.snakeDestroyed, this);
        snake.addDestroyedCallback(this.game.showGameOver, this);
        snake.addDestroyedCallback(this.destroyMiniSprite.bind(this, snake), this);
        this.game.player = snake;
        this.game.camera.follow(snake.head);
        snake.respawn = this.spawnPlayer;
        this.minimap.addSneak(snake);
    },
    destroyMiniSprite(object) {
        this.minimap.destroyObject(object);
    }

};
