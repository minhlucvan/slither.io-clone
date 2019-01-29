/**
 * Food that snakes eat - it is pulled towards the center of a snake head after
 * it is first touched
 * @param  {Phaser.Game} game game object
 * @param  {Number} x    coordinate
 * @param  {Number} y    coordinate
 */
Food = function (game, x, y, value) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.value = value || Math.random() * (0.7 - 0.3) + 0.3;
    this.debug = false;
    this.sprite = this.game.add.sprite(x, y, 'food');
    this.sprite.tint = Util.randomInt(0, 0xffffff);

    this.game.physics.p2.enable(this.sprite, this.debug);
    this.sprite.body.clearShapes();
    this.sprite.body.addCircle(this.sprite.width * 0.5);
    this.sprite.scale.setTo(1.5*this.value);

    //set callback for when something hits the food
    this.sprite.body.onBeginContact.add(this.onBeginContact, this);

    this.sprite.food = this;

    this.head = null;
    this.constraint = null;

    this.onDestroyedCallbacks = [];
    this.onDestroyedContexts = [];
}

Food.prototype = {
    onBeginContact: function (phaserBody, p2Body) {
        if (phaserBody && phaserBody.sprite.name == "head" && this.constraint === null) {
            this.sprite.body.collides([]);
            //Create constraint between the food and the snake head that
            //it collided with. The food is then brought to the center of
            //the head sprite
            this.constraint = this.game.physics.p2.createRevoluteConstraint(
                this.sprite.body, [0, 0], phaserBody, [0, 0]
            );
            this.head = phaserBody.sprite;
            this.head.snake.food.push(this);
            if (this.head.snake.type == 'player') {
                this.head.snake.score++;
            }
        }
    },
    /**
     * Call from main update loop
     */
    update: function () {
        //once the food reaches the center of the snake head, destroy it and
        //increment the size of the snake
        if (this.head && Math.round(this.head.body.x) == Math.round(this.sprite.body.x) &&
            Math.round(this.head.body.y) == Math.round(this.sprite.body.y)) {
            this.head.snake.incrementSize(this.value);
            this.destroy();
        }
    },
    /**
     * Destroy this food and its constraints
     */
    destroy: function () {
        if (this.head) {
            this.game.physics.p2.removeConstraint(this.constraint);
            this.sprite.destroy();
            this.head.snake.food.splice(this.head.snake.food.indexOf(this), 1);
            this.head = null;
        }

        //call this snake's destruction callbacks
        for (var i = 0 ; i < this.onDestroyedCallbacks.length ; i++) {
            if (typeof this.onDestroyedCallbacks[i] == "function") {
                this.onDestroyedCallbacks[i].apply(
                    this.onDestroyedContexts[i], [this]);
            }
        }
    },
    /**
     * Add callback for when snake is destroyed
     * @param  {Function} callback Callback function
     * @param  {Object}   context  context of callback
     */
    addDestroyedCallback: function(callback, context) {
        this.onDestroyedCallbacks.push(callback);
        this.onDestroyedContexts.push(context);
    }
};
