/**
 * Mini map of the game - it show the represetation of the game
 *  show position of snake and food
 * @param  {Phaser.Game} game game object
 * @param  {Number} x    coordinate
 * @param  {Number} y    coordinate
 */
Minimap = function (game, x, y, scale) {
    this.game = game;
    this.x = x;
    this.y = y;

    this.scale = scale || 0.2;

    this.cameraBg = this.game.add.graphics(0, 0);
    
    this.cameraBg.beginFill(0xd3d3d3, 0.3);
    this.cameraBg.drawRect(-this.game.width*2, -this.game.height*2, this.game.width*4, this.game.height*4);
    this.cameraBg.endFill();
    this.cameraBg.anchor.setTo(0.5, 0.5);

    this.sprite = this.game.add.graphics(0, 0);
    this.sprite.fixedToCamera = true;
    this.sprite.cameraOffset.setTo(this.x, this.y);

    
    // set a fill and line style
    this.sprite.beginFill(0xd3d3d3, 1);
    this.sprite.drawCircle(0, 0, 200);
    this.sprite.endFill();

    this.map =  this.game.add.group();
    this.map.addMultiple([this.cameraBg]);

    this.container = this.game.add.group();
    this.container.scale.setTo(this.scale);    

    this.container.fixedToCamera = true;
    this.container.cameraOffset.setTo(this.x, this.y);


    this.container.addMultiple([this.map]);
    this.container.mask = this.sprite;
}

Minimap.prototype = {
    update: function () {
        this.map.x = -this.game.camera.view.centerX;
        this.map.y = -this.game.camera.view.centerY;

        if( this.game.player ) {
            this.sneak.miniSprite.x = this.game.player.head.x;
            this.sneak.miniSprite.y = this.game.player.head.y;
        }
    },
    addFood(food) {
        food.miniSprite = this.game.add.sprite(food.x, food.y, 'food');
        this.map.add(food.miniSprite);
    },
    addSneak(sneak) {
        sneak.miniSprite = this.game.add.sprite(sneak.head.x, sneak.head.y, 'circle');
        sneak.miniSprite.tint = 0xff0000;
        sneak.miniSprite.scale.setTo(0.6);
        this.map.add(sneak.miniSprite);
        this.sneak = sneak;
    },
    destroyObject(object) {
        if( object.miniSprite ) {
            this.map.remove(object.miniSprite);
            object.miniSprite.destroy();
        }
    }
}