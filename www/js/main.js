(function(global) {
	var game = new Phaser.Game(1920, 1920, Phaser.AUTO, 'body');
	game.responsive = new RP(game);
	game.ttt = new TTT();

	game.state.add('splash_screen', AppStateSplashScreen);
	game.state.add('game_screen', AppStateGameScreen);
	game.state.add('settings_dialog', AppStateSettingsDialog);
	game.state.add('credits_dialog', AppStateCreditsDialog);

	game.state.start('splash_screen');

} (this))