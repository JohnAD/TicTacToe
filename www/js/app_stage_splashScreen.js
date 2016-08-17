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
		},
		// update: function() {

		// },
		// render: function() {

		// }
	}
} (this))