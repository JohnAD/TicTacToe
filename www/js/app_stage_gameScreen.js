(function(global) {
	var AppStateGameScreen = global.AppStateGameScreen = function() {};

	AppStateGameScreen.prototype = {
		preload: function () {
			this.load.image('game_screen_background', 'assets/pics/2-game-screen-w-notes.png');
			this.load.image('settings_button', 'assets/pics/gear.png')
		},
		create: function() {
			console.log("in game state");
			var background = this.game.add.sprite(-960, -960, 'game_screen_background');
			var settingsButton = this.game.add.sprite(390, -60, 'settings_button');
			this.game.responsive.start();
			settingsButton.inputEnabled = true;
    		settingsButton.events.onInputDown.add(startSettings, this);
		},
		// update: function() {

		// },
		// render: function() {

		// }
	};

	function startSettings() {
		this.game.state.start('settings_dialog');
	};
} (this))