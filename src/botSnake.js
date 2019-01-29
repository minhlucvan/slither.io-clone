/**
 * Bot extension of the core snake
 * @param  {Phaser.Game} game      game object
 * @param  {String} spriteKey Phaser sprite key
 * @param  {Number} x         coordinate
 * @param  {Number} y         coordinate
 */
BotSnake = function(game, spriteKey, x, y) {
    var initSections = Util.randomInt(0, 100);
    var skin = Util.randomInt(0, 5);
    Snake.call(this, game, spriteKey, x, y, skin, initSections);
    this.trend = Math.random();

    this.type = 'bot';
    this.name = 'Bot ' + Util.randomInt(0, 100);

    
    this.head.checkWorldBounds = true;
    this.head.events.onOutOfBounds.add(this.onOutOfBounds, this);
    this.head.events.onEnterBounds.add(this.onEnterBounds, this);
    
}

BotSnake.prototype = Object.create(Snake.prototype);
BotSnake.prototype.constructor = BotSnake;

/**
 * Add functionality to the original snake update method so that this bot snake
 * can turn randomly
 */
BotSnake.prototype.tempUpdate = BotSnake.prototype.update;
BotSnake.prototype.update = function() {
    if( this.isOutOfBounds ) {
        this.comeBackCenter();
        this.tempUpdate();
        return;
    } else {
        this.head.body.setZeroRotation();

        //ensure that the bot keeps rotating in one direction for a
        //substantial amount of time before switching directions
        if (Util.randomInt(1,15) == 1) {
            this.trend *= -1;
        }
        this.head.body.rotateRight(this.trend * this.rotationSpeed);
        this.tempUpdate();
    }
}

BotSnake.prototype.onOutOfBounds = function() {
    this.isOutOfBounds = true;
    console.log('onOutOfBounds');
}

BotSnake.prototype.onEnterBounds = function() {
    this.isOutOfBounds = false;
    console.log('onEnterBounds');
}

BotSnake.prototype.comeBackCenter = function() {
    console.log('comeBackCenter');

    var targetX = 0;
    var targetY = 0;
    var headX = this.head.body.x;
    var headY = this.head.body.y;
    var angle = (180*Math.atan2(targetX-headX,targetY-headY)/Math.PI);
    if (angle > 0) {
        angle = 180-angle;
    }
    else {
        angle = -180-angle;
    }
    var dif = this.head.body.angle - angle;
    this.head.body.setZeroRotation();

    //decide whether rotating left or right will angle the head towards
    //the mouse faster, if arrow keys are not used
    if (dif < 0 && dif > -180 || dif > 180) {
        this.head.body.rotateRight(this.rotationSpeed);
    }
    else {
        this.head.body.rotateLeft(this.rotationSpeed);
    }
}
