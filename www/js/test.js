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


var lib = require('./ttt');
var tg = new lib.TTT();

tg.startGame(tg.X);
tg.playMove(4); // x
tg.doneWithAnimation();
tg.playMove(8); // o
tg.doneWithAnimation();
tg.playMove(2); // x
tg.doneWithAnimation();
tg.playMove(6); // o
tg.doneWithAnimation();
tg.playMove(7); // x
tg.doneWithAnimation();
tg.playMove(5); // o
tg.doneWithAnimation();
tg.playMove(0); // x
tg.doneWithAnimation();
tg.playMove(1); // o
tg.doneWithAnimation();
tg.playMove(3); // x

console.log("done with animation result: "+ tg.doneWithAnimation());
tg.showBoard();
console.log(tg);

tg.doneWithAnimation();
