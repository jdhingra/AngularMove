// VERSION: 1.0 LAST UPDATE: 24.11.2010
// VERSION: 1.1 LAST UPDATE: 03.12.2010
// VERSION: 1.2 LAST UPDATE: 06.12.2010
/*
 * This is free script but leave this comment if
 * you want use this code on your site
 * 
 * Made by Jayant Dhingra, jdhingra@xebia.com, India.
 * http://xebee.xebia.in/wp-content/uploads/2010/12/jquery.angularMove.1.2.js
 * GIT Repo: https://github.com/jdhingra/AngularMove
 */
/*
Description:

This is a jquery plugin which rotates image and moves linearly with animation effects directly from client side. 

Notices:

Include script after including main jQuery and jQueryRotate.js. Whole plugin uses jQuery
namespace and should be compatible with older version (unchecked). 

Usage:
$("#image").angularMove(parameters)

Returns:

jQueryAngularMoveElement - !!! NOTICE !!! function return angularMoveElement
instance to help connect events with actually created 'rotation' element.

Parameters:
	({
		angleRotation: angleRotationValue,
		move: moveValue,
		duration: speedValue,
		keepGoing: keepGoingValue,
		easing: easingValue
	})
	jQuery(imgElement).angularMove
	 

Where:
- angleRotationValue: clockwise rotation given in degrees (between -360 and 360, angle given more than 360 leads to only rotation but not linear motion),
- moveValue(boolean): boolean value for linear motion,
- speedValue: A string or number determining duration of the animation,
- keepGoingValue(boolean): boolean value for same animation effects to go infinitely,
- easingValue: A string indicating which easing function to use for the transition

Examples:
	1. Animation effects to go infinitely
		$(document).ready(function()
		{
			$("#image").angularMove({
					angleRotation: -60,
					move: true,
					duration: 100,
					keepGoing: true,
					easing: 'linear'
			});			
		});
		
	2. Animation effects to go until duration as specified in parameter
		$(document).ready(function()
		{
			$("#image").angularMove({
					angleRotation: -60,
					move: true,
					duration: 4000,
					keepGoing: false,
					easing: 'linear'
			});			
		});
*/

(function($) {

    $.angularMove = function(el, options) {
        var base = this;
        base.$el = $(el);
        base.$el.data("angularMove", base);
	var isKeyPressed = false;
	var imgId = '#'+el.id;
	var pos = $(imgId).offset();
	var topMovement = "";
	var leftMovement = "";
	var SPEED_FAST = 100;

	var angleRotation;
	var duration;
	var move;
	var easing;
		
	$(document).bind("contextmenu",function(e){
		return false;
	});

	base.key = function(e) {
		isKeyPressed = true;
		var rightRotation = 0, leftRotation = 0, leftMovement = 0;
		var keyCode = e.keyCode || e.which, arrow = {i: 73, j: 74, l: 76};
		var pos = $(imgId).offset();
		switch (keyCode) {
		case arrow.j:
		// left
			leftRotation -=10;
			angleRotation = angleRotation + leftRotation + rightRotation;
			$(imgId).rotateAnimation(angleRotation);
			break;
		case arrow.i:
		//up
			if(angleRotation==0 || angleRotation==360){
				var up="-=20px";
				$(imgId).animate({"top": up}, base.options.duration);
			} else {
				var coords = base.calculateCoord(angleRotation, true);
				topMovement = coords.topMovement;
				leftMovement = coords.leftMovement;
			}
			$(imgId).animate({"top": topMovement, "left": leftMovement}, base.options.easing); 
			break;
		case arrow.l:
		//right
			rightRotation +=10;
			angleRotation = angleRotation + leftRotation + rightRotation;
			$(imgId).rotateAnimation(angleRotation);
			break;
		}
	};

	base.calculateCoord = function(angleRotation, movable){
		var POSITIVE = "+", NEGATIVE = "-", xQuad = "", yQuad = "";
		var factor = 10;
		if(angleRotation>360){
			angleRotation %= 360;
		}
		if(angleRotation==0 || angleRotation==360 || angleRotation==-360){
			leftMovement = "+=0px";
			topMovement = "-=10px";
		}else if(angleRotation==90 || angleRotation==-270){
			leftMovement = "+=10px";
			topMovement = "+=0px";
		}else if(angleRotation==180 || angleRotation==-180){
			leftMovement = "+=0px";
			topMovement = "+=10px";
		}else if(angleRotation==270 || angleRotation==-90){
			leftMovement = "-=10px";
			topMovement = "+=0px";
		}else{
			if((angleRotation>0 && angleRotation<90) || (angleRotation<-270 && angleRotation>-360)){
				xQuad = POSITIVE;
				yQuad = NEGATIVE;
			}
			if((angleRotation>90 && angleRotation<180) || (angleRotation<-180 && angleRotation>-270)){
				xQuad = POSITIVE;
				yQuad = NEGATIVE;
			}
			if((angleRotation>180 && angleRotation<270) || (angleRotation<-90 && angleRotation>-180)){
				xQuad = POSITIVE;
				yQuad = NEGATIVE;
			}
			if((angleRotation>270 && angleRotation<360) || (angleRotation>-90 && angleRotation<0)){
				xQuad = POSITIVE;
				yQuad = NEGATIVE;
			}
			leftMovement = xQuad + "=" + factor*Math.round(100*Math.sin(angleRotation * (Math.PI/180)))/100 + "px";
			if(movable){
				topMovement = yQuad + "=" + factor*Math.round(100*Math.cos(angleRotation * (Math.PI/180)))/100 + "px";
			} else{
				topMovement = pos.top;
			}
		}
		var arrCoords = {topMovement: topMovement, leftMovement: leftMovement};
		return arrCoords;
	};
		
        base.runAnimation = function() {
		leftMovement = pos.left;
		topMovement = pos.top;

		if(move == null || typeof(move) != "string") {
			move = true;
		}
		if(duration == null || typeof(duration) != "number") {
			duration = SPEED_FAST;
		}
		if(easing == null || typeof(easing) != "string") {
			easing = '';
		}
		if(typeof(angleRotation) == "number" && angleRotation != null ){
			$(imgId).rotateAnimation(angleRotation);
		}
		var coords = base.calculateCoord(angleRotation, move);
		topMovement = coords.topMovement;
		leftMovement = coords.leftMovement;
		if(move){
			if(!base.options.keepGoing){
				$(imgId).animate({"top": topMovement, "left": leftMovement}, duration, easing);
			} else{
				$(imgId).animate({"top": [topMovement, easing], "left": [leftMovement, easing]}, duration, easing, function() {
					if (base.options.keepGoing){
						base.runAnimation();
					}
				});
			}
		}
        };
        		
        base.init = function(){
		base.options = $.extend({}, $.angularMove.defaultOptions, options);

		angleRotation = base.options.angleRotation;
		duration = base.options.duration;
		move = base.options.move;
		easing = base.options.easing;

		$(document).keydown(function (e) {
			isKeyPressed = true;
			base.key(e);
		});
		base.runAnimation();
	};

	base.init();
    };
	
    $.angularMove.defaultOptions = {
        duration: "fast",
        keepGoing: true
    };
	
    $.fn.angularMove = function(options) {
		return this.each(function() {
			(new $.angularMove(this, options));
		});
    };
})(jQuery);