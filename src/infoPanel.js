/**
 * info panel of the game - it show the player info
 * show score and max score
 * @param  {Phaser.Game} game game object
 * @param  {Number} x    coordinate
 * @param  {Number} y    coordinate
 */
InfoPanel = function (game, x, y) {
    this.game = game;
    this.x = x || 0;
    this.y = y || 0;

    this.maxScore = localStorage.getItem('maxScore') || 0;

    this.bg = this.game.add.graphics(0, 0);
    
    this.bg.beginFill(0xd3d3d3, 0);
    this.bg.drawRect( 0, 0, 100, 30);
    this.bg.endFill();

    var style = { font: "bold 32px Arial", fontSize: 11, fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    this.scoreLabel = this.game.add.text(20, 20, "Your length: ", style);
    this.maxScoreLabel = this.game.add.text(20, 34, "Max length: " + this.maxScore, style);

    this.container = this.game.add.group(); 

    this.container.fixedToCamera = true;
    this.container.cameraOffset.setTo(this.x, this.y);


    this.container.addMultiple([this.bg, this.scoreLabel, this.maxScoreLabel]);
}

InfoPanel.prototype = {
    update: function () {
        this.scoreLabel.setText("Your length: " + this.game.player.getScore());
    },
    
}