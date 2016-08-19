(function(global) {
	var AppStateCreditsDialog = global.AppStateCreditsDialog = function() {};

	AppStateCreditsDialog.prototype = {
		preload: function () {
			this.load.image('credits_dialog_background', 'assets/pics/4-credits-dialog.png');
		},
		create: function() {
			console.log("in credits state");
			this.game.responsive.start();
			var background = this.game.add.sprite(-960, -960, 'credits_dialog_background');
			var closeButton = this.game.add.sprite(240, 480, 'close_button');
			var closeButtonOpp = this.game.add.sprite(-240, -480, 'close_button');
			closeButtonOpp.angle = 180;
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

	function startGameState() {
		this.game.state.start('game_screen');
	};
} (this))