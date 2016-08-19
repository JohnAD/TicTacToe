var IDEAL_MAX = 1920;
var IDEAL_MIN = 1080;
var IDEAL_STD = 1440;

var IDEAL_MAX_CENTER = IDEAL_MAX / 2 | 0;

var IDEAL_MIN_OFFSET = ((IDEAL_MAX - IDEAL_MIN) / 2) - IDEAL_MAX_CENTER;
var IDEAL_STD_OFFSET = ((IDEAL_MAX - IDEAL_STD) / 2) - IDEAL_MAX_CENTER;
var IDEAL_MAX_OFFSET = 0 - IDEAL_MAX_CENTER;

var LANDSCAPE_WIDE_RATIO = 1777;
var LANDSCAPE_STD_RATIO = 1333;
var SQUARE_RATIO = 1000;
var PORTRAIT_STD_RATIO = 750;
var PORTRAIT_WIDE_RATIO = 562;

var debug = false;

function RP(game){ 
	this.rgame = game;
	this.screen_width = IDEAL_MAX;
	this.screen_height = IDEAL_MIN;
	this.window_width = 0;
	this.window_height = 0;
	this.offset_x = 0;
	this.offset_y = 0;
};

RP.prototype.start = function() {
    this.rgame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.rgame.world.setBounds(-IDEAL_MAX_CENTER, -IDEAL_MAX_CENTER, IDEAL_MAX, IDEAL_MAX);
    this.recalc();
    this.rgame.scale.refresh();
};

RP.prototype.preload = function() {
	this.start()
};

RP.prototype.rotateScreen = function() {
	this.rgame.world.angle += 90;
};

RP.prototype.recalc = function() {
	// this.rgame.world.anchor.setTo(0.5, 0.5);
	var w = window.innerWidth;
	var h = window.innerHeight;
	if ((w!=this.window_width) || (h!=this.window_height)) {
		this.window_height = w;
		this.window_width = h;
		var ar = 1000*(w/h) | 0;
		if (debug) console.log("window aspectRatio", ar);
		// console.log("canvas aspectRatio", this.rgame.scale.aspectRatio);
	    if (ar>=LANDSCAPE_WIDE_RATIO) {
	    	this.screen_width = IDEAL_MAX;
	    	this.screen_height = IDEAL_MIN;
	    	this.offset_x = IDEAL_MAX_OFFSET;
	    	this.offset_y = IDEAL_MIN_OFFSET;
	    	if (debug) console.log("set to landscape wide");
	    } else if (ar>=LANDSCAPE_STD_RATIO) {
	    	this.screen_width = IDEAL_STD;
	    	this.screen_height = IDEAL_MIN;
	    	this.offset_x = IDEAL_STD_OFFSET;
	    	this.offset_y = IDEAL_MIN_OFFSET;
	    	if (debug) console.log("set to landscape std");
	    } else if (ar<PORTRAIT_WIDE_RATIO) {
	    	this.screen_width = IDEAL_MIN;
	    	this.screen_height = IDEAL_MAX;
	    	this.offset_x = IDEAL_MIN_OFFSET;
	    	this.offset_y = IDEAL_MAX_OFFSET;
	    	if (debug) console.log("set to portrait wide");
	    } else if (ar<PORTRAIT_STD_RATIO) {
	    	this.screen_width = IDEAL_MIN;
	    	this.screen_height = IDEAL_STD;
	    	this.offset_x = IDEAL_MIN_OFFSET;
	    	this.offset_y = IDEAL_STD_OFFSET;
	    	if (debug) console.log("set to portrait std");
	    } else {
	    	this.screen_width = IDEAL_MIN;
	    	this.screen_height = IDEAL_MIN;
	    	this.offset_x = IDEAL_MIN_OFFSET;
	    	this.offset_y = IDEAL_MIN_OFFSET;
	    	if (debug) console.log("set to square");
	    };
	    this.rgame.camera.x = this.offset_x;
	    this.rgame.camera.y = this.offset_y;
	    if (debug) console.log("offsets",this.offset_x, this.offset_y);
		this.rgame.scale.setGameSize(this.screen_width, this.screen_height);
	};
};
