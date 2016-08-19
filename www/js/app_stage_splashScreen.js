(function(global) {
	var AppStateSplashScreen = global.AppStateSplashScreen = function() {};

	AppStateSplashScreen.prototype = {
		preload: function () {
        	this.load.image('splash_screen_background', 'assets/pics/1-splash-screen.png')
			this.game.responsive.preload();
		},
		create: function() {
			var background = this.game.add.sprite(-960, -960, 'splash_screen_background');
			this.game.responsive.start();
			delayTimer = this.game.time.create(false);
			delayTimer.loop(2000, startGameState, this);
			delayTimer.start();
			console.log("starting timer");
		},
		// update: function() {

		// },
		// render: function() {

		// }
	};

	function startGameState() {
		this.game.state.start('game_screen');
	};
} (this))