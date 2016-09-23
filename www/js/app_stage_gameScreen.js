(function(global) {
	var AppStateGameScreen = global.AppStateGameScreen = function() {};
    
    EMPTY = 0;
    X = 1;
    O = 2;

    SPOT_POS = [
        {'x': -480, 'y': -390},
        {'x': -180, 'y': -390},
        {'x': 120, 'y': -390},
        {'x': -480, 'y': -90},
        {'x': -180, 'y': -90},
        {'x': 120, 'y': -90},
        {'x': -480, 'y': 210},
        {'x': -180, 'y': 210},
        {'x': 120, 'y': 210}
    ];
    ORIGIN_POS = [
        {'x': false, 'y': false},
        {'x': 1200, 'y': 480},
        {'x': 1200, 'y': -480}      
    ];

    // winning arrangments:
    TOP_ROW = 0;
    MIDDLE_ROW = 1;
    BOTTOM_ROW = 2;
    LEFT_COLUMN = 3;
    MIDDLE_COLUMN = 4;
    RIGHT_COLUMN = 5;
    LEFT_DIAGONAL = 6;
    RIGHT_DIAGONAL = 7;

    SHADING_POS = [
	    {'x': -540, 'y': -450}, // TOP_ROW = 0;
	    {'x': -540, 'y': -150},  // MIDDLE_ROW = 1;
        {'x': -540, 'y': 150},  // BOTTOM_ROW = 2;
	    {'x': -540, 'y': -450}, // LEFT_COLUMN = 3;
        {'x': -240, 'y': -450}, // MIDDLE_COLUMN = 4;
	    {'x': 60, 'y': -450},  // RIGHT_COLUMN = 5;
	    {'x': -540, 'y': -450},	// LEFT_DIAGONAL = 6;
	    {'x': -540, 'y': -450},	// RIGHT_DIAGONAL = 7;
    ];

    SHADING_LIST = [  // i.e. what do we shade based on the win
	    [MIDDLE_ROW, BOTTOM_ROW],      // TOP_ROW = 0;
	    [TOP_ROW, BOTTOM_ROW],         // MIDDLE_ROW = 1;
	    [TOP_ROW, MIDDLE_ROW],         // BOTTOM_ROW = 2;
	    [MIDDLE_COLUMN, RIGHT_COLUMN], // LEFT_COLUMN = 3;
	    [LEFT_COLUMN, RIGHT_COLUMN],   // MIDDLE_COLUMN = 4;
	    [LEFT_COLUMN, MIDDLE_COLUMN],  // RIGHT_COLUMN = 5;
	    [LEFT_DIAGONAL],               // LEFT_DIAGONAL = 6;
	    [RIGHT_DIAGONAL],              // RIGHT_DIAGONAL = 7;
    ];

	    // [0,1,2],  // 0 across top
	    // [3,4,5],  // 1 across middle
	    // [6,7,8],  // 2 across bottom
	    // [0,3,6],  // 3 down left
	    // [1,4,7],  // 4 down middle
	    // [2,5,8],  // 5 down right
	    // [0,4,8],  // 6 left diagonal
	    // [2,4,6]   // 7 right diagonal


    var g = false;  // set in 'create' function
    var t = false;  // set in 'create' function

	AppStateGameScreen.prototype = {
		preload: function () {
			this.load.image('game_screen_background', 'assets/pics/2-game-screen-w-notes.png');
			this.load.image('settings_button', 'assets/pics/gear.png');
			this.load.image('start_button_x', 'assets/pics/start-game-X.png');
			this.load.image('start_button_o', 'assets/pics/start-game-O.png');
			this.load.image('spot_transparancy', 'assets/pics/transparent180x180.png');
			this.load.image('x_image', 'assets/pics/x.png');
			this.load.image('o_image', 'assets/pics/o.png');
			this.load.image('vertical_shader', 'assets/pics/gray-vertical-shader.png');
			this.load.image('horizontal_shader', 'assets/pics/gray-horizontal-shader.png');
			this.load.image('left_diagonal_shader', 'assets/pics/gray-left-diagonal.png');
			this.load.image('right_diagonal_shader', 'assets/pics/gray-right-diagonal.png');
			this.load.image('arrow', 'assets/pics/arrow.png');
		},
		create: function() {
			console.log("in game state");
			// set the g and t variables for file-wide context:
			g = this.game;
    		t = this.game.ttt;
			var background = this.game.add.sprite(-960, -960, 'game_screen_background');
			this.game.responsive.start();
			//
			// board buttons:
			//
			spot0 = this.game.add.sprite(-480, -390, 'spot_transparancy');
			spot1 = this.game.add.sprite(-180, -390, 'spot_transparancy');
			spot2 = this.game.add.sprite(120, -390, 'spot_transparancy');
			spot3 = this.game.add.sprite(-480, -90, 'spot_transparancy');
			spot4 = this.game.add.sprite(-180, -90, 'spot_transparancy');
			spot5 = this.game.add.sprite(120, -90, 'spot_transparancy');
			spot6 = this.game.add.sprite(-480, 210, 'spot_transparancy');
			spot7 = this.game.add.sprite(-180, 210, 'spot_transparancy');
			spot8 = this.game.add.sprite(120, 210, 'spot_transparancy');
			spot0.events.onInputDown.add(touched0, this);
			spot1.events.onInputDown.add(touched1, this);
			spot2.events.onInputDown.add(touched2, this);
			spot3.events.onInputDown.add(touched3, this);
			spot4.events.onInputDown.add(touched4, this);
			spot5.events.onInputDown.add(touched5, this);
			spot6.events.onInputDown.add(touched6, this);
			spot7.events.onInputDown.add(touched7, this);
			spot8.events.onInputDown.add(touched8, this);
    		x_piece = [];
    		o_piece = [];
    		for (i=0; i<5; i++) {
    			x_piece[i] = this.game.add.sprite(ORIGIN_POS[X]['x'], ORIGIN_POS[X]['y'], 'x_image');
    			o_piece[i] = this.game.add.sprite(ORIGIN_POS[O]['x'], ORIGIN_POS[O]['y'], 'o_image');
    		};
    		current_x_piece = 0;
    		current_o_piece = 0;
    		//
    		// shaders to display wins
    		//
    		winShade = [];
    		for (i=0; i<=2; i++) {
    			winShade[i] = this.game.add.sprite(SHADING_POS[i].x, SHADING_POS[i].y, 'horizontal_shader');
    		};
    		for (i=3; i<=5; i++) {
    			winShade[i] = this.game.add.sprite(SHADING_POS[i].x, SHADING_POS[i].y, 'vertical_shader');
    		};
		    winShade[LEFT_DIAGONAL] = this.game.add.sprite(SHADING_POS[LEFT_DIAGONAL].x, SHADING_POS[LEFT_DIAGONAL].y, 'left_diagonal_shader');
		    winShade[RIGHT_DIAGONAL] = this.game.add.sprite(SHADING_POS[RIGHT_DIAGONAL].x, SHADING_POS[RIGHT_DIAGONAL].y, 'right_diagonal_shader');
		    for (i=0; i<=RIGHT_DIAGONAL; i++) {
		    	winShade[i].kill();
		    };
		    //
		    // arrow
		    //
		    arrow = g.add.sprite(360, -360, 'arrow');
    		//
    		// start buttons
			startButtonX = this.game.add.sprite(120, 420, 'start_button_x');
			startButtonO = this.game.add.sprite(440, -420, 'start_button_o')
			startButtonO.angle = 180;
			startButtonX.events.onInputDown.add(startGameX, this);
			startButtonO.events.onInputDown.add(startGameO, this);
            //
            // settings button:
            //
			var settingsButton = this.game.add.sprite(390, -60, 'settings_button');
			settingsButton.inputEnabled = true;
    		settingsButton.events.onInputDown.add(startSettings, this);
    		//
    		// state
    		//
    		lastMove = 0;
    		this.old_game_state = -1;
		},
		update: function() {
			var game_state = t.state;
			if (game_state!=this.old_game_state) {
				//
				// EXIT PREVIOUS STATE
				//
				console.log("game state change detected from "+this.old_game_state+" to "+game_state+".")
				switch (this.old_game_state) {
					case (t.RESTART_GAME):
					    break;
					case (t.WAIT_ON_START):
					    startButtonX.inputEnabled = false;
					    startButtonO.inputEnabled = false;
					    startButtonX.kill();
					    startButtonO.kill();
					    // turn off any shaders:
					    for (i=0; i<=RIGHT_DIAGONAL; i++) {
					    	winShade[i].kill();
					    };
					    //
					    // clear the board:
					    clearBoard();
					    break;
					case (t.WAIT_ON_X):
						killBoard();
					    break;
					case (t.ANIMATE_X):
					    break;
					case (t.WAIT_ON_O):
						killBoard();
					    break;
					case (t.ANIMATE_O):
					    break;
					case (t.PLAY_WINNER_SEQ):
					    break;
					case (t.PLAY_TIE_SEQ):
					    break;
				}
				//
				// ENTER NEW STATE
				//
				switch (game_state) {
					case (t.RESTART_GAME):
					    current_x_piece = 0;
					    current_o_piece = 0;
					    break;
					case (t.WAIT_ON_START):
					    startButtonX.revive(100);
					    startButtonO.revive(100);
					    startButtonX.inputEnabled = true;
					    startButtonO.inputEnabled = true;
					    break;
					case (t.WAIT_ON_X):
						reviveBoard();
					    break;
					case (t.ANIMATE_X):
						var moveDest = {x: SPOT_POS[lastMove]['x'], y: SPOT_POS[lastMove]['y']};
					    piece_animation = this.game.add.tween(x_piece[current_x_piece]).to(moveDest, 2000, Phaser.Easing.Linear.None, true);
						piece_animation.onComplete.add(animationComplete, this);
						current_x_piece++;
					    break;
					case (t.WAIT_ON_O):
						reviveBoard();
					    break;
					case (t.ANIMATE_O):
						var moveDest = {x: SPOT_POS[lastMove]['x'], y: SPOT_POS[lastMove]['y']};
					    piece_animation = this.game.add.tween(o_piece[current_o_piece]).to(moveDest, 2000, Phaser.Easing.Linear.None, true);
						piece_animation.onComplete.add(animationComplete, this);
						current_o_piece++;
					    break;
					case (t.PLAY_WINNER_SEQ):
					    // turn on the shaders to highlight the winning moves.
					    var combo = t.winningCombo
					    if (combo>=0) {
					    	for (i=0; i<SHADING_LIST[combo].length; i++) {
					    		winShade[SHADING_LIST[combo][i]].revive(100);
					    	};
					    };
						t.doneWithAnimation();
					    break;
					case (t.PLAY_TIE_SEQ):
					    break;
				}
			};
			this.old_game_state = game_state;

		},
		// render: function() {

		// }
	};

	function startSettings() {
		this.game.state.start('settings_dialog');
	};

	function startGameX() {
		this.game.ttt.startGame(X);
	};
	function startGameO() {
		this.game.ttt.startGame(O);
	};
	function touched0() {
		if (this.game.ttt.playMove(0)) {
			lastMove = 0;
		};
	};
	function touched1() {
		if (this.game.ttt.playMove(1)) {
			lastMove = 1;
		};
	};
	function touched2() {
		if (this.game.ttt.playMove(2)) {
			lastMove = 2;
		};
	};
	function touched3() {
		if (this.game.ttt.playMove(3)) {
			lastMove = 3;
		};
	};
	function touched4() {
		if (this.game.ttt.playMove(4)) {
			lastMove = 4;
		};
	};
	function touched5() {
		if (this.game.ttt.playMove(5)) {
			lastMove = 5;
		};
	};
	function touched6() {
		if (this.game.ttt.playMove(6)) {
			lastMove = 6;
		};
	};
	function touched7() {
		if (this.game.ttt.playMove(7)) {
			lastMove = 7;
		};
	};
	function touched8() {
		if (this.game.ttt.playMove(8)) {
			lastMove = 8;
		};
	};

	function reviveBoard() {
	    spot0.revive(100);
	    spot0.inputEnabled = true;
	    spot1.revive(100);
	    spot1.inputEnabled = true;
	    spot2.revive(100);
	    spot2.inputEnabled = true;
	    spot3.revive(100);
	    spot3.inputEnabled = true;
	    spot4.revive(100);
	    spot4.inputEnabled = true;
	    spot5.revive(100);
	    spot5.inputEnabled = true;
	    spot6.revive(100);
	    spot6.inputEnabled = true;
	    spot7.revive(100);
	    spot7.inputEnabled = true;
	    spot8.revive(100);
	    spot8.inputEnabled = true;
	};

	function killBoard() {
	    spot0.kill();
	    spot0.inputEnabled = false;
	    spot1.kill();
	    spot1.inputEnabled = false;
	    spot2.kill();
	    spot2.inputEnabled = false;
	    spot3.kill();
	    spot3.inputEnabled = false;
	    spot4.kill();
	    spot4.inputEnabled = false;
	    spot5.kill();
	    spot5.inputEnabled = false;
	    spot6.kill();
	    spot6.inputEnabled = false;
	    spot7.kill();
	    spot7.inputEnabled = false;
	    spot8.kill();
	    spot8.inputEnabled = false;
	};

	function clearBoard() {
		// move all the pieces back
		for (i=0; i<5; i++) {
		    piece_animation = g.add.tween(x_piece[i]).to(ORIGIN_POS[X], 1000, Phaser.Easing.Linear.None, true);
		    piece_animation = g.add.tween(o_piece[i]).to(ORIGIN_POS[O], 1000, Phaser.Easing.Linear.None, true);
		};
		current_x_piece = 0;
		current_o_piece = 0;
	    // turn off any shaders:
	    for (i=0; i<=RIGHT_DIAGONAL; i++) {
	    	winShade[i].kill();
	    };
	}


	function animationComplete() {
		t.doneWithAnimation();
	};


} (this))