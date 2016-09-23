(function (global) {
    function TTT() {
        this.initialize();
    };

    var debug = true;

    TTT.prototype.initialize = function() {
    	this.EMPTY = 0;
    	this.X = 1;
    	this.O = 2;

    	this.EMPTY_BOARD = [0,0,0, 0,0,0, 0,0,0];
    	this.board = this.EMPTY_BOARD;
    	// 
    	// game board layout:
    	// 
    	// +-----------+
    	// |   |   |   |
    	// | 0 | 1 | 2 |
    	// |   |   |   |
    	// +-----------+
    	// |   |   |   |
    	// | 3 | 4 | 5 |
    	// |   |   |   |
    	// +-----------+
    	// |   |   |   |
    	// | 6 | 7 | 8 |
    	// |   |   |   |
    	// +-----------+
    	// 
    	this.RESTART_GAME = 1;
    	this.WAIT_ON_START = 2;
    	this.WAIT_ON_X = 3;
    	this.ANIMATE_X = 4;
    	this.WAIT_ON_O = 5;
    	this.ANIMATE_O = 6;
    	this.PLAY_WINNER_SEQ = 7;
    	this.PLAY_TIE_SEQ = 8;

    	this.state = this.RESTART_GAME;

        this.winner = this.EMPTY;
        this.winningCombo = -1;

        this.start_restartGame();
    };

    TTT.prototype.reset = function() {
		this.start_restartGame();
	};

	// returns:
	// false; no move made
	// true – valid move, continue play
	TTT.prototype.playMove = function(position) {
		if (this.state==this.WAIT_ON_X) {
			return this.waitOnX_playPosition(position);
		};
		if (this.state==this.WAIT_ON_O) {
			return this.waitOnO_playPosition(position);
		};
		return false;
	};

	TTT.prototype.startGame = function(starting_player) {
		if (this.state==this.WAIT_ON_START) {
			if (starting_player == this.X) {
				this.exit_waitOnStart();
				this.start_waitOnX();
				return true;
			};
			if (starting_player == this.O) {
				this.exit_waitOnStart();
				this.start_waitOnO();
				return true;
			};
		};
		return false;
	};

	TTT.prototype.getTurn = function() {
		if (this.state == this.WAIT_ON_X) return this.X;
		if (this.state == this.WAIT_ON_O) return this.O;
		return this.EMPTY;
	};

	TTT.prototype.getState = function() {
		return this.state;
	}

	// returns:
	//  0 – continue play
	//  1 – game ends; X wins
	//  2 – game ends; 0 wins
	//  3 – game ends; tie
	TTT.prototype.doneWithAnimation = function() {
		if (this.state == this.ANIMATE_X) {
			var eog = this.exit_animateX();
			switch (eog) {
			case 0:
				this.start_waitOnO();
				break;
			case 1:
			case 2:
				this.start_playWinnerSeq(eog);
				break;
			case 3:
				this.start_playTieSeq();
				break;
			};
			return eog;
		};
		if (this.state == this.ANIMATE_O) {
			var eog = this.exit_animateO();
			switch (eog) {
			case 0:
				this.start_waitOnX();
				break;
			case 1:
			case 2:
				this.start_playWinnerSeq(eog);
				break;
			case 3:
				this.start_playTieSeq();
				break;
			};
			return eog;
		};
		if (this.state == this.PLAY_WINNER_SEQ) {
			this.exit_playWinnerSeq();
			this.start_restartGame();
			return 0;
		};
		if (this.state == this.PLAY_TIE_SEQ) {
			this.exit_playTieSeq();
			this.start_restartGame();
			return 0;
		};
		return 0;
	}

    //
    // GENERAL FUNCTIONS
    //

	// 
	// game board layout:
	// 
	// +-----------+
	// |   |   |   |
	// | 0 | 1 | 2 |
	// |   |   |   |
	// +-----------+
	// |   |   |   |
	// | 3 | 4 | 5 |
	// |   |   |   |
	// +-----------+
	// |   |   |   |
	// | 6 | 7 | 8 |
	// |   |   |   |
	// +-----------+
	// 
	var WINNING_CONDITIONS = [
	    [0,1,2],  // 0 across top
	    [3,4,5],  // 1 across middle
	    [6,7,8],  // 2 across bottom
	    [0,3,6],  // 3 down left
	    [1,4,7],  // 4 down middle
	    [2,5,8],  // 5 down right
	    [0,4,8],  // 6 left diagonal
	    [2,4,6]   // 7 right diagonal
	];

	// -1 – invalid move; no move made
	//  0 – valid move, continue play
	//  1 – game ends; X wins
	//  2 – game ends; 0 wins
	//  3 – game ends; tie
	TTT.prototype.checkEndOfGame = function() {
        for (var i=0; i<WINNING_CONDITIONS.length; i++) {
            var cond = WINNING_CONDITIONS[i];
            if (this.board[cond[0]]!=this.EMPTY) {
            	if (this.board[cond[0]]==this.board[cond[1]] && this.board[cond[1]]==this.board[cond[2]]) {
            		this.winningCombo = i;
            		if (this.board[cond[0]]==this.X) return this.X;
            		if (this.board[cond[0]]==this.O) return this.O;
            	};
            };
        };
        for (var i=0; i<9; i++) {
        	if (this.board[i]==this.EMPTY) return 0;
        };
        return 3;
	};

    SHOW_BOARD_CHAR = [" ", "X", "O"];
	TTT.prototype.showBoard = function() {
		var s = "";
		for (var i=0; i<9; i+=3) {
			s += i + " " + SHOW_BOARD_CHAR[this.board[i]] + " | ";
			s += (i+1) + " " + SHOW_BOARD_CHAR[this.board[i+1]] + " | ";
			s += (i+2) + " " + SHOW_BOARD_CHAR[this.board[i+2]] + "\n";
			if (i<6) {
				s += "----+-----+----\n";
			};
		};
		console.log(s);
	}
    //
    // GAME STATES
    //

    //
    //  state 1: RESTART_GAME
    //
    TTT.prototype.start_restartGame = function() {
    	if (debug) console.log("start RESTART_GAME");
    	this.state = this.RESTART_GAME;
    	for (i=0; i<9; i++) {
    		this.board[i] = this.EMPTY;
    	};
    	this.winner = this.EMPTY;
    	this.exit_restartGame();
    	this.start_waitOnStart();
    };

    TTT.prototype.exit_restartGame = function() {
    	if (debug) console.log("end RESTART_GAME");
    };

    //
    //  state 2: WAIT_ON_START
    //
    TTT.prototype.start_waitOnStart = function() {
    	if (debug) console.log("start WAIT_ON_START");
    	this.state = this.WAIT_ON_START;
    };

    TTT.prototype.exit_waitOnStart = function() {
    	if (debug) console.log("end WAIT_ON_START");
    };

    //
    //  state 3: WAIT_ON_X
    //
    TTT.prototype.start_waitOnX = function() {
    	if (debug) console.log("start WAIT_ON_X");
    	this.state = this.WAIT_ON_X;
    };
    TTT.prototype.exit_waitOnX = function() {
    	if (debug) console.log("end WAIT_ON_X");
    };

	TTT.prototype.waitOnX_playPosition = function(position) {
		if (this.board[position] != this.EMPTY) {
			return false;
		};
		this.board[position] = this.X;
		this.exit_waitOnX();
		this.start_animateX();
		return true;
	};


    //  state 4: ANIMATE_X
    TTT.prototype.start_animateX = function() {
    	if (debug) console.log("start ANIMATE_X");
    	this.state = this.ANIMATE_X;
    };
    TTT.prototype.exit_animateX = function() {
    	if (debug) console.log("end ANIMATE_X");
    	return this.checkEndOfGame();
    };

    //  state 5: WAIT_ON_O
    TTT.prototype.start_waitOnO = function() {
    	if (debug) console.log("start WAIT_ON_O");
    	this.state = this.WAIT_ON_O;
    };
    TTT.prototype.exit_waitOnO = function() {
    	if (debug) console.log("end WAIT_ON_O");
    };

	TTT.prototype.waitOnO_playPosition = function(position) {
		if (this.board[position] != this.EMPTY) {
			return false;
		};
		this.board[position] = this.O;
		this.exit_waitOnO();
		this.start_animateO();
		return true;
	};

    //  state 6: ANIMATE_O
    TTT.prototype.start_animateO = function() {
    	if (debug) console.log("start ANIMATE_O");
    	this.state = this.ANIMATE_O;
    };
    TTT.prototype.exit_animateO = function() {
    	if (debug) console.log("end ANIMATE_O");
 	  	return this.checkEndOfGame();
     };

    //  state 7: PLAY_WINNER_SEQ
    TTT.prototype.start_playWinnerSeq = function(winning_player) {
    	if (debug) console.log("start PLAY_WINNER_SEQ");
    	this.state = this.PLAY_WINNER_SEQ;
    	this.winner = winning_player;
    };
    TTT.prototype.exit_playWinnerSeq = function() {
    	if (debug) console.log("end PLAY_WINNER_SEQ");
    };

    //  state 8: PLAY_TIE_SEQ
    TTT.prototype.start_playTieSeq = function() {
    	if (debug) console.log("start PLAY_TIE_SEQ");
    	this.state = this.PLAY_TIE_SEQ;
    };
    TTT.prototype.exit_playTieSeq = function() {
    	if (debug) console.log("end PLAY_TIE_SEQ");
    };

    global.TTT = TTT; 
}) (this);

if (typeof module !== 'undefined' && module.exports) {
    module.exports.TTT = this.TTT;
};
