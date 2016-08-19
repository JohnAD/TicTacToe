(function(global) {
	var AppStateSettingsDialog = global.AppStateSettingsDialog = function() {};

	AppStateSettingsDialog.prototype = {
		preload: function () {
			this.load.image('settings_dialog_background', 'assets/pics/3-settings-dialog.png');
			this.load.image('rotate_button', 'assets/pics/rotate.png');
			this.load.image('credits_button', 'assets/pics/credits-button.png');
			this.load.image('close_button', 'assets/pics/close-button.png');
		},
		create: function() {
			console.log("in settings state");
			this.game.responsive.start();
			var background = this.game.add.sprite(-960, -960, 'settings_dialog_background');
			var rotateButton = this.game.add.sprite(-60, -60, 'rotate_button');
			var creditsButton = this.game.add.sprite(180, 0, 'credits_button');
			var closeButton = this.game.add.sprite(180, 360, 'close_button');
			var creditsButtonOpp = this.game.add.sprite(-180, -0, 'credits_button');
			creditsButtonOpp.angle = 180;
			var closeButtonOpp = this.game.add.sprite(-180, -360, 'close_button');
			closeButtonOpp.angle = 180;
			rotateButton.inputEnabled = true;
			rotateButton.events.onInputDown.add(rotateScreen, this);
			creditsButton.inputEnabled = true;
			creditsButton.events.onInputDown.add(startCredits, this);
			creditsButtonOpp.inputEnabled = true;
			creditsButtonOpp.events.onInputDown.add(startCredits, this);
			closeButton.inputEnabled = true;
			closeButton.events.onInputDown.add(startGameState, this);
			closeButtonOpp.inputEnabled = true;
			closeButtonOpp.events.onInputDown.add(startGameState, this);
		},
		// update: function() {

		// },
		// render: function() {

		// }
	};

	function rotateScreen() {
		this.game.responsive.rotateScreen();
	};
	
	function startCredits() {
		this.game.state.start('credits_dialog');
	};
	
	function startGameState() {
		this.game.state.start('game_screen');
	};
} (this))